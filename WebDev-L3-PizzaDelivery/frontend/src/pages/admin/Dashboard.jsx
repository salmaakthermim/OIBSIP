import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { io } from 'socket.io-client'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const TABS = ['Overview', 'Orders', 'Inventory', 'Pizzas']

export default function AdminDashboard() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('Overview')
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [inventory, setInventory] = useState([])
  const [pizzas, setPizzas] = useState([])
  const [loading, setLoading] = useState(true)
  const [stockEdit, setStockEdit] = useState({}) // { id: newValue }
  const [thresholdEdit, setThresholdEdit] = useState({})
  const [orderFilter, setOrderFilter] = useState('All')
  const [orderSearch, setOrderSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  
  // Add ingredient modal state
  const [showAddModal, setShowAddModal] = useState(false)
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    category: 'base',
    price: 50,
    stock: 100,
    lowStockThreshold: 20,
  })
  const [addingIngredient, setAddingIngredient] = useState(false)
  const [checkingStock, setCheckingStock] = useState(false)

  // Add pizza modal state
  const [showAddPizzaModal, setShowAddPizzaModal] = useState(false)
  const [newPizza, setNewPizza] = useState({
    name: '',
    description: '',
    category: 'veg',
    basePrice: 299,
    image: '',
    ingredients: '',
  })
  const [addingPizza, setAddingPizza] = useState(false)

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/admin/login')
      return
    }
    fetchAll()
    const interval = setInterval(fetchAll, 15000)
    return () => clearInterval(interval)
  }, [user, isAdmin])

  // Real-time updates via Socket.IO
  useEffect(() => {
    if (!user || !isAdmin) return
    const socket = io('http://localhost:5000')

    socket.on('newOrder', (newOrder) => {
      toast('🔔 New Order Received #' + newOrder._id.slice(-6).toUpperCase(), {
        icon: '🍕',
        duration: 4000,
      })
      setOrders(prev => [newOrder, ...prev.filter(o => o._id !== newOrder._id)])
      api.get('/admin/dashboard').then(res => setStats(res.data)).catch(console.error)
    })

    socket.on('orderStatusUpdate', ({ orderId, status, order }) => {
      setOrders(prev => prev.map(o => o._id === orderId ? (order || { ...o, orderStatus: status }) : o))
    })

    return () => socket.disconnect()
  }, [user, isAdmin])

  const fetchAll = async () => {
    try {
      const [statsRes, ordersRes, invRes, pizzasRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/orders'),
        api.get('/admin/inventory'),
        api.get('/pizzas?all=true').catch(() => ({ data: [] })),
      ])
      setStats(statsRes.data)
      setOrders(ordersRes.data)
      setInventory(invRes.data)
      setPizzas(pizzasRes.data || [])
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 401) {
        navigate('/admin/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddPizza = async (e) => {
    e.preventDefault()
    if (!newPizza.name.trim() || !newPizza.description.trim()) {
      return toast.error('Name and description are required')
    }
    setAddingPizza(true)
    try {
      const ingredientsArray = newPizza.ingredients
        ? newPizza.ingredients.split(',').map(s => s.trim()).filter(Boolean)
        : []
      await api.post('/pizzas', {
        ...newPizza,
        basePrice: Number(newPizza.basePrice) || 299,
        ingredients: ingredientsArray,
      })
      toast.success('Pizza added to menu successfully! 🍕')
      setShowAddPizzaModal(false)
      setNewPizza({ name: '', description: '', category: 'veg', basePrice: 299, image: '', ingredients: '' })
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add pizza')
    } finally {
      setAddingPizza(false)
    }
  }

  const handleTogglePizzaAvailability = async (id, currentStatus) => {
    try {
      await api.put(`/pizzas/${id}`, { isAvailable: !currentStatus, isActive: !currentStatus })
      setPizzas(prev => prev.map(p => p._id === id ? { ...p, isAvailable: !currentStatus, isActive: !currentStatus } : p))
      toast.success(`Pizza marked as ${!currentStatus ? 'Available' : 'Unavailable'}`)
    } catch {
      toast.error('Failed to update pizza availability')
    }
  }

  const handleDeletePizza = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pizza?')) return
    try {
      await api.delete(`/pizzas/${id}`)
      setPizzas(prev => prev.filter(p => p._id !== id))
      toast.success('Pizza removed from menu')
    } catch {
      toast.error('Failed to delete pizza')
    }
  }

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.patch(`/admin/orders/${id}/status`, { status })
      setOrders(prev => prev.map(o => o._id === id ? data : o))
      toast.success(`Status updated to "${status}"`)
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder(data)
      }
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

  const updateThreshold = async (id) => {
    const val = thresholdEdit[id]
    if (val === undefined || val === '') return toast.error('Enter a threshold')
    const num = parseInt(val)
    if (isNaN(num) || num < 1) return toast.error('Threshold must be at least 1')
    try {
      const { data } = await api.patch(`/admin/inventory/${id}`, { lowStockThreshold: num })
      setInventory(prev => prev.map(i => i._id === id ? data : i))
      setThresholdEdit(prev => { const n = { ...prev }; delete n[id]; return n })
      toast.success('Low-stock threshold updated!')
    } catch {
      toast.error('Failed to update threshold')
    }
  }

  const handleAddIngredient = async (e) => {
    e.preventDefault()
    if (!newIngredient.name.trim()) return toast.error('Ingredient name is required')
    setAddingIngredient(true)
    try {
      const { data } = await api.post('/admin/inventory', newIngredient)
      setInventory(prev => [...prev, data])
      toast.success(`Added ${data.name} to ${data.category}!`)
      setShowAddModal(false)
      setNewIngredient({ name: '', category: 'base', price: 50, stock: 100, lowStockThreshold: 20 })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add ingredient')
    } finally {
      setAddingIngredient(false)
    }
  }

  const handleTriggerStockCheck = async () => {
    setCheckingStock(true)
    try {
      const { data } = await api.post('/admin/inventory/check-stock')
      toast.success(data.message || 'Stock check completed successfully!', { duration: 4000 })
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Stock check failed')
    } finally {
      setCheckingStock(false)
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F0300' }}>
      <div style={{ textAlign: 'center', color: '#fff' }}>
        <div style={{ width: 48, height: 48, border: '4px solid rgba(255,255,255,0.2)', borderTopColor: '#FF4D00', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ fontWeight: 600 }}>Loading admin console...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  const lowStock = inventory.filter(i => i.stock <= i.lowStockThreshold)

  const filteredOrders = orders.filter(o => {
    const matchesFilter = orderFilter === 'All' || o.orderStatus === orderFilter
    const searchLower = orderSearch.toLowerCase()
    const matchesSearch = !orderSearch ||
      o._id.toLowerCase().includes(searchLower) ||
      o.user?.name?.toLowerCase().includes(searchLower) ||
      o.user?.email?.toLowerCase().includes(searchLower)
    return matchesFilter && matchesSearch
  })

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F4F1' }} className="admin-container">
      {/* Sidebar */}
      <aside style={{
        width: 250,
        background: 'linear-gradient(180deg,#1A0500,#2D0A00)',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 0',
      }} className="admin-sidebar">
        <div style={{ padding: '0 1.5rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,#FF4D00,#FF8C42)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 4px 12px rgba(255,77,0,0.4)' }}>🛡️</div>
            <div>
              <p style={{ fontWeight: 900, fontSize: '1.05rem', color: '#fff', margin: 0 }}>Pizza<span style={{ color: '#FF8C42' }}>Hub</span></p>
              <p style={{ fontSize: '0.68rem', color: '#FF8C42', margin: 0, fontWeight: 700, letterSpacing: 1 }}>ADMIN CONSOLE</p>
            </div>
          </Link>
        </div>

        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                width: '100%',
                padding: '13px 1.5rem',
                background: tab === t ? 'rgba(255,77,0,0.2)' : 'transparent',
                border: 'none',
                borderLeft: tab === t ? '4px solid #FF4D00' : '4px solid transparent',
                color: tab === t ? '#FF8C42' : 'rgba(255,255,255,0.7)',
                fontWeight: tab === t ? 800 : 600,
                fontSize: '0.92rem',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              {t === 'Overview' ? '📊' : t === 'Orders' ? '📦' : t === 'Inventory' ? '🏪' : '🍕'} {t}
              {t === 'Inventory' && lowStock.length > 0 && (
                <span style={{ background: '#EF4444', color: '#fff', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 10, marginLeft: 'auto' }}>
                  {lowStock.length}
                </span>
              )}
              {t === 'Pizzas' && (
                <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10, marginLeft: 'auto' }}>
                  {pizzas.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#FF4D00,#FF8C42)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 14 }}>
              {user?.name?.[0]}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.82rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</p>
              <p style={{ color: '#FF8C42', fontSize: '0.7rem', margin: 0, fontWeight: 600 }}>Super Admin</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate('/admin/login') }}
            style={{
              width: '100%',
              padding: '9px',
              borderRadius: 8,
              background: 'rgba(255,77,0,0.15)',
              border: '1px solid rgba(255,77,0,0.3)',
              color: '#FF8C42',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.target.style.background = '#FF4D00'; e.target.style.color = '#fff' }}
            onMouseLeave={e => { e.target.style.background = 'rgba(255,77,0,0.15)'; e.target.style.color = '#FF8C42' }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, overflowY: 'auto', padding: 'clamp(1rem,2.5vw,2.5rem)' }}>

        {/* Top bar info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FF4D00', letterSpacing: 1.5, textTransform: 'uppercase' }}>
              PIZZAHUB OPERATIONS
            </span>
            <h1 style={{ fontWeight: 900, color: '#1A0500', fontSize: '1.8rem', margin: '2px 0 0' }}>
              {tab === 'Overview' ? 'Business Overview 📊' : tab === 'Orders' ? 'Order Management 📦' : tab === 'Inventory' ? 'Inventory Management 🏪' : 'Pizza Menu Management 🍕'}
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#059669', padding: '6px 14px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
              Live Socket Connected
            </span>
            <Link to="/" style={{ background: '#fff', border: '1.5px solid #EDE0D8', color: '#555', padding: '6px 14px', borderRadius: 10, fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}>
              View Storefront 🍕
            </Link>
          </div>
        </div>

        {/* ════════════ OVERVIEW TAB ════════════ */}
        {tab === 'Overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginBottom: '2rem' }}>
              {[
                { label: 'Total Orders', value: stats?.totalOrders || 0, icon: '📦', color: '#3B82F6', desc: 'All time placements' },
                { label: 'Paid Orders', value: stats?.paidOrders || 0, icon: '✅', color: '#10B981', desc: 'Confirmed & paid' },
                { label: 'Total Revenue', value: `৳${stats?.totalRevenue || 0}`, icon: '💰', color: '#FF4D00', desc: 'Completed transactions' },
                { label: 'Low Stock Alert', value: stats?.lowStockCount || 0, icon: '⚠️', color: '#EF4444', desc: 'Below safety threshold' },
              ].map(card => (
                <div key={card.label} style={{ background: '#fff', borderRadius: 18, padding: '22px 20px', boxShadow: '0 3px 16px rgba(0,0,0,0.05)', borderTop: `4px solid ${card.color}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: '1.8rem' }}>{card.icon}</span>
                    <span style={{ color: card.color, fontWeight: 900, fontSize: '1.7rem' }}>{card.value}</span>
                  </div>
                  <p style={{ color: '#1A0500', fontSize: '0.9rem', fontWeight: 800, margin: 0 }}>{card.label}</p>
                  <p style={{ color: '#aaa', fontSize: '0.75rem', margin: '4px 0 0' }}>{card.desc}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions & Recent Orders */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
              {/* Recent Orders List */}
              <div style={{ background: '#fff', borderRadius: 18, padding: '24px', boxShadow: '0 3px 16px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontWeight: 800, color: '#1A0500', margin: 0, fontSize: '1.1rem' }}>Recent Orders</h3>
                  <button onClick={() => setTab('Orders')} style={{ background: 'transparent', border: 'none', color: '#FF4D00', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>View All →</button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #EDE0D8' }}>
                        {['Order ID', 'Customer', 'Amount', 'Status', 'Action'].map(h => (
                          <th key={h} style={{ padding: '10px 10px', textAlign: 'left', color: '#888', fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(stats?.recentOrders || []).map(o => (
                        <tr key={o._id} style={{ borderBottom: '1px solid #F5EDE8' }}>
                          <td style={{ padding: '12px 10px', fontWeight: 700, color: '#1A0500' }}>#{o._id.slice(-6).toUpperCase()}</td>
                          <td style={{ padding: '12px 10px', color: '#555' }}>{o.user?.name || 'Customer'}</td>
                          <td style={{ padding: '12px 10px', color: '#FF4D00', fontWeight: 800 }}>৳{o.totalAmount}</td>
                          <td style={{ padding: '12px 10px' }}><StatusBadge status={o.orderStatus} /></td>
                          <td style={{ padding: '12px 10px' }}>
                            <button onClick={() => setSelectedOrder(o)} style={{ background: '#FFF0E6', border: 'none', color: '#FF4D00', padding: '4px 10px', borderRadius: 6, fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                      {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                        <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#aaa' }}>No recent orders</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Low Stock Watchlist */}
              <div style={{ background: '#fff', borderRadius: 18, padding: '24px', boxShadow: '0 3px 16px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontWeight: 800, color: '#1A0500', margin: 0, fontSize: '1.1rem' }}>Low Stock Watchlist ⚠️</h3>
                  <button onClick={handleTriggerStockCheck} disabled={checkingStock} style={{ background: '#FFF0EE', border: '1px solid #FCA5A5', color: '#DC2626', padding: '5px 12px', borderRadius: 8, fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>
                    {checkingStock ? 'Checking...' : 'Run Email Check'}
                  </button>
                </div>
                {lowStock.length === 0 ? (
                  <div style={{ padding: '2.5rem', textAlign: 'center', color: '#10B981' }}>
                    <span style={{ fontSize: '2.5rem' }}>✅</span>
                    <p style={{ fontWeight: 700, marginTop: 8 }}>All stock levels healthy!</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {lowStock.slice(0, 5).map(item => (
                      <div key={item._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, background: '#FFF5F5', border: '1px solid #FECACA' }}>
                        <div>
                          <p style={{ fontWeight: 700, color: '#1A0500', margin: 0, fontSize: '0.88rem' }}>{item.name}</p>
                          <p style={{ color: '#888', fontSize: '0.75rem', margin: '2px 0 0', textTransform: 'capitalize' }}>{item.category}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ color: '#EF4444', fontWeight: 900, fontSize: '0.95rem' }}>{item.stock} left</span>
                          <p style={{ color: '#aaa', fontSize: '0.7rem', margin: 0 }}>Threshold: {item.lowStockThreshold}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════════════ ORDERS TAB ════════════ */}
        {tab === 'Orders' && (
          <div>
            {/* Filter and search bar */}
            <div style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['All', 'Order Received', 'In Kitchen', 'Sent to Delivery'].map(f => (
                  <button
                    key={f}
                    onClick={() => setOrderFilter(f)}
                    style={{
                      padding: '7px 16px',
                      borderRadius: 20,
                      border: `1.5px solid ${orderFilter === f ? '#FF4D00' : '#EDE0D8'}`,
                      background: orderFilter === f ? '#FF4D00' : '#fff',
                      color: orderFilter === f ? '#fff' : '#666',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Search by ID or customer..."
                value={orderSearch}
                onChange={e => setOrderSearch(e.target.value)}
                style={{
                  padding: '9px 14px',
                  borderRadius: 10,
                  border: '1.5px solid #EDE0D8',
                  fontSize: '0.85rem',
                  outline: 'none',
                  minWidth: 220,
                }}
              />
            </div>

            {/* Orders Table */}
            <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 3px 16px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg,#FF4D00,#FF8C42)' }}>
                    {['Order ID', 'Customer', 'Pizza Ingredients', 'Qty', 'Amount', 'Payment', 'Status', 'Change Status', 'Details'].map(h => (
                      <th key={h} style={{ padding: '14px 14px', textAlign: 'left', color: '#fff', fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => {
                    const ing = order.selectedIngredients
                    return (
                      <tr key={order._id} style={{ borderBottom: '1px solid #F5EDE8' }}>
                        <td style={{ padding: '14px', fontWeight: 700, color: '#1A0500', whiteSpace: 'nowrap' }}>
                          #{order._id.slice(-6).toUpperCase()}
                        </td>
                        <td style={{ padding: '14px', color: '#555' }}>
                          <div style={{ fontWeight: 700 }}>{order.user?.name || 'N/A'}</div>
                          <div style={{ color: '#aaa', fontSize: '0.75rem' }}>{order.user?.email}</div>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxWidth: 280 }}>
                            {ing?.base && <span style={chipStyle('#FF4D00')}>🍞 {ing.base.name}</span>}
                            {ing?.sauce && <span style={chipStyle('#EF4444')}>🍅 {ing.sauce.name}</span>}
                            {ing?.cheese && <span style={chipStyle('#F59E0B')}>🧀 {ing.cheese.name}</span>}
                            {ing?.vegetables?.slice(0, 2).map(v => <span key={v._id} style={chipStyle('#10B981')}>🥦 {v.name}</span>)}
                            {(ing?.vegetables?.length || 0) > 2 && <span style={chipStyle('#888')}>+{ing.vegetables.length - 2} more</span>}
                          </div>
                        </td>
                        <td style={{ padding: '14px', fontWeight: 700 }}>×{order.quantity}</td>
                        <td style={{ padding: '14px', color: '#FF4D00', fontWeight: 900, whiteSpace: 'nowrap' }}>৳{order.totalAmount}</td>
                        <td style={{ padding: '14px', whiteSpace: 'nowrap' }}>
                          <span style={{
                            background: order.paymentStatus === 'paid' ? '#ECFDF5' : '#FFF7ED',
                            color: order.paymentStatus === 'paid' ? '#10B981' : '#F97316',
                            padding: '4px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700,
                          }}>
                            {order.paymentStatus === 'paid' ? '✓ Paid' : '⏳ Pending'}
                          </span>
                        </td>
                        <td style={{ padding: '14px', whiteSpace: 'nowrap' }}>
                          <StatusBadge status={order.orderStatus} />
                        </td>
                        <td style={{ padding: '14px' }}>
                          <select
                            value={order.orderStatus}
                            onChange={e => updateStatus(order._id, e.target.value)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: 8,
                              border: '2px solid #EDE0D8',
                              fontSize: '0.82rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              background: '#fff',
                              outline: 'none',
                            }}
                          >
                            <option value="Order Received">Order Received</option>
                            <option value="In Kitchen">In Kitchen</option>
                            <option value="Sent to Delivery">Sent to Delivery</option>
                          </select>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            style={{
                              background: '#FFF0E6',
                              border: 'none',
                              color: '#FF4D00',
                              padding: '6px 12px',
                              borderRadius: 8,
                              fontWeight: 700,
                              fontSize: '0.78rem',
                              cursor: 'pointer',
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={9} style={{ padding: '3rem', textAlign: 'center', color: '#aaa' }}>
                        No orders match your filter
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ════════════ INVENTORY TAB ════════════ */}
        {tab === 'Inventory' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: '1.5rem' }}>
              <div>
                <p style={{ color: '#888', fontSize: '0.85rem', margin: 0 }}>
                  Manage pizza bases, sauces, cheeses and vegetables in real-time.
                </p>
                {lowStock.length > 0 && (
                  <p style={{ color: '#EF4444', fontSize: '0.85rem', margin: '4px 0 0', fontWeight: 700 }}>
                    ⚠️ {lowStock.length} item(s) below safety threshold!
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  onClick={handleTriggerStockCheck}
                  disabled={checkingStock}
                  style={{
                    background: '#FFF0EE',
                    border: '1.5px solid #FCA5A5',
                    color: '#DC2626',
                    padding: '10px 18px',
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  📧 {checkingStock ? 'Checking...' : 'Trigger Low-Stock Alert'}
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  style={{
                    background: 'linear-gradient(135deg,#FF4D00,#FF8C42)',
                    border: 'none',
                    color: '#fff',
                    padding: '10px 20px',
                    borderRadius: 10,
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(255,77,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  + Add Ingredient
                </button>
              </div>
            </div>

            {/* Category sections */}
            {['base', 'sauce', 'cheese', 'vegetable'].map(cat => {
              const items = inventory.filter(i => i.category === cat)
              return (
                <div key={cat} style={{ background: '#fff', borderRadius: 18, boxShadow: '0 3px 16px rgba(0,0,0,0.05)', marginBottom: 24, overflow: 'hidden' }}>
                  <div style={{ background: 'linear-gradient(135deg,#1A0500,#3D0A00)', padding: '14px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ color: '#fff', fontWeight: 800, margin: 0, fontSize: '1rem', textTransform: 'capitalize' }}>
                      {cat === 'base' ? '🍞' : cat === 'sauce' ? '🍅' : cat === 'cheese' ? '🧀' : '🥦'} {cat} Options ({items.length})
                    </h3>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #EDE0D8', background: '#FFF8F3' }}>
                          {['Ingredient Name', 'Unit Price', 'Current Stock', 'Stock Status', 'Update Stock Qty', 'Low-Stock Threshold'].map(h => (
                            <th key={h} style={{ padding: '11px 16px', textAlign: 'left', color: '#888', fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {items.map(ing => {
                          const isLow = ing.stock <= ing.lowStockThreshold
                          const isOut = ing.stock === 0
                          return (
                            <tr key={ing._id} style={{ borderBottom: '1px solid #F5EDE8', background: isOut ? '#FFF5F5' : isLow ? '#FFFCF0' : '#fff' }}>
                              <td style={{ padding: '13px 16px', fontWeight: 700, color: '#1A0500' }}>{ing.name}</td>
                              <td style={{ padding: '13px 16px', color: '#FF4D00', fontWeight: 800 }}>৳{ing.price}</td>
                              <td style={{ padding: '13px 16px', fontWeight: 900, color: isOut ? '#EF4444' : isLow ? '#F59E0B' : '#10B981', fontSize: '1.05rem' }}>
                                {ing.stock}
                              </td>
                              <td style={{ padding: '13px 16px' }}>
                                <span style={{
                                  background: isOut ? '#FEF2F2' : isLow ? '#FFFBEB' : '#ECFDF5',
                                  color: isOut ? '#EF4444' : isLow ? '#F59E0B' : '#10B981',
                                  padding: '4px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap',
                                }}>
                                  {isOut ? '❌ Out of stock' : isLow ? '⚠️ Low stock' : '✓ In stock'}
                                </span>
                              </td>
                              <td style={{ padding: '13px 16px' }}>
                                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                  <input
                                    type="number"
                                    min="0"
                                    placeholder={`${ing.stock}`}
                                    value={stockEdit[ing._id] ?? ''}
                                    onChange={e => setStockEdit(prev => ({ ...prev, [ing._id]: e.target.value }))}
                                    style={{ width: 75, padding: '7px 9px', borderRadius: 8, border: '1.5px solid #EDE0D8', fontSize: '0.85rem', outline: 'none' }}
                                    onFocus={e => e.target.style.borderColor = '#FF4D00'}
                                    onBlur={e => e.target.style.borderColor = '#EDE0D8'}
                                  />
                                  <button
                                    onClick={() => updateStock(ing._id)}
                                    style={{ padding: '7px 12px', borderRadius: 8, background: 'linear-gradient(135deg,#FF4D00,#FF8C42)', border: 'none', color: '#fff', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                                  >
                                    Save
                                  </button>
                                </div>
                              </td>
                              <td style={{ padding: '13px 16px' }}>
                                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                  <input
                                    type="number"
                                    min="1"
                                    placeholder={`${ing.lowStockThreshold}`}
                                    value={thresholdEdit[ing._id] ?? ''}
                                    onChange={e => setThresholdEdit(prev => ({ ...prev, [ing._id]: e.target.value }))}
                                    style={{ width: 65, padding: '7px 9px', borderRadius: 8, border: '1.5px solid #EDE0D8', fontSize: '0.85rem', outline: 'none' }}
                                    onFocus={e => e.target.style.borderColor = '#FF4D00'}
                                    onBlur={e => e.target.style.borderColor = '#EDE0D8'}
                                  />
                                  <button
                                    onClick={() => updateThreshold(ing._id)}
                                    style={{ padding: '7px 10px', borderRadius: 8, background: '#FFF0E6', border: '1px solid #FFCDC8', color: '#FF4D00', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                                  >
                                    Set
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

        {/* ════════════ PIZZAS TAB ════════════ */}
        {tab === 'Pizzas' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: '1.5rem' }}>
              <div>
                <p style={{ color: '#888', fontSize: '0.85rem', margin: 0 }}>
                  Manage storefront pre-made pizzas, pricing, ingredients and availability.
                </p>
                <p style={{ color: '#1A0500', fontSize: '0.88rem', margin: '4px 0 0', fontWeight: 700 }}>
                  🍕 Total Pizzas: {pizzas.length} • Available: {pizzas.filter(p => p.isAvailable).length}
                </p>
              </div>
              <button
                onClick={() => setShowAddPizzaModal(true)}
                style={{
                  background: 'linear-gradient(135deg,#FF4D00,#FF8C42)',
                  border: 'none',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: 10,
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(255,77,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                + Add New Pizza 🍕
              </button>
            </div>

            {pizzas.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: 16 }}>
                <p style={{ fontSize: 40, margin: '0 0 10px' }}>🍕</p>
                <h3 style={{ margin: 0, fontWeight: 800, color: '#1A0500' }}>No Pizzas in Menu</h3>
                <p style={{ color: '#888', fontSize: '0.9rem' }}>Click the button above to add your first pizza to the storefront menu.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                {pizzas.map(pizza => (
                  <div
                    key={pizza._id}
                    style={{
                      background: '#fff',
                      borderRadius: 18,
                      overflow: 'hidden',
                      boxShadow: '0 4px 18px rgba(0,0,0,0.06)',
                      border: '1.5px solid #F5EDE8',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div style={{ position: 'relative', height: 180, overflow: 'hidden', background: '#1A0500' }}>
                      <img
                        src={pizza.image || 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&q=80'}
                        alt={pizza.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&q=80' }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          top: 10,
                          left: 10,
                          background: pizza.category === 'veg' ? '#059669' : '#EF4444',
                          color: '#fff',
                          fontSize: 11,
                          fontWeight: 800,
                          padding: '3px 10px',
                          borderRadius: 20,
                        }}
                      >
                        {pizza.category === 'veg' ? '🌿 Veg' : '🍗 Non-Veg'}
                      </span>
                      <span
                        style={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          background: pizza.isAvailable ? '#10B981' : '#6B7280',
                          color: '#fff',
                          fontSize: 11,
                          fontWeight: 800,
                          padding: '3px 10px',
                          borderRadius: 20,
                        }}
                      >
                        {pizza.isAvailable ? '✓ Active' : '✕ Disabled'}
                      </span>
                    </div>

                    <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <h3 style={{ margin: 0, fontWeight: 900, color: '#1A0500', fontSize: '1.05rem' }}>{pizza.name}</h3>
                        <span style={{ color: '#FF4D00', fontWeight: 900, fontSize: '1.15rem' }}>৳{pizza.basePrice}</span>
                      </div>

                      <p style={{ color: '#777', fontSize: '0.82rem', margin: '0 0 12px', lineHeight: 1.4, flex: 1 }}>
                        {pizza.description}
                      </p>

                      {pizza.ingredients && pizza.ingredients.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 14 }}>
                          {pizza.ingredients.map((ing, idx) => (
                            <span
                              key={idx}
                              style={{
                                background: '#FFF8F4',
                                border: '1px solid #FFE0D3',
                                color: '#FF4D00',
                                padding: '2px 8px',
                                borderRadius: 8,
                                fontSize: '0.72rem',
                                fontWeight: 600,
                              }}
                            >
                              {ing}
                            </span>
                          ))}
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: 8, borderTop: '1px solid #F5EDE8', paddingTop: 12 }}>
                        <button
                          type="button"
                          onClick={() => handleTogglePizzaAvailability(pizza._id, pizza.isAvailable)}
                          style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: 8,
                            border: `1.5px solid ${pizza.isAvailable ? '#F59E0B' : '#10B981'}`,
                            background: pizza.isAvailable ? '#FFFBEB' : '#ECFDF5',
                            color: pizza.isAvailable ? '#B45309' : '#059669',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                          }}
                        >
                          {pizza.isAvailable ? 'Hide from Menu' : 'Show on Menu'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePizza(pizza._id)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: 8,
                            border: '1.5px solid #FCA5A5',
                            background: '#FFF0EE',
                            color: '#DC2626',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* ════════════ ADD INGREDIENT MODAL ════════════ */}
      {showAddModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}>
          <div style={{
            width: '100%', maxWidth: 440, background: '#fff', borderRadius: 20,
            padding: '24px 24px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            animation: 'slideUp 0.3s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ fontWeight: 900, color: '#1A0500', fontSize: '1.25rem', margin: 0 }}>Add New Ingredient 🥦</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: '#EDE0D8', border: 'none', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', fontWeight: 800 }}>✕</button>
            </div>
            <form onSubmit={handleAddIngredient} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#555', marginBottom: 5 }}>Ingredient Name</label>
                <input
                  type="text"
                  placeholder="e.g. Buffalo Mozzarella"
                  value={newIngredient.name}
                  onChange={e => setNewIngredient({ ...newIngredient, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #EDE0D8', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#555', marginBottom: 5 }}>Category</label>
                <select
                  value={newIngredient.category}
                  onChange={e => setNewIngredient({ ...newIngredient, category: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #EDE0D8', fontSize: '0.9rem', outline: 'none', background: '#fff' }}
                >
                  <option value="base">Pizza Base (Crust)</option>
                  <option value="sauce">Sauce</option>
                  <option value="cheese">Cheese</option>
                  <option value="vegetable">Vegetable (Topping)</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#555', marginBottom: 5 }}>Price (৳)</label>
                  <input
                    type="number"
                    min="0"
                    value={newIngredient.price}
                    onChange={e => setNewIngredient({ ...newIngredient, price: Number(e.target.value) })}
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #EDE0D8', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#555', marginBottom: 5 }}>Initial Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={newIngredient.stock}
                    onChange={e => setNewIngredient({ ...newIngredient, stock: Number(e.target.value) })}
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #EDE0D8', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#555', marginBottom: 5 }}>Low-Stock Alert Threshold</label>
                <input
                  type="number"
                  min="1"
                  value={newIngredient.lowStockThreshold}
                  onChange={e => setNewIngredient({ ...newIngredient, lowStockThreshold: Number(e.target.value) })}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #EDE0D8', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1.5px solid #EDE0D8', background: '#fff', color: '#666', fontWeight: 700, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={addingIngredient} style={{ flex: 1.5, padding: '12px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#FF4D00,#FF8C42)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
                  {addingIngredient ? 'Adding...' : 'Add Ingredient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════ ORDER DETAILS MODAL ════════════ */}
      {selectedOrder && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}>
          <div style={{
            width: '100%', maxWidth: 540, background: '#fff', borderRadius: 20,
            padding: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            animation: 'slideUp 0.3s ease', maxHeight: '90vh', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontWeight: 900, color: '#1A0500', fontSize: '1.3rem', margin: 0 }}>
                  Order #{selectedOrder._id.slice(-6).toUpperCase()}
                </h3>
                <p style={{ color: '#aaa', fontSize: '0.78rem', margin: '2px 0 0' }}>
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: '#EDE0D8', border: 'none', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontWeight: 800 }}>✕</button>
            </div>

            <div style={{ background: '#FFF8F3', borderRadius: 12, padding: '14px 16px', marginBottom: 16 }}>
              <p style={{ fontWeight: 800, color: '#1A0500', fontSize: '0.85rem', marginBottom: 6 }}>Customer Info</p>
              <p style={{ margin: 0, color: '#555', fontSize: '0.85rem' }}><strong>Name:</strong> {selectedOrder.user?.name || 'Guest'}</p>
              <p style={{ margin: '4px 0 0', color: '#555', fontSize: '0.85rem' }}><strong>Email:</strong> {selectedOrder.user?.email || 'N/A'}</p>
            </div>

            <div style={{ background: '#fff', border: '1.5px solid #EDE0D8', borderRadius: 12, padding: '16px', marginBottom: 16 }}>
              <p style={{ fontWeight: 800, color: '#1A0500', fontSize: '0.88rem', marginBottom: 10 }}>Selected Ingredients</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {selectedOrder.selectedIngredients?.base && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: '#555' }}>🍞 Base: {selectedOrder.selectedIngredients.base.name}</span>
                    <span style={{ fontWeight: 700, color: '#FF4D00' }}>৳{selectedOrder.selectedIngredients.base.price}</span>
                  </div>
                )}
                {selectedOrder.selectedIngredients?.sauce && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: '#555' }}>🍅 Sauce: {selectedOrder.selectedIngredients.sauce.name}</span>
                    <span style={{ fontWeight: 700, color: '#FF4D00' }}>৳{selectedOrder.selectedIngredients.sauce.price}</span>
                  </div>
                )}
                {selectedOrder.selectedIngredients?.cheese && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: '#555' }}>🧀 Cheese: {selectedOrder.selectedIngredients.cheese.name}</span>
                    <span style={{ fontWeight: 700, color: '#FF4D00' }}>৳{selectedOrder.selectedIngredients.cheese.price}</span>
                  </div>
                )}
                {selectedOrder.selectedIngredients?.vegetables?.map(v => (
                  <div key={v._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: '#555' }}>🥦 Veggie: {v.name}</span>
                    <span style={{ fontWeight: 700, color: '#FF4D00' }}>৳{v.price}</span>
                  </div>
                ))}
              </div>
              <div style={{ height: 1, background: '#EDE0D8', margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 800 }}>
                <span>Quantity: ×{selectedOrder.quantity}</span>
                <span style={{ color: '#FF4D00', fontSize: '1.1rem' }}>Total: ৳{selectedOrder.totalAmount}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#888' }}>Payment Status</p>
                <p style={{ margin: '2px 0 0', fontWeight: 800, color: selectedOrder.paymentStatus === 'paid' ? '#10B981' : '#F97316' }}>
                  {selectedOrder.paymentStatus?.toUpperCase()} ({selectedOrder.paymentId || 'N/A'})
                </p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#888' }}>Stock Deducted</p>
                <p style={{ margin: '2px 0 0', fontWeight: 800, color: selectedOrder.stockDeducted ? '#10B981' : '#EF4444' }}>
                  {selectedOrder.stockDeducted ? '✓ Safe Deducted' : '❌ Pending'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#333' }}>Update Status:</label>
              <select
                value={selectedOrder.orderStatus}
                onChange={e => updateStatus(selectedOrder._id, e.target.value)}
                style={{
                  flex: 1, padding: '9px 12px', borderRadius: 8, border: '2px solid #FF4D00',
                  fontSize: '0.88rem', fontWeight: 700, outline: 'none', background: '#fff',
                }}
              >
                <option value="Order Received">Order Received</option>
                <option value="In Kitchen">In Kitchen</option>
                <option value="Sent to Delivery">Sent to Delivery</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ════════════ ADD PIZZA MODAL ════════════ */}
      {showAddPizzaModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}>
          <div style={{
            background: '#fff', borderRadius: 20, width: '100%', maxWidth: 520,
            padding: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            animation: 'fadeIn 0.25s ease',
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <h3 style={{ margin: 0, fontWeight: 900, color: '#1A0500', fontSize: '1.2rem' }}>Add New Pizza to Menu 🍕</h3>
                <p style={{ margin: '2px 0 0', color: '#888', fontSize: '0.8rem' }}>Create a ready-to-order pizza for customers</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddPizzaModal(false)}
                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#999' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPizza} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', color: '#555', marginBottom: 5 }}>Pizza Name</label>
                <input
                  type="text"
                  placeholder="e.g. Chicken Fajita Extreme"
                  value={newPizza.name}
                  onChange={e => setNewPizza({ ...newPizza, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #EDE0D8', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', color: '#555', marginBottom: 5 }}>Description</label>
                <textarea
                  rows="2"
                  placeholder="Short, delicious description for customers..."
                  value={newPizza.description}
                  onChange={e => setNewPizza({ ...newPizza, description: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #EDE0D8', fontSize: '0.9rem', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', color: '#555', marginBottom: 5 }}>Category</label>
                  <select
                    value={newPizza.category}
                    onChange={e => setNewPizza({ ...newPizza, category: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #EDE0D8', fontSize: '0.9rem', outline: 'none', background: '#fff' }}
                  >
                    <option value="veg">🌿 Veg</option>
                    <option value="non-veg">🍗 Non-Veg</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', color: '#555', marginBottom: 5 }}>Base Price (৳)</label>
                  <input
                    type="number"
                    min="50"
                    placeholder="399"
                    value={newPizza.basePrice}
                    onChange={e => setNewPizza({ ...newPizza, basePrice: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #EDE0D8', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', color: '#555', marginBottom: 5 }}>Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newPizza.image}
                  onChange={e => setNewPizza({ ...newPizza, image: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #EDE0D8', fontSize: '0.9rem', outline: 'none' }}
                />
                {newPizza.image && (
                  <div style={{ marginTop: 8, height: 100, borderRadius: 10, overflow: 'hidden', background: '#f0f0f0' }}>
                    <img src={newPizza.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.currentTarget.style.display = 'none' }} />
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', color: '#555', marginBottom: 5 }}>
                  Key Ingredients <span style={{ color: '#888', fontWeight: 400 }}>(Comma-separated)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Thin Crust, BBQ Sauce, Mozzarella, Onions"
                  value={newPizza.ingredients}
                  onChange={e => setNewPizza({ ...newPizza, ingredients: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #EDE0D8', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowAddPizzaModal(false)}
                  style={{ flex: 1, padding: '11px', borderRadius: 10, border: '1.5px solid #EDE0D8', background: '#fff', color: '#777', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingPizza}
                  style={{
                    flex: 2, padding: '11px', borderRadius: 10, border: 'none',
                    background: addingPizza ? '#ccc' : 'linear-gradient(135deg,#FF4D00,#FF8C42)',
                    color: '#fff', fontWeight: 800, cursor: addingPizza ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 14px rgba(255,77,0,0.3)',
                  }}
                >
                  {addingPizza ? 'Saving Pizza...' : '+ Add Pizza to Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @media (max-width: 860px) {
          .admin-container {
            flex-direction: column !important;
          }
          .admin-sidebar {
            width: 100% !important;
            padding: 1rem 1rem 0.5rem !important;
          }
          .admin-sidebar nav {
            display: flex !important;
            overflow-x: auto !important;
            padding: 0.5rem 0 !important;
            gap: 8px !important;
            -webkit-overflow-scrolling: touch;
          }
          .admin-sidebar nav button {
            width: auto !important;
            white-space: nowrap !important;
            border-left: none !important;
            border-bottom: 3px solid transparent !important;
            border-radius: 10px !important;
            padding: 9px 16px !important;
          }
        }
      `}</style>
    </div>
  )
}

function StatusBadge({ status }) {
  const colors = {
    'Order Received': '#3B82F6',
    'In Kitchen': '#F97316',
    'Sent to Delivery': '#10B981',
  }
  const c = colors[status] || '#888'
  return (
    <span style={{
      background: c + '15',
      color: c,
      border: `1.5px solid ${c}30`,
      padding: '4px 12px',
      borderRadius: 20,
      fontSize: '0.75rem',
      fontWeight: 700,
      whiteSpace: 'nowrap',
    }}>
      {status}
    </span>
  )
}

const chipStyle = (color) => ({
  background: color + '12',
  color,
  border: `1px solid ${color}25`,
  padding: '2px 8px',
  borderRadius: 12,
  fontSize: '0.72rem',
  fontWeight: 700,
  whiteSpace: 'nowrap',
  display: 'inline-block',
})