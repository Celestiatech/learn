import dynamic from 'next/dynamic'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { JourneyTask } from '../content/tracks/journey'
import type { LessonTest } from '../content/interactive/types'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

type TaskWorkspaceProps = {
  task: JourneyTask
  isUnlocked: boolean
  isCompleted: boolean
  onComplete: (task: JourneyTask) => void
}

type TestResult = LessonTest & {
  pass: boolean
  error?: string
}

const codeStorageKey = (taskId: string) => `learning-site:journey:code:${taskId}`

export default function TaskWorkspace({ task, isUnlocked, isCompleted, onComplete }: TaskWorkspaceProps) {
  const [code, setCode] = useState(task.starterCode)
  const [status, setStatus] = useState<'idle' | 'running' | 'passed'>('idle')
  const [results, setResults] = useState<TestResult[]>([])
  const [narrationState, setNarrationState] = useState<'idle' | 'playing' | 'paused'>('idle')
  const [storageReady, setStorageReady] = useState(false)
  const latestSuccessfulCode = useRef<string>('')
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const storageKey = useMemo(() => codeStorageKey(task.id), [task.id])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = window.localStorage.getItem(storageKey)
      if (stored) {
        setCode(stored)
      } else {
        setCode(task.starterCode)
      }
    } catch {
      setCode(task.starterCode)
    } finally {
      setStorageReady(true)
    }
  }, [storageKey, task.starterCode])

  useEffect(() => {
    setStatus('idle')
    setResults([])
    latestSuccessfulCode.current = ''
  }, [task.id])

  useEffect(() => {
    if (!storageReady || typeof window === 'undefined') return
    try {
      window.localStorage.setItem(storageKey, code)
    } catch {
      // ignore write errors
    }
  }, [code, storageReady, storageKey])

  const runTests = useCallback(async () => {
    if (!isUnlocked || task.tests.length === 0) return
    setStatus('running')
    const outcomes: TestResult[] = []
    for (const test of task.tests) {
      try {
        const passed = await test.run(code)
        outcomes.push({ ...test, pass: !!passed })
      } catch (error) {
        outcomes.push({
          ...test,
          pass: false,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }
    setResults(outcomes)
    const passedAll = outcomes.every((result) => result.pass)
    if (passedAll) {
      setStatus('passed')
      latestSuccessfulCode.current = code
      if (!isCompleted) {
        onComplete(task)
      }
    } else {
      setStatus('idle')
    }
  }, [code, isCompleted, isUnlocked, onComplete, task])

  useEffect(() => {
    if (!isUnlocked) {
      setStatus('idle')
      setResults([])
    }
  }, [isUnlocked])

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    setNarrationState('idle')
    return () => {
      window.speechSynthesis.cancel()
      utteranceRef.current = null
    }
  }, [task.id])

  const handleToggleNarration = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Voice narration is not supported in this browser.')
      return
    }
    const synth = window.speechSynthesis

    if (narrationState === 'idle') {
      synth.cancel()
      const utterance = new SpeechSynthesisUtterance(task.audioNarration)
      utterance.onstart = () => setNarrationState('playing')
      utterance.onend = () => {
        setNarrationState('idle')
        utteranceRef.current = null
      }
      utterance.onerror = () => {
        setNarrationState('idle')
        utteranceRef.current = null
      }
      utterance.onpause = () => setNarrationState('paused')
      utterance.onresume = () => setNarrationState('playing')
      utteranceRef.current = utterance
      synth.speak(utterance)
      return
    }

    if (narrationState === 'playing') {
      synth.pause()
      setNarrationState('paused')
      return
    }

    if (narrationState === 'paused') {
      synth.resume()
      setNarrationState('playing')
    }
  }

  const isRunDisabled = !isUnlocked || status === 'running' || task.tests.length === 0

  const instructionStatuses = useMemo(() => {
    const map = new Map<number, 'pass' | 'fail'>()
    results.forEach((result, index) => {
      map.set(index, result.pass ? 'pass' : 'fail')
    })
    return map
  }, [results])

  const handleResetCode = () => {
    setCode(task.starterCode)
    setResults([])
    setStatus('idle')
    latestSuccessfulCode.current = ''
  }

  return (
    <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-8">
      <article className="rounded-3xl border border-soft bg-surface-card p-8 shadow-[0_32px_90px_-55px_rgba(var(--primary--700-rgb),0.25)] lg:h-full">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.16em] text-secondary">Task {task.order}</p>
            <h2 className="mt-2 text-2xl font-semibold text-heading">{task.title}</h2>
            <p className="mt-3 text-sm text-secondary">{task.summary}</p>
          </div>
          <button
            onClick={handleToggleNarration}
            className={`rounded-full border border-soft px-4 py-2 text-xs font-semibold tracking-[0.14em] transition ${
              narrationState === 'playing'
                ? 'bg-[var(--gradient-brand-alt)] text-white shadow-[0_24px_60px_-32px_rgba(var(--primary--800-rgb),0.65)]'
                : narrationState === 'paused'
                ? 'bg-surface-card text-heading hover:border-strong hover:text-[var(--color-accent-primary)]'
                : 'bg-surface-card text-heading hover:border-strong hover:text-[var(--color-accent-primary)]'
            }`}
          >
            {narrationState === 'playing'
              ? 'Pause narration'
              : narrationState === 'paused'
              ? 'Resume narration'
              : 'Play narration'}
          </button>
        </div>
          <div className="mt-6 space-y-2 text-sm text-secondary">
            <h3 className="font-semibold text-heading">Instructions</h3>
            <ul className="task-instruction-list space-y-2">
              {task.instructions.map((instruction, index) => {
                const status = instructionStatuses.get(index)
                const indicatorClass =
                  status === 'pass'
                    ? 'bg-[var(--color-success)]'
                    : status === 'fail'
                    ? 'bg-[rgba(var(--danger--600-rgb),0.9)]'
                    : 'bg-[rgba(var(--neutral--200-rgb),0.8)]'
                const textClass =
                  status === 'pass'
                    ? 'text-[var(--color-success-text)]'
                    : status === 'fail'
                    ? 'text-[rgba(var(--danger--600-rgb),0.95)]'
                    : 'text-secondary'
                return (
                  <li
                    key={instruction}
                    className={`task-instruction-item relative rounded-xl border px-4 py-3 ${
                      status === 'pass'
                        ? 'border-[rgba(var(--peridot--600-rgb),0.45)] bg-[var(--surface-success)]'
                        : status === 'fail'
                        ? 'border-[rgba(var(--danger--600-rgb),0.35)] bg-[rgba(var(--danger--600-rgb),0.08)]'
                        : 'border-soft bg-surface-card'
                    }`}
                  >
                    <span className={`task-instruction-bullet absolute left-4 top-4 h-2 w-2 rounded-full ${indicatorClass}`} />
                    <span className={`task-instruction-text pl-6 block ${textClass}`}>{instruction}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        <div className="mt-6 rounded-2xl border border-soft bg-surface-muted p-4 text-sm text-secondary">
          {task.explanation}
        </div>
      </article>

      <section className="rounded-3xl border border-soft bg-surface-card p-6 shadow-[0_32px_90px_-55px_rgba(var(--primary--700-rgb),0.25)] lg:h-full">
        <div className="workspace-editor-shell h-[360px] overflow-hidden rounded-2xl border border-soft bg-[rgba(var(--dark-blue--500-rgb),0.92)]">
          <MonacoEditor
            height="100%"
            language={task.language}
            value={code}
            onChange={(value) => setCode(value ?? '')}
            theme="vs-dark"
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              readOnly: !isUnlocked,
            }}
          />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {task.tests.length ? (
            <button
              onClick={runTests}
              disabled={isRunDisabled}
              className="rounded-full bg-[var(--gradient-brand-alt)] px-5 py-2 text-sm font-semibold text-white shadow-[0_24px_60px_-32px_rgba(var(--primary--800-rgb),0.55)] transition hover:shadow-[0_28px_70px_-30px_rgba(var(--primary--800-rgb),0.62)] disabled:pointer-events-none disabled:opacity-60"
            >
              {status === 'running' ? 'Running tests…' : isUnlocked ? 'Run tests' : 'Locked'}
            </button>
          ) : null}
          <button
            onClick={handleResetCode}
            className="rounded-full border border-soft bg-surface-card px-4 py-2 text-xs font-semibold tracking-[0.14em] text-heading transition hover:border-strong hover:text-[var(--color-accent-primary)]"
          >
            Reset code
          </button>
          <span
            className={`task-status-pill rounded-full border px-4 py-2 text-xs tracking-[0.14em] ${
              isCompleted
                ? 'task-status-completed border-[rgba(var(--peridot--600-rgb),0.45)] bg-[var(--surface-success)] text-[var(--color-success-text)]'
                : isUnlocked
                ? 'task-status-active border-soft bg-surface-card text-heading'
                : 'task-status-locked border-disabled bg-disabled text-muted'
            }`}
          >
            {isCompleted ? 'Completed' : isUnlocked ? 'In progress' : 'Locked'}
          </span>
        </div>
        <ul className="mt-6 space-y-3 text-sm">
          {task.tests.length ? (
            results.length ? (
            results.map((result) => (
              <li
                key={result.id}
                className={`task-result-card rounded-2xl border px-4 py-3 ${
                  result.pass
                    ? 'task-result-pass border-[rgba(var(--peridot--600-rgb),0.45)] bg-[var(--surface-success)] text-[var(--color-success-text)]'
                    : 'task-result-fail border-[rgba(var(--danger--600-rgb),0.35)] bg-[rgba(var(--danger--600-rgb),0.08)] text-[rgba(var(--danger--600-rgb),0.95)]'
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
                Click “Run tests” whenever you want to check your progress.
              </li>
            )
          ) : (
            <li className="rounded-2xl border border-soft bg-surface-highlight px-4 py-3 text-secondary">
              This mission relies on manual review. Complete the instructions, then mark the task done when you’re satisfied.
            </li>
          )}
        </ul>
      </section>
    </div>
  )
}


