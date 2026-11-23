import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'

const FEATURED = [
  { name: 'Margherita Classic', desc: 'Fresh tomato, mozzarella & basil', price: 299, tag: 'Bestseller', tagColor: '#10B981', img: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&q=80' },
  { name: 'BBQ Chicken', desc: 'Smoky BBQ sauce with grilled chicken', price: 399, tag: '🌶️ Spicy', tagColor: '#EF4444', img: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&q=80' },
  { name: 'Veggie Supreme', desc: 'Loaded with fresh garden veggies', price: 349, tag: '🌿 Veg', tagColor: '#059669', img: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&q=80' },
  { name: 'Pepperoni Feast', desc: 'Double pepperoni with extra cheese', price: 449, tag: 'Popular', tagColor: '#6366F1', img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80' },
]

export default function Menu() {
  const [ingredients, setIngredients] = useState({ base: [], sauce: [], cheese: [], vegetable: [] })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/ingredients').then(res => {
      const all = res.data
      setIngredients({
        base: all.filter(i => i.category === 'base'),
        sauce: all.filter(i => i.category === 'sauce'),
        cheese: all.filter(i => i.category === 'cheese'),
        vegetable: all.filter(i => i.category === 'vegetable'),
      })
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  const allIngredients = [
    ...ingredients.base,
    ...ingredients.sauce,
    ...ingredients.cheese,
    ...ingredients.vegetable,
  ].filter(i => i.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ background: '#FFF8F3', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#1A0500,#3D0A00)', padding: 'clamp(2rem,5vw,4rem) 1.5rem 3rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&q=60')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.1 }} />
        <div style={{ position: 'relative' }}>
          <span style={{ background: 'rgba(255,140,66,0.2)', border: '1px solid rgba(255,140,66,0.4)', color: '#FF8C42', fontSize: 11, fontWeight: 700, letterSpacing: 2, padding: '5px 14px', borderRadius: 20 }}>OUR MENU</span>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 900, color: '#fff', margin: '12px 0 8px' }}>Pizza Your Way 🍕</h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '1.5rem' }}>Choose a classic or build your own masterpiece</p>
          <Link to="/build" style={{ display: 'inline-block', background: 'linear-gradient(135deg,#FF4D00,#FF8C42)', color: '#fff', textDecoration: 'none', padding: '14px 36px', borderRadius: 50, fontWeight: 800, fontSize: '1rem', boxShadow: '0 8px 30px rgba(255,77,0,0.5)' }}>
            🔧 Build Custom Pizza →
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1rem' }}>

        {/* Featured Pizzas */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1A0500' }}>Featured Pizzas 🌟</h2>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>Our most loved classics</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
            {FEATURED.map((p, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.07)' }}>
                <div style={{ position: 'relative', height: 190, overflow: 'hidden' }}>
                  <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                  <span style={{ position: 'absolute', top: 10, left: 10, background: p.tagColor, color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>{p.tag}</span>
                </div>
                <div style={{ padding: '14px 16px 20px' }}>
                  <h3 style={{ fontWeight: 800, color: '#1A0500', marginBottom: 4 }}>{p.name}</h3>
                  <p style={{ color: '#aaa', fontSize: '0.8rem', marginBottom: 12 }}>{p.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#FF4D00' }}>From ৳{p.price}</span>
                    <Link to="/build" style={{ background: 'linear-gradient(135deg,#FF4D00,#FF8C42)', color: '#fff', padding: '8px 18px', borderRadius: 25, fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 14px rgba(255,77,0,0.3)' }}>
                      Customize →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ingredients Section */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1A0500' }}>All Ingredients 🥦</h2>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>Fresh ingredients available for your custom build</p>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 400, margin: '0 auto 2rem' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
            <input type="text" placeholder="Search ingredients..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '11px 16px 11px 42px', borderRadius: 12, border: '2px solid #EDE0D8', background: '#fff', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = '#FF4D00'} onBlur={e => e.target.style.borderColor = '#EDE0D8'} />
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ width: 48, height: 48, border: '4px solid #EDE0D8', borderTopColor: '#FF4D00', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
            </div>
          ) : (
            ['base', 'sauce', 'cheese', 'vegetable'].map(cat => {
              const items = allIngredients.filter(i => i.category === cat)
              if (items.length === 0) return null
              return (
                <div key={cat} style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontWeight: 800, color: '#1A0500', fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{cat === 'base' ? '🍞' : cat === 'sauce' ? '🍅' : cat === 'cheese' ? '🧀' : '🥦'}</span>
                    <span style={{ textTransform: 'capitalize' }}>{cat}s</span>
                    <span style={{ background: '#FF4D00', color: '#fff', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 12 }}>{items.length}</span>
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {items.map(item => (
                      <div key={item._id} style={{ background: '#fff', borderRadius: 12, padding: '12px 16px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 10, minWidth: 180 }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 700, color: '#1A0500', fontSize: '0.88rem', marginBottom: 2 }}>{item.name}</p>
                          <p style={{ color: '#FF4D00', fontWeight: 800, fontSize: '0.82rem' }}>+৳{item.price}</p>
                        </div>
                        <span style={{ background: item.stock > 20 ? '#ECFDF5' : item.stock > 0 ? '#FFFBEB' : '#FEF2F2', color: item.stock > 20 ? '#10B981' : item.stock > 0 ? '#F59E0B' : '#EF4444', fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: 20 }}>
                          {item.stock > 20 ? 'In stock' : item.stock > 0 ? 'Low stock' : 'Out'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '3rem', padding: '3rem 2rem', background: 'linear-gradient(135deg,#1A0500,#3D0A00)', borderRadius: 24 }}>
          <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(1.5rem,3vw,2rem)', marginBottom: 12 }}>Ready to Build Your Pizza? 🔥</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 24 }}>Choose your base, sauce, cheese and toppings — your perfect pizza awaits</p>
          <Link to="/build" style={{ display: 'inline-block', background: 'linear-gradient(135deg,#FF4D00,#FF8C42)', color: '#fff', textDecoration: 'none', padding: '14px 40px', borderRadius: 50, fontWeight: 800, fontSize: '1rem', boxShadow: '0 8px 30px rgba(255,77,0,0.4)' }}>
            Start Building →
          </Link>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
