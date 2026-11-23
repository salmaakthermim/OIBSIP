import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleFillDemo = () => {
    setEmail('admin@pizzahub.com')
    setPassword('admin123')
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data } = await api.post('/admin/login', { email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      
      // Update AuthContext state
      await login(email, password)
      
      toast.success('Welcome back, Admin! 🍕')
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.message || 'Admin authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #2D0A00 0%, #0F0300 70%, #050100 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background ambient glow blobs */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '20%',
        width: 450,
        height: 450,
        background: 'radial-gradient(circle, rgba(255,77,0,0.18) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(50px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '15%',
        width: 400,
        height: 400,
        background: 'radial-gradient(circle, rgba(255,140,66,0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(50px)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%',
        maxWidth: 440,
        background: 'rgba(26, 7, 2, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 140, 66, 0.25)',
        borderRadius: 24,
        padding: '2.5rem 2rem',
        boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(255,77,0,0.1)',
        position: 'relative',
        zIndex: 1,
        animation: 'slideUp 0.6s ease',
      }}>
        {/* Header Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 58,
            height: 58,
            background: 'linear-gradient(135deg, #FF4D00, #FF8C42)',
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            margin: '0 auto 16px',
            boxShadow: '0 6px 25px rgba(255,77,0,0.5)',
          }}>
            🛡️
          </div>
          <span style={{
            background: 'rgba(255,140,66,0.15)',
            border: '1px solid rgba(255,140,66,0.35)',
            color: '#FF8C42',
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 2,
            padding: '4px 14px',
            borderRadius: 20,
            display: 'inline-block',
            marginBottom: 10,
          }}>
            RESTRICTED ACCESS
          </span>
          <h1 style={{
            fontSize: '1.8rem',
            fontWeight: 900,
            color: '#fff',
            margin: '4px 0',
            letterSpacing: '-0.5px',
          }}>
            Admin Portal ⚙️
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem' }}>
            PizzaHub Management & Operations Console
          </p>
        </div>

        {/* Demo credentials pill */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px dashed rgba(255,140,66,0.4)',
          borderRadius: 12,
          padding: '12px 14px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
        }}>
          <div>
            <p style={{ color: '#FFD700', fontSize: '0.75rem', fontWeight: 700, margin: 0 }}>
              💡 DEMO CREDENTIALS
            </p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', margin: '2px 0 0' }}>
              admin@pizzahub.com • admin123
            </p>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            style={{
              background: 'rgba(255,77,0,0.2)',
              border: '1px solid rgba(255,77,0,0.4)',
              color: '#FF8C42',
              padding: '6px 12px',
              borderRadius: 8,
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.target.style.background = '#FF4D00'; e.target.style.color = '#fff' }}
            onMouseLeave={e => { e.target.style.background = 'rgba(255,77,0,0.2)'; e.target.style.color = '#FF8C42' }}
          >
            Auto Fill
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.4)',
            color: '#FCA5A5',
            padding: '10px 14px',
            borderRadius: 10,
            fontSize: '0.85rem',
            marginBottom: 18,
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.75)', marginBottom: 6 }}>
              Administrator Email
            </label>
            <input
              type="email"
              placeholder="admin@pizzahub.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 10,
                border: '1.5px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.06)',
                color: '#fff',
                fontSize: '0.92rem',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.2s',
              }}
              onFocus={e => { e.target.style.borderColor = '#FF4D00'; e.target.style.background = 'rgba(255,255,255,0.1)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.background = 'rgba(255,255,255,0.06)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.75)', marginBottom: 6 }}>
              Admin Secret Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 10,
                border: '1.5px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.06)',
                color: '#fff',
                fontSize: '0.92rem',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.2s',
              }}
              onFocus={e => { e.target.style.borderColor = '#FF4D00'; e.target.style.background = 'rgba(255,255,255,0.1)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.background = 'rgba(255,255,255,0.06)' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 8,
              background: loading ? '#666' : 'linear-gradient(135deg, #FF4D00, #FF8C42)',
              color: '#fff',
              border: 'none',
              padding: '14px',
              borderRadius: 12,
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 6px 25px rgba(255,77,0,0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { if (!loading) { e.target.style.transform = 'scale(1.02)'; e.target.style.boxShadow = '0 8px 30px rgba(255,77,0,0.6)' } }}
            onMouseLeave={e => { if (!loading) { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 6px 25px rgba(255,77,0,0.4)' } }}
          >
            {loading ? 'Authenticating...' : 'Enter Admin Console 🚀'}
          </button>
        </form>

        <div style={{
          marginTop: 24,
          paddingTop: 18,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
        }}>
          <Link to="/login" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
            ← Customer Login
          </Link>
          <Link to="/" style={{ color: '#FF8C42', textDecoration: 'none', fontWeight: 700 }}>
            Back to PizzaHub
          </Link>
        </div>
      </div>
    </div>
  )
}
