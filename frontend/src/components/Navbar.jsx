import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Orders', to: '/orders' },
  { label: 'Products', to: '/products' },
  { label: 'Users', to: '/users' },
  { label: 'Segments', to: '/segments' },
  { label: 'Logs', to: '/logs' },
  { label: 'Monthly Report', to: '/monthly-report' },
];

function Navbar({ onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="bg-[#1a1f2e] border-b border-white/[0.08]">
      {/* Desktop bar */}
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-14">
        {/* Brand */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#4f7cff]" />
          <span className="text-white font-semibold text-[15px] tracking-tight">
            AdminPanel
          </span>
        </div>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`text-[13.5px] font-medium px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap
                ${pathname === to
                  ? 'text-white bg-[#4f7cff]/15'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.08]'
                }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {/* Hamburger (mobile only) */}
          <button
            className="md:hidden flex flex-col gap-[4.5px] p-1.5 rounded-lg hover:bg-white/[0.08] transition-colors"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-white/80 rounded transition-transform duration-200
              ${menuOpen ? 'translate-y-[6.5px] rotate-45' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white/80 rounded transition-opacity duration-200
              ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white/80 rounded transition-transform duration-200
              ${menuOpen ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
          </button>

          {/* Logout button */}
          <button
            onClick={onLogout}
            className="text-[13.5px] font-medium text-white bg-[#4f7cff] hover:bg-[#3d6be0] 
              active:scale-[0.97] px-4 py-1.5 rounded-lg transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/[0.06] px-6 pb-4 pt-2.5 flex flex-col gap-0.5">
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-medium px-3 py-2.5 rounded-lg transition-colors
                ${pathname === to
                  ? 'text-white bg-[#4f7cff]/15'
                  : 'text-white/65 hover:text-white hover:bg-white/[0.07]'
                }`}
            >
              {label}
            </Link>
          ))}
          <button
            onClick={onLogout}
            className="mt-2 text-sm font-medium text-white bg-[#4f7cff] hover:bg-[#3d6be0] 
              px-3 py-2.5 rounded-lg text-left transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

export default Navbar;