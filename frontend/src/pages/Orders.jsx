import { useEffect, useState } from 'react'
import { ShoppingCart, Car, Building2, IndianRupee } from 'lucide-react'
import StatCard from '../components/StatCard'
import ChartWrapper from '../components/ChartWrapper'
import api from '../api/axios'

function TableShell({ cols, children }) {
  return (
    <div className="glass overflow-x-auto rounded-2xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.05]">
            {cols.map((column) => (
              <th key={column} className="px-5 py-4 text-left font-mono text-[11px] tracking-wide text-gray-600">
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

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    Promise.all([api.get('/automobiles/orders'), api.get('/realestate/deals')])
      .then(([vehicleRes, dealsRes]) => {
        const vehicleOrders = (vehicleRes.data || []).map((row) => ({
          id: row.vo_id,
          type: 'Vehicle',
          customer: row.name,
          item: row.model_name,
          value: row.amount_paid,
          status: row.status,
          date: row.order_date,
        }))
        const dealOrders = (dealsRes.data || []).map((row) => ({
          id: row.deal_id,
          type: 'Property',
          customer: row.buyer,
          item: row.property,
          value: row.deal_value,
          status: row.status,
          date: row.opened_at,
        }))
        const merged = [...vehicleOrders, ...dealOrders].sort((a, b) => new Date(b.date) - new Date(a.date))
        setOrders(merged)
        setChartData([
          { name: 'Vehicle', count: vehicleOrders.length },
          { name: 'Property', count: dealOrders.length },
        ])
      })
      .catch(() => {})
  }, [])

  const vehicleCount = orders.filter((row) => row.type === 'Vehicle').length
  const propertyCount = orders.filter((row) => row.type === 'Property').length
  const totalValue = orders.reduce((sum, row) => sum + Number(row.value || 0), 0)

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="flex items-center gap-3 font-display text-2xl font-bold tracking-tight text-white">
          <ShoppingCart size={22} className="text-orange-400" /> Orders
        </h1>
        <p className="mt-1 text-sm text-gray-500">Unified read-only view across vehicle orders and real-estate deals.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard title="All Orders" value={orders.length} icon={ShoppingCart} color="brand" />
        <StatCard title="Vehicle" value={vehicleCount} icon={Car} color="amber" delay={40} />
        <StatCard title="Property" value={propertyCount} icon={Building2} color="blue" delay={80} />
        <StatCard title="Total Value" value={totalValue ? `Rs ${totalValue.toLocaleString('en-IN')}` : '-'} icon={IndianRupee} color="emerald" delay={120} />
      </div>

      <ChartWrapper type="pie" data={chartData} dataKey="count" xKey="name" title="Orders by Domain" />

      <TableShell cols={['ID', 'Type', 'Customer', 'Item', 'Value', 'Status', 'Date']}>
        {orders.map((row) => (
          <tr key={`${row.type}-${row.id}`} className="table-row-hover border-b border-white/[0.03]">
            <td className="px-5 py-3.5 font-mono text-xs text-gray-500">#{row.id}</td>
            <td className="px-5 py-3.5"><span className="badge badge-orange">{row.type}</span></td>
            <td className="px-5 py-3.5 text-sm text-gray-200">{row.customer}</td>
            <td className="px-5 py-3.5 text-xs text-gray-400">{row.item}</td>
            <td className="px-5 py-3.5 font-mono text-xs text-emerald-400">Rs {Number(row.value || 0).toLocaleString('en-IN')}</td>
            <td className="px-5 py-3.5"><span className="badge badge-gray">{row.status}</span></td>
            <td className="px-5 py-3.5 font-mono text-xs text-gray-600">{row.date?.slice(0, 10)}</td>
          </tr>
        ))}
      </TableShell>
    </div>
  )
}
