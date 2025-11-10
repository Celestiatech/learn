import PageLayout from '../components/PageLayout'
import { buildCanonicalUrl, defaultMeta } from '../lib/seo'

const sections = [
  {
    title: '1. Acceptance of terms',
    points: [
      'By creating an account or accessing the platform, you agree to these Terms of Service and our Privacy Policy.',
      'If you use Learning Collective on behalf of an organization, you confirm that you have authority to bind that organization.',
    ],
  },
  {
    title: '2. Use of the platform',
    points: [
      'You are responsible for maintaining the confidentiality of your account and for all activities under your credentials.',
      'You agree not to misuse the platform, reverse engineer code, or interfere with other learners’ experiences.',
      'We may suspend or terminate accounts that violate these terms or harm the community.',
    ],
  },
  {
    title: '3. Content & intellectual property',
    points: [
      'Learning Collective retains rights to all curriculum materials, designs, and platform features.',
      'You own the projects and content you create. By submitting work for review, you grant us a license to display it within the platform for mentorship, feedback, or showcase purposes.',
    ],
  },
  {
    title: '4. Payments & billing',
    points: [
      'Paid memberships renew automatically until cancelled. You can manage billing from your account settings.',
      'Refunds follow the policy outlined on the pricing page.',
    ],
  },
  {
    title: '5. Disclaimers',
    points: [
      'We provide the platform “as is” without warranties of uninterrupted availability or error-free content.',
      'We are not responsible for third-party services that integrate with the platform.',
    ],
  },
  {
    title: '6. Limitation of liability',
    points: [
      'To the maximum extent permitted by law, Learning Collective is not liable for indirect, incidental, or consequential damages arising from use of the platform.',
    ],
  },
  {
    title: '7. Governing law',
    points: ['These terms are governed by the laws of the State of California, USA, without regard to conflict of law principles.'],
  },
  {
    title: '8. Changes to these terms',
    points: [
      'We may update these terms from time to time. We will provide notice of major changes. Continued use after updates constitutes acceptance.',
    ],
  },
  {
    title: '9. Contact',
    points: ['Questions? Reach us at legal@learningcollective.dev.'],
  },
]

const termsSeo = {
  openGraph: {
    type: 'article' as const,
  },
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'TermsOfService',
    name: 'SimplyCode Terms of Service',
    url: buildCanonicalUrl('/terms'),
    publisher: {
      '@type': 'Organization',
      name: defaultMeta.siteName,
      url: defaultMeta.canonical,
    },
    dateModified: '2025-03-01',
    description:
      'Rules and guidelines for using Learning Collective. Understand your rights and responsibilities as part of the SimplyCode community.',
  },
}

export default function TermsPage() {
  return (
    <PageLayout
      eyebrow="Terms of service"
      title="Rules and guidelines for using Learning Collective"
      description="Please read these terms carefully. They ensure a respectful environment and outline your rights and responsibilities as a member of our community."
      seo={termsSeo}
    >
      <section className="space-y-6 glass-card glass-card-hover p-8">
        {sections.map((section) => (
          <article key={section.title}>
            <h2 className="text-lg font-semibold text-white">{section.title}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
              {section.points.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </article>
        ))}
        <footer className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 text-sm text-slate-300">
          Effective date: March 1, 2025. These terms supersede prior agreements unless otherwise stated.
        </footer>
      </section>
    </PageLayout>
  )
}

