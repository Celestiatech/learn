import Link from 'next/link'
import { useRouter } from 'next/router'
import { FormEvent, useMemo, useState } from 'react'
import Seo from '../../components/Seo'

export default function Register() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const callbackUrl = typeof router.query?.callbackUrl === 'string' ? router.query.callbackUrl : '/lessons/intro'

  type PasswordChecks = {
    length: boolean
    uppercase: boolean
    lowercase: boolean
    number: boolean
    symbol: boolean
  }

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
  const canSubmit = Boolean(!loading && email.trim() && allPasswordChecksPassed && passwordsMatch && acceptedTerms)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    if (!passwordsMatch) {
      setError('Passwords do not match. Please check and try again.')
      return
    }

    if (!allPasswordChecksPassed) {
      setError('Please choose a stronger password before continuing.')
      return
    }

    if (!acceptedTerms) {
      setError('Please agree to the terms before creating your account.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() || undefined, email: email.trim(), password }),
      })

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(data?.error || 'Registration failed')
      }

      setSuccess('Account created! Check your inbox for a verification link to activate your account.')
      setName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setAcceptedTerms(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Seo
        title="Create account"
        description="Join SimplyCode to personalize your curriculum, track achievements, and access interactive lessons."
        noindex
      />
      <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
        <div className="mx-auto max-w-md space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-emerald-500/20 backdrop-blur">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold text-white">Create your account</h1>
            <p className="text-sm text-slate-300">Join SimplyCode and track your learning journey.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Optional"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                autoComplete="name"
              />
            </div>
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
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
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
                  minLength={8}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
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
                Confirm password
              </label>
              <div className="relative mt-2">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
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
            <div className="flex items-start space-x-3 rounded-2xl border border-white/5 bg-slate-900/40 p-4">
              <input
                id="acceptedTerms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
                className="mt-1 h-5 w-5 rounded border border-white/10 bg-slate-950 text-emerald-400 focus:ring-emerald-500/40"
              />
              <label htmlFor="acceptedTerms" className="text-sm text-slate-300">
                I agree to the{' '}
                <Link href="/legal/terms" className="font-semibold text-emerald-300 hover:text-emerald-200">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/legal/privacy" className="font-semibold text-emerald-300 hover:text-emerald-200">
                  Privacy Policy
                </Link>
                .
              </label>
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
              className="w-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-500 to-indigo-500 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-300">
            Already have an account?{' '}
            <Link href={`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-semibold text-emerald-300 hover:text-emerald-200">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </>
  )
}

