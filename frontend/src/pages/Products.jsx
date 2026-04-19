import { useEffect, useState } from 'react'
import { Package, Car, Radio, Building2 } from 'lucide-react'
import StatCard from '../components/StatCard'
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

export default function Products() {
  const [vehicles, setVehicles] = useState([])
  const [plans, setPlans] = useState([])
  const [properties, setProperties] = useState([])
  const [tab, setTab] = useState('vehicles')

  useEffect(() => {
    Promise.all([api.get('/automobiles/vehicles'), api.get('/telecom/plans'), api.get('/realestate/properties')])
      .then(([vehiclesRes, plansRes, propertiesRes]) => {
        setVehicles(vehiclesRes.data || [])
        setPlans(plansRes.data || [])
        setProperties(propertiesRes.data || [])
      })
      .catch(() => {})
  }, [])

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="flex items-center gap-3 font-display text-2xl font-bold tracking-tight text-white">
          <Package size={22} className="text-lime-400" /> Products
        </h1>
        <p className="mt-1 text-sm text-gray-500">Unified catalog view for vehicles, telecom plans, and property listings.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard title="Vehicles" value={vehicles.length} icon={Car} color="emerald" />
        <StatCard title="Plans" value={plans.length} icon={Radio} color="violet" delay={40} />
        <StatCard title="Properties" value={properties.length} icon={Building2} color="blue" delay={80} />
        <StatCard title="Stock Units" value={vehicles.reduce((sum, row) => sum + Number(row.stock_quantity || 0), 0)} icon={Package} color="brand" delay={120} />
      </div>

      <div className="flex w-fit gap-1 rounded-xl bg-surface-800/60 p-1">
        {['vehicles', 'plans', 'properties'].map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`rounded-lg px-4 py-2 text-sm font-display font-medium capitalize transition-all duration-200 ${
              tab === item ? 'border border-brand-500/25 bg-brand-500/20 text-brand-300' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === 'vehicles' && (
        <TableShell cols={['ID', 'Model', 'Type', 'Fuel', 'Price', 'Stock']}>
          {vehicles.map((row) => (
            <tr key={row.vehicle_id} className="table-row-hover border-b border-white/[0.03]">
              <td className="px-5 py-3.5 font-mono text-xs text-gray-500">#{row.vehicle_id}</td>
              <td className="px-5 py-3.5 text-sm text-gray-200">{row.model_name}</td>
              <td className="px-5 py-3.5"><span className="badge badge-blue">{row.vehicle_type}</span></td>
              <td className="px-5 py-3.5"><span className="badge badge-orange">{row.fuel_type}</span></td>
              <td className="px-5 py-3.5 font-mono text-xs text-emerald-400">Rs {Number(row.price).toLocaleString('en-IN')}</td>
              <td className="px-5 py-3.5 font-mono text-xs text-gray-400">{row.stock_quantity}</td>
            </tr>
          ))}
        </TableShell>
      )}

      {tab === 'plans' && (
        <TableShell cols={['ID', 'Plan', 'Type', 'Data', 'Price', 'Validity']}>
          {plans.map((row) => (
            <tr key={row.plan_id} className="table-row-hover border-b border-white/[0.03]">
              <td className="px-5 py-3.5 font-mono text-xs text-gray-500">#{row.plan_id}</td>
              <td className="px-5 py-3.5 text-sm text-gray-200">{row.plan_name}</td>
              <td className="px-5 py-3.5"><span className="badge badge-violet">{row.plan_type}</span></td>
              <td className="px-5 py-3.5 font-mono text-xs text-blue-300">{row.data_gb} GB</td>
              <td className="px-5 py-3.5 font-mono text-xs text-emerald-400">Rs {row.price}</td>
              <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{row.validity_days}d</td>
            </tr>
          ))}
        </TableShell>
      )}

      {tab === 'properties' && (
        <TableShell cols={['ID', 'Title', 'Type', 'Price', 'Status', 'Listed']}>
          {properties.map((row) => (
            <tr key={row.property_id} className="table-row-hover border-b border-white/[0.03]">
              <td className="px-5 py-3.5 font-mono text-xs text-gray-500">#{row.property_id}</td>
              <td className="px-5 py-3.5 text-sm text-gray-200">{row.title}</td>
              <td className="px-5 py-3.5"><span className="badge badge-blue">{row.property_type}</span></td>
              <td className="px-5 py-3.5 font-mono text-xs text-emerald-400">Rs {Number(row.price).toLocaleString('en-IN')}</td>
              <td className="px-5 py-3.5"><span className="badge badge-gray">{row.status}</span></td>
              <td className="px-5 py-3.5 font-mono text-xs text-gray-600">{row.listed_at?.slice(0, 10)}</td>
            </tr>
          ))}
        </TableShell>
      )}
    </div>
  )
}
