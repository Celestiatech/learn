import Link from 'next/link'

const checkList = [
  'Build the animated navigation menu',
  'Wire keyboard shortcuts for instant run',
  'Submit for mentor feedback',
]

export default function LessonPreview() {
  return (
    <section className="lesson-preview-section relative overflow-hidden rounded-[28px] border border-[rgba(103,61,230,0.12)] bg-white px-6 py-16 shadow-[var(--shadow-subtle)] sm:px-10">
      <div className="lesson-preview-overlay pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(32,224,82,0.12),transparent_60%),radial-gradient(circle_at_right,rgba(103,61,230,0.12),transparent_65%)]" />
      <div className="relative mx-auto max-w-6xl grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-6">
          <span className="inline-flex items-center rounded-full border border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.08)] px-4 py-1 text-xs font-medium text-[var(--color-success-text)]">
            Inside the lesson
          </span>
          <h2 className="text-3xl font-semibold text-[var(--color-heading)] sm:text-4xl">Dashboard experience built for flow</h2>
          <p className="text-sm text-[var(--color-text-secondary)] sm:text-base">
            The SimplyCode workspace keeps focus with a dark editor, inline testing, and progress guidance. Cruise through each mission with intelligent hints and a glowing “Next task” that nudges you forward.
          </p>
          <ul className="lesson-preview-checklist space-y-3 text-sm text-[var(--color-text-primary)]">
            {checkList.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-2xl border border-[rgba(16,185,129,0.16)] bg-[var(--surface-success)] px-4 py-3">
                <span className="lesson-preview-bullet mt-1 inline-flex h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[var(--color-success)] shadow-[0_0_0_3px_rgba(32,224,82,0.15)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/auth/register"
              className="inline-flex items-center rounded-full bg-[var(--gradient-success)] px-5 py-3 text-xs font-semibold text-[rgba(8,7,22,0.92)] shadow-[var(--shadow-success)] transition hover:-translate-y-0.5 hover:shadow-[0_26px_60px_-28px_rgba(var(--peridot--600-rgb),0.6)]"
            >
              Start your first task
            </Link>
            <Link
              href="/playground"
              className="inline-flex items-center rounded-full border border-[rgba(103,61,230,0.2)] px-5 py-3 text-xs font-semibold text-[var(--color-heading)] transition hover:border-[rgba(103,61,230,0.45)] hover:text-[var(--primary--600)]"
            >
              Try the playground
            </Link>
          </div>
        </div>

        <div className="lesson-preview-card relative rounded-[24px] border border-[rgba(103,61,230,0.12)] bg-[rgba(12,11,28,0.95)] p-6 shadow-[0_38px_100px_-50px_rgba(12,11,28,0.65)] text-[#d6dbf4]">
          <div className="lesson-preview-meta flex items-center justify-between text-xs text-white/55">
            <span>SimplyCode editor</span>
            <span>Auto-save · streak 7 days</span>
          </div>
          <div className="lesson-preview-inner mt-4 rounded-2xl border border-white/8 bg-[rgba(8,7,22,0.9)] p-5 text-sm shadow-inner">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="lesson-preview-label text-xs text-emerald-200/90">Current sprint</p>
                <p className="lesson-preview-heading mt-1 text-base font-semibold text-white">Responsive navigation shell</p>
              </div>
              <span className="lesson-preview-pill rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                05 / 08 tasks
              </span>
            </div>

            <div className="lesson-preview-progress mt-4 space-y-3 text-xs text-white/70">
              <div className="flex items-center justify-between">
                <span>Progress</span>
                <span>68%</span>
              </div>
              <div className="lesson-preview-track h-2 rounded-full bg-white/10">
                <div className="lesson-preview-fill h-full w-[68%] rounded-full bg-[var(--gradient-success)] shadow-none" />
              </div>
            </div>

            <pre className="lesson-preview-code mt-6 overflow-x-auto rounded-xl bg-[rgba(15,14,36,0.85)] p-4 text-[13px] leading-6 text-[#d6dbf4] shadow-inner">
{`const sidebar = document.querySelector('[data-sidebar]')
const toggle = document.querySelector('[data-toggle]')

toggle.addEventListener('click', () => {
  sidebar.classList.toggle('is-open')
})

shortcut('ctrl+enter', () => runTests({ reporter: 'inline' }))`}
            </pre>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button className="lesson-preview-cta inline-flex items-center rounded-full bg-[var(--gradient-success)] px-4 py-2 text-[11px] font-semibold text-[rgba(8,7,22,0.92)] shadow-[var(--shadow-success)]">
                Next task
              </button>
              <button className="lesson-preview-secondary inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-[11px] font-semibold text-white/85">
                Run checks
              </button>
              <button className="lesson-preview-secondary inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-[11px] font-semibold text-white/70">
                Request hint
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

