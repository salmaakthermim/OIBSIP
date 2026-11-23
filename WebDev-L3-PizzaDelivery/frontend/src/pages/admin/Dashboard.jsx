import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const TABS = ['Overview', 'Orders', 'Inventory']

export default function AdminDashboard() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('Overview')
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [stockEdit, setStockEdit] = useState({}) // { id: newValue }

  useEffect(() => {
    if (!user || !isAdmin) { navigate('/login'); return }
    fetchAll()
    const interval = setInterval(fetchAll, 15000)
    return () => clearInterval(interval)
  }, [user])

  const fetchAll = async () => {
    try {
      const [statsRes, ordersRes, invRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/orders'),
        api.get('/admin/inventory'),
      ])
      setStats(statsRes.data)
      setOrders(ordersRes.data)
      setInventory(invRes.data)
    } catch (err) {
      if (err.response?.status === 403) navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.patch(`/admin/orders/${id}/status`, { status })
      setOrders(prev => prev.map(o => o._id === id ? data : o))
      toast.success(`Status updated to "${status}"`)
    } catch {
      toast.error('Failed to update status')
    }
  }

  const updateStock = async (id) => {
    const val = stockEdit[id]
    if (val === undefined || val === '') return toast.error('Enter a stock value')
    const num = parseInt(val)
    if (isNaN(num) || num < 0) return toast.error('Stock must be a non-negative number')
    try {
      const { data } = await api.patch(`/admin/inventory/${id}`, { stock: num })
      setInventory(prev => prev.map(i => i._id === id ? data : i))
      setStockEdit(prev => { const n = { ...prev }; delete n[id]; return n })
      toast.success('Stock updated!')
    } catch {
      toast.error('Failed to update stock')
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F0300' }}>
      <div style={{ textAlign: 'center', color: '#fff' }}>
        <div style={{ width: 48, height: 48, border: '4px solid rgba(255,255,255,0.2)', borderTopColor: '#FF4D00', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
        <p>Loading admin panel...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  const lowStock = inventory.filter(i => i.stock <= i.lowStockThreshold)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F4F1' }}>
      {/* Sidebar */}
      <aside style={{ width: 240, background: 'linear-gradient(180deg,#1A0500,#2D0A00)', flexShrink: 0, display: 'flex', flexDirection: 'column', padding: '1.5rem 0' }} className="admin-sidebar">
        <div style={{ padding: '0 1.5rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#FF4D00,#FF8C42)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🍕</div>
            <div>
              <p style={{ fontWeight: 900, fontSize: '1rem', color: '#fff', margin: 0 }}>PizzaHub</p>
              <p style={{ fontSize: '0.7rem', color: '#FF8C42', margin: 0, fontWeight: 600 }}>Admin Panel</p>
            </div>
          </Link>
        </div>
        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ width: '100%', padding: '12px 1.5rem', background: tab === t ? 'rgba(255,77,0,0.2)' : 'transparent', border: 'none', borderLeft: tab === t ? '3px solid #FF4D00' : '3px solid transparent', color: tab === t ? '#FF8C42' : 'rgba(255,255,255,0.65)', fontWeight: tab === t ? 800 : 600, fontSize: '0.9rem', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 10 }}>
              {t === 'Overview' ? '📊' : t === 'Orders' ? '📦' : '🏪'} {t}
              {t === 'Inventory' && lowStock.length > 0 && <span style={{ background: '#EF4444', color: '#fff', fontSize: 10, fontWeight: 800, padding: '1px 7px', borderRadius: 10, marginLeft: 'auto' }}>{lowStock.length}</span>}
            </button>
          ))}
        </nav>
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#FF4D00,#FF8C42)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 14 }}>{user?.name?.[0]}</div>
            <div>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.82rem', margin: 0 }}>{user?.name}</p>
              <p style={{ color: '#888', fontSize: '0.7rem', margin: 0 }}>Administrator</p>
            </div>
          </div>
          <button onClick={() => { logout(); navigate('/login') }} style={{ width: '100%', padding: '8px', borderRadius: 8, background: 'rgba(255,77,0,0.15)', border: '1px solid rgba(255,77,0,0.3)', color: '#FF8C42', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>Logout</button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflowY: 'auto', padding: 'clamp(1rem,2vw,2rem)' }}>
        {/* Overview */}
        {tab === 'Overview' && (
          <div>
            <h2 style={{ fontWeight: 900, color: '#1A0500', fontSize: '1.6rem', marginBottom: 4 }}>Overview</h2>
            <p style={{ color: '#888', fontSize: '0.88rem', marginBottom: '1.5rem' }}>Auto-refreshes every 15 seconds</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: '2rem' }}>
              {[
                { label: 'Total Orders', value: stats?.totalOrders || 0, icon: '📦', color: '#3B82F6' },
                { label: 'Paid Orders', value: stats?.paidOrders || 0, icon: '✅', color: '#10B981' },
                { label: 'Revenue', value: `৳${stats?.totalRevenue || 0}`, icon: '💰', color: '#FF4D00' },
                { label: 'Low Stock Items', value: stats?.lowStockCount || 0, icon: '⚠️', color: '#EF4444' },
              ].map(card => (
                <div key={card.label} style={{ background: '#fff', borderRadius: 16, padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', borderTop: `4px solid ${card.color}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: '1.6rem' }}>{card.icon}</span>
                    <span style={{ color: card.color, fontWeight: 900, fontSize: '1.6rem' }}>{card.value}</span>
                  </div>
                  <p style={{ color: '#888', fontSize: '0.82rem', fontWeight: 600, margin: 0 }}>{card.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div style={{ background: '#fff', borderRadius: 16, padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontWeight: 800, color: '#1A0500', marginBottom: 16, margin: '0 0 16px' }}>Recent Orders</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #EDE0D8' }}>
                      {['Order ID', 'Customer', 'Amount', 'Payment', 'Status'].map(h => <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#888', fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {(stats?.recentOrders || []).map(o => (
                      <tr key={o._id} style={{ borderBottom: '1px solid #F5EDE8' }}>
                        <td style={{ padding: '12px', fontWeight: 700, color: '#1A0500' }}>#{o._id.slice(-6).toUpperCase()}</td>
                        <td style={{ padding: '12px', color: '#555' }}>{o.user?.name || 'N/A'}</td>
                        <td style={{ padding: '12px', color: '#FF4D00', fontWeight: 800 }}>৳{o.totalAmount}</td>
                        <td style={{ padding: '12px' }}><span style={{ background: '#ECFDF5', color: '#10B981', padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>Paid</span></td>
                        <td style={{ padding: '12px', color: '#3B82F6', fontWeight: 600 }}>{o.orderStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {tab === 'Orders' && (
          <div>
            <h2 style={{ fontWeight: 900, color: '#1A0500', fontSize: '1.6rem', marginBottom: '1.5rem' }}>All Orders</h2>
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg,#FF4D00,#FF8C42)' }}>
                    {['Order ID', 'Customer', 'Pizza', 'Qty', 'Amount', 'Payment', 'Status', 'Update'].map(h => <th key={h} style={{ padding: '14px 14px', textAlign: 'left', color: '#fff', fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => {
                    const ing = order.selectedIngredients
                    return (
                      <tr key={order._id} style={{ borderBottom: '1px solid #F5EDE8' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: '#1A0500', whiteSpace: 'nowrap' }}>#{order._id.slice(-6).toUpperCase()}</td>
                        <td style={{ padding: '12px 14px', color: '#555' }}>
                          <div style={{ fontWeight: 700 }}>{order.user?.name || 'N/A'}</div>
                          <div style={{ color: '#aaa', fontSize: '0.75rem' }}>{order.user?.email}</div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {ing?.base && <span style={chipStyle('#FF4D00')}>🍞 {ing.base.name}</span>}
                            {ing?.sauce && <span style={chipStyle('#EF4444')}>🍅 {ing.sauce.name}</span>}
                            {ing?.cheese && <span style={chipStyle('#F59E0B')}>🧀 {ing.cheese.name}</span>}
                            {ing?.vegetables?.slice(0,2).map(v => <span key={v._id} style={chipStyle('#10B981')}>🥦 {v.name}</span>)}
                            {(ing?.vegetables?.length || 0) > 2 && <span style={chipStyle('#888')}>+{ing.vegetables.length - 2} more</span>}
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: 700 }}>×{order.quantity}</td>
                        <td style={{ padding: '12px 14px', color: '#FF4D00', fontWeight: 900 }}>৳{order.totalAmount}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ background: order.paymentStatus === 'paid' ? '#ECFDF5' : '#FFF7ED', color: order.paymentStatus === 'paid' ? '#10B981' : '#F97316', padding: '4px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>
                            {order.paymentStatus === 'paid' ? '✓ Paid' : '⏳ Pending'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <StatusBadge status={order.orderStatus} />
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <select value={order.orderStatus} onChange={e => updateStatus(order._id, e.target.value)}
                            style={{ padding: '6px 10px', borderRadius: 8, border: '2px solid #EDE0D8', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', background: '#fff', outline: 'none' }}>
                            <option value="Order Received">Order Received</option>
                            <option value="In Kitchen">In Kitchen</option>
                            <option value="Sent to Delivery">Sent to Delivery</option>
                          </select>
                        </td>
                      </tr>
                    )
                  })}
                  {orders.length === 0 && (
                    <tr><td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#aaa' }}>No orders yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Inventory Tab */}
        {tab === 'Inventory' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontWeight: 900, color: '#1A0500', fontSize: '1.6rem', margin: 0 }}>Inventory</h2>
                {lowStock.length > 0 && <p style={{ color: '#EF4444', fontSize: '0.85rem', margin: '4px 0 0', fontWeight: 600 }}>⚠️ {lowStock.length} item(s) need restocking</p>}
              </div>
            </div>

            {/* Category sections */}
            {['base', 'sauce', 'cheese', 'vegetable'].map(cat => {
              const items = inventory.filter(i => i.category === cat)
              return (
                <div key={cat} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: 20, overflow: 'hidden' }}>
                  <div style={{ background: 'linear-gradient(135deg,#1A0500,#3D0A00)', padding: '12px 20px' }}>
                    <h3 style={{ color: '#fff', fontWeight: 800, margin: 0, fontSize: '0.95rem', textTransform: 'capitalize' }}>
                      {cat === 'base' ? '🍞' : cat === 'sauce' ? '🍅' : cat === 'cheese' ? '🧀' : '🥦'} {cat}s ({items.length})
                    </h3>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #EDE0D8', background: '#FFF8F3' }}>
                          {['Name', 'Price', 'Stock', 'Threshold', 'Status', 'Update Stock'].map(h => <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#888', fontWeight: 700 }}>{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {items.map(ing => {
                          const isLow = ing.stock <= ing.lowStockThreshold
                          const isOut = ing.stock === 0
                          return (
                            <tr key={ing._id} style={{ borderBottom: '1px solid #F5EDE8', background: isOut ? '#FFF5F5' : isLow ? '#FFFCF0' : '#fff' }}>
                              <td style={{ padding: '12px 14px', fontWeight: 700, color: '#1A0500' }}>{ing.name}</td>
                              <td style={{ padding: '12px 14px', color: '#FF4D00', fontWeight: 700 }}>৳{ing.price}</td>
                              <td style={{ padding: '12px 14px', fontWeight: 800, color: isOut ? '#EF4444' : isLow ? '#F59E0B' : '#10B981', fontSize: '1rem' }}>{ing.stock}</td>
                              <td style={{ padding: '12px 14px', color: '#888' }}>{ing.lowStockThreshold}</td>
                              <td style={{ padding: '12px 14px' }}>
                                <span style={{ background: isOut ? '#FEF2F2' : isLow ? '#FFFBEB' : '#ECFDF5', color: isOut ? '#EF4444' : isLow ? '#F59E0B' : '#10B981', padding: '4px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                  {isOut ? '❌ Out of stock' : isLow ? '⚠️ Low stock' : '✓ In stock'}
                                </span>
                              </td>
                              <td style={{ padding: '12px 14px' }}>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                  <input
                                    type="number" min="0" placeholder={`${ing.stock}`}
                                    value={stockEdit[ing._id] ?? ''}
                                    onChange={e => setStockEdit(prev => ({ ...prev, [ing._id]: e.target.value }))}
                                    style={{ width: 80, padding: '7px 10px', borderRadius: 8, border: '2px solid #EDE0D8', fontSize: '0.85rem', outline: 'none' }}
                                    onFocus={e => e.target.style.borderColor = '#FF4D00'}
                                    onBlur={e => e.target.style.borderColor = '#EDE0D8'}
                                  />
                                  <button onClick={() => updateStock(ing._id)} style={{ padding: '7px 14px', borderRadius: 8, background: 'linear-gradient(135deg,#FF4D00,#FF8C42)', border: 'none', color: '#fff', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                    Update
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) { .admin-sidebar { display: none; } }
      `}</style>
    </div>
  )
}

function StatusBadge({ status }) {
  const colors = { 'Order Received': '#3B82F6', 'In Kitchen': '#F97316', 'Sent to Delivery': '#10B981' }
  const c = colors[status] || '#888'
  return <span style={{ background: c + '15', color: c, border: `1.5px solid ${c}30`, padding: '4px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap' }}>{status}</span>
}

const chipStyle = (color) => ({ background: color + '12', color, border: `1px solid ${color}25`, padding: '2px 8px', borderRadius: 12, fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap', display: 'inline-block' })
