import { useEffect, useState } from 'react'
import { Radio, Wifi, Users, BarChart2, RotateCw, RefreshCw } from 'lucide-react'
import StatCard from '../components/StatCard'
import ChartWrapper from '../components/ChartWrapper'
import api from '../api/axios'
import toast from 'react-hot-toast'

const STATUS_BADGE = {
  active: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25',
  expired: 'bg-red-500/15 text-red-400 border border-red-500/25',
  cancelled: 'bg-gray-500/15 text-gray-400 border border-gray-500/25',
}

const TYPE_BADGE = {
  prepaid: 'bg-violet-500/15 text-violet-400 border border-violet-500/25',
  postpaid: 'bg-blue-500/15 text-blue-400 border border-blue-500/25',
  default: 'bg-gray-500/15 text-gray-400 border border-gray-500/25',
}

function Badge({ value, map }) {
  const cls = map[value?.toLowerCase()] || map.default || 'bg-gray-500/15 text-gray-400'
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-mono font-medium ${cls}`}>
      {value}
    </span>
  )
}

function TableShell({ cols, children }) {
  return (
    <div className="glass overflow-x-auto rounded-2xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.06]">
            {cols.map((col) => (
              <th
                key={col}
                className="px-5 py-3 text-left font-mono text-[10px] tracking-widest text-gray-600 uppercase"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.03]">{children}</tbody>
      </table>
    </div>
  )
}

const TABS = ['plans', 'subscriptions', 'usage']

export default function Telecom() {
  const [plans, setPlans] = useState([])
  const [subs, setSubs] = useState([])
  const [usage, setUsage] = useState([])
  const [summary, setSummary] = useState({})
  const [subByStatus, setSubByStatus] = useState([])
  const [planByType, setPlanByType] = useState([])
  const [tab, setTab] = useState('plans')
  const [subForm, setSubForm] = useState({ sub_id: '', status: 'active' })
  const [submitting, setSubmitting] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const loadTelecomData = async () => {
    const [plansRes, subsRes, usageRes, summaryRes, statusRes, typeRes] = await Promise.all([
      api.get('/telecom/plans'),
      api.get('/telecom/subscriptions'),
      api.get('/telecom/usage'),
      api.get('/telecom/summary'),
      api.get('/telecom/sub-by-status'),
      api.get('/telecom/plan-by-type'),
    ])

    setPlans(plansRes.data || [])
    setSubs(subsRes.data || [])
    setUsage(usageRes.data || [])
    setSummary(summaryRes.data || {})
    setSubByStatus((statusRes.data || []).map((r) => ({ name: r.status, count: r.count })))
    setPlanByType((typeRes.data || []).map((r) => ({ name: r.plan_type, count: r.count })))
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadTelecomData().catch(() => {})
    setRefreshing(false)
    toast.success('Data refreshed')
  }

  useEffect(() => {
    loadTelecomData().catch(() => {})
  }, [])

  const renewSubscription = async (subId) => {
    try {
      await api.post('/telecom/renew', { sub_id: subId })
      toast.success('Subscription renewed')
      await loadTelecomData()
    } catch (error) {
      toast.error(error.message || 'Renewal failed')
    }
  }

  const handleSubscriptionUpdate = async (e) => {
    e.preventDefault()
    if (!subForm.sub_id) return toast.error('Subscription ID is required')
    setSubmitting(true)
    try {
      await api.post('/telecom/update-subscription', subForm)
      toast.success('Subscription updated')
      await loadTelecomData()
      setSubForm({ sub_id: '', status: 'active' })
    } catch (error) {
      toast.error(error.message || 'Update failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-7 p-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="flex items-center gap-2.5 font-display text-2xl font-bold tracking-tight text-white">
            <Radio size={20} className="text-violet-400" />
            Telecom
          </h1>
          <p className="mt-1 text-sm text-gray-400">Plans, subscriptions &amp; network usage visibility.</p>
        </div>
        <button
          onClick={handleRefresh}
          className="btn-ghost flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-white"
        >
          <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard title="Total Plans"   value={summary.total_plans ?? '—'}   icon={Radio}    color="violet"  />
        <StatCard title="Active Subs"   value={summary.active_subs ?? '—'}   icon={Users}    color="emerald" delay={40} />
        <StatCard title="Data Used"     value={summary.total_data_used ? `${summary.total_data_used} GB` : '—'} icon={Wifi} color="blue" delay={80} />
        <StatCard title="Revenue"       value={summary.revenue ? `₹${Number(summary.revenue).toLocaleString('en-IN')}` : '—'} icon={BarChart2} color="brand" delay={120} />
      </div>

      {/* ── Charts + Update Form ── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.7fr_1fr]">

        {/* Charts column */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <ChartWrapper
            type="pie"
            data={subByStatus}
            dataKey="count"
            xKey="name"
            title="Subscriptions by Status"
          />
          <ChartWrapper
            type="bar"
            data={planByType}
            dataKey="count"
            xKey="name"
            title="Plans by Type"
            color="#8b5cf6"
          />
        </div>

        {/* Update Form */}
        <div className="glass rounded-2xl p-6 space-y-5">
          <div>
            <h3 className="font-display text-sm font-semibold text-gray-100">Update Subscription</h3>
            <p className="mt-0.5 text-[11px] text-gray-600">Change the status of any existing subscription.</p>
          </div>

          <form onSubmit={handleSubscriptionUpdate} className="space-y-4">
            <div className="space-y-1">
              <label className="block font-mono text-[10px] tracking-widest text-gray-600 uppercase">
                Subscription ID
              </label>
              <input
                className="input-field"
                placeholder="e.g. 1042"
                value={subForm.sub_id}
                onChange={(e) => setSubForm((p) => ({ ...p, sub_id: e.target.value }))}
              />
            </div>

            <div className="space-y-1">
              <label className="block font-mono text-[10px] tracking-widest text-gray-600 uppercase">
                New Status
              </label>
              <select
                className="input-field"
                value={subForm.status}
                onChange={(e) => setSubForm((p) => ({ ...p, status: e.target.value }))}
              >
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-2.5 text-sm disabled:opacity-50"
            >
              {submitting ? 'Updating…' : 'Update Subscription'}
            </button>
          </form>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div className="flex w-fit gap-1 rounded-xl bg-surface-800/60 p-1">
        {TABS.map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`rounded-lg px-5 py-2 text-sm font-display font-medium capitalize transition-all duration-200 ${
              tab === item
                ? 'border border-violet-500/25 bg-violet-500/20 text-violet-300'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* ── Plans Table ── */}
      {tab === 'plans' && (
        <TableShell cols={['ID', 'Plan Name', 'Type', 'Data', 'Price', 'Validity']}>
          {plans.map((row) => (
            <tr key={row.plan_id} className="group transition-colors hover:bg-white/[0.02]">
              <td className="px-5 py-3.5 font-mono text-xs text-gray-600">#{row.plan_id}</td>
              <td className="px-5 py-3.5 text-sm font-medium text-gray-200">{row.plan_name}</td>
              <td className="px-5 py-3.5">
                <Badge value={row.plan_type} map={TYPE_BADGE} />
              </td>
              <td className="px-5 py-3.5 font-mono text-xs text-violet-400">{row.data_gb} GB</td>
              <td className="px-5 py-3.5 font-mono text-xs text-emerald-400">₹{row.price}</td>
              <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{row.validity_days} days</td>
            </tr>
          ))}
        </TableShell>
      )}

      {/* ── Subscriptions Table ── */}
      {tab === 'subscriptions' && (
        <TableShell cols={['ID', 'Customer', 'Email', 'Plan', 'Status', 'Renew']}>
          {subs.map((row) => (
            <tr key={row.sub_id} className="group transition-colors hover:bg-white/[0.02]">
              <td className="px-5 py-3.5 font-mono text-xs text-gray-600">#{row.sub_id}</td>
              <td className="px-5 py-3.5 text-sm font-medium text-gray-200">{row.name}</td>
              <td className="px-5 py-3.5 text-xs text-gray-500">{row.email}</td>
              <td className="px-5 py-3.5 text-xs text-gray-400">{row.plan_name}</td>
              <td className="px-5 py-3.5">
                <Badge value={row.status} map={STATUS_BADGE} />
              </td>
              <td className="px-5 py-3.5">
                <button
                  onClick={() => renewSubscription(row.sub_id)}
                  title="Renew subscription"
                  className="btn-ghost flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-gray-400 hover:text-emerald-400"
                >
                  <RotateCw size={11} />
                  Renew
                </button>
              </td>
            </tr>
          ))}
        </TableShell>
      )}

      {/* ── Usage Table ── */}
      {tab === 'usage' && (
        <TableShell cols={['ID', 'Customer', 'Plan', 'Date', 'Data Used', 'Call Minutes']}>
          {usage.map((row) => (
            <tr key={row.usage_id} className="group transition-colors hover:bg-white/[0.02]">
              <td className="px-5 py-3.5 font-mono text-xs text-gray-600">#{row.usage_id}</td>
              <td className="px-5 py-3.5 text-sm font-medium text-gray-200">{row.name}</td>
              <td className="px-5 py-3.5 text-xs text-gray-400">{row.plan_name}</td>
              <td className="px-5 py-3.5 font-mono text-xs text-gray-600">{row.usage_date?.slice(0, 10)}</td>
              <td className="px-5 py-3.5 font-mono text-xs text-violet-400">{row.data_used_gb} GB</td>
              <td className="px-5 py-3.5 font-mono text-xs text-blue-400">{row.call_minutes} min</td>
            </tr>
          ))}
        </TableShell>
      )}
    </div>
  )
}