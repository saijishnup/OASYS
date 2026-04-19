import { useEffect, useState } from 'react'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, CartesianGrid,
    PieChart, Pie, Cell, Legend
} from 'recharts'
import StatCard     from '../components/StatCard'
import ChartWrapper from '../components/ChartWrapper'
import api          from '../api/axios'

const COLOR    = '#10B981'
const PIE_COLORS = ['#10B981', '#3B82F6', '#F97316']

const statusBadge = (status) => {
    const map = {
        available: 'badge-green',
        sold:      'badge-blue',
        rented:    'badge-yellow',
        pending:   'badge-yellow',
        completed: 'badge-green',
        cancelled: 'badge-red',
    }
    return <span className={`badge ${map[status] || 'badge-gray'}`}>{status}</span>
}

const RealEstate = () => {
    const [summary,     setSummary]     = useState(null)
    const [properties,  setProperties]  = useState([])
    const [deals,       setDeals]       = useState([])
    const [byType,      setByType]      = useState([])
    const [dealStatus,  setDealStatus]  = useState([])
    const [loading,     setLoading]     = useState(true)

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [s, p, d, bt, ds] = await Promise.all([
                    api.get('/realestate/summary'),
                    api.get('/realestate/properties'),
                    api.get('/realestate/deals'),
                    api.get('/realestate/property-by-type'),
                    api.get('/realestate/deal-status'),
                ])
                setSummary(s.data)
                setProperties(p.data)
                setDeals(d.data)
                setByType(bt.data)
                setDealStatus(ds.data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchAll()
    }, [])

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: COLOR, borderTopColor: 'transparent' }} />
        </div>
    )

    return (
        <div className="page-container">

            {/* KPIs */}
            <div className="stat-grid">
                <StatCard title="Total Properties" value={summary?.total_properties} color={COLOR}
                    subtitle="All listings"
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21H3V9.75z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 21V12h6v9" /></svg>}
                />
                <StatCard title="Available" value={summary?.available} color={COLOR}
                    subtitle="Ready for sale/rent"
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <StatCard title="Sold" value={summary?.sold} color="#3B82F6"
                    subtitle="Completed sales"
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>}
                />
                <StatCard title="Deal Revenue" value={summary?.total_deal_value} format="currency" color={COLOR}
                    subtitle="Completed deals"
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33" /></svg>}
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Property by Type Bar */}
                <div className="lg:col-span-2">
                    <ChartWrapper title="Properties by Type" subtitle="Count and total value per type">
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={byType} barSize={50}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                                <XAxis dataKey="property_type" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                                <Tooltip formatter={(v, n) => [
                                    n === 'total_value' ? '₹' + Number(v).toLocaleString('en-IN') : v, n
                                ]} />
                                <Bar dataKey="count" name="count" fill={COLOR} radius={[4,4,0,0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartWrapper>
                </div>

                {/* Deal Status Donut */}
                <ChartWrapper title="Deal Status" subtitle="Current deal breakdown">
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie data={dealStatus} dataKey="count" nameKey="status"
                                cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                                {dealStatus.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                            </Pie>
                            <Tooltip formatter={(v, n) => [v, n]} />
                            <Legend iconType="circle" iconSize={8}
                                formatter={v => <span style={{ fontSize: 11, color: '#64748B' }}>{v}</span>} />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartWrapper>
            </div>

            {/* Properties Table */}
            <ChartWrapper title="Properties" subtitle={`${properties.length} listings`}>
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th><th>Title</th><th>Type</th>
                                <th>Price</th><th>Status</th><th>Listed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {properties.map(p => (
                                <tr key={p.property_id}>
                                    <td className="text-gray-400">#{p.property_id}</td>
                                    <td className="font-500">{p.title}</td>
                                    <td><span className="badge badge-blue">{p.property_type}</span></td>
                                    <td className="font-600">₹{Number(p.price).toLocaleString('en-IN')}</td>
                                    <td>{statusBadge(p.status)}</td>
                                    <td className="text-gray-400">{new Date(p.listed_at).toLocaleDateString('en-IN')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ChartWrapper>

            {/* Deals Table */}
            <ChartWrapper title="Deals" subtitle={`${deals.length} records`}>
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th><th>Property</th><th>Type</th>
                                <th>Buyer</th><th>Agent</th>
                                <th>Deal Value</th><th>Status</th><th>Opened</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deals.map(d => (
                                <tr key={d.deal_id}>
                                    <td className="text-gray-400">#{d.deal_id}</td>
                                    <td className="font-500 max-w-xs truncate">{d.property}</td>
                                    <td><span className="badge badge-purple">{d.property_type}</span></td>
                                    <td>{d.buyer}</td>
                                    <td className="text-gray-500">{d.agent}</td>
                                    <td className="font-600">₹{Number(d.deal_value).toLocaleString('en-IN')}</td>
                                    <td>{statusBadge(d.status)}</td>
                                    <td className="text-gray-400">{new Date(d.opened_at).toLocaleDateString('en-IN')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ChartWrapper>

        </div>
    )
}

export default RealEstate