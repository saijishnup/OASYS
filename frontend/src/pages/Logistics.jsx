import { useEffect, useState } from 'react'
import { Package, Truck, MapPin, CheckCircle } from 'lucide-react'
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

export default function Logistics() {
  const [shipments, setShipments] = useState([])
  const [routes, setRoutes] = useState([])
  const [summary, setSummary] = useState({})
  const [shipmentByStatus, setShipmentByStatus] = useState([])
  const [topRoutes, setTopRoutes] = useState([])
  const [tab, setTab] = useState('shipments')
  const [shipmentForm, setShipmentForm] = useState({ shipment_id: '', status: 'pending' })
  const [submitting, setSubmitting] = useState(false)

  const loadLogisticsData = async () => {
    const [shipmentsRes, routesRes, summaryRes, statusRes, topRoutesRes] = await Promise.all([
      api.get('/logistics/shipments'),
      api.get('/logistics/routes'),
      api.get('/logistics/summary'),
      api.get('/logistics/shipment-by-status'),
      api.get('/logistics/top-routes'),
    ])

    setShipments(shipmentsRes.data || [])
    setRoutes(routesRes.data || [])
    setSummary(summaryRes.data || {})
    setShipmentByStatus((statusRes.data || []).map((row) => ({ name: row.status, count: row.count })))
    setTopRoutes((topRoutesRes.data || []).map((row) => ({ name: row.route, shipment_count: row.shipment_count })))
  }

  useEffect(() => {
    loadLogisticsData().catch(() => {})
  }, [])

  const updateStatus = async (shipmentId, status) => {
    try {
      await api.post('/logistics/update-status', { shipment_id: shipmentId, status })
      toast.success('Shipment status updated')
      await loadLogisticsData()
    } catch (error) {
      toast.error(error.message || 'Update failed')
    }
  }

  const handleShipmentUpdate = async (event) => {
    event.preventDefault()
    if (!shipmentForm.shipment_id) {
      toast.error('Shipment ID is required')
      return
    }

    setSubmitting(true)
    try {
      await api.post('/logistics/update-status', shipmentForm)
      toast.success('Shipment status updated')
      await loadLogisticsData()
      setShipmentForm({ shipment_id: '', status: 'pending' })
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
          <Package size={22} className="text-amber-400" /> Logistics
        </h1>
        <p className="mt-1 text-sm text-gray-400">Shipment operations, route catalog, and delivery status.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard title="Shipments" value={summary.total_shipments ?? '-'} icon={Package} color="amber" />
        <StatCard title="Delivered" value={summary.delivered ?? '-'} icon={CheckCircle} color="emerald" delay={40} />
        <StatCard title="In Transit" value={summary.in_transit ?? '-'} icon={Truck} color="blue" delay={80} />
        <StatCard title="Routes" value={summary.total_routes ?? '-'} icon={MapPin} color="brand" delay={120} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.7fr_1fr]">
        <div className="grid grid-cols-1 gap-4">
          <ChartWrapper type="pie" data={shipmentByStatus} dataKey="count" xKey="name" title="Shipments by Status" />
          <ChartWrapper type="bar" data={topRoutes} dataKey="shipment_count" xKey="name" title="Top Shipment Routes" color="#f59e0b" />
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="mb-4 text-sm font-display font-semibold text-gray-200">Update Shipment</h3>
          <form onSubmit={handleShipmentUpdate} className="space-y-3">
            <div>
              <label className="mb-1 block font-mono text-[11px] text-gray-600">SHIPMENT ID</label>
              <input className="input-field" value={shipmentForm.shipment_id} onChange={(event) => setShipmentForm((prev) => ({ ...prev, shipment_id: event.target.value }))} />
            </div>
            <div>
              <label className="mb-1 block font-mono text-[11px] text-gray-600">STATUS</label>
              <select className="input-field" value={shipmentForm.status} onChange={(event) => setShipmentForm((prev) => ({ ...prev, status: event.target.value }))}>
                <option value="pending">pending</option>
                <option value="in_transit">in_transit</option>
                <option value="delivered">delivered</option>
                <option value="cancelled">cancelled</option>
              </select>
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
              {submitting ? 'Updating...' : 'Update Shipment'}
            </button>
          </form>
        </div>
      </div>

      <div className="flex w-fit gap-1 rounded-xl bg-surface-800/60 p-1">
        {['shipments', 'routes'].map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`rounded-lg px-4 py-2 text-sm font-display font-medium capitalize transition-all duration-200 ${
              tab === item ? 'border border-amber-500/25 bg-amber-500/20 text-amber-300' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === 'shipments' && (
        <TableShell cols={['Shipment', 'Sender', 'Receiver', 'Route', 'Tracking', 'Status', 'Update']}>
          {shipments.map((row) => (
            <tr key={row.shipment_id} className="table-row-hover border-b border-white/[0.03]">
              <td className="py-3 pr-4 font-mono text-xs text-gray-500">#{row.shipment_id}</td>
              <td className="py-3 pr-4 text-sm text-gray-200">{row.sender}</td>
              <td className="py-3 pr-4 text-sm text-gray-200">{row.receiver}</td>
              <td className="py-3 pr-4 text-xs text-gray-400">{row.origin} to {row.destination}</td>
              <td className="py-3 pr-4 font-mono text-xs text-amber-400">{row.tracking_number}</td>
              <td className="py-3 pr-4"><span className="badge badge-blue">{row.status}</span></td>
              <td className="py-3">
                <select
                  value={row.status}
                  onChange={(event) => updateStatus(row.shipment_id, event.target.value)}
                  className="input-field py-1 text-xs"
                >
                  <option value="pending">pending</option>
                  <option value="in_transit">in_transit</option>
                  <option value="delivered">delivered</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </TableShell>
      )}

      {tab === 'routes' && (
        <TableShell cols={['Route', 'Origin', 'Destination', 'Distance', 'Avg Days']}>
          {routes.map((row) => (
            <tr key={row.route_id} className="table-row-hover border-b border-white/[0.03]">
              <td className="py-3 pr-4 font-mono text-xs text-gray-500">#{row.route_id}</td>
              <td className="py-3 pr-4 text-sm text-gray-200">{row.origin}</td>
              <td className="py-3 pr-4 text-sm text-gray-200">{row.destination}</td>
              <td className="py-3 pr-4 font-mono text-xs text-amber-400">{row.distance_km} km</td>
              <td className="py-3 font-mono text-xs text-blue-300">{row.avg_days}d</td>
            </tr>
          ))}
        </TableShell>
      )}
    </div>
  )
}
