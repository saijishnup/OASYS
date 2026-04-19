import { useEffect, useState } from 'react'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, CartesianGrid, Cell
} from 'recharts'
import StatCard     from '../components/StatCard'
import ChartWrapper from '../components/ChartWrapper'
import api          from '../api/axios'

const COLOR = '#3B82F6'

const statusBadge = (status) => {
    const map = {
        success:  'badge-green',
        failed:   'badge-red',
        pending:  'badge-yellow',
        active:   'badge-green',
        closed:   'badge-gray',
        defaulted:'badge-red',
    }
    return <span className={`badge ${map[status] || 'badge-gray'}`}>{status}</span>
}

const txnBadge = (type) => {
    const map = {
        credit:   'badge-green',
        debit:    'badge-red',
        transfer: 'badge-blue',
    }
    return <span className={`badge ${map[type] || 'badge-gray'}`}>{type}</span>
}

const Fintech = () => {
    const [summary,  setSummary]  = useState(null)
    const [accounts, setAccounts] = useState([])
    const [txns,     setTxns]     = useState([])
    const [loans,    setLoans]    = useState([])
    const [txnTypes, setTxnTypes] = useState([])
    const [loading,  setLoading]  = useState(true)

    // Transfer form
    const [from,     setFrom]     = useState('')
    const [to,       setTo]       = useState('')
    const [amount,   setAmount]   = useState('')
    const [txnMsg,   setTxnMsg]   = useState(null)
    const [txnErr,   setTxnErr]   = useState(null)
    const [txnLoad,  setTxnLoad]  = useState(false)

    const fetchAll = async () => {
        try {
            const [s, a, t, l, tt] = await Promise.all([
                api.get('/fintech/summary'),
                api.get('/fintech/accounts'),
                api.get('/fintech/transactions'),
                api.get('/fintech/loans'),
                api.get('/fintech/txn-by-type'),
            ])
            setSummary(s.data)
            setAccounts(a.data)
            setTxns(t.data)
            setLoans(l.data)
            setTxnTypes(tt.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchAll() }, [])

    const handleTransfer = async (e) => {
        e.preventDefault()
        setTxnMsg(null); setTxnErr(null); setTxnLoad(true)
        try {
            await api.post('/fintech/transfer', {
                from_account: Number(from),
                to_account:   Number(to),
                amount:       Number(amount)
            })
            setTxnMsg('Transfer successful')
            setFrom(''); setTo(''); setAmount('')
            fetchAll()
        } catch (err) {
            setTxnErr(err.response?.data?.error || 'Transfer failed')
        } finally {
            setTxnLoad(false)
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )

    return (
        <div className="page-container">

            {/* KPIs */}
            <div className="stat-grid">
                <StatCard title="Total Balance"      value={summary?.total_balance}   format="currency" color={COLOR}
                    subtitle="Across all accounts"
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" /></svg>}
                />
                <StatCard title="Total Credits"      value={summary?.total_credit}    format="currency" color="#10B981"
                    subtitle="All credit transactions"
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>}
                />
                <StatCard title="Total Debits"       value={summary?.total_debit}     format="currency" color="#EF4444"
                    subtitle="All debit + transfer"
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" /></svg>}
                />
                <StatCard title="Active Loans"       value={summary?.active_loans}    color="#F97316"
                    subtitle={`₹${Number(summary?.total_loan_amt || 0).toLocaleString('en-IN')} outstanding`}
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33" /></svg>}
                />
            </div>

            {/* Charts + Transfer */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Txn by type */}
                <div className="lg:col-span-2">
                    <ChartWrapper title="Transactions by Type" subtitle="Count and total amount per type">
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={txnTypes} barSize={40}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                                <XAxis dataKey="txn_type" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    formatter={(v, n) => [
                                        n === 'total' ? '₹' + Number(v).toLocaleString('en-IN') : v, n
                                    ]}
                                />
                                <Bar dataKey="count" name="count" radius={[4,4,0,0]} fill={COLOR} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartWrapper>
                </div>

                {/* Fund Transfer Form */}
                <ChartWrapper title="Fund Transfer" subtitle="Transfer between accounts">
                    <form onSubmit={handleTransfer} className="space-y-3 mt-1">
                        <div>
                            <label className="block text-xs font-600 text-gray-600 mb-1">From Account ID</label>
                            <input className="input" type="number" placeholder="e.g. 1"
                                value={from} onChange={e => setFrom(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-xs font-600 text-gray-600 mb-1">To Account ID</label>
                            <input className="input" type="number" placeholder="e.g. 3"
                                value={to} onChange={e => setTo(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-xs font-600 text-gray-600 mb-1">Amount (₹)</label>
                            <input className="input" type="number" placeholder="e.g. 5000"
                                value={amount} onChange={e => setAmount(e.target.value)} required min="1" />
                        </div>
                        {txnMsg && <p className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">{txnMsg}</p>}
                        {txnErr && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{txnErr}</p>}
                        <button type="submit" disabled={txnLoad} className="btn-primary w-full justify-center">
                            {txnLoad ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Transfer Funds'}
                        </button>
                    </form>
                </ChartWrapper>
            </div>

            {/* Accounts Table */}
            <ChartWrapper title="Bank Accounts" subtitle={`${accounts.length} accounts`}>
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th><th>Name</th><th>Email</th>
                                <th>Type</th><th>Balance</th><th>Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.map(a => (
                                <tr key={a.account_id}>
                                    <td className="text-gray-400">#{a.account_id}</td>
                                    <td className="font-500">{a.name}</td>
                                    <td className="text-gray-500">{a.email}</td>
                                    <td><span className="badge badge-blue">{a.account_type}</span></td>
                                    <td className="font-600 text-gray-900">₹{Number(a.balance).toLocaleString('en-IN')}</td>
                                    <td className="text-gray-400">{new Date(a.created_at).toLocaleDateString('en-IN')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ChartWrapper>

            {/* Transactions Table */}
            <ChartWrapper title="Transactions" subtitle={`${txns.length} records`}>
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th><th>Account</th><th>Name</th>
                                <th>Type</th><th>Amount</th><th>Status</th>
                                <th>Date</th><th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {txns.map(t => (
                                <tr key={t.txn_id}>
                                    <td className="text-gray-400">#{t.txn_id}</td>
                                    <td className="text-gray-500">#{t.account_id}</td>
                                    <td className="font-500">{t.name}</td>
                                    <td>{txnBadge(t.txn_type)}</td>
                                    <td className="font-600">₹{Number(t.amount).toLocaleString('en-IN')}</td>
                                    <td>{statusBadge(t.status)}</td>
                                    <td className="text-gray-400">{new Date(t.txn_date).toLocaleDateString('en-IN')}</td>
                                    <td className="text-gray-500 max-w-xs truncate">{t.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ChartWrapper>

            {/* Loans Table */}
            <ChartWrapper title="Loans" subtitle={`${loans.length} records`}>
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th><th>Name</th><th>Email</th>
                                <th>Principal</th><th>Interest Rate</th>
                                <th>Status</th><th>Disbursed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loans.map(l => (
                                <tr key={l.loan_id}>
                                    <td className="text-gray-400">#{l.loan_id}</td>
                                    <td className="font-500">{l.name}</td>
                                    <td className="text-gray-500">{l.email}</td>
                                    <td className="font-600">₹{Number(l.principal).toLocaleString('en-IN')}</td>
                                    <td className="text-gray-600">{l.interest_rate}%</td>
                                    <td>{statusBadge(l.status)}</td>
                                    <td className="text-gray-400">{new Date(l.disbursed_at).toLocaleDateString('en-IN')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ChartWrapper>

        </div>
    )
}

export default Fintech