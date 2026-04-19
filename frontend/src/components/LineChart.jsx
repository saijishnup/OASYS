import ChartWrapper from './ChartWrapper'

export default function LineChart({ data, title, dataKey = 'value', xKey = 'name', color = '#10b981' }) {
  return <ChartWrapper type="area" data={data} title={title} dataKey={dataKey} xKey={xKey} color={color} />
}
