import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(getFirebaseError(err.code))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    try {
      await loginWithGoogle()
      navigate('/')
    } catch (err) {
      setError(getFirebaseError(err.code))
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>

      {/* LEFT — image panel (hidden on mobile) */}
      <div className="auth-left" style={{
        flex: 1,
        backgroundImage: "url('https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1400&q=90')",
        backgroundSize: 'cover', backgroundPosition: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(145deg, rgba(10,2,0,0.92) 0%, rgba(160,40,0,0.7) 100%)',
        }} />
        <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem 2.5rem' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, marginBottom: '2.5rem' }}>
            <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg,#FF4D00,#FF8C42)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 4px 16px rgba(255,77,0,0.5)' }}>🍕</div>
            <span style={{ fontWeight: 900, fontSize: '1.4rem', color: '#fff' }}>Pizza<span style={{ color: '#FF8C42' }}>Hub</span></span>
          </Link>

          <span style={{ background: 'rgba(255,140,66,0.2)', border: '1px solid rgba(255,140,66,0.4)', color: '#FF8C42', fontSize: 11, fontWeight: 700, letterSpacing: 2, padding: '5px 14px', borderRadius: 20, display: 'inline-block', marginBottom: 20 }}>WELCOME BACK</span>
          <h2 style={{ fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 14 }}>Sign in to your<br />pizza paradise 🍕</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 340 }}>
            Order your favorites, track deliveries, and enjoy exclusive deals every day.
          </p>

          {/* Floating cards */}
          <div style={{ position: 'relative', height: 180 }}>
            {[
              { emoji: '🍕', name: 'Margherita', price: '৳299', style: { top: 0, left: 0, animationDuration: '3s' } },
              { emoji: '🧀', name: 'Cheesy Blast', price: '৳349', style: { top: 60, left: '45%', animationDuration: '4s' } },
              { emoji: '🔥', name: 'Spicy Feast', price: '৳399', style: { top: 120, left: '15%', animationDuration: '3.5s' } },
            ].map((c, i) => (
              <div key={i} style={{
                position: 'absolute', ...c.style,
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: 14, padding: '10px 16px',
                display: 'flex', alignItems: 'center', gap: 10,
                animation: `float ${c.style.animationDuration} ease-in-out infinite`,
              }}>
                <span style={{ fontSize: 22 }}>{c.emoji}</span>
                <div>
                  <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.82rem' }}>{c.name}</p>
                  <p style={{ color: '#FF8C42', fontWeight: 800, fontSize: '0.78rem' }}>{c.price}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 28, marginTop: '1rem' }}>
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
      <div style={{
        width: '100%', maxWidth: 480,
        background: '#FFF8F3',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem 1.5rem',
        position: 'relative', overflowY: 'auto',
      }}>
        {/* Soft bg pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,77,0,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,140,66,0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />

        <div style={{ width: '100%', maxWidth: 400, position: 'relative', animation: 'slideUp 0.6s ease' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, marginBottom: '2rem' }} className="mobile-logo">
            <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#FF4D00,#FF8C42)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🍕</div>
            <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#1A0500' }}>Pizza<span style={{ color: '#FF4D00' }}>Hub</span></span>
          </Link>

          <h1 style={{ fontSize: 'clamp(1.6rem,3vw,2.1rem)', fontWeight: 900, color: '#1A0500', marginBottom: 6 }}>Welcome back! 👋</h1>
          <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '1.8rem' }}>
            New here?{' '}
            <Link to="/register" style={{ color: '#FF4D00', fontWeight: 700, textDecoration: 'none' }}>Create account →</Link>
          </p>

          {error && (
            <div style={{ background: '#FFF0EE', border: '1.5px solid #FFCDC8', color: '#C0392B', padding: '10px 14px', borderRadius: 10, fontSize: '0.85rem', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              ⚠️ {error}
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
                <span style={{ color: '#FF4D00', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Forgot password?</span>
              </div>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} placeholder="Your password" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} required
                  style={{ ...inputStyle, paddingRight: 46 }}
                  onFocus={e => e.target.style.borderColor = '#FF4D00'}
                  onBlur={e => e.target.style.borderColor = '#EDE0D8'} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: 16, color: '#bbb', cursor: 'pointer' }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              ...btnStyle,
              background: loading ? '#ccc' : 'linear-gradient(135deg, #FF4D00, #FF8C42)',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 6px 24px rgba(255,77,0,0.35)',
              marginTop: 4,
            }}
              onMouseEnter={e => { if (!loading) { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 10px 32px rgba(255,77,0,0.5)' } }}
              onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = loading ? 'none' : '0 6px 24px rgba(255,77,0,0.35)' }}
            >
              {loading ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Spinner /> Signing in...</span> : 'Sign In →'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#EDE0D8' }} />
            <span style={{ padding: '0 12px', color: '#ccc', fontSize: '0.78rem', fontWeight: 600 }}>OR CONTINUE WITH</span>
            <div style={{ flex: 1, height: 1, background: '#EDE0D8' }} />
          </div>

          <button onClick={handleGoogle} style={{
            ...btnStyle, background: '#fff',
            color: '#333', border: '2px solid #EDE0D8',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF4D00'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,77,0,0.12)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#EDE0D8'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)' }}
          >
            <GoogleIcon /> Continue with Google
          </button>
        </div>
      </div>

      <style>{`
        .auth-left { display: none; }
        .mobile-logo { display: flex; }
        @media (min-width: 900px) {
          .auth-left { display: block !important; }
          .mobile-logo { display: none !important; }
        }
      `}</style>
    </div>
  )
}

function Register_link() { return null }

const labelStyle = { display: 'block', fontWeight: 700, color: '#555', fontSize: '0.83rem', marginBottom: 7 }
const inputStyle = {
  width: '100%', padding: '13px 16px', borderRadius: 12, fontSize: '0.93rem',
  border: '2px solid #EDE0D8', background: '#fff', outline: 'none',
  boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s', color: '#1A0500',
}
const btnStyle = {
  width: '100%', padding: '14px', borderRadius: 12, border: 'none',
  color: '#fff', fontSize: '0.97rem', fontWeight: 800,
  transition: 'transform 0.2s, box-shadow 0.2s',
  letterSpacing: 0.3,
}

function Spinner() {
  return <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8 20-20 0-1.3-.1-2.7-.4-4z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.6-3-11.3-7.4l-6.5 5C9.8 39.8 16.4 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.4-2.4 4.4-4.5 5.8l6.2 5.2C40.4 35.5 44 30.2 44 24c0-1.3-.1-2.7-.4-4z" />
    </svg>
  )
}

function getFirebaseError(code) {
  switch (code) {
    case 'auth/user-not-found': return 'Email not registered'
    case 'auth/wrong-password': return 'Wrong password'
    case 'auth/invalid-email': return 'Invalid email address'
    case 'auth/too-many-requests': return 'Too many attempts. Try later'
    case 'auth/invalid-credential': return 'Invalid email or password'
    default: return 'Login failed. Try again'
  }
}
