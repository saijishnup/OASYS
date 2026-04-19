import { useEffect, useState } from 'react'
import { PieChart as PieIcon, Users, TrendingUp, Radio } from 'lucide-react'
import api from '../api/axios'
import StatCard from '../components/StatCard'
import ChartWrapper from '../components/ChartWrapper'

export default function Segments() {
  const [verticals, setVerticals] = useState([])
  const [telecomSummary, setTelecomSummary] = useState({})
  const [fintechSummary, setFintechSummary] = useState({})

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/vertical-summary'),
      api.get('/telecom/summary'),
      api.get('/fintech/summary'),
    ])
      .then(([verticalRes, telecomRes, fintechRes]) => {
        setVerticals((verticalRes.data || []).map((row) => ({ name: row.vertical_name, value: row.user_count })))
        setTelecomSummary(telecomRes.data || {})
        setFintechSummary(fintechRes.data || {})
      })
      .catch(() => {})
  }, [])

  const totalUsers = verticals.reduce((sum, row) => sum + Number(row.value || 0), 0)

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="flex items-center gap-3 font-display text-2xl font-bold tracking-tight text-white">
          <PieIcon size={22} className="text-pink-400" /> Segments
        </h1>
        <p className="mt-1 text-sm text-gray-400">Segment overview derived from backend user distribution and product activity.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard title="Total Users" value={totalUsers || '-'} icon={Users} color="brand" />
        <StatCard title="Verticals" value={verticals.length || '-'} icon={PieIcon} color="violet" delay={40} />
        <StatCard title="Active Subs" value={telecomSummary.active_subs ?? '-'} icon={Radio} color="blue" delay={80} />
        <StatCard title="Active Loans" value={fintechSummary.active_loans ?? '-'} icon={TrendingUp} color="emerald" delay={120} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartWrapper type="pie" data={verticals} dataKey="value" xKey="name" title="Users by Vertical" />
        <ChartWrapper
          type="bar"
          data={[
            { name: 'Telecom Active', value: telecomSummary.active_subs || 0 },
            { name: 'Telecom Expired', value: telecomSummary.expired_subs || 0 },
            { name: 'Active Loans', value: fintechSummary.active_loans || 0 },
          ]}
          dataKey="value"
          xKey="name"
          title="Activity Segments"
          color="#ec4899"
        />
      </div>
    </div>
  )
}
