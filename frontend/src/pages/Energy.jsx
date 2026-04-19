import { useEffect, useState } from 'react'
import { Zap, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react'
import StatCard from '../components/StatCard'
import ChartWrapper from '../components/ChartWrapper'
import api from '../api/axios'
import toast from 'react-hot-toast'

function TableShell({ cols, children }) {
  return (
    <div className="glass overflow-x-auto rounded-2xl p-5">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.05]">
            {cols.map((column) => (
              <th key={column} className="pr-4 pb-3 text-left font-mono text-[11px] tracking-wide text-gray-600">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export default function Energy() {
  const [connections, setConnections] = useState([])
  const [bills, setBills] = useState([])
  const [summary, setSummary] = useState({})
  const [billByStatus, setBillByStatus] = useState([])
  const [monthlyConsumption, setMonthlyConsumption] = useState([])
  const [tab, setTab] = useState('connections')
  const [billForm, setBillForm] = useState({ bill_id: '', status: 'unpaid' })
  const [submitting, setSubmitting] = useState(false)

  const loadEnergyData = async () => {
    const [connectionsRes, billsRes, summaryRes, statusRes, monthlyRes] = await Promise.all([
      api.get('/energy/connections'),
      api.get('/energy/bills'),
      api.get('/energy/summary'),
      api.get('/energy/bill-by-status'),
      api.get('/energy/monthly-consumption'),
    ])

    setConnections(connectionsRes.data || [])
    setBills(billsRes.data || [])
    setSummary(summaryRes.data || {})
    setBillByStatus((statusRes.data || []).map((row) => ({ name: row.status, count: row.count })))
    setMonthlyConsumption((monthlyRes.data || []).map((row) => ({ name: row.month, total_units: row.total_units })))
  }

  useEffect(() => {
    loadEnergyData().catch(() => {})
  }, [])

  const markPaid = async (billId) => {
    try {
      await api.post('/energy/pay-bill', { bill_id: billId })
      toast.success('Bill marked paid')
      await loadEnergyData()
    } catch (error) {
      toast.error(error.message || 'Payment update failed')
    }
  }

  const handleBillUpdate = async (event) => {
    event.preventDefault()
    if (!billForm.bill_id) {
      toast.error('Bill ID is required')
      return
    }

    setSubmitting(true)
    try {
      await api.post('/energy/update-bill-status', billForm)
      toast.success('Bill updated')
      await loadEnergyData()
      setBillForm({ bill_id: '', status: 'unpaid' })
    } catch (error) {
      toast.error(error.message || 'Update failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="flex items-center gap-3 font-display text-2xl font-bold tracking-tight text-white">
          <Zap size={22} className="text-rose-400" /> Energy
        </h1>
        <p className="mt-1 text-sm text-gray-400">Connections, billing, and monthly consumption trends.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard title="Connections" value={summary.total_connections ?? '-'} icon={Zap} color="rose" />
        <StatCard title="Active" value={summary.active ?? '-'} icon={Activity} color="emerald" delay={40} />
        <StatCard title="Unpaid" value={summary.unpaid_count ?? '-'} icon={AlertTriangle} color="amber" delay={80} />
        <StatCard title="Collected" value={summary.total_collected ? `Rs ${Number(summary.total_collected).toLocaleString('en-IN')}` : '-'} icon={CheckCircle2} color="blue" delay={120} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.7fr_1fr]">
        <div className="grid grid-cols-1 gap-4">
          <ChartWrapper type="bar" data={billByStatus} dataKey="count" xKey="name" title="Bills by Status" color="#f43f5e" />
          <ChartWrapper type="area" data={monthlyConsumption} dataKey="total_units" xKey="name" title="Monthly Consumption" color="#fb7185" />
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="mb-4 text-sm font-display font-semibold text-gray-200">Update Bill Status</h3>
          <form onSubmit={handleBillUpdate} className="space-y-3">
            <div>
              <label className="mb-1 block font-mono text-[11px] text-gray-600">BILL ID</label>
              <input className="input-field" value={billForm.bill_id} onChange={(event) => setBillForm((prev) => ({ ...prev, bill_id: event.target.value }))} />
            </div>
            <div>
              <label className="mb-1 block font-mono text-[11px] text-gray-600">STATUS</label>
              <select className="input-field" value={billForm.status} onChange={(event) => setBillForm((prev) => ({ ...prev, status: event.target.value }))}>
                <option value="unpaid">unpaid</option>
                <option value="paid">paid</option>
                <option value="overdue">overdue</option>
              </select>
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
              {submitting ? 'Updating...' : 'Update Bill'}
            </button>
          </form>
        </div>
      </div>

      <div className="flex w-fit gap-1 rounded-xl bg-surface-800/60 p-1">
        {['connections', 'bills'].map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`rounded-lg px-4 py-2 text-sm font-display font-medium capitalize transition-all duration-200 ${
              tab === item ? 'border border-rose-500/25 bg-rose-500/20 text-rose-300' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === 'connections' && (
        <TableShell cols={['Connection', 'Customer', 'Email', 'Type', 'Meter', 'Status']}>
          {connections.map((row) => (
            <tr key={row.connection_id} className="table-row-hover border-b border-white/[0.03]">
              <td className="py-3 pr-4 font-mono text-xs text-gray-500">#{row.connection_id}</td>
              <td className="py-3 pr-4 text-sm text-gray-200">{row.name}</td>
              <td className="py-3 pr-4 text-xs text-gray-400">{row.email}</td>
              <td className="py-3 pr-4"><span className="badge badge-blue">{row.connection_type}</span></td>
              <td className="py-3 pr-4 font-mono text-xs text-rose-400">{row.meter_number}</td>
              <td className="py-3"><span className="badge badge-gray">{row.status}</span></td>
            </tr>
          ))}
        </TableShell>
      )}

      {tab === 'bills' && (
        <TableShell cols={['Bill', 'Customer', 'Month', 'Units', 'Amount', 'Status', 'Action']}>
          {bills.map((row) => (
            <tr key={row.bill_id} className="table-row-hover border-b border-white/[0.03]">
              <td className="py-3 pr-4 font-mono text-xs text-gray-500">#{row.bill_id}</td>
              <td className="py-3 pr-4 text-sm text-gray-200">{row.name}</td>
              <td className="py-3 pr-4 font-mono text-xs text-gray-500">{row.billing_month?.slice(0, 7)}</td>
              <td className="py-3 pr-4 font-mono text-xs text-rose-400">{row.units_consumed}</td>
              <td className="py-3 pr-4 font-mono text-xs text-white">Rs {Number(row.amount_due).toLocaleString('en-IN')}</td>
              <td className="py-3 pr-4"><span className="badge badge-yellow">{row.status}</span></td>
              <td className="py-3">
                {row.status !== 'paid' ? (
                  <button onClick={() => markPaid(row.bill_id)} className="btn-ghost px-3 py-1.5 text-xs">
                    Mark Paid
                  </button>
                ) : (
                  <span className="font-mono text-xs text-emerald-400">Complete</span>
                )}
              </td>
            </tr>
          ))}
        </TableShell>
      )}
    </div>
  )
}
