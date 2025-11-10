import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '../components/ThemeProvider'
import { MDXProvider } from '@mdx-js/react'
import { components } from '../components/MDXWrapper'
import { SessionProvider } from 'next-auth/react'
import { useEffect } from 'react'
import { hydrateFromRemote } from '../lib/progress'
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import Seo from '../components/Seo'
import ChatWidget from '../components/ChatWidget'

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

function Bootstrapper() {
  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      try {
        const res = await fetch('/api/progress', { credentials: 'include' })
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled && Array.isArray(data.progress)) {
          hydrateFromRemote(data.progress)
        }
      } catch (error) {
        console.warn('Bootstrap failed:', error)
      }
    }

    bootstrap()

    return () => {
      cancelled = true
    }
  }, [])

  return null
}

export default function App({ Component, pageProps }: AppProps) {
  const { session, ...rest } = pageProps as typeof pageProps & { session?: any }
  return (
    <SessionProvider session={session}>
      <div className={`${sans.variable} ${mono.variable} font-sans`}>
        <ThemeProvider>
          <Seo />
          <Bootstrapper />
          <MDXProvider components={components}>
            <Component {...(rest as any)} />
          </MDXProvider>
          <ChatWidget />
        </ThemeProvider>
      </div>
    </SessionProvider>
  )
}
