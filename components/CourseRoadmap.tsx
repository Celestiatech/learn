import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { getJourneyCourse, listJourneyCourses, type JourneyCourse, type JourneyTask } from '../content/tracks/journey'
import {
  computeTaskStatus,
  findChapterAndTaskIndices,
  findNextTask,
  journeyProgressStorageKey,
} from '../lib/journeyProgress'
import TaskWorkspace from './TaskWorkspace'
import { useCelebration } from './Celebration'

type JourneyProgress = Record<
  string,
  {
    completed: Record<string, true>
  }
>

type CourseRoadmapProps = {
  initialCourseId?: string
  singleCourse?: boolean
}

export default function CourseRoadmap({ initialCourseId, singleCourse = false }: CourseRoadmapProps = {}) {
  const courses = useMemo(() => listJourneyCourses(), [])
  const resolvedInitialId = useMemo(() => {
    if (!courses.length) {
      return ''
    }
    if (!initialCourseId) {
      return courses[0]?.id ?? ''
    }
    const matched = courses.find((course) => course.id === initialCourseId)
    return matched?.id ?? courses[0]?.id ?? ''
  }, [courses, initialCourseId])

  const [activeCourseId, setActiveCourseId] = useState(resolvedInitialId)
  const [activeChapterIndex, setActiveChapterIndex] = useState(0)
  const [activeTaskIndex, setActiveTaskIndex] = useState(0)
  const [progress, setProgress] = useState<JourneyProgress>({})
  const [ready, setReady] = useState(false)
  const { CelebrationComponent, triggerCelebration } = useCelebration()

  useEffect(() => {
    setActiveCourseId(resolvedInitialId)
    setActiveChapterIndex(0)
    setActiveTaskIndex(0)
  }, [resolvedInitialId])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = window.localStorage.getItem(journeyProgressStorageKey)
      if (stored) {
        setProgress(JSON.parse(stored))
      }
    } catch (error) {
      console.warn('Failed to load journey progress', error)
    } finally {
      setReady(true)
    }
  }, [])

  useEffect(() => {
    if (!ready || typeof window === 'undefined') return
    try {
      window.localStorage.setItem(journeyProgressStorageKey, JSON.stringify(progress))
    } catch (error) {
      console.warn('Failed to persist journey progress', error)
    }
  }, [progress, ready])

  const activeCourse = useMemo(() => getJourneyCourse(activeCourseId) ?? courses[0], [activeCourseId, courses])
  const orderedTasks = useMemo(() => activeCourse?.chapters.flatMap((chapter) => chapter.tasks) ?? [], [activeCourse])
  const activeChapter = activeCourse?.chapters[activeChapterIndex] ?? activeCourse?.chapters[0]
  const activeTask = activeChapter?.tasks[activeTaskIndex] ?? activeChapter?.tasks[0]

  const completedIds = useMemo(() => {
    const courseProgress = progress[activeCourse?.id ?? '']
    return new Set(Object.keys(courseProgress?.completed ?? {}))
  }, [activeCourse?.id, progress])

  const courseStats = useMemo(() => {
    const total = orderedTasks.length
    const completed = completedIds.size
    const remaining = total - completed
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100)
    return { total, completed, remaining, percent }
  }, [completedIds.size, orderedTasks.length])

  useEffect(() => {
    if (!activeCourse) return
    const chapter = activeCourse.chapters[activeChapterIndex]
    if (!chapter) {
      setActiveChapterIndex(0)
      setActiveTaskIndex(0)
      return
    }
    if (!chapter.tasks[activeTaskIndex]) {
      setActiveTaskIndex(0)
    }
  }, [activeChapterIndex, activeCourse, activeTaskIndex])

  if (!activeCourse || !activeChapter || !activeTask) {
    return null
  }

  const handleSelectCourse = (courseId: string) => {
    if (singleCourse) return
    setActiveCourseId(courseId)
    setActiveChapterIndex(0)
    setActiveTaskIndex(0)
  }

  const handleSelectChapter = (index: number) => {
    setActiveChapterIndex(index)
    setActiveTaskIndex(0)
  }

  const handleSelectTask = (index: number) => {
    const task = activeChapter.tasks[index]
    if (!task) return
    const status = computeTaskStatus(task, completedIds, orderedTasks)
    if (status === 'locked') return
    setActiveTaskIndex(index)
  }

  const handleCompleteTask = (task: JourneyTask) => {
    setProgress((prev) => {
      const courseEntry = prev[activeCourse.id] ?? { completed: {} as Record<string, true> }
      if (courseEntry.completed[task.id]) {
          return prev
        }
      const updatedCourseEntry = {
        ...courseEntry,
        completed: {
          ...courseEntry.completed,
          [task.id]: true as const,
        },
      }
      return {
        ...prev,
        [activeCourse.id]: updatedCourseEntry,
      }
    })

    triggerCelebration('lesson', `Completed Task ${task.order}`, 'Celebrate your progress and continue the journey!')

    const nextTask = findNextTask(task, orderedTasks, new Set([...completedIds, task.id]))
    if (!nextTask) return
    const indices = findChapterAndTaskIndices(activeCourse, nextTask.id)
    if (!indices) return
    setActiveChapterIndex(indices.chapterIndex)
    setActiveTaskIndex(indices.taskIndex)
  }

  const renderCourseCard = (course: JourneyCourse) => {
    const courseProgress = progress[course.id]?.completed ?? {}
    const totalTasks = course.chapters.reduce((sum, chapter) => sum + chapter.tasks.length, 0)
    const completedTasks = Object.keys(courseProgress).length
    const percent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)
    const isActive = course.id === activeCourse.id

            return (
              <button
        key={course.id}
        onClick={() => handleSelectCourse(course.id)}
        className={`w-full rounded-2xl border px-5 py-4 text-left transition shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent-primary)] ${
          isActive
            ? 'border-strong bg-surface-muted text-heading shadow-[0px_18px_40px_-25px_rgba(37,99,235,0.45)]'
            : 'border-soft bg-surface-card text-secondary hover:border-strong hover:bg-surface-muted hover:text-heading'
        }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
            <p className="text-sm font-semibold text-heading">{course.title}</p>
            <p className="mt-1 text-xs text-secondary">{course.tagline}</p>
                  </div>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gradient-brand-alt)] text-sm font-semibold text-white shadow-[0_22px_48px_-28px_rgba(var(--primary--800-rgb),0.6)]">
                    {percent}%
                  </span>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-progress">
                  <span
                    className="block h-full rounded-full bg-[linear-gradient(90deg,rgba(var(--peridot--600-rgb),0.95),rgba(var(--primary--500-rgb),0.95))]"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-secondary">
          {completedTasks} of {totalTasks} tasks complete
                </p>
              </button>
            )
  }

  const showCourseList = !singleCourse

  return (
    <section className="relative rounded-3xl border border-soft bg-surface-card p-6 shadow-soft sm:p-10">
      {CelebrationComponent}
      <div className={`grid gap-8 ${showCourseList ? 'lg:grid-cols-[320px_1fr]' : ''}`}>
        {showCourseList ? (
          <aside className="space-y-5">
            <div className="rounded-2xl border border-soft bg-surface-muted px-4 py-3 text-xs	font-semibold tracking-[0.16em] text-secondary">
              Choose Your Journey
            </div>
            {courses.map(renderCourseCard)}
            <div className="space-y-3 rounded-2xl border border-dashed border-soft bg-surface-muted p-4">
              <h3 className="text-sm font-semibold text-heading">Membership Perks</h3>
              <p className="text-xs text-secondary">{activeCourse.membershipPerk.description}</p>
              <p className="text-xs font-semibold tracking-[0.16em] text-secondary">All journeys · Free access</p>
            </div>
          </aside>
        ) : null}

        <div className="space-y-10">
          {singleCourse ? (
            <div className="flex justify-start">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 rounded-full border border-soft bg-surface-card px-4 py-2 text-xs font-semibold tracking-[0.16em] text-secondary transition hover:border-strong hover:text-heading"
              >
                ← All courses
              </Link>
            </div>
          ) : null}
              <header className="rounded-3xl border border-soft bg-surface-highlight p-8 shadow-inner shadow-[0px_40px_120px_rgba(var(--primary--700-rgb),0.08)]">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="max-w-2xl space-y-3">
                <h2 className="text-3xl font-semibold text-heading sm:text-4xl">{activeCourse.title}</h2>
                <p className="text-sm text-secondary sm:text-base">{activeCourse.tagline}</p>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-soft bg-surface-card px-4 py-1 text-xs font-semibold tracking-[0.14em] text-heading">
                    1,000 sequential tasks
                        </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-soft bg-surface-card px-4 py-1 text-xs font-semibold tracking-[0.14em] text-heading">
                    Certificate available
                  </span>
                      </div>
                        </div>
              <div className="rounded-2xl border border-soft bg-surface-card p-4 text-right">
                <p className="text-xs tracking-[0.16em] text-secondary">Progress</p>
                <p className="text-3xl font-semibold text-heading">{courseStats.percent}%</p>
                <p className="mt-1 text-xs text-secondary">
                  {courseStats.completed} completed · {courseStats.remaining} remaining
                </p>
                      </div>
                    </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-soft bg-surface-card p-4">
                <h3 className="text-sm font-semibold text-heading">{activeCourse.certificate.title}</h3>
                <p className="mt-2 text-xs text-secondary">{activeCourse.certificate.description}</p>
              </div>
              <div className="rounded-2xl border border-soft bg-surface-card p-4">
                <h3 className="text-sm font-semibold text-heading">{activeCourse.voiceInterview.title}</h3>
                <p className="mt-2 text-xs text-secondary">{activeCourse.voiceInterview.description}</p>
                <p className="mt-3 text-[0.65rem] font-semibold tracking-[0.16em] text-secondary">
                  Focus Areas: {activeCourse.voiceInterview.focus.join(' · ')}
                </p>
                              </div>
                            </div>
          </header>

          <div className="space-y-6 rounded-3xl border border-soft bg-surface-highlight p-6 shadow-sm shadow-[0_32px_90px_-55px_rgba(var(--primary--700-rgb),0.25)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-heading">Chapters</h3>
              <span className="text-xs tracking-[0.16em] text-secondary">
                {activeCourse.chapters.length} chapters · 30-200 tasks each
                                        </span>
                                        </div>
            <div className="flex flex-wrap gap-3">
              {activeCourse.chapters.map((chapter, index) => {
                const isActive = index === activeChapterIndex
                const completedInChapter = chapter.tasks.filter((task) => completedIds.has(task.id)).length
                const percent =
                  chapter.tasks.length === 0 ? 0 : Math.round((completedInChapter / chapter.tasks.length) * 100)
                return (
                                        <button
                    key={chapter.id}
                    onClick={() => handleSelectChapter(index)}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.14em] transition ${
                      isActive
                        ? 'border-strong bg-surface-card text-heading'
                        : 'border-soft bg-surface-card text-secondary hover:border-strong hover:text-heading'
                    }`}
                  >
                    {chapter.title} · {percent}%
                                        </button>
                                )
                              })}
                          </div>
            <p className="text-sm text-secondary">{activeChapter.description}</p>
                    </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-heading">Chapter tasks</h3>
              <span className="text-xs tracking-[0.16em] text-secondary">
                {activeChapter.tasks.length} tasks · First unlocked, rest follow sequentially
              </span>
            </div>
            <div className="grid grid-cols-5 gap-3 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12">
              {activeChapter.tasks.map((task, index) => {
                const status = computeTaskStatus(task, completedIds, orderedTasks)
                const isActive = index === activeTaskIndex
                const baseClasses =
                  'flex h-12 w-12 items-center justify-center rounded-full border text-xs font-semibold transition'
                const classes =
                  status === 'completed'
                    ? `${baseClasses} task-progress-completed border-[rgba(var(--peridot--600-rgb),0.4)] bg-[var(--surface-success-strong)] text-[var(--color-success-text)]`
                    : status === 'in-progress'
                    ? `${baseClasses} task-progress-active border-[rgba(var(--primary--500-rgb),0.35)] bg-surface-card text-heading hover:border-[rgba(var(--primary--500-rgb),0.55)]`
                    : `${baseClasses} task-progress-locked border-disabled bg-disabled text-muted cursor-not-allowed`
                const label = status === 'completed' ? '✓' : index + 1

                if (singleCourse) {
                  const taskHref = `/courses/${activeCourse.id}/tasks/${task.id}`
                  if (status === 'locked') {
                    return (
                      <span key={task.id} className={`${classes} opacity-60`}>
                        {label}
                      </span>
                    )
                  }
                  return (
                    <Link key={task.id} href={taskHref} className={`${classes} hover:-translate-y-0.5`}>
                      {label}
                    </Link>
                  )
                }

                return (
                  <button
                    key={task.id}
                    onClick={() => handleSelectTask(index)}
                    className={`${classes} ${isActive ? 'ring-2 ring-offset-2 ring-[var(--color-accent-primary)]' : ''}`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          {singleCourse ? (
            <div className="rounded-2xl border border-soft bg-surface-card p-6 text-sm text-secondary">
              Select any unlocked task above to open it in the dedicated workspace page.
            </div>
          ) : (
            <TaskWorkspace
              task={activeTask}
              isUnlocked={computeTaskStatus(activeTask, completedIds, orderedTasks) !== 'locked'}
              isCompleted={completedIds.has(activeTask.id)}
              onComplete={handleCompleteTask}
            />
          )}

          {!showCourseList ? (
            <div className="rounded-2xl border border-dashed border-soft bg-surface-muted p-5">
              <h3 className="text-sm font-semibold text-heading">{activeCourse.membershipPerk.title}</h3>
              <p className="mt-2 text-xs text-secondary">{activeCourse.membershipPerk.description}</p>
              <p className="mt-3 text-[0.65rem] font-semibold tracking-[0.16em] text-secondary">All journeys · Free access</p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}


