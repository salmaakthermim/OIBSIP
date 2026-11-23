import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import api from '../utils/api'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalAmount, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleCheckout = async () => {
    if (!user) return navigate('/login')
    try {
      const { data } = await api.post('/orders', {
        items: cart.map(i => ({ pizza: i.pizzaId, name: i.name, size: i.size, price: i.price, quantity: i.quantity })),
        totalAmount,
        deliveryAddress: { street: '123 Main St', city: 'Dhaka', zip: '1200' },
      })
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: totalAmount * 100,
        currency: 'INR',
        name: 'PizzaHub',
        order_id: data.razorpayOrderId,
        handler: async (response) => {
          await api.post('/orders/verify-payment', {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          })
          clearCart()
          navigate('/orders')
        },
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error(err)
    }
  }

  if (cart.length === 0) return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '2rem' }}>
      <span style={{ fontSize: '5rem' }}>🛒</span>
      <h2 style={{ fontWeight: 800, color: '#1A0500', fontSize: '1.5rem' }}>Your cart is empty</h2>
      <p style={{ color: '#aaa' }}>Add some delicious pizzas to get started!</p>
      <Link to="/menu" style={{
        background: 'linear-gradient(135deg,#FF4D00,#FF8C42)',
        color: '#fff', textDecoration: 'none',
        padding: '12px 32px', borderRadius: 25, fontWeight: 700,
        boxShadow: '0 6px 20px rgba(255,77,0,0.3)',
      }}>Browse Menu 🍕</Link>
    </div>
  )

  return (
    <div style={{ background: '#FFF8F3', minHeight: '100vh', paddingBottom: '4rem' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#1A0500,#3D0A00)', padding: 'clamp(1.5rem,4vw,3rem) 1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, color: '#fff' }}>Your Cart 🛒</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>{cart.length} item{cart.length !== 1 ? 's' : ''} in your order</p>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, alignItems: 'start' }}>

          {/* Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {cart.map(item => {
              const key = `${item.pizzaId}-${item.size}`
              return (
                <div key={key} style={{
                  background: '#fff', borderRadius: 16,
                  padding: '14px 16px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  display: 'flex', alignItems: 'center', gap: 14,
                  animation: 'fadeIn 0.3s ease',
                }}>
                  <div style={{ width: 60, height: 60, borderRadius: 12, background: '#FFF0E6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>🍕</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 800, color: '#1A0500', fontSize: '0.95rem', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                    <p style={{ color: '#aaa', fontSize: '0.78rem', textTransform: 'capitalize' }}>{item.size} size</p>
                    <p style={{ color: '#FF4D00', fontWeight: 800, fontSize: '0.95rem', marginTop: 4 }}>৳{item.price * item.quantity}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <button onClick={() => updateQuantity(item.pizzaId, item.size, item.quantity - 1)} style={{ width: 30, height: 30, borderRadius: 8, border: '2px solid #EDE0D8', background: '#fff', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF4D00' }}>-</button>
                    <span style={{ fontWeight: 800, color: '#1A0500', minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.pizzaId, item.size, item.quantity + 1)} style={{ width: 30, height: 30, borderRadius: 8, border: '2px solid #EDE0D8', background: '#fff', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF4D00' }}>+</button>
                    <button onClick={() => removeFromCart(item.pizzaId, item.size)} style={{ width: 30, height: 30, borderRadius: 8, background: '#FFF0EE', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>🗑️</button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', position: 'sticky', top: 84 }}>
            <h3 style={{ fontWeight: 800, color: '#1A0500', fontSize: '1.15rem', marginBottom: 20 }}>Order Summary</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: '0.9rem' }}>
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>৳{totalAmount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: '0.9rem' }}>
                <span>Delivery fee</span>
                <span style={{ color: '#10B981', fontWeight: 700 }}>FREE</span>
              </div>
              <div style={{ height: 1, background: '#EDE0D8' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 900, color: '#1A0500' }}>
                <span>Total</span>
                <span style={{ color: '#FF4D00' }}>৳{totalAmount}</span>
              </div>
            </div>

            <button onClick={handleCheckout} style={{
              width: '100%', padding: '14px',
              background: 'linear-gradient(135deg,#FF4D00,#FF8C42)',
              color: '#fff', border: 'none', borderRadius: 12,
              fontWeight: 800, fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 6px 24px rgba(255,77,0,0.35)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 10px 32px rgba(255,77,0,0.5)' }}
              onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 6px 24px rgba(255,77,0,0.35)' }}
            >Proceed to Pay 💳</button>

            <Link to="/menu" style={{ display: 'block', textAlign: 'center', marginTop: 14, color: '#FF4D00', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none' }}>
              + Add more items
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
