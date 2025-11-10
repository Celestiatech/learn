import { ReactNode } from 'react'
import SiteHeader from './SiteHeader'
import AuroraBackground from './AuroraBackground'
import SiteFooter from './SiteFooter'
import Seo, { SeoProps } from './Seo'

type PageLayoutProps = {
  title: string
  description: string
  eyebrow?: string
  heroSlot?: ReactNode
  seo?: SeoProps
  children: ReactNode
}

export default function PageLayout({ title, description, eyebrow, heroSlot, children, seo }: PageLayoutProps) {
  const seoTitle = seo?.title ?? title
  const seoDescription = seo?.description ?? description

  return (
    <>
      <Seo {...seo} title={seoTitle} description={seoDescription} />

      <div className="relative min-h-screen overflow-hidden bg-[var(--color-page-bg)] text-[var(--color-text-primary)]">
        <AuroraBackground intensity="subtle" />
        <main className="relative z-10 px-6 py-16 sm:px-10 lg:px-16">
          <SiteHeader />
          <header className="mx-auto mt-16 flex w-full max-w-6xl flex-col gap-10 rounded-3xl border border-soft bg-surface-card px-8 py-12 shadow-soft lg:flex-row lg:items-center lg:gap-16 lg:px-16">
            <div className="relative flex-1 space-y-6">
              {eyebrow ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-soft bg-surface-muted px-4 py-1 text-xs font-semibold tracking-[0.16em] text-heading">
                  <span className="h-2 w-2 rounded-full bg-[var(--color-success)]" />
                  {eyebrow}
                </span>
              ) : null}
              <h1 className="text-left text-4xl font-bold text-heading sm:text-5xl lg:text-[3.25rem]">{title}</h1>
              <p className="max-w-xl text-base text-secondary sm:text-lg">{description}</p>
              {heroSlot ? <div className="pt-2">{heroSlot}</div> : null}
            </div>
            <div className="relative flex-1">
              <div className="relative overflow-hidden rounded-3xl border border-soft bg-surface-highlight p-8 shadow-soft">
                <div className="absolute -top-24 right-10 h-40 w-40 rounded-full bg-[rgba(var(--primary--500-rgb),0.15)] blur-[100px]" />
                <div className="absolute -bottom-28 left-8 h-44 w-44 rounded-full bg-[rgba(var(--peridot--600-rgb),0.2)] blur-[120px]" />
                <div className="relative space-y-4">
                  <p className="text-xs tracking-[0.16em] text-secondary">What&apos;s inside</p>
                  <ul className="grid gap-4 text-sm text-heading">
                    <li className="flex items-center justify-between rounded-2xl border border-soft bg-surface-card px-4 py-3">
                      <span>Immersive missions &amp; micro-projects</span>
                      <span className="page-layout-guided-badge rounded-full border border-[rgba(var(--peridot--600-rgb),0.4)] bg-[var(--surface-success)] px-3 py-1 text-xs font-semibold text-[var(--color-success-text)]">
                        Guided
                      </span>
                    </li>
                    <li className="flex items-center justify-between rounded-2xl border border-soft bg-surface-card px-4 py-3">
                      <span>Reference-first documentation &amp; patterns</span>
                      <span className="text-xs text-[var(--color-accent-primary)]">Copy-ready</span>
                    </li>
                    <li className="flex items-center justify-between rounded-2xl border border-soft bg-surface-card px-4 py-3">
                      <span>Cohort events, reviews, and feedback</span>
                      <span className="text-xs text-[var(--color-accent-secondary)]">Weekly</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </header>

          <div className="mx-auto mt-20 max-w-6xl space-y-14 text-[var(--color-text-primary)]">{children}</div>
          <SiteFooter />
        </main>
      </div>
    </>
  )
}

