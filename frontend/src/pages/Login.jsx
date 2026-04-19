import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'
import bgImage from '../assets/dashboard-bp.jpg'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [focused, setFocused] = useState(null)
  const [mounted, setMounted] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const from = location.state?.from?.pathname || '/dashboard'

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!username || !password) {
      toast.error('Enter username and password')
      return
    }
    setSubmitting(true)
    try {
      const response = await api.post('/auth/login', { username, password })
      login(response.data.token, response.data.username)
      toast.success('Login successful')
      navigate(from, { replace: true })
    } catch (error) {
      toast.error(error.message || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          position: relative;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          background: #060b14;
        }

        .login-bg {
          position: absolute;
          inset: 0;
          background-image: url(${bgImage});
          background-size: cover;
          background-position: center left;
          opacity: 0.35;
          transition: opacity 1.2s ease;
        }

        .login-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            transparent 0%,
            rgba(6, 11, 20, 0.4) 40%,
            rgba(6, 11, 20, 0.92) 65%,
            #060b14 100%
          );
        }

        .grid-lines {
          position: absolute;
          inset: 0;
          opacity: 0.04;
          background-image:
            linear-gradient(rgba(0, 200, 255, 1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 200, 255, 1) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        .login-panel {
          position: relative;
          z-index: 10;
          width: 420px;
          margin-right: clamp(2rem, 8vw, 120px);
          padding: 2.75rem 2.5rem;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }

        .login-panel.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .brand-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 2.25rem;
        }

        .brand-icon {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          background: linear-gradient(135deg, #00c8ff 0%, #0070f3 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-icon svg {
          width: 18px;
          height: 18px;
          fill: none;
          stroke: #fff;
          stroke-width: 2.2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .brand-name {
          font-family: 'Lato', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.02em;
        }

        .login-heading {
          font-family: 'Lato', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.15;
          letter-spacing: -0.03em;
          margin: 0 0 6px;
        }

        .login-sub {
          font-size: 14px;
          color: rgba(255,255,255,0.45);
          margin: 0 0 2rem;
          font-weight: 300;
          letter-spacing: 0.01em;
        }

        .field-wrap {
          position: relative;
          margin-bottom: 14px;
        }

        .field-label {
          display: block;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 7px;
          transition: color 0.2s;
        }

        .field-wrap.active .field-label {
          color: #00c8ff;
        }

        .field-input {
          width: 100%;
          box-sizing: border-box;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 12px 42px 12px 16px;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }

        .field-input::placeholder {
          color: rgba(255,255,255,0.2);
        }

        .field-input:focus {
          border-color: rgba(0, 200, 255, 0.5);
          background: rgba(0, 200, 255, 0.06);
          box-shadow: 0 0 0 3px rgba(0, 200, 255, 0.08);
        }

        .field-icon {
          position: absolute;
          right: 14px;
          bottom: 13px;
          width: 18px;
          height: 18px;
          color: rgba(255,255,255,0.25);
          pointer-events: none;
          transition: color 0.2s;
        }

        .field-wrap.active .field-icon {
          color: rgba(0, 200, 255, 0.7);
        }

        .toggle-pw {
          position: absolute;
          right: 14px;
          bottom: 13px;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          color: rgba(255,255,255,0.25);
          line-height: 0;
          transition: color 0.2s;
        }

        .toggle-pw:hover {
          color: rgba(255,255,255,0.6);
        }

        .options-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 10px 0 22px;
        }

        .remember-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          cursor: pointer;
          user-select: none;
        }

        .remember-label input[type="checkbox"] {
          width: 15px;
          height: 15px;
          accent-color: #00c8ff;
          cursor: pointer;
        }

        .forgot-link {
          font-size: 13px;
          color: rgba(0, 200, 255, 0.7);
          text-decoration: none;
          transition: color 0.2s;
        }

        .forgot-link:hover {
          color: #00c8ff;
        }

        .submit-btn {
          width: 100%;
          padding: 13px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #00c8ff 0%, #0070f3 100%);
          color: #fff;
          font-family: 'Lato', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.02em;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: opacity 0.2s, transform 0.15s;
        }

        .submit-btn:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .submit-btn .spinner {
          display: inline-block;
          width: 15px;
          height: 15px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.08);
        }

        .divider-text {
          font-size: 12px;
          color: rgba(255,255,255,0.25);
          letter-spacing: 0.05em;
        }

        .social-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px;
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.5);
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }

        .social-btn:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.8);
        }

        .social-btn svg {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }

        .signup-row {
          text-align: center;
          margin-top: 20px;
          font-size: 13px;
          color: rgba(255,255,255,0.3);
        }

        .signup-link {
          color: #00c8ff;
          text-decoration: none;
          font-weight: 500;
          margin-left: 4px;
        }

        .stat-chips {
          position: absolute;
          bottom: 2.5rem;
          left: clamp(1.5rem, 5vw, 80px);
          display: flex;
          gap: 12px;
          z-index: 10;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s;
        }

        .stat-chips.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .chip {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 10px 16px;
          backdrop-filter: blur(12px);
        }

        .chip-val {
          font-family: 'Lato', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #00c8ff;
          line-height: 1;
          margin-bottom: 2px;
        }

        .chip-label {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.05em;
        }

        .headline-left {
          position: absolute;
          left: clamp(1.5rem, 5vw, 80px);
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          max-width: 400px;
          opacity: 0;
          transition: opacity 0.8s ease 0.2s;
        }

        .headline-left.visible {
          opacity: 1;
        }

        .hl-eyebrow {
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #00c8ff;
          font-weight: 500;
          margin-bottom: 12px;
        }

        .hl-title {
          font-family: 'Lato', sans-serif;
          font-size: clamp(32px, 3.5vw, 50px);
          font-weight: 800;
          color: #fff;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: 16px;
        }

        .hl-title span {
          background: linear-gradient(135deg, #00c8ff, #0070f3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hl-desc {
          font-size: 15px;
          color: rgba(255,255,255,0.4);
          font-weight: 300;
          line-height: 1.65;
        }

        @media (max-width: 820px) {
          .login-root { justify-content: center; }
          .login-panel { margin-right: 0; }
          .headline-left, .stat-chips { display: none; }
          .login-overlay {
            background: rgba(6,11,20,0.75);
          }
        }
      `}</style>

      <div className="login-root">
        <div className="login-bg" />
        <div className="login-overlay" />
        <div className="grid-lines" />

        {/* Left headline */}
        <div className={`headline-left ${mounted ? 'visible' : ''}`}>
          <p className="hl-eyebrow">Multi-Vertical Control</p>
          <h1 className="hl-title">
            <span>Analytics Platform</span>
          </h1>
          <p className="hl-desc">
            Unified dashboard for all your<br />
            business verticals in one platform.
          </p>
        </div>

        {/* Stat chips */}
        <div className={`stat-chips ${mounted ? 'visible' : ''}`}>
          <div className="chip">
            <div className="chip-val">+38%</div>
            <div className="chip-label">Revenue</div>
          </div>
          <div className="chip">
            <div className="chip-val">12.4k</div>
            <div className="chip-label">Active users</div>
          </div>
        </div>

        {/* Login card */}
        <div className={`login-panel ${mounted ? 'visible' : ''}`}>
          <div className="brand-row">
            <div className="brand-icon">
              <svg viewBox="0 0 24 24">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
            <span className="brand-name">OASYS</span>
          </div>

          <h2 className="login-heading">Welcome</h2>
          <p className="login-sub">Access your business control center</p>

          <form onSubmit={handleSubmit} autoComplete="off">
            {/* Username */}
            <div className={`field-wrap ${focused === 'username' ? 'active' : ''}`}>
              <label className="field-label">Username</label>
              <input
                className="field-input"
                type="text"
                placeholder="your_username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                onFocus={() => setFocused('username')}
                onBlur={() => setFocused(null)}
                required
              />
              <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </div>

            {/* Password */}
            <div className={`field-wrap ${focused === 'password' ? 'active' : ''}`}>
              <label className="field-label">Password</label>
              <input
                className="field-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                required
              />
              <button
                type="button"
                className="toggle-pw"
                onClick={() => setShowPassword(p => !p)}
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {showPassword ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </svg>
              </button>
            </div>

            <div className="options-row">
              <label className="remember-label">
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting && <span className="spinner" />}
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="signup-row" style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
            Unauthorized access is prohibited
          </p>
        </div>
      </div>
    </>
  )
}
