const ChartWrapper = ({ title, subtitle, children, action }) => {
    return (
        <div className="card p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-600 text-gray-900">{title}</p>
                    {subtitle && (
                        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
                    )}
                </div>
                {action && (
                    <div className="flex-shrink-0">{action}</div>
                )}
            </div>
            <div className="w-full">
                {children}
            </div>
        </div>
    )
}

export default ChartWrapper