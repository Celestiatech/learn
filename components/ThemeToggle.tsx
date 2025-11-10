import { MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { useTheme } from './ThemeProvider'

type ThemeToggleProps = {
  className?: string
  iconOnly?: boolean
}

export default function ThemeToggle({ className = '', iconOnly = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const label = `Switch to ${isDark ? 'light' : 'dark'} mode`

  const baseClasses = iconOnly
    ? 'inline-flex h-10 w-10 items-center justify-center rounded-full border border-soft bg-surface-card text-heading transition hover:border-strong hover:bg-surface-muted hover:text-[var(--color-accent-primary)]'
    : 'inline-flex items-center gap-2 rounded-full border border-soft bg-surface-card px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-heading transition hover:border-strong hover:bg-surface-muted hover:text-[var(--color-accent-primary)]'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`${baseClasses} ${className}`.trim()}
      aria-label={label}
    >
      {isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
      {!iconOnly && (isDark ? 'Light' : 'Dark')}
    </button>
  )
}

