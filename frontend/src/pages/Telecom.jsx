import { useEffect, useState } from 'react'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, CartesianGrid,
    PieChart, Pie, Cell, Legend
} from 'recharts'
import StatCard     from '../components/StatCard'
import ChartWrapper from '../components/ChartWrapper'
import api          from '../api/axios'

const COLOR      = '#8B5CF6'
const PIE_COLORS = ['#10B981', '#EF4444', '#EAB308', '#3B82F6']

const statusBadge = (status) => {
    const map = {
        active:    'badge-green',
        expired:   'badge-red',
        cancelled: 'badge-gray',
        prepaid:   'badge-blue',
        postpaid:  'badge-purple',
    }
    return <span className={`badge ${map[status] || 'badge-gray'}`}>{status}</span>
}

const Telecom = () => {
    const [summary,   setSummary]   = useState(null)
    const [plans,     setPlans]     = useState([])
    const [subs,      setSubs]      = useState([])
    const [usage,     setUsage]     = useState([])
    const [subStatus, setSubStatus] = useState([])
    const [planType,  setPlanType]  = useState([])
    const [loading,   setLoading]   = useState(true)

    // Renew form
    const [subId,     setSubId]     = useState('')
    const [renewMsg,  setRenewMsg]  = useState(null)
    const [renewErr,  setRenewErr]  = useState(null)
    const [renewLoad, setRenewLoad] = useState(false)

    const fetchAll = async () => {
        try {
            const [s, p, su, u, ss, pt] = await Promise.all([
                api.get('/telecom/summary'),
                api.get('/telecom/plans'),
                api.get('/telecom/subscriptions'),
                api.get('/telecom/usage'),
                api.get('/telecom/sub-by-status'),
                api.get('/telecom/plan-by-type'),
            ])
            setSummary(s.data)
            setPlans(p.data)
            setSubs(su.data)
            setUsage(u.data)
            setSubStatus(ss.data)
            setPlanType(pt.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchAll() }, [])

    const handleRenew = async (e) => {
        e.preventDefault()
        setRenewMsg(null); setRenewErr(null); setRenewLoad(true)
        try {
            await api.post('/telecom/renew', { sub_id: Number(subId) })
            setRenewMsg('Subscription renewed successfully')
            setSubId('')
            fetchAll()
        } catch (err) {
            setRenewErr(err.response?.data?.error || 'Renewal failed')
        } finally {
            setRenewLoad(false)
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
                <StatCard title="Total Plans" value={summary?.total_plans} color={COLOR}
                    subtitle="Available plans"
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" /></svg>}
                />
                <StatCard title="Active Subscriptions" value={summary?.active_subs} color={COLOR}
                    subtitle="Currently active"
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <StatCard title="Data Used" value={summary?.total_data_used?.toFixed(2) + ' GB'} color="#3B82F6"
                    subtitle="Total network usage" format="number"
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>}
                />
                <StatCard title="Revenue" value={summary?.revenue} format="currency" color={COLOR}
                    subtitle="All subscription plans"
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33" /></svg>}
                />
            </div>

            {/* Charts + Renew */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Sub status + Plan type donuts */}
                <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                    <ChartWrapper title="Subscription Status" subtitle="Active vs expired">
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie data={subStatus} dataKey="count" nameKey="status"
                                    cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3}>
                                    {subStatus.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                                </Pie>
                                <Tooltip formatter={(v, n) => [v, n]} />
                                <Legend iconType="circle" iconSize={8}
                                    formatter={v => <span style={{ fontSize: 11, color: '#64748B' }}>{v}</span>} />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartWrapper>

                    <ChartWrapper title="Plan Type" subtitle="Prepaid vs postpaid">
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie data={planType} dataKey="count" nameKey="plan_type"
                                    cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3}>
                                    {planType.map((_, i) => <Cell key={i} fill={[COLOR, '#3B82F6'][i]} />)}
                                </Pie>
                                <Tooltip formatter={(v, n) => [v, n]} />
                                <Legend iconType="circle" iconSize={8}
                                    formatter={v => <span style={{ fontSize: 11, color: '#64748B' }}>{v}</span>} />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartWrapper>
                </div>

                {/* Renew Form */}
                <ChartWrapper title="Renew Subscription" subtitle="Extend an existing subscription">
                    <form onSubmit={handleRenew} className="space-y-3 mt-1">
                        <div>
                            <label className="block text-xs font-600 text-gray-600 mb-1">Subscription ID</label>
                            <input className="input" type="number" placeholder="e.g. 1"
                                value={subId} onChange={e => setSubId(e.target.value)} required />
                        </div>
                        {renewMsg && <p className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">{renewMsg}</p>}
                        {renewErr && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{renewErr}</p>}
                        <button type="submit" disabled={renewLoad}
                            className="btn w-full justify-center text-white"
                            style={{ backgroundColor: COLOR }}>
                            {renewLoad
                                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                : 'Renew Subscription'
                            }
                        </button>
                    </form>
                </ChartWrapper>
            </div>

            {/* Plans Table */}
            <ChartWrapper title="Telecom Plans" subtitle={`${plans.length} plans available`}>
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th><th>Plan Name</th><th>Type</th>
                                <th>Data (GB)</th><th>Price</th><th>Validity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {plans.map(p => (
                                <tr key={p.plan_id}>
                                    <td className="text-gray-400">#{p.plan_id}</td>
                                    <td className="font-500">{p.plan_name}</td>
                                    <td>{statusBadge(p.plan_type)}</td>
                                    <td>{p.data_gb} GB</td>
                                    <td className="font-600">₹{Number(p.price).toLocaleString('en-IN')}</td>
                                    <td className="text-gray-500">{p.validity_days} days</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ChartWrapper>

            {/* Subscriptions Table */}
            <ChartWrapper title="Subscriptions" subtitle={`${subs.length} records`}>
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th><th>User</th><th>Plan</th>
                                <th>Type</th><th>Price</th><th>Start</th>
                                <th>End</th><th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subs.map(s => (
                                <tr key={s.sub_id}>
                                    <td className="text-gray-400">#{s.sub_id}</td>
                                    <td className="font-500">{s.name}</td>
                                    <td>{s.plan_name}</td>
                                    <td>{statusBadge(s.plan_type)}</td>
                                    <td className="font-600">₹{Number(s.price).toLocaleString('en-IN')}</td>
                                    <td className="text-gray-400">{new Date(s.start_date).toLocaleDateString('en-IN')}</td>
                                    <td className="text-gray-400">{new Date(s.end_date).toLocaleDateString('en-IN')}</td>
                                    <td>{statusBadge(s.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ChartWrapper>

            {/* Network Usage Table */}
            <ChartWrapper title="Network Usage" subtitle={`${usage.length} records`}>
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th><th>User</th><th>Plan</th>
                                <th>Date</th><th>Data Used</th><th>Call Minutes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usage.map(u => (
                                <tr key={u.usage_id}>
                                    <td className="text-gray-400">#{u.usage_id}</td>
                                    <td className="font-500">{u.name}</td>
                                    <td className="text-gray-500">{u.plan_name}</td>
                                    <td className="text-gray-400">{new Date(u.usage_date).toLocaleDateString('en-IN')}</td>
                                    <td><span className="badge badge-blue">{u.data_used_gb} GB</span></td>
                                    <td><span className="badge badge-purple">{u.call_minutes} min</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ChartWrapper>

        </div>
    )
}

export default Telecom