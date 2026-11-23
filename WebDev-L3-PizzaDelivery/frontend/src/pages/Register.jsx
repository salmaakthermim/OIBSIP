import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const { register, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const strength = getStrength(form.password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) return setError('Passwords do not match')
    if (form.password.length < 6) return setError('Password must be at least 6 characters')
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
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

      {/* LEFT — image panel */}
      <div className="auth-left" style={{
        flex: 1,
        backgroundImage: "url('https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1400&q=90')",
        backgroundSize: 'cover', backgroundPosition: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(145deg, rgba(8,2,0,0.93) 0%, rgba(140,35,0,0.68) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem 2.5rem' }}>

          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, marginBottom: '2.5rem' }}>
            <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg,#FF4D00,#FF8C42)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 4px 16px rgba(255,77,0,0.5)' }}>🍕</div>
            <span style={{ fontWeight: 900, fontSize: '1.4rem', color: '#fff' }}>Pizza<span style={{ color: '#FF8C42' }}>Hub</span></span>
          </Link>

          <span style={{ background: 'rgba(255,140,66,0.2)', border: '1px solid rgba(255,140,66,0.4)', color: '#FF8C42', fontSize: 11, fontWeight: 700, letterSpacing: 2, padding: '5px 14px', borderRadius: 20, display: 'inline-block', marginBottom: 20 }}>JOIN THE FAMILY</span>

          <h2 style={{ fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 14 }}>
            Your pizza<br />journey starts<br />here 🚀
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: '2rem', maxWidth: 320 }}>
            Create your free account and unlock exclusive member benefits.
          </p>

          {/* Benefits */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: '🎉', text: '20% OFF on your first order', color: '#FF8C42' },
              { icon: '🚀', text: '30-min guaranteed delivery', color: '#10B981' },
              { icon: '⭐', text: 'Earn reward points every order', color: '#F59E0B' },
              { icon: '🔔', text: 'Exclusive member-only deals', color: '#6366F1' },
            ].map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, animation: `slideIn 0.5s ease ${i * 0.08}s both` }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: b.color + '20', border: `1px solid ${b.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>{b.icon}</div>
                <span style={{ color: 'rgba(255,255,255,0.78)', fontSize: '0.88rem' }}>{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — form */}
      <div style={{
        width: '100%', maxWidth: 500,
        background: '#FFF8F3',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem 1.5rem',
        overflowY: 'auto', position: 'relative',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,77,0,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,140,66,0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />

        <div style={{ width: '100%', maxWidth: 420, position: 'relative', animation: 'slideUp 0.6s ease', padding: '1rem 0' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.6rem' }} className="mobile-logo">
            <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#FF4D00,#FF8C42)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🍕</div>
            <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#1A0500' }}>Pizza<span style={{ color: '#FF4D00' }}>Hub</span></span>
          </Link>

          <h1 style={{ fontSize: 'clamp(1.6rem,3vw,2.1rem)', fontWeight: 900, color: '#1A0500', marginBottom: 6 }}>Create Account ✨</h1>
          <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '1.6rem' }}>
            Already have one?{' '}
            <Link to="/login" style={{ color: '#FF4D00', fontWeight: 700, textDecoration: 'none' }}>Sign in →</Link>
          </p>

          {error && (
            <div style={{ background: '#FFF0EE', border: '1.5px solid #FFCDC8', color: '#C0392B', padding: '10px 14px', borderRadius: 10, fontSize: '0.85rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              ⚠️ {error}
            </div>
          )}

          {/* Google first */}
          <button onClick={handleGoogle} style={{
            ...btnStyle, background: '#fff',
            color: '#333', border: '2px solid #EDE0D8',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            marginBottom: 18,
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF4D00'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,77,0,0.12)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#EDE0D8'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)' }}
          >
            <GoogleIcon /> Sign up with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
            <div style={{ flex: 1, height: 1, background: '#EDE0D8' }} />
            <span style={{ padding: '0 12px', color: '#ccc', fontSize: '0.78rem', fontWeight: 600 }}>OR WITH EMAIL</span>
            <div style={{ flex: 1, height: 1, background: '#EDE0D8' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input type="text" placeholder="Sabbir Ahmed" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#FF4D00'}
                onBlur={e => e.target.style.borderColor = '#EDE0D8'} />
            </div>

            <div>
              <label style={labelStyle}>Email Address</label>
              <input type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#FF4D00'}
                onBlur={e => e.target.style.borderColor = '#EDE0D8'} />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} required
                  style={{ ...inputStyle, paddingRight: 46 }}
                  onFocus={e => e.target.style.borderColor = '#FF4D00'}
                  onBlur={e => e.target.style.borderColor = '#EDE0D8'} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: 16, color: '#bbb', cursor: 'pointer' }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {form.password && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} style={{
                        flex: 1, height: 3, borderRadius: 2,
                        background: i <= strength.level
                          ? strength.color
                          : '#EDE0D8',
                        transition: 'background 0.3s',
                      }} />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.74rem', color: strength.color, fontWeight: 600 }}>{strength.label}</span>
                </div>
              )}
            </div>

            <div>
              <label style={labelStyle}>Confirm Password</label>
              <input type="password" placeholder="Repeat password" value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })} required
                style={{
                  ...inputStyle,
                  borderColor: form.confirm && form.confirm !== form.password ? '#FF4D00' : '#EDE0D8',
                }}
                onFocus={e => e.target.style.borderColor = '#FF4D00'}
                onBlur={e => e.target.style.borderColor = (form.confirm && form.confirm !== form.password) ? '#FF4D00' : '#EDE0D8'} />
              {form.confirm && form.confirm !== form.password && (
                <p style={{ color: '#C0392B', fontSize: '0.76rem', marginTop: 5 }}>⚠️ Passwords don't match</p>
              )}
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
              {loading ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Spinner /> Creating account...</span> : 'Create Account →'}
            </button>
          </form>

          <p style={{ color: '#ccc', fontSize: '0.75rem', textAlign: 'center', marginTop: 18, lineHeight: 1.6 }}>
            By signing up, you agree to our{' '}
            <span style={{ color: '#FF4D00', cursor: 'pointer' }}>Terms of Service</span>
            {' & '}
            <span style={{ color: '#FF4D00', cursor: 'pointer' }}>Privacy Policy</span>
          </p>
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

const labelStyle = { display: 'block', fontWeight: 700, color: '#555', fontSize: '0.83rem', marginBottom: 7 }
const inputStyle = {
  width: '100%', padding: '13px 16px', borderRadius: 12, fontSize: '0.93rem',
  border: '2px solid #EDE0D8', background: '#fff', outline: 'none',
  boxSizing: 'border-box', transition: 'border-color 0.2s', color: '#1A0500',
}
const btnStyle = {
  width: '100%', padding: '14px', borderRadius: 12, border: 'none',
  color: '#fff', fontSize: '0.97rem', fontWeight: 800,
  transition: 'transform 0.2s, box-shadow 0.2s', letterSpacing: 0.3,
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

function getStrength(pass) {
  if (!pass) return { level: 0, color: '#EDE0D8', label: '' }
  if (pass.length < 4) return { level: 1, color: '#EF4444', label: 'Too weak' }
  if (pass.length < 6) return { level: 2, color: '#F97316', label: 'Weak' }
  if (pass.length < 9) return { level: 3, color: '#F59E0B', label: 'Fair' }
  return { level: 4, color: '#10B981', label: 'Strong 💪' }
}

function getFirebaseError(code) {
  switch (code) {
    case 'auth/email-already-in-use': return 'Email already registered'
    case 'auth/invalid-email': return 'Invalid email address'
    case 'auth/weak-password': return 'Password is too weak'
    default: return 'Registration failed. Try again'
  }
}
