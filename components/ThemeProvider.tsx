import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'

type Theme = 'light' | 'dark'

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const STORAGE_KEY = 'learning-collective:theme'

function getPreferredTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const userId = session?.user?.id

  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark'
    const initial = getPreferredTheme()
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = initial
    }
    return initial
  })
  const [serverThemeLoaded, setServerThemeLoaded] = useState(false)
  const lastPersistedThemeRef = useRef<string | null>(null)
  const lastUserIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const initial = getPreferredTheme()
    setThemeState(initial)
  }, [])

  useEffect(() => {
    if (status === 'authenticated' && userId && lastUserIdRef.current !== userId) {
      lastUserIdRef.current = userId
      setServerThemeLoaded(false)
      lastPersistedThemeRef.current = null
    } else if (status !== 'authenticated' || !userId) {
      lastUserIdRef.current = null
      setServerThemeLoaded(true)
      lastPersistedThemeRef.current = null
    }
  }, [status, userId])

  useEffect(() => {
    if (status === 'loading') return
    if (!userId) {
      return
    }
    if (serverThemeLoaded) return

    let cancelled = false

    async function loadThemePreference() {
      try {
        const response = await fetch('/api/preferences?key=theme')
        if (!response.ok) return
        const data = (await response.json().catch(() => null)) as { preferences?: Record<string, unknown> } | null
        const serverTheme = data?.preferences?.theme
        if (!cancelled && (serverTheme === 'light' || serverTheme === 'dark')) {
          setThemeState(serverTheme)
          lastPersistedThemeRef.current = serverTheme
        }
      } catch (error) {
        console.warn('Failed to load theme preference', error)
      } finally {
        if (!cancelled) {
          setServerThemeLoaded(true)
        }
      }
    }

    loadThemePreference()

    return () => {
      cancelled = true
    }
  }, [status, userId, serverThemeLoaded])

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    if (!userId || status !== 'authenticated' || !serverThemeLoaded) {
      return
    }
    if (lastPersistedThemeRef.current === theme) {
      return
    }

    const controller = new AbortController()

    async function persistThemePreference() {
      try {
        await fetch('/api/preferences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ key: 'theme', value: theme }),
          signal: controller.signal,
        })
        lastPersistedThemeRef.current = theme
      } catch (error) {
        if (controller.signal.aborted) return
        console.warn('Failed to save theme preference', error)
      }
    }

    persistThemePreference()

    return () => {
      controller.abort()
    }
  }, [theme, userId, status, serverThemeLoaded])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme: setThemeState,
      toggleTheme: () => setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark')),
    }),
    [theme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return ctx
}

