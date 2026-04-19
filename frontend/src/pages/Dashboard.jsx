import { useEffect, useState } from 'react'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend
} from 'recharts'
import StatCard     from '../components/StatCard'
import ChartWrapper from '../components/ChartWrapper'
import api          from '../api/axios'

const COLORS = {
    Fintech:     '#3B82F6',
    'Real Estate': '#10B981',
    Telecom:     '#8B5CF6',
    Logistics:   '#F97316',
    Energy:      '#EAB308',
    Automobiles: '#EF4444',
}

const PIE_COLORS = ['#10B981', '#EF4444', '#EAB308', '#3B82F6', '#F97316']

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs">
            {label && <p className="font-600 text-gray-700 mb-1">{label}</p>}
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color }} className="font-500">
                    {p.name}: {typeof p.value === 'number' && p.value > 1000 ? fmt(p.value) : p.value}
                </p>
            ))}
        </div>
    )
}

const Dashboard = () => {
    const [kpis,         setKpis]         = useState(null)
    const [verticals,    setVerticals]    = useState([])
    const [activity,     setActivity]     = useState([])
    const [txnTrend,     setTxnTrend]     = useState([])
    const [domainRev,    setDomainRev]    = useState([])
    const [shipStatus,   setShipStatus]   = useState([])
    const [billStatus,   setBillStatus]   = useState([])
    const [loading,      setLoading]      = useState(true)

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [k, v, a, t, d, s, b] = await Promise.all([
                    api.get('/dashboard/kpis'),
                    api.get('/dashboard/vertical-summary'),
                    api.get('/dashboard/recent-activity'),
                    api.get('/dashboard/txn-trend'),
                    api.get('/dashboard/domain-revenue'),
                    api.get('/dashboard/shipment-status'),
                    api.get('/dashboard/energy-bill-status'),
                ])
                setKpis(k.data)
                setVerticals(v.data)
                setActivity(a.data)
                setTxnTrend(t.data)
                setDomainRev(d.data)
                setShipStatus(s.data)
                setBillStatus(b.data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchAll()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-gray-400">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="page-container">

            {/* KPI Cards */}
            <div className="stat-grid">
                <StatCard
                    title="Total Users"
                    value={kpis?.total_users}
                    subtitle="Across all verticals"
                    color="#3B82F6"
                    icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        </svg>
                    }
                />
                <StatCard
                    title="Total Revenue"
                    value={kpis?.total_revenue}
                    subtitle="Credit transactions"
                    color="#10B981"
                    format="currency"
                    icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33" />
                        </svg>
                    }
                />
                <StatCard
                    title="Transactions"
                    value={kpis?.total_transactions}
                    subtitle="All time"
                    color="#8B5CF6"
                    icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                        </svg>
                    }
                />
                <StatCard
                    title="Active Loans"
                    value={kpis?.active_loans}
                    subtitle="Currently active"
                    color="#F97316"
                    icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" />
                        </svg>
                    }
                />
                <StatCard
                    title="Active Subscriptions"
                    value={kpis?.active_subscriptions}
                    subtitle="Telecom plans"
                    color="#8B5CF6"
                    icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
                        </svg>
                    }
                />
                <StatCard
                    title="Pending Shipments"
                    value={kpis?.pending_shipments}
                    subtitle="In transit + pending"
                    color="#F97316"
                    icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                        </svg>
                    }
                />
                <StatCard
                    title="Unpaid Energy Bills"
                    value={kpis?.unpaid_bills}
                    subtitle="Unpaid + overdue"
                    color="#EAB308"
                    icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                        </svg>
                    }
                />
                <StatCard
                    title="Vehicles Sold"
                    value={kpis?.vehicles_sold}
                    subtitle="Confirmed + delivered"
                    color="#EF4444"
                    icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h7.5M3 13.5V9.75A2.25 2.25 0 015.25 7.5h13.5A2.25 2.25 0 0121 9.75v3.75m-18 0h18m-18 0l1.5 3.75h15L21 13.5" />
                        </svg>
                    }
                />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Domain Revenue Bar Chart */}
                <div className="lg:col-span-2">
                    <ChartWrapper
                        title="Revenue by Domain"
                        subtitle="Total value generated per business vertical"
                    >
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={domainRev} barSize={28}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                                <XAxis dataKey="vertical" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false}
                                    tickFormatter={v => '₹' + (v >= 1000000 ? (v/1000000).toFixed(1)+'M' : v >= 1000 ? (v/1000).toFixed(0)+'K' : v)} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="value" name="Revenue" radius={[4, 4, 0, 0]}>
                                    {domainRev.map((entry, i) => (
                                        <Cell key={i} fill={COLORS[entry.vertical] || '#3B82F6'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartWrapper>
                </div>

                {/* Users per Vertical */}
                <ChartWrapper
                    title="Users per Vertical"
                    subtitle="Distribution across domains"
                >
                    <ResponsiveContainer width="100%" height={240}>
                        <PieChart>
                            <Pie
                                data={verticals}
                                dataKey="user_count"
                                nameKey="vertical_name"
                                cx="50%" cy="50%"
                                innerRadius={55}
                                outerRadius={85}
                                paddingAngle={3}
                            >
                                {verticals.map((entry, i) => (
                                    <Cell key={i} fill={COLORS[entry.vertical_name] || PIE_COLORS[i]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(v, n) => [v, n]} />
                            <Legend
                                iconType="circle"
                                iconSize={8}
                                formatter={(v) => <span style={{ fontSize: 11, color: '#64748B' }}>{v}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartWrapper>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Transaction Trend */}
                <div className="lg:col-span-2">
                    <ChartWrapper
                        title="Transaction Trend"
                        subtitle="Daily transaction volume — last 30 days"
                    >
                        {txnTrend.length === 0 ? (
                            <div className="h-48 flex items-center justify-center text-sm text-gray-400">
                                No transaction data in last 30 days
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={220}>
                                <LineChart data={txnTrend}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line type="monotone" dataKey="total" name="Amount" stroke="#3B82F6" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="count" name="Count" stroke="#10B981" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </ChartWrapper>
                </div>

                {/* Shipment + Bill Status */}
                <div className="flex flex-col gap-4">
                    <ChartWrapper title="Shipment Status" subtitle="By current status">
                        <ResponsiveContainer width="100%" height={100}>
                            <PieChart>
                                <Pie data={shipStatus} dataKey="count" nameKey="status"
                                    cx="50%" cy="50%" outerRadius={40} paddingAngle={3}>
                                    {shipStatus.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                                </Pie>
                                <Tooltip formatter={(v, n) => [v, n]} />
                                <Legend iconType="circle" iconSize={7}
                                    formatter={(v) => <span style={{ fontSize: 10, color: '#64748B' }}>{v}</span>} />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartWrapper>

                    <ChartWrapper title="Energy Bills" subtitle="Payment status">
                        <ResponsiveContainer width="100%" height={100}>
                            <PieChart>
                                <Pie data={billStatus} dataKey="count" nameKey="status"
                                    cx="50%" cy="50%" outerRadius={40} paddingAngle={3}>
                                    {billStatus.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                                </Pie>
                                <Tooltip formatter={(v, n) => [v, n]} />
                                <Legend iconType="circle" iconSize={7}
                                    formatter={(v) => <span style={{ fontSize: 10, color: '#64748B' }}>{v}</span>} />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartWrapper>
                </div>
            </div>

            {/* Recent Activity Table */}
            <ChartWrapper
                title="Recent Activity"
                subtitle="Latest system-wide audit log entries"
            >
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Vertical</th>
                                <th>Action</th>
                                <th>Table</th>
                                <th>Description</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activity.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center text-gray-400 py-8">
                                        No activity recorded yet
                                    </td>
                                </tr>
                            ) : activity.map((row) => (
                                <tr key={row.log_id}>
                                    <td>
                                        <span
                                            className="badge"
                                            style={{
                                                backgroundColor: (COLORS[row.vertical_name] || '#3B82F6') + '18',
                                                color: COLORS[row.vertical_name] || '#3B82F6'
                                            }}
                                        >
                                            {row.vertical_name}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${row.action === 'INSERT' ? 'badge-green' : 'badge-blue'}`}>
                                            {row.action}
                                        </span>
                                    </td>
                                    <td className="font-500 text-gray-600">{row.table_name}</td>
                                    <td className="max-w-xs truncate text-gray-500">{row.description}</td>
                                    <td className="text-gray-400">
                                        {new Date(row.changed_at).toLocaleString('en-IN', {
                                            day: '2-digit', month: 'short',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ChartWrapper>

        </div>
    )
}

export default Dashboard