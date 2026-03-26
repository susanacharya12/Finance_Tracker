import { useState, useEffect } from 'react'
import { categoriesAPI } from '../api/services'
import { Alert, Spinner } from './ui/index'

const DEFAULT_FORM = {
  amount:      '',
  type:        'expense',
  category:    '',
  date:        new Date().toISOString().slice(0, 10),
  description: '',
}

// Normalise an existing transaction into form shape
function toFormShape(tx) {
  return {
    amount:      String(tx.amount ?? ''),
    type:        tx.type        ?? 'expense',
    category:    String(tx.category?.id ?? tx.category ?? ''),
    date:        tx.date        ?? new Date().toISOString().slice(0, 10),
    description: tx.description ?? '',
  }
}

// Extract a human-readable error string from an Axios error
function extractError(err) {
  const data = err?.response?.data
  if (!data) return 'Something went wrong. Please try again.'
  if (typeof data === 'string') return data
  return Object.entries(data)
    .map(([k, v]) => `${k}: ${[].concat(v).join(' ')}`)
    .join('  |  ')
}

export default function TransactionForm({ initial, onSubmit, onCancel, loading }) {
  const [form,       setForm]       = useState(initial ? toFormShape(initial) : { ...DEFAULT_FORM })
  const [categories, setCategories] = useState([])
  const [error,      setError]      = useState('')

  // Load categories for the select box
  useEffect(() => {
    categoriesAPI.getAll()
      .then(({ data }) => setCategories(Array.isArray(data) ? data : data.results ?? []))
      .catch(() => {})
  }, [])

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.amount || Number(form.amount) <= 0) {
      return setError('Please enter a valid amount greater than 0.')
    }
    if (!form.date) {
      return setError('Date is required.')
    }

    try {
      await onSubmit({
        amount:      parseFloat(form.amount),
        type:        form.type,
        category:    form.category ? parseInt(form.category, 10) : null,
        date:        form.date,
        description: form.description.trim(),
      })
    } catch (err) {
      setError(extractError(err))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && <Alert message={error} onClose={() => setError('')} />}

      {/* Type toggle */}
      <div>
        <label className="label">Type</label>
        <div className="grid grid-cols-2 gap-2">
          {['income', 'expense'].map((t) => {
            const active = form.type === t
            const activeClass = t === 'income'
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
              : 'bg-rose-500 border-rose-500 text-white shadow-sm'
            return (
              <button
                key={t}
                type="button"
                onClick={() => set('type', t)}
                className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-150 capitalize ${
                  active ? activeClass : 'border-slate-200 text-slate-400 hover:border-slate-300'
                }`}
              >
                {t}
              </button>
            )
          })}
        </div>
      </div>

      {/* Amount */}
      <div>
        <label className="label">Amount</label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-mono">$</span>
          <input
            className="input pl-7"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={form.amount}
            onChange={(e) => set('amount', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="label">Category</label>
        <select
          className="input"
          value={form.category}
          onChange={(e) => set('category', e.target.value)}
        >
          <option value="">— No category —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div>
        <label className="label">Date</label>
        <input
          className="input"
          type="date"
          value={form.date}
          onChange={(e) => set('date', e.target.value)}
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="label">Description <span className="normal-case text-slate-300">(optional)</span></label>
        <input
          className="input"
          type="text"
          placeholder="What was this for?"
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          maxLength={255}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? <Spinner size="sm" /> : (initial ? 'Save Changes' : 'Add Transaction')}
        </button>
      </div>
    </form>
  )
}
