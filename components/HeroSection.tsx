import Link from 'next/link'
import AuroraBackground from './AuroraBackground'

type HeroSectionProps = {
  onOpenOnboarding?: () => void
}

const metrics = [
  { label: 'Structured missions', value: '120+' },
  { label: 'Peer mentors online', value: '80' },
  { label: 'Weekly ship rate', value: '94%' },
]

const featureList = [
  'Guided paths with mentor checkpoints',
  'Integrated code playground with instant feedback',
  'Earnable streaks, badges, and level goals',
]

export default function HeroSection({ onOpenOnboarding }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-[rgba(255,255,255,0.08)] bg-[var(--gradient-brand-hero)] px-6 py-16 text-white shadow-[var(--shadow-brand-lg)] sm:px-10 lg:px-20">
      <AuroraBackground intensity="balanced" className="-left-10 -top-24 scale-125 opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_55%)]" />

      <div className="relative grid gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="space-y-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-medium text-white/80">
            New cohorts open every week
          </span>

          <div className="space-y-6">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.35rem] lg:leading-[1.03]">
              Learn to Code. <span className="text-white/80">Step by Step.</span>
            </h1>
            <p className="max-w-2xl text-base text-white/85 sm:text-lg">
              Master real projects with guided tasks, progress checkpoints, and a studio-grade coding workspace. SimplyCode keeps you shipping, leveling up, and interview ready.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {onOpenOnboarding ? (
              <button
                onClick={onOpenOnboarding}
                className="hero-primary-cta inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--color-accent-text)] shadow-[0_24px_52px_-26px_rgba(var(--primary--700-rgb),0.75)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_60px_-24px_rgba(var(--primary--700-rgb),0.82)]"
              >
                Start learning
              </button>
            ) : (
              <Link
                href="/auth/register"
                className="hero-primary-cta inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--color-accent-text)] shadow-[0_24px_52px_-26px_rgba(var(--primary--700-rgb),0.75)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_60px_-24px_rgba(var(--primary--700-rgb),0.82)]"
              >
                Start learning
              </Link>
            )}
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/80 hover:bg-white/15"
            >
              Browse courses
            </Link>
          </div>

          <ul className="space-y-3 text-sm text-white/80 sm:text-base">
            {featureList.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 flex-shrink-0 rounded-full bg-white/70 shadow-[0_0_0_3px_rgba(255,255,255,0.18)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <dl className="grid gap-4 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="hero-metric-card group relative flex flex-col gap-2 overflow-hidden rounded-2xl border border-[rgba(103,61,230,0.12)] bg-white/95 p-4 shadow-[0_22px_45px_-35px_rgba(var(--primary--700-rgb),0.55)] transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(var(--primary--500-rgb),0.35)]"
              >
                <div className="hero-metric-overlay pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                  <div className="hero-metric-glow absolute inset-0 bg-[linear-gradient(135deg,rgba(var(--primary--500-rgb),0.12),rgba(var(--peridot--600-rgb),0.12))]" />
                </div>
                <dt className="hero-metric-label text-xs font-semibold text-white/60">{metric.label}</dt>
                <dd className="hero-metric-value text-2xl font-semibold text-[var(--color-heading)]">{metric.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="absolute inset-x-12 top-16 hidden h-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),transparent_70%)] blur-[80px] md:block" />
          <div className="hero-lesson-card relative rounded-[28px] border border-white/15 bg-[rgba(12,11,28,0.92)] p-7 shadow-[0_30px_90px_-45px_rgba(12,9,30,0.75)]">
            <div className="flex items-center justify-between text-xs text-white/55">
              <span>Lesson · Responsive layouts</span>
              <span>Auto-save · 00:48</span>
            </div>

            <div className="hero-lesson-workspace mt-5 rounded-2xl border border-white/10 bg-[rgba(8,7,22,0.85)] p-5 shadow-inner">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span className="hero-lesson-tag inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  Sprint 02
                </span>
                <span>72% complete</span>
              </div>
              <div className="mt-4 space-y-3 text-sm text-white/70">
                <div className="hero-lesson-task rounded-xl border border-white/5 bg-white/5 p-3">
                  <p className="text-xs font-semibold text-emerald-200/90">Active task</p>
                  <p className="mt-1 font-semibold text-white">Build the navigation shell</p>
                  <p className="mt-2 text-xs text-white/50">
                    Implement a responsive sidebar with keyboard shortcuts and persisted state.
                  </p>
                </div>
                <pre className="hero-lesson-code overflow-x-auto rounded-lg bg-[rgba(15,14,36,0.85)] p-4 text-[13px] leading-6 text-[#d6dbf4] shadow-inner">
{`const nextTask = () => {
  runTests()
  deployPreview({ withAccessibility: true })
}

shortcut('ctrl+enter', nextTask)`}
                </pre>
              </div>
            </div>

            <div className="hero-lesson-progress mt-6 space-y-4 text-sm text-white/70">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-white/50">Progress</span>
                <span className="hero-progress-pill rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                  5 / 7 tasks
                </span>
              </div>
            <div className="hero-progress-track h-2 rounded-full bg-white/10">
              <div className="hero-progress-fill h-full w-[68%] rounded-full bg-[var(--gradient-success)] shadow-none" />
              </div>
              <button className="hero-lesson-cta inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--gradient-success)] px-5 py-3 text-xs font-semibold text-[rgba(8,7,22,0.92)] shadow-[var(--shadow-success)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_62px_-30px_rgba(var(--peridot--600-rgb),0.6)]">
                Go to next task
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}