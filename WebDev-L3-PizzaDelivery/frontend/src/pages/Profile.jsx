import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, setUser, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', avatar: '' })

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    Promise.all([
      api.get('/auth/me'),
      api.get('/orders/my').catch(() => ({ data: [] })),
    ])
      .then(([meRes, ordersRes]) => {
        setProfile(meRes.data)
        setForm({
          name: meRes.data.name || '',
          phone: meRes.data.phone || '',
          avatar: meRes.data.avatar || '',
        })
        setOrders(ordersRes.data || [])
      })
      .catch((err) => {
        toast.error('Failed to load profile data')
      })
      .finally(() => setLoading(false))
  }, [user])

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return toast.error('Name cannot be empty')
    setSaving(true)
    try {
      const { data } = await api.put('/auth/profile', {
        name: form.name,
        phone: form.phone,
        avatar: form.avatar,
      })
      setProfile(data)
      if (setUser) {
        setUser(prev => ({ ...prev, name: data.name, phone: data.phone, avatar: data.avatar }))
      }
      // Update local storage user
      const savedUser = JSON.parse(localStorage.getItem('user') || '{}')
      const updatedUser = { ...savedUser, name: data.name, phone: data.phone, avatar: data.avatar }
      localStorage.setItem('user', JSON.stringify(updatedUser))

      toast.success('Profile updated successfully! ✨')
      setEditMode(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 48, height: 48, border: '4px solid #EDE0D8', borderTopColor: '#FF4D00', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#888', fontWeight: 600 }}>Loading profile...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  const u = profile || user

  return (
    <div style={{ background: '#FFF8F3', minHeight: '100vh', paddingBottom: '5rem' }}>
      
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1A0500 0%, #3D0A00 100%)',
        padding: 'clamp(2rem, 5vw, 3.5rem) 1.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          height: 250,
          background: 'radial-gradient(ellipse, rgba(255,77,0,0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: '#fff', margin: 0 }}>
            User Profile 👤
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>
            Manage your personal details, credentials & order history
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 840, margin: '-2.5rem auto 0', padding: '0 1rem', position: 'relative', zIndex: 10 }}>
        
        {/* Main Profile Info Card */}
        <div style={{
          background: '#fff',
          borderRadius: 24,
          padding: '28px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.07)',
          border: '1.5px solid #F5EDE8',
          marginBottom: 24,
        }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              {/* Avatar */}
              <div style={{
                width: 76,
                height: 76,
                borderRadius: '50%',
                background: isAdmin
                  ? 'linear-gradient(135deg, #FF4D00, #E63946)'
                  : 'linear-gradient(135deg, #FF4D00, #FF8C42)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 32,
                fontWeight: 900,
                boxShadow: '0 6px 20px rgba(255,77,0,0.35)',
                border: '3px solid #fff',
                overflow: 'hidden',
                flexShrink: 0,
              }}>
                {u.avatar ? (
                  <img
                    src={u.avatar}
                    alt={u.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                ) : (
                  u.name?.charAt(0).toUpperCase()
                )}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1A0500', margin: 0 }}>
                    {u.name}
                  </h2>
                  <span style={{
                    background: isAdmin ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)',
                    color: isAdmin ? '#EF4444' : '#059669',
                    border: `1.5px solid ${isAdmin ? '#FECACA' : '#A7F3D0'}`,
                    padding: '3px 12px',
                    borderRadius: 20,
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}>
                    {isAdmin ? '🛡️ Administrator' : '👤 Customer'}
                  </span>
                </div>
                <p style={{ color: '#888', fontSize: '0.9rem', margin: '4px 0 0' }}>{u.email}</p>
              </div>
            </div>

            <button
              onClick={() => setEditMode(!editMode)}
              style={{
                background: editMode ? '#FFF0EE' : '#FFF8F4',
                border: `1.5px solid ${editMode ? '#FFCDC8' : '#FF8C42'}`,
                color: editMode ? '#C0392B' : '#FF4D00',
                padding: '9px 18px',
                borderRadius: 12,
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {editMode ? '✕ Cancel Editing' : '✏️ Edit Profile'}
            </button>
          </div>

          {/* Edit Form */}
          {editMode ? (
            <form onSubmit={handleUpdate} style={{
              background: '#FFF8F4',
              borderRadius: 16,
              padding: '20px',
              border: '1.5px dashed #FF8C42',
              marginBottom: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}>
              <h3 style={{ fontWeight: 800, color: '#1A0500', fontSize: '1rem', margin: 0 }}>Edit Your Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#555', marginBottom: 5 }}>Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #EDE0D8', fontSize: '0.92rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#555', marginBottom: 5 }}>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+880 1712-345678"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #EDE0D8', fontSize: '0.92rem', outline: 'none' }}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#555', marginBottom: 5 }}>Profile Picture URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={form.avatar}
                    onChange={e => setForm({ ...form, avatar: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #EDE0D8', fontSize: '0.92rem', outline: 'none' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    background: 'linear-gradient(135deg,#FF4D00,#FF8C42)',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 24px',
                    borderRadius: 10,
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 14px rgba(255,77,0,0.35)',
                  }}
                >
                  {saving ? 'Saving...' : 'Save Profile Changes ✓'}
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
              <div style={{ background: '#FFF8F4', padding: '14px 16px', borderRadius: 14 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>Phone Number</span>
                <p style={{ fontWeight: 800, color: '#1A0500', fontSize: '0.95rem', margin: '4px 0 0' }}>
                  {u.phone || 'Not set (click Edit)'}
                </p>
              </div>

              <div style={{ background: '#FFF8F4', padding: '14px 16px', borderRadius: 14 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>Email Status</span>
                <p style={{ fontWeight: 800, color: u.isEmailVerified ? '#10B981' : '#F59E0B', fontSize: '0.95rem', margin: '4px 0 0' }}>
                  {u.isEmailVerified ? '✓ Verified' : '⚠️ Pending Verification'}
                </p>
              </div>

              <div style={{ background: '#FFF8F4', padding: '14px 16px', borderRadius: 14 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>Orders Placed</span>
                <p style={{ fontWeight: 900, color: '#FF4D00', fontSize: '1.1rem', margin: '4px 0 0' }}>
                  {orders.length} Orders
                </p>
              </div>
            </div>
          )}

          {/* Quick Shortcuts */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', paddingTop: 16, borderTop: '1px solid #F5EDE8' }}>
            <Link
              to="/orders"
              style={{
                flex: 1,
                minWidth: 160,
                textAlign: 'center',
                padding: '12px 18px',
                borderRadius: 12,
                background: '#FFF0E6',
                color: '#FF4D00',
                fontWeight: 800,
                fontSize: '0.88rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              📦 My Orders & Tracking
            </Link>

            <Link
              to="/build"
              style={{
                flex: 1,
                minWidth: 160,
                textAlign: 'center',
                padding: '12px 18px',
                borderRadius: 12,
                background: 'linear-gradient(135deg,#FF4D00,#FF8C42)',
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.88rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 14px rgba(255,77,0,0.3)',
              }}
            >
              🍕 Build Custom Pizza
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                style={{
                  flex: 1,
                  minWidth: 160,
                  textAlign: 'center',
                  padding: '12px 18px',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #1A0500, #3D0A00)',
                  color: '#FF8C42',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                }}
              >
                🛡️ Admin Dashboard
              </Link>
            )}

            <button
              onClick={handleLogout}
              style={{
                padding: '12px 20px',
                borderRadius: 12,
                background: '#FFF0EE',
                border: '1.5px solid #FFCDC8',
                color: '#C0392B',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              Logout 🚪
            </button>
          </div>

        </div>

        {/* Recent Orders Overview */}
        <div style={{
          background: '#fff',
          borderRadius: 24,
          padding: '28px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.07)',
          border: '1.5px solid #F5EDE8',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1A0500', margin: 0 }}>
              Recent Orders ({orders.length})
            </h3>
            <Link to="/orders" style={{ color: '#FF4D00', fontWeight: 800, fontSize: '0.85rem', textDecoration: 'none' }}>
              View All Orders →
            </Link>
          </div>

          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <span style={{ fontSize: '3rem' }}>🍕</span>
              <p style={{ color: '#888', fontWeight: 600, margin: '8px 0 16px' }}>You haven't ordered any pizzas yet</p>
              <Link to="/build" style={{ background: 'linear-gradient(135deg,#FF4D00,#FF8C42)', color: '#fff', padding: '10px 24px', borderRadius: 20, fontWeight: 800, textDecoration: 'none', display: 'inline-block' }}>
                Build Your First Pizza 🚀
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {orders.slice(0, 3).map(order => (
                <div
                  key={order._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderRadius: 14,
                    background: '#FFF8F4',
                    border: '1px solid #EDE0D8',
                    flexWrap: 'wrap',
                    gap: 10,
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 800, color: '#1A0500', fontSize: '0.92rem', margin: 0 }}>
                      Order #{order._id.slice(-6).toUpperCase()}
                    </p>
                    <p style={{ color: '#888', fontSize: '0.75rem', margin: '2px 0 0' }}>
                      {new Date(order.createdAt).toLocaleDateString()} • {order.orderStatus}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ color: '#FF4D00', fontWeight: 900, fontSize: '1rem' }}>৳{order.totalAmount}</span>
                    <Link
                      to="/orders"
                      style={{
                        background: '#fff',
                        border: '1.5px solid #EDE0D8',
                        color: '#555',
                        padding: '6px 12px',
                        borderRadius: 8,
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      Track
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  )
}
