import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Alert, Spinner } from '../components/ui/index'
import { TrendingUp, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const { login }    = useAuth()
  const navigate     = useNavigate()
  const location     = useLocation()

  const [form,    setForm]    = useState({ username: '', password: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw,  setShowPw]  = useState(false)

  // Show success message if redirected after registration
  const registered = location.state?.registered

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
      navigate('/')
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        'Invalid username or password.'
      )
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
          <h1 className="font-display text-xl font-bold text-slate-800 mb-1">Welcome back</h1>
          <p className="text-sm text-slate-400 mb-6">Sign in to your account to continue.</p>

          {registered && (
            <div className="mb-4">
              <Alert
                type="success"
                message="Account created! You can now sign in."
              />
            </div>
          )}

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
              <label className="label">Password</label>
              <div className="relative">
                <input
                  className="input pr-10"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
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

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-1"
            >
              {loading ? <Spinner size="sm" /> : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-brand-600 font-semibold hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
