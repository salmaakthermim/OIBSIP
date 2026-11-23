import { useState, useEffect } from 'react'
import api from '../utils/api'
import { useCart } from '../context/CartContext'

const categories = ['All', 'veg', 'non-veg']

export default function Menu() {
  const [pizzas, setPizzas] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [added, setAdded] = useState({})
  const { addToCart } = useCart()

  useEffect(() => {
    api.get('/pizzas')
      .then(res => setPizzas(res.data))
      .catch(() => setPizzas(demoData))
      .finally(() => setLoading(false))
  }, [])

  const filtered = pizzas.filter(p => {
    const matchCat = filter === 'All' || p.category === filter
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const handleAdd = (pizza, size) => {
    addToCart(pizza, size)
    const key = `${pizza._id}-${size}`
    setAdded(prev => ({ ...prev, [key]: true }))
    setTimeout(() => setAdded(prev => ({ ...prev, [key]: false })), 1500)
  }

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 48, height: 48, border: '4px solid #EDE0D8', borderTopColor: '#FF4D00', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#888', fontWeight: 600 }}>Loading menu...</p>
    </div>
  )

  return (
    <div style={{ background: '#FFF8F3', minHeight: '100vh', paddingBottom: '4rem' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1A0500, #3D0A00)',
        padding: 'clamp(2rem,5vw,4rem) 1.5rem 3rem',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&q=60')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.1 }} />
        <div style={{ position: 'relative' }}>
          <span style={{ background: 'rgba(255,140,66,0.2)', border: '1px solid rgba(255,140,66,0.4)', color: '#FF8C42', fontSize: 11, fontWeight: 700, letterSpacing: 2, padding: '5px 14px', borderRadius: 20 }}>OUR MENU</span>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 900, color: '#fff', margin: '12px 0 8px' }}>Choose Your Pizza 🍕</h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 'clamp(0.85rem,2vw,1rem)' }}>Fresh, hot and made with love</p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1rem' }}>

        {/* Search + Filter */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 12,
          alignItems: 'center', justifyContent: 'space-between',
          margin: '2rem 0 1.5rem',
        }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: 360 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
            <input
              type="text" placeholder="Search pizzas..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '11px 16px 11px 42px',
                borderRadius: 12, border: '2px solid #EDE0D8',
                background: '#fff', fontSize: '0.92rem',
                outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = '#FF4D00'}
              onBlur={e => e.target.style.borderColor = '#EDE0D8'}
            />
          </div>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categories.map(c => (
              <button key={c} onClick={() => setFilter(c)} style={{
                padding: '9px 20px', borderRadius: 25,
                border: '2px solid',
                borderColor: filter === c ? '#FF4D00' : '#EDE0D8',
                background: filter === c ? 'linear-gradient(135deg,#FF4D00,#FF8C42)' : '#fff',
                color: filter === c ? '#fff' : '#888',
                fontWeight: 700, fontSize: '0.83rem',
                cursor: 'pointer', transition: 'all 0.2s',
                textTransform: c === 'All' ? 'none' : 'capitalize',
              }}>
                {c === 'veg' ? '🌿 Veg' : c === 'non-veg' ? '🍗 Non-Veg' : '🍕 All'}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
          Showing <strong style={{ color: '#FF4D00' }}>{filtered.length}</strong> pizzas
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
            <p style={{ fontSize: '3rem', marginBottom: 12 }}>🍕</p>
            <p style={{ color: '#888', fontWeight: 600 }}>No pizzas found. Try different search.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 24,
          }}>
            {filtered.map(pizza => (
              <PizzaCard key={pizza._id} pizza={pizza} onAdd={handleAdd} added={added} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function PizzaCard({ pizza, onAdd, added }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 20,
      overflow: 'hidden',
      boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      animation: 'fadeIn 0.4s ease',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.12)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.07)' }}
    >
      <div style={{ position: 'relative', overflow: 'hidden', height: 190 }}>
        <img src={pizza.image || `https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80`}
          alt={pizza.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        />
        <span style={{
          position: 'absolute', top: 10, left: 10,
          background: pizza.category === 'veg' ? '#10B981' : '#EF4444',
          color: '#fff', fontSize: 10, fontWeight: 700,
          padding: '3px 10px', borderRadius: 20,
        }}>{pizza.category === 'veg' ? '🌿 Veg' : '🍗 Non-Veg'}</span>
        {!pizza.isAvailable && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>Out of Stock</span>
          </div>
        )}
      </div>

      <div style={{ padding: '14px 16px 18px' }}>
        <h3 style={{ fontWeight: 800, color: '#1A0500', fontSize: '1rem', marginBottom: 4 }}>{pizza.name}</h3>
        <p style={{ color: '#aaa', fontSize: '0.8rem', marginBottom: 12, lineHeight: 1.5 }}>{pizza.description?.slice(0, 60)}...</p>

        {/* Sizes */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {pizza.sizes?.map(s => {
            const key = `${pizza._id}-${s.size}`
            const isAdded = added[key]
            return (
              <button key={s.size} onClick={() => onAdd(pizza, s.size)} style={{
                padding: '7px 14px', borderRadius: 25,
                border: '2px solid',
                borderColor: isAdded ? '#10B981' : '#FF4D00',
                background: isAdded ? '#10B981' : 'transparent',
                color: isAdded ? '#fff' : '#FF4D00',
                fontSize: '0.78rem', fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.25s',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                {isAdded ? '✓' : ''} {s.size} · ৳{s.price}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Demo data when API is not available
const demoData = [
  { _id: '1', name: 'Margherita Classic', description: 'Fresh tomato sauce, mozzarella and basil', category: 'veg', isAvailable: true, sizes: [{ size: 'small', price: 199 }, { size: 'medium', price: 299 }, { size: 'large', price: 399 }], image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&q=80' },
  { _id: '2', name: 'BBQ Chicken', description: 'Smoky BBQ sauce with grilled chicken chunks', category: 'non-veg', isAvailable: true, sizes: [{ size: 'small', price: 249 }, { size: 'medium', price: 399 }, { size: 'large', price: 499 }], image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&q=80' },
  { _id: '3', name: 'Veggie Supreme', description: 'Loaded with bell peppers, mushrooms and olives', category: 'veg', isAvailable: true, sizes: [{ size: 'small', price: 219 }, { size: 'medium', price: 349 }, { size: 'large', price: 449 }], image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&q=80' },
  { _id: '4', name: 'Pepperoni Feast', description: 'Double layer pepperoni with extra mozzarella', category: 'non-veg', isAvailable: true, sizes: [{ size: 'small', price: 269 }, { size: 'medium', price: 449 }, { size: 'large', price: 549 }], image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80' },
]
