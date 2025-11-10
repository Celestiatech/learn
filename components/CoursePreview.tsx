import Link from 'next/link'

const courses = [
  {
    title: 'HTML Story Mode',
    description: 'Build semantic layouts, accessible patterns, and responsive structures.',
    progress: 72,
    difficulty: 'Beginner',
    status: 'Continue',
  },
  {
    title: 'CSS Design Odyssey',
    description: 'Master modern layouts, fluid grids, and animation systems.',
    progress: 34,
    difficulty: 'Intermediate',
    status: 'Resume',
  },
  {
    title: 'JavaScript Questline',
    description: 'Ship interactive features with test-driven missions and live data.',
    progress: 0,
    difficulty: 'Intermediate',
    status: 'Start course',
  },
]

const difficultyColors: Record<string, string> = {
  Beginner: 'bg-[rgba(var(--peridot--600-rgb),0.12)] text-[var(--color-success-text)] border-[rgba(var(--peridot--600-rgb),0.2)]',
  Intermediate: 'bg-[rgba(var(--primary--500-rgb),0.12)] text-[rgba(var(--primary--600-rgb),0.9)] border-[rgba(var(--primary--500-rgb),0.22)]',
  Advanced: 'bg-[rgba(var(--danger--600-rgb),0.12)] text-[rgba(var(--danger--600-rgb),0.9)] border-[rgba(var(--danger--600-rgb),0.22)]',
}

export default function CoursePreview() {
  return (
    <section className="course-preview-section relative overflow-hidden rounded-[28px] border border-[rgba(103,61,230,0.08)] bg-white px-6 py-16 shadow-[var(--shadow-subtle)] sm:px-10">
      <div className="course-preview-overlay pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(103,61,230,0.12),transparent_65%)]" />
      <div className="relative mx-auto max-w-6xl space-y-12">
        <div className="flex flex-col gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div className="space-y-3">
            <span className="course-preview-badge inline-flex items-center justify-center rounded-full border border-[rgba(103,61,230,0.18)] bg-[rgba(103,61,230,0.08)] px-4 py-1 text-xs font-medium text-[var(--color-heading)]/70">
              Featured curriculum
            </span>
            <h2 className="course-preview-heading text-3xl font-semibold text-[var(--color-heading)] sm:text-4xl">Pick up where you left off</h2>
            <p className="course-preview-subtitle max-w-xl text-sm text-[var(--color-text-secondary)] sm:text-base">
              Every course combines narrative-driven missions, guided practice, and checkpoint reviews. Continue a current track or jump into a new challenge.
            </p>
          </div>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center self-center rounded-full border border-[rgba(103,61,230,0.25)] px-5 py-2 text-xs font-semibold text-[var(--color-heading)] transition hover:border-[rgba(103,61,230,0.5)] hover:text-[var(--primary--600)]"
          >
            Explore all paths
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {courses.map((course) => (
            <article
              key={course.title}
              className="course-card group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[rgba(103,61,230,0.12)] bg-white/95 p-6 shadow-sm shadow-[rgba(31,19,70,0.06)] transition hover:-translate-y-1 hover:shadow-[0_32px_70px_-45px_rgba(31,19,70,0.28)]"
            >
              <div className="course-card-overlay absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 bg-[var(--gradient-brand-soft)]" />
              <div className="relative flex flex-col gap-4">
                <span
                  className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-[11px] font-medium ${difficultyColors[course.difficulty] ?? difficultyColors.Intermediate}`}
                >
                  {course.difficulty}
                </span>
                <h3 className="text-lg font-semibold text-[var(--color-heading)]">{course.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">{course.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]/80">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[rgba(103,61,230,0.1)]">
                    <div
                      className="h-full rounded-full bg-[var(--gradient-brand-alt)] shadow-none"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-[var(--color-text-secondary)]/80">
                  <span>12 lessons · 4 projects</span>
                  <span>4 mentor touchpoints</span>
                </div>
              </div>

              <Link
                href="/courses"
                className="relative mt-8 inline-flex items-center justify-center rounded-full bg-[var(--gradient-brand-alt)] px-5 py-3 text-xs font-semibold text-white shadow-[0_24px_48px_-26px_rgba(var(--primary--700-rgb),0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_56px_-24px_rgba(var(--primary--700-rgb),0.55)]"
              >
                {course.status}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

