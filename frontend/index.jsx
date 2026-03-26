import { X, AlertCircle, CheckCircle, Info } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// StatCard
// ─────────────────────────────────────────────────────────────────────────────
export function StatCard({ title, value, icon: Icon, color = 'brand', sub }) {
  const palette = {
    brand:   { wrap: 'bg-brand-50',   icon: 'text-brand-600',   val: 'text-brand-700'  },
    income:  { wrap: 'bg-emerald-50', icon: 'text-emerald-600', val: 'text-emerald-700' },
    expense: { wrap: 'bg-rose-50',    icon: 'text-rose-500',    val: 'text-rose-600'   },
    neutral: { wrap: 'bg-slate-100',  icon: 'text-slate-500',   val: 'text-slate-700'  },
  }
  const c = palette[color] ?? palette.brand

  return (
    <div className="card hover:shadow-card-hover transition-shadow duration-200 animate-slide-up">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
            {title}
          </p>
          <p className={`text-2xl font-display font-bold tracking-tight ${c.val}`}>
            {value}
          </p>
          {sub && (
            <p className="text-xs text-slate-400 mt-1">{sub}</p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl ${c.wrap} flex items-center justify-center shrink-0`}>
          <Icon size={20} className={c.icon} strokeWidth={1.75} />
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Modal
// ─────────────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, maxWidth = 'max-w-md' }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className={`relative bg-white w-full ${maxWidth} rounded-2xl shadow-card-hover animate-slide-up`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-display font-semibold text-slate-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Alert
// ─────────────────────────────────────────────────────────────────────────────
export function Alert({ type = 'error', message, onClose }) {
  if (!message) return null

  const styles = {
    error:   { wrap: 'bg-rose-50 border-rose-200',     text: 'text-rose-700',    Icon: AlertCircle,  ic: 'text-rose-400'    },
    success: { wrap: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', Icon: CheckCircle, ic: 'text-emerald-500'  },
    info:    { wrap: 'bg-blue-50 border-blue-200',      text: 'text-blue-700',    Icon: Info,         ic: 'text-blue-400'    },
  }
  const { wrap, text, Icon, ic } = styles[type] ?? styles.error

  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${wrap} animate-fade-in`}>
      <Icon size={15} className={`${ic} mt-0.5 shrink-0`} />
      <p className={`text-sm flex-1 leading-relaxed ${text}`}>{message}</p>
      {onClose && (
        <button onClick={onClose} className={`${ic} hover:opacity-60 shrink-0 mt-0.5`}>
          <X size={14} />
        </button>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Spinner
// ─────────────────────────────────────────────────────────────────────────────
export function Spinner({ size = 'md', className = '' }) {
  const sz = { sm: 'w-4 h-4 border-2', md: 'w-7 h-7 border-[3px]', lg: 'w-10 h-10 border-[3px]' }
  return (
    <div
      className={`${sz[size] ?? sz.md} rounded-full border-brand-500 border-t-transparent animate-spin ${className}`}
    />
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// EmptyState
// ─────────────────────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center select-none">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <Icon size={24} className="text-slate-400" strokeWidth={1.5} />
      </div>
      <h3 className="font-semibold text-slate-700 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-slate-400 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PageHeader
// ─────────────────────────────────────────────────────────────────────────────
export function PageHeader({ title, description, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-800 tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-slate-500 mt-1">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ConfirmDialog  (delete confirmation)
// ─────────────────────────────────────────────────────────────────────────────
export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Delete', loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-slate-600 mb-6 leading-relaxed">{message}</p>
      <div className="flex gap-3">
        <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
        <button onClick={onConfirm} disabled={loading} className="btn-danger flex-1">
          {loading ? <Spinner size="sm" /> : confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
