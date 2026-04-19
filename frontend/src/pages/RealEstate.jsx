import { useEffect, useState } from 'react'
import { Building2, Home, BadgeIndianRupee, Clock3 } from 'lucide-react'
import api from '../api/axios'
import StatCard from '../components/StatCard'
import ChartWrapper from '../components/ChartWrapper'
import toast from 'react-hot-toast'

function TableShell({ title, columns, rows, renderRow }) {
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="border-b border-white/[0.05] px-5 py-4">
        <h3 className="text-sm font-display font-semibold text-gray-200">{title}</h3>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.05]">
            {columns.map((column) => (
              <th key={column} className="px-5 py-4 text-left font-mono text-[11px] tracking-wide text-gray-600">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{rows.map(renderRow)}</tbody>
      </table>
    </div>
  )
}

export default function RealEstate() {
  const [properties, setProperties] = useState([])
  const [deals, setDeals] = useState([])
  const [summary, setSummary] = useState({})
  const [propertyByType, setPropertyByType] = useState([])
  const [dealStatus, setDealStatus] = useState([])
  const [dealForm, setDealForm] = useState({ deal_id: '', status: 'pending' })
  const [propertyForm, setPropertyForm] = useState({ property_id: '', title: '', property_type: 'residential', price: '', status: 'available' })
  const [submitting, setSubmitting] = useState(false)

  const loadRealEstateData = async () => {
    const [propertiesRes, dealsRes, summaryRes, typeRes, statusRes] = await Promise.all([
      api.get('/realestate/properties'),
      api.get('/realestate/deals'),
      api.get('/realestate/summary'),
      api.get('/realestate/property-by-type'),
      api.get('/realestate/deal-status'),
    ])

    setProperties(propertiesRes.data || [])
    setDeals(dealsRes.data || [])
    setSummary(summaryRes.data || {})
    setPropertyByType((typeRes.data || []).map((row) => ({ name: row.property_type, count: row.count })))
    setDealStatus((statusRes.data || []).map((row) => ({ name: row.status, count: row.count })))
  }

  useEffect(() => {
    loadRealEstateData().catch(() => {})
  }, [])

  const handleDealUpdate = async (event) => {
    event.preventDefault()
    if (!dealForm.deal_id) {
      toast.error('Deal ID is required')
      return
    }

    setSubmitting(true)
    try {
      await api.post('/realestate/update-deal-status', dealForm)
      toast.success('Deal updated')
      await loadRealEstateData()
      setDealForm({ deal_id: '', status: 'pending' })
    } catch (error) {
      toast.error(error.message || 'Update failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handlePropertyUpdate = async (event) => {
    event.preventDefault()
    if (!propertyForm.property_id || !propertyForm.title || !propertyForm.price) {
      toast.error('Property ID, title, and price are required')
      return
    }

    setSubmitting(true)
    try {
      await api.post('/realestate/update-property', propertyForm)
      toast.success('Property updated successfully')
      await loadRealEstateData()
      setPropertyForm({ property_id: '', title: '', property_type: 'residential', price: '', status: 'available' })
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
          <Building2 size={22} className="text-blue-400" /> Real Estate
        </h1>
        <p className="mt-1 text-sm text-gray-400">Property inventory, deal flow, and market value snapshots.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard title="Properties" value={summary.total_properties ?? '-'} icon={Home} color="blue" />
        <StatCard title="Available" value={summary.available ?? '-'} icon={Building2} color="emerald" delay={40} />
        <StatCard title="Pending Deals" value={summary.pending_deals ?? '-'} icon={Clock3} color="amber" delay={80} />
        <StatCard title="Deal Value" value={summary.total_deal_value ? `Rs ${Number(summary.total_deal_value).toLocaleString('en-IN')}` : '-'} icon={BadgeIndianRupee} color="brand" delay={120} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.7fr_1fr]">
        <div className="grid grid-cols-1 gap-4">
          <ChartWrapper type="pie" data={propertyByType} dataKey="count" xKey="name" title="Properties by Type" />
          <ChartWrapper type="bar" data={dealStatus} dataKey="count" xKey="name" title="Deals by Status" color="#3b82f6" />
        </div>

        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <h3 className="mb-4 text-sm font-display font-semibold text-gray-200">Update Property</h3>
            <form onSubmit={handlePropertyUpdate} className="space-y-3">
              <div>
                <label className="mb-1 block font-mono text-[11px] text-gray-600">PROPERTY ID</label>
                <input type="number" className="input-field" value={propertyForm.property_id} onChange={(event) => setPropertyForm((prev) => ({ ...prev, property_id: event.target.value }))} />
              </div>
              <div>
                <label className="mb-1 block font-mono text-[11px] text-gray-600">TITLE</label>
                <input type="text" className="input-field" value={propertyForm.title} onChange={(event) => setPropertyForm((prev) => ({ ...prev, title: event.target.value }))} placeholder="Property title" />
              </div>
              <div>
                <label className="mb-1 block font-mono text-[11px] text-gray-600">TYPE</label>
                <select className="input-field" value={propertyForm.property_type} onChange={(event) => setPropertyForm((prev) => ({ ...prev, property_type: event.target.value }))}>
                  <option value="residential">residential</option>
                  <option value="commercial">commercial</option>
                  <option value="industrial">industrial</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block font-mono text-[11px] text-gray-600">PRICE</label>
                <input type="number" className="input-field" value={propertyForm.price} onChange={(event) => setPropertyForm((prev) => ({ ...prev, price: event.target.value }))} placeholder="Enter price" />
              </div>
              <div>
                <label className="mb-1 block font-mono text-[11px] text-gray-600">STATUS</label>
                <select className="input-field" value={propertyForm.status} onChange={(event) => setPropertyForm((prev) => ({ ...prev, status: event.target.value }))}>
                  <option value="available">available</option>
                  <option value="sold">sold</option>
                  <option value="rented">rented</option>
                </select>
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
                {submitting ? 'Updating...' : 'Update Property'}
              </button>
            </form>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="mb-4 text-sm font-display font-semibold text-gray-200">Update Deal Status</h3>
            <form onSubmit={handleDealUpdate} className="space-y-3">
              <div>
                <label className="mb-1 block font-mono text-[11px] text-gray-600">DEAL ID</label>
                <input className="input-field" value={dealForm.deal_id} onChange={(event) => setDealForm((prev) => ({ ...prev, deal_id: event.target.value }))} />
              </div>
              <div>
                <label className="mb-1 block font-mono text-[11px] text-gray-600">STATUS</label>
                <select className="input-field" value={dealForm.status} onChange={(event) => setDealForm((prev) => ({ ...prev, status: event.target.value }))}>
                  <option value="pending">pending</option>
                  <option value="completed">completed</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
                {submitting ? 'Updating...' : 'Update Deal'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <TableShell
        title="Properties"
        columns={['Property', 'Type', 'Price', 'Status', 'Listed']}
        rows={properties}
        renderRow={(row) => (
          <tr key={row.property_id} className="table-row-hover border-b border-white/[0.03]">
            <td className="px-5 py-3.5 text-sm text-gray-200">{row.title}</td>
            <td className="px-5 py-3.5"><span className="badge badge-blue">{row.property_type}</span></td>
            <td className="px-5 py-3.5 font-mono text-xs text-blue-300">Rs {Number(row.price).toLocaleString('en-IN')}</td>
            <td className="px-5 py-3.5"><span className="badge badge-gray">{row.status}</span></td>
            <td className="px-5 py-3.5 font-mono text-xs text-gray-600">{row.listed_at?.slice(0, 10)}</td>
          </tr>
        )}
      />

      <TableShell
        title="Deals"
        columns={['Deal', 'Property', 'Buyer', 'Agent', 'Value', 'Status']}
        rows={deals}
        renderRow={(row) => (
          <tr key={row.deal_id} className="table-row-hover border-b border-white/[0.03]">
            <td className="px-5 py-3.5 font-mono text-xs text-gray-500">#{row.deal_id}</td>
            <td className="px-5 py-3.5 text-sm text-gray-200">{row.property}</td>
            <td className="px-5 py-3.5 text-xs text-gray-400">{row.buyer}</td>
            <td className="px-5 py-3.5 text-xs text-gray-400">{row.agent}</td>
            <td className="px-5 py-3.5 font-mono text-xs text-emerald-400">Rs {Number(row.deal_value).toLocaleString('en-IN')}</td>
            <td className="px-5 py-3.5"><span className="badge badge-orange">{row.status}</span></td>
          </tr>
        )}
      />
    </div>
  )
}
