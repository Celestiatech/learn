import PageLayout from '../components/PageLayout'
import { buildCanonicalUrl, defaultMeta } from '../lib/seo'

const faqs = [
  {
    question: 'How is Learning Collective different from other coding platforms?',
    answer:
      'We merge challenge-based certifications with instant references so you always know what to build next and how to build it. Every mission includes context, runnable examples, and project rubrics.',
  },
  {
    question: 'Do I need prior experience to join?',
    answer:
      'No. Our story-driven curriculum starts with HTML foundations and gradually introduces CSS, JavaScript, React, and backend technologies. You can skip ahead if you already know the fundamentals.',
  },
  {
    question: 'What happens after I finish a track?',
    answer:
      'Completing a track unlocks a portfolio-ready capstone brief, peer review groups, and optional live demo sessions with mentors. You also gain access to the advanced track recommendations.',
  },
  {
    question: 'Is the platform fully self-paced?',
    answer:
      'Yes, but you can join accountability cohorts that provide lightweight deadlines and weekly feedback. Our progress tracker nudges you with streaks, reminders, and community shout-outs.',
  },
  {
    question: 'How much does it cost?',
    answer:
      'Core curriculum and references are free. Premium memberships unlock live mentorship, cohort-based reviews, and personalized project feedback. See the pricing page for full details.',
  },
  {
    question: 'Do you offer certificates?',
    answer:
      'Yes. Each track culminates in a certification challenge. Submit your project, receive mentor feedback, and earn a shareable certificate with verification links.',
  },
  {
    question: 'Can teams use Learning Collective?',
    answer:
      'We support team workspaces with custom tracks, reporting, and blended mentorship sessions. Reach out via partners@learningcollective.dev to design a plan for your company.',
  },
  {
    question: 'How do I report an issue or request a feature?',
    answer:
      'Open the in-app feedback widget or email support@learningcollective.dev. We review every message and often ship fixes or improvements within a week.',
  },
]

const faqSeo = {
  keywords: ['SimplyCode FAQ', 'coding platform questions', 'learning collective help'],
  openGraph: {
    type: 'website' as const,
  },
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
    url: buildCanonicalUrl('/faq'),
    publisher: {
      '@type': 'Organization',
      name: defaultMeta.siteName,
      url: defaultMeta.canonical,
    },
  },
}

export default function FAQPage() {
  return (
    <PageLayout
      eyebrow="Frequently asked questions"
      title="Answers to common questions about SimplyCode"
      description="Learn how SimplyCode guides your journey, how cohorts work, and the best ways to use lessons, tasks, and the “Next Task” progression system."
      seo={faqSeo}
    >
      <section className="space-y-6">
        {faqs.map((faq) => (
          <article
            key={faq.question}
            className="rounded-2xl border border-soft bg-surface-card p-6 text-left shadow-[0_22px_60px_-40px_rgba(var(--primary--700-rgb),0.2)] transition hover:-translate-y-1 hover:shadow-[0_26px_66px_-38px_rgba(var(--primary--700-rgb),0.28)]"
          >
            <h2 className="text-lg font-semibold text-heading">{faq.question}</h2>
            <p className="mt-2 text-sm text-secondary">{faq.answer}</p>
          </article>
        ))}
      </section>
    </PageLayout>
  )
}

