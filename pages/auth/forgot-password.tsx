import Link from 'next/link'
import { FormEvent, useMemo, useState } from 'react'
import Seo from '../../components/Seo'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const canSubmit = useMemo(() => Boolean(!loading && email.trim().length > 0), [loading, email])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = (await response.json().catch(() => null)) as { error?: string; message?: string } | null

      if (!response.ok) {
        throw new Error(data?.error || 'Unable to send reset instructions.')
      }

      setSuccess(data?.message ?? 'If an account exists for that email, we’ve sent password reset instructions.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send reset instructions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Seo
        title="Forgot password"
        description="Receive a secure link to reset your SimplyCode password."
        noindex
      />
      <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
        <div className="mx-auto max-w-md space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-fuchsia-500/20 backdrop-blur">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold text-white">Forgot your password?</h1>
            <p className="text-sm text-slate-300">
              Enter the email associated with your SimplyCode account and we&apos;ll send you a reset link.
            </p>
          </div>

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
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-fuchsia-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40"
                autoComplete="email"
              />
            </div>
            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
            {success ? (
              <p className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                {success}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full rounded-full bg-gradient-to-r from-fuchsia-400 via-sky-500 to-indigo-500 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Sending link…' : 'Send reset link'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-300">
            Remembered your password?{' '}
            <Link href="/auth/signin" className="font-semibold text-emerald-300 hover:text-emerald-200">
              Back to sign in
            </Link>
          </p>
        </div>
      </main>
    </>
  )
}

