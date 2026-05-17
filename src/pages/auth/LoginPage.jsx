import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { Store, Eye, EyeOff } from 'lucide-react'
import { authAPI } from '../../api'
import useAuthStore from '../../store/authStore'
import loginImage from '../../assets/login.png'

const inputStyle = {
  width: '100%', height: 46, padding: '0 14px',
  border: '1px solid #e2e8f0', borderRadius: 10,
  fontSize: 14, outline: 'none', background: '#ffffff',
  transition: 'all 0.2s', fontFamily: 'inherit', color: '#0f172a',
}
const buttonStyle = {
  width: '100%', height: 46, border: 'none', borderRadius: 10,
  background: '#2563eb', color: '#ffffff', fontWeight: 600,
  fontSize: 14, cursor: 'pointer', marginTop: 8, transition: 'all 0.2s',
  fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
}

export default function LoginPage() {
  const { isAuthenticated, setAuth } = useAuthStore()
  const navigate = useNavigate()

  const [activeTab, setActiveTab]     = useState('login')
  const [loginForm, setLoginForm]     = useState('')
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError]             = useState('')
  const [showPass, setShowPass]       = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [loading, setLoading]         = useState(false)

  if (isAuthenticated) return <Navigate to="/" replace />

  const focus = e => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)' }
  const blur  = e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none' }

  const handleLogin = async e => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const { data } = await authAPI.login(loginForm)
      setAuth(data.data.user, data.data.access_token, data.data.refresh_token)
      navigate(data.data.user.role === 'admin' ? '/admin/dashboard' : '/staff/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.')
    } finally { setLoading(false) }
  }

  const handleRegister = async e => {
    e.preventDefault(); setError('')
    if (!registerForm.name || !registerForm.email || !registerForm.password) { setError('All fields are required.'); return }
    if (registerForm.password !== registerForm.confirmPassword) { setError('Passwords do not match.'); return }
    if (registerForm.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    try {
      await authAPI.register({ name: registerForm.name, email: registerForm.email, password: registerForm.password })
      setActiveTab('login')
      setLoginForm(p => ({ ...p, email: registerForm.email }))
      setRegisterForm({ name: '', email: '', password: '', confirmPassword: '' })
      setError('')
      alert('Registration successful! Please sign in.')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc', overflow: 'hidden' }}>

      {/* Left — form panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ width: '100%', maxWidth: 480, background: '#ffffff', borderRadius: 20, padding: 22, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <Store size={24} color="#fff" />
            </div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#0f172a' }}>
              Smart<span style={{ color: '#2563eb' }}>Shelf</span>
            </h1>
            <p style={{ marginTop: 6, color: '#64748b', fontSize: 14 }}>Inventory Management System</p>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 12, padding: 4, marginBottom: 20 }}>
            {[['login','Sign In'],['register','Sign Up']].map(([tab, label]) => (
              <button key={tab} onClick={() => { setActiveTab(tab); setError('') }}
                style={{ flex: 1, height: 42, border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 14, fontFamily: 'inherit', transition: 'all .2s',
                  background: activeTab === tab ? '#2563eb' : 'transparent',
                  color: activeTab === tab ? '#ffffff' : '#64748b',
                }}>{label}</button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div style={{ marginBottom: 14, padding: 12, borderRadius: 10, background: '#fee2e2', color: '#dc2626', fontSize: 14 }}>
              {error}
            </div>
          )}

          {/* LOGIN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600, color: '#0f172a' }}>Email</label>
                <input type="email" required value={loginForm.email}
                  onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="Enter your email..." style={inputStyle} onFocus={focus} onBlur={blur} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600, color: '#0f172a' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPass ? 'text' : 'password'} required value={loginForm.password}
                    onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="••••••••" style={{ ...inputStyle, paddingRight: 44 }} onFocus={focus} onBlur={blur} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} style={buttonStyle}
                onMouseEnter={e => { if (!loading) e.target.style.background = '#1d4ed8' }}
                onMouseLeave={e => { if (!loading) e.target.style.background = '#2563eb' }}>
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          )}

          {/* REGISTER */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <input type="text" required placeholder="Full Name" value={registerForm.name}
                  onChange={e => setRegisterForm({ ...registerForm, name: e.target.value })}
                  style={inputStyle} onFocus={focus} onBlur={blur} />
                <input type="email" required placeholder="Email Address" value={registerForm.email}
                  onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
                  style={inputStyle} onFocus={focus} onBlur={blur} />
              </div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <input type={showPass ? 'text' : 'password'} required placeholder="Password" value={registerForm.password}
                    onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })}
                    style={{ ...inputStyle, paddingRight: 44 }} onFocus={focus} onBlur={blur} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div style={{ flex: 1, position: 'relative' }}>
                  <input type={showConfirmPass ? 'text' : 'password'} required placeholder="Confirm Password" value={registerForm.confirmPassword}
                    onChange={e => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                    style={{ ...inputStyle, paddingRight: 44 }} onFocus={focus} onBlur={blur} />
                  <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                    {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} style={buttonStyle}
                onMouseEnter={e => { if (!loading) e.target.style.background = '#1d4ed8' }}
                onMouseLeave={e => { if (!loading) e.target.style.background = '#2563eb' }}>
                {loading ? 'Creating account…' : 'Create Staff Account'}
              </button>
            </form>
          )}

        </div>
      </div>

      {/* Right — image panel */}
      <div className="login-right" style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: 10,
        background: 'linear-gradient(135deg, #f8fbff 0%, #eef4ff 100%)',
      }}>
        <img 
          src={loginImage} 
          alt="SmartShelf Inventory Management" 
          style={{
            width: '100%',
            maxWidth: 600,
            height: 'auto',
            objectFit: 'contain',
            animation: 'float 5s ease-in-out infinite',
          }}
        />
      </div>

      <style>{`
        @media(max-width:900px) {
          .login-right {
            display: none!important;
          }
        }
        
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </div>
  )
}