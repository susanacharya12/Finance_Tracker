import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute   from './routes/ProtectedRoute'
import PublicRoute      from './routes/PublicRoute'
import AppLayout        from './layouts/AppLayout'
import LoginPage        from './pages/LoginPage'
import RegisterPage     from './pages/RegisterPage'
import DashboardPage    from './pages/DashboardPage'
import CategoriesPage   from './pages/CategoriesPage'
import TransactionsPage from './pages/TransactionsPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* ── Public (redirect to / if already logged in) ── */}
          <Route element={<PublicRoute />}>
            <Route path="/login"    element={<LoginPage />}    />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* ── Protected (redirect to /login if not authenticated) ── */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout><Navigate to="/" /></AppLayout>} path="/__layout" />

            <Route
              path="/"
              element={
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              }
            />
            <Route
              path="/categories"
              element={
                <AppLayout>
                  <CategoriesPage />
                </AppLayout>
              }
            />
            <Route
              path="/transactions"
              element={
                <AppLayout>
                  <TransactionsPage />
                </AppLayout>
              }
            />
          </Route>

          {/* ── Catch-all ── */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
