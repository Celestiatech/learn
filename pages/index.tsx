import { useState } from 'react'
import OnboardingModal from '../components/OnboardingModal'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import HeroSection from '../components/HeroSection'
import HowItWorks from '../components/HowItWorks'
import CoursePreview from '../components/CoursePreview'
import LessonPreview from '../components/LessonPreview'
import Seo from '../components/Seo'
import { buildCanonicalUrl, defaultMeta } from '../lib/seo'
import CurriculumExplorer from '../components/CurriculumExplorer'

export default function Home() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Seo
        title="Learn to Code. Step by Step."
        description="Modern interactive coding lessons, task-by-task progress, and smart guidance to help you ship real projects."
        openGraph={{
          images: [
            {
              url: '/logo-simplecode.svg',
              width: 512,
              height: 512,
              alt: 'SimplyCode logo',
              type: 'image/svg+xml',
            },
          ],
        }}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'EducationalOrganization',
          name: defaultMeta.siteName,
          url: defaultMeta.canonical,
          description: defaultMeta.description,
          logo: buildCanonicalUrl('/logo-simplecode.svg'),
          sameAs: ['https://twitter.com/SimplyCodeHQ', 'https://www.linkedin.com/company/simplycode'],
        }}
      />

      <div className="min-h-screen bg-[var(--color-page-bg)] text-[var(--color-text-primary)]">
        <SiteHeader onOpenOnboarding={() => setOpen(true)} />
        <main className="mx-auto max-w-6xl space-y-20 px-6 py-16 sm:px-10 lg:px-14">
          <HeroSection onOpenOnboarding={() => setOpen(true)} />
          <HowItWorks />
          <CoursePreview />
          <LessonPreview />
          <CurriculumExplorer />
        </main>

        <SiteFooter />
      </div>
      <OnboardingModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
