import { useState, useEffect } from 'react'
import api from '../utils/api'

const statusConfig = {
  pending:          { color: '#F59E0B', bg: '#FFFBEB', icon: '⏳', label: 'Pending' },
  confirmed:        { color: '#3B82F6', bg: '#EFF6FF', icon: '✅', label: 'Confirmed' },
  preparing:        { color: '#F97316', bg: '#FFF7ED', icon: '👨‍🍳', label: 'Preparing' },
  'out-for-delivery': { color: '#8B5CF6', bg: '#F5F3FF', icon: '🚴', label: 'On the way' },
  delivered:        { color: '#10B981', bg: '#ECFDF5', icon: '🎉', label: 'Delivered' },
  cancelled:        { color: '#EF4444', bg: '#FEF2F2', icon: '❌', label: 'Cancelled' },
}

export default function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders/my')
      .then(res => setOrders(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 48, height: 48, border: '4px solid #EDE0D8', borderTopColor: '#FF4D00', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#888', fontWeight: 600 }}>Loading your orders...</p>
    </div>
  )

  if (orders.length === 0) return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '2rem' }}>
      <span style={{ fontSize: '5rem' }}>📦</span>
      <h2 style={{ fontWeight: 800, color: '#1A0500', fontSize: '1.5rem' }}>No orders yet</h2>
      <p style={{ color: '#aaa' }}>Start ordering to see your history here!</p>
      <a href="/menu" style={{ background: 'linear-gradient(135deg,#FF4D00,#FF8C42)', color: '#fff', textDecoration: 'none', padding: '12px 32px', borderRadius: 25, fontWeight: 700, boxShadow: '0 6px 20px rgba(255,77,0,0.3)' }}>Order Now 🍕</a>
    </div>
  )

  return (
    <div style={{ background: '#FFF8F3', minHeight: '100vh', paddingBottom: '4rem' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#1A0500,#3D0A00)', padding: 'clamp(1.5rem,4vw,3rem) 1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, color: '#fff' }}>My Orders 📦</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>{orders.length} total order{orders.length !== 1 ? 's' : ''}</p>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {orders.map(order => {
          const st = statusConfig[order.status] || statusConfig.pending
          return (
            <div key={order._id} style={{
              background: '#fff', borderRadius: 20,
              boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
              overflow: 'hidden', animation: 'fadeIn 0.4s ease',
              border: `1px solid ${st.color}22`,
            }}>
              {/* Top bar */}
              <div style={{ background: st.bg, padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{st.icon}</span>
                  <div>
                    <p style={{ fontWeight: 800, color: '#1A0500', fontSize: '0.9rem' }}>Order #{order._id.slice(-6).toUpperCase()}</p>
                    <p style={{ color: '#aaa', fontSize: '0.75rem' }}>{new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <span style={{
                  background: st.color + '22',
                  color: st.color,
                  border: `1.5px solid ${st.color}44`,
                  padding: '5px 14px', borderRadius: 20,
                  fontSize: '0.78rem', fontWeight: 800,
                }}>{st.label}</span>
              </div>

              {/* Items */}
              <div style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                  {order.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 16 }}>🍕</span>
                        <span style={{ color: '#444', fontSize: '0.88rem' }}>
                          {item.name} <span style={{ color: '#aaa', textTransform: 'capitalize' }}>({item.size})</span>
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ color: '#aaa', fontSize: '0.8rem' }}>×{item.quantity}</span>
                        <span style={{ fontWeight: 700, color: '#1A0500', fontSize: '0.88rem' }}>৳{item.price * item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid #EDE0D8', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div>
                      <p style={{ color: '#aaa', fontSize: '0.75rem' }}>Total Paid</p>
                      <p style={{ fontWeight: 900, color: '#FF4D00', fontSize: '1.1rem' }}>৳{order.totalAmount}</p>
                    </div>
                    <div>
                      <p style={{ color: '#aaa', fontSize: '0.75rem' }}>Payment</p>
                      <p style={{ fontWeight: 700, fontSize: '0.85rem', color: order.paymentStatus === 'paid' ? '#10B981' : '#F59E0B', textTransform: 'capitalize' }}>
                        {order.paymentStatus === 'paid' ? '✓ Paid' : '⏳ Pending'}
                      </p>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    {['confirmed', 'preparing', 'out-for-delivery', 'delivered'].map((s, i) => (
                      <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered'].indexOf(order.status) >= i + 1
                            ? '#FF4D00' : '#EDE0D8',
                          transition: 'background 0.3s',
                        }} />
                        {i < 3 && <div style={{ width: 20, height: 2, background: ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered'].indexOf(order.status) >= i + 2 ? '#FF4D00' : '#EDE0D8' }} />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
