import { useLocation } from 'react-router-dom'

const routeMeta = {
    '/dashboard':   { label: 'Dashboard',   sub: 'Cross-domain analytics overview' },
    '/fintech':     { label: 'Fintech',      sub: 'Banking, transactions & loans' },
    '/realestate':  { label: 'Real Estate',  sub: 'Properties & deal management' },
    '/telecom':     { label: 'Telecom',      sub: 'Plans, subscriptions & usage' },
    '/logistics':   { label: 'Logistics',    sub: 'Shipments & route management' },
    '/energy':      { label: 'Energy',       sub: 'Connections & billing' },
    '/automobiles': { label: 'Automobiles',  sub: 'Vehicles, orders & service' },
}

const domainColors = {
    '/dashboard':   'bg-blue-500',
    '/fintech':     'bg-blue-500',
    '/realestate':  'bg-emerald-500',
    '/telecom':     'bg-violet-500',
    '/logistics':   'bg-orange-500',
    '/energy':      'bg-yellow-500',
    '/automobiles': 'bg-red-500',
}

const Navbar = () => {
    const location = useLocation()
    const meta  = routeMeta[location.pathname]  || { label: 'OASYS', sub: '' }
    const color = domainColors[location.pathname] || 'bg-blue-500'

    const now = new Date().toLocaleDateString('en-IN', {
        weekday: 'short',
        day:     '2-digit',
        month:   'short',
        year:    'numeric'
    })

    return (
        <header className="h-14 flex-shrink-0 flex items-center justify-between px-6 bg-white border-b border-gray-200">

            {/* Left — page title */}
            <div className="flex items-center gap-3">
                <div className={`w-2 h-6 rounded-full ${color}`} />
                <div>
                    <h1 className="text-sm font-700 text-gray-900 leading-none">{meta.label}</h1>
                    <p className="text-xs text-gray-400 mt-0.5 leading-none">{meta.sub}</p>
                </div>
            </div>

            {/* Right — date + status */}
            <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400 font-500">{now}</span>
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs text-gray-500 font-500">Live</span>
                </div>
            </div>
        </header>
    )
}

export default Navbar