import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error,    setError]    = useState('')
    const [loading,  setLoading]  = useState(false)
    const { login }    = useAuth()
    const navigate     = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await login(username, password)
            navigate('/dashboard')
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid credentials')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex" style={{ background: '#0F172A' }}>

            {/* Left panel */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
                style={{ background: '#0F172A' }}>

                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                        </svg>
                    </div>
                    <span className="text-white text-lg font-700 tracking-wide">OASYS</span>
                </div>

                {/* Center content */}
                <div className="space-y-8">
                    <div>
                        <h2 className="text-4xl font-700 text-white leading-tight">
                            Enterprise Operations<br />
                            <span className="text-blue-400">& Analytics</span>
                        </h2>
                        <p className="text-white/40 mt-4 text-sm leading-relaxed max-w-sm">
                            A unified platform consolidating Fintech, Real Estate, Telecom,
                            Logistics, Energy, and Automobiles into a single analytics system.
                        </p>
                    </div>

                    {/* Domain pills */}
                    <div className="flex flex-wrap gap-2">
                        {[
                            { label: 'Fintech',      color: '#3B82F6' },
                            { label: 'Real Estate',  color: '#10B981' },
                            { label: 'Telecom',      color: '#8B5CF6' },
                            { label: 'Logistics',    color: '#F97316' },
                            { label: 'Energy',       color: '#EAB308' },
                            { label: 'Automobiles',  color: '#EF4444' },
                        ].map(d => (
                            <span
                                key={d.label}
                                className="px-3 py-1 rounded-full text-xs font-500 border"
                                style={{
                                    color:            d.color,
                                    borderColor:      d.color + '40',
                                    backgroundColor:  d.color + '15',
                                }}
                            >
                                {d.label}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Bottom */}
                <p className="text-white/20 text-xs">
                    © 2026 OASYS · NITK Surathkal · CS254
                </p>
            </div>

            {/* Right panel — login form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-sm">

                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 mb-8 lg:hidden">
                        <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                            </svg>
                        </div>
                        <span className="text-gray-900 font-700">OASYS</span>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-2xl font-700 text-gray-900">Welcome back</h3>
                        <p className="text-gray-500 text-sm mt-1">Sign in to your admin account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-600 text-gray-700 mb-1.5">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="Enter username"
                                className="input"
                                autoFocus
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-600 text-gray-700 mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className="input"
                                required
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-red-500 flex-shrink-0">
                                    <circle cx="12" cy="12" r="10" />
                                    <path strokeLinecap="round" d="M12 8v4m0 4h.01" />
                                </svg>
                                <p className="text-xs text-red-600">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full justify-center py-2.5 mt-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </>
                            ) : 'Sign in'}
                        </button>
                    </form>

                    <p className="text-center text-xs text-gray-400 mt-6">
                        NITK Surathkal · Department of CSE
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login