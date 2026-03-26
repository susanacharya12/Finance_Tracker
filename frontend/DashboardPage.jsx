import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { transactionsAPI } from '../api/services'
import { useAuth } from '../context/AuthContext'
import { StatCard, Spinner, EmptyState, PageHeader } from '../components/ui/index'
import {
  Wallet, TrendingUp, TrendingDown, ArrowLeftRight,
  ArrowRight, Plus,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'
import {
  format, parseISO, startOfMonth, endOfMonth,
  eachDayOfInterval, isSameDay,
} from 'date-fns'

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(val) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 2,
  }).format(val || 0)
}

function buildChartData(transactions) {
  const now  = new Date()
  const days = eachDayOfInterval({ start: startOfMonth(now), end: endOfMonth(now) })
  return days.map((day) => {
    const dayTxs = transactions.filter((t) => isSameDay(parseISO(t.date), day))
    return {
      date:    format(day, 'MMM d'),
      income:  dayTxs.filter((t) => t.type === 'income').reduce((s, t)  => s + parseFloat(t.amount), 0),
      expense: dayTxs.filter((t) => t.type === 'expense').reduce((s, t) => s + parseFloat(t.amount), 0),
    }
  })
}

// ── Custom tooltip for chart ──────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-xl shadow-card-hover border border-slate-100 px-3.5 py-3 text-xs">
      <p className="font-semibold text-slate-600 mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 mb-1 last:mb-0">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-500 capitalize w-14">{p.name}</span>
          <span className="font-semibold text-slate-700">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user }                         = useAuth()
  const [transactions, setTransactions]  = useState([])
  const [loading, setLoading]            = useState(true)

  useEffect(() => {
    transactionsAPI.getAll()
      .then(({ data }) => setTransactions(Array.isArray(data) ? data : data.results ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // ── Derived stats ──────────────────────────────────────────────────────────
  const totalIncome  = transactions.filter((t) => t.type === 'income')
    .reduce((s, t) => s + parseFloat(t.amount), 0)
  const totalExpense = transactions.filter((t) => t.type === 'expense')
    .reduce((s, t) => s + parseFloat(t.amount), 0)
  const balance      = totalIncome - totalExpense
  const recent       = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6)
  const chartData    = buildChartData(transactions)

  // ── Greeting ───────────────────────────────────────────────────────────────
  const hour     = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="animate-fade-in space-y-6">

      {/* ── Page heading ── */}
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-800 tracking-tight">
          {greeting}, {user?.username || 'there'} 👋
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Here's your financial overview for{' '}
          <span className="font-medium text-slate-500">{format(new Date(), 'MMMM yyyy')}</span>.
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Net Balance"
          value={fmt(balance)}
          icon={Wallet}
          color={balance >= 0 ? 'brand' : 'expense'}
          sub="Income minus expenses"
        />
        <StatCard
          title="Total Income"
          value={fmt(totalIncome)}
          icon={TrendingUp}
          color="income"
          sub={`${transactions.filter((t) => t.type === 'income').length} transactions`}
        />
        <StatCard
          title="Total Expenses"
          value={fmt(totalExpense)}
          icon={TrendingDown}
          color="expense"
          sub={`${transactions.filter((t) => t.type === 'expense').length} transactions`}
        />
      </div>

      {/* ── Area chart ── */}
      {transactions.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-slate-700">Monthly Cash Flow</h2>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" /> Income
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500" /> Expense
              </span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 2, right: 2, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="grad-income" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="grad-expense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f43f5e" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickLine={false} axisLine={false}
                interval={4}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickLine={false} axisLine={false}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone" dataKey="income"
                stroke="#10b981" strokeWidth={2}
                fill="url(#grad-income)" dot={false}
              />
              <Area
                type="monotone" dataKey="expense"
                stroke="#f43f5e" strokeWidth={2}
                fill="url(#grad-expense)" dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── Recent transactions ── */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold text-slate-700">Recent Transactions</h2>
          <Link
            to="/transactions"
            className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline"
          >
            View all <ArrowRight size={13} />
          </Link>
        </div>

        {recent.length === 0 ? (
          <EmptyState
            icon={ArrowLeftRight}
            title="No transactions yet"
            description="Add your first transaction to start tracking your finances."
            action={
              <Link to="/transactions" className="btn-primary">
                <Plus size={15} /> Add Transaction
              </Link>
            }
          />
        ) : (
          <div className="divide-y divide-slate-50">
            {recent.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                {/* Icon + meta */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
                    t.type === 'income' ? 'bg-emerald-50' : 'bg-rose-50'
                  }`}>
                    {t.type === 'income'
                      ? <TrendingUp  size={16} className="text-emerald-600" strokeWidth={1.75} />
                      : <TrendingDown size={16} className="text-rose-500"   strokeWidth={1.75} />
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">
                      {t.description || <span className="italic text-slate-400">No description</span>}
                    </p>
                    <p className="text-xs text-slate-400">
                      {t.category?.name ?? 'Uncategorized'} &middot;{' '}
                      {format(parseISO(t.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                {/* Amount */}
                <span className={`shrink-0 ml-4 font-mono text-sm font-bold ${
                  t.type === 'income' ? 'text-emerald-600' : 'text-rose-500'
                }`}>
                  {t.type === 'income' ? '+' : '-'}{fmt(parseFloat(t.amount))}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
