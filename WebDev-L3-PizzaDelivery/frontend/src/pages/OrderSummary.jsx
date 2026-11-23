import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function OrderSummary() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [quantity, setQuantity] = useState(1)
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  if (!state?.selection) return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <p style={{ fontSize: '3rem' }}>🍕</p>
      <p style={{ color: '#888' }}>No pizza selected. <Link to="/build" style={{ color: '#FF4D00', fontWeight: 700 }}>Build one →</Link></p>
    </div>
  )

  const { selection, totalPrice } = state
  const finalTotal = totalPrice * quantity

  const rows = [
    { label: '🍞 Base', item: selection.base },
    { label: '🍅 Sauce', item: selection.sauce },
    { label: '🧀 Cheese', item: selection.cheese },
    ...selection.vegetables.map(v => ({ label: '🥦 Veggie', item: v })),
  ]

  const handlePay = async () => {
    if (!user) {
      toast.error('Please login to complete your order')
      navigate('/login', { state: { from: '/order-summary' } })
      return
    }

    setLoading(true)
    try {
      // Create order
      const { data } = await api.post('/orders', {
        selectedIngredients: {
          base: selection.base._id,
          sauce: selection.sauce._id,
          cheese: selection.cheese._id,
          vegetables: selection.vegetables.map(v => v._id),
        },
        quantity,
        totalAmount: finalTotal,
      })

      const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || data.keyId

      // Try Razorpay if key is set
      if (razorpayKeyId && razorpayKeyId !== 'your_razorpay_key_id' && data.razorpayOrderId && window.Razorpay) {
        const options = {
          key: razorpayKeyId,
          amount: finalTotal * 100,
          currency: 'INR',
          name: 'PizzaHub',
          description: 'Custom Pizza Order',
          order_id: data.razorpayOrderId,
          handler: async (response) => {
            try {
              await api.post('/orders/verify-payment', {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              })
              toast.success('Order confirmed! 🎉')
              navigate('/orders')
            } catch {
              toast.error('Payment verification failed')
            }
          },
          prefill: { name: '', email: '' },
          theme: { color: '#FF4D00' },
          modal: {
            ondismiss: () => { toast('Payment cancelled'); setLoading(false) }
          }
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
        setLoading(false)
      } else {
        // Mock payment for testing
        await api.post('/orders/mock-payment', { orderId: data.order._id })
        toast.success('Order confirmed! (Test Mode) 🎉')
        navigate('/orders')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#FFF8F3', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div style={{ background: 'linear-gradient(135deg,#1A0500,#3D0A00)', padding: 'clamp(1.5rem,4vw,3rem) 1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, color: '#fff' }}>Order Summary 📋</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>Review your pizza before paying</p>
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Pizza Details */}
        <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', marginBottom: 20 }}>
          <div style={{ background: 'linear-gradient(135deg,#FF4D00,#FF8C42)', padding: '16px 24px' }}>
            <h3 style={{ color: '#fff', fontWeight: 900, margin: 0, fontSize: '1.1rem' }}>🍕 Your Custom Pizza</h3>
          </div>
          <div style={{ padding: '20px 24px' }}>
            {rows.map(({ label, item }, i) => item && (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < rows.length - 1 ? '1px solid #F5EDE8' : 'none' }}>
                <div>
                  <span style={{ color: '#888', fontSize: '0.8rem', fontWeight: 600 }}>{label}</span>
                  <p style={{ color: '#1A0500', fontWeight: 700, margin: '2px 0 0', fontSize: '0.95rem' }}>{item.name}</p>
                </div>
                <span style={{ color: '#FF4D00', fontWeight: 800 }}>+৳{item.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '20px 24px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', marginBottom: 20 }}>
          <p style={{ fontWeight: 800, color: '#1A0500', marginBottom: 14, fontSize: '1rem' }}>Quantity</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: 40, height: 40, borderRadius: 10, border: '2px solid #EDE0D8', background: '#fff', fontSize: '1.2rem', fontWeight: 800, cursor: 'pointer', color: '#FF4D00' }}>−</button>
            <span style={{ fontWeight: 900, fontSize: '1.4rem', color: '#1A0500', minWidth: 32, textAlign: 'center' }}>{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)} style={{ width: 40, height: 40, borderRadius: 10, border: '2px solid #EDE0D8', background: '#fff', fontSize: '1.2rem', fontWeight: 800, cursor: 'pointer', color: '#FF4D00' }}>+</button>
          </div>
        </div>

        {/* Delivery Details */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '20px 24px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', marginBottom: 20 }}>
          <p style={{ fontWeight: 800, color: '#1A0500', marginBottom: 14, fontSize: '1rem' }}>📍 Delivery Address (Optional)</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="text"
              placeholder="House #, Street / Road, Area, City"
              value={address}
              onChange={e => setAddress(e.target.value)}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #EDE0D8', fontSize: '0.9rem', outline: 'none' }}
            />
            <input
              type="tel"
              placeholder="Contact Phone Number (e.g. +880 1712-345678)"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #EDE0D8', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>
        </div>

        {/* Price Summary */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '20px 24px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, color: '#888', fontSize: '0.9rem' }}>
            <span>Pizza price × {quantity}</span>
            <span>৳{totalPrice} × {quantity}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, color: '#888', fontSize: '0.9rem' }}>
            <span>Delivery fee</span>
            <span style={{ color: '#10B981', fontWeight: 700 }}>FREE</span>
          </div>
          <div style={{ height: 1, background: '#EDE0D8', margin: '12px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 900, color: '#1A0500' }}>
            <span>Total</span>
            <span style={{ color: '#FF4D00' }}>৳{finalTotal}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/build" style={{ flex: 1, textAlign: 'center', padding: '14px', borderRadius: 12, border: '2px solid #EDE0D8', background: '#fff', color: '#888', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ← Modify Pizza
          </Link>
          <button onClick={handlePay} disabled={loading} style={{ flex: 2, padding: '14px', borderRadius: 12, border: 'none', background: loading ? '#ccc' : 'linear-gradient(135deg,#FF4D00,#FF8C42)', color: '#fff', fontWeight: 800, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 6px 24px rgba(255,77,0,0.35)' }}>
            {loading ? 'Processing...' : `Confirm & Pay ৳${finalTotal} 💳`}
          </button>
        </div>

        <p style={{ textAlign: 'center', color: '#ccc', fontSize: '0.78rem', marginTop: 16 }}>
          🔒 Secure payment via Razorpay Test Mode
        </p>
      </div>
    </div>
  )
}
