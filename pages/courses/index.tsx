import Link from 'next/link'
import SiteFooter from '../../components/SiteFooter'
import SiteHeader from '../../components/SiteHeader'
import Seo from '../../components/Seo'
import { listJourneyCourses } from '../../content/tracks/journey'

const courses = listJourneyCourses()

function getCourseMeta(course: ReturnType<typeof listJourneyCourses>[number]) {
  const totalTasks = course.chapters.reduce((sum, chapter) => sum + chapter.tasks.length, 0)
  const totalChapters = course.chapters.length
  return { totalTasks, totalChapters }
}

export default function CoursesIndexPage() {
  return (
    <>
      <Seo
        title="Guided Course Roadmap"
        description="Story-driven, task-based roadmaps spanning HTML, CSS, JavaScript, and more. Choose your starting point and unlock level-based missions."
        keywords={['coding courses', 'frontend roadmap', 'interactive curriculum']}
      />
      <div className="min-h-screen bg-[var(--color-page-bg)] text-[var(--color-text-primary)]">
        <SiteHeader />
        <main className="mx-auto max-w-6xl space-y-16 px-6 py-16 sm:px-10 lg:px-16">
          <section className="rounded-3xl bg-[var(--gradient-brand-hero)] px-8 py-12 text-white shadow-[var(--shadow-brand-lg)] sm:px-12">
            <div className="space-y-6 text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-white/80">
                Story-driven curriculum
              </span>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Unlock level-based missions across every track
              </h1>
              <p className="mx-auto max-w-3xl text-base text-white/80 sm:text-lg">
                Progress sequentially through HTML, CSS, JavaScript, React, Next.js, PHP, Python, and Laravel adventures.
                Complete a task to reveal the next mission, collect badges, and stay in flow with the “Next Task” system.
              </p>
            </div>
          </section>

          <section className="grid gap-8 md:grid-cols-2">
            {courses.map((course) => {
              const { totalTasks, totalChapters } = getCourseMeta(course)

              return (
                <article
                  key={course.id}
                  className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-soft bg-surface-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_32px_70px_-45px_rgba(31,19,70,0.25)]"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">{course.category}</p>
                        <h2 className="mt-3 text-2xl font-semibold text-heading">{course.title}</h2>
                      </div>
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gradient-brand-alt)] text-sm font-semibold text-white shadow-[0_20px_46px_-28px_rgba(var(--primary--800-rgb),0.55)]">
                        {totalChapters}
                      </span>
                    </div>
                    <p className="text-sm text-secondary">{course.tagline}</p>
                  </div>

                  <div className="mt-6 space-y-3 text-xs text-secondary">
                    <p className="flex items-center gap-2 text-heading">
                      <span className="inline-flex h-2 w-2 rounded-full bg-[var(--color-success)]" />
                      {totalChapters} chapters · {totalTasks} tasks
                    </p>
                    <p>Certificate: {course.certificate.title}</p>
                    <p>Perk: {course.membershipPerk.title}</p>
                  </div>

                  <Link
                    href={`/courses/${course.id}`}
                    className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-[var(--gradient-brand-alt)] px-5 py-3 text-sm font-semibold tracking-[0.14em] text-white shadow-[0_24px_60px_-32px_rgba(var(--primary--800-rgb),0.55)] transition hover:shadow-[0_28px_70px_-30px_rgba(var(--primary--800-rgb),0.62)]"
                  >
                    Explore track
                  </Link>
                </article>
              )
            })}
          </section>
        </main>
        <SiteFooter />
      </div>
    </>
  )
}
