import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const PRESET_AVATARS = [
  { label: 'Robot 1', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Panda' },
  { label: 'Chef 1', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Bella' },
  { label: 'Chef 2', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jack' },
  { label: 'Robot 2', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Oliver' },
  { label: 'Gourmet', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Mia' },
]

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', avatar: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const { register, googleSignIn } = useAuth()
  const navigate = useNavigate()

  const strength = getStrength(form.password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) return setError('Passwords do not match')
    if (form.password.length < 6) return setError('Password must be at least 6 characters')
    setLoading(true)
    try {
      const result = await register(form.name, form.email, form.password, form.avatar)
      if (result.autoVerified) {
        // Email not configured — auto verified, store token and redirect
        if (result.token) {
          localStorage.setItem('token', result.token)
          localStorage.setItem('user', JSON.stringify(result.user))
        }
        toast.success('Account created! You can now login.')
        navigate('/login')
      } else {
        setSuccess(true)
        toast.success('Account created! Check your email to verify.')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setGoogleLoading(true)
    try {
      const u = await googleSignIn()
      toast.success(`Welcome to PizzaHub, ${u.name}! 🍕`)
      const dest = u.role === 'admin' ? '/admin' : '/'
      navigate(dest)
    } catch (err) {
      setError(err.message || 'Google sign-in failed. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  }

  if (success) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF8F3', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: 480, background: '#fff', padding: '3rem 2rem', borderRadius: 24, boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
        <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg,#10B981,#059669)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 20px' }}>✓</div>
        <h2 style={{ fontWeight: 900, color: '#1A0500', fontSize: '1.8rem', marginBottom: 12 }}>Account Created! 🎉</h2>
        <p style={{ color: '#888', lineHeight: 1.7, marginBottom: 24 }}>
          We sent a verification link to <strong style={{ color: '#FF4D00' }}>{form.email}</strong>.<br />
          Please check your inbox and click the link to verify your account.
        </p>
        <Link to="/login" style={{ background: 'linear-gradient(135deg,#FF4D00,#FF8C42)', color: '#fff', textDecoration: 'none', padding: '13px 32px', borderRadius: 12, fontWeight: 800, display: 'inline-block' }}>Go to Login →</Link>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* LEFT */}
      <div className="auth-left" style={{ flex: 1, backgroundImage: "url('https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1400&q=90')", backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(145deg, rgba(8,2,0,0.93) 0%, rgba(140,35,0,0.68) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem 2.5rem' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, marginBottom: '2.5rem' }}>
            <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg,#FF4D00,#FF8C42)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🍕</div>
            <span style={{ fontWeight: 900, fontSize: '1.4rem', color: '#fff' }}>Pizza<span style={{ color: '#FF8C42' }}>Hub</span></span>
          </Link>
          <span style={{ background: 'rgba(255,140,66,0.2)', border: '1px solid rgba(255,140,66,0.4)', color: '#FF8C42', fontSize: 11, fontWeight: 700, letterSpacing: 2, padding: '5px 14px', borderRadius: 20, display: 'inline-block', marginBottom: 20 }}>JOIN THE FAMILY</span>
          <h2 style={{ fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 14 }}>Your pizza<br />journey starts<br />here 🚀</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: '1rem' }}>
            {[['🎉', '20% OFF on your first order', '#FF8C42'], ['🚀', '30-min guaranteed delivery', '#10B981'], ['⭐', 'Earn reward points every order', '#F59E0B']].map(([icon, text, color]) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: color + '20', border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>{icon}</div>
                <span style={{ color: 'rgba(255,255,255,0.78)', fontSize: '0.88rem' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div style={{ width: '100%', maxWidth: 500, background: '#FFF8F3', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 420, animation: 'slideUp 0.6s ease', padding: '1rem 0' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.6rem' }} className="mobile-logo">
            <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#FF4D00,#FF8C42)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🍕</div>
            <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#1A0500' }}>Pizza<span style={{ color: '#FF4D00' }}>Hub</span></span>
          </Link>

          <h1 style={{ fontSize: 'clamp(1.6rem,3vw,2.1rem)', fontWeight: 900, color: '#1A0500', marginBottom: 6 }}>Create Account ✨</h1>
          <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '1.6rem' }}>
            Already have one? <Link to="/login" style={{ color: '#FF4D00', fontWeight: 700, textDecoration: 'none' }}>Sign in →</Link>
          </p>

          {error && <div style={{ background: '#FFF0EE', border: '1.5px solid #FFCDC8', color: '#C0392B', padding: '10px 14px', borderRadius: 10, fontSize: '0.85rem', marginBottom: 16 }}>⚠️ {error}</div>}

          {/* Google Sign-in Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 12,
              border: '2px solid #EDE0D8',
              background: '#fff',
              color: '#1A0500',
              fontWeight: 700,
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              cursor: googleLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              transition: 'all 0.2s',
              marginBottom: 16,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#FF4D00'
              e.currentTarget.style.background = '#FFF8F3'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#EDE0D8'
              e.currentTarget.style.background = '#fff'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            {googleLoading ? 'Connecting to Google...' : 'Continue with Google'}
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '14px 0 18px', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: '#EDE0D8' }} />
            <span style={{ color: '#aaa', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>or register with email</span>
            <div style={{ flex: 1, height: 1, background: '#EDE0D8' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Avatar Preview & Selection */}
            <div>
              <label style={labelStyle}>Profile Picture (Avatar)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
                <div style={{
                  width: 54,
                  height: 54,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg,#FF4D00,#FF8C42)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  border: '2px solid #FF8C42',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(255,77,0,0.25)',
                }}>
                  {form.avatar ? (
                    <img
                      src={form.avatar}
                      alt="Avatar Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=Panda' }}
                    />
                  ) : (
                    <span style={{ fontSize: 24, color: '#fff', fontWeight: 900 }}>
                      {form.name ? form.name.charAt(0).toUpperCase() : '🍕'}
                    </span>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <input
                    type="url"
                    placeholder="Paste image URL (optional)"
                    value={form.avatar}
                    onChange={e => setForm({ ...form, avatar: e.target.value })}
                    style={{ ...inputStyle, padding: '10px 14px', fontSize: '0.86rem' }}
                    onFocus={e => e.target.style.borderColor = '#FF4D00'}
                    onBlur={e => e.target.style.borderColor = '#EDE0D8'}
                  />
                </div>
              </div>

              {/* Preset Avatars Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                <span style={{ fontSize: '0.75rem', color: '#888', fontWeight: 600 }}>Presets:</span>
                {PRESET_AVATARS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setForm({ ...form, avatar: p.url })}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      border: form.avatar === p.url ? '2px solid #FF4D00' : '1.5px solid #EDE0D8',
                      padding: 1,
                      background: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      transform: form.avatar === p.url ? 'scale(1.15)' : 'scale(1)',
                      transition: 'all 0.2s',
                    }}
                    title={p.label}
                  >
                    <img src={p.url} alt={p.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
                {form.avatar && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, avatar: '' })}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#999',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      marginLeft: 4,
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div>
              <label style={labelStyle}>Full Name</label>
              <input type="text" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={inputStyle} onFocus={e => e.target.style.borderColor = '#FF4D00'} onBlur={e => e.target.style.borderColor = '#EDE0D8'} />
            </div>
            <div>
              <label style={labelStyle}>Email Address</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required style={inputStyle} onFocus={e => e.target.style.borderColor = '#FF4D00'} onBlur={e => e.target.style.borderColor = '#EDE0D8'} />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required style={{ ...inputStyle, paddingRight: 46 }} onFocus={e => e.target.style.borderColor = '#FF4D00'} onBlur={e => e.target.style.borderColor = '#EDE0D8'} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: 16, color: '#bbb', cursor: 'pointer' }}>{showPass ? '🙈' : '👁️'}</button>
              </div>
              {form.password && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                    {[1,2,3,4].map(i => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength.level ? strength.color : '#EDE0D8', transition: 'background 0.3s' }} />)}
                  </div>
                  <span style={{ fontSize: '0.74rem', color: strength.color, fontWeight: 600 }}>{strength.label}</span>
                </div>
              )}
            </div>
            <div>
              <label style={labelStyle}>Confirm Password</label>
              <input type="password" placeholder="Repeat password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required style={{ ...inputStyle, borderColor: form.confirm && form.confirm !== form.password ? '#FF4D00' : '#EDE0D8' }} onFocus={e => e.target.style.borderColor = '#FF4D00'} onBlur={e => e.target.style.borderColor = (form.confirm && form.confirm !== form.password) ? '#FF4D00' : '#EDE0D8'} />
              {form.confirm && form.confirm !== form.password && <p style={{ color: '#C0392B', fontSize: '0.76rem', marginTop: 5 }}>⚠️ Passwords don't match</p>}
            </div>

            <button type="submit" disabled={loading} style={{ ...btnStyle, background: loading ? '#ccc' : 'linear-gradient(135deg,#FF4D00,#FF8C42)', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 6px 24px rgba(255,77,0,0.35)', marginTop: 4 }}>
              {loading ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Spinner /> Creating account...</span> : 'Create Account →'}
            </button>
          </form>
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

function Spinner() { return <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} /> }

function getStrength(pass) {
  if (!pass) return { level: 0, color: '#EDE0D8', label: '' }
  if (pass.length < 4) return { level: 1, color: '#EF4444', label: 'Too weak' }
  if (pass.length < 6) return { level: 2, color: '#F97316', label: 'Weak' }
  if (pass.length < 9) return { level: 3, color: '#F59E0B', label: 'Fair' }
  return { level: 4, color: '#10B981', label: 'Strong 💪' }
}
