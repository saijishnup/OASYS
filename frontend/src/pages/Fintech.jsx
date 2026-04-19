import { useEffect, useState } from 'react'
import { ArrowRightLeft, Landmark, Wallet, CreditCard, PiggyBank } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import StatCard from '../components/StatCard'
import ChartWrapper from '../components/ChartWrapper'

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

export default function Fintech() {
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loans, setLoans] = useState([])
  const [summary, setSummary] = useState({})
  const [txnByType, setTxnByType] = useState([])
  const [form, setForm] = useState({ from_account: '', to_account: '', amount: '' })
  const [submitting, setSubmitting] = useState(false)

  const loadFintechData = async () => {
    const [accountsRes, txnsRes, loansRes, summaryRes, txnTypeRes] = await Promise.all([
      api.get('/fintech/accounts'),
      api.get('/fintech/transactions'),
      api.get('/fintech/loans'),
      api.get('/fintech/summary'),
      api.get('/fintech/txn-by-type'),
    ])

    setAccounts(accountsRes.data || [])
    setTransactions(txnsRes.data || [])
    setLoans(loansRes.data || [])
    setSummary(summaryRes.data || {})
    setTxnByType((txnTypeRes.data || []).map((row) => ({ name: row.txn_type, count: row.count })))
  }

  useEffect(() => {
    loadFintechData().catch(() => {})
  }, [])

  const totalTxnCount = txnByType.reduce((sum, row) => sum + Number(row.count || 0), 0)

  const handleTransfer = async (event) => {
    event.preventDefault()
    if (!form.from_account || !form.to_account || !form.amount) {
      toast.error('Fill all transfer fields')
      return
    }

    setSubmitting(true)
    try {
      await api.post('/fintech/transfer', form)
      toast.success('Transfer completed')
      await loadFintechData()
      setForm({ from_account: '', to_account: '', amount: '' })
    } catch (error) {
      toast.error(error.message || 'Transfer failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-3 font-display text-2xl font-bold tracking-tight text-white">
            <Landmark size={22} className="text-orange-400" /> Fintech
          </h1>
          <p className="mt-1 text-sm text-gray-500">Accounts, transactions, loans, and fund movement.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard title="Total Balance" value={summary.total_balance ? `Rs ${Number(summary.total_balance).toLocaleString('en-IN')}` : '-'} icon={Wallet} color="emerald" />
        <StatCard title="Credits" value={summary.total_credit ? `Rs ${Number(summary.total_credit).toLocaleString('en-IN')}` : '-'} icon={CreditCard} color="blue" delay={40} />
        <StatCard title="Debits" value={summary.total_debit ? `Rs ${Number(summary.total_debit).toLocaleString('en-IN')}` : '-'} icon={ArrowRightLeft} color="amber" delay={80} />
        <StatCard title="Active Loans" value={summary.active_loans ?? '-'} icon={PiggyBank} color="brand" delay={120} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.7fr_1fr]">
        <ChartWrapper
          type="pie"
          data={txnByType}
          dataKey="count"
          xKey="name"
          title="Transactions by Type"
          metaText={`${totalTxnCount} transactions`}
        />

        <div className="glass rounded-2xl p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-display font-semibold text-gray-200">
            <ArrowRightLeft size={14} className="text-orange-400" /> Transfer Funds
          </h3>
          <form onSubmit={handleTransfer} className="space-y-3">
            <div>
              <label className="mb-1 block font-mono text-[11px] text-gray-600">FROM ACCOUNT</label>
              <input className="input-field" value={form.from_account} onChange={(event) => setForm((prev) => ({ ...prev, from_account: event.target.value }))} />
            </div>
            <div>
              <label className="mb-1 block font-mono text-[11px] text-gray-600">TO ACCOUNT</label>
              <input className="input-field" value={form.to_account} onChange={(event) => setForm((prev) => ({ ...prev, to_account: event.target.value }))} />
            </div>
            <div>
              <label className="mb-1 block font-mono text-[11px] text-gray-600">AMOUNT</label>
              <input type="number" className="input-field" value={form.amount} onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))} />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
              {submitting ? 'Processing...' : 'Submit Transfer'}
            </button>
          </form>
        </div>
      </div>

      <TableShell
        title="Bank Accounts"
        columns={['Account', 'Customer', 'Email', 'Type', 'Balance', 'Created']}
        rows={accounts}
        renderRow={(row) => (
          <tr key={row.account_id} className="table-row-hover border-b border-white/[0.03]">
            <td className="px-5 py-3.5 font-mono text-xs text-gray-500">#{row.account_id}</td>
            <td className="px-5 py-3.5 text-sm text-gray-200">{row.name}</td>
            <td className="px-5 py-3.5 text-xs text-gray-400">{row.email}</td>
            <td className="px-5 py-3.5"><span className="badge badge-blue">{row.account_type}</span></td>
            <td className="px-5 py-3.5 font-mono text-xs text-emerald-400">Rs {Number(row.balance).toLocaleString('en-IN')}</td>
            <td className="px-5 py-3.5 font-mono text-xs text-gray-600">{row.created_at?.slice(0, 10)}</td>
          </tr>
        )}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <TableShell
          title="Transactions"
          columns={['Txn', 'Customer', 'Type', 'Amount', 'Status', 'Date']}
          rows={transactions.slice(0, 12)}
          renderRow={(row) => (
            <tr key={row.txn_id} className="table-row-hover border-b border-white/[0.03]">
              <td className="px-5 py-3.5 font-mono text-xs text-gray-500">#{row.txn_id}</td>
              <td className="px-5 py-3.5 text-sm text-gray-200">{row.name}</td>
              <td className="px-5 py-3.5"><span className="badge badge-orange">{row.txn_type}</span></td>
              <td className="px-5 py-3.5 font-mono text-xs text-blue-300">Rs {Number(row.amount).toLocaleString('en-IN')}</td>
              <td className="px-5 py-3.5"><span className="badge badge-gray">{row.status}</span></td>
              <td className="px-5 py-3.5 font-mono text-xs text-gray-600">{row.txn_date?.slice(0, 19)}</td>
            </tr>
          )}
        />

        <TableShell
          title="Loans"
          columns={['Loan', 'Customer', 'Principal', 'Interest', 'Status', 'Disbursed']}
          rows={loans}
          renderRow={(row) => (
            <tr key={row.loan_id} className="table-row-hover border-b border-white/[0.03]">
              <td className="px-5 py-3.5 font-mono text-xs text-gray-500">#{row.loan_id}</td>
              <td className="px-5 py-3.5 text-sm text-gray-200">{row.name}</td>
              <td className="px-5 py-3.5 font-mono text-xs text-emerald-400">Rs {Number(row.principal).toLocaleString('en-IN')}</td>
              <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{row.interest_rate}%</td>
              <td className="px-5 py-3.5"><span className="badge badge-blue">{row.status}</span></td>
              <td className="px-5 py-3.5 font-mono text-xs text-gray-600">{row.disbursed_at?.slice(0, 10)}</td>
            </tr>
          )}
        />
      </div>
    </div>
  )
}
