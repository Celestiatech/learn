import fs from 'fs'
import path from 'path'
import { GetStaticPaths, GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import LessonControls from '../../components/LessonControls'
import ProgressBar from '../../components/ProgressBar'
import InteractiveLesson from '../../components/InteractiveLesson'
import SiteHeader from '../../components/SiteHeader'
import AuroraBackground from '../../components/AuroraBackground'
import { interactiveLessons, interactiveLessonSlugs } from '../../content/interactive'
import { useEffect, useState } from 'react'
import { getCompletedForTrack } from '../../lib/progress'
import Seo from '../../components/Seo'
import { getLessonSeo } from '../../lib/seo'

type Props = {
  slug: string
  trackId: string | null
  nextSlug?: string | null
  trackTitle?: string | null
  totalLessons?: number
}

export default function LessonPage({ slug, trackId, nextSlug, trackTitle, totalLessons = 0 }: Props) {
  const router = useRouter()
  const interactive = interactiveLessons[slug]
  const stepParam = router.query.step
  const parsedStep = Array.isArray(stepParam) ? parseInt(stepParam[0] ?? '', 10) : typeof stepParam === 'string' ? parseInt(stepParam, 10) : 0
  const initialStepIndex = Number.isFinite(parsedStep) ? parsedStep : 0

  const Content = !interactive ? dynamic(() => import(`../../content/lessons/${slug}.mdx`)) : null
  const [completedCount, setCompletedCount] = useState(0)

  const metadata = getLessonSeo({
    title: interactive ? interactive.title : slug,
    description: interactive?.description,
    slug,
  })

  useEffect(() => {
    if (trackId) {
      setCompletedCount(getCompletedForTrack(trackId))
    }
  }, [trackId])

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--color-page-bg)] text-[var(--color-text-primary)]">
      <Seo {...metadata} />
      <AuroraBackground intensity="subtle" />
      <main className="relative z-10 px-6 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
          <SiteHeader />
          <header className="relative overflow-hidden rounded-3xl border border-soft bg-surface-card p-8 text-left shadow-[0px_25px_45px_-30px_rgba(var(--primary--700-rgb),0.28)]">
            <div className="absolute -top-28 right-8 h-60 w-60 rounded-full bg-[rgba(var(--primary--500-rgb),0.18)] blur-[110px]" />
            <div className="absolute -bottom-28 left-8 h-60 w-60 rounded-full bg-[rgba(var(--peridot--600-rgb),0.18)] blur-[110px]" />
            <div className="relative space-y-6">
              {trackTitle ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-soft bg-surface-muted px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-heading">
                  <span className="h-2 w-2 rounded-full bg-[var(--color-success)]" />
                  {trackTitle}
                </span>
              ) : null}
              <h1 className="text-3xl font-semibold text-heading sm:text-4xl">
                {interactive ? interactive.title : slug}
              </h1>
              {interactive ? (
                <p className="text-sm text-secondary sm:text-base">{interactive.description}</p>
              ) : null}
              {trackId ? (
                <div className="mt-6">
                  <ProgressBar value={completedCount} max={totalLessons || 0} />
                </div>
              ) : null}
            </div>
          </header>

          {interactive && <InteractiveLesson lesson={interactive} initialStepIndex={initialStepIndex} />}

          {!interactive && Content ? (
            <article className="prose max-w-none rounded-3xl border border-soft bg-surface-card p-8 shadow-[0_32px_90px_-55px_rgba(var(--primary--700-rgb),0.22)]">
              <Content />
            </article>
          ) : null}

          <LessonControls trackId={trackId} slug={slug} nextSlug={nextSlug} />
        </div>
      </main>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const lessonsDir = path.join(process.cwd(), 'content', 'lessons')
  const files = fs.readdirSync(lessonsDir)
  const slugSet = new Set<string>()

  files
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .forEach((f) => slugSet.add(f.replace(/\.mdx?$/, '')))

  interactiveLessonSlugs.forEach((slug) => slugSet.add(slug))

  const paths = Array.from(slugSet).map((slug) => ({ params: { slug } }))

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = String(params?.slug || '')
  // read tracks manifest to find which track this lesson belongs to and the next lesson
  const tracksPath = path.join(process.cwd(), 'content', 'tracks', 'tracks.json')
  let trackId: string | null = null
  let nextSlug: string | null = null
  let trackTitle: string | null = null
  try {
    const raw = fs.readFileSync(tracksPath, 'utf-8')
    const tracks = JSON.parse(raw) as Record<string, { title: string, lessons: string[] }>
    for (const [id, t] of Object.entries(tracks)){
      const idx = t.lessons.indexOf(slug)
      if(idx !== -1){
        trackId = id
        trackTitle = t.title
        if(idx+1 < t.lessons.length) nextSlug = t.lessons[idx+1]
        const totalLessons = t.lessons.length
        return { props: { slug, trackId, nextSlug, trackTitle, totalLessons } }
      }
    }
  } catch (e) {
    // ignore
  }

  return { props: { slug, trackId, nextSlug, trackTitle } }
}
