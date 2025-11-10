import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon } from '@radix-ui/react-icons'
import { isCompleted, markCompleted } from '../lib/progress'
import { getPrevLesson, getNextLesson } from '../lib/tracks'
import { useCelebration } from './Celebration'

interface LessonControlsProps {
  trackId: string | null
  slug: string
  nextSlug?: string | null
  totalLessons?: number
}

export default function LessonControls({ trackId, slug, nextSlug }: LessonControlsProps) {
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { triggerCelebration, CelebrationComponent } = useCelebration()

  // Get navigation info
  const prevSlug = trackId ? getPrevLesson(trackId, slug) : null

  useEffect(() => {
    if (trackId) setDone(isCompleted(trackId, slug))
  }, [trackId, slug])

  async function handleMark() {
    if (!trackId) return
    setLoading(true)
    setError(null)

    try {
      // Mark completed locally first for instant feedback
      markCompleted(trackId, slug)
      setDone(true)
      triggerCelebration('lesson', 'Lesson complete', 'Keep the momentum going!')

      // Try to persist to server
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track: trackId, lesson: slug }),
      })

      if (!res.ok) {
        if (res.status === 401) {
          setError('Sign in to sync this completion across devices. Local progress is saved.')
        } else {
          throw new Error('Failed to save progress')
        }
      }

      // Auto-advance after a short delay
      if (nextSlug) {
        setTimeout(() => {
          router.push(`/lessons/${nextSlug}`)
        }, 600)
      }
    } catch (e) {
      console.error('Error saving progress:', e)
      if (!error) {
        setError('Failed to save progress. Your progress is saved locally but may not sync across devices.')
      }
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
    <div className="mt-10 rounded-3xl border border-soft bg-surface-card p-6 text-heading shadow-[0_32px_90px_-55px_rgba(var(--primary--700-rgb),0.22)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          {prevSlug ? (
            <Link
              href={`/lessons/${prevSlug}`}
              className="inline-flex items-center gap-2 rounded-full border border-soft bg-surface-card px-4 py-2 text-sm font-medium text-heading transition hover:border-strong hover:text-[var(--color-accent-primary)]"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Previous lesson
            </Link>
          ) : null}
        </div>

        <div className="flex flex-1 justify-center">
          {!done ? (
            <button
              className={`inline-flex items-center gap-2 rounded-full bg-[var(--gradient-success)] px-6 py-2 text-sm font-semibold text-white shadow-[var(--shadow-success)] transition ${
                loading ? 'opacity-50' : 'hover:shadow-[0_26px_60px_-28px_rgba(var(--peridot--600-rgb),0.6)]'
              }`}
              onClick={handleMark}
              disabled={loading}
            >
              {loading ? <span className="inline-block animate-spin">⋯</span> : <CheckIcon className="h-4 w-4" />}
              Mark complete
            </button>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(var(--peridot--600-rgb),0.4)] bg-[var(--surface-success)] px-4 py-2 text-sm font-semibold text-[var(--color-success-text)]">
              <CheckIcon className="h-4 w-4" />
              Completed
            </span>
          )}
        </div>

        <div className="flex flex-1 justify-end">
          {nextSlug ? (
            <Link
              href={`/lessons/${nextSlug}`}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                done
                  ? 'bg-[var(--gradient-brand-alt)] text-white shadow-[0_24px_60px_-32px_rgba(var(--primary--800-rgb),0.55)] hover:shadow-[0_28px_70px_-30px_rgba(var(--primary--800-rgb),0.62)]'
                  : 'border border-soft bg-surface-card text-heading hover:border-strong hover:text-[var(--color-accent-primary)]'
              }`}
            >
              Next lesson
              <ChevronRightIcon className="h-4 w-4" />
            </Link>
          ) : (
            <span className="rounded-full border border-disabled bg-disabled px-4 py-2 text-xs font-semibold tracking-[0.14em] text-muted">
              Last lesson
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-2xl border border-[rgba(var(--danger--600-rgb),0.35)] bg-[rgba(var(--danger--600-rgb),0.08)] px-4 py-3 text-center text-sm text-[rgba(var(--danger--600-rgb),0.95)]">
          {error}
        </div>
      )}
    </div>
    {CelebrationComponent}
    </>
  )
}
