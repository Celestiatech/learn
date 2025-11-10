import Link from 'next/link'

const coreCurriculum = [
  { title: 'HTML', steps: 285 },
  { title: 'CSS', steps: 1173 },
  { title: 'JavaScript', steps: 1038 },
  { title: 'Front End Libraries', steps: 279 },
  { title: 'Python', steps: 461 },
  { title: 'Relational Databases', steps: 58 },
]

const recommendedCurriculum = [
  'Certified Full Stack Developer Curriculum',
]

const dailyChallenges = [
  { label: "Go to Today's Challenge", href: '#' },
  { label: 'Go to Daily Coding Challenge Archive', href: '#' },
]

const englishForDevelopers = [
  { label: 'A2 English for Developers (Beta) Certification', level: 'A2' },
  { label: 'B1 English for Developers Certification (Beta)', level: 'B1' },
]

const interviewPrep = [
  'The Odin Project - freeCodeCamp Remix',
  'Coding Interview Prep',
  'Project Euler',
  'Rosetta Code',
]

const professionalCertifications = [
  'REST APIs',
  'Clean Code',
  'TypeScript',
  'JavaScript',
  'AI Chatbots',
  'Command Line',
  'GraphQL APIs',
  'CSS Transforms',
  'Access Control',
  'REST API Design',
  'PHP',
  'Java',
  'Linux',
  'React',
  'CI/CD',
  'Docker',
  'Golang',
  'Python',
  'Node.js',
  'Todo APIs',
  'JavaScript Classes',
  'Front-End Libraries',
  'Express and Node.js',
  'Python Code Examples',
  'Clustering in Python',
  'Software Architecture',
  'Programming Fundamentals',
  'Coding Career Preparation',
  'Full-Stack Developer Guide',
  'Python for JavaScript Devs',
]

export default function CurriculumExplorer() {
  return (
    <section className="rounded-[28px] border border-soft bg-surface-card px-6 py-12 shadow-soft sm:px-10">
      <div className="space-y-10">
        <header className="space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-soft bg-surface-muted px-4 py-1 text-xs font-semibold tracking-[0.18em] text-secondary">
            Explore the curriculum
          </span>
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold text-heading sm:text-4xl">Roadmap overview</h2>
            <p className="max-w-2xl text-sm text-secondary sm:text-base">
              Jump into any track or certification pathway. Everything starts at step zero so you can pick a lane and begin shipping.
            </p>
          </div>
        </header>

        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-heading">Core curriculum</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coreCurriculum.map((track) => (
              <div
                key={track.title}
                className="rounded-2xl border border-soft bg-surface-muted p-5 shadow-inner shadow-[0_22px_48px_-36px_rgba(var(--primary--700-rgb),0.2)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-heading">{track.title}</p>
                    <p className="mt-1 text-xs text-secondary">0 of {track.steps} steps complete</p>
                  </div>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gradient-brand-alt)] text-sm font-semibold text-white shadow-[0_18px_42px_-28px_rgba(var(--primary--800-rgb),0.55)]">
                    0%
                  </span>
                </div>
                <Link
                  href="#"
                  className="mt-4 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-[var(--color-accent-primary)] transition hover:text-[var(--primary--600)]"
                >
                  Start track →
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-heading">Recommended curriculum (beta)</h3>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedCurriculum.map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-soft bg-surface-muted px-5 py-4 text-sm font-semibold text-heading shadow-[0_18px_44px_-34px_rgba(var(--primary--700-rgb),0.25)]"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="space-y-4 rounded-3xl border border-soft bg-surface-highlight p-6 shadow-[0_28px_70px_-45px_rgba(var(--primary--700-rgb),0.22)]">
            <h3 className="text-lg font-semibold text-heading">Try the coding challenge of the day</h3>
            <div className="flex flex-wrap gap-3">
              {dailyChallenges.map((challenge) => (
                <Link
                  key={challenge.label}
                  href={challenge.href}
                  className="inline-flex items-center gap-2 rounded-full border border-soft bg-surface-card px-4 py-2 text-xs font-semibold tracking-[0.14em] text-secondary transition hover:border-strong hover:text-heading"
                >
                  {challenge.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-soft bg-surface-highlight p-6 shadow-[0_28px_70px_-45px_rgba(var(--primary--700-rgb),0.22)]">
            <h3 className="text-lg font-semibold text-heading">Learn English for Developers</h3>
            <ul className="space-y-3 text-sm text-secondary">
              {englishForDevelopers.map((item) => (
                <li key={item.label} className="flex items-start justify-between gap-3 rounded-2xl border border-soft bg-surface-card px-4 py-3">
                  <span className="font-semibold text-heading">{item.label}</span>
                  <span className="inline-flex items-center rounded-full border border-soft bg-surface-muted px-3 py-1 text-xs font-semibold tracking-[0.14em] text-secondary">
                    {item.level}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-soft bg-surface-card p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-heading">Prepare for the developer interview & job search</h3>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {interviewPrep.map((item) => (
              <li key={item} className="rounded-2xl border border-soft bg-surface-muted px-4 py-3 text-sm font-semibold text-heading">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4 rounded-3xl border border-soft bg-surface-card p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-heading">Professional certifications</h3>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {professionalCertifications.map((item) => (
              <li key={item} className="rounded-2xl border border-soft bg-surface-muted px-4 py-3 text-sm font-semibold text-heading">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

