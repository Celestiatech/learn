import PageLayout from '../components/PageLayout'
import { buildCanonicalUrl, defaultMeta } from '../lib/seo'

const milestones = [
  {
    year: '2023',
    title: 'Origin sprint',
    description:
      'Sketching a curriculum that blends FreeCodeCamp challenges with W3Schools references for weekend learners.',
  },
  {
    year: '2024',
    title: 'Playground launch',
    description: 'Shipping the interactive coding playground and our first six MDX lessons.',
  },
  {
    year: '2025',
    title: 'Collective cohort',
    description:
      'Opening the Learning Collective beta with guided certifications, peer reviews, and live mentorship.',
  },
]

const values = [
  {
    title: 'Deliberate practice',
    description: 'Every mission builds towards a real ship date so progress never feels abstract.',
  },
  {
    title: 'Clarity over jargon',
    description: 'We translate complex concepts into approachable language and runnable examples.',
  },
  {
    title: 'Community proof',
    description: 'Learners review, mentor, and celebrate one another through open progress logs.',
  },
  {
    title: 'Accessibility first',
    description: 'Content, interactions, and visuals prioritize inclusive, frictionless experiences.',
  },
]

const aboutSeo = {
  openGraph: {
    type: 'website' as const,
  },
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About SimplyCode',
    url: buildCanonicalUrl('/about'),
    description:
      'SimplyCode blends interactive tasks, guided missions, and reference-first docs so every learner moves forward with confidence.',
    publisher: {
      '@type': 'Organization',
      name: defaultMeta.siteName,
      url: defaultMeta.canonical,
    },
  },
}

export default function AboutPage() {
  return (
    <PageLayout
      eyebrow="About SimplyCode"
      title="We design learning journeys that feel like a narrative"
      description="SimplyCode blends interactive tasks, guided missions, and reference-first docs so every learner moves forward with confidence."
      seo={aboutSeo}
    >
      <section className="grid gap-8 rounded-3xl border border-soft bg-surface-card p-8 shadow-[0px_25px_45px_-30px_rgba(var(--primary--700-rgb),0.28)] lg:grid-cols-[1.2fr_1fr]">
        <article className="space-y-6 text-left">
          <h2 className="text-2xl font-semibold text-heading">Our mission</h2>
          <p className="text-secondary">
            We believe learning to code should feel like a guided adventure, not a scattershot search. That means pairing
            story-driven quests with instant references, aligning every task with real product outcomes, and celebrating
            momentum at every step. Lessons, playgrounds, and community rituals stay in sync so shipping your first project feels inevitable.
          </p>
          <p className="text-secondary">
            SimplyCode evolves with our learners. Each cohort co-designs lessons, challenges, and project briefs with the
            team. You’re never just consuming content—you’re shaping the playbook for the next wave of builders.
          </p>
        </article>
        <aside className="space-y-6 rounded-2xl border border-soft bg-surface-muted p-6 shadow-[0_22px_60px_-40px_rgba(var(--primary--700-rgb),0.18)]">
          <h3 className="text-lg font-semibold text-heading">By the numbers</h3>
          <ul className="space-y-4 text-sm text-secondary">
            <li className="flex items-center justify-between border-b border-soft pb-3">
              <span>Community builders</span>
              <span className="text-[var(--color-accent-primary)] font-semibold">40,000+</span>
            </li>
            <li className="flex items-center justify-between border-b border-soft pb-3">
              <span>Interactive examples</span>
              <span className="text-[var(--color-accent-primary)] font-semibold">320+</span>
            </li>
            <li className="flex items-center justify-between border-b border-soft pb-3">
              <span>Weekly micro-projects</span>
              <span className="text-[var(--color-accent-primary)] font-semibold">12 cohorts</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Mentors in residence</span>
              <span className="text-[var(--color-accent-primary)] font-semibold">25</span>
            </li>
          </ul>
        </aside>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-heading">Our values</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {values.map((value) => (
            <article
              key={value.title}
              className="rounded-2xl border border-soft bg-surface-card p-6 text-left shadow-[0_22px_60px_-40px_rgba(var(--primary--700-rgb),0.2)] transition hover:-translate-y-1 hover:shadow-[0_26px_66px_-38px_rgba(var(--primary--700-rgb),0.28)]"
            >
              <h3 className="text-lg font-semibold text-heading">{value.title}</h3>
              <p className="mt-2 text-sm text-secondary">{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-heading">Milestones</h2>
        <div className="relative mt-6">
          <div className="absolute left-4 top-0 bottom-0 hidden w-px bg-[var(--border-soft)] md:block" />
          <ul className="space-y-6">
            {milestones.map((milestone) => (
              <li
                key={milestone.year}
                className="relative rounded-2xl border border-soft bg-surface-card p-6 shadow-[0_18px_55px_-32px_rgba(var(--primary--700-rgb),0.2)] md:pl-16"
              >
                <span className="absolute -left-1 top-6 hidden h-3 w-3 rounded-full bg-[var(--color-success)] md:block" />
                <p className="text-xs uppercase tracking-[0.3em] text-secondary">{milestone.year}</p>
                <h3 className="mt-2 text-lg font-semibold text-heading">{milestone.title}</h3>
                <p className="mt-2 text-sm text-secondary">{milestone.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageLayout>
  )
}

