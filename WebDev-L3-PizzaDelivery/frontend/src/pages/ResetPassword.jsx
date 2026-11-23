import { useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) return setError('Passwords do not match')
    if (form.password.length < 6) return setError('Password must be at least 6 characters')
    setLoading(true)
    try {
      await api.post('/auth/reset-password', { token, password: form.password })
      toast.success('Password reset successfully!')
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. Link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF8F3' }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ fontSize: '3rem' }}>⚠️</p>
        <p style={{ color: '#888', fontWeight: 600 }}>Invalid reset link. <Link to="/forgot-password" style={{ color: '#FF4D00' }}>Request a new one</Link>.</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF8F3', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 420, background: '#fff', padding: '2.5rem 2rem', borderRadius: 24, boxShadow: '0 8px 40px rgba(0,0,0,0.08)', animation: 'slideUp 0.6s ease' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, marginBottom: '2rem' }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#FF4D00,#FF8C42)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🍕</div>
          <span style={{ fontWeight: 900, fontSize: '1.2rem', color: '#1A0500' }}>Pizza<span style={{ color: '#FF4D00' }}>Hub</span></span>
        </Link>

        <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#1A0500', marginBottom: 8 }}>Set New Password 🔒</h1>
        <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '1.8rem' }}>Choose a strong new password for your account.</p>

        {error && <div style={{ background: '#FFF0EE', border: '1.5px solid #FFCDC8', color: '#C0392B', padding: '10px 14px', borderRadius: 10, fontSize: '0.85rem', marginBottom: 18 }}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontWeight: 700, color: '#555', fontSize: '0.83rem', marginBottom: 7 }}>New Password</label>
            <input type="password" placeholder="Min. 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required
              style={inputStyle} onFocus={e => e.target.style.borderColor = '#FF4D00'} onBlur={e => e.target.style.borderColor = '#EDE0D8'} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 700, color: '#555', fontSize: '0.83rem', marginBottom: 7 }}>Confirm Password</label>
            <input type="password" placeholder="Repeat password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required
              style={inputStyle} onFocus={e => e.target.style.borderColor = '#FF4D00'} onBlur={e => e.target.style.borderColor = '#EDE0D8'} />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: loading ? '#ccc' : 'linear-gradient(135deg,#FF4D00,#FF8C42)', color: '#fff', fontSize: '0.97rem', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Resetting...' : 'Reset Password →'}
          </button>
        </form>
        <style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      </div>
    </div>
  )
}

const inputStyle = { width: '100%', padding: '13px 16px', borderRadius: 12, fontSize: '0.93rem', border: '2px solid #EDE0D8', background: '#fff', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s', color: '#1A0500' }
