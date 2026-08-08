import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { useAuth } from '../lib/AuthContext'

type Mode = 'login' | 'signup'

export function Login() {
  const { signInWithPassword, signUp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/app'

  const [mode, setMode] = useState<Mode>(searchParams.get('signup') ? 'signup' : 'login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [checkEmail, setCheckEmail] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    if (mode === 'login') {
      const { error } = await signInWithPassword(email, password)
      setSubmitting(false)
      if (error) return setError(error)
      navigate(redirectTo, { replace: true })
    } else {
      const { error, needsEmailConfirmation } = await signUp(email, password)
      setSubmitting(false)
      if (error) return setError(error)
      if (needsEmailConfirmation) {
        setCheckEmail(true)
      } else {
        navigate(redirectTo, { replace: true })
      }
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <Container className="flex min-h-screen max-w-md flex-col items-center justify-center py-16">
        <Link to="/" className="mb-10 font-serif text-3xl italic text-ink">
          Styleby
        </Link>

        {checkEmail ? (
          <div className="w-full rounded-2xl border border-border/70 bg-cream-soft p-8 text-center">
            <p className="font-serif text-2xl text-ink">Check your inbox</p>
            <p className="mt-3 text-[15px] text-body">
              We sent a confirmation link to <strong>{email}</strong>. Click it
              to finish creating your account, then come back and log in.
            </p>
            <button
              onClick={() => {
                setCheckEmail(false)
                setMode('login')
              }}
              className="mt-6 text-[15px] font-medium text-accent hover:text-ink"
            >
              Back to log in
            </button>
          </div>
        ) : (
          <div className="w-full rounded-2xl border border-border/70 bg-cream-soft p-8">
            <h1 className="font-serif text-2xl text-ink">
              {mode === 'login' ? 'Log in to your closet' : 'Create your account'}
            </h1>
            <p className="mt-2 text-[15px] text-body">
              {mode === 'login'
                ? "Enter your email and password to continue."
                : 'Takes a few seconds — just an email and a password.'}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink-soft">Email</span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="you@example.com"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink-soft">Password</span>
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  placeholder="At least 6 characters"
                />
              </label>

              {error && (
                <p className="rounded-lg bg-beige px-4 py-3 text-sm text-ink-soft">{error}</p>
              )}

              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Sign up'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={() => {
                  setError(null)
                  setMode(mode === 'login' ? 'signup' : 'login')
                }}
                className="font-medium text-accent hover:text-ink"
              >
                {mode === 'login' ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        )}
      </Container>
    </div>
  )
}
