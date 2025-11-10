import dynamic from 'next/dynamic'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { InteractiveLesson, LessonStep, LessonTest } from '../content/interactive/types'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

type TestResult = LessonTest & {
  pass: boolean
  error?: string
}

type LessonStorage = {
  unlockedStep: number
  codeByStep: Record<number, string>
}

const defaultStorage: LessonStorage = {
  unlockedStep: 0,
  codeByStep: {},
}

const getStorageKey = (slug: string) => `interactive-lesson:${slug}`

function buildPreviewDoc(step: LessonStep, code: string) {
  if (!step.preview) return null

  if (step.preview.wrapper) {
    return step.preview.wrapper(code)
  }

  if (step.preview.mode === 'html') {
    return code
  }

  if (step.preview.mode === 'javascript') {
    return `<!doctype html><html><body><script>
try {
${code}
} catch (error) {
  document.body.innerText = 'Error: ' + error.message;
}
</script></body></html>`
  }

  return null
}

type InteractiveLessonProps = {
  lesson: InteractiveLesson
  initialStepIndex?: number
}

export default function InteractiveLesson({ lesson, initialStepIndex = 0 }: InteractiveLessonProps) {
  const normalizedInitialStep = Math.min(Math.max(Math.floor(initialStepIndex), 0), lesson.steps.length - 1)
  const storageKey = useMemo(() => getStorageKey(lesson.slug), [lesson.slug])

  const [activeStepIndex, setActiveStepIndex] = useState(normalizedInitialStep)
  const activeStep = lesson.steps[activeStepIndex]

  const [code, setCode] = useState(activeStep.starterCode)
  const [results, setResults] = useState<TestResult[]>([])
  const [status, setStatus] = useState<'idle' | 'running' | 'passed'>('idle')
  const [unlockedStep, setUnlockedStep] = useState(0)
  const [previewDocument, setPreviewDocument] = useState<string | null>(null)
  const [storageReady, setStorageReady] = useState(false)
  const lastTestedRef = useRef<string>('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const storedRaw = window.localStorage.getItem(storageKey)
      if (!storedRaw) {
        setStorageReady(true)
        return
      }
      const stored: LessonStorage = JSON.parse(storedRaw)
      setUnlockedStep(Math.min(stored.unlockedStep ?? 0, lesson.steps.length - 1))
      const stepCode = stored.codeByStep?.[0]
      if (stepCode) {
        setCode(stepCode)
      }
    } catch (error) {
      console.warn('Failed to load lesson progress', error)
    } finally {
      setStorageReady(true)
    }
  }, [lesson.steps.length, storageKey])

  useEffect(() => {
    setActiveStepIndex(normalizedInitialStep)
  }, [normalizedInitialStep, lesson.slug])

  useEffect(() => {
    setCode(activeStep.starterCode)
    setResults([])
    setStatus('idle')
    setPreviewDocument(null)
    if (!storageReady || typeof window === 'undefined') return

    try {
      const storedRaw = window.localStorage.getItem(storageKey)
      if (!storedRaw) return
      const stored: LessonStorage = JSON.parse(storedRaw)
      const stepCode = stored.codeByStep?.[activeStepIndex]
      if (stepCode) {
        setCode(stepCode)
      }
    } catch (error) {
      console.warn('Failed to restore step code', error)
    }
  }, [activeStepIndex, activeStep.starterCode, storageKey, storageReady])

  useEffect(() => {
    if (!storageReady || typeof window === 'undefined') return
    const storedRaw = window.localStorage.getItem(storageKey)
    const stored: LessonStorage = storedRaw ? JSON.parse(storedRaw) : defaultStorage
    const next: LessonStorage = {
      unlockedStep,
      codeByStep: {
        ...stored.codeByStep,
        [activeStepIndex]: code,
      },
    }
    window.localStorage.setItem(storageKey, JSON.stringify(next))
  }, [activeStepIndex, code, storageKey, storageReady, unlockedStep])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.dispatchEvent(
      new CustomEvent('interactive-progress', {
        detail: { lessonSlug: lesson.slug, unlockedStep },
      })
    )
  }, [lesson.slug, unlockedStep])

  const runTests = useCallback(async () => {
    if (!activeStep) return
    setStatus('running')
    const outcomes: TestResult[] = []
    for (const test of activeStep.tests) {
      try {
        const result = await test.run(code)
        outcomes.push({ ...test, pass: !!result })
      } catch (error) {
        outcomes.push({
          ...test,
          pass: false,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }
    lastTestedRef.current = code
    setResults(outcomes)
    const allPassed = outcomes.every((test) => test.pass)
    if (allPassed) {
      setStatus('passed')
      setUnlockedStep((prev) => {
        const nextUnlocked = Math.max(prev, activeStepIndex + 1)
        return Math.min(nextUnlocked, lesson.steps.length - 1)
      })
    } else {
      setStatus('idle')
    }
  }, [activeStep, activeStepIndex, code, lesson.steps.length])

  const handleNextStep = () => {
    if (status !== 'passed') return
    setActiveStepIndex((prev) => Math.min(prev + 1, lesson.steps.length - 1))
  }

  const handlePrevStep = () => {
    setActiveStepIndex((prev) => Math.max(prev - 1, 0))
  }

  const handleSelectStep = (index: number) => {
    if (index > unlockedStep) return
    setActiveStepIndex(index)
  }

  const handlePreview = () => {
    const doc = buildPreviewDoc(activeStep, code)
    setPreviewDocument(doc)
  }

  useEffect(() => {
    if (!code) return
    if (status === 'running') return
    if (status === 'passed' && lastTestedRef.current === code) return
    const timer = window.setTimeout(() => {
      runTests()
    }, 900)
    return () => {
      window.clearTimeout(timer)
    }
  }, [code, activeStepIndex, runTests, status])

  const totalSteps = lesson.steps.length
  const progressPercent = totalSteps > 1 ? Math.round((unlockedStep / (totalSteps - 1)) * 100) : 100

  return (
    <section className="rounded-3xl border border-soft bg-surface-card p-6 shadow-[0px_25px_55px_-30px_rgba(var(--primary--700-rgb),0.32)] sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-6 rounded-3xl border border-soft bg-surface-muted p-6 shadow-inner shadow-[0_20px_45px_-30px_rgba(var(--primary--700-rgb),0.18)]">
          <div className="flex items-center justify-between">
            <p className="text-xs tracking-[0.16em] text-secondary">Steps</p>
            <span className="rounded-full border border-soft bg-surface-card px-3 py-1 text-xs font-semibold text-[var(--color-accent-primary)]">
              {progressPercent}% complete
            </span>
          </div>
          <ol className="space-y-3 text-sm">
            {lesson.steps.map((step, index) => {
              const isActive = index === activeStepIndex
              const isUnlocked = index <= unlockedStep
              const isCompleted = index < activeStepIndex || (isActive && status === 'passed')
              const statusLabel = isCompleted ? 'Completed' : isActive ? 'In progress' : isUnlocked ? 'Start task' : 'Locked'
              const baseClasses =
                'group relative w-full overflow-hidden rounded-2xl border px-4 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent-primary)]'
              const activeClasses =
                'border-strong bg-surface-card text-heading shadow-[0px_18px_40px_-25px_rgba(37,99,235,0.35)]'
              const unlockedClasses =
                'border-soft bg-surface-card text-heading hover:border-strong hover:bg-surface-muted'
              const lockedClasses = 'border-disabled bg-disabled text-muted cursor-not-allowed'

              return (
                <li key={step.id}>
                  <button
                    onClick={() => handleSelectStep(index)}
                    disabled={!isUnlocked}
                    className={`${baseClasses} ${isActive ? activeClasses : isUnlocked ? unlockedClasses : lockedClasses}`}
                  >
                    <span className="flex items-center justify-between">
                      <span className="text-xs font-semibold tracking-[0.14em] text-secondary">
                        Step {index + 1}
                      </span>
                      <span
                        className={`text-xs ${
                          isCompleted
                            ? 'text-[var(--color-success-text)]'
                            : isActive
                            ? 'text-[var(--color-accent-primary)]'
                            : 'text-muted'
                        }`}
                      >
                        {statusLabel}
                      </span>
                    </span>
                    <span className="mt-2 block font-semibold text-heading">{step.title}</span>
                  </button>
                </li>
              )
            })}
          </ol>
        </aside>

        <div className="space-y-6">
          <div className="rounded-3xl border border-soft bg-surface-card p-8 shadow-sm shadow-[0_32px_90px_-55px_rgba(var(--primary--700-rgb),0.22)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs tracking-[0.16em] text-secondary">
                  Step {activeStepIndex + 1} of {lesson.steps.length}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-heading">{activeStep.title}</h2>
              </div>
              <span className="rounded-full border border-soft bg-surface-muted px-3 py-1 text-xs text-[var(--color-accent-primary)]">
                Language · {activeStep.language.toUpperCase()}
              </span>
            </div>
            <ul className="mt-6 space-y-3 text-sm text-secondary">
              {activeStep.instructions.map((instruction) => (
                <li key={instruction} className="relative pl-6">
                  <span className="absolute left-0 top-1 h-2 w-2 rounded-full bg-[var(--color-success)]" />
                  {instruction}
                </li>
              ))}
            </ul>
            {activeStep.resources ? (
              <div className="mt-6 flex flex-wrap gap-3">
                {activeStep.resources.map((resource) => (
                  <a
                    key={resource.href}
                    href={resource.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-soft bg-surface-card px-4 py-2 text-xs font-semibold tracking-[0.14em] text-heading transition hover:border-strong hover:text-[var(--color-accent-primary)]"
                  >
                    {resource.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <div className="rounded-3xl border border-soft bg-surface-card p-6 shadow-sm shadow-[0_32px_90px_-55px_rgba(var(--primary--700-rgb),0.22)]">
          <div className="workspace-editor-shell h-[360px] overflow-hidden rounded-2xl border border-soft bg-[rgba(var(--dark-blue--500-rgb),0.92)]">
            <MonacoEditor
              height="100%"
              defaultLanguage={activeStep.language}
              language={activeStep.language}
              value={code}
              onChange={(value) => setCode(value ?? '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
              }}
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={runTests}
              disabled={status === 'running'}
              className="rounded-full bg-[var(--gradient-brand-alt)] px-5 py-2 text-sm font-semibold text-white shadow-[0_24px_60px_-32px_rgba(var(--primary--800-rgb),0.55)] transition hover:shadow-[0_28px_70px_-30px_rgba(var(--primary--800-rgb),0.62)] disabled:pointer-events-none disabled:opacity-60"
            >
                {status === 'running' ? 'Running tests…' : 'Run tests'}
            </button>
            <button
              onClick={handlePreview}
              className="rounded-full border border-soft bg-surface-card px-4 py-2 text-xs font-semibold tracking-[0.14em] text-heading transition hover:border-strong hover:text-[var(--color-accent-primary)]"
            >
              Update preview
            </button>
            <div className="ml-auto flex gap-2">
              <button
                onClick={handlePrevStep}
                disabled={activeStepIndex === 0}
                className="rounded-full border border-soft bg-surface-card px-4 py-2 text-xs font-semibold tracking-[0.14em] text-heading transition hover:border-strong hover:text-[var(--color-accent-primary)] disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={handleNextStep}
                disabled={status !== 'passed' || activeStepIndex === lesson.steps.length - 1}
                className="rounded-full bg-[var(--gradient-success)] px-5 py-2 text-xs font-semibold tracking-[0.14em] text-white shadow-[var(--shadow-success)] transition disabled:opacity-60"
              >
                Next task
              </button>
            </div>
          </div>
          <ul className="mt-6 space-y-3 text-sm">
            {results.length > 0 ? (
              results.map((result) => (
                <li
                  key={result.id}
                  className={`lesson-result-card rounded-2xl border px-4 py-3 ${
                    result.pass
                      ? 'lesson-result-pass border-[rgba(var(--peridot--600-rgb),0.45)] bg-[var(--surface-success)] text-[var(--color-success-text)]'
                      : 'lesson-result-fail border-[rgba(var(--danger--600-rgb),0.35)] bg-[rgba(var(--danger--600-rgb),0.08)] text-[rgba(var(--danger--600-rgb),0.95)]'
                  }`}
                >
                  <p className="font-semibold">{result.description}</p>
                  {!result.pass && result.hint ? <p className="mt-1 text-xs">{result.hint}</p> : null}
                  {!result.pass && result.error ? (
                    <p className="mt-1 text-xs italic text-[rgba(var(--danger--600-rgb),0.7)]">{result.error}</p>
                  ) : null}
                </li>
              ))
            ) : (
              <li className="rounded-2xl border border-soft bg-surface-highlight px-4 py-3 text-secondary">
                Tests run automatically as you type. Use the button if you want to rerun instantly.
              </li>
            )}
          </ul>
          {status === 'passed' && activeStep.completionMessage ? (
            <div className="lesson-completion-banner mt-6 rounded-2xl border border-[rgba(var(--peridot--600-rgb),0.45)] bg-[var(--surface-success)] px-4 py-3 text-sm text-[var(--color-success-text)]">
              {activeStep.completionMessage}
            </div>
          ) : null}
        </div>

          {previewDocument ? (
            <div className="rounded-3xl border border-soft bg-surface-card p-6 shadow-sm shadow-[0_32px_90px_-55px_rgba(var(--primary--700-rgb),0.22)]">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-heading">Live preview</h3>
                <span className="text-xs tracking-[0.14em] text-secondary">Read-only</span>
              </div>
              <div className="mt-4 overflow-hidden rounded-2xl border border-soft bg-surface-card">
                <iframe
                  title="Lesson preview"
                  className="h-80 w-full"
                  srcDoc={previewDocument}
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

