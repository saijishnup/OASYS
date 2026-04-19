import { useEffect, useState } from 'react'
import { Car, ShoppingCart, Wrench, Package } from 'lucide-react'
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

export default function Automobiles() {
  const [vehicles, setVehicles] = useState([])
  const [orders, setOrders] = useState([])
  const [services, setServices] = useState([])
  const [summary, setSummary] = useState({})
  const [ordersByStatus, setOrdersByStatus] = useState([])
  const [vehiclesByType, setVehiclesByType] = useState([])
  const [serviceByStatus, setServiceByStatus] = useState([])
  const [salesByType, setSalesByType] = useState([])
  const [tab, setTab] = useState('vehicles')
  const [orderForm, setOrderForm] = useState({ user_id: '', vehicle_id: '' })
  const [submitting, setSubmitting] = useState(false)

  const loadAutomobileData = async () => {
    const [
      vehiclesRes,
      ordersRes,
      servicesRes,
      summaryRes,
      statusRes,
      typesRes,
      serviceStatusRes,
      salesRes,
    ] = await Promise.all([
      api.get('/automobiles/vehicles'),
      api.get('/automobiles/orders'),
      api.get('/automobiles/service-requests'),
      api.get('/automobiles/summary'),
      api.get('/automobiles/orders-by-status'),
      api.get('/automobiles/vehicles-by-type'),
      api.get('/automobiles/service-by-status'),
      api.get('/automobiles/sales-by-type'),
    ])

    setVehicles(vehiclesRes.data || [])
    setOrders(ordersRes.data || [])
    setServices(servicesRes.data || [])
    setSummary(summaryRes.data || {})
    setOrdersByStatus((statusRes.data || []).map((row) => ({ name: row.status, count: row.count })))
    setVehiclesByType((typesRes.data || []).map((row) => ({ name: row.vehicle_type, count: row.count })))
    setServiceByStatus((serviceStatusRes.data || []).map((row) => ({ name: row.status, count: row.count })))
    setSalesByType((salesRes.data || []).map((row) => ({ name: row.vehicle_type, value: Number(row.revenue || 0) })))
  }

  useEffect(() => {
    loadAutomobileData().catch(() => {})
  }, [])

  const placeOrder = async (event) => {
    event.preventDefault()
    if (!orderForm.user_id || !orderForm.vehicle_id) {
      toast.error('User ID and vehicle ID are required')
      return
    }
    setSubmitting(true)
    try {
      await api.post('/automobiles/place-order', orderForm)
      toast.success('Order placed')
      await loadAutomobileData()
      setOrderForm({ user_id: '', vehicle_id: '' })
    } catch (error) {
      toast.error(error.message || 'Order failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="flex items-center gap-3 font-display text-2xl font-bold tracking-tight text-white">
          <Car size={22} className="text-emerald-400" /> Automobiles
        </h1>
        <p className="mt-1 text-sm text-gray-400">Vehicle catalog, orders, and service operations.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard title="Vehicle Models" value={summary.total_vehicles ?? '-'} icon={Car} color="emerald" />
        <StatCard title="Stock" value={summary.total_stock ?? '-'} icon={Package} color="blue" delay={40} />
        <StatCard title="Orders" value={summary.total_orders ?? '-'} icon={ShoppingCart} color="amber" delay={80} />
        <StatCard title="Pending Service" value={summary.pending_service ?? '-'} icon={Wrench} color="brand" delay={120} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.7fr_1fr]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ChartWrapper type="bar" data={ordersByStatus} dataKey="count" xKey="name" title="Orders by Status" color="#10b981" />
          <ChartWrapper type="bar" data={serviceByStatus} dataKey="count" xKey="name" title="Service Requests by Status" color="#f59e0b" />
          <ChartWrapper type="bar" data={salesByType} dataKey="value" xKey="name" title="Revenue by Vehicle Type" color="#3b82f6" />
          <ChartWrapper type="pie" data={vehiclesByType} dataKey="count" xKey="name" title="Vehicles by Type" />
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="mb-4 text-sm font-display font-semibold text-gray-200">Place Vehicle Order</h3>
          <form onSubmit={placeOrder} className="space-y-3">
            <div>
              <label className="mb-1 block font-mono text-[11px] text-gray-600">USER ID</label>
              <input className="input-field" value={orderForm.user_id} onChange={(event) => setOrderForm((prev) => ({ ...prev, user_id: event.target.value }))} />
            </div>
            <div>
              <label className="mb-1 block font-mono text-[11px] text-gray-600">VEHICLE ID</label>
              <input className="input-field" value={orderForm.vehicle_id} onChange={(event) => setOrderForm((prev) => ({ ...prev, vehicle_id: event.target.value }))} />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
              {submitting ? 'Submitting...' : 'Place Order'}
            </button>
          </form>
        </div>
      </div>

      <div className="flex w-fit gap-1 rounded-xl bg-surface-800/60 p-1">
        {['vehicles', 'orders', 'services'].map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`rounded-lg px-4 py-2 text-sm font-display font-medium capitalize transition-all duration-200 ${
              tab === item ? 'border border-emerald-500/25 bg-emerald-500/20 text-emerald-300' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === 'vehicles' && (
        <TableShell cols={['Vehicle', 'Model', 'Type', 'Fuel', 'Price', 'Stock']}>
          {vehicles.map((row) => (
            <tr key={row.vehicle_id} className="table-row-hover border-b border-white/[0.03]">
              <td className="py-3 pr-4 font-mono text-xs text-gray-500">#{row.vehicle_id}</td>
              <td className="py-3 pr-4 text-sm text-gray-200">{row.model_name}</td>
              <td className="py-3 pr-4"><span className="badge badge-blue">{row.vehicle_type}</span></td>
              <td className="py-3 pr-4"><span className="badge badge-orange">{row.fuel_type}</span></td>
              <td className="py-3 pr-4 font-mono text-xs text-emerald-400">Rs {Number(row.price).toLocaleString('en-IN')}</td>
              <td className="py-3 font-mono text-xs text-gray-400">{row.stock_quantity}</td>
            </tr>
          ))}
        </TableShell>
      )}

      {tab === 'orders' && (
        <TableShell cols={['Order', 'Customer', 'Model', 'Type', 'Amount', 'Status']}>
          {orders.map((row) => (
            <tr key={row.vo_id} className="table-row-hover border-b border-white/[0.03]">
              <td className="py-3 pr-4 font-mono text-xs text-gray-500">#{row.vo_id}</td>
              <td className="py-3 pr-4 text-sm text-gray-200">{row.name}</td>
              <td className="py-3 pr-4 text-xs text-gray-400">{row.model_name}</td>
              <td className="py-3 pr-4 text-xs text-gray-400">{row.vehicle_type}</td>
              <td className="py-3 pr-4 font-mono text-xs text-emerald-400">{row.amount_paid ? `Rs ${Number(row.amount_paid).toLocaleString('en-IN')}` : '-'}</td>
              <td className="py-3"><span className="badge badge-blue">{row.status}</span></td>
            </tr>
          ))}
        </TableShell>
      )}

      {tab === 'services' && (
        <TableShell cols={['Request', 'Customer', 'Model', 'Service', 'Scheduled', 'Status']}>
          {services.map((row) => (
            <tr key={row.sr_id} className="table-row-hover border-b border-white/[0.03]">
              <td className="py-3 pr-4 font-mono text-xs text-gray-500">#{row.sr_id}</td>
              <td className="py-3 pr-4 text-sm text-gray-200">{row.name}</td>
              <td className="py-3 pr-4 text-xs text-gray-400">{row.model_name}</td>
              <td className="py-3 pr-4 text-xs text-gray-400">{row.service_type}</td>
              <td className="py-3 pr-4 font-mono text-xs text-gray-600">{row.scheduled_at?.slice(0, 16)}</td>
              <td className="py-3"><span className="badge badge-amber">{row.status}</span></td>
            </tr>
          ))}
        </TableShell>
      )}
    </div>
  )
}
