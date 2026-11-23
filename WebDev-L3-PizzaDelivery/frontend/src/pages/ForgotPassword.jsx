import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF8F3', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 420, background: '#fff', padding: '2.5rem 2rem', borderRadius: 24, boxShadow: '0 8px 40px rgba(0,0,0,0.08)', animation: 'slideUp 0.6s ease' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, marginBottom: '2rem' }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#FF4D00,#FF8C42)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🍕</div>
          <span style={{ fontWeight: 900, fontSize: '1.2rem', color: '#1A0500' }}>Pizza<span style={{ color: '#FF4D00' }}>Hub</span></span>
        </Link>

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>📧</div>
            <h2 style={{ fontWeight: 900, color: '#1A0500', fontSize: '1.6rem', marginBottom: 10 }}>Check Your Email</h2>
            <p style={{ color: '#888', lineHeight: 1.7, marginBottom: 24 }}>
              We sent a password reset link to <strong style={{ color: '#FF4D00' }}>{email}</strong>.<br />
              The link expires in 1 hour.
            </p>
            <Link to="/login" style={{ color: '#FF4D00', fontWeight: 700, textDecoration: 'none' }}>← Back to Login</Link>
          </div>
        ) : (
          <>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#1A0500', marginBottom: 8 }}>Forgot Password? 🔑</h1>
            <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '1.8rem' }}>Enter your email and we'll send a reset link.</p>

            {error && <div style={{ background: '#FFF0EE', border: '1.5px solid #FFCDC8', color: '#C0392B', padding: '10px 14px', borderRadius: 10, fontSize: '0.85rem', marginBottom: 18 }}>⚠️ {error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, color: '#555', fontSize: '0.83rem', marginBottom: 7 }}>Email Address</label>
                <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required
                  style={{ width: '100%', padding: '13px 16px', borderRadius: 12, fontSize: '0.93rem', border: '2px solid #EDE0D8', background: '#fff', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s', color: '#1A0500' }}
                  onFocus={e => e.target.style.borderColor = '#FF4D00'}
                  onBlur={e => e.target.style.borderColor = '#EDE0D8'} />
              </div>
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: loading ? '#ccc' : 'linear-gradient(135deg,#FF4D00,#FF8C42)', color: '#fff', fontSize: '0.97rem', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 6px 24px rgba(255,77,0,0.3)' }}>
                {loading ? 'Sending...' : 'Send Reset Link →'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.88rem' }}>
              <Link to="/login" style={{ color: '#FF4D00', fontWeight: 700, textDecoration: 'none' }}>← Back to Login</Link>
            </p>
          </>
        )}
        <style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      </div>
    </div>
  )
}
