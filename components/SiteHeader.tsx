import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDownIcon, Cross2Icon, HamburgerMenuIcon } from '@radix-ui/react-icons'
import { signOut, useSession } from 'next-auth/react'
import ThemeToggle from './ThemeToggle'

type NavLink = {
  href: string
  label: string
  children?: Array<{ href: string; label: string; description?: string }>
}

const navLinks: NavLink[] = [
  {
    href: '/pricing',
    label: 'Pricing',
    children: [
      { href: '/pricing#plans', label: 'Plans & tiers', description: 'Flexible options for solo learners and teams.' },
      { href: '/pricing#billing', label: 'Billing support', description: 'Invoicing, receipts, and payment management.' },
      { href: '/pricing#scholarships', label: 'Scholarships', description: 'Apply for discounts and community grants.' },
    ],
  },
  {
    href: '/#features',
    label: 'Services',
    children: [
      { href: '/#curriculum', label: 'Curriculum tracks', description: 'Structured paths that guide your progression.' },
      { href: '/#features', label: 'Mentor sessions', description: 'Book time with mentors for feedback and coaching.' },
      { href: '/#resources', label: 'Resource hub', description: 'Templates, briefs, and project starter kits.' },
    ],
  },
  {
    href: '/courses',
    label: 'Explore',
    children: [
      { href: '/courses', label: 'All courses', description: 'Browse every mission and specialty path.' },
      { href: '/playground', label: 'Interactive playground', description: 'Experiment inside the Monaco-powered editor.' },
      { href: '/lessons/intro', label: 'Try a lesson', description: 'Preview a guided lesson with instant feedback.' },
    ],
  },
  {
    href: '/contact',
    label: 'Support',
    children: [
      { href: '/faq', label: 'FAQ', description: 'Answers about onboarding, curriculum, and billing.' },
      { href: '/contact', label: 'Contact us', description: 'Reach our team for personalised assistance.' },
      { href: '/blog', label: 'Help center', description: 'Tutorials, release notes, and platform updates.' },
    ],
  },
]

type SiteHeaderProps = {
  onOpenOnboarding?: () => void
}

export default function SiteHeader({ onOpenOnboarding }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const { data: session, status } = useSession()

  const isLoading = status === 'loading'
  const isAuthenticated = status === 'authenticated'
  const displayName = session?.user?.name || session?.user?.email || 'Learner'
  const avatarImage = session?.user?.image
  const avatarInitials = displayName
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const avatarHref = isAuthenticated ? '/profile' : '/auth/signin'

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('SiteHeader: session status', status, session)
    }
  }, [session, status])

  const handleNavigate = () => {
    setMobileOpen(false)
  }

  const toggleSection = (label: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }))
  }

  return (
    <header className="relative z-40">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 rounded-full border border-soft bg-surface-card px-4 text-heading shadow-soft backdrop-blur-md sm:px-6 lg:h-20 lg:px-10">
        <Link href="/" className="group flex flex-shrink-0 items-center gap-4">
          <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-[18px] bg-[var(--gradient-brand-alt)] text-white shadow-[0_18px_36px_-20px_rgba(var(--primary--800-rgb),0.45)] transition duration-300 group-hover:scale-105 group-hover:shadow-[0_22px_44px_-20px_rgba(var(--primary--800-rgb),0.55)]">
            <span
              className="absolute inset-0 rounded-[18px] bg-gradient-to-br from-[var(--color-success)] via-[var(--color-accent-primary)] to-[var(--neon--600)] opacity-0 transition duration-300 group-hover:opacity-100"
              aria-hidden="true"
            />
            <span className="relative text-lg font-semibold tracking-[0.2em]">{'</>'}</span>
          </span>
          <span className="flex flex-col leading-tight">
            <span className="bg-gradient-to-r from-[var(--color-accent-primary)] via-[var(--color-success)] to-[var(--neon--600)] bg-clip-text text-lg font-semibold tracking-tight text-transparent transition duration-300 group-hover:tracking-wide">
              SimplyCode
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.32em] text-secondary transition duration-300 group-hover:text-heading">
              Learn | Build | Ship
            </span>
          </span>
        </Link>

        <div className="flex flex-1 items-center justify-end gap-3">
          <div className="hidden items-center gap-6 text-sm font-semibold text-secondary lg:flex">
            {navLinks.map((link) => (
              <div key={link.label} className="group relative">
                <Link
                  href={link.href}
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[13px] tracking-[0.16em] transition hover:bg-surface-muted hover:text-heading"
                >
                  {link.label}
                  {link.children ? <ChevronDownIcon className="h-3.5 w-3.5 transition duration-200 group-hover:rotate-180" /> : null}
                </Link>

                {link.children ? (
                  <div className="pointer-events-none absolute left-0 top-full z-50 w-72 pt-3 -translate-y-1 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="rounded-2xl border border-soft bg-surface-card p-4 shadow-soft">
                      <ul className="grid gap-3 text-sm">
                        {link.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="group/item block rounded-xl border border-transparent p-3 transition hover:border-[var(--color-accent-primary)] hover:bg-surface-muted"
                            >
                              <span className="text-[13px] font-semibold tracking-[0.12em] text-heading">{child.label}</span>
                              {child.description ? (
                                <span className="mt-1 block text-xs font-medium text-secondary">{child.description}</span>
                              ) : null}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <ThemeToggle iconOnly className="hidden lg:inline-flex" />

          <Link
            href={avatarHref}
            aria-label={isAuthenticated ? 'Open profile' : 'Sign in'}
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-soft bg-surface-card text-xs font-semibold uppercase tracking-wide text-heading shadow-sm transition hover:border-strong hover:text-[var(--color-accent-primary)] lg:inline-flex"
          >
            {avatarImage ? (
              <Image src={avatarImage} alt={displayName} width={40} height={40} className="h-full w-full rounded-full object-cover" />
            ) : (
              avatarInitials || 'SC'
            )}
          </Link>
          <Link
            href={avatarHref}
            aria-label={isAuthenticated ? 'Open profile' : 'Sign in'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-soft bg-surface-card text-xs font-semibold uppercase tracking-wide text-heading shadow-sm transition hover:border-strong hover:text-[var(--color-accent-primary)] lg:hidden"
          >
            {avatarImage ? (
              <Image src={avatarImage} alt={displayName} width={40} height={40} className="h-full w-full rounded-full object-cover" />
            ) : (
              avatarInitials || 'SC'
            )}
          </Link>
          <ThemeToggle iconOnly className="lg:hidden" />

          <button
            className="inline-flex items-center justify-center rounded-full border border-soft bg-surface-card p-2 text-heading shadow-sm transition hover:border-strong hover:text-[var(--color-accent-primary)] lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
          >
            <HamburgerMenuIcon className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-[var(--color-page-bg)]/95 backdrop-blur-xl">
          <div className="flex items-center justify-between px-5 py-4">
            <Link href="/" className="group flex items-center gap-3 text-heading" onClick={handleNavigate}>
              <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-[18px] bg-[var(--gradient-brand-alt)] text-white shadow-[0_18px_36px_-20px_rgba(var(--primary--800-rgb),0.45)] transition duration-300 group-hover:scale-105 group-hover:shadow-[0_22px_44px_-20px_rgba(var(--primary--800-rgb),0.55)]">
                <span
                  className="absolute inset-0 rounded-[18px] bg-gradient-to-br from-[var(--color-success)] via-[var(--color-accent-primary)] to-[var(--neon--600)] opacity-0 transition duration-300 group-hover:opacity-100"
                  aria-hidden="true"
                />
                <span className="relative text-lg font-semibold tracking-[0.2em]">{'</>'}</span>
              </span>
              <span className="ml-3 flex flex-col leading-tight">
                <span className="bg-gradient-to-r from-[var(--color-accent-primary)] via-[var(--color-success)] to-[var(--neon--600)] bg-clip-text text-lg font-semibold tracking-tight text-transparent transition duration-300 group-hover:tracking-wide">
                  SimplyCode
                </span>
                <span className="text-[11px] font-medium uppercase tracking-[0.32em] text-secondary transition duration-300 group-hover:text-heading">
                  Learn | Build | Ship
                </span>
              </span>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="rounded-full border border-soft bg-surface-card p-2 text-heading hover:border-strong hover:text-[var(--color-accent-primary)]"
              aria-label="Close navigation menu"
            >
              <Cross2Icon className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 pb-6">
            <div className="rounded-3xl border border-soft bg-surface-card p-5 shadow-soft">
              <ThemeToggle className="w-full justify-center border border-soft bg-surface-card text-heading" />
              <div className="mt-5 grid gap-2">
                {navLinks.map((link) => {
                  const isOpen = openSections[link.label]
                  const hasChildren = Boolean(link.children?.length)

                  return (
                    <div key={link.label} className="rounded-2xl border border-soft bg-surface-card p-1">
                      <div className="flex items-center">
                        <Link
                          href={link.href}
                          className="flex-1 rounded-2xl px-4 py-3 text-sm font-semibold tracking-[0.1em] text-heading transition hover:text-[var(--color-accent-primary)]"
                          onClick={handleNavigate}
                        >
                          {link.label}
                        </Link>
                        {hasChildren ? (
                          <button
                            type="button"
                            onClick={() => toggleSection(link.label)}
                            aria-expanded={isOpen}
                            className="rounded-full p-2 text-secondary transition hover:text-[var(--color-accent-primary)]"
                            aria-label={`Toggle ${link.label} menu`}
                          >
                            <ChevronDownIcon
                              className={`h-4 w-4 transition-transform duration-200 ${
                                isOpen ? 'rotate-180 text-[var(--color-accent-primary)]' : ''
                              }`}
                            />
                          </button>
                        ) : null}
                      </div>

                      {hasChildren ? (
                        <div
                          className={`grid gap-2 overflow-hidden px-2 pb-0 transition-[max-height,opacity,transform] duration-200 ${
                            isOpen ? 'max-h-64 translate-y-0 opacity-100 pt-2' : 'max-h-0 -translate-y-1 opacity-0'
                          }`}
                        >
                          {link.children?.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="rounded-xl border border-soft bg-surface-card px-3 py-2 text-xs font-medium tracking-[0.08em] text-secondary transition hover:border-strong hover:text-heading"
                              onClick={handleNavigate}
                            >
                              <span className="block text-[13px] font-semibold text-heading">{child.label}</span>
                              {child.description ? (
                                <span className="mt-1 block text-[11px] font-medium text-secondary">{child.description}</span>
                              ) : null}
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
              <div className="mt-5 space-y-2">
                {isLoading ? (
                  <div className="h-10 w-full animate-pulse rounded-full border border-soft bg-surface-muted/60" />
                ) : isAuthenticated ? (
                  <>
                    <Link
                      href="/profile"
                      className="block rounded-full border border-soft bg-surface-card px-4 py-3 text-center text-xs font-semibold tracking-[0.12em] text-heading transition hover:border-strong hover:text-[var(--color-accent-primary)]"
                      onClick={handleNavigate}
                    >
                      <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[var(--color-success)]" />
                      {displayName}
                    </Link>
                    <Link
                      href="/lessons/intro"
                      className="block rounded-full bg-gradient-to-r from-[var(--color-success)] to-[var(--neon--600)] px-4 py-3 text-center text-xs font-semibold tracking-[0.12em] text-white shadow-[0_18px_36px_-16px_rgba(var(--peridot--600-rgb),0.45)] transition hover:shadow-[0_22px_42px_-14px_rgba(var(--peridot--600-rgb),0.55)]"
                      onClick={handleNavigate}
                    >
                      Resume learning
                    </Link>
                    <button
                      onClick={() => {
                        handleNavigate()
                        signOut({ callbackUrl: '/' })
                      }}
                      className="w-full rounded-full border border-soft bg-surface-card px-4 py-3 text-xs font-semibold tracking-[0.12em] text-heading transition hover:border-strong hover:text-[var(--color-accent-primary)]"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    {onOpenOnboarding ? (
                      <button
                        onClick={() => {
                          handleNavigate()
                          onOpenOnboarding()
                        }}
                        className="w-full rounded-full border border-soft bg-surface-card px-4 py-3 text-xs font-semibold tracking-[0.12em] text-heading transition hover:border-strong hover:text-[var(--color-accent-primary)]"
                      >
                        Join Beta
                      </button>
                    ) : (
                      <Link
                        href="/courses"
                        className="block rounded-full border border-soft bg-surface-card px-4 py-3 text-center text-xs font-semibold tracking-[0.12em] text-heading transition hover:border-strong hover:text-[var(--color-accent-primary)]"
                        onClick={handleNavigate}
                      >
                        Explore Courses
                      </Link>
                    )}
                    <Link
                      href="/auth/signin"
                      className="block rounded-full border border-soft bg-surface-card px-4 py-3 text-center text-xs font-semibold tracking-[0.12em] text-heading transition hover:border-strong hover:text-[var(--color-accent-primary)]"
                      onClick={handleNavigate}
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/auth/register"
                      className="block rounded-full bg-gradient-to-r from-[var(--color-success)] to-[var(--neon--600)] px-4 py-3 text-center text-xs font-semibold tracking-[0.12em] text-white shadow-[0_18px_36px_-16px_rgba(var(--peridot--600-rgb),0.45)] transition hover:shadow-[0_22px_42px_-14px_rgba(var(--peridot--600-rgb),0.55)]"
                      onClick={handleNavigate}
                    >
                      Create account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}

