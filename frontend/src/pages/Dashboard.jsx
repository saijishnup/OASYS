import { useEffect, useState } from 'react'
import { Activity, IndianRupee, Receipt, Truck, AlertTriangle, Car, RefreshCw, Loader2 } from 'lucide-react'
import api from '../api/axios'
import StatCard from '../components/StatCard'
import ChartWrapper from '../components/ChartWrapper'

function ActivityTable({ rows, loading }) {
  if (loading) {
    return (
      <div className="glass flex min-h-[220px] items-center justify-center rounded-2xl">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Loader2 size={16} className="animate-spin" />
          Loading recent activity...
        </div>
      </div>
    )
  }

  if (!rows.length) {
    return (
      <div className="glass flex min-h-[220px] items-center justify-center rounded-2xl">
        <p className="text-sm text-gray-500">No recent activity available.</p>
      </div>
    )
  }

  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="border-b border-white/[0.05] px-5 py-4">
        <h3 className="text-sm font-display font-semibold text-gray-200">Recent Activity</h3>
      </div>
      <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-white/[0.05]">
            {['Vertical', 'Action', 'Table', 'Description', 'When'].map((column) => (
              <th key={column} className="px-5 py-4 text-left font-mono text-[11px] tracking-wide text-gray-600">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.log_id} className="table-row-hover border-b border-white/[0.03]">
              <td className="px-5 py-3.5 text-xs text-gray-300">{row.vertical_name}</td>
              <td className="px-5 py-3.5">
                <span className="badge badge-blue">{row.action}</span>
              </td>
              <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{row.table_name}</td>
              <td className="px-5 py-3.5 text-xs text-gray-400">{row.description}</td>
              <td className="px-5 py-3.5 font-mono text-xs text-gray-600">{row.changed_at?.slice(0, 16)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [kpis, setKpis] = useState({})
  const [verticalSummary, setVerticalSummary] = useState([])
  const [txnTrend, setTxnTrend] = useState([])
  const [shipmentStatus, setShipmentStatus] = useState([])
  const [energyStatus, setEnergyStatus] = useState([])
  const [domainRevenue, setDomainRevenue] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDashboard = async () => {
    setLoading(true)
    setError('')

    try {
      const [
        kpisRes,
        verticalRes,
        trendRes,
        shipmentRes,
        energyRes,
        revenueRes,
        activityRes,
      ] = await Promise.all([
        api.get('/dashboard/kpis'),
        api.get('/dashboard/vertical-summary'),
        api.get('/dashboard/txn-trend'),
        api.get('/dashboard/shipment-status'),
        api.get('/dashboard/energy-bill-status'),
        api.get('/dashboard/domain-revenue'),
        api.get('/dashboard/recent-activity'),
      ])

      setKpis(kpisRes.data || {})
      setVerticalSummary(verticalRes.data || [])
      setTxnTrend((trendRes.data || []).map((row) => ({ ...row, date: row.date?.slice(5) || row.date })))
      setShipmentStatus((shipmentRes.data || []).map((row) => ({ name: row.status, count: row.count })))
      setEnergyStatus((energyRes.data || []).map((row) => ({ name: row.status, count: row.count })))
      setDomainRevenue((revenueRes.data || []).map((row) => ({ name: row.vertical, value: Number(row.value || 0) })))
      setRecentActivity(activityRes.data || [])
    } catch (err) {
      setError(err.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  const secondaryStats = [
    { title: 'Active Loans', value: kpis.active_loans ?? '-', icon: Activity, color: 'violet' },
    { title: 'Active Subs', value: kpis.active_subscriptions ?? '-', icon: Receipt, color: 'blue' },
    { title: 'Unpaid Bills', value: kpis.unpaid_bills ?? '-', icon: AlertTriangle, color: 'rose' },
    { title: 'Vehicles Sold', value: kpis.vehicles_sold ?? '-', icon: Car, color: 'emerald' },
  ]

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Enterprise Dashboard</h1>
          <p className="mt-2 text-sm text-gray-500">Live operational summary across every OASYS vertical.</p>
        </div>
        <button onClick={fetchDashboard} className="btn-ghost flex items-center gap-2 text-sm" disabled={loading}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {error ? (
        <div className="glass rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard title="Total Users" value={kpis.total_users ?? '-'} icon={Activity} color="brand" />
        <StatCard title="Transactions" value={kpis.total_transactions ?? '-'} icon={Receipt} color="blue" delay={40} />
        <StatCard title="Revenue" value={kpis.total_revenue ? `Rs ${Number(kpis.total_revenue).toLocaleString('en-IN')}` : '-'} icon={IndianRupee} color="emerald" delay={80} />
        <StatCard title="Pending Shipments" value={kpis.pending_shipments ?? '-'} icon={Truck} color="amber" delay={120} />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {secondaryStats.map((item, index) => (
          <StatCard
            key={item.title}
            title={item.title}
            value={item.value}
            icon={item.icon}
            color={item.color}
            delay={index * 40}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartWrapper type="area" data={txnTrend} dataKey="total" xKey="date" title="30-Day Transaction Value" color="#3b82f6" />
        <ChartWrapper type="pie" data={verticalSummary.map((row) => ({ name: row.vertical_name, value: row.user_count }))} dataKey="value" xKey="name" title="Users by Vertical" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartWrapper type="bar" data={shipmentStatus} dataKey="count" xKey="name" title="Shipment Status" color="#f59e0b" height={190} />
        <ChartWrapper type="bar" data={energyStatus} dataKey="count" xKey="name" title="Energy Bill Status" color="#f43f5e" height={190} />
        <ChartWrapper type="bar" data={domainRevenue} dataKey="value" xKey="name" title="Revenue by Vertical" color="#10b981" height={190} />
      </div>

      <ActivityTable rows={recentActivity} loading={loading} />
    </div>
  )
}
