import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()

  // Show full-screen spinner while we check localStorage token
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="w-9 h-9 rounded-full border-[3px] border-brand-500 border-t-transparent animate-spin" />
        <p className="text-sm text-slate-400 font-medium tracking-wide">Loading…</p>
      </div>
    )
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
