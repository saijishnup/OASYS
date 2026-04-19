import { useEffect, useMemo, useState } from 'react'
import { ScrollText, Search } from 'lucide-react'
import ChartWrapper from '../components/ChartWrapper'
import api from '../api/axios'

const actionMap = {}

export default function Logs() {
  const [logs, setLogs] = useState([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    api.get('/dashboard/recent-activity')
      .then((response) => setLogs(response.data || []))
      .catch(() => {})
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return logs.filter((row) => !q || row.description?.toLowerCase().includes(q) || row.table_name?.toLowerCase().includes(q))
  }, [logs, query])

  const chartData = useMemo(() => {
    const counts = filtered.reduce((acc, row) => {
      acc[row.action] = (acc[row.action] || 0) + 1
      return acc
    }, actionMap)
    return Object.entries(counts).map(([name, count]) => ({ name, count }))
  }, [filtered])

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="flex items-center gap-3 font-display text-2xl font-bold tracking-tight text-white">
          <ScrollText size={22} className="text-indigo-400" /> Audit Logs
        </h1>
        <p className="mt-1 text-sm text-gray-400">Recent backend activity stream derived from the dashboard feed.</p>
      </div>

      <ChartWrapper type="bar" data={chartData} dataKey="count" xKey="name" title="Activity by Action" color="#6366f1" />

      <div className="glass rounded-2xl p-4">
        <div className="relative max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input className="input-field pl-9" placeholder="Search logs..." value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
      </div>

      <div className="glass overflow-hidden rounded-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.05]">
              {['Vertical', 'Action', 'Table', 'Description', 'Timestamp'].map((column) => (
                <th key={column} className="px-5 py-4 text-left font-mono text-[11px] tracking-wide text-gray-600">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.log_id} className="table-row-hover border-b border-white/[0.03]">
                <td className="px-5 py-3.5 text-xs text-gray-300">{row.vertical_name}</td>
                <td className="px-5 py-3.5"><span className="badge badge-blue">{row.action}</span></td>
                <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{row.table_name}</td>
                <td className="px-5 py-3.5 text-xs text-gray-400">{row.description}</td>
                <td className="px-5 py-3.5 font-mono text-xs text-gray-600">{row.changed_at?.slice(0, 19)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
