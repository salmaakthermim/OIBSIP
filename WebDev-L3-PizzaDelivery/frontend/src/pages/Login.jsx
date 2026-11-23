import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [notVerified, setNotVerified] = useState(false)
  const { login, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setNotVerified(false)
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.name}! 🍕`)
      navigate(user.role === 'admin' ? '/admin' : '/')
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Try again'
      if (err.response?.data?.notVerified) setNotVerified(true)
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* LEFT — image panel */}
      <div className="auth-left" style={{
        flex: 1,
        backgroundImage: "url('https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1400&q=90')",
        backgroundSize: 'cover', backgroundPosition: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(145deg, rgba(10,2,0,0.92) 0%, rgba(160,40,0,0.7) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem 2.5rem' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, marginBottom: '2.5rem' }}>
            <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg,#FF4D00,#FF8C42)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🍕</div>
            <span style={{ fontWeight: 900, fontSize: '1.4rem', color: '#fff' }}>Pizza<span style={{ color: '#FF8C42' }}>Hub</span></span>
          </Link>
          <span style={{ background: 'rgba(255,140,66,0.2)', border: '1px solid rgba(255,140,66,0.4)', color: '#FF8C42', fontSize: 11, fontWeight: 700, letterSpacing: 2, padding: '5px 14px', borderRadius: 20, display: 'inline-block', marginBottom: 20 }}>WELCOME BACK</span>
          <h2 style={{ fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 14 }}>Sign in to your<br />pizza paradise 🍕</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 340 }}>Order your favorites, track deliveries, and enjoy exclusive deals every day.</p>
          <div style={{ display: 'flex', gap: 28, marginTop: '2rem' }}>
            {[['10k+', 'Customers'], ['30 min', 'Delivery'], ['4.9★', 'Rating']].map(([v, l]) => (
              <div key={l}>
                <p style={{ color: '#FF8C42', fontWeight: 800, fontSize: '1.1rem' }}>{v}</p>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', marginTop: 2 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — form */}
      <div style={{ width: '100%', maxWidth: 480, background: '#FFF8F3', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 400, animation: 'slideUp 0.6s ease' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, marginBottom: '2rem' }} className="mobile-logo">
            <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#FF4D00,#FF8C42)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🍕</div>
            <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#1A0500' }}>Pizza<span style={{ color: '#FF4D00' }}>Hub</span></span>
          </Link>

          <h1 style={{ fontSize: 'clamp(1.6rem,3vw,2.1rem)', fontWeight: 900, color: '#1A0500', marginBottom: 6 }}>Welcome back! 👋</h1>
          <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '1.8rem' }}>
            New here? <Link to="/register" style={{ color: '#FF4D00', fontWeight: 700, textDecoration: 'none' }}>Create account →</Link>
          </p>

          {error && (
            <div style={{ background: '#FFF0EE', border: '1.5px solid #FFCDC8', color: '#C0392B', padding: '10px 14px', borderRadius: 10, fontSize: '0.85rem', marginBottom: 18 }}>
              ⚠️ {error}
              {notVerified && (
                <div style={{ marginTop: 8 }}>
                  <Link to="/resend-verification" state={{ email: form.email }} style={{ color: '#FF4D00', fontWeight: 700, fontSize: '0.82rem' }}>
                    Resend verification email →
                  </Link>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={labelStyle}>Email Address</label>
              <input type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#FF4D00'}
                onBlur={e => e.target.style.borderColor = '#EDE0D8'} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                <label style={labelStyle}>Password</label>
                <Link to="/forgot-password" style={{ color: '#FF4D00', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} placeholder="Your password" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} required
                  style={{ ...inputStyle, paddingRight: 46 }}
                  onFocus={e => e.target.style.borderColor = '#FF4D00'}
                  onBlur={e => e.target.style.borderColor = '#EDE0D8'} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: 16, color: '#bbb', cursor: 'pointer' }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ ...btnStyle, background: loading ? '#ccc' : 'linear-gradient(135deg,#FF4D00,#FF8C42)', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 6px 24px rgba(255,77,0,0.35)', marginTop: 4 }}>
              {loading ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Spinner /> Signing in...</span> : 'Sign In →'}
            </button>
          </form>

          <p style={{ color: '#aaa', fontSize: '0.8rem', textAlign: 'center', marginTop: 20 }}>
            Admin? Use <strong style={{ color: '#FF4D00' }}>admin@pizzahub.com</strong>
          </p>
        </div>
      </div>

      <style>{`
        .auth-left { display: none; }
        .mobile-logo { display: flex; }
        @media (min-width: 900px) { .auth-left { display: block !important; } .mobile-logo { display: none !important; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

const labelStyle = { display: 'block', fontWeight: 700, color: '#555', fontSize: '0.83rem', marginBottom: 7 }
const inputStyle = { width: '100%', padding: '13px 16px', borderRadius: 12, fontSize: '0.93rem', border: '2px solid #EDE0D8', background: '#fff', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s', color: '#1A0500' }
const btnStyle = { width: '100%', padding: '14px', borderRadius: 12, border: 'none', color: '#fff', fontSize: '0.97rem', fontWeight: 800, transition: 'transform 0.2s, box-shadow 0.2s' }

function Spinner() {
  return <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
}
