import PageLayout from '../components/PageLayout'
import { buildCanonicalUrl, defaultMeta } from '../lib/seo'

const openings = [
  {
    title: 'Curriculum Architect (Web Foundations)',
    location: 'Remote · North America / Europe',
    type: 'Full-time',
    description:
      'Design mission-based HTML, CSS, and JavaScript tracks with inclusive pedagogy and real-world project briefs.',
    responsibilities: [
      'Author lesson narratives, assessments, and rubrics',
      'Collaborate with design to build interactive references',
      'Host live workshops and mentor cohorts bi-weekly',
    ],
  },
  {
    title: 'Product Engineer (Learning Tools)',
    location: 'Remote · Any timezone',
    type: 'Full-time',
    description:
      'Ship delightful authoring tools, real-time collaboration, and analytics that keep learners motivated.',
    responsibilities: [
      'Own features across Next.js, React, and Node services',
      'Instrument product metrics and ship experiments weekly',
      'Partner with designers to polish animations and accessibility',
    ],
  },
  {
    title: 'Mentor Lead (Front-end)',
    location: 'Remote · Americas / Africa',
    type: 'Part-time',
    description:
      'Guide learners through project reviews, provide actionable feedback, and shape the mentorship experience.',
    responsibilities: [
      'Review 10–15 projects per week with async video feedback',
      'Lead small group sessions focused on front-end patterns',
      'Improve our feedback libraries and rubric guidelines',
    ],
  },
]

const benefits = [
  'Remote-first with flexible schedules and 4-day work weeks once a quarter',
  'Generous learning stipend for courses, conferences, and hardware',
  'Wellness budget for mental health, fitness, or creative hobbies',
  'Company off-sites twice a year to co-create new missions',
  'Transparent salary bands and equity for full-time roles',
]

const careersSeo = {
  openGraph: {
    type: 'website' as const,
  },
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'SimplyCode Open Roles',
      url: buildCanonicalUrl('/careers'),
      itemListElement: openings.map((opening, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'JobPosting',
          title: opening.title,
          description: opening.description,
          employmentType: opening.type,
          hiringOrganization: {
            '@type': 'Organization',
            name: defaultMeta.siteName,
            sameAs: defaultMeta.canonical,
          },
          jobLocationType: 'TELECOMMUTE',
          applicantLocationRequirements: opening.location,
          validThrough: new Date(Date.now() + 1000 * 60 * 60 * 24 * 180).toISOString(),
          datePosted: new Date().toISOString(),
          directApply: true,
          url: 'mailto:careers@learningcollective.dev',
        },
      })),
    },
  ],
}

export default function CareersPage() {
  return (
    <PageLayout
      eyebrow="Join the team"
      title="Shape the future of joyful developer education"
      description="We’re a distributed team of educators, engineers, and storytellers building a platform that helps learners ship real products."
      heroSlot={
        <a
          href="mailto:careers@learningcollective.dev"
          className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white/40 hover:bg-white/20"
        >
          Send an open application
        </a>
      }
      seo={careersSeo}
    >
      <section className="grid gap-8 glass-card glass-card-hover p-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">Open roles</h2>
          <ul className="space-y-6">
            {openings.map((opening) => (
              <li key={opening.title} className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 shadow-lg shadow-black/30">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
                  <span>{opening.location}</span>
                  <span>{opening.type}</span>
                </div>
                <h3 className="mt-3 text-xl font-semibold text-white">{opening.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{opening.description}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-200">
                  {opening.responsibilities.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>

        <aside className="space-y-6 rounded-2xl border border-white/10 bg-slate-900/40 p-6 shadow-lg shadow-black/30">
          <div>
            <h2 className="text-lg font-semibold text-white">Benefits & culture</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-sky-400" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Interview process</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-300">
              <li>Share your story and past projects via a written application.</li>
              <li>Meet the team for a conversational panel and async exercise.</li>
              <li>Collaborate on a small mission to experience our day-to-day.</li>
            </ol>
          </div>
        </aside>
      </section>
    </PageLayout>
  )
}

