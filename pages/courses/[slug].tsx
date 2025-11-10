import Link from 'next/link'
import { GetStaticPaths, GetStaticProps } from 'next'
import SiteFooter from '../../components/SiteFooter'
import SiteHeader from '../../components/SiteHeader'
import Seo from '../../components/Seo'
import CourseRoadmap from '../../components/CourseRoadmap'
import { getJourneyCourse, listJourneyCourses } from '../../content/tracks/journey'
import { buildCanonicalUrl } from '../../lib/seo'

type CourseDetailPageProps = {
  courseId: string
}

export default function CourseDetailPage({ courseId }: CourseDetailPageProps) {
  const course = getJourneyCourse(courseId)

  if (!course) {
    return null
  }

  const totalChapters = course.chapters.length
  const totalTasks = course.chapters.reduce((sum, chapter) => sum + chapter.tasks.length, 0)

  return (
    <>
      <Seo
        title={`${course.title} Track`}
        description={course.tagline}
        canonical={buildCanonicalUrl(`/courses/${course.id}`)}
        keywords={[course.title, 'SimplyCode course', `${course.category} curriculum`]}
      />
      <div className="min-h-screen bg-[var(--color-page-bg)] text-[var(--color-text-primary)]">
        <SiteHeader />
        <main className="mx-auto max-w-6xl space-y-16 px-6 py-16 sm:px-10 lg:px-16">
          <section className="rounded-3xl border border-soft bg-surface-card px-8 py-12 shadow-soft sm:px-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-soft bg-surface-muted px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-heading">
                  {course.category}
                </span>
                <h1 className="text-4xl font-semibold text-heading sm:text-5xl">{course.title}</h1>
                <p className="max-w-2xl text-sm text-secondary sm:text-base">{course.tagline}</p>
                <div className="flex flex-wrap gap-3 text-xs text-secondary">
                  <span className="rounded-full border border-soft bg-surface-card px-3 py-1">{totalChapters} chapters</span>
                  <span className="rounded-full border border-soft bg-surface-card px-3 py-1">{totalTasks} tasks</span>
                  <span className="rounded-full border border-soft bg-surface-card px-3 py-1">{course.certificate.title}</span>
                </div>
              </div>
              <div className="flex flex-col items-start gap-3 lg:items-end">
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 rounded-full border border-soft bg-surface-card px-4 py-2 text-xs font-semibold tracking-[0.16em] text-secondary transition hover:border-strong hover:text-heading"
                >
                  ← All courses
                </Link>
                <p className="text-xs text-secondary">
                  Membership perk: <span className="font-semibold text-heading">{course.membershipPerk.title}</span>
                </p>
              </div>
            </div>
          </section>

          <CourseRoadmap initialCourseId={course.id} singleCourse />
        </main>
        <SiteFooter />
      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const courses = listJourneyCourses()
  return {
    paths: courses.map((course) => ({ params: { slug: course.id } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<CourseDetailPageProps> = async ({ params }) => {
  const slug = params?.slug
  if (typeof slug !== 'string') {
    return { notFound: true }
  }

  const course = getJourneyCourse(slug)
  if (!course) {
    return { notFound: true }
  }

  return {
    props: {
      courseId: course.id,
    },
  }
}
