import Link from 'next/link'
import { useRouter } from 'next/router'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import Seo from '../../components/Seo'

type PasswordChecks = {
  length: boolean
  uppercase: boolean
  lowercase: boolean
  number: boolean
  symbol: boolean
}

export default function ResetPassword() {
  const router = useRouter()
  const token = typeof router.query?.token === 'string' ? router.query.token : ''
  const email = typeof router.query?.email === 'string' ? router.query.email : ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token || !email) {
      setError('This password reset link is invalid. Please request a new one.')
    }
  }, [token, email])

  const passwordChecks = useMemo<PasswordChecks>(() => {
    const value = password
    return {
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      symbol: /[^A-Za-z0-9]/.test(value),
    }
  }, [password])

  const passwordScore = useMemo(() => Object.values(passwordChecks).filter(Boolean).length, [passwordChecks])
  const passwordStrength = useMemo(() => {
    const labels = ['Very weak', 'Weak', 'Okay', 'Good', 'Strong', 'Excellent']
    return labels[passwordScore] ?? labels[0]
  }, [passwordScore])

  const allPasswordChecksPassed = passwordScore === Object.keys(passwordChecks).length
  const passwordsMatch = password.length > 0 && password === confirmPassword
  const canSubmit = Boolean(!loading && token && email && allPasswordChecksPassed && passwordsMatch)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    if (!token || !email) {
      setError('This password reset link is invalid. Please request a new one.')
      return
    }

    if (!passwordsMatch) {
      setError('Passwords do not match. Please try again.')
      return
    }

    if (!allPasswordChecksPassed) {
      setError('Please choose a stronger password before continuing.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, password }),
      })

      const data = (await response.json().catch(() => null)) as { error?: string; message?: string } | null

      if (!response.ok) {
        throw new Error(data?.error || 'Unable to reset password.')
      }

      setSuccess('Password updated! You can now sign in with your new password.')
      setPassword('')
      setConfirmPassword('')
      setTimeout(() => {
        void router.replace(`/auth/signin?reset=success&email=${encodeURIComponent(email)}`)
      }, 3500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Seo
        title="Reset password"
        description="Choose a new password to regain access to your SimplyCode account."
        noindex
      />
      <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
        <div className="mx-auto max-w-md space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-violet-500/20 backdrop-blur">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold text-white">Reset your password</h1>
            <p className="text-sm text-slate-300">Choose a new password for your SimplyCode account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                New password
              </label>
              <div className="relative mt-2">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={8}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                  autoComplete="new-password"
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
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Confirm new password
              </label>
              <div className="relative mt-2">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
                  aria-label={showConfirmPassword ? 'Hide confirmation password' : 'Show confirmation password'}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-4">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
                <span>Password strength</span>
                <span className={passwordScore >= 4 ? 'text-emerald-300' : 'text-slate-300'}>{passwordStrength}</span>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-400 transition-all duration-200"
                  style={{ width: `${(passwordScore / Object.keys(passwordChecks).length) * 100}%` }}
                  aria-hidden="true"
                />
              </div>
              <ul className="mt-3 space-y-2 text-sm text-slate-400">
                <li className={passwordChecks.length ? 'text-emerald-300' : undefined}>At least 8 characters</li>
                <li className={passwordChecks.uppercase ? 'text-emerald-300' : undefined}>Contains an uppercase letter</li>
                <li className={passwordChecks.lowercase ? 'text-emerald-300' : undefined}>Contains a lowercase letter</li>
                <li className={passwordChecks.number ? 'text-emerald-300' : undefined}>Contains a number</li>
                <li className={passwordChecks.symbol ? 'text-emerald-300' : undefined}>Contains a symbol</li>
              </ul>
              {!passwordsMatch && confirmPassword.length > 0 ? (
                <p className="mt-3 text-sm text-rose-300">Passwords must match.</p>
              ) : null}
            </div>

            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
            {success ? (
              <p className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                {success} Redirecting…
              </p>
            ) : null}
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full rounded-full bg-gradient-to-r from-violet-400 via-sky-500 to-emerald-500 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Updating password…' : 'Update password'}
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

