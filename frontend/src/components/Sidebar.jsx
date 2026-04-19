import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const domains = [
    {
        path: '/fintech',
        label: 'Fintech',
        color: '#3B82F6',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 0v20M2 12h20" />
            </svg>
        )
    },
    {
        path: '/realestate',
        label: 'Real Estate',
        color: '#10B981',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21H3V9.75z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V12h6v9" />
            </svg>
        )
    },
    {
        path: '/telecom',
        label: 'Telecom',
        color: '#8B5CF6',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
            </svg>
        )
    },
    {
        path: '/logistics',
        label: 'Logistics',
        color: '#F97316',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
        )
    },
    {
        path: '/energy',
        label: 'Energy',
        color: '#EAB308',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
        )
    },
    {
        path: '/automobiles',
        label: 'Automobiles',
        color: '#EF4444',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h7.5M3 13.5V9.75A2.25 2.25 0 015.25 7.5h13.5A2.25 2.25 0 0121 9.75v3.75m-18 0h18m-18 0l1.5 3.75h15L21 13.5" />
            </svg>
        )
    },
]

const Sidebar = () => {
    const { logout, user } = useAuth()
    const location = useLocation()

    return (
        <aside className="w-56 flex-shrink-0 flex flex-col h-full"
            style={{ background: '#0F172A' }}>

            {/* Logo */}
            <div className="px-5 py-5 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                        <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-white text-sm font-700 tracking-wide leading-none">OASYS</p>
                        <p className="text-white/40 text-xs mt-0.5 leading-none">Enterprise Suite</p>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">

                {/* Dashboard */}
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group
                        ${isActive
                            ? 'bg-white/10 text-white'
                            : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                        }`
                    }
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4 flex-shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                    </svg>
                    <span className="font-500">Dashboard</span>
                </NavLink>

                {/* Divider */}
                <div className="pt-3 pb-1 px-3">
                    <p className="text-white/25 text-xs uppercase tracking-widest font-600">Verticals</p>
                </div>

                {/* Domain links */}
                {domains.map((d) => {
                    const isActive = location.pathname === d.path
                    return (
                        <NavLink
                            key={d.path}
                            to={d.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150
                                ${isActive
                                    ? 'bg-white/10 text-white'
                                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                                }`}
                        >
                            <span
                                className="flex-shrink-0 w-4 h-4"
                                style={{ color: isActive ? d.color : undefined }}
                            >
                                {d.icon}
                            </span>
                            <span className="font-500">{d.label}</span>
                            {isActive && (
                                <span
                                    className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: d.color }}
                                />
                            )}
                        </NavLink>
                    )
                })}
            </nav>

            {/* User + Logout */}
            <div className="px-3 py-4 border-t border-white/10">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
                    <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-400 text-xs font-700 uppercase">
                            {user?.username?.[0] || 'A'}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-600 truncate capitalize">{user?.username}</p>
                        <p className="text-white/30 text-xs">Administrator</p>
                    </div>
                    <button
                        onClick={logout}
                        className="text-white/30 hover:text-white/70 transition-colors duration-150"
                        title="Logout"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                    </button>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar