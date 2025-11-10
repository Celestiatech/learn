import Link from 'next/link'
import Image from 'next/image'
import { GetServerSideProps } from 'next'
import { getSession, useSession, signOut } from 'next-auth/react'
import Seo from '../components/Seo'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import { useEffect, useState } from 'react'
import { listJourneyCourses } from '../content/tracks/journey'
import { journeyProgressStorageKey } from '../lib/journeyProgress'

interface ProfileProps {
  joinedAt?: string | null
}

type JourneyProgress = Record<
  string,
  {
    completed: Record<string, true>
  }
>

type AggregatedProgress = {
  totalCourses: number
  totalChapters: number
  totalTasks: number
  completedTasks: number
  percentComplete: number
  detailed: Array<{
    courseId: string
    courseTitle: string
    totalTasks: number
    completedTasks: number
    percentComplete: number
  }>
}

function summarizeProgress(): AggregatedProgress {
  const courses = listJourneyCourses()
  const totalCourses = courses.length
  const totalChapters = courses.reduce((sum, course) => sum + course.chapters.length, 0)
  const totalTasks = courses.reduce(
    (sum, course) => sum + course.chapters.reduce((chapterSum, chapter) => chapterSum + chapter.tasks.length, 0),
    0
  )

  if (typeof window === 'undefined') {
    return {
      totalCourses,
      totalChapters,
      totalTasks,
      completedTasks: 0,
      percentComplete: 0,
      detailed: [],
    }
  }

  let parsedProgress: JourneyProgress | null = null
  try {
    const stored = window.localStorage.getItem(journeyProgressStorageKey)
    parsedProgress = stored ? (JSON.parse(stored) as JourneyProgress) : null
  } catch (error) {
    console.warn('Failed to parse journey progress', error)
  }

  let completedTasks = 0
  const detailed: AggregatedProgress['detailed'] = []

  courses.forEach((course) => {
    const courseCompletedIds = Object.keys(parsedProgress?.[course.id]?.completed ?? {})
    completedTasks += courseCompletedIds.length
    const courseTaskTotal = course.chapters.reduce((sum, chapter) => sum + chapter.tasks.length, 0)
    const percent = courseTaskTotal === 0 ? 0 : Math.round((courseCompletedIds.length / courseTaskTotal) * 100)
    detailed.push({
      courseId: course.id,
      courseTitle: course.title,
      totalTasks: courseTaskTotal,
      completedTasks: courseCompletedIds.length,
      percentComplete: percent,
    })
  })

  const percentComplete = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

  return {
    totalCourses,
    totalChapters,
    totalTasks,
    completedTasks,
    percentComplete,
    detailed,
  }
}

export default function Profile({ joinedAt }: ProfileProps) {
  const { data: session, update } = useSession()
  const user = session?.user
  const [progressSummary, setProgressSummary] = useState<AggregatedProgress>(() => summarizeProgress())
  const [profileDisplay, setProfileDisplay] = useState({ name: '', level: 'Bronze', image: '' })
  const [profileForm, setProfileForm] = useState({ name: '', level: 'Bronze', image: '' })
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    const handleStorageUpdate = () => {
      setProgressSummary(summarizeProgress())
    }

    handleStorageUpdate()
    window.addEventListener('storage', handleStorageUpdate)
    return () => window.removeEventListener('storage', handleStorageUpdate)
  }, [])

  useEffect(() => {
    const currentName = session?.user?.name ?? ''
    const currentLevel = session?.user?.level ?? 'Bronze'
    const currentImage = session?.user?.image ?? ''
    setProfileDisplay({ name: currentName, level: currentLevel, image: currentImage })
    setProfileForm({ name: currentName, level: currentLevel, image: currentImage })
  }, [session?.user?.name, session?.user?.level, session?.user?.image])

  const handleProfileChange = (field: 'name' | 'level' | 'image') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setProfileForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleProfileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSavingProfile(true)
    setProfileMessage(null)

    const payload: Record<string, string> = {}
    const trimmedName = profileForm.name.trim()
    const trimmedLevel = profileForm.level.trim()
    const trimmedImage = profileForm.image.trim()

    if (trimmedName !== profileDisplay.name.trim()) payload.name = trimmedName
    if (trimmedLevel && trimmedLevel !== profileDisplay.level.trim()) payload.level = trimmedLevel
    if (trimmedImage !== profileDisplay.image.trim()) payload.image = trimmedImage

    if (!Object.keys(payload).length) {
      setProfileMessage({ type: 'error', text: 'No changes to update.' })
      setSavingProfile(false)
      return
    }

    try {
      const response = await fetch('/api/profile/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body?.error || 'Failed to update profile')
      }

      const data = await response.json()
      const updatedUser = data.user as { name?: string | null; level?: string | null; image?: string | null }

      setProfileDisplay({
        name: updatedUser.name ?? '',
        level: updatedUser.level ?? 'Bronze',
        image: updatedUser.image ?? '',
      })
      setProfileForm({
        name: updatedUser.name ?? '',
        level: updatedUser.level ?? 'Bronze',
        image: updatedUser.image ?? '',
      })

      if (typeof update === 'function') {
        await update({
          name: updatedUser.name ?? undefined,
          image: updatedUser.image ?? undefined,
          level: updatedUser.level ?? undefined,
        })
      }

      setProfileMessage({ type: 'success', text: 'Profile updated.' })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update profile.'
      setProfileMessage({ type: 'error', text: message })
    } finally {
      setSavingProfile(false)
    }
  }

  const displayName = profileDisplay.name || user?.name || user?.email || 'Learner'
  const displayLevel = profileDisplay.level || user?.level || 'Bronze'
  const displayAvatar = profileDisplay.image || user?.image || ''

  return (
    <>
      <Seo title="Profile" description="Manage your SimplyCode account and track progress." noindex />
      <div className="min-h-screen bg-[var(--color-page-bg)] text-[var(--color-text-primary)]">
        <SiteHeader />
        <main className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16 sm:px-10 md:flex-row lg:px-16">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-soft bg-surface-card px-4 py-2 text-xs font-semibold tracking-[0.16em] text-secondary transition hover:border-strong hover:text-[var(--color-accent-primary)]"
            >
              ← Back to home
            </Link>
          </div>
          <section className="w-full space-y-6 rounded-3xl border border-soft bg-surface-card p-8 shadow-soft md:w-80">
            <div className="flex flex-col items-center space-y-5 text-center">
              <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-soft bg-surface-muted">
                {displayAvatar ? (
                  <Image src={displayAvatar} alt={displayName} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-500/20 to-sky-500/20 text-3xl font-semibold uppercase text-[var(--color-success-text)]">
                    {displayName[0] ?? 'S'}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-heading">{displayName}</h1>
                <p className="text-sm text-secondary">{user?.email}</p>
              </div>
              <div className="profile-status-badge flex items-center gap-2 rounded-full border border-soft bg-surface-muted px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
                <span className="h-2 w-2 rounded-full bg-[var(--color-success)]" />
                {displayLevel}
              </div>
            </div>
            <div className="space-y-3 text-sm text-secondary">
              <p>
                <span className="text-secondary">XP:</span>{' '}
                <span className="font-semibold text-heading">{progressSummary.completedTasks * 25}</span>
              </p>
              <p>
                <span className="text-secondary">Tasks completed:</span>{' '}
                <span className="font-semibold text-heading">
                  {progressSummary.completedTasks} / {progressSummary.totalTasks}
                </span>
              </p>
              {joinedAt ? (
                <p>
                  <span className="text-secondary">Member since:</span>{' '}
                  <span className="font-semibold text-heading">{joinedAt}</span>
                </p>
              ) : null}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full rounded-full border border-soft bg-surface-card px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-heading transition hover:border-strong hover:text-[var(--color-accent-primary)]"
            >
              Sign out
            </button>
            <form className="space-y-4 pt-2" onSubmit={handleProfileSubmit}>
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-[0.26em] text-secondary">Display name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={handleProfileChange('name')}
                  maxLength={80}
                  className="w-full rounded-xl border border-soft bg-surface-card px-3 py-2 text-sm text-heading placeholder:text-secondary/60 focus:border-strong focus:outline-none"
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-[0.26em] text-secondary">Level</label>
                <input
                  type="text"
                  value={profileForm.level}
                  onChange={handleProfileChange('level')}
                  maxLength={40}
                  className="w-full rounded-xl border border-soft bg-surface-card px-3 py-2 text-sm text-heading placeholder:text-secondary/60 focus:border-strong focus:outline-none"
                  placeholder="Bronze, Silver, ..."
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-[0.26em] text-secondary">Avatar URL</label>
                <input
                  type="url"
                  value={profileForm.image}
                  onChange={handleProfileChange('image')}
                  className="w-full rounded-xl border border-soft bg-surface-card px-3 py-2 text-sm text-heading placeholder:text-secondary/60 focus:border-strong focus:outline-none"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              {profileMessage ? (
                <p
                  className={`text-xs ${
                    profileMessage.type === 'success' ? 'text-[var(--color-success-text)]' : 'text-[var(--color-error)]'
                  }`}
                >
                  {profileMessage.text}
                </p>
              ) : null}
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="rounded-full border border-soft bg-surface-card px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-heading transition hover:border-strong hover:text-[var(--color-accent-primary)] disabled:pointer-events-none disabled:opacity-50"
                >
                  {savingProfile ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </form>
          </section>

          <section className="flex-1 space-y-10 rounded-3xl border border-soft bg-surface-card p-8 shadow-soft">
            <header className="space-y-2">
              <h2 className="text-2xl font-semibold text-heading">Learning overview</h2>
              <p className="text-sm text-secondary">
                Track your progress, resume lessons, and manage your SimplyCode account from here.
              </p>
            </header>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3 rounded-2xl border border-soft bg-surface-highlight p-6">
                <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-secondary">Progress</h3>
                <p className="text-4xl font-bold text-heading">{progressSummary.percentComplete}%</p>
                <p className="text-sm text-secondary">
                  {progressSummary.completedTasks} of {progressSummary.totalTasks} tasks complete
                </p>
                <Link
                  href="/lessons/intro"
                  className="inline-flex w-max items-center gap-2 rounded-full border border-soft bg-surface-card px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-secondary transition hover:border-strong hover:text-[var(--color-accent-primary)]"
                >
                  Resume learning
                </Link>
              </div>

              <div className="space-y-3 rounded-2xl border border-soft bg-surface-highlight p-6">
                <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-secondary">Account</h3>
                <div className="space-y-2 text-sm text-secondary">
                  <p>
                    <span className="text-secondary">Email:</span> {user?.email ?? '—'}
                  </p>
                  <p>
                    <span className="text-secondary">Level:</span> {displayLevel}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/auth/forgot-password"
                    className="inline-flex w-max items-center gap-2 rounded-full border border-soft bg-surface-card px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-secondary transition hover:border-strong hover:text-[var(--color-accent-primary)]"
                  >
                    Reset password
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="inline-flex w-max items-center gap-2 rounded-full border border-soft bg-surface-card px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-heading transition hover:border-strong hover:text-[var(--color-accent-primary)]"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-soft bg-surface-highlight p-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-secondary">Journeys</h3>
              <div className="space-y-3">
                {progressSummary.detailed.length ? (
                  progressSummary.detailed.map((course) => (
                    <div
                      key={course.courseId}
                      className="flex items-center justify-between rounded-xl border border-soft bg-surface-card px-4 py-3 text-sm text-secondary"
                    >
                      <div>
                        <p className="font-semibold text-heading">{course.courseTitle}</p>
                        <p className="text-xs">
                          {course.completedTasks} / {course.totalTasks} tasks • {course.percentComplete}%
                        </p>
                      </div>
                      <Link
                        href={`/courses/${course.courseId}`}
                        className="rounded-full border border-soft bg-surface-card px-3 py-1 text-xs font-semibold tracking-[0.16em] text-secondary transition hover:border-strong hover:text-[var(--color-accent-primary)]"
                      >
                        View course
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-secondary">No progress yet. Start a course to see your stats here.</p>
                )}
              </div>
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<ProfileProps> = async (context) => {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: `/auth/signin?callbackUrl=${encodeURIComponent(context.resolvedUrl)}`,
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
      joinedAt: session.user?.createdAt ?? null,
    },
  }
}

