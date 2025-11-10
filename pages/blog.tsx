import Link from 'next/link'
import PageLayout from '../components/PageLayout'
import { buildCanonicalUrl, defaultMeta } from '../lib/seo'

const posts = [
  {
    title: 'Designing story-driven developer education',
    excerpt: 'Behind the scenes on how we merge narrative arcs with measurable milestones for modern learners.',
    date: 'October 21, 2025',
    readingTime: '7 min read',
    href: '#',
    tag: 'Product',
  },
  {
    title: 'From references to real projects in 30 days',
    excerpt: 'A four-week roadmap that helps learners ship their first portfolio-ready app using our curriculum.',
    date: 'September 15, 2025',
    readingTime: '9 min read',
    href: '#',
    tag: 'Guides',
  },
  {
    title: 'Mentorship rituals that actually work remotely',
    excerpt: 'What we learned running asynchronous cohorts across eight time zones and how you can copy the playbook.',
    date: 'August 30, 2025',
    readingTime: '6 min read',
    href: '#',
    tag: 'Community',
  },
]

const categories = [
  { name: 'Product updates', description: 'New features, missions, and releases.', href: '#' },
  { name: 'Curriculum', description: 'Lesson design, pedagogy, and best practices.', href: '#' },
  { name: 'Community', description: 'Learner spotlights and cohort retrospectives.', href: '#' },
  { name: 'Guides', description: 'Step-by-step plans for building your next project.', href: '#' },
]

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const blogSeo = {
  keywords: ['SimplyCode blog', 'developer education stories', 'coding curriculum updates'],
  openGraph: {
    type: 'blog' as const,
  },
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'SimplyCode journal',
    url: buildCanonicalUrl('/blog'),
    description:
      'Deep dives into curriculum design, mentorship experiments, and learner wins from across the SimplyCode community.',
    publisher: {
      '@type': 'Organization',
      name: defaultMeta.siteName,
      url: defaultMeta.canonical,
    },
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      datePublished: new Date(post.date).toISOString(),
      url: buildCanonicalUrl(`/blog#${slugify(post.title)}`),
      description: post.excerpt,
    })),
  },
}

export default function BlogPage() {
  return (
    <PageLayout
      eyebrow="SimplyCode journal"
      title="Stories, updates, and field notes from the team"
      description="Deep dives into curriculum design, mentorship experiments, and learner wins from across the SimplyCode community."
      seo={blogSeo}
    >
      <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <article className="space-y-6 rounded-3xl border border-soft bg-surface-card p-8 shadow-[0_32px_90px_-55px_rgba(var(--primary--700-rgb),0.22)]">
          <h2 className="text-2xl font-semibold text-heading">Latest posts</h2>
          <ul className="space-y-6">
            {posts.map((post) => (
              <li
                key={post.title}
                className="rounded-2xl border border-soft bg-surface-highlight p-6 shadow-[0_22px_60px_-40px_rgba(var(--primary--700-rgb),0.2)] transition hover:-translate-y-1 hover:shadow-[0_26px_66px_-38px_rgba(var(--primary--700-rgb),0.28)]"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-secondary">{post.tag}</p>
                <h3 className="mt-2 text-xl font-semibold text-heading">{post.title}</h3>
                <p className="mt-2 text-sm text-secondary">{post.excerpt}</p>
                <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted">
                  <span>{post.date}</span>
                  <span>{post.readingTime}</span>
                </div>
                <Link
                  href={post.href}
                  className="mt-6 inline-flex items-center text-sm font-semibold text-[var(--color-accent-primary)] transition hover:text-heading"
                >
                  Read article →
                </Link>
              </li>
            ))}
          </ul>
        </article>
        <aside className="space-y-6 rounded-3xl border border-soft bg-surface-card p-8 shadow-[0_32px_90px_-55px_rgba(var(--primary--700-rgb),0.22)]">
          <div>
            <h2 className="text-lg font-semibold text-heading">Browse by category</h2>
            <ul className="mt-4 space-y-4 text-sm text-secondary">
              {categories.map((category) => (
                <li key={category.name}>
                  <a href={category.href} className="text-[var(--color-accent-primary)] transition hover:text-heading">
                    {category.name}
                  </a>
                  <p className="text-muted">{category.description}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-heading">Subscribe</h2>
            <p className="mt-2 text-sm text-secondary">
              Get monthly notes on new missions, live events, and templates right in your inbox.
            </p>
            <form className="mt-4 space-y-3">
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border border-soft bg-surface-card px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-muted focus:border-strong focus:outline-none focus:ring-2 focus:ring-[rgba(var(--primary--500-rgb),0.3)]"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-[var(--gradient-brand-alt)] px-4 py-3 text-sm font-semibold text-white shadow-[0_24px_60px_-32px_rgba(var(--primary--800-rgb),0.55)] transition hover:shadow-[0_28px_70px_-30px_rgba(var(--primary--800-rgb),0.62)]"
              >
                Join the newsletter
              </button>
            </form>
          </div>
        </aside>
      </section>
    </PageLayout>
  )
}

