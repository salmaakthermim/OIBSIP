import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import api from '../utils/api'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('loading') // loading | success | error
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) { setStatus('error'); setMessage('No verification token found'); return }

    api.get(`/auth/verify-email?token=${token}`)
      .then(res => { setStatus('success'); setMessage(res.data.message) })
      .catch(err => { setStatus('error'); setMessage(err.response?.data?.message || 'Verification failed') })
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF8F3', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: 440, background: '#fff', padding: '3rem 2rem', borderRadius: 24, boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
        {status === 'loading' && (
          <>
            <div style={{ width: 60, height: 60, border: '4px solid #EDE0D8', borderTopColor: '#FF4D00', borderRadius: '50%', margin: '0 auto 20px', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: '#888', fontWeight: 600 }}>Verifying your email...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg,#10B981,#059669)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 20px' }}>✓</div>
            <h2 style={{ fontWeight: 900, color: '#1A0500', fontSize: '1.8rem', marginBottom: 12 }}>Email Verified! 🎉</h2>
            <p style={{ color: '#888', marginBottom: 24 }}>{message}</p>
            <Link to="/login" style={{ background: 'linear-gradient(135deg,#FF4D00,#FF8C42)', color: '#fff', textDecoration: 'none', padding: '13px 32px', borderRadius: 12, fontWeight: 800, display: 'inline-block' }}>Login Now →</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg,#EF4444,#DC2626)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 20px' }}>✕</div>
            <h2 style={{ fontWeight: 900, color: '#1A0500', fontSize: '1.8rem', marginBottom: 12 }}>Verification Failed</h2>
            <p style={{ color: '#888', marginBottom: 24 }}>{message}</p>
            <Link to="/register" style={{ background: 'linear-gradient(135deg,#FF4D00,#FF8C42)', color: '#fff', textDecoration: 'none', padding: '13px 32px', borderRadius: 12, fontWeight: 800, display: 'inline-block' }}>Register Again →</Link>
          </>
        )}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )
}
