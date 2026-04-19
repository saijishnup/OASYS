import ChartWrapper from './ChartWrapper'

export default function BarChart({ data, title, dataKey = 'value', xKey = 'name', color = '#3b82f6' }) {
  return <ChartWrapper type="bar" data={data} title={title} dataKey={dataKey} xKey={xKey} color={color} />
}
