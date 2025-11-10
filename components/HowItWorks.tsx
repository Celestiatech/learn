import { RocketIcon, CheckCircledIcon, LightningBoltIcon, LayersIcon } from '@radix-ui/react-icons'

const phases = [
  {
    title: 'Learn the concept',
    description: 'Watch focused walkthroughs and read the reference-first notes written for busy builders.',
    icon: <LayersIcon className="h-6 w-6 text-white" />,
    accent: 'from-[rgba(var(--primary--500-rgb),0.35)] via-[rgba(var(--primary--600-rgb),0.45)] to-[rgba(var(--primary--700-rgb),0.4)]',
  },
  {
    title: 'Practice with guidance',
    description: 'Solve micro-missions, use built-in hints, and compare against mentor solutions instantly.',
    icon: <LightningBoltIcon className="h-6 w-6 text-white" />,
    accent: 'from-[rgba(var(--meteorite--500-rgb),0.35)] via-[rgba(140,133,255,0.4)] to-[rgba(103,61,230,0.35)]',
  },
  {
    title: 'Submit for review',
    description: 'Upload your work, get code review highlights, and receive actionable next steps.',
    icon: <CheckCircledIcon className="h-6 w-6 text-white" />,
    accent: 'from-[rgba(var(--peridot--600-rgb),0.35)] via-[rgba(32,224,82,0.32)] to-[rgba(var(--neon--600-rgb),0.28)]',
  },
  {
    title: 'Level up and unlock',
    description: 'Earn streaks, unlock advanced quests, and track your career-ready skill map.',
    icon: <RocketIcon className="h-6 w-6 text-white" />,
    accent: 'from-[rgba(var(--primary--600-rgb),0.35)] via-[rgba(var(--primary--700-rgb),0.32)] to-[rgba(14,11,45,0.4)]',
  },
]

export default function HowItWorks() {
  return (
    <section className="how-it-works-section relative overflow-hidden rounded-[28px] border border-[rgba(103,61,230,0.08)] bg-white/80 px-6 py-16 shadow-[var(--shadow-subtle)] backdrop-blur">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(103,61,230,0.08),transparent_65%)]" />
      <div className="relative mx-auto max-w-6xl space-y-10">
        <div className="space-y-5 text-center">
          <span className="how-it-works-badge inline-flex items-center justify-center rounded-full border border-[rgba(103,61,230,0.2)] bg-[rgba(103,61,230,0.08)] px-4 py-1 text-xs font-medium text-[var(--color-heading)]/70">
            The roadmap
          </span>
          <h2 className="how-it-works-heading text-3xl font-semibold text-[var(--color-heading)] sm:text-4xl">How SimplyCode keeps you shipping</h2>
          <p className="how-it-works-subtitle mx-auto max-w-2xl text-sm text-[var(--color-text-secondary)] sm:text-base">
            Every lesson follows a predictable yet motivating loop built to help you learn with confidence and momentum.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {phases.map((phase) => (
            <article
              key={phase.title}
              className="how-it-works-card group relative overflow-hidden rounded-3xl border border-[rgba(103,61,230,0.12)] bg-white/90 p-6 shadow-sm shadow-[rgba(31,19,70,0.06)] transition hover:-translate-y-1 hover:shadow-[0_32px_70px_-45px_rgba(31,19,70,0.28)]"
            >
              <div className={`how-it-works-overlay absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 bg-gradient-to-br ${phase.accent}`} />
              <div className="how-it-works-content relative flex items-start gap-4">
                <div className="how-it-works-icon flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[var(--gradient-brand-alt)] shadow-[0_18px_30px_-18px_rgba(var(--primary--700-rgb),0.4)]">
                  {phase.icon}
                </div>
                <div className="how-it-works-copy space-y-2">
                  <h3 className="how-it-works-title text-lg font-semibold text-[var(--color-heading)]">{phase.title}</h3>
                  <p className="how-it-works-description text-sm text-[var(--color-text-secondary)]">{phase.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

