import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

// Fallback curated pizza catalog if API is loading or offline
const fallbackCatalog = [
  {
    _id: "p1",
    name: "Margherita Classic",
    basePrice: 299,
    category: "veg",
    rating: 4.9,
    reviewCount: 1420,
    orders: "2.4k",
    tag: "Bestseller",
    tagBg: "#10B981",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=90",
    description: "The timeless Italian masterpiece. Authentically crafted with crushed San Marzano plum tomatoes, fresh buffalo mozzarella, aromatic sweet basil leaves, and a drizzle of cold-pressed extra virgin olive oil over our 48-hour fermented crust.",
    ingredients: ["Thin Sourdough Crust", "San Marzano Tomato Sauce", "Buffalo Mozzarella", "Fresh Sweet Basil", "Extra Virgin Olive Oil"],
    calories: "240 kcal / slice",
    prepTime: "15 - 20 mins",
    spiciness: "Mild",
  },
  {
    _id: "p2",
    name: "Smoky BBQ Chicken",
    basePrice: 399,
    category: "non-veg",
    rating: 4.8,
    reviewCount: 980,
    orders: "1.9k",
    tag: "🌶️ Spicy",
    tagBg: "#EF4444",
    image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&q=90",
    description: "Tender hickory-smoked grilled chicken breast coated in tangy Texas BBQ glaze, layered with caramelized red onions, sharp cheddar, stretchy mozzarella, and finished with fresh cilantro for a deep, smoky campfire flavor.",
    ingredients: ["Hand-Tossed Thick Crust", "Hickory BBQ Glaze", "Aged English Cheddar", "Smoked Chicken Breast", "Caramelized Red Onions"],
    calories: "310 kcal / slice",
    prepTime: "18 - 22 mins",
    spiciness: "Medium Hot",
  },
  {
    _id: "p3",
    name: "Garden Veggie Supreme",
    basePrice: 349,
    category: "veg",
    rating: 4.7,
    reviewCount: 760,
    orders: "1.5k",
    tag: "🌿 Pure Veg",
    tagBg: "#059669",
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800&q=90",
    description: "A colorful garden harvest loaded with crisp bell peppers, tender button mushrooms, Spanish black olives, golden sweet corn, and juicy cherry tomatoes over our herb-infused pesto base and melted mozzarella.",
    ingredients: ["Whole Wheat Crust", "Herb Pesto Sauce", "Whole Milk Mozzarella", "Bell Peppers", "Button Mushrooms", "Black Olives", "Sweet Corn"],
    calories: "220 kcal / slice",
    prepTime: "15 - 18 mins",
    spiciness: "Mild",
  },
  {
    _id: "p4",
    name: "Pepperoni Burst",
    basePrice: 449,
    category: "non-veg",
    rating: 4.9,
    reviewCount: 2150,
    orders: "3.6k",
    tag: "🔥 Fan Favorite",
    tagBg: "#6366F1",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=90",
    description: "For true carnivore pizza purists. Generously stacked with premium sliced beef pepperoni that cups and crisps under intense stone-oven heat, floating on a sea of bubbling molten mozzarella and garlic butter crust.",
    ingredients: ["Cheese Burst Crust", "Tomato Basil Marinara", "Double Mozzarella", "Crispy Beef Pepperoni", "Garlic Butter Rim"],
    calories: "340 kcal / slice",
    prepTime: "16 - 20 mins",
    spiciness: "Medium",
  },
  {
    _id: "p5",
    name: "Four Cheese Quattro",
    basePrice: 419,
    category: "veg",
    rating: 4.9,
    reviewCount: 1120,
    orders: "1.8k",
    tag: "🧀 Cheese Pull",
    tagBg: "#F59E0B",
    image: "https://images.unsplash.com/photo-1573821663912-569905455b1a?w=800&q=90",
    description: "An indulgent tribute to artisan cheeses. A decadent blend of creamy whole-milk Mozzarella, aged English Cheddar, nutty Parmesan Reggiano, and rich Dutch Gouda on a fragrant garlic white sauce foundation.",
    ingredients: ["Cheese Burst Crust", "Roasted Garlic White Sauce", "Mozzarella", "English Cheddar", "Parmesan Reggiano", "Dutch Gouda"],
    calories: "330 kcal / slice",
    prepTime: "16 - 20 mins",
    spiciness: "Mild",
  },
  {
    _id: "p6",
    name: "Spicy Peri Peri Chicken",
    basePrice: 429,
    category: "non-veg",
    rating: 4.8,
    reviewCount: 890,
    orders: "2.1k",
    tag: "🌶️ Extra Hot",
    tagBg: "#DC2626",
    image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800&q=90",
    description: "A fiery kick for spice enthusiasts! Marinated peri-peri chicken bites, spicy jalapenos, charred capsicum, and melted mozzarella finished with our signature smoky peri-peri drizzle.",
    ingredients: ["Thin Sourdough Crust", "Spicy Arrabiata Sauce", "Mozzarella", "Peri Peri Chicken", "Pickled Jalapenos"],
    calories: "295 kcal / slice",
    prepTime: "18 - 22 mins",
    spiciness: "Extra Hot",
  },
]

const SIZES = [
  { id: 'regular', label: 'Regular (8")', slices: '4 Slices • 1 Person', extraPrice: 0 },
  { id: 'medium', label: 'Medium (10")', slices: '6 Slices • 2 Persons', extraPrice: 80 },
  { id: 'large', label: 'Large (12")', slices: '8 Slices • 3-4 Persons', extraPrice: 150 },
]

const CRUST_OPTIONS = [
  { id: 'thin', name: 'Thin Italian Sourdough', extraPrice: 0 },
  { id: 'cheese-burst', name: 'Cheese Burst Lava Crust', extraPrice: 60 },
  { id: 'thick', name: 'Thick Golden Pan Crust', extraPrice: 30 },
  { id: 'wheat', name: 'Whole Wheat Multigrain', extraPrice: 40 },
]

export default function PizzaDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [pizza, setPizza] = useState(null)
  const [allPizzas, setAllPizzas] = useState([])
  const [dbIngredients, setDbIngredients] = useState([])
  const [loading, setLoading] = useState(true)

  // Customization state
  const [size, setSize] = useState('medium')
  const [crust, setCrust] = useState('thin')
  const [spiceLevel, setSpiceLevel] = useState('Medium')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('ingredients')

  // Load pizza data and ingredients
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setLoading(true)

    Promise.all([
      api.get(`/pizzas/${id}`).catch(() => null),
      api.get('/pizzas').catch(() => null),
      api.get('/ingredients').catch(() => null),
    ]).then(([singleRes, allRes, ingRes]) => {
      // 1. Resolve current pizza
      let foundPizza = singleRes?.data
      if (!foundPizza) {
        // Look in allRes
        foundPizza = allRes?.data?.find(p => p._id === id)
      }
      if (!foundPizza) {
        // Look in fallback catalog
        foundPizza = fallbackCatalog.find(p => p._id === id || p.name.toLowerCase().includes(id.toLowerCase()))
      }
      // If still not found, default to first catalog pizza
      if (!foundPizza) {
        foundPizza = fallbackCatalog[0]
      }
      setPizza(foundPizza)

      // 2. Set related pizzas
      const fullList = (allRes?.data && allRes.data.length > 0) ? allRes.data : fallbackCatalog
      setAllPizzas(fullList.filter(p => p._id !== foundPizza._id).slice(0, 3))

      // 3. Set ingredients list for seamless checkout mapping
      if (ingRes?.data) {
        setDbIngredients(ingRes.data)
      }
      setLoading(false)
    }).catch(() => {
      const match = fallbackCatalog.find(p => p._id === id) || fallbackCatalog[0]
      setPizza(match)
      setAllPizzas(fallbackCatalog.filter(p => p._id !== match._id).slice(0, 3))
      setLoading(false)
    })
  }, [id])

  if (loading || !pizza) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div style={{ width: 50, height: 50, border: '4px solid #EDE0D8', borderTopColor: '#FF4D00', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: '#888', fontWeight: 600 }}>Loading gourmet pizza details...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // Price calculations
  const selectedSizeObj = SIZES.find(s => s.id === size) || SIZES[1]
  const selectedCrustObj = CRUST_OPTIONS.find(c => c.id === crust) || CRUST_OPTIONS[0]
  const basePrice = pizza.basePrice || pizza.price || 299
  const unitPrice = basePrice + selectedSizeObj.extraPrice + selectedCrustObj.extraPrice
  const totalPrice = unitPrice * quantity

  // Match ingredient IDs from dbIngredients for order-summary
  const getMappedSelection = () => {
    const bases = dbIngredients.filter(i => i.category === 'base')
    const sauces = dbIngredients.filter(i => i.category === 'sauce')
    const cheeses = dbIngredients.filter(i => i.category === 'cheese')
    const veggies = dbIngredients.filter(i => i.category === 'vegetable')

    // Find crust or fallback
    const matchedBase = bases.find(b => b.name.toLowerCase().includes(crust.replace('-', ' '))) || bases[0] || {
      _id: 'default-base',
      name: selectedCrustObj.name,
      price: 50,
    }

    // Find sauce or fallback
    const isBBQ = pizza.name.toLowerCase().includes('bbq')
    const matchedSauce = isBBQ
      ? (sauces.find(s => s.name.toLowerCase().includes('bbq')) || sauces[0])
      : (sauces.find(s => s.name.toLowerCase().includes('tomato')) || sauces[0]) || {
        _id: 'default-sauce',
        name: 'Tomato Basil',
        price: 30,
      }

    // Find cheese or fallback
    const matchedCheese = cheeses.find(c => c.name.toLowerCase().includes('mozzarella')) || cheeses[0] || {
      _id: 'default-cheese',
      name: 'Mozzarella',
      price: 60,
    }

    // Find vegetables
    const matchedVeggies = (pizza.ingredients || []).map(ingName => {
      return veggies.find(v => v.name.toLowerCase().includes(ingName.toLowerCase()))
    }).filter(Boolean)

    return {
      base: matchedBase,
      sauce: matchedSauce,
      cheese: matchedCheese,
      vegetables: matchedVeggies.length > 0 ? matchedVeggies : (veggies.slice(0, 2)),
    }
  }

  // Handle direct buy now
  const handleBuyNow = () => {
    if (!user) {
      toast('Please login to place your order! 🍕', { icon: '🔐' })
      navigate('/login', {
        state: {
          from: '/order-summary',
          selection: getMappedSelection(),
          totalPrice: unitPrice,
          quantity,
          pizzaName: `${pizza.name} (${selectedSizeObj.label})`,
        }
      })
      return
    }

    navigate('/order-summary', {
      state: {
        pizzaName: `${pizza.name} (${selectedSizeObj.label})`,
        pizzaImage: pizza.image,
        pizzaSize: selectedSizeObj.label,
        pizzaCrust: selectedCrustObj.name,
        selection: getMappedSelection(),
        totalPrice: unitPrice,
        quantity,
      }
    })
  }

  // Handle customize in builder
  const handleCustomizeInBuilder = () => {
    navigate('/build', {
      state: {
        fromPizza: pizza.name,
        preferredCrust: selectedCrustObj.name,
      }
    })
  }

  return (
    <div style={{ background: '#FFF8F3', minHeight: '100vh', color: '#1A0500', paddingBottom: '5rem', overflowX: 'hidden' }}>
      
      {/* ════════════ TOP BREADCRUMB & HEADER ════════════ */}
      <div style={{ background: 'linear-gradient(135deg, #1A0500 0%, #350A00 100%)', padding: 'clamp(2rem, 4vw, 3rem) 1.5rem 2rem', color: '#fff' }}>
        <div style={{ maxWidth: 1220, margin: '0 auto' }}>
          
          {/* Breadcrumb Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', flexWrap: 'wrap', marginBottom: 12 }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }}>Home</Link>
            <span>/</span>
            <Link to="/menu" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.2s' }}>Menu</Link>
            <span>/</span>
            <span style={{ color: '#FF8C42', fontWeight: 700 }}>{pizza.name}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, color: '#fff', margin: 0 }}>
              {pizza.name} 🍕
            </h1>
            <Link
              to="/menu"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                color: '#fff',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '8px 18px',
                borderRadius: 20,
                fontSize: '0.84rem',
                fontWeight: 700,
                textDecoration: 'none',
                backdropFilter: 'blur(8px)',
                transition: 'background 0.2s',
              }}
            >
              ← Back to Full Menu
            </Link>
          </div>

        </div>
      </div>

      {/* ════════════ MAIN PRODUCT SHOWCASE GRID ════════════ */}
      <section style={{ maxWidth: 1220, margin: '-2rem auto 0', padding: '0 1.5rem', position: 'relative', zIndex: 10 }}>
        <div style={{
          background: '#fff',
          borderRadius: 28,
          boxShadow: '0 15px 45px rgba(0,0,0,0.08)',
          border: '1.5px solid #F5EDE8',
          padding: 'clamp(1.5rem, 3.5vw, 2.8rem)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'clamp(2rem, 4vw, 3.5rem)',
          alignItems: 'start',
        }}>

          {/* ════════════ LEFT COLUMN: IMAGE & BADGES ════════════ */}
          <div>
            <div style={{
              position: 'relative',
              borderRadius: 24,
              overflow: 'hidden',
              boxShadow: '0 12px 35px rgba(255,77,0,0.15)',
              background: '#0F0300',
              height: 'clamp(280px, 40vw, 420px)',
            }}>
              <img
                src={pizza.image}
                alt={pizza.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />

              {/* Category Pill */}
              <span style={{
                position: 'absolute',
                top: 16,
                left: 16,
                background: pizza.category === 'veg' ? '#059669' : '#EF4444',
                color: '#fff',
                padding: '6px 16px',
                borderRadius: 20,
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: 1,
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
              }}>
                {pizza.category === 'veg' ? '🌿 Pure Veg' : '🍗 Chef Non-Veg'}
              </span>

              {/* Tag Pill */}
              <span style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: pizza.tagBg || '#FF4D00',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: '0.78rem',
                fontWeight: 800,
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
              }}>
                {pizza.tag || 'Specialty'}
              </span>

              {/* Bottom Info Ribbon */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(15,3,0,0.85) 0%, transparent 100%)',
                padding: '24px 20px 16px',
                color: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
              }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)' }}>Order Prep Time</span>
                  <p style={{ fontWeight: 800, fontSize: '0.95rem', margin: 0, color: '#FFD700' }}>
                    ⏱️ {pizza.prepTime || '15 - 20 mins'}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)' }}>Energy</span>
                  <p style={{ fontWeight: 800, fontSize: '0.95rem', margin: 0, color: '#10B981' }}>
                    🔥 {pizza.calories || '260 kcal / slice'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quality Guarantee Features */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 12,
              marginTop: 20,
            }}>
              {[
                { icon: '⏱️', text: '30-Min Fast Delivery' },
                { icon: '🧀', text: '100% Real Mozzarella' },
                { icon: '🪵', text: '800°F Stone Oven Baked' },
                { icon: '🌿', text: 'Daily Hand-Kneaded' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    background: '#FFF8F4',
                    border: '1px solid #FFE0D3',
                    padding: '10px 14px',
                    borderRadius: 14,
                  }}
                >
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1A0500' }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* ════════════ RIGHT COLUMN: ORDERING CONTROLS ════════════ */}
          <div>
            
            {/* Reviews & Orders Rating Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#FEF3C7', padding: '4px 12px', borderRadius: 20, color: '#D97706', fontWeight: 800, fontSize: '0.85rem' }}>
                <span>⭐</span>
                <span>{pizza.rating || 4.9}</span>
              </div>
              <span style={{ fontSize: '0.84rem', color: '#888', fontWeight: 600 }}>
                ({pizza.reviewCount || 1240} verified reviews)
              </span>
              <span style={{ color: '#EDE0D8' }}>•</span>
              <span style={{ fontSize: '0.84rem', color: '#10B981', fontWeight: 700 }}>
                ✓ {pizza.orders || '2.1k'} orders placed
              </span>
            </div>

            {/* Price Tag */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 18 }}>
              <span style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, color: '#FF4D00' }}>
                ৳{unitPrice}
              </span>
              {selectedSizeObj.extraPrice > 0 && (
                <span style={{ fontSize: '0.9rem', color: '#888', textDecoration: 'line-through' }}>
                  ৳{unitPrice + 40}
                </span>
              )}
              <span style={{ background: '#ECFDF5', color: '#059669', fontSize: '0.78rem', fontWeight: 800, padding: '3px 10px', borderRadius: 12 }}>
                Free 30-Min Delivery
              </span>
            </div>

            {/* Description */}
            <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: 1.65, marginBottom: 24 }}>
              {pizza.description || pizza.desc}
            </p>

            {/* 1. Size Selection */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1A0500' }}>
                  Select Pizza Size:
                </label>
                <span style={{ fontSize: '0.78rem', color: '#FF4D00', fontWeight: 700 }}>
                  {selectedSizeObj.slices}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {SIZES.map(s => {
                  const isSelected = size === s.id
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSize(s.id)}
                      style={{
                        padding: '12px 8px',
                        borderRadius: 14,
                        border: isSelected ? '2px solid #FF4D00' : '1.5px solid #EDE0D8',
                        background: isSelected ? '#FFF8F4' : '#fff',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s',
                        boxShadow: isSelected ? '0 4px 14px rgba(255,77,0,0.15)' : 'none',
                      }}
                    >
                      <p style={{ fontWeight: 800, color: isSelected ? '#FF4D00' : '#1A0500', fontSize: '0.86rem', margin: '0 0 2px' }}>
                        {s.label}
                      </p>
                      <span style={{ fontSize: '0.72rem', color: isSelected ? '#FF4D00' : '#888', fontWeight: 600 }}>
                        {s.extraPrice > 0 ? `+৳${s.extraPrice}` : 'Standard'}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 2. Crust Selection */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, color: '#1A0500', marginBottom: 8 }}>
                Select Artisan Crust:
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
                {CRUST_OPTIONS.map(c => {
                  const isSelected = crust === c.id
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCrust(c.id)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 12,
                        border: isSelected ? '2px solid #FF4D00' : '1.5px solid #EDE0D8',
                        background: isSelected ? '#FFF8F4' : '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.2s',
                      }}
                    >
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isSelected ? '#FF4D00' : '#333' }}>
                        {c.name}
                      </span>
                      <span style={{ fontSize: '0.74rem', color: isSelected ? '#FF4D00' : '#888', fontWeight: 700 }}>
                        {c.extraPrice > 0 ? `+৳${c.extraPrice}` : 'Free'}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 3. Spice Level */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, color: '#1A0500', marginBottom: 8 }}>
                Spice Level Preference:
              </label>

              <div style={{ display: 'flex', gap: 10 }}>
                {['Mild 🟢', 'Medium 🟡', 'Hot 🌶️'].map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSpiceLevel(lvl)}
                    style={{
                      flex: 1,
                      padding: '9px 12px',
                      borderRadius: 12,
                      border: spiceLevel === lvl ? '2px solid #FF4D00' : '1.5px solid #EDE0D8',
                      background: spiceLevel === lvl ? '#FF4D00' : '#fff',
                      color: spiceLevel === lvl ? '#fff' : '#555',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Quantity and Total Calculation Box */}
            <div style={{
              background: '#FFF8F4',
              border: '1.5px solid #FFE0D3',
              borderRadius: 20,
              padding: '18px 22px',
              marginBottom: 24,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 16,
            }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#888', fontWeight: 600 }}>QUANTITY</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 4 }}>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      border: '1.5px solid #EDE0D8',
                      background: '#fff',
                      fontWeight: 900,
                      fontSize: '1.2rem',
                      color: '#FF4D00',
                      cursor: 'pointer',
                    }}
                  >
                    −
                  </button>
                  <span style={{ fontWeight: 900, fontSize: '1.25rem', color: '#1A0500', minWidth: 24, textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => q + 1)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      border: '1.5px solid #EDE0D8',
                      background: '#fff',
                      fontWeight: 900,
                      fontSize: '1.2rem',
                      color: '#FF4D00',
                      cursor: 'pointer',
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.78rem', color: '#888', fontWeight: 600 }}>TOTAL PRICE</span>
                <p style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FF4D00', margin: 0 }}>
                  ৳{totalPrice}
                </p>
                <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 700 }}>
                  (৳{unitPrice} each × {quantity})
                </span>
              </div>
            </div>

            {/* 5. Action Buttons (Order Now & Custom Builder) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              
              <button
                type="button"
                onClick={handleBuyNow}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #FF4D00, #FF8C42)',
                  color: '#fff',
                  border: 'none',
                  padding: '16px 28px',
                  borderRadius: 16,
                  fontWeight: 900,
                  fontSize: '1.05rem',
                  cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(255,77,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(255,77,0,0.55)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(255,77,0,0.4)' }}
              >
                <span>⚡ Buy Now / Proceed to Checkout</span>
                <span style={{ background: 'rgba(255,255,255,0.25)', padding: '2px 10px', borderRadius: 10, fontSize: '0.9rem' }}>
                  ৳{totalPrice}
                </span>
              </button>

              <button
                type="button"
                onClick={handleCustomizeInBuilder}
                style={{
                  width: '100%',
                  background: '#fff',
                  color: '#FF4D00',
                  border: '2px solid #FF4D00',
                  padding: '14px 28px',
                  borderRadius: 16,
                  fontWeight: 800,
                  fontSize: '0.96rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'background 0.2s, color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#FFF3ED' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
              >
                <span>🛠️ Customize Further in 4-Step Builder</span>
              </button>

            </div>

          </div>

        </div>
      </section>

      {/* ════════════ INGREDIENTS & NUTRITION TABS ════════════ */}
      <section style={{ maxWidth: 1220, margin: '4rem auto 0', padding: '0 1.5rem' }}>
        
        {/* Tab Headers */}
        <div style={{ display: 'flex', gap: 14, borderBottom: '2px solid #EDE0D8', paddingBottom: 12, marginBottom: 28 }}>
          <button
            type="button"
            onClick={() => setActiveTab('ingredients')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.05rem',
              fontWeight: 800,
              color: activeTab === 'ingredients' ? '#FF4D00' : '#888',
              cursor: 'pointer',
              borderBottom: activeTab === 'ingredients' ? '3px solid #FF4D00' : 'none',
              paddingBottom: 8,
            }}
          >
            🥗 Recipe & Fresh Ingredients
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('nutrition')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.05rem',
              fontWeight: 800,
              color: activeTab === 'nutrition' ? '#FF4D00' : '#888',
              cursor: 'pointer',
              borderBottom: activeTab === 'nutrition' ? '3px solid #FF4D00' : 'none',
              paddingBottom: 8,
            }}
          >
            📊 Nutrition & Preparation
          </button>
        </div>

        {/* Tab Content: Ingredients */}
        {activeTab === 'ingredients' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
            {(pizza.ingredients || ['Fresh Dough', 'Signature Sauce', 'Mozzarella', 'Farm Vegetables']).map((ing, idx) => (
              <div
                key={idx}
                style={{
                  background: '#fff',
                  borderRadius: 18,
                  padding: '20px',
                  border: '1.5px solid #F5EDE8',
                  boxShadow: '0 4px 18px rgba(0,0,0,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <div style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  background: '#FFF3ED',
                  color: '#FF4D00',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  flexShrink: 0,
                }}>
                  {idx % 4 === 0 ? '🍞' : idx % 4 === 1 ? '🍅' : idx % 4 === 2 ? '🧀' : '🌿'}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 2px', fontWeight: 800, fontSize: '0.98rem', color: '#1A0500' }}>
                    {ing}
                  </h4>
                  <span style={{ fontSize: '0.74rem', color: '#10B981', fontWeight: 700 }}>
                    ✓ 100% Farm Fresh
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content: Nutrition */}
        {activeTab === 'nutrition' && (
          <div style={{
            background: '#fff',
            borderRadius: 20,
            padding: '28px',
            border: '1.5px solid #F5EDE8',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 20,
            textAlign: 'center',
          }}>
            {[
              { label: 'Energy / Slice', value: pizza.calories || '260 kcal', icon: '🔥' },
              { label: 'Dietary Type', value: pizza.category === 'veg' ? '100% Vegetarian' : 'Halal Meat & Poultry', icon: '🌿' },
              { label: 'Prep & Bake Time', value: pizza.prepTime || '15 - 20 mins', icon: '⏱️' },
              { label: 'Oven Temperature', value: '800°F Volcanic Stone', icon: '🪵' },
            ].map((item, i) => (
              <div key={i} style={{ background: '#FFF8F4', borderRadius: 16, padding: '18px 14px' }}>
                <span style={{ fontSize: 26 }}>{item.icon}</span>
                <p style={{ color: '#888', fontSize: '0.78rem', fontWeight: 600, margin: '8px 0 2px' }}>{item.label}</p>
                <h4 style={{ color: '#FF4D00', fontWeight: 900, fontSize: '1.05rem', margin: 0 }}>{item.value}</h4>
              </div>
            ))}
          </div>
        )}

      </section>

      {/* ════════════ CUSTOMER REVIEWS FOR THIS PIZZA ════════════ */}
      <section style={{ maxWidth: 1220, margin: '4rem auto 0', padding: '0 1.5rem' }}>
        <div style={{ marginBottom: 24 }}>
          <span style={{ color: '#FF4D00', fontWeight: 800, fontSize: '0.82rem', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            VERIFIED FOODIE FEEDBACK
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1A0500', margin: '4px 0 0' }}>
            What People Say About {pizza.name} ⭐
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {[
            {
              author: "Tariqul Islam",
              city: "Dhaka, Gulshan",
              rating: 5,
              date: "Yesterday",
              comment: `The crust on the ${pizza.name} was incredible! Light, bubbly, and delivered steaming hot within 22 minutes. Absolutely ordering again!`,
            },
            {
              author: "Nusrat Jahan",
              city: "Dhanmondi",
              rating: 5,
              date: "3 days ago",
              comment: `Best cheese pull in the city. The balance of sauces and fresh ingredients is just spot on. Medium size was perfect for two.`,
            },
            {
              author: "Arif Rahman",
              city: "Uttara",
              rating: 5,
              date: "1 week ago",
              comment: `Loved being able to choose the Cheese Burst crust directly from the details page. Super convenient and tasted 10/10!`,
            },
          ].map((rev, idx) => (
            <div
              key={idx}
              style={{
                background: '#fff',
                borderRadius: 20,
                padding: '24px',
                border: '1.5px solid #F5EDE8',
                boxShadow: '0 4px 18px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ display: 'flex', gap: 3, color: '#F59E0B', fontSize: 16 }}>
                    {'★'.repeat(rev.rating)}
                  </div>
                  <span style={{ color: '#aaa', fontSize: '0.75rem' }}>{rev.date}</span>
                </div>
                <p style={{ color: '#555', fontSize: '0.88rem', lineHeight: 1.6, margin: '0 0 16px', fontStyle: 'italic' }}>
                  "{rev.comment}"
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderTop: '1px solid #F5EDE8', paddingTop: 12 }}>
                <div style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FF4D00, #FF8C42)',
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {rev.author[0]}
                </div>
                <div>
                  <p style={{ fontWeight: 800, fontSize: '0.85rem', color: '#1A0500', margin: 0 }}>{rev.author}</p>
                  <p style={{ color: '#888', fontSize: '0.72rem', margin: 0 }}>{rev.city} • <span style={{ color: '#10B981', fontWeight: 700 }}>✓ Verified Buyer</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════ RELATED RECOMMENDATIONS ════════════ */}
      {allPizzas.length > 0 && (
        <section style={{ maxWidth: 1220, margin: '4.5rem auto 0', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <span style={{ color: '#FF4D00', fontWeight: 800, fontSize: '0.82rem', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                YOU MIGHT ALSO LOVE
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1A0500', margin: '4px 0 0' }}>
                Recommended Handcrafted Pizzas 🍕
              </h2>
            </div>
            <Link to="/menu" style={{ color: '#FF4D00', fontWeight: 800, fontSize: '0.88rem', textDecoration: 'none' }}>
              View All Pizzas →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {allPizzas.map(p => (
              <div
                key={p._id}
                style={{
                  background: '#fff',
                  borderRadius: 20,
                  overflow: 'hidden',
                  border: '1.5px solid #F5EDE8',
                  boxShadow: '0 4px 18px rgba(0,0,0,0.05)',
                  transition: 'transform 0.25s',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ height: 180, overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={p.image || p.img}
                    alt={p.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span style={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    background: p.category === 'veg' ? '#059669' : '#EF4444',
                    color: '#fff',
                    padding: '3px 10px',
                    borderRadius: 14,
                    fontSize: '0.72rem',
                    fontWeight: 800,
                  }}>
                    {p.category === 'veg' ? '🌿 Veg' : '🍗 Non-Veg'}
                  </span>
                </div>

                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ margin: '0 0 6px', fontWeight: 800, fontSize: '1.05rem', color: '#1A0500' }}>
                      {p.name}
                    </h3>
                    <p style={{ color: '#777', fontSize: '0.8rem', lineHeight: 1.5, margin: '0 0 14px' }}>
                      {(p.description || p.desc || '').slice(0, 75)}...
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#FF4D00', fontWeight: 900, fontSize: '1.2rem' }}>
                      ৳{p.basePrice || p.price || 299}
                    </span>
                    <Link
                      to={`/pizza/${p._id}`}
                      style={{
                        background: 'linear-gradient(135deg, #FF4D00, #FF8C42)',
                        color: '#fff',
                        textDecoration: 'none',
                        padding: '7px 16px',
                        borderRadius: 16,
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        boxShadow: '0 3px 10px rgba(255,77,0,0.3)',
                      }}
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}
