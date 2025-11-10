import Link from 'next/link'
import PageLayout from '../components/PageLayout'
import { buildCanonicalUrl, defaultMeta } from '../lib/seo'

const plans = [
  {
    name: 'Starter',
    price: '$0',
    cadence: 'forever',
    description: 'Perfect for curious builders taking their first missions.',
    features: [
      'All HTML, CSS, and JavaScript tracks',
      'Interactive playground with saved snippets',
      'Reference library with copy-ready snippets',
      'Community progress log access',
    ],
    cta: { label: 'Start for free', href: '/courses' },
    highlight: false,
  },
  {
    name: 'Creator',
    price: '$19',
    cadence: 'per month',
    description: 'Guided mentorship, code reviews, and cohort accountability.',
    features: [
      'Everything in Starter',
      'Weekly mentor office hours',
      'Project feedback within 72 hours',
      'Certification exam prep and mock interviews',
      'Downloadable lesson notes and checklists',
    ],
    cta: { label: 'Join the cohort', href: '/contact' },
    highlight: true,
  },
  {
    name: 'Teams',
    price: 'Custom',
    cadence: 'per organization',
    description: 'Designed for companies and bootcamps delivering team upskilling.',
    features: [
      'Shared team dashboard & reporting',
      'Dedicated curriculum strategist',
      'Private live workshops and Q&A',
      'SAML/SSO & workspace integrations',
      'Tailored project briefs for your stack',
    ],
    cta: { label: 'Talk to us', href: 'mailto:partners@simplycode.dev' },
    highlight: false,
  },
]

const faqs = [
  {
    question: 'Can I switch plans later?',
    answer: 'Absolutely. Upgrade or downgrade anytime, and changes apply to your next billing cycle.',
  },
  {
    question: 'Do you offer scholarships?',
    answer:
      'We reserve a portion of Creator seats for scholarship recipients each cohort. Apply during onboarding or email support@learningcollective.dev.',
  },
  {
    question: 'Is there a refund policy?',
    answer:
      'Yes. If you attend at least two mentorship sessions and are not satisfied, contact us within 14 days for a full refund.',
  },
]

const pricingSeo = {
  keywords: ['SimplyCode pricing', 'coding mentorship plans', 'developer education subscription'],
  openGraph: {
    type: 'website' as const,
  },
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'OfferCatalog',
      name: 'SimplyCode Plans',
      url: buildCanonicalUrl('/pricing'),
      itemListElement: plans.map((plan, index) => ({
        '@type': 'Offer',
        name: plan.name,
        description: plan.description,
        price: plan.price.replace(/[^0-9.]/g, '') || '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: plan.cta.href.startsWith('mailto:')
          ? plan.cta.href
          : `${buildCanonicalUrl(plan.cta.href)}?ref=pricing`,
        position: index + 1,
        offeredBy: {
          '@type': 'Organization',
          name: defaultMeta.siteName,
          url: defaultMeta.canonical,
        },
      })),
    },
  ],
}

export default function PricingPage() {
  return (
    <PageLayout
      eyebrow="Pricing"
      title="Choose a plan that meets you where you are"
      description="Access the entire curriculum for free or unlock structured mentorship and team enablement with premium plans."
      heroSlot={
        <div className="inline-flex items-center gap-3 rounded-full border border-soft bg-surface-card px-5 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-heading">
          <span className="inline-flex h-2 w-2 rounded-full bg-[var(--color-success)]" />
          Cancel or change plans anytime
        </div>
      }
      seo={pricingSeo}
    >
      <section className="relative">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr_1fr]">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`group relative overflow-hidden rounded-3xl border ${
                plan.highlight ? 'border-transparent bg-[var(--gradient-brand-alt)] p-[1px]' : 'border-soft bg-surface-card'
              } ${plan.highlight ? 'lg:-mt-6 lg:-mb-6' : ''} transition hover:-translate-y-1`}
            >
              <div
                className={
                  plan.highlight
                    ? 'pricing-card-highlight rounded-[calc(1.5rem-1px)] h-full w-full bg-white p-8 lg:p-10'
                    : 'pricing-card rounded-[1.5rem] h-full w-full p-8'
                }
              >
                {plan.highlight ? (
                  <div className="pricing-highlight-badge inline-flex items-center gap-2 rounded-full border border-[rgba(var(--warning--500-rgb),0.55)] bg-[rgba(var(--warning--500-rgb),0.18)] px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-warning-text)]">
                    🔥 Most popular
                  </div>
                ) : null}
                <p className={`text-xs uppercase tracking-[0.35em] ${plan.highlight ? 'text-heading/80' : 'text-secondary'}`}>{plan.name}</p>
                <div className={`mt-6 flex items-baseline gap-2 ${plan.highlight ? 'text-heading' : 'text-[var(--color-accent-primary)]'}`}>
                  <span className="text-5xl font-semibold tracking-tight">{plan.price}</span>
                  <span className="text-sm text-secondary">{plan.cadence}</span>
                </div>
                <p className="mt-4 text-sm text-secondary">{plan.description}</p>
                <ul className="mt-8 space-y-3 text-sm text-heading">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className={`pricing-feature flex items-center justify-between rounded-2xl border ${
                        plan.highlight ? 'border-[rgba(var(--peridot--600-rgb),0.28)] bg-[rgba(19,23,41,0.85)]' : 'border-soft bg-surface-highlight'
                      } px-4 py-3`}
                    >
                      <span>{feature}</span>
                      <span className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full border border-[rgba(var(--peridot--600-rgb),0.35)] bg-[var(--surface-success)] text-xs font-semibold text-[var(--color-success-text)]">
                        ✓
                      </span>
                    </li>
                  ))}
                </ul>
                {plan.cta.href.startsWith('mailto:') ? (
                  <a
                    href={plan.cta.href.replace('learningcollective.dev', 'simplycode.dev')}
                    className={`mt-10 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold tracking-[0.14em] transition ${
                      plan.highlight
                        ? 'bg-[var(--gradient-brand-alt)] text-white shadow-[0_24px_60px_-32px_rgba(var(--primary--800-rgb),0.55)] hover:shadow-[0_28px_70px_-30px_rgba(var(--primary--800-rgb),0.62)]'
                        : 'border border-soft bg-surface-card text-heading hover:border-strong hover:text-[var(--color-accent-primary)]'
                    }`}
                  >
                    {plan.cta.label}
                  </a>
                ) : (
                  <Link
                    href={plan.cta.href}
                    className={`mt-10 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold tracking-[0.14em] transition ${
                      plan.highlight
                        ? 'bg-[var(--gradient-brand-alt)] text-white shadow-[0_24px_60px_-32px_rgba(var(--primary--800-rgb),0.55)] hover:shadow-[0_28px_70px_-30px_rgba(var(--primary--800-rgb),0.62)]'
                        : 'border border-soft bg-surface-card text-heading hover:border-strong hover:text-[var(--color-accent-primary)]'
                    }`}
                  >
                    {plan.cta.label}
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-soft bg-surface-card p-8 shadow-[0_32px_90px_-55px_rgba(var(--primary--700-rgb),0.22)]">
          <h2 className="text-2xl font-semibold text-heading">Billing FAQs</h2>
          <div className="mt-6 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-soft bg-surface-highlight p-6">
                <h3 className="text-lg font-semibold text-heading">{faq.question}</h3>
                <p className="mt-2 text-sm text-secondary">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between gap-6 rounded-3xl border border-soft bg-[var(--gradient-brand-soft)] p-8 shadow-[0_32px_90px_-55px_rgba(var(--primary--700-rgb),0.18)]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-soft bg-surface-card px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-heading">
              Flexible upgrades
            </span>
            <h3 className="mt-4 text-2xl font-semibold text-heading">Need an invoice or custom approvals?</h3>
            <p className="mt-3 text-sm text-secondary">
              We’ll work with your procurement or finance team, create invoices, and help migrate your learners without losing progress.
            </p>
          </div>
          <Link
            href="mailto:billing@simplycode.dev"
            className="inline-flex items-center justify-center rounded-full bg-[var(--gradient-brand-alt)] px-6 py-3 text-sm font-semibold text-white shadow-[0_24px_60px_-32px_rgba(var(--primary--800-rgb),0.55)] transition hover:shadow-[0_28px_70px_-30px_rgba(var(--primary--800-rgb),0.62)]"
          >
            Talk with billing
          </Link>
        </div>
      </section>
    </PageLayout>
  )
}

