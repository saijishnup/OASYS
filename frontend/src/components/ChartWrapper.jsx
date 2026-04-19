// ── helpers ───────────────────────────────────────────────────────────────────

function formatLabel(value) {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'number') return value.toLocaleString('en-IN')
  return String(value)
}

function formatCompact(value) {
  const num = Number(value || 0)
  if (!Number.isFinite(num)) return '—'
  if (Math.abs(num) >= 10_000_000) return `${(num / 10_000_000).toFixed(1)}Cr`
  if (Math.abs(num) >= 100_000)    return `${(num / 100_000).toFixed(1)}L`
  if (Math.abs(num) >= 1_000)      return `${(num / 1_000).toFixed(1)}K`
  return num.toLocaleString('en-IN')
}


function normalizeData(data, key) {
  return (data || []).map((item) => Number(item?.[key] || 0))
}

// ── shared empty state ────────────────────────────────────────────────────────

function EmptyChart() {
  return (
    <div className="flex h-full min-h-[160px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02]">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-gray-700">
        <rect x="3"  y="12" width="4" height="9" rx="1" fill="currentColor" opacity="0.4" />
        <rect x="10" y="7"  width="4" height="14" rx="1" fill="currentColor" opacity="0.6" />
        <rect x="17" y="3"  width="4" height="18" rx="1" fill="currentColor" />
      </svg>
      <p className="text-sm text-gray-400">No data yet</p>
      <p className="font-mono text-[10px] text-gray-600">Waiting for backend records</p>
    </div>
  )
}

// ── bar / area chart ──────────────────────────────────────────────────────────

function BarLikeChart({ data = [], dataKey, xKey, color = '#3b82f6', fill = false }) {
  const values = normalizeData(data, dataKey)
  const max    = Math.max(...values, 1)
  const hasData = values.some((v) => v > 0)

  if (!data.length || !hasData) return <EmptyChart />

  return (
    <div className="h-full min-w-0 overflow-hidden pb-2">
      <div
        className="grid h-full items-end gap-2"
        style={{ gridTemplateColumns: `repeat(${Math.max(data.length, 1)}, minmax(0, 1fr))` }}
      >
        {data.map((item, index) => {
          const value     = Number(item?.[dataKey] || 0)
          const heightPct = `${Math.max((value / max) * 100, 4)}%`
          const label     = formatLabel(item?.[xKey])

          return (
            <div
              key={item?.[xKey] ?? index}
              className="group relative flex h-full min-w-0 flex-col justify-end gap-1.5"
            >
              {/* Hover tooltip */}
              <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/[0.08] bg-surface-900 px-2.5 py-1.5 text-center opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100">
                <p className="font-mono text-[10px] text-gray-300">{label}</p>
                <p className="font-mono text-xs font-semibold text-white">{formatLabel(value)}</p>
              </div>

              {/* Bar */}
              <div className="flex h-full items-end justify-center">
                <div
                  className="w-full max-w-[44px] rounded-t-xl transition-all duration-300"
                  style={{
                    height: heightPct,
                    background: fill
                      ? `linear-gradient(180deg, ${color} 0%, ${color}22 100%)`
                      : color,
                    opacity: fill ? 0.85 : 1,
                  }}
                />
              </div>

              {/* X-axis label */}
              <div className="space-y-0.5 text-center">
                <p
                  className="truncate px-0.5 font-body text-[10px] leading-tight text-gray-500"
                  title={label}
                >
                  {label}
                </p>
                <p className="font-mono text-[10px] font-medium text-gray-400">
                  {formatCompact(value)}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  ) 
}

// ── pie / donut chart ─────────────────────────────────────────────────────────

const PIE_COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#f43f5e', '#f59e0b']

function PieLikeChart({ data = [], dataKey, xKey }) {
  const values  = normalizeData(data, dataKey)
  const total   = values.reduce((sum, v) => sum + v, 0) || 1
  const hasData = values.some((v) => v > 0)

  if (!data.length || !hasData) return <EmptyChart />

  // Pre-compute conic-gradient stops
  let accumulated = 0
  const stops = data.map((item, i) => {
    const value = Number(item?.[dataKey] || 0)
    const start = (accumulated / total) * 360
    accumulated += value
    const end   = (accumulated / total) * 360
    return `${PIE_COLORS[i % PIE_COLORS.length]} ${start.toFixed(1)}deg ${end.toFixed(1)}deg`
  })

  return (
    <div className="flex w-full flex-col gap-4">

      {/* Donut — centered */}
      <div className="flex justify-center">
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full">
          <div
            className="h-28 w-28 rounded-full"
            style={{ background: `conic-gradient(${stops.join(', ')})` }}
          />
          {/* Center hole */}
          <div className="absolute flex h-16 w-16 flex-col items-center justify-center rounded-full bg-surface-900">
            <span className="font-mono text-sm font-bold leading-tight text-white">
              {formatCompact(total)}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-gray-600">
              total
            </span>
          </div>
        </div>
      </div>

      {/* Legend — full width */}
      <div className="w-full space-y-2">
        {data.map((item, i) => {
          const value = Number(item?.[dataKey] || 0)
          const pct   = total > 0 ? Math.round((value / total) * 100) : 0
          const label = formatLabel(item?.[xKey])

          return (
            <div
              key={item?.[xKey] ?? i}
              className="flex w-full items-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2 transition-colors hover:bg-white/[0.04]"
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
              />
              <span
                className="min-w-0 flex-1 truncate text-xs font-medium text-gray-300"
                title={label}
              >
                {label}
              </span>
              <span className="shrink-0 font-mono text-xs text-gray-400">
                {formatCompact(value)}
              </span>
              <span className="shrink-0 rounded-md bg-white/[0.06] px-2 py-0.5 font-mono text-[10px] text-gray-500">
                {pct}%
              </span>
            </div>
          )
        })}
      </div>

    </div>
  )
}

// ── ChartWrapper (default export) ─────────────────────────────────────────────

export default function ChartWrapper({
  type = 'bar',
  data = [],
  dataKey,
  xKey,
  title,
  height = 220,
  color,
  metaText,
}) {
  const isPie       = type === 'pie'
  const pointLabel  = data.length === 1 ? 'point' : 'points'

  return (
    <div className="glass rounded-2xl p-5">

      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-display text-sm font-semibold leading-snug text-gray-200">{title}</h3>
        <span className="shrink-0 rounded-md bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-gray-600">
          {metaText || `${data.length} ${pointLabel}`}
        </span>
      </div>

      {/* Chart body — pie is auto height, bar/area uses fixed height */}
      {isPie ? (
        <PieLikeChart data={data} dataKey={dataKey} xKey={xKey} />
      ) : (
        <div style={{ height }} className="min-h-[160px]">
          <BarLikeChart
            data={data}
            dataKey={dataKey}
            xKey={xKey}
            color={color}
            fill={type === 'area'}
          />
        </div>
      )}

    </div>
  )
}
