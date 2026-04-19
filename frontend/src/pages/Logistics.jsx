import { useEffect, useState } from 'react'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, CartesianGrid,
    PieChart, Pie, Cell, Legend
} from 'recharts'
import StatCard     from '../components/StatCard'
import ChartWrapper from '../components/ChartWrapper'
import api          from '../api/axios'

const COLOR      = '#F97316'
const PIE_COLORS = ['#10B981', '#3B82F6', '#EAB308', '#EF4444', '#8B5CF6']

const statusBadge = (status) => {
    const map = {
        delivered:  'badge-green',
        in_transit: 'badge-blue',
        pending:    'badge-yellow',
        cancelled:  'badge-red',
    }
    return <span className={`badge ${map[status] || 'badge-gray'}`}>{status.replace('_', ' ')}</span>
}

const STATUSES = ['pending', 'in_transit', 'delivered', 'cancelled']

const Logistics = () => {
    const [summary,    setSummary]    = useState(null)
    const [shipments,  setShipments]  = useState([])
    const [routes,     setRoutes]     = useState([])
    const [byStatus,   setByStatus]   = useState([])
    const [topRoutes,  setTopRoutes]  = useState([])
    const [loading,    setLoading]    = useState(true)

    // Update status form
    const [shipId,     setShipId]     = useState('')
    const [newStatus,  setNewStatus]  = useState('delivered')
    const [updateMsg,  setUpdateMsg]  = useState(null)
    const [updateErr,  setUpdateErr]  = useState(null)
    const [updateLoad, setUpdateLoad] = useState(false)

    const fetchAll = async () => {
        try {
            const [s, sh, r, bs, tr] = await Promise.all([
                api.get('/logistics/summary'),
                api.get('/logistics/shipments'),
                api.get('/logistics/routes'),
                api.get('/logistics/shipment-by-status'),
                api.get('/logistics/top-routes'),
            ])
            setSummary(s.data)
            setShipments(sh.data)
            setRoutes(r.data)
            setByStatus(bs.data)
            setTopRoutes(tr.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchAll() }, [])

    const handleUpdate = async (e) => {
        e.preventDefault()
        setUpdateMsg(null); setUpdateErr(null); setUpdateLoad(true)
        try {
            await api.post('/logistics/update-status', {
                shipment_id: Number(shipId),
                status:      newStatus
            })
            setUpdateMsg(`Shipment #${shipId} updated to "${newStatus}"`)
            setShipId('')
            fetchAll()
        } catch (err) {
            setUpdateErr(err.response?.data?.error || 'Update failed')
        } finally {
            setUpdateLoad(false)
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: COLOR, borderTopColor: 'transparent' }} />
        </div>
    )

    return (
        <div className="page-container">

            {/* KPIs */}
            <div className="stat-grid">
                <StatCard title="Total Shipments" value={summary?.total_shipments} color={COLOR}
                    subtitle="All shipments"
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>}
                />
                <StatCard title="Delivered" value={summary?.delivered} color="#10B981"
                    subtitle="Successfully delivered"
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <StatCard title="In Transit" value={summary?.in_transit} color="#3B82F6"
                    subtitle="Currently moving"
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>}
                />
                <StatCard title="Shipping Revenue" value={summary?.total_revenue} format="currency" color={COLOR}
                    subtitle="From delivered shipments"
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33" /></svg>}
                />
            </div>

            {/* Charts + Update Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Top Routes Bar */}
                <div className="lg:col-span-2">
                    <ChartWrapper title="Top Routes" subtitle="By shipment count and revenue">
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={topRoutes} barSize={30} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                                <XAxis type="number" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                                <YAxis type="category" dataKey="route" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={130} />
                                <Tooltip formatter={(v, n) => [
                                    n === 'revenue' ? '₹' + Number(v).toLocaleString('en-IN') : v, n
                                ]} />
                                <Bar dataKey="shipment_count" name="shipments" fill={COLOR} radius={[0,4,4,0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartWrapper>
                </div>

                {/* Update Status Form */}
                <ChartWrapper title="Update Shipment" subtitle="Change shipment status">
                    <form onSubmit={handleUpdate} className="space-y-3 mt-1">
                        <div>
                            <label className="block text-xs font-600 text-gray-600 mb-1">Shipment ID</label>
                            <input className="input" type="number" placeholder="e.g. 2"
                                value={shipId} onChange={e => setShipId(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-xs font-600 text-gray-600 mb-1">New Status</label>
                            <select className="input" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                                {STATUSES.map(s => (
                                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                                ))}
                            </select>
                        </div>
                        {updateMsg && <p className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">{updateMsg}</p>}
                        {updateErr && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{updateErr}</p>}
                        <button type="submit" disabled={updateLoad}
                            className="btn w-full justify-center text-white"
                            style={{ backgroundColor: COLOR }}>
                            {updateLoad
                                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                : 'Update Status'
                            }
                        </button>
                    </form>
                </ChartWrapper>
            </div>

            {/* Status Donut */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <ChartWrapper title="Shipment Status" subtitle="Current breakdown">
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie data={byStatus} dataKey="count" nameKey="status"
                                cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3}>
                                {byStatus.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                            </Pie>
                            <Tooltip formatter={(v, n) => [v, n]} />
                            <Legend iconType="circle" iconSize={8}
                                formatter={v => <span style={{ fontSize: 11, color: '#64748B' }}>{v}</span>} />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartWrapper>

                {/* Routes Table */}
                <div className="lg:col-span-2">
                    <ChartWrapper title="Logistics Routes" subtitle={`${routes.length} routes`}>
                        <div className="table-wrapper">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>ID</th><th>Origin</th><th>Destination</th>
                                        <th>Distance</th><th>Avg Days</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {routes.map(r => (
                                        <tr key={r.route_id}>
                                            <td className="text-gray-400">#{r.route_id}</td>
                                            <td className="font-500">{r.origin}</td>
                                            <td className="font-500">{r.destination}</td>
                                            <td><span className="badge badge-orange">{r.distance_km} km</span></td>
                                            <td className="text-gray-500">{r.avg_days} days</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </ChartWrapper>
                </div>
            </div>

            {/* Shipments Table */}
            <ChartWrapper title="Shipments" subtitle={`${shipments.length} records`}>
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th><th>Tracking</th><th>Sender</th>
                                <th>Receiver</th><th>Route</th><th>Weight</th>
                                <th>Cost</th><th>Status</th><th>Shipped</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shipments.map(s => (
                                <tr key={s.shipment_id}>
                                    <td className="text-gray-400">#{s.shipment_id}</td>
                                    <td className="font-500 text-xs">{s.tracking_number}</td>
                                    <td>{s.sender}</td>
                                    <td>{s.receiver}</td>
                                    <td className="text-gray-500 text-xs">{s.origin} → {s.destination}</td>
                                    <td className="text-gray-500">{s.weight_kg} kg</td>
                                    <td className="font-600">₹{Number(s.shipping_cost).toLocaleString('en-IN')}</td>
                                    <td>{statusBadge(s.status)}</td>
                                    <td className="text-gray-400">{new Date(s.shipped_at).toLocaleDateString('en-IN')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ChartWrapper>

        </div>
    )
}

export default Logistics