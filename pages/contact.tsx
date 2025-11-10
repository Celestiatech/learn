import Link from 'next/link'
import PageLayout from '../components/PageLayout'
import { buildCanonicalUrl, defaultMeta } from '../lib/seo'

const contactChannels = [
  {
    label: 'Support & questions',
    detail: 'support@simplycode.dev',
    description: 'Get answers about curriculum, billing, or account access within 24 hours.',
  },
  {
    label: 'Partnerships',
    detail: 'partners@simplycode.dev',
    description: 'Co-create workshops, company upskilling programs, and sponsored missions.',
  },
  {
    label: 'Press & media',
    detail: 'press@simplycode.dev',
    description: 'Request briefings, assets, and interviews with the SimplyCode team.',
  },
]

const officeHours = [
  { day: 'Monday', time: '8:00am – 6:00pm PT', opens: '08:00', closes: '18:00' },
  { day: 'Tuesday', time: '8:00am – 6:00pm PT', opens: '08:00', closes: '18:00' },
  { day: 'Wednesday', time: '8:00am – 6:00pm PT', opens: '08:00', closes: '18:00' },
  { day: 'Thursday', time: '8:00am – 6:00pm PT', opens: '08:00', closes: '18:00' },
  { day: 'Friday', time: '8:00am – 4:00pm PT', opens: '08:00', closes: '16:00' },
]

const contactSeo = {
  keywords: ['SimplyCode contact', 'developer education support', 'learning collective partnerships'],
  openGraph: {
    type: 'website' as const,
  },
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    url: buildCanonicalUrl('/contact'),
    mainEntity: {
      '@type': 'Organization',
      name: defaultMeta.siteName,
      email: 'support@simplycode.dev',
      contactPoint: contactChannels.map((channel) => ({
        '@type': 'ContactPoint',
        contactType: channel.label,
        email: channel.detail,
        availableLanguage: ['English'],
      })),
      openingHoursSpecification: officeHours.map((entry) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: entry.day,
        opens: entry.opens,
        closes: entry.closes,
      })),
    },
  },
}

export default function ContactPage() {
  return (
    <PageLayout
      eyebrow="Say hello"
      title="We’re here to help you stay on track"
      description="Reach out for support, partnerships, or feedback. Our team responds quickly, and every message shapes the next chapter of the platform."
      heroSlot={
        <a
          href="mailto:support@simplycode.dev"
          className="rounded-full bg-[var(--gradient-success)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-success)] transition hover:shadow-[0_28px_62px_-26px_rgba(var(--peridot--600-rgb),0.6)]"
        >
          Email support
        </a>
      }
      seo={contactSeo}
    >
      <section className="grid gap-8 rounded-3xl border border-soft bg-surface-card p-8 shadow-[0px_25px_45px_-30px_rgba(var(--primary--700-rgb),0.28)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-heading">Contact channels</h2>
          <ul className="space-y-5">
            {contactChannels.map((channel) => (
              <li
                key={channel.label}
                className="rounded-2xl border border-soft bg-surface-highlight p-6 shadow-[0_22px_60px_-40px_rgba(var(--primary--700-rgb),0.2)] transition hover:-translate-y-1 hover:shadow-[0_26px_66px_-38px_rgba(var(--primary--700-rgb),0.28)]"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-secondary">{channel.label}</p>
                <a href={`mailto:${channel.detail}`} className="mt-2 block text-lg font-semibold text-[var(--color-accent-primary)]">
                  {channel.detail}
                </a>
                <p className="mt-2 text-sm text-secondary">{channel.description}</p>
              </li>
            ))}
          </ul>
        </div>
        <aside className="space-y-6 rounded-2xl border border-soft bg-surface-muted p-6 shadow-[0_22px_60px_-40px_rgba(var(--primary--700-rgb),0.18)]">
          <div>
            <h3 className="text-lg font-semibold text-heading">Office hours</h3>
            <ul className="mt-3 space-y-2 text-sm text-secondary">
              {officeHours.map((entry) => (
                <li key={entry.day} className="flex justify-between border-b border-soft pb-2 last:border-none last:pb-0">
                  <span>{entry.day}</span>
                  <span className="text-[var(--color-accent-primary)] font-semibold">{entry.time}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-heading">Community</h3>
            <p className="mt-2 text-sm text-secondary">
              Join peer-led rooms, share your progress log, and attend weekly live stream reviews.
            </p>
            <Link
              href="/courses"
              className="mt-4 inline-flex items-center rounded-full border border-soft bg-surface-card px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-heading transition hover:border-strong hover:text-[var(--color-accent-primary)]"
            >
              Explore curriculum →
            </Link>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-heading">HQ</h3>
            <p className="mt-2 text-sm text-secondary">
              Distributed across San Francisco, Lagos, Berlin, and Singapore — we work asynchronously and celebrate wins
              in every time zone.
            </p>
          </div>
        </aside>
      </section>
    </PageLayout>
  )
}

