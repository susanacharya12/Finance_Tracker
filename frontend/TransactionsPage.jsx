import { useState, useEffect, useCallback } from 'react'
import { transactionsAPI, categoriesAPI } from '../api/services'
import {
  Alert, Modal, Spinner, EmptyState,
  PageHeader, ConfirmDialog,
} from '../components/ui/index'
import TransactionForm from '../components/TransactionForm'
import {
  ArrowLeftRight, Plus, Trash2, Pencil,
  TrendingUp, TrendingDown, Search, Filter,
  ChevronUp, ChevronDown,
} from 'lucide-react'
import { format, parseISO } from 'date-fns'

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(val) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD',
  }).format(val || 0)
}

// ── Sort icon ─────────────────────────────────────────────────────────────────
function SortIcon({ col, sortKey, sortDir }) {
  if (sortKey !== col) return <ChevronUp size={13} className="text-slate-300" />
  return sortDir === 'asc'
    ? <ChevronUp   size={13} className="text-brand-500" />
    : <ChevronDown size={13} className="text-brand-500" />
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [categories,   setCategories]   = useState([])
  const [loading,      setLoading]      = useState(true)
  const [saving,       setSaving]       = useState(false)
  const [error,        setError]        = useState('')
  const [success,      setSuccess]      = useState('')

  // ── Modal state ──────────────────────────────────────────────────────────
  const [showAdd,      setShowAdd]      = useState(false)
  const [editTarget,   setEditTarget]   = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  // ── Filter / sort state ──────────────────────────────────────────────────
  const [search,         setSearch]         = useState('')
  const [filterType,     setFilterType]     = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortKey,        setSortKey]        = useState('date')
  const [sortDir,        setSortDir]        = useState('desc')

  // ── Data loading ─────────────────────────────────────────────────────────
  const load = useCallback(() => {
    setLoading(true)
    transactionsAPI.getAll()
      .then(({ data }) => setTransactions(Array.isArray(data) ? data : data.results ?? []))
      .catch(() => setError('Failed to load transactions.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
    categoriesAPI.getAll()
      .then(({ data }) => setCategories(Array.isArray(data) ? data : data.results ?? []))
      .catch(() => {})
  }, [load])

  // ── Derived list (filter + sort) ─────────────────────────────────────────
  const displayed = transactions
    .filter((t) => {
      const matchType     = filterType     === 'all' || t.type === filterType
      const catId         = String(t.category?.id ?? t.category ?? '')
      const matchCategory = filterCategory === 'all' || catId === filterCategory
      const q             = search.toLowerCase()
      const matchSearch   = !q
        || (t.description ?? '').toLowerCase().includes(q)
        || (t.category?.name ?? '').toLowerCase().includes(q)
        || fmt(parseFloat(t.amount)).includes(q)
      return matchType && matchCategory && matchSearch
    })
    .sort((a, b) => {
      let av, bv
      if (sortKey === 'date')   { av = new Date(a.date);       bv = new Date(b.date)       }
      if (sortKey === 'amount') { av = parseFloat(a.amount);   bv = parseFloat(b.amount)   }
      return sortDir === 'asc' ? av - bv : bv - av
    })

  const toggleSort = (col) => {
    if (sortKey === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(col); setSortDir('desc') }
  }

  // ── Summary totals (visible rows) ─────────────────────────────────────────
  const visibleIncome  = displayed.filter((t) => t.type === 'income').reduce((s, t)  => s + parseFloat(t.amount), 0)
  const visibleExpense = displayed.filter((t) => t.type === 'expense').reduce((s, t) => s + parseFloat(t.amount), 0)

  // ── CRUD ──────────────────────────────────────────────────────────────────
  const handleAdd = async (data) => {
    setSaving(true)
    try {
      await transactionsAPI.create(data)
      setShowAdd(false)
      setSuccess('Transaction added successfully.')
      load()
    } finally { setSaving(false) }
  }

  const handleEdit = async (data) => {
    setSaving(true)
    try {
      await transactionsAPI.update(editTarget.id, data)
      setEditTarget(null)
      setSuccess('Transaction updated.')
      load()
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setSaving(true)
    setError('')
    try {
      await transactionsAPI.delete(deleteTarget.id)
      setDeleteTarget(null)
      setSuccess('Transaction deleted.')
      load()
    } catch {
      setError('Delete failed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Transactions"
        description="Track, search and manage all your income and expenses."
        action={
          <button onClick={() => setShowAdd(true)} className="btn-primary">
            <Plus size={16} /> Add Transaction
          </button>
        }
      />

      {/* Alerts */}
      {error   && <div className="mb-4"><Alert message={error}   onClose={() => setError('')}   /></div>}
      {success && <div className="mb-4"><Alert type="success" message={success} onClose={() => setSuccess('')} /></div>}

      {/* ── Filter bar ── */}
      <div className="card mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              className="input pl-9"
              type="text"
              placeholder="Search by description, category…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400 shrink-0" />
            <select
              className="input w-36"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Category filter */}
          <select
            className="input w-44"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={String(c.id)}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Table card ── */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : displayed.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={ArrowLeftRight}
              title="No transactions found"
              description={
                transactions.length === 0
                  ? 'Add your first transaction to get started.'
                  : 'Try adjusting your search or filters.'
              }
              action={
                transactions.length === 0 && (
                  <button onClick={() => setShowAdd(true)} className="btn-primary">
                    <Plus size={15} /> Add Transaction
                  </button>
                )
              }
            />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Head */}
                <thead className="bg-slate-50/80 border-b border-slate-100">
                  <tr>
                    <th className="table-head">Description</th>
                    <th className="table-head">Category</th>
                    <th className="table-head">Type</th>
                    <th
                      className="table-head text-right cursor-pointer select-none hover:text-slate-600 transition-colors"
                      onClick={() => toggleSort('amount')}
                    >
                      <span className="inline-flex items-center justify-end gap-1 w-full">
                        Amount
                        <SortIcon col="amount" sortKey={sortKey} sortDir={sortDir} />
                      </span>
                    </th>
                    <th
                      className="table-head text-right cursor-pointer select-none hover:text-slate-600 transition-colors"
                      onClick={() => toggleSort('date')}
                    >
                      <span className="inline-flex items-center justify-end gap-1 w-full">
                        Date
                        <SortIcon col="date" sortKey={sortKey} sortDir={sortDir} />
                      </span>
                    </th>
                    <th className="table-head text-right">Actions</th>
                  </tr>
                </thead>

                {/* Body */}
                <tbody className="divide-y divide-slate-50">
                  {displayed.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/60 transition-colors group">
                      {/* Description */}
                      <td className="table-cell font-medium text-slate-700 max-w-[180px]">
                        <span className="block truncate">
                          {t.description || (
                            <span className="text-slate-300 italic font-normal">No description</span>
                          )}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="table-cell text-slate-500">
                        {t.category?.name ?? (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Type badge */}
                      <td className="table-cell">
                        {t.type === 'income' ? (
                          <span className="badge-income">
                            <TrendingUp size={11} /> Income
                          </span>
                        ) : (
                          <span className="badge-expense">
                            <TrendingDown size={11} /> Expense
                          </span>
                        )}
                      </td>

                      {/* Amount */}
                      <td className={`table-cell text-right font-mono font-bold ${
                        t.type === 'income' ? 'text-emerald-600' : 'text-rose-500'
                      }`}>
                        {t.type === 'income' ? '+' : '-'}{fmt(parseFloat(t.amount))}
                      </td>

                      {/* Date */}
                      <td className="table-cell text-right text-slate-400 whitespace-nowrap">
                        {format(parseISO(t.date), 'MMM d, yyyy')}
                      </td>

                      {/* Actions */}
                      <td className="table-cell text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditTarget(t)}
                            title="Edit"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(t)}
                            title="Delete"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Footer summary ── */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-50/60 border-t border-slate-100">
              <p className="text-xs text-slate-400">
                Showing <span className="font-semibold text-slate-600">{displayed.length}</span> of{' '}
                <span className="font-semibold text-slate-600">{transactions.length}</span> transactions
              </p>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-emerald-600 font-semibold">
                  +{fmt(visibleIncome)}
                </span>
                <span className="text-rose-500 font-semibold">
                  -{fmt(visibleExpense)}
                </span>
                <span className={`font-bold ${
                  visibleIncome - visibleExpense >= 0 ? 'text-brand-700' : 'text-rose-600'
                }`}>
                  Net {fmt(visibleIncome - visibleExpense)}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Add Transaction modal ── */}
      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="Add Transaction"
      >
        <TransactionForm
          onSubmit={handleAdd}
          onCancel={() => setShowAdd(false)}
          loading={saving}
        />
      </Modal>

      {/* ── Edit Transaction modal ── */}
      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit Transaction"
      >
        {editTarget && (
          <TransactionForm
            initial={editTarget}
            onSubmit={handleEdit}
            onCancel={() => setEditTarget(null)}
            loading={saving}
          />
        )}
      </Modal>

      {/* ── Delete confirmation ── */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Transaction"
        message={`Are you sure you want to delete this transaction${
          deleteTarget?.description ? ` ("${deleteTarget.description}")` : ''
        }? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={saving}
      />
    </div>
  )
}
