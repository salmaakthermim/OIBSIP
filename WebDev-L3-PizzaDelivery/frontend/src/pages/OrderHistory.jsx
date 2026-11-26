import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { io } from 'socket.io-client'
import toast from 'react-hot-toast'
import api from '../utils/api'

const STATUS_CONFIG = {
  'Order Received': { color: '#3B82F6', bg: '#EFF6FF', icon: '📋', label: 'Order Received' },
  'In Kitchen':     { color: '#F97316', bg: '#FFF7ED', icon: '👨‍🍳', label: 'In Kitchen' },
  'Sent to Delivery': { color: '#10B981', bg: '#ECFDF5', icon: '🛵', label: 'Sent to Delivery' },
}
const STATUS_ORDER = ['Order Received', 'In Kitchen', 'Sent to Delivery']

export default function OrderHistory() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = useCallback(() => {
    api.get('/orders/my')
      .then(res => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    fetchOrders()

    // Real-time updates via Socket.IO
    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    const socket = io(socketUrl, { transports: ['websocket', 'polling'] })
    socket.on('orderStatusUpdate', ({ orderId, status, order }) => {
      setOrders(prev => {
        const match = prev.find(o => o._id === orderId)
        if (match && match.orderStatus !== status) {
          toast(`Order #${orderId.slice(-6).toUpperCase()} updated to "${status}"! 🛵`, {
            icon: '🍕',
            duration: 4000,
          })
        }
        return prev.map(o => o._id === orderId ? (order || { ...o, orderStatus: status }) : o)
      })
    })

    // Poll every 10 seconds as resilient fallback
    const interval = setInterval(fetchOrders, 10000)
    return () => {
      clearInterval(interval)
      socket.disconnect()
    }
  }, [user, fetchOrders])

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 48, height: 48, border: '4px solid #EDE0D8', borderTopColor: '#FF4D00', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#888', fontWeight: 600 }}>Loading your orders...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (orders.length === 0) return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '2rem' }}>
      <span style={{ fontSize: '5rem' }}>📦</span>
      <h2 style={{ fontWeight: 800, color: '#1A0500', fontSize: '1.5rem' }}>No orders yet</h2>
      <p style={{ color: '#aaa' }}>Build your first custom pizza!</p>
      <Link to="/build" style={{ background: 'linear-gradient(135deg,#FF4D00,#FF8C42)', color: '#fff', textDecoration: 'none', padding: '12px 32px', borderRadius: 25, fontWeight: 700, boxShadow: '0 6px 20px rgba(255,77,0,0.3)' }}>Build a Pizza 🍕</Link>
    </div>
  )

  return (
    <div style={{ background: '#FFF8F3', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div style={{ background: 'linear-gradient(135deg,#1A0500,#3D0A00)', padding: 'clamp(1.5rem,4vw,3rem) 1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, color: '#fff' }}>My Orders 📦</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>{orders.length} total • Auto-refreshes every 10s</p>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {orders.map(order => {
          const st = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG['Order Received']
          const ing = order.selectedIngredients

          return (
            <div key={order._id} style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', overflow: 'hidden', border: `1px solid ${st.color}22`, animation: 'fadeIn 0.4s ease' }}>
              {/* Status bar */}
              <div style={{ background: st.bg, padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{st.icon}</span>
                  <div>
                    <p style={{ fontWeight: 800, color: '#1A0500', fontSize: '0.9rem' }}>Order #{order._id.slice(-6).toUpperCase()}</p>
                    <p style={{ color: '#aaa', fontSize: '0.75rem' }}>{new Date(order.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <span style={{ background: st.color + '22', color: st.color, border: `1.5px solid ${st.color}44`, padding: '5px 14px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 800 }}>{st.label}</span>
              </div>

              {/* Ingredients */}
              <div style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                  {ing?.base && <IngChip label={ing.base.name} icon="🍞" color="#FF4D00" />}
                  {ing?.sauce && <IngChip label={ing.sauce.name} icon="🍅" color="#EF4444" />}
                  {ing?.cheese && <IngChip label={ing.cheese.name} icon="🧀" color="#F59E0B" />}
                  {ing?.vegetables?.map(v => <IngChip key={v._id} label={v.name} icon="🥦" color="#10B981" />)}
                </div>

                {/* Progress tracker */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                    {STATUS_ORDER.map((s, i) => {
                      const idx = STATUS_ORDER.indexOf(order.orderStatus)
                      const done = i <= idx
                      return (
                        <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STATUS_ORDER.length - 1 ? 1 : 'none' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: done ? '#FF4D00' : '#EDE0D8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: done ? '#fff' : '#bbb', fontWeight: 800, transition: 'all 0.3s' }}>
                              {done ? '✓' : i + 1}
                            </div>
                            <span style={{ fontSize: '0.62rem', color: done ? '#FF4D00' : '#bbb', fontWeight: 600, whiteSpace: 'nowrap', maxWidth: 60, textAlign: 'center' }}>{STATUS_CONFIG[s]?.label}</span>
                          </div>
                          {i < STATUS_ORDER.length - 1 && <div style={{ flex: 1, height: 2, background: i < idx ? '#FF4D00' : '#EDE0D8', margin: '0 4px', marginBottom: 18, transition: 'background 0.3s' }} />}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #F5EDE8' }}>
                  <div style={{ display: 'flex', gap: 20 }}>
                    <div>
                      <p style={{ color: '#aaa', fontSize: '0.73rem' }}>Qty</p>
                      <p style={{ fontWeight: 800, color: '#1A0500', fontSize: '0.9rem' }}>×{order.quantity}</p>
                    </div>
                    <div>
                      <p style={{ color: '#aaa', fontSize: '0.73rem' }}>Total</p>
                      <p style={{ fontWeight: 900, color: '#FF4D00', fontSize: '1.1rem' }}>৳{order.totalAmount}</p>
                    </div>
                    <div>
                      <p style={{ color: '#aaa', fontSize: '0.73rem' }}>Payment</p>
                      <p style={{ fontWeight: 700, fontSize: '0.85rem', color: order.paymentStatus === 'paid' ? '#10B981' : '#F59E0B' }}>
                        {order.paymentStatus === 'paid' ? '✓ Paid' : '⏳ Pending'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

function IngChip({ label, icon, color }) {
  return (
    <span style={{ background: color + '12', color, border: `1.5px solid ${color}25`, padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      {icon} {label}
    </span>
  )
}
