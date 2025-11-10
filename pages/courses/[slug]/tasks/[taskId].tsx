import { useRouter } from 'next/router'
import Link from 'next/link'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useEffect, useMemo, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import SiteFooter from '../../../../components/SiteFooter'
import SiteHeader from '../../../../components/SiteHeader'
import Seo from '../../../../components/Seo'
import TaskWorkspace from '../../../../components/TaskWorkspace'
import {
  getJourneyCourse,
  listJourneyCourses,
  type JourneyCourse,
  type JourneyTask,
} from '../../../../content/tracks/journey'
import {
  computeTaskStatus,
  findChapterAndTaskIndices,
  findNextTask,
  journeyProgressStorageKey,
} from '../../../../lib/journeyProgress'
import { buildCanonicalUrl } from '../../../../lib/seo'

type TaskDetailPageProps = {
  courseId: string
  taskId: string
}

type JourneyProgress = Record<
  string,
  {
    completed: Record<string, true>
  }
>

function getCourseContext(courseId: string, taskId: string) {
  const course = getJourneyCourse(courseId)
  if (!course) {
    return null
  }

  let chapter: JourneyCourse['chapters'][number] | undefined
  let task: JourneyTask | undefined
  let chapterIndex = 0
  let taskIndex = 0

  course.chapters.forEach((candidateChapter, cIndex) => {
    candidateChapter.tasks.forEach((candidateTask, tIndex) => {
      if (candidateTask.id === taskId) {
        chapter = candidateChapter
        task = candidateTask
        chapterIndex = cIndex
        taskIndex = tIndex
      }
    })
  })

  if (!chapter || !task) {
    return null
  }

  const orderedTasks = course.chapters.flatMap((entry) => entry.tasks)
  return { course, chapter, task, chapterIndex, taskIndex, orderedTasks }
}

export default function TaskDetailPage({ courseId, taskId }: TaskDetailPageProps) {
  const router = useRouter()
  const context = useMemo(() => getCourseContext(courseId, taskId), [courseId, taskId])
  const { status: authStatus } = useSession()

  const [progress, setProgress] = useState<JourneyProgress>({})
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = window.localStorage.getItem(journeyProgressStorageKey)
      if (stored) {
        setProgress(JSON.parse(stored))
      }
    } catch (error) {
      console.warn('Failed to read journey progress', error)
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

  useEffect(() => {
    if (authStatus !== 'unauthenticated') {
      return
    }
    const callbackUrl = `/courses/${courseId}/tasks/${taskId}`
    signIn(undefined, { callbackUrl }).catch((error) => {
      console.warn('Failed to trigger sign-in redirect', error)
    })
  }, [authStatus, courseId, taskId])

  if (!context) {
    return null
  }

  const { course, chapter, task, orderedTasks } = context

  const completedIds = useMemo(() => {
    const courseEntry = progress[course.id]
    return new Set(Object.keys(courseEntry?.completed ?? {}))
  }, [course.id, progress])

  const taskStatus = computeTaskStatus(task, completedIds, orderedTasks)
  const isCompleted = completedIds.has(task.id)

  const handleCompleteTask = (completedTask: JourneyTask) => {
    setProgress((prev) => {
      const courseEntry = prev[course.id] ?? { completed: {} as Record<string, true> }
      if (courseEntry.completed[completedTask.id]) {
        return prev
      }
      const updatedCourseEntry = {
        ...courseEntry,
        completed: {
          ...courseEntry.completed,
          [completedTask.id]: true as const,
        },
      }
      return {
        ...prev,
        [course.id]: updatedCourseEntry,
      }
    })

    const mergedCompleted = new Set([...completedIds, completedTask.id])
    const nextTask = findNextTask(completedTask, orderedTasks, mergedCompleted)
    if (!nextTask) {
      return
    }
    router.push(`/courses/${course.id}/tasks/${nextTask.id}`).catch((error) => {
      console.warn('Failed to navigate to next task', error)
    })
  }

  const nextTask = findNextTask(task, orderedTasks, completedIds)
  const previousTaskIndex = orderedTasks.findIndex((entry) => entry.id === task.id) - 1
  const previousTask = previousTaskIndex >= 0 ? orderedTasks[previousTaskIndex] : null

  const chapterProgress = useMemo(() => {
    const total = chapter.tasks.length
    const completed = chapter.tasks.filter((entry) => completedIds.has(entry.id)).length
    return {
      total,
      completed,
      remaining: total - completed,
      percent: total === 0 ? 0 : Math.round((completed / total) * 100),
    }
  }, [chapter.tasks, completedIds])

  const courseProgress = useMemo(() => {
    const total = orderedTasks.length
    const completed = completedIds.size
    return {
      total,
      completed,
      percent: total === 0 ? 0 : Math.round((completed / total) * 100),
    }
  }, [completedIds.size, orderedTasks.length])

  if (authStatus === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-page-bg)] text-[var(--color-text-primary)]">
        <p className="text-sm text-secondary">Checking your account...</p>
      </div>
    )
  }

  if (authStatus === 'unauthenticated') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-page-bg)] text-[var(--color-text-primary)]">
        <p className="text-sm text-secondary">Redirecting you to sign in...</p>
      </div>
    )
  }

  return (
    <>
      <Seo
        title={`${task.title} · ${course.title}`}
        description={task.summary}
        canonical={buildCanonicalUrl(`/courses/${course.id}/tasks/${task.id}`)}
        keywords={[course.title, task.title, 'SimplyCode task workspace']}
      />
      <div className="min-h-screen bg-[var(--color-page-bg)] text-[var(--color-text-primary)]">
        <SiteHeader />
        <main className="mx-auto max-w-5xl space-y-12 px-6 py-14 sm:px-10 lg:px-16">
          <div className="flex flex-col gap-6 rounded-3xl border border-soft bg-surface-card p-6 shadow-soft sm:p-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3 text-xs text-secondary">
                <Link
                  href={`/courses/${course.id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-soft bg-surface-card px-3 py-1 font-semibold tracking-[0.16em] text-secondary transition hover:border-strong hover:text-heading"
                >
                  ← {course.title}
                </Link>
                <span className="rounded-full border border-soft bg-surface-muted px-3 py-1 font-semibold tracking-[0.16em] text-heading">
                  Chapter {chapter.index + 1}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-secondary">
                <span className="rounded-full border border-soft bg-surface-card px-3 py-1">
                  Course progress: {courseProgress.percent}%
                </span>
                <span className="rounded-full border border-soft bg-surface-card px-3 py-1">
                  Chapter progress: {chapterProgress.percent}%
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-semibold text-heading sm:text-4xl">{task.title}</h1>
              <p className="text-sm text-secondary sm:text-base">{task.summary}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-secondary">
              <span className="rounded-full border border-soft bg-surface-card px-3 py-1">Task {task.order}</span>
              <span className="rounded-full border border-soft bg-surface-card px-3 py-1 uppercase tracking-[0.16em]">
                {task.language.toUpperCase()}
              </span>
              <span
                className={`rounded-full border px-3 py-1 font-semibold tracking-[0.16em] ${
                  isCompleted
                    ? 'task-status-completed border-[rgba(var(--peridot--600-rgb),0.45)] bg-[var(--surface-success)] text-[var(--color-success-text)]'
                    : taskStatus === 'in-progress'
                    ? 'task-status-active border-soft bg-surface-card text-heading'
                    : 'task-status-locked border-disabled bg-disabled text-muted'
                }`}
              >
                {isCompleted ? 'Completed' : taskStatus === 'in-progress' ? 'In progress' : 'Locked'}
              </span>
            </div>
          </div>

          <div className="space-y-6 rounded-3xl border border-soft bg-surface-highlight p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold text-heading">Instructions</h2>
              <ul className="task-instruction-list mt-4 space-y-2 text-sm text-secondary">
                {task.instructions.map((instruction) => (
                  <li key={instruction} className="task-instruction-item relative rounded-xl border border-soft bg-surface-card px-4 py-3">
                    <span className="task-instruction-bullet absolute left-4 top-4 h-2 w-2 rounded-full bg-[var(--color-success)]" />
                    <span className="task-instruction-text block pl-6">{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>

            {task.resources && task.resources.length ? (
              <div>
                <h2 className="text-lg font-semibold text-heading">Resources</h2>
                <ul className="mt-3 flex flex-wrap gap-2 text-xs text-secondary">
                  {task.resources.map((resource) => (
                    <li key={resource.href}>
                      <Link
                        href={resource.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-soft bg-surface-card px-3 py-1 font-semibold tracking-[0.14em] text-heading transition hover:border-strong hover:text-[var(--color-accent-primary)]"
                      >
                        {resource.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <TaskWorkspace
            task={task}
            isUnlocked={taskStatus !== 'locked'}
            isCompleted={isCompleted}
            onComplete={handleCompleteTask}
          />

          <div className="flex flex-wrap justify-between gap-3 text-xs text-secondary">
            <div>
              {previousTask ? (
                <Link
                  href={`/courses/${course.id}/tasks/${previousTask.id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-soft bg-surface-card px-4 py-2 font-semibold tracking-[0.16em] text-secondary transition hover:border-strong hover:text-heading"
                >
                  ← Previous task
                </Link>
              ) : (
                <span className="rounded-full border border-disabled bg-disabled px-4 py-2 font-semibold tracking-[0.16em] text-muted">
                  This is the first task
                </span>
              )}
            </div>
            <div>
              {nextTask ? (
                <Link
                  href={`/courses/${course.id}/tasks/${nextTask.id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-soft bg-surface-card px-4 py-2 font-semibold tracking-[0.16em] text-secondary transition hover:border-strong hover:text-heading"
                >
                  Next task →
                </Link>
              ) : (
                <span className="rounded-full border border-soft bg-surface-card px-4 py-2 font-semibold tracking-[0.16em] text-heading">
                  You completed all tasks in this course!
                </span>
              )}
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const courses = listJourneyCourses()
  const paths: { params: { slug: string; taskId: string } }[] = []

  courses.forEach((course) => {
    course.chapters.forEach((chapter) => {
      chapter.tasks.forEach((task) => {
        paths.push({
          params: {
            slug: course.id,
            taskId: task.id,
          },
        })
      })
    })
  })

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<TaskDetailPageProps> = async ({ params }) => {
  const slug = params?.slug
  const taskId = params?.taskId

  if (typeof slug !== 'string' || typeof taskId !== 'string') {
    return { notFound: true }
  }

  const context = getCourseContext(slug, taskId)
  if (!context) {
    return { notFound: true }
  }

  return {
    props: {
      courseId: slug,
      taskId,
    },
  }
}

