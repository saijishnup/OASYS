import { useEffect, useState } from 'react'
import { BarChart2, Calendar } from 'lucide-react'
import api from '../api/axios'
import ChartWrapper from '../components/ChartWrapper'

export default function MonthlyReport() {
  const [domainRevenue, setDomainRevenue] = useState([])
  const [verticalSummary, setVerticalSummary] = useState([])
  const [month] = useState(new Date().toLocaleString('en-US', { month: 'long' }))
  const [year] = useState(new Date().getFullYear())

  useEffect(() => {
    Promise.all([api.get('/dashboard/domain-revenue'), api.get('/dashboard/vertical-summary')])
      .then(([revenueRes, verticalRes]) => {
        setDomainRevenue((revenueRes.data || []).map((row) => ({ name: row.vertical, value: row.value })))
        setVerticalSummary((verticalRes.data || []).map((row) => ({ name: row.vertical_name, value: row.user_count })))
      })
      .catch(() => {})
  }, [])

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-3 font-display text-2xl font-bold tracking-tight text-white">
            <BarChart2 size={22} className="text-teal-400" /> Monthly Report
          </h1>
          <p className="mt-1 text-sm text-gray-500">Generated from the currently available backend dashboard aggregates.</p>
        </div>
        <div className="glass flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-gray-300">
          <Calendar size={14} />
          {month} {year}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartWrapper type="bar" data={domainRevenue} dataKey="value" xKey="name" title="Revenue by Vertical" color="#14b8a6" />
        <ChartWrapper type="pie" data={verticalSummary} dataKey="value" xKey="name" title="User Mix by Vertical" />
      </div>

      <div className="glass overflow-hidden rounded-2xl">
        <div className="border-b border-white/[0.05] px-5 py-4">
          <h3 className="text-sm font-display font-semibold text-gray-200">Performance Snapshot</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.05]">
              {['Vertical', 'Revenue', 'Users'].map((column) => (
                <th key={column} className="px-5 py-4 text-left font-mono text-[11px] tracking-wide text-gray-600">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {domainRevenue.map((row) => {
              const matching = verticalSummary.find((item) => item.name === row.name)
              return (
                <tr key={row.name} className="table-row-hover border-b border-white/[0.03]">
                  <td className="px-5 py-3.5 text-sm text-gray-200">{row.name}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-emerald-400">Rs {Number(row.value || 0).toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{matching?.value ?? '-'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
