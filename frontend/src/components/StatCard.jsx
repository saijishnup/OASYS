const StatCard = ({
    title,
    value,
    subtitle,
    icon,
    color = '#3B82F6',
    format = 'number'
}) => {

    const formatValue = (val) => {
        if (val === undefined || val === null) return '—'
        if (format === 'currency') {
            return '₹' + Number(val).toLocaleString('en-IN', {
                maximumFractionDigits: 0
            })
        }
        if (format === 'number') {
            return Number(val).toLocaleString('en-IN')
        }
        return val
    }

    return (
        <div className="card p-5 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
                <p className="text-xs font-600 text-gray-500 uppercase tracking-wider">{title}</p>
                <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: color + '18' }}
                >
                    <span style={{ color }}>{icon}</span>
                </div>
            </div>
            <div>
                <p className="text-2xl font-700 text-gray-900 leading-none">
                    {formatValue(value)}
                </p>
                {subtitle && (
                    <p className="text-xs text-gray-400 mt-1.5">{subtitle}</p>
                )}
            </div>
            {/* Bottom accent */}
            <div className="h-0.5 w-8 rounded-full" style={{ backgroundColor: color }} />
        </div>
    )
}

export default StatCard