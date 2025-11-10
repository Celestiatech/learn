import Link from 'next/link'

const productLinks = [
  { href: '/courses', label: 'Curriculum tracks' },
  { href: '/playground', label: 'Interactive playground' },
  { href: '/lessons/intro', label: 'Sample lesson' },
]

const companyLinks = [
  { href: '/about', label: 'About' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
]

const resourcesLinks = [
  { href: '/blog', label: 'Blog' },
  { href: '/faq', label: 'FAQ' },
  { href: '/pricing', label: 'Pricing' },
]

export default function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-soft bg-surface-muted backdrop-blur">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--surface-muted)]/70 to-[var(--surface-card)]" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 text-primary sm:px-10 lg:px-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm space-y-4">
            <div className="flex items-center gap-3">
              <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--gradient-brand-alt)] text-white shadow-[0_20px_50px_-28px_rgba(var(--primary--800-rgb),0.55)]">
                <span
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--color-success)] via-[var(--color-accent-primary)] to-[var(--neon--600)] opacity-0 transition duration-300 hover:opacity-100"
                  aria-hidden="true"
                />
                <span className="relative text-sm font-semibold tracking-[0.2em]">{'</>'}</span>
              </span>
              <span className="flex flex-col leading-tight">
                <span className="bg-gradient-to-r from-[var(--color-accent-primary)] via-[var(--color-success)] to-[var(--neon--600)] bg-clip-text text-lg font-semibold tracking-tight text-transparent">
                  SimplyCode
                </span>
                <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-secondary">
                  Learn · Build · Ship
                </span>
              </span>
            </div>
            <p className="text-sm text-secondary">
              An interactive learning platform that guides you through lessons, tasks, and next steps so you stay in flow while building real projects.
            </p>
          </div>

          <div className="grid flex-1 grid-cols-1 gap-8 text-sm text-secondary sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-secondary">Product</p>
              <ul className="mt-4 space-y-2">
                {productLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition hover:text-[var(--color-accent-primary)]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-secondary">Company</p>
              <ul className="mt-4 space-y-2">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition hover:text-[var(--color-accent-primary)]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-secondary">Resources</p>
              <ul className="mt-4 space-y-2">
                {resourcesLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition hover:text-[var(--color-accent-primary)]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-soft pt-6 text-xs text-secondary sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} SimplyCode. Crafted for curious developers.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="transition hover:text-[var(--color-accent-primary)]">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-[var(--color-accent-primary)]">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

