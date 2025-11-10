import Link from 'next/link'
import SiteHeader from '../../components/SiteHeader'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../lib/authOptions'
import Seo from '../../components/Seo'

const summaryCards = [
  {
    label: 'Active learners',
    value: '42,180',
    delta: '+12.4%',
    description: 'Weekly active users across all tracks',
    gradient:
      'linear-gradient(135deg, rgba(var(--peridot--600-rgb),0.45), rgba(var(--neon--600-rgb),0.32), rgba(var(--primary--500-rgb),0.35))',
  },
  {
    label: 'Certifications issued',
    value: '3,912',
    delta: '+4.8%',
    description: 'Completed capstone projects in the last 30 days',
    gradient:
      'linear-gradient(135deg, rgba(var(--primary--500-rgb),0.4), rgba(var(--meteorite--500-rgb),0.34), rgba(var(--primary--700-rgb),0.35))',
  },
  {
    label: 'Live cohorts',
    value: '18',
    delta: '+2',
    description: 'Active guided cohorts running this week',
    gradient:
      'linear-gradient(135deg, rgba(var(--meteorite--500-rgb),0.38), rgba(var(--primary--600-rgb),0.36), rgba(189, 107, 255, 0.32))',
  },
  {
    label: 'Support tickets',
    value: '27',
    delta: '-35%',
    description: 'Open issues awaiting mentor responses',
    gradient:
      'linear-gradient(135deg, rgba(var(--warning--500-rgb),0.42), rgba(255, 168, 92, 0.34), rgba(var(--danger--600-rgb),0.32))',
  },
]

const users = [
  {
    name: 'Priya Singh',
    email: 'priya@learningcollective.dev',
    track: 'Front-end Frameworks',
    progress: 78,
    status: 'Mentor',
    joined: 'Mar 4, 2025',
  },
  {
    name: 'Hassan Omar',
    email: 'hassan@example.com',
    track: 'Web Foundations',
    progress: 92,
    status: 'Learner',
    joined: 'Feb 26, 2025',
  },
  {
    name: 'Li Wei',
    email: 'li.wei@example.com',
    track: 'JavaScript Essentials',
    progress: 65,
    status: 'Learner',
    joined: 'Mar 7, 2025',
  },
  {
    name: 'Emma Rodríguez',
    email: 'emma@learningcollective.dev',
    track: 'Curriculum Team',
    progress: 100,
    status: 'Admin',
    joined: 'Jan 18, 2025',
  },
]

const tracks = [
  {
    name: 'HTML Story Mode',
    publishedLessons: 12,
    drafts: 2,
    completionRate: '88%',
    trend: '+6.1%',
  },
  {
    name: 'CSS Design Odyssey',
    publishedLessons: 14,
    drafts: 1,
    completionRate: '73%',
    trend: '+3.4%',
  },
  {
    name: 'JavaScript Questline',
    publishedLessons: 18,
    drafts: 3,
    completionRate: '61%',
    trend: '+1.2%',
  },
  {
    name: 'Next.js Atlas',
    publishedLessons: 10,
    drafts: 4,
    completionRate: '48%',
    trend: '+8.9%',
  },
]

const activity = [
  { time: '2 minutes ago', message: 'New learner joined Web Foundations cohort.' },
  { time: '9 minutes ago', message: 'Certification request awaiting review — JavaScript Questline.' },
  { time: '18 minutes ago', message: 'Priya published “Animating Interface Micro Interactions”.' },
  { time: '35 minutes ago', message: 'Support ticket resolved: “Playground not saving snippets”.' },
  { time: '52 minutes ago', message: 'Mentor Hassan left feedback on Mini Project — Micro To-Do.' },
]

export default function AdminDashboard() {
  return (
    <>
      <Seo
        title="Admin dashboard"
        description="Administrative overview for cohorts, learners, and curriculum."
        noindex
        openGraph={{ type: 'website' }}
      />

      <div className="relative min-h-screen overflow-hidden bg-[var(--dark-blue--500)] text-[rgba(226,232,240,0.92)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(var(--meteorite--500-rgb),0.22),transparent_55%),radial-gradient(circle_at_88%_0%,rgba(var(--primary--500-rgb),0.18),transparent_60%),linear-gradient(140deg,rgba(var(--dark-blue--500-rgb),1)_0%,rgba(28,24,72,0.88)_55%,rgba(7,6,20,0.96)_100%)]" />
        <main className="relative z-10 px-6 py-10 sm:px-10 lg:px-16">
          <SiteHeader />

          <header className="mt-10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="badge-pill">Admin control center</p>
              <h1 className="mt-4 text-3xl font-bold text-[rgba(248,249,255,0.95)] sm:text-4xl">Operational dashboard</h1>
              <p className="mt-2 text-sm text-[rgba(200,202,220,0.78)] sm:text-base">
                Monitor learner activity, track curriculum health, and coordinate mentorship.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/courses"
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[rgba(248,249,255,0.92)] transition hover:border-white/40 hover:bg-white/20"
              >
                View site
              </Link>
              <button className="rounded-full bg-[var(--gradient-brand-alt)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-[0_24px_60px_-32px_rgba(var(--primary--800-rgb),0.55)] transition hover:shadow-[0_28px_70px_-30px_rgba(var(--primary--800-rgb),0.62)]">
                New cohort
              </button>
            </div>
          </header>

          <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <article
                key={card.label}
                className={`glass-card glass-card-hover relative overflow-hidden p-6`}
              >
                <div className="pointer-events-none absolute inset-0 opacity-80" style={{ background: card.gradient }} />
                <div className="relative space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[rgba(200,202,220,0.72)]">{card.label}</p>
                  <div className="flex items-end gap-3">
                    <span className="text-3xl font-bold text-[rgba(248,249,255,0.95)]">{card.value}</span>
                    <span className="rounded-full bg-white/15 px-2 py-1 text-xs font-medium text-[rgba(248,249,255,0.92)]">
                      {card.delta}
                    </span>
                  </div>
                  <p className="text-sm text-[rgba(200,202,220,0.72)]">{card.description}</p>
                </div>
              </article>
            ))}
          </section>

          <section className="mt-12 grid gap-8 lg:grid-cols-[1.8fr_1fr]">
            <article className="glass-card glass-card-hover overflow-hidden rounded-3xl p-0">
              <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <div>
                  <h2 className="text-lg font-semibold text-[rgba(248,249,255,0.95)]">Learner directory</h2>
                  <p className="text-xs uppercase tracking-[0.3em] text-[rgba(170,177,209,0.68)]">Recent activity & progression</p>
                </div>
                <Link
                  href="#"
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[rgba(248,249,255,0.92)] transition hover:border-white/40 hover:bg-white/20"
                >
                  Export CSV
                </Link>
              </header>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-3 font-semibold text-[rgba(214,219,244,0.78)]">Learner</th>
                      <th className="px-6 py-3 font-semibold text-[rgba(214,219,244,0.78)]">Track</th>
                      <th className="px-6 py-3 font-semibold text-[rgba(214,219,244,0.78)]">Progress</th>
                      <th className="px-6 py-3 font-semibold text-[rgba(214,219,244,0.78)]">Role</th>
                      <th className="px-6 py-3 font-semibold text-[rgba(214,219,244,0.78)]">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {users.map((user) => (
                      <tr key={user.email} className="hover:bg-white/5">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-[rgba(248,249,255,0.95)]">{user.name}</div>
                          <div className="text-xs text-[rgba(170,177,209,0.68)]">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[rgba(210,214,238,0.8)]">{user.track}</td>
                        <td className="px-6 py-4 text-sm text-[rgba(210,214,238,0.8)]">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-32 overflow-hidden rounded-full bg-white/10">
                              <span
                                className="block h-full rounded-full bg-[linear-gradient(90deg,rgba(var(--peridot--600-rgb),0.9),rgba(var(--primary--500-rgb),0.85),rgba(var(--meteorite--500-rgb),0.8))]"
                                style={{ width: `${user.progress}%` }}
                              />
                            </div>
                            <span>{user.progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[rgba(248,249,255,0.92)]">
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-[rgba(210,214,238,0.8)]">{user.joined}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <aside className="space-y-6">
              <article className="glass-card glass-card-hover p-6">
                <header className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-[rgba(248,249,255,0.95)]">Live activity</h2>
                  <span className="text-xs uppercase tracking-[0.3em] text-[rgba(170,177,209,0.68)]">Real-time feed</span>
                </header>
                <ul className="mt-4 space-y-4 text-sm text-[rgba(210,214,238,0.8)]">
                  {activity.map((item, idx) => (
                    <li key={`${item.time}-${idx}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-[rgba(170,177,209,0.68)]">{item.time}</p>
                      <p className="mt-2 text-sm text-[rgba(248,249,255,0.9)]">{item.message}</p>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="glass-card glass-card-hover p-6">
                <header className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-semibold text-[rgba(248,249,255,0.95)]">Quick actions</h2>
                  <span className="text-xs uppercase tracking-[0.3em] text-[rgba(170,177,209,0.68)]">Shortcuts</span>
                </header>
                <div className="mt-4 grid gap-3">
                  <button className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-left text-sm font-semibold text-[rgba(248,249,255,0.92)] transition hover:border-white/40 hover:bg-white/20">
                    Schedule mentor office hours
                  </button>
                  <button className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-left text-sm font-semibold text-[rgba(248,249,255,0.92)] transition hover:border-white/40 hover:bg-white/20">
                    Publish draft lesson
                  </button>
                  <button className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-left text-sm font-semibold text-[rgba(248,249,255,0.92)] transition hover:border-white/40 hover:bg-white/20">
                    Review pending certifications
                  </button>
                  <button className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-left text-sm font-semibold text-[rgba(248,249,255,0.92)] transition hover:border-white/40 hover:bg-white/20">
                    Send cohort announcement
                  </button>
                </div>
              </article>
            </aside>
          </section>

          <section className="mt-12 glass-card glass-card-hover p-6">
            <header className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-[rgba(248,249,255,0.95)]">Curriculum performance</h2>
                <p className="text-xs uppercase tracking-[0.3em] text-[rgba(170,177,209,0.68)]">Track completion & pipeline</p>
              </div>
              <button className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[rgba(248,249,255,0.92)] transition hover:border-white/40 hover:bg-white/20">
                Manage tracks
              </button>
            </header>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-[rgba(214,219,244,0.78)]">Track</th>
                    <th className="px-6 py-3 font-semibold text-[rgba(214,219,244,0.78)]">Published lessons</th>
                    <th className="px-6 py-3 font-semibold text-[rgba(214,219,244,0.78)]">Drafts</th>
                    <th className="px-6 py-3 font-semibold text-[rgba(214,219,244,0.78)]">Completion rate</th>
                    <th className="px-6 py-3 font-semibold text-[rgba(214,219,244,0.78)]">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {tracks.map((track) => (
                    <tr key={track.name} className="hover:bg-white/5">
                      <td className="px-6 py-4 font-semibold text-[rgba(248,249,255,0.95)]">{track.name}</td>
                      <td className="px-6 py-4 text-sm text-[rgba(210,214,238,0.8)]">{track.publishedLessons}</td>
                      <td className="px-6 py-4 text-sm text-[rgba(210,214,238,0.8)]">{track.drafts}</td>
                      <td className="px-6 py-4 text-sm text-[rgba(210,214,238,0.8)]">{track.completionRate}</td>
                      <td className="px-6 py-4 text-sm text-[rgba(var(--peridot--600-rgb),0.85)]">{track.trend}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    const callback = encodeURIComponent(context.resolvedUrl || '/admin')
    return {
      redirect: {
        destination: `/auth/signin?callbackUrl=${callback}`,
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}

