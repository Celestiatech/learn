import { getProviders, signIn, useSession } from 'next-auth/react'
import { GetServerSideProps } from 'next'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Seo from '../../components/Seo'

interface SignInProps {
  providers: Record<string, any>
}

export default function SignIn({ providers }: SignInProps) {
  const router = useRouter()
  const { update: refreshSession } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [magicEmail, setMagicEmail] = useState('')
  const [magicLoading, setMagicLoading] = useState(false)
  const [magicSent, setMagicSent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState<string | null>(null)
  const [resendError, setResendError] = useState<string | null>(null)
  const [resendAvailableIn, setResendAvailableIn] = useState<number | null>(null)

  const callbackUrl = typeof router.query?.callbackUrl === 'string' ? router.query.callbackUrl : '/lessons/intro'
  const verifyErrorMessage = 'Please verify your email before signing in.'

  useEffect(() => {
    if (typeof router.query?.error === 'string') {
      setError(getErrorMessage(router.query.error))
    }
  }, [router.query?.error])

  useEffect(() => {
    if (typeof router.query?.email === 'string') {
      setEmail(router.query.email)
      setMagicEmail(router.query.email)
    }
  }, [router.query?.email])

  useEffect(() => {
    if (typeof router.query?.verified === 'string') {
      const message = getVerificationStatus(router.query.verified)
      if (message) {
        setInfo(message)
      }
    }
  }, [router.query?.verified])

  useEffect(() => {
    if (typeof router.query?.reset === 'string') {
      const message = getResetStatus(router.query.reset)
      if (message) {
        setInfo(message)
        setError(null)
      }
    }
  }, [router.query?.reset])

  useEffect(() => {
    if (error === verifyErrorMessage) {
      setResendSuccess(null)
      setResendError(null)
      setResendAvailableIn(5)
    } else {
      setResendAvailableIn(null)
    }
  }, [error, verifyErrorMessage])

  useEffect(() => {
    if (resendAvailableIn === null) {
      return
    }
    if (resendAvailableIn <= 0) {
      setResendAvailableIn(0)
      return
    }
    const timer = setInterval(() => {
      setResendAvailableIn((prev) => {
        if (prev === null) return prev
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [resendAvailableIn])

  const canSubmit = useMemo(() => Boolean(!loading && email.trim() && password.length > 0), [loading, email, password])
  const canSendMagicLink = useMemo(
    () => Boolean(!magicLoading && magicEmail.trim().length > 0),
    [magicLoading, magicEmail],
  )

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setInfo(null)

    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }

    if (!password) {
      setError('Please enter your password.')
      return
    }

    setLoading(true)
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl,
      remember: rememberMe,
    })
    if (res?.error) {
      setError(getErrorMessage(res.error))
      setLoading(false)
      return
    }

    const url = res?.url ?? callbackUrl
    if (refreshSession) {
      try {
        const updated = await refreshSession()
        if (process.env.NODE_ENV !== 'production') {
          console.log('SignIn: session refreshed', updated)
        }
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('SignIn: session refresh failed', err)
        }
      }
    } else if (process.env.NODE_ENV !== 'production') {
      console.log('SignIn: refreshSession unavailable')
    }
    await router.replace(url)
    setLoading(false)
  }

  const handleMagicLink = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setInfo(null)
    setMagicSent(false)
    setMagicLoading(true)

    try {
      const res = await signIn('email', {
        redirect: false,
        email: magicEmail,
        callbackUrl,
      })

      if (res?.error) {
        setError(getErrorMessage(res.error))
        setMagicLoading(false)
        return
      }

      setMagicSent(true)
      setInfo('Magic link sent! Check your inbox to finish signing in.')
    } catch (err) {
      setError('Unable to send magic link. Please try again.')
    } finally {
      setMagicLoading(false)
    }
  }

  const handleResendVerification = async () => {
    if (!email.trim() || resendAvailableIn === null || resendAvailableIn > 0) {
      return
    }

    setResendLoading(true)
    setResendSuccess(null)
    setResendError(null)

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = (await response.json().catch(() => null)) as { error?: string; message?: string } | null

      if (!response.ok) {
        throw new Error(data?.error || 'Unable to resend verification link.')
      }

      setResendSuccess(data?.message ?? 'Verification link sent! Check your email.')
      setResendAvailableIn(45)
    } catch (err) {
      setResendError(err instanceof Error ? err.message : 'Unable to resend verification link. Please try again.')
      setResendAvailableIn(10)
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <>
      <Seo
        title="Sign in"
        description="Access your SimplyCode account to continue your learning journey."
        noindex
        openGraph={{ type: 'website' }}
      />
      <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
        <div className="mx-auto max-w-md space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-sky-500/20 backdrop-blur">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-sm text-slate-300">Use your account to continue learning.</p>
          </div>

          {info ? <p className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">{info}</p> : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Password
              </label>
              <div className="relative mt-2">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
              <label className="flex items-center space-x-2 text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border border-white/10 bg-slate-950 text-emerald-400 focus:ring-sky-500/40"
                />
                <span>Keep me signed in</span>
              </label>
              <Link href="/auth/forgot-password" className="font-semibold text-sky-300 hover:text-sky-200">
                Forgot password?
              </Link>
            </div>
            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
            {error === verifyErrorMessage ? (
              <div className="space-y-2 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm text-amber-200">
                <p>We’ve sent you a verification link. If you can’t find it, you can request another one.</p>
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendLoading || resendAvailableIn === null || resendAvailableIn > 0}
                  className="inline-flex items-center justify-center rounded-full border border-amber-300/40 bg-transparent px-4 py-2 font-semibold uppercase tracking-[0.3em] text-amber-100 hover:border-amber-200 hover:bg-amber-400/20 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {resendLoading
                    ? 'Sending…'
                    : resendAvailableIn && resendAvailableIn > 0
                    ? `Retry in ${resendAvailableIn}s`
                    : 'Resend verification email'}
                </button>
                {resendSuccess ? <p className="text-sm text-emerald-200">{resendSuccess}</p> : null}
                {resendError ? <p className="text-sm text-rose-200">{resendError}</p> : null}
              </div>
            ) : null}
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-500 to-indigo-500 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="space-y-3">
            <p className="text-center text-xs uppercase tracking-[0.3em] text-slate-400">Or continue with</p>
            <div className="grid gap-3">
              {Object.values(providers)
                .filter((provider) => provider.id !== 'credentials')
                .map((provider) => (
                  <button
                    key={provider.name}
                    onClick={() => signIn(provider.id, { callbackUrl })}
                    className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white/40 hover:bg-white/20"
                  >
                    {provider.name}
                  </button>
                ))}
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <h2 className="text-center text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Passwordless sign-in</h2>
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div>
                <label htmlFor="magic-email" className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Email
                </label>
                <input
                  id="magic-email"
                  type="email"
                  value={magicEmail}
                  onChange={(event) => setMagicEmail(event.target.value)}
                  required
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  autoComplete="email"
                />
              </div>
              <button
                type="submit"
                disabled={!canSendMagicLink}
                className="w-full rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200 hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {magicLoading ? 'Sending link…' : 'Email me a sign-in link'}
              </button>
              {magicSent ? <p className="text-center text-sm text-emerald-200">Magic link sent! Check your email.</p> : null}
            </form>
          </div>

          <p className="text-center text-sm text-slate-300">
            New to SimplyCode?{' '}
            <Link href={`/auth/register?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-semibold text-emerald-300 hover:text-emerald-200">
              Create an account
            </Link>
          </p>
        </div>
      </main>
    </>
  )
}

function getErrorMessage(code: string) {
  switch (code) {
    case 'CredentialsSignin':
      return 'Invalid email or password.'
    case 'OAuthSignin':
    case 'OAuthCallback':
      return 'Unable to complete OAuth sign-in. Please try again.'
    case 'AccessDenied':
      return 'Access denied. Please use a different account.'
    default:
      return code || 'Unable to sign in. Please try again.'
  }
}

function getVerificationStatus(code: string) {
  switch (code) {
    case 'success':
      return 'Email verified! You can now sign in.'
    case 'expired':
      return 'Verification link expired. Please request a new one by signing in.'
    case 'invalid':
      return 'Verification link was invalid. Please request a new link.'
    case 'error':
      return 'We ran into an issue verifying your email. Please try again.'
    default:
      return null
  }
}

function getResetStatus(code: string) {
  switch (code) {
    case 'success':
      return 'Password updated! Sign in with your new password.'
    case 'expired':
      return 'Reset link expired. Request a new password reset email.'
    case 'invalid':
      return 'Reset link was invalid or already used. Please try again.'
    default:
      return null
  }
}

export const getServerSideProps: GetServerSideProps<SignInProps> = async () => {
  const providers = await getProviders()
  return {
    props: {
      providers: providers ?? {},
    },
  }
}
