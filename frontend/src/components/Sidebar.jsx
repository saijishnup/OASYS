import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Landmark,
  Building2,
  Radio,
  Package,
  Zap,
  Car,
  X,
  ChevronRight,
  Users,
  ScrollText,
  BarChart2,
  ShoppingCart,
  Box,
  PieChart,
} from 'lucide-react'

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', sub: 'Overview' },
    ],
  },
  {
    label: 'Verticals',
    items: [
      { to: '/fintech', icon: Landmark, label: 'Fintech', sub: 'Banking & Loans' },
      { to: '/real-estate', icon: Building2, label: 'Real Estate', sub: 'Properties & Deals' },
      { to: '/telecom', icon: Radio, label: 'Telecom', sub: 'Plans & Usage' },
      { to: '/logistics', icon: Package, label: 'Logistics', sub: 'Shipments' },
      { to: '/energy', icon: Zap, label: 'Energy', sub: 'Connections & Bills' },
      { to: '/automobiles', icon: Car, label: 'Automobiles', sub: 'Vehicles & Orders' },
    ],
  },
  {
    label: 'Management',
    items: [
      { to: '/users', icon: Users, label: 'Users', sub: 'All accounts' },
      { to: '/orders', icon: ShoppingCart, label: 'Orders', sub: 'Unified orders' },
      { to: '/products', icon: Box, label: 'Products', sub: 'Catalogue' },
      { to: '/segments', icon: PieChart, label: 'Segments', sub: 'User analytics' },
    ],
  },
  {
    label: 'Reports',
    items: [
      { to: '/logs', icon: ScrollText, label: 'Audit Logs', sub: 'Change history' },
      { to: '/monthly-report', icon: BarChart2, label: 'Monthly Report', sub: 'Analytics' },
    ],
  },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-full w-60 flex-col border-r border-white/[0.05]
          bg-surface-900 transition-transform duration-300 ease-in-out lg:static lg:z-auto
          lg:h-screen lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/[0.05] px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-500/30">
              <span className="font-display text-sm font-black text-white">O</span>
            </div>
            <div>
              <p className="font-display text-base font-bold leading-none text-white">OASYS</p>
              <p className="mt-0.5 font-mono text-[10px] tracking-widest text-brand-500">ENTERPRISE</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-gray-500 transition-colors hover:text-white lg:hidden">
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-3">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="mb-1.5 px-2 font-mono text-[10px] uppercase tracking-widest text-gray-700">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map(({ to, icon: Icon, label, sub }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={onClose}
                    className={({ isActive }) => `
                      group flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-body
                      transition-all duration-200
                      ${
                        isActive
                          ? 'border border-brand-500/20 bg-brand-500/15 text-brand-400'
                          : 'text-gray-500 hover:bg-white/[0.04] hover:text-gray-200'
                      }
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        <div
                          className={`
                            flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg
                            transition-all duration-200
                            ${
                              isActive
                                ? 'bg-brand-500/20'
                                : 'bg-white/[0.04] group-hover:bg-white/[0.07]'
                            }
                          `}
                        >
                          <Icon size={13} className={isActive ? 'text-brand-400' : ''} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`truncate text-xs font-medium leading-none ${isActive ? 'text-brand-300' : ''}`}>
                            {label}
                          </p>
                          <p className="mt-0.5 truncate font-mono text-[10px] text-gray-700">{sub}</p>
                        </div>
                        {isActive && <ChevronRight size={10} className="flex-shrink-0 text-brand-500" />}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/[0.05] p-3">
          <div className="glass rounded-xl p-2.5">
            <p className="mb-0.5 font-mono text-[10px] text-gray-600">DATABASE</p>
            <p className="font-body text-xs text-gray-400">
              oasys_db <span className="text-emerald-500">live</span>
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
