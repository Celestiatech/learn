import PageLayout from '../components/PageLayout'
import { buildCanonicalUrl, defaultMeta } from '../lib/seo'

const sections = [
  {
    title: '1. Information we collect',
    paragraphs: [
      'We collect account details (name, email, password), profile information you choose to share, and activity data generated as you progress through missions.',
      'We also gather limited usage analytics (pages visited, device type, approximate location) to improve the curriculum and site performance. We never sell your data.',
    ],
  },
  {
    title: '2. How we use your information',
    paragraphs: [
      'To personalize your learning path, track certifications, and surface relevant missions.',
      'To send product updates, feedback requests, and community announcements—only with your consent.',
      'To monitor for platform abuse, troubleshoot issues, and secure your account.',
    ],
  },
  {
    title: '3. Data sharing',
    paragraphs: [
      'We share minimal data with trusted processors (payment providers, analytics tools, email services) who are bound by confidentiality and data protection agreements.',
      'We may release information if required by law or to protect the rights, property, or safety of Learning Collective and its users.',
    ],
  },
  {
    title: '4. Your choices',
    paragraphs: [
      'Access, update, or delete your account data at any time from settings or by contacting support@learningcollective.dev.',
      'Opt out of marketing emails directly from any message footer.',
      'Request a portable export of your mission activity and certification records.',
    ],
  },
  {
    title: '5. Data retention & security',
    paragraphs: [
      'We retain your data while your account is active and for a reasonable period afterward to support reactivation or compliance requirements.',
      'We use encryption in transit and at rest, enforce least-privilege access, and regularly audit our infrastructure.',
    ],
  },
  {
    title: '6. International transfers',
    paragraphs: [
      'Our infrastructure is distributed. When data moves across borders, we rely on standard contractual clauses and equivalent safeguards.',
    ],
  },
  {
    title: '7. Updates to this policy',
    paragraphs: [
      'We will notify you via email and in-app announcements before significant updates. Continued use of the platform after changes indicates acceptance.',
    ],
  },
]

const privacySeo = {
  openGraph: {
    type: 'article' as const,
  },
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'PrivacyPolicy',
    name: 'SimplyCode Privacy Policy',
    url: buildCanonicalUrl('/privacy'),
    publisher: {
      '@type': 'Organization',
      name: defaultMeta.siteName,
      url: defaultMeta.canonical,
    },
    dateModified: '2025-03-01',
    description:
      'Transparency is core to Learning Collective. This policy explains the information we collect, why we collect it, and how you remain in control.',
  },
}

export default function PrivacyPage() {
  return (
    <PageLayout
      eyebrow="Privacy policy"
      title="How we protect and use your data"
      description="Transparency is core to Learning Collective. This policy explains the information we collect, why we collect it, and how you remain in control."
      seo={privacySeo}
    >
      <section className="space-y-8 glass-card glass-card-hover p-8">
        {sections.map((section) => (
          <article key={section.title} className="space-y-3">
            <h2 className="text-lg font-semibold text-white">{section.title}</h2>
            {section.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-sm text-slate-300">
                {paragraph}
              </p>
            ))}
          </article>
        ))}
        <footer className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 text-sm text-slate-300">
          Effective date: March 1, 2025. Contact support@learningcollective.dev with privacy questions or requests.
        </footer>
      </section>
    </PageLayout>
  )
}

