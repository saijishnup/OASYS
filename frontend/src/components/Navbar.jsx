import { Menu, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ onMenuToggle }) {
  const navigate = useNavigate()
  const { logout, username } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/[0.05] bg-surface-900/90 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="rounded-xl border border-white/[0.08] p-2 text-gray-400 transition hover:text-white lg:hidden"
        >
          <Menu size={18} />
        </button>
        <div>
          <p className="font-display text-lg font-semibold text-white">Operations Dashboard</p>
          <p className="font-mono text-[11px] tracking-wide text-gray-500">
            Multi-vertical control center{username ? ` • ${username}` : ''}
          </p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="btn-ghost flex items-center gap-2 text-sm"
      >
        <LogOut size={14} />
        Logout
      </button>
    </header>
  )
}
