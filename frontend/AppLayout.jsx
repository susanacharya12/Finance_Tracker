import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Tag, ArrowLeftRight,
  LogOut, Menu, X, TrendingUp, ChevronDown, User,
} from 'lucide-react'

// ── Navigation links ──────────────────────────────────────────────────────────
const NAV_LINKS = [
  { to: '/',             label: 'Dashboard',    Icon: LayoutDashboard },
  { to: '/categories',   label: 'Categories',   Icon: Tag             },
  { to: '/transactions', label: 'Transactions', Icon: ArrowLeftRight  },
]

// ── Logo ──────────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <div className="flex items-center gap-2.5 px-1 select-none">
      <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center shadow-sm">
        <TrendingUp size={16} className="text-white" strokeWidth={2.5} />
      </div>
      <span className="font-display font-extrabold text-slate-800 text-lg tracking-tight">
        FinFlow
      </span>
    </div>
  )
}

// ── Sidebar nav links ─────────────────────────────────────────────────────────
function SideNav({ onClose }) {
  return (
    <nav className="flex flex-col gap-0.5">
      {NAV_LINKS.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          onClick={onClose}
          className={({ isActive }) =>
            `nav-item ${isActive ? 'nav-item-active' : ''}`
          }
        >
          <Icon size={17} strokeWidth={1.75} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

// ── Main layout ───────────────────────────────────────────────────────────────
export default function AppLayout({ children }) {
  const { user, logout }         = useAuth()
  const navigate                 = useNavigate()
  const [mobileOpen, setMobile]  = useState(false)
  const [userMenu,   setUserMenu] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">

      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-white border-r border-slate-100 px-4 py-6 gap-6">
        <Logo />

        <div className="flex-1 flex flex-col justify-between">
          <SideNav onClose={() => {}} />

          <button
            onClick={handleLogout}
            className="nav-item text-rose-500 hover:text-rose-600 hover:bg-rose-50"
          >
            <LogOut size={17} strokeWidth={1.75} />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Mobile sidebar (overlay) ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setMobile(false)}
          />
          {/* Drawer */}
          <aside className="absolute left-0 top-0 h-full w-64 bg-white flex flex-col px-4 py-6 gap-6 animate-slide-up shadow-card-hover">
            <div className="flex items-center justify-between">
              <Logo />
              <button
                onClick={() => setMobile(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <SideNav onClose={() => setMobile(false)} />
              <button
                onClick={handleLogout}
                className="nav-item text-rose-500 hover:text-rose-600 hover:bg-rose-50"
              >
                <LogOut size={17} strokeWidth={1.75} />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ── Right panel (topbar + page content) ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top navbar */}
        <header className="h-14 shrink-0 bg-white border-b border-slate-100 flex items-center justify-between px-4 lg:px-6">

          {/* Hamburger (mobile only) */}
          <button
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
            onClick={() => setMobile(true)}
          >
            <Menu size={20} />
          </button>

          {/* Desktop spacer */}
          <div className="hidden lg:block" />

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenu(!userMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center">
                <User size={13} className="text-brand-700" />
              </div>
              <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-[120px] truncate">
                {user?.username || user?.email || 'Account'}
              </span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>

            {userMenu && (
              <>
                {/* Click-away */}
                <div className="fixed inset-0 z-40" onClick={() => setUserMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-card-hover border border-slate-100 py-1.5 z-50 animate-fade-in">
                  <div className="px-3 py-2 border-b border-slate-50 mb-1">
                    <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-widest mb-0.5">
                      Signed in as
                    </p>
                    <p className="text-sm font-medium text-slate-700 truncate">
                      {user?.email || user?.username}
                    </p>
                  </div>
                  <button
                    onClick={() => { setUserMenu(false); handleLogout() }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-rose-500 hover:bg-rose-50 transition-colors rounded-lg mx-auto"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Scrollable page area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
