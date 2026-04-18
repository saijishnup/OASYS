import React from 'react';
import { Link } from 'react-router-dom';

const sidebarLinks = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Orders', to: '/orders' },
  { label: 'Products', to: '/products' },
  { label: 'Users', to: '/users' },
  { label: 'Segments', to: '/segments' },
  { label: 'Logs', to: '/logs' },
  { label: 'Monthly Report', to: '/monthly-report' },
  { label: 'Fintech', to: '/fintech' },
  { label: 'Real Estate', to: '/realestate' },
  { label: 'Telecom', to: '/telecom' },
  { label: 'Logistics', to: '/logistics' },
  { label: 'Energy', to: '/energy' },
  { label: 'Automobiles', to: '/automobiles' },
];

function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white min-h-screen p-6 border-r border-slate-700">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-blue-400 tracking-wider">OASYS</h1>
        <p className="text-xs text-slate-400 mt-1">Analytics Dashboard</p>
      </div>
      <nav className="flex-1 space-y-2">
        {sidebarLinks.map(({ label, to }) => (
          <Link
            key={to}
            to={to}
            className="block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-500/20 hover:text-blue-300 text-slate-300"
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="pt-4 border-t border-slate-700 text-xs text-slate-400">
        <p>© 2026 OASYS</p>
      </div>
    </aside>
  );
}

export default Sidebar;
