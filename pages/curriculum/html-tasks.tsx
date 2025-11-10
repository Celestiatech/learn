import { useEffect, useMemo, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import htmlTaskSections, { totalHtmlTasks } from '../../content/tracks/htmlTaskList'

type NumberedTask = {
  number: number
  label: string
}

type NumberedSection = {
  id: string
  title: string
  phase: string
  tagline: string
  mission: string
  project: string
  projectBrief: string
  range: [number, number]
  tasks: NumberedTask[]
}

const storageKey = 'html-course-task-progress'

const numberedSections: NumberedSection[] = htmlTaskSections.map((section) => {
  let counter = section.range[0]
  return {
    id: section.id,
    title: section.title,
    phase: section.phase,
    tagline: section.tagline,
    mission: section.mission,
    project: section.project,
    projectBrief: section.projectBrief,
    range: section.range,
    tasks: section.tasks.map((label) => {
      const task: NumberedTask = { number: counter, label }
      counter += 1
      return task
    }),
  }
})

function renderLabel(label: string) {
  return label.split(/(`[^`]+`)/g).map((segment, index) => {
    if (segment.startsWith('`') && segment.endsWith('`')) {
      const content = segment.slice(1, -1)
      return (
        <code key={`${segment}-${index}`} className="rounded bg-surface-card px-1 py-0.5 text-[0.85em]">
          {content}
        </code>
      )
    }

    return <span key={`${segment}-${index}`}>{segment}</span>
  })
}

export default function HtmlTasksPage() {
  const [completed, setCompleted] = useState<Set<number>>(new Set())
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = window.localStorage.getItem(storageKey)
      if (!stored) {
        setReady(true)
        return
      }
      const parsed = JSON.parse(stored) as number[]
      setCompleted(new Set(parsed))
    } catch (error) {
      console.warn('Failed to load HTML task progress', error)
    } finally {
      setReady(true)
    }
  }, [])

  useEffect(() => {
    if (!ready || typeof window === 'undefined') return
    try {
      const payload = JSON.stringify(Array.from(completed))
      window.localStorage.setItem(storageKey, payload)
    } catch (error) {
      console.warn('Failed to persist HTML task progress', error)
    }
  }, [completed, ready])

  const progress = useMemo(() => {
    const completedCount = completed.size
    const percent = totalHtmlTasks === 0 ? 0 : Math.round((completedCount / totalHtmlTasks) * 100)
    return { completedCount, percent }
  }, [completed])

  const toggleTask = (taskNumber: NumberedTask['number']) => {
    setCompleted((prev) => {
      const next = new Set(prev)
      if (next.has(taskNumber)) {
        next.delete(taskNumber)
      } else {
        next.add(taskNumber)
      }
      return next
    })
  }

  const resetProgress = () => {
    setCompleted(new Set())
  }

  return (
    <PageLayout
      title="HTML Full Course Checklist"
      description="Work through 345 focused tasks that cover HTML fundamentals, semantics, and accessibility. Track your progress one checkbox at a time."
      eyebrow="HTML Curriculum"
      heroSlot={
        <div className="grid gap-3 rounded-3xl border border-soft bg-surface-highlight p-6 text-sm text-secondary">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-heading">Tasks complete</span>
            <span className="rounded-full border border-soft bg-surface-card px-3 py-1 text-xs font-semibold tracking-[0.16em] text-heading">
              {progress.percent}% done
            </span>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-soft bg-surface-card px-4 py-3 text-heading">
            <div className="space-y-1">
              <p className="text-xs tracking-[0.16em] text-secondary">Completed</p>
              <p className="text-2xl font-semibold">
                {progress.completedCount} / {totalHtmlTasks}
              </p>
            </div>
            <button
              type="button"
              onClick={resetProgress}
              className="rounded-full border border-soft bg-surface-muted px-4 py-2 text-xs font-semibold tracking-[0.14em] text-secondary transition hover:border-strong hover:text-heading"
            >
              Reset checklist
            </button>
          </div>
          <p className="text-xs leading-relaxed">
            Progress saves locally in your browser. Revisit anytime to continue from where you left off.
          </p>
        </div>
      }
    >
      <section className="space-y-4 rounded-3xl border border-dashed border-soft bg-surface-muted p-6 text-sm text-secondary">
        <h2 className="text-lg font-semibold text-heading">How to use this journey log</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Follow the phases in order—each mission unlocks context for the next.</li>
          <li>Check off tasks as you go; progress is saved locally so you can return anytime.</li>
          <li>Pair each mission with real files (index.html, about.html, etc.) to watch SimplyCode come to life.</li>
        </ul>
      </section>

      <section className="space-y-6 rounded-3xl border border-soft bg-surface-card p-6 shadow-soft">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-heading">Journey timeline</h2>
            <p className="text-sm text-secondary">
              Eight narrative phases guide you from foundational markup to a launch-ready SimplyCode experience.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-soft bg-surface-muted px-4 py-2 text-xs font-semibold tracking-[0.14em] text-secondary">
            {progress.completedCount} / {totalHtmlTasks} milestones complete
          </span>
        </header>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {numberedSections.map((section) => {
            const completedInSection = section.tasks.filter((task) => completed.has(task.number)).length
            const percent =
              section.tasks.length === 0 ? 0 : Math.round((completedInSection / section.tasks.length) * 100)

            return (
              <div
                key={`${section.id}-timeline`}
                className="group flex h-full flex-col justify-between rounded-2xl border border-soft bg-surface-highlight p-5 transition hover:border-[var(--primary--500)] hover:bg-surface-card"
              >
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-soft bg-surface-card px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-secondary">
                    {section.phase}
                  </span>
                  <h3 className="text-lg font-semibold text-heading">{section.tagline}</h3>
                  <p className="text-xs text-secondary">{section.project}</p>
                  <p className="text-xs text-secondary/80">{section.projectBrief}</p>
                </div>
                <div className="mt-5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-secondary/80">
                    <span>Progress</span>
                    <span>{percent}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-muted">
                    <div
                      className="h-full rounded-full bg-[var(--gradient-brand-alt)] transition-[width]"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <div className="space-y-12">
        {numberedSections.map((section) => {
          const completedInSection = section.tasks.filter((task) => completed.has(task.number)).length
          const sectionPercent =
            section.tasks.length === 0 ? 0 : Math.round((completedInSection / section.tasks.length) * 100)

          return (
            <section key={section.id} className="space-y-5 rounded-3xl border border-soft bg-surface-card p-6 shadow-soft">
              <header className="grid gap-5 border-b border-soft pb-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,260px)] lg:items-start">
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-soft bg-surface-muted px-4 py-1 text-xs font-semibold tracking-[0.16em] text-secondary">
                    {section.phase}
                  </span>
                  <div>
                    <h3 className="text-2xl font-semibold text-heading">{section.title}</h3>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary/80">{section.tagline}</p>
                  </div>
                  <p className="text-sm leading-relaxed text-secondary">{section.mission}</p>
                  <p className="text-xs text-secondary/80">
                    Tasks {section.range[0]}–{section.range[1]} · {section.tasks.length} total
                  </p>
                </div>
                <div className="space-y-3 rounded-2xl border border-soft bg-surface-highlight p-4 text-sm text-secondary">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-secondary/80">
                    <span>Mission status</span>
                    <span>{sectionPercent}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-card">
                    <div
                      className="h-full rounded-full bg-[var(--gradient-success)] transition-[width]"
                      style={{ width: `${sectionPercent}%` }}
                    />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-secondary/80">Story project</p>
                    <p className="text-sm font-semibold text-heading">{section.project}</p>
                    <p className="mt-1 text-xs leading-relaxed text-secondary">{section.projectBrief}</p>
                  </div>
                  <span className="inline-flex w-full items-center justify-center rounded-full border border-soft bg-surface-card px-4 py-2 text-xs font-semibold tracking-[0.14em] text-secondary">
                    {completedInSection} checkpoints cleared
                  </span>
                </div>
              </header>

              <ol className="space-y-3">
                {section.tasks.map((task) => {
                  const inputId = `html-task-${task.number}`
                  const isChecked = completed.has(task.number)

                  return (
                    <li
                      key={task.number}
                      className={`flex items-start gap-4 rounded-2xl border px-4 py-3 transition sm:px-5 ${
                        isChecked
                          ? 'border-[rgba(var(--peridot--600-rgb),0.35)] bg-[var(--surface-success)] text-[var(--color-success-text)]'
                          : 'border-soft bg-surface-muted text-secondary hover:border-strong hover:text-heading'
                      }`}
                    >
                      <div className="pt-1">
                        <input
                          id={inputId}
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleTask(task.number)}
                          className="h-4 w-4 rounded border border-soft bg-white text-[var(--primary--500)] focus:ring-2 focus:ring-[var(--primary--500)] focus:ring-offset-2"
                        />
                      </div>
                      <label htmlFor={inputId} className="flex-1 cursor-pointer text-sm sm:text-base">
                        <span className="mr-2 font-semibold text-heading">Task {task.number}.</span>
                        <span className="inline-flex flex-wrap items-center gap-1 align-middle">
                          {renderLabel(task.label)}
                        </span>
                      </label>
                    </li>
                  )
                })}
              </ol>
            </section>
          )
        })}
      </div>

      <section className="space-y-4 rounded-3xl border border-soft bg-surface-highlight p-6 shadow-soft">
        <h2 className="text-xl font-semibold text-heading">Final launch mission · SimplyCode v1</h2>
        <p className="text-sm text-secondary">
          Bring every artifact together: assemble the full site, validate with the W3C validator, and document the launch.
          When you check off Task 345, celebrate—SimplyCode is live because of you.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-sm text-secondary">
          <li>Link all pages, ensure navigation flows, and add final polish to copy.</li>
          <li>Run your markup through an HTML validator and fix any final issues.</li>
          <li>Capture notes on lessons learned so the next journey starts even stronger.</li>
        </ul>
      </section>
    </PageLayout>
  )
}

