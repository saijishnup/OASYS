const COLOR_MAP = {
  brand: 'from-brand-500/20 to-brand-700/10 text-brand-300 border-brand-500/20',
  blue: 'from-blue-500/20 to-blue-700/10 text-blue-300 border-blue-500/20',
  emerald: 'from-emerald-500/20 to-emerald-700/10 text-emerald-300 border-emerald-500/20',
  violet: 'from-violet-500/20 to-violet-700/10 text-violet-300 border-violet-500/20',
  amber: 'from-amber-500/20 to-amber-700/10 text-amber-300 border-amber-500/20',
  rose: 'from-rose-500/20 to-rose-700/10 text-rose-300 border-rose-500/20',
}

export default function StatCard({ title, value, icon: Icon, color = 'brand', delay = 0 }) {
  const colorClass = COLOR_MAP[color] || COLOR_MAP.brand

  return (
    <div
      className={`animate-fade-up rounded-2xl border bg-gradient-to-br p-4 ${colorClass}`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-mono uppercase tracking-wide text-gray-500">{title}</p>
        {Icon ? (
          <div className="rounded-xl bg-white/[0.06] p-2">
            <Icon size={16} />
          </div>
        ) : null}
      </div>
      <p className="font-display text-2xl font-bold text-white">{value}</p>
    </div>
  )
}
