import { useState, useEffect, useCallback } from 'react'
import { categoriesAPI } from '../api/services'
import {
  Alert, Modal, Spinner, EmptyState,
  PageHeader, ConfirmDialog,
} from '../components/ui/index'
import { Tag, Plus, Trash2, Pencil } from 'lucide-react'

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [saving,     setSaving]     = useState(false)
  const [error,      setError]      = useState('')
  const [success,    setSuccess]    = useState('')

  // Modal state
  const [showForm,    setShowForm]    = useState(false)
  const [editTarget,  setEditTarget]  = useState(null)   // category being edited
  const [deleteTarget,setDeleteTarget]= useState(null)   // category pending delete
  const [formName,    setFormName]    = useState('')

  // ── Fetch all categories ───────────────────────────────────────────────────
  const load = useCallback(() => {
    setLoading(true)
    categoriesAPI.getAll()
      .then(({ data }) => setCategories(Array.isArray(data) ? data : data.results ?? []))
      .catch(() => setError('Failed to load categories.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  // ── Open / close helpers ──────────────────────────────────────────────────
  const openAdd = () => {
    setEditTarget(null)
    setFormName('')
    setShowForm(true)
  }

  const openEdit = (cat) => {
    setEditTarget(cat)
    setFormName(cat.name)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditTarget(null)
    setFormName('')
  }

  // ── Save (create or update) ───────────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault()
    const name = formName.trim()
    if (!name) return setError('Category name cannot be empty.')
    setSaving(true)
    setError('')
    try {
      if (editTarget) {
        await categoriesAPI.update(editTarget.id, { name })
        setSuccess(`"${name}" updated.`)
      } else {
        await categoriesAPI.create({ name })
        setSuccess(`"${name}" added.`)
      }
      closeForm()
      load()
    } catch (err) {
      const data = err.response?.data
      setError(
        typeof data === 'object'
          ? Object.values(data).flat().join(' ')
          : 'Save failed. Please try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return
    setSaving(true)
    setError('')
    try {
      await categoriesAPI.delete(deleteTarget.id)
      setSuccess(`"${deleteTarget.name}" deleted.`)
      setDeleteTarget(null)
      load()
    } catch {
      setError('Delete failed. This category may still be in use by transactions.')
    } finally {
      setSaving(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Categories"
        description="Organise your income and expenses with custom categories."
        action={
          <button onClick={openAdd} className="btn-primary">
            <Plus size={16} /> New Category
          </button>
        }
      />

      {/* Alerts */}
      {error   && <div className="mb-4"><Alert message={error}   onClose={() => setError('')}   /></div>}
      {success && <div className="mb-4"><Alert type="success" message={success} onClose={() => setSuccess('')} /></div>}

      {/* Category list card */}
      <div className="card">
        {loading ? (
          <div className="flex justify-center py-14"><Spinner size="lg" /></div>
        ) : categories.length === 0 ? (
          <EmptyState
            icon={Tag}
            title="No categories yet"
            description="Create your first category to start organising transactions."
            action={
              <button onClick={openAdd} className="btn-primary">
                <Plus size={15} /> Add Category
              </button>
            }
          />
        ) : (
          <>
            {/* Count */}
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
              {categories.length} {categories.length === 1 ? 'category' : 'categories'}
            </p>

            <div className="divide-y divide-slate-50">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 group"
                >
                  {/* Icon + name */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
                      <Tag size={14} className="text-brand-600" strokeWidth={1.75} />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{cat.name}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(cat)}
                      title="Edit"
                      className="p-2 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(cat)}
                      title="Delete"
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Add / Edit modal ── */}
      <Modal
        open={showForm}
        onClose={closeForm}
        title={editTarget ? 'Edit Category' : 'New Category'}
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <label className="label">Category Name</label>
            <input
              className="input"
              type="text"
              placeholder="e.g. Groceries, Rent, Salary…"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              autoFocus
              maxLength={100}
              required
            />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={closeForm} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? <Spinner size="sm" /> : (editTarget ? 'Save Changes' : 'Add Category')}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Delete confirmation ── */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        loading={saving}
      />
    </div>
  )
}
