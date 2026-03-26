import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Alert, Spinner } from '../components/ui/index'
import { TrendingUp, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate     = useNavigate()

  const [form, setForm] = useState({
    username: '', email: '', password: '', password2: '',
  })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw,  setShowPw]  = useState(false)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.password2) {
      return setError('Passwords do not match.')
    }
    if (form.password.length < 8) {
      return setError('Password must be at least 8 characters.')
    }

    setLoading(true)
    try {
      await register({
        username:  form.username,
        email:     form.email,
        password:  form.password,
        password2: form.password2,
      })
      navigate('/login', { state: { registered: true } })
    } catch (err) {
      const data = err.response?.data
      if (data && typeof data === 'object') {
        const lines = Object.entries(data).map(
          ([k, v]) => `${k.replace(/_/g, ' ')}: ${[].concat(v).join(' ')}`
        )
        setError(lines.join('\n'))
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-brand-50/30 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm animate-slide-up">

        {/* Brand mark */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-brand-600 flex items-center justify-center shadow-md">
            <TrendingUp size={21} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display text-[1.6rem] font-extrabold text-slate-800 tracking-tight">
            FinFlow
          </span>
        </div>

        <div className="card shadow-card-hover">
          <h1 className="font-display text-xl font-bold text-slate-800 mb-1">Create account</h1>
          <p className="text-sm text-slate-400 mb-6">Start tracking your finances for free.</p>

          {error && (
            <div className="mb-4">
              <Alert message={error} onClose={() => setError('')} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="label">Username</label>
              <input
                className="input"
                type="text"
                placeholder="your_username"
                autoComplete="username"
                value={form.username}
                onChange={(e) => set('username', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  className="input pr-10"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="label">Confirm Password</label>
              <input
                className="input"
                type="password"
                placeholder="Repeat your password"
                autoComplete="new-password"
                value={form.password2}
                onChange={(e) => set('password2', e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-1"
            >
              {loading ? <Spinner size="sm" /> : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
