import { useEffect, useMemo, useState } from 'react'
import { Users as UsersIcon, Search, Landmark, Radio, Zap } from 'lucide-react'
import api from '../api/axios'
import StatCard from '../components/StatCard'

function uniqueByEmail(records) {
  const map = new Map()
  records.forEach((row) => {
    if (row?.email && !map.has(row.email)) {
      map.set(row.email, row)
    }
  })
  return [...map.values()]
}

export default function Users() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    Promise.all([
      api.get('/fintech/accounts'),
      api.get('/telecom/subscriptions'),
      api.get('/energy/connections'),
    ])
      .then(([accountsRes, telecomRes, energyRes]) => {
        const merged = [
          ...(accountsRes.data || []).map((row) => ({ name: row.name, email: row.email, source: 'Fintech', meta: row.account_type })),
          ...(telecomRes.data || []).map((row) => ({ name: row.name, email: row.email, source: 'Telecom', meta: row.plan_name })),
          ...(energyRes.data || []).map((row) => ({ name: row.name, email: row.email, source: 'Energy', meta: row.connection_type })),
        ]
        setUsers(uniqueByEmail(merged))
      })
      .catch(() => {})
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return users.filter((row) => !q || row.name?.toLowerCase().includes(q) || row.email?.toLowerCase().includes(q))
  }, [users, search])

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="flex items-center gap-3 font-display text-2xl font-bold tracking-tight text-white">
          <UsersIcon size={22} className="text-sky-400" /> Users
        </h1>
        <p className="mt-1 text-sm text-gray-400">Derived customer directory built from backend vertical records.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard title="Total Users" value={users.length} icon={UsersIcon} color="brand" />
        <StatCard title="Fintech" value={users.filter((row) => row.source === 'Fintech').length} icon={Landmark} color="emerald" delay={40} />
        <StatCard title="Telecom" value={users.filter((row) => row.source === 'Telecom').length} icon={Radio} color="violet" delay={80} />
        <StatCard title="Energy" value={users.filter((row) => row.source === 'Energy').length} icon={Zap} color="blue" delay={120} />
      </div>

      <div className="glass rounded-2xl p-4">
        <div className="relative max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input className="input-field pl-9" placeholder="Search users..." value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
      </div>

      <div className="glass overflow-hidden rounded-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.05]">
              {['Name', 'Email', 'Primary Source', 'Meta'].map((column) => (
                <th key={column} className="px-5 py-4 text-left font-mono text-[11px] tracking-wide text-gray-600">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.email} className="table-row-hover border-b border-white/[0.03]">
                <td className="px-5 py-3.5 text-sm text-gray-200">{row.name}</td>
                <td className="px-5 py-3.5 text-xs text-gray-400">{row.email}</td>
                <td className="px-5 py-3.5"><span className="badge badge-blue">{row.source}</span></td>
                <td className="px-5 py-3.5 text-xs text-gray-500">{row.meta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
