import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../utils/api'

const banners = [
  {
    id: 1,
    heading1: "Taste The Real",
    heading2: "Pizza Magic 🍕",
    subtitle: "Stone-baked artisanal crusts, farm-fresh ingredients, and bubbling melted mozzarella perfection delivered piping hot in 30 minutes.",
    offer: "🎉 20% OFF FIRST ORDER",
    badge: "FRESH & HOT",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1600&q=95",
    accent: "#FF4D00",
    plateImage: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=90",
    plateTitle: "Margherita Con Basilico",
    plateTag: "NEAPOLITAN ORIGINAL",
    plateDesc: "San Marzano plum tomatoes, fresh sweet basil & golden bubbly mozzarella.",
    platePrice: 299,
  },
  {
    id: 2,
    heading1: "Craft Your Dream",
    heading2: "Custom Pizza 🛠️",
    subtitle: "4 simple steps: Pick your crust, signature sauce, artisan cheese, and mountain of toppings. Dynamic live price, zero compromises.",
    offer: "🧀 B1G1 WEEKEND SPECIAL",
    badge: "CUSTOM BUILDER",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1600&q=95",
    accent: "#FF6B00",
    plateImage: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&q=90",
    plateTitle: "Smoky BBQ Supreme",
    plateTag: "CHEESE BURST CRUST",
    plateDesc: "Molten cheese burst rim with tender smoked chicken, onions & hickory BBQ glaze.",
    platePrice: 399,
  },
  {
    id: 3,
    heading1: "Wood Fired Authentic",
    heading2: "Italian Goodness 🪵",
    subtitle: "Made with 100% whole milk mozzarella, 48-hour cold-fermented sourdough, and sun-ripened Italian plum tomatoes.",
    offer: "🚀 FREE 30-MIN DELIVERY",
    badge: "CHEF SPECIAL",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1600&q=95",
    accent: "#E63946",
    plateImage: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800&q=90",
    plateTitle: "Tuscan Garden Harvest",
    plateTag: "100% ORGANIC VEGGIE",
    plateDesc: "Wild mushrooms, kalamata olives, sweet bell peppers & herb infused olive oil.",
    platePrice: 349,
  },
]

const initialPizzas = [
  {
    _id: "p1",
    name: "Margherita Classic",
    price: 299,
    category: "veg",
    rating: 4.9,
    orders: "2.4k",
    tag: "Bestseller",
    tagBg: "#10B981",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&q=90",
    desc: "San Marzano sauce, fresh buffalo mozzarella, fragrant sweet basil, extra virgin olive oil.",
    ingredients: ["Thin Crust", "Tomato Basil", "Mozzarella", "Fresh Basil"],
  },
  {
    _id: "p2",
    name: "Smoky BBQ Chicken",
    price: 399,
    category: "non-veg",
    rating: 4.8,
    orders: "1.9k",
    tag: "🌶️ Spicy",
    tagBg: "#EF4444",
    image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&q=90",
    desc: "Hickory-smoked BBQ chicken breast, red onions, gouda cheese blend, and fresh cilantro.",
    ingredients: ["Thick Crust", "BBQ Sauce", "Cheddar", "Onions"],
  },
  {
    _id: "p3",
    name: "Garden Veggie Supreme",
    price: 349,
    category: "veg",
    rating: 4.7,
    orders: "1.5k",
    tag: "🌿 Pure Veg",
    tagBg: "#059669",
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&q=90",
    desc: "Crisp bell peppers, button mushrooms, black olives, sweet corn, and creamy cheddar.",
    ingredients: ["Wheat Crust", "Pesto", "Mozzarella", "Bell Peppers", "Mushrooms"],
  },
  {
    _id: "p4",
    name: "Pepperoni Burst",
    price: 449,
    category: "non-veg",
    rating: 4.9,
    orders: "3.6k",
    tag: "🔥 Fan Favorite",
    tagBg: "#6366F1",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=90",
    desc: "Generous layers of crispy beef pepperoni, double mozzarella, and garlic butter glaze.",
    ingredients: ["Cheese Burst", "Tomato Basil", "Mozzarella", "Pepperoni"],
  },
  {
    _id: "p5",
    name: "Four Cheese Quattro",
    price: 419,
    category: "veg",
    rating: 4.9,
    orders: "1.8k",
    tag: "🧀 Cheese Pull",
    tagBg: "#F59E0B",
    image: "https://images.unsplash.com/photo-1573821663912-569905455b1a?w=600&q=90",
    desc: "Decadent four cheese blend: Mozzarella, aged English Cheddar, Parmesan & creamy Dutch Gouda.",
    ingredients: ["Cheese Burst", "Garlic White", "Mozzarella", "Parmesan", "Gouda"],
  },
  {
    _id: "p6",
    name: "Spicy Peri Peri Chicken",
    price: 429,
    category: "non-veg",
    rating: 4.8,
    orders: "2.1k",
    tag: "🌶️ Extra Hot",
    tagBg: "#DC2626",
    image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=600&q=90",
    desc: "Fiery peri-peri chicken chunks, spicy jalapenos, crunchy capsicum, and melted mozzarella drizzle.",
    ingredients: ["Thin Crust", "Spicy Arrabiata", "Mozzarella", "Jalapenos"],
  },
]

const features = [
  { icon: "⚡", title: "30-Min Fast Delivery", desc: "Piping hot delivery to your door or your next order is on us", color: "#FF4D00" },
  { icon: "🍅", title: "100% Fresh Daily", desc: "Farm-sourced vegetables and fresh daily hand-kneaded dough", color: "#10B981" },
  { icon: "🛠️", title: "4-Step Custom Builder", desc: "Choose crust, sauce, cheese, and unlimited fresh toppings", color: "#F59E0B" },
  { icon: "🛵", title: "Live Real-Time Tracking", desc: "Follow every status from In Kitchen to Sent for Delivery", color: "#6366F1" },
]

const builderSteps = [
  { step: "01", name: "Artisan Crust", icon: "🍞", desc: "5 choices: Thin, Thick, Cheese Burst, Wheat, Gluten-Free", color: "#FF4D00" },
  { step: "02", name: "Signature Sauce", icon: "🍅", desc: "Tomato Basil, BBQ, Pesto, Garlic White, Arrabiata", color: "#EF4444" },
  { step: "03", name: "Gourmet Cheese", icon: "🧀", desc: "Mozzarella, Cheddar, Parmesan, or Gouda", color: "#F59E0B" },
  { step: "04", name: "Farm Toppings", icon: "🥦", desc: "Mushrooms, Olives, Jalapenos, Peppers, Corn, and more", color: "#10B981" },
]

const crustCrafts = [
  {
    name: "Cheese Burst Crust",
    tag: "MOST POPULAR",
    badgeColor: "#FF4D00",
    desc: "Handmade crust filled with a hidden pocket of molten, oozing mozzarella and seasoned herbs that explodes with flavor in every bite.",
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=600&q=85",
    icon: "🧀",
    calories: "320 kcal / slice",
  },
  {
    name: "Thin Italian Sourdough",
    tag: "AUTHENTIC NEAPOLITAN",
    badgeColor: "#10B981",
    desc: "Slow-fermented for 48 hours to create crispy blistered leopard spots at 800°F. Super light, airy, and gentle on the stomach.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=85",
    icon: "🥖",
    calories: "210 kcal / slice",
  },
  {
    name: "100% Whole Wheat Health",
    tag: "FIBER RICH",
    badgeColor: "#F59E0B",
    desc: "Stone-ground whole wheat grain providing a rustic nutty flavor, rich dietary fiber, and zero refined white flour.",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=85",
    icon: "🌾",
    calories: "240 kcal / slice",
  },
  {
    name: "Gluten-Free Artisan Base",
    tag: "100% WHEAT FREE",
    badgeColor: "#6366F1",
    desc: "A crispy blend of cauliflower, almond flour and rice starch baked in a dedicated oven zone for gluten-sensitive foodies.",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=85",
    icon: "🛡️",
    calories: "220 kcal / slice",
  },
]

const reviews = [
  { name: "Rahul Ahmed", role: "Food Critic & Blogger", text: "The 4-step custom builder is brilliant! The cheese burst crust with spicy arrabiata and olives was absolute perfection. Delivered in 24 minutes flat!", stars: 5, color: "#FF4D00" },
  { name: "Priya Das", role: "Regular Customer (40+ Orders)", text: "PizzaHub is our family's weekly ritual. Real-time order tracking lets us know the exact minute it leaves the kitchen. Truly 10/10 service!", stars: 5, color: "#6366F1" },
  { name: "Sabbir Hossain", role: "Verified Foodie", text: "Best pizza in town by far. Crisp crust, authentic sauces, and generous cheese. Even test checkout worked smoothly like magic.", stars: 5, color: "#10B981" },
  { name: "Mehnaz Karim", role: "Corporate Event Host", text: "Ordered 25 large pizzas for our tech team hackathon. Every box was steaming hot, perfectly labeled, and devoured in under 15 minutes!", stars: 5, color: "#F59E0B" },
]

const faqs = [
  {
    q: "How does the 30-Minute Guaranteed Delivery work?",
    a: "The moment your payment is confirmed, our kitchen dispatch begins baking. If our thermal insulated delivery bike arrives even 1 minute past 30 minutes, you receive a free pizza coupon automatically!",
  },
  {
    q: "Can I customize both crust, sauce and multiple cheese types?",
    a: "Yes! Use our 4-Step Pizza Builder on the Navbar. Choose from 5 gourmet crusts, 5 artisan sauces, 4 cheese varieties, and unlimited fresh farm vegetables with live stock checking.",
  },
  {
    q: "What payment methods are supported?",
    a: "We support Razorpay Checkout (Cards, UPI, NetBanking) in Test Mode as well as instant Mock Payment with zero waiting time.",
  },
  {
    q: "How does real-time order tracking work?",
    a: "We use live WebSockets (Socket.IO). When the admin changes your order from 'Order Received' to 'In Kitchen' or 'Sent to Delivery', your screen updates live without refreshing!",
  },
]

export default function Home() {
  const [current, setCurrent] = useState(0)
  const [sliding, setSliding] = useState(false)
  const [pizzasList, setPizzasList] = useState(initialPizzas)
  const [filterCategory, setFilterCategory] = useState("all")
  const [partySize, setPartySize] = useState(4)
  const [hunger, setHunger] = useState("medium")
  const [openFaq, setOpenFaq] = useState(null)
  const timerRef = useRef(null)
  const navigate = useNavigate()

  // Fetch live pizzas from backend API
  useEffect(() => {
    api.get('/pizzas')
      .then(res => {
        if (res.data && res.data.length > 0) {
          const live = res.data.map((p, idx) => ({
            _id: p._id,
            name: p.name,
            price: p.basePrice || 299,
            category: p.category || 'veg',
            rating: (4.7 + (idx % 3) * 0.1).toFixed(1),
            orders: `${(1.5 + idx * 0.4).toFixed(1)}k`,
            tag: p.category === 'veg' ? '🌿 Veg Supreme' : '🍗 Chef Special',
            tagBg: p.category === 'veg' ? '#059669' : '#EF4444',
            image: p.image || initialPizzas[idx % initialPizzas.length].image,
            desc: p.description,
            ingredients: p.ingredients || [],
          }))
          setPizzasList(live)
        }
      })
      .catch(() => {})
  }, [])

  const startTimer = () => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => slide('next'), 5500)
  }

  useEffect(() => {
    startTimer()
    return () => clearInterval(timerRef.current)
  }, [current])

  const slide = (dir) => {
    if (sliding) return
    setSliding(true)
    setTimeout(() => {
      setCurrent(c => dir === 'next' ? (c + 1) % banners.length : (c - 1 + banners.length) % banners.length)
      setSliding(false)
    }, 400)
  }

  const copyCoupon = () => {
    navigator.clipboard.writeText('PIZZA2X')
    toast.success('🎉 Coupon code "PIZZA2X" copied to clipboard!')
  }

  const b = banners[current]

  // Filtered pizzas
  const filteredPizzas = pizzasList.filter(p => {
    if (filterCategory === 'veg') return p.category === 'veg'
    if (filterCategory === 'non-veg') return p.category === 'non-veg'
    return true
  })

  // Party calculator calculation
  const multiplier = hunger === 'light' ? 0.5 : hunger === 'medium' ? 0.75 : 1.0
  const recommendedPizzas = Math.max(1, Math.ceil(partySize * multiplier))
  const estimatedCost = recommendedPizzas * 370

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: '#FFF8F3', color: '#1A0500', overflowX: 'hidden' }}>

      {/* ══════════════════ HERO SLIDER BANNER ══════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: '94vh', display: 'flex', alignItems: 'center', background: '#0F0300', paddingTop: 80, paddingBottom: 40 }}>
        
        {/* Background Image Carousel with Ken Burns subtle motion */}
        <div
          key={current}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${b.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.55,
            transition: 'opacity 0.8s ease, transform 6s ease',
            transform: 'scale(1.04)',
          }}
        />

        {/* Cinematic Gradient Overlays: Dark on the left for text contrast, clear on right */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(15,3,0,0.92) 0%, rgba(15,3,0,0.78) 45%, rgba(15,3,0,0.40) 100%)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          background: 'linear-gradient(to top, #FFF8F3 0%, transparent 100%)',
        }} />

        {/* Ambient Glow Blob */}
        <div style={{
          position: 'absolute',
          width: 550,
          height: 550,
          background: `radial-gradient(circle, ${b.accent}45 0%, transparent 70%)`,
          top: '15%',
          left: '5%',
          borderRadius: '50%',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }} />

        {/* Content Container */}
        <div className="container relative z-10" style={{ maxWidth: 1220, margin: '0 auto', padding: '1rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          
          {/* Left Column: Text & CTAs */}
          <div style={{ animation: 'slideUp 0.7s ease' }}>
            
            {/* Offer Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: '1.4rem' }}>
              <span style={{
                background: b.accent,
                color: '#fff',
                padding: '6px 18px',
                borderRadius: 30,
                fontSize: '0.78rem',
                fontWeight: 900,
                letterSpacing: 1.5,
                boxShadow: `0 4px 18px ${b.accent}66`,
              }}>
                {b.badge}
              </span>
              <span style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,215,0,0.4)',
                color: '#FFD700',
                padding: '6px 18px',
                borderRadius: 30,
                fontSize: '0.82rem',
                fontWeight: 800,
                backdropFilter: 'blur(8px)',
              }}>
                {b.offer}
              </span>
            </div>

            {/* Main Headline */}
            <h1 style={{
              fontSize: 'clamp(1.9rem, 5.5vw, 4.2rem)',
              fontWeight: 900,
              color: '#fff',
              lineHeight: 1.1,
              letterSpacing: '-1px',
              marginBottom: '1.2rem',
              textShadow: '0 4px 30px rgba(0,0,0,0.6)',
            }}>
              {b.heading1} <br />
              <span style={{
                background: 'linear-gradient(135deg, #FF4D00, #FFA726)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
              }}>
                {b.heading2}
              </span>
            </h1>

            {/* Subtitle */}
            <p style={{
              color: 'rgba(255,255,255,0.80)',
              fontSize: 'clamp(1rem, 1.8vw, 1.22rem)',
              lineHeight: 1.65,
              marginBottom: '2.4rem',
              maxWidth: 540,
            }}>
              {b.subtitle}
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <Link
                to="/build"
                style={{
                  background: 'linear-gradient(135deg, #FF4D00, #FF8C42)',
                  color: '#fff',
                  padding: '16px 38px',
                  borderRadius: 50,
                  fontWeight: 900,
                  fontSize: '1.02rem',
                  textDecoration: 'none',
                  boxShadow: '0 8px 30px rgba(255,77,0,0.5)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'transform 0.25s, box-shadow 0.25s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)'; e.currentTarget.style.boxShadow = '0 12px 38px rgba(255,77,0,0.7)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(255,77,0,0.5)' }}
              >
                🛠️ Build Custom Pizza
              </Link>

              <Link
                to="/menu"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  border: '1.5px solid rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(10px)',
                  padding: '15px 32px',
                  borderRadius: 50,
                  fontWeight: 800,
                  fontSize: '1rem',
                  textDecoration: 'none',
                  transition: 'background 0.2s, transform 0.2s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                Explore Menu →
              </Link>
            </div>

            {/* Quick Metrics */}
            <div style={{ display: 'flex', gap: 24, marginTop: '2.8rem', paddingTop: '1.8rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                <p style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FFD700', margin: 0 }}>4.9★</p>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', margin: '2px 0 0' }}>12,000+ Reviews</p>
              </div>
              <div style={{ width: 1, background: 'rgba(255,255,255,0.15)' }} />
              <div>
                <p style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', margin: 0 }}>30 Min</p>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', margin: '2px 0 0' }}>Hot Delivery</p>
              </div>
              <div style={{ width: 1, background: 'rgba(255,255,255,0.15)' }} />
              <div>
                <p style={{ fontSize: '1.6rem', fontWeight: 900, color: '#10B981', margin: 0 }}>100%</p>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', margin: '2px 0 0' }}>Fresh Ingredients</p>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase Card (Dynamic per Slide) */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            
            {/* Glowing Backdrop Circle */}
            <div style={{
              position: 'absolute',
              width: 380,
              height: 380,
              background: `radial-gradient(circle, ${b.accent}45 0%, transparent 70%)`,
              borderRadius: '50%',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 0,
            }} />

            {/* Featured Pizza Round Plate Card */}
            <div style={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              maxWidth: 420,
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(255,255,255,0.15)',
              borderRadius: 30,
              padding: '24px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
              textAlign: 'center',
            }}>
              <div style={{
                width: 250,
                height: 250,
                borderRadius: '50%',
                overflow: 'hidden',
                margin: '0 auto 16px',
                border: '5px solid rgba(255,140,66,0.3)',
                boxShadow: '0 15px 40px rgba(255,77,0,0.35)',
                animation: 'float 4s ease-in-out infinite',
              }}>
                <img
                  key={b.plateImage}
                  src={b.plateImage}
                  alt={b.plateTitle}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <span style={{ background: 'rgba(255,77,0,0.2)', color: '#FF8C42', border: '1px solid rgba(255,77,0,0.4)', padding: '4px 14px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 800, letterSpacing: 1 }}>
                {b.plateTag}
              </span>
              <h3 style={{ color: '#fff', fontWeight: 900, fontSize: '1.45rem', margin: '10px 0 6px' }}>
                {b.plateTitle}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.84rem', margin: '0 0 16px' }}>
                {b.plateDesc}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.06)', padding: '10px 16px', borderRadius: 16 }}>
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem' }}>Starting at</span>
                  <p style={{ color: '#FF4D00', fontWeight: 900, fontSize: '1.35rem', margin: 0 }}>৳{b.platePrice}</p>
                </div>
                <Link
                  to="/build"
                  style={{
                    background: 'linear-gradient(135deg,#FF4D00,#FF8C42)',
                    color: '#fff',
                    textDecoration: 'none',
                    padding: '9px 20px',
                    borderRadius: 20,
                    fontWeight: 800,
                    fontSize: '0.84rem',
                    boxShadow: '0 4px 14px rgba(255,77,0,0.35)',
                  }}
                >
                  Customize Now ⚡
                </Link>
              </div>

              {/* Floating badges */}
              <div style={{
                position: 'absolute',
                top: 10,
                left: -15,
                background: 'rgba(16,185,129,0.95)',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: '0.75rem',
                fontWeight: 800,
                boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
              }}>
                ✓ 100% Real Cheese
              </div>

              <div style={{
                position: 'absolute',
                bottom: 25,
                right: -15,
                background: 'rgba(255,77,0,0.95)',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: '0.75rem',
                fontWeight: 800,
                boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
              }}>
                🔥 Hot in 30 Mins
              </div>
            </div>

          </div>

        </div>

        {/* Carousel Arrow Controls (Left / Right) */}
        <button
          onClick={() => { slide('prev'); startTimer() }}
          aria-label="Previous Slide"
          className="hero-arrow"
          style={{
            position: 'absolute',
            left: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.5)',
            border: '1.5px solid rgba(255,255,255,0.2)',
            color: '#fff',
            fontSize: '1.4rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20,
            backdropFilter: 'blur(8px)',
            transition: 'background 0.2s, transform 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,77,0,0.8)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.5)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)' }}
        >
          ‹
        </button>

        <button
          onClick={() => { slide('next'); startTimer() }}
          aria-label="Next Slide"
          className="hero-arrow"
          style={{
            position: 'absolute',
            right: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.5)',
            border: '1.5px solid rgba(255,255,255,0.2)',
            color: '#fff',
            fontSize: '1.4rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20,
            backdropFilter: 'blur(8px)',
            transition: 'background 0.2s, transform 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,77,0,0.8)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.5)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)' }}
        >
          ›
        </button>

        {/* Carousel Indicator Dots */}
        <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 10 }}>
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); startTimer() }}
              style={{
                width: i === current ? 38 : 10,
                height: 10,
                borderRadius: 5,
                background: i === current ? '#FF4D00' : 'rgba(255,255,255,0.4)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>

      </section>

      {/* ══════════════════ 3. CORE SERVICE PROMISES ══════════════════ */}
      <section style={{ background: '#fff', boxShadow: '0 6px 30px rgba(0,0,0,0.06)', position: 'relative', zIndex: 5 }}>
        <div style={{ maxWidth: 1220, margin: '0 auto', padding: '28px 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 14px', borderRadius: 16, transition: 'transform 0.2s' }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                background: f.color + '18',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                flexShrink: 0,
              }}>
                {f.icon}
              </div>
              <div>
                <p style={{ fontWeight: 800, color: '#1A0500', fontSize: '0.98rem', margin: 0 }}>{f.title}</p>
                <p style={{ color: '#777', fontSize: '0.8rem', margin: '3px 0 0', lineHeight: 1.4 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════ 4. 4-STEP PIZZA BUILDER SPOTLIGHT ══════════════════ */}
      <section style={{ maxWidth: 1220, margin: '0 auto', padding: '90px 1.5rem 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <span style={{
            background: 'linear-gradient(135deg, #FF4D00, #FF8C42)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800,
            fontSize: '0.85rem',
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}>
            EXCLUSIVE FULL-STACK FEATURE
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#1A0500', margin: '8px 0 12px' }}>
            Build Your Custom Pizza in 4 Steps 🛠️
          </h2>
          <p style={{ color: '#777', fontSize: '1.05rem', maxWidth: 640, margin: '0 auto' }}>
            Why settle for someone else's recipe? Create your own signature pizza layer by layer with real-time stock verification & dynamic price calculation.
          </p>
        </div>

        {/* 4 Steps Showcase Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 40 }}>
          {builderSteps.map((s, idx) => (
            <div
              key={s.step}
              style={{
                background: '#fff',
                borderRadius: 22,
                padding: '28px 22px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                border: '1.5px solid #F5EDE8',
                transition: 'transform 0.3s, box-shadow 0.3s, border-color 0.3s',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(255,77,0,0.12)'
                e.currentTarget.style.borderColor = '#FF8C42'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)'
                e.currentTarget.style.borderColor = '#F5EDE8'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: s.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                  {s.icon}
                </div>
                <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#EDE0D8' }}>
                  {s.step}
                </span>
              </div>
              <h3 style={{ fontWeight: 800, color: '#1A0500', fontSize: '1.15rem', marginBottom: 8 }}>
                Step {idx + 1}: {s.name}
              </h3>
              <p style={{ color: '#777', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Interactive Builder Teaser Card */}
        <div style={{
          background: 'linear-gradient(135deg, #1A0500, #3D0A00)',
          borderRadius: 26,
          padding: 'clamp(2rem, 4vw, 3.5rem)',
          color: '#fff',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 30,
          alignItems: 'center',
          boxShadow: '0 20px 60px rgba(26,5,0,0.3)',
        }}>
          <div>
            <span style={{ background: '#FF4D00', color: '#fff', padding: '4px 14px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 800 }}>
              STOCK-GUARDED BUILDER
            </span>
            <h3 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 900, margin: '14px 0 10px', lineHeight: 1.2 }}>
              Ready to create your culinary masterpiece?
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 24 }}>
              Out-of-stock ingredients are automatically guarded so your order is guaranteed fresh. Instant Razorpay Test Mode checkout with safe stock deduction.
            </p>
            <Link
              to="/build"
              style={{
                background: 'linear-gradient(135deg, #FF4D00, #FF8C42)',
                color: '#fff',
                padding: '14px 34px',
                borderRadius: 50,
                fontWeight: 800,
                textDecoration: 'none',
                display: 'inline-block',
                boxShadow: '0 8px 30px rgba(255,77,0,0.5)',
              }}
            >
              Start Building Pizza Now 🍕
            </Link>
          </div>

          <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ color: '#FFD700', fontSize: '0.85rem', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
              Live Price Calculator Demo
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left', maxWidth: 280, margin: '0 auto 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
                <span>🍞 Cheese Burst Crust</span>
                <span style={{ color: '#FF8C42', fontWeight: 700 }}>+৳80</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
                <span>🍅 Tomato Basil Sauce</span>
                <span style={{ color: '#FF8C42', fontWeight: 700 }}>+৳30</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
                <span>🧀 Fresh Mozzarella</span>
                <span style={{ color: '#FF8C42', fontWeight: 700 }}>+৳60</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
                <span>🥦 Mushrooms & Olives</span>
                <span style={{ color: '#FF8C42', fontWeight: 700 }}>+৳55</span>
              </div>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.2)', margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 900 }}>
                <span>Calculated Total</span>
                <span style={{ color: '#10B981' }}>৳225</span>
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>
              ✓ Automatically verified against live stock inventory
            </span>
          </div>
        </div>
      </section>

      {/* ══════════════════ 5. ARTISAN CRUST & DOUGH MASTERCLASS ══════════════════ */}
      <section style={{
        position: 'relative',
        background: '#150300',
        padding: '90px 1.5rem',
        color: '#fff',
        overflow: 'hidden',
      }}>
        {/* Background Flour & Dough Ambience */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.12,
        }} />
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '5%',
          width: 500,
          height: 500,
          background: 'radial-gradient(circle, rgba(255,77,0,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1220, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 50px' }}>
            <span style={{ color: '#FF8C42', fontWeight: 800, fontSize: '0.82rem', letterSpacing: 2, textTransform: 'uppercase' }}>
              CRUST ARCHITECTURE
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, margin: '8px 0 14px' }}>
              The Science of The Perfect Crust 🌾
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.02rem', lineHeight: 1.6 }}>
              A pizza is only as legendary as its crust. Explore our 5 artisanal dough foundations, each cold-fermented and crafted for a unique texture profile.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {crustCrafts.map((c, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1.5px solid rgba(255,255,255,0.1)',
                  borderRadius: 24,
                  overflow: 'hidden',
                  backdropFilter: 'blur(10px)',
                  transition: 'transform 0.3s, border-color 0.3s, box-shadow 0.3s',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)'
                  e.currentTarget.style.borderColor = '#FF8C42'
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(255,77,0,0.2)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ height: 180, overflow: 'hidden', position: 'relative' }}>
                  <img src={c.image} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{
                    position: 'absolute', top: 12, left: 12,
                    background: c.badgeColor, color: '#fff',
                    fontSize: 10, fontWeight: 900, padding: '3px 10px', borderRadius: 20,
                  }}>
                    {c.tag}
                  </span>
                </div>
                <div style={{ padding: '22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 22 }}>{c.icon}</span>
                    <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.2rem', color: '#fff' }}>{c.name}</h3>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', lineHeight: 1.6, flex: 1, margin: '0 0 16px' }}>
                    {c.desc}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 12 }}>
                    <span style={{ color: '#FFD700', fontSize: '0.78rem', fontWeight: 700 }}>{c.calories}</span>
                    <Link
                      to="/build"
                      style={{ color: '#FF8C42', fontWeight: 800, fontSize: '0.82rem', textDecoration: 'none' }}
                    >
                      Bake With This Crust →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ 6. POPULAR PIZZAS WITH CATEGORY FILTER ══════════════════ */}
      <section style={{ maxWidth: 1220, margin: '0 auto', padding: '90px 1.5rem 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{
            background: 'linear-gradient(135deg, #FF4D00, #FF8C42)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800,
            fontSize: '0.85rem',
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}>
            OUR CULINARY REPERTOIRE
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#1A0500', margin: '8px 0 10px' }}>
            Explore Popular Chef Recipes 🍕
          </h2>
          <p style={{ color: '#777', fontSize: '1.02rem' }}>
            Filter by your favorite flavor profile or pick an artisanal classic
          </p>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: '🍕 All Recipes' },
              { id: 'veg', label: '🌿 Veggie Specials' },
              { id: 'non-veg', label: '🍗 Meat & Chicken' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                style={{
                  padding: '9px 24px',
                  borderRadius: 30,
                  border: filterCategory === cat.id ? '2px solid #FF4D00' : '2px solid #EDE0D8',
                  background: filterCategory === cat.id ? '#FF4D00' : '#fff',
                  color: filterCategory === cat.id ? '#fff' : '#666',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: filterCategory === cat.id ? '0 4px 14px rgba(255,77,0,0.3)' : 'none',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 26 }}>
          {filteredPizzas.map((pizza) => (
            <div
              key={pizza._id}
              style={{
                background: '#fff',
                borderRadius: 22,
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                border: '1px solid #F5EDE8',
                transition: 'transform 0.3s, box-shadow 0.3s',
                display: 'flex',
                flexDirection: 'column',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.boxShadow = '0 18px 45px rgba(255,77,0,0.12)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'
              }}
            >
              {/* Pizza Image with Badges */}
              <div style={{ position: 'relative', height: 210, overflow: 'hidden' }}>
                <img
                  src={pizza.image}
                  alt={pizza.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s',
                  }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                />
                <span style={{
                  position: 'absolute', top: 12, left: 12,
                  background: pizza.tagBg,
                  color: '#fff', fontSize: 11, fontWeight: 800,
                  padding: '4px 12px', borderRadius: 20,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                }}>
                  {pizza.tag}
                </span>
                <div style={{
                  position: 'absolute', top: 12, right: 12,
                  background: 'rgba(0,0,0,0.65)',
                  color: '#FFD700', fontSize: 12, fontWeight: 800,
                  padding: '4px 10px', borderRadius: 20,
                  backdropFilter: 'blur(4px)',
                }}>
                  ⭐ {pizza.rating}
                </div>
              </div>

              {/* Pizza Info */}
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontWeight: 800, color: '#1A0500', fontSize: '1.2rem', marginBottom: 6 }}>
                    {pizza.name}
                  </h3>
                  <p style={{ color: '#777', fontSize: '0.84rem', lineHeight: 1.5, marginBottom: 14 }}>
                    {pizza.desc}
                  </p>

                  {pizza.ingredients && pizza.ingredients.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 16 }}>
                      {pizza.ingredients.map((ing, idx) => (
                        <span key={idx} style={{ background: '#FFF8F4', border: '1px solid #FFE0D3', color: '#FF4D00', padding: '2px 8px', borderRadius: 8, fontSize: '0.72rem', fontWeight: 600 }}>
                          {ing}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
                    <span style={{ fontSize: '1.45rem', fontWeight: 900, color: '#FF4D00' }}>৳{pizza.price}</span>
                    <span style={{ color: '#aaa', fontSize: '0.78rem', fontWeight: 600 }}>{pizza.orders} ordered</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <Link
                      to="/menu"
                      style={{
                        textAlign: 'center',
                        padding: '9px',
                        borderRadius: 12,
                        border: '1.5px solid #EDE0D8',
                        color: '#666',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF4D00'; e.currentTarget.style.color = '#FF4D00' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#EDE0D8'; e.currentTarget.style.color = '#666' }}
                    >
                      View Details
                    </Link>
                    <Link
                      to="/build"
                      style={{
                        textAlign: 'center',
                        padding: '9px',
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, #FF4D00, #FF8C42)',
                        color: '#fff',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        textDecoration: 'none',
                        boxShadow: '0 3px 12px rgba(255,77,0,0.3)',
                        transition: 'transform 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      Customize 🛠️
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 44 }}>
          <Link
            to="/menu"
            style={{
              display: 'inline-block',
              border: '2px solid #FF4D00',
              color: '#FF4D00',
              padding: '13px 44px',
              borderRadius: 50,
              fontWeight: 800,
              textDecoration: 'none',
              fontSize: '0.98rem',
              transition: 'all 0.25s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#FF4D00'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#FF4D00' }}
          >
            Explore Complete Menu & Add Ons →
          </Link>
        </div>
      </section>

      {/* ══════════════════ 7. INTERACTIVE PARTY CALCULATOR WIDGET ══════════════════ */}
      <section style={{ maxWidth: 1140, margin: '0 auto 80px', padding: '0 1.5rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, #1A0500 0%, #2E0B00 100%)',
          borderRadius: 28,
          padding: 'clamp(1.8rem, 4vw, 3.5rem)',
          color: '#fff',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 36,
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div>
            <span style={{ background: '#FF4D00', color: '#fff', padding: '4px 14px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 800, letterSpacing: 1 }}>
              PARTY PLANNER TOOL
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900, margin: '14px 0 10px', lineHeight: 1.2 }}>
              Planning A Pizza Party? Let Us Calculate! 🍕🎉
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 24 }}>
              Never run out of slices again. Pick your group size and appetite level to get instant accurate pizza recommendations.
            </p>

            {/* People Picker */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#FF8C42', marginBottom: 8 }}>
                Number of Eaters: <span style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 900 }}>{partySize} People</span>
              </label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[2, 4, 6, 8, 12, 16, 20].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPartySize(n)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 10,
                      border: partySize === n ? '2px solid #FF4D00' : '1px solid rgba(255,255,255,0.2)',
                      background: partySize === n ? '#FF4D00' : 'rgba(255,255,255,0.06)',
                      color: '#fff',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Hunger Level Picker */}
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#FF8C42', marginBottom: 8 }}>
                Appetite Level:
              </label>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { id: 'light', label: '🥗 Light' },
                  { id: 'medium', label: '🍕 Standard' },
                  { id: 'heavy', label: '🦖 Big Eaters' },
                ].map(h => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => setHunger(h.id)}
                    style={{
                      flex: 1,
                      padding: '9px',
                      borderRadius: 10,
                      border: hunger === h.id ? '2px solid #10B981' : '1px solid rgba(255,255,255,0.2)',
                      background: hunger === h.id ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.06)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Calculator Output Card */}
          <div style={{
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(255,255,255,0.15)',
            borderRadius: 24,
            padding: '28px',
            textAlign: 'center',
          }}>
            <span style={{ fontSize: 44, display: 'inline-block', marginBottom: 6 }}>🍕📦</span>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', margin: '0 0 6px', fontWeight: 600 }}>RECOMMENDED ORDER</p>
            <h3 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#FFD700', margin: '0 0 4px' }}>
              {recommendedPizzas} Large Pizzas
            </h3>
            <p style={{ color: '#10B981', fontWeight: 700, fontSize: '0.9rem', margin: '0 0 18px' }}>
              Approx. {recommendedPizzas * 8} Delicious Slices Total
            </p>

            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 14, padding: '14px', marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>
                <span>Estimated Price:</span>
                <span style={{ color: '#fff', fontWeight: 800 }}>৳{estimatedCost}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                <span>Cost Per Person:</span>
                <span style={{ color: '#10B981', fontWeight: 800 }}>৳{Math.round(estimatedCost / partySize)}</span>
              </div>
            </div>

            <Link
              to="/menu"
              style={{
                display: 'block',
                background: 'linear-gradient(135deg, #FF4D00, #FF8C42)',
                color: '#fff',
                padding: '13px',
                borderRadius: 50,
                fontWeight: 900,
                textDecoration: 'none',
                boxShadow: '0 6px 20px rgba(255,77,0,0.4)',
              }}
            >
              Order Combo on Menu →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════ 8. PROMO CODE BANNER ══════════════════ */}
      <section style={{
        position: 'relative',
        backgroundImage: "url('https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=1600&q=90')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '90px 1.5rem',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(26,5,0,0.92) 0%, rgba(180,30,0,0.75) 100%)' }} />
        <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto', textAlign: 'center', color: '#fff' }}>
          <span style={{
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            color: '#1A1A1A',
            padding: '6px 22px', borderRadius: 25,
            fontSize: 12, fontWeight: 900, letterSpacing: 2,
            textTransform: 'uppercase',
          }}>
            ⚡ LIMITED TIME SPECIAL
          </span>
          <h2 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 900,
            margin: '22px 0 14px', lineHeight: 1.15,
            textShadow: '0 4px 25px rgba(0,0,0,0.5)',
          }}>
            Buy 1 Pizza, Get 1 FREE! 🎉
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: 28 }}>
            Available every Friday & Saturday for all registered food lovers.
          </p>

          {/* Interactive Coupon Box */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(10px)',
            border: '2px dashed #FFD700',
            borderRadius: 16,
            padding: '10px 18px',
            marginBottom: 30,
          }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFD700', letterSpacing: 3 }}>
              PIZZA2X
            </span>
            <button
              onClick={copyCoupon}
              style={{
                background: '#FFD700',
                color: '#1A0500',
                border: 'none',
                padding: '6px 14px',
                borderRadius: 10,
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              Copy Code 📋
            </button>
          </div>

          <div>
            <Link
              to="/build"
              style={{
                background: 'linear-gradient(135deg, #FF4D00, #FF8C42)',
                color: '#fff',
                padding: '16px 48px',
                borderRadius: 50,
                fontWeight: 900,
                fontSize: '1.05rem',
                textDecoration: 'none',
                boxShadow: '0 10px 40px rgba(255,77,0,0.55)',
                display: 'inline-block',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              Claim Your Offer Now 🔥
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════ 9. HOW PIZZAHUB WORKS ══════════════════ */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '90px 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <span style={{
            background: 'linear-gradient(135deg, #FF4D00, #FF8C42)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800,
            fontSize: '0.85rem',
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}>
            FAST & SEAMLESS
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, color: '#1A0500', margin: '8px 0' }}>
            How PizzaHub Works 🚀
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32 }}>
          {[
            { step: '01', icon: '🛒', title: 'Pick or Build', desc: 'Choose from our curated signature menu or craft your custom pizza in 4 easy steps.', color: '#FF4D00' },
            { step: '02', icon: '💳', title: 'Test Mode Checkout', desc: 'Secure payment with Razorpay or instant test mode payment with safe stock reservation.', color: '#6366F1' },
            { step: '03', icon: '🛵', title: 'Live Order Tracking', desc: 'Watch real-time status updates from Order Received to In Kitchen to Sent for Delivery.', color: '#10B981' },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: '#fff',
                borderRadius: 22,
                padding: '36px 24px',
                textAlign: 'center',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                border: '1.5px solid #F5EDE8',
                transition: 'transform 0.3s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{
                width: 86,
                height: 86,
                borderRadius: '50%',
                background: item.color + '15',
                border: `3px solid ${item.color}35`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 34,
                margin: '0 auto 20px',
                position: 'relative',
              }}>
                {item.icon}
                <span style={{
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  background: item.color,
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 900,
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {item.step}
                </span>
              </div>
              <h3 style={{ fontWeight: 800, color: '#1A0500', fontSize: '1.2rem', marginBottom: 10 }}>{item.title}</h3>
              <p style={{ color: '#777', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════ 10. REVIEWS & TESTIMONIALS ══════════════════ */}
      <section style={{ background: 'linear-gradient(135deg, #FFF0E6 0%, #FFE4D6 100%)', padding: '90px 1.5rem' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <span style={{
              background: 'linear-gradient(135deg, #FF4D00, #FF8C42)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800,
              fontSize: '0.85rem',
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}>
              CUSTOMER REVIEWS
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, color: '#1A0500', margin: '8px 0' }}>
              What Foodies Say About Us ❤️
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {reviews.map((r, i) => (
              <div
                key={i}
                style={{
                  background: '#fff',
                  borderRadius: 22,
                  padding: '30px 26px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  borderTop: `5px solid ${r.color}`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.3s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div>
                  <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                    {[...Array(r.stars)].map((_, j) => (
                      <span key={j} style={{ color: '#FFB800', fontSize: 18 }}>★</span>
                    ))}
                  </div>
                  <p style={{ color: '#444', fontSize: '0.94rem', lineHeight: 1.7, marginBottom: 22, fontStyle: 'italic' }}>
                    "{r.text}"
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 16, borderTop: '1px solid #F5EDE8' }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${r.color}, ${r.color}99)`,
                    color: '#fff', fontWeight: 900, fontSize: 18,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {r.name[0]}
                  </div>
                  <div>
                    <p style={{ fontWeight: 800, color: '#1A0500', fontSize: '0.92rem', margin: 0 }}>{r.name}</p>
                    <p style={{ color: '#999', fontSize: '0.76rem', margin: '2px 0 0' }}>{r.role} • <span style={{ color: '#10B981', fontWeight: 700 }}>✓ Verified Buyer</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ 11. FAQ ACCORDION SECTION ══════════════════ */}
      <section style={{ maxWidth: 880, margin: '0 auto', padding: '90px 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{ color: '#FF4D00', fontWeight: 800, fontSize: '0.85rem', letterSpacing: 2, textTransform: 'uppercase' }}>
            GOT QUESTIONS?
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, color: '#1A0500', margin: '8px 0 10px' }}>
            Frequently Asked Questions 💡
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              style={{
                background: '#fff',
                borderRadius: 18,
                border: openFaq === idx ? '2px solid #FF4D00' : '1.5px solid #EDE0D8',
                overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                style={{
                  width: '100%',
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontWeight: 800, color: '#1A0500', fontSize: '1.02rem' }}>
                  {faq.q}
                </span>
                <span style={{ fontSize: '1.2rem', color: '#FF4D00', fontWeight: 900 }}>
                  {openFaq === idx ? '−' : '+'}
                </span>
              </button>
              {openFaq === idx && (
                <div style={{ padding: '0 24px 20px', color: '#666', fontSize: '0.92rem', lineHeight: 1.7, borderTop: '1px solid #F5EDE8', paddingTop: 14 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════ 12. FOOTER CTA & LINKS ══════════════════ */}
      <footer style={{
        background: 'linear-gradient(180deg, #1A0500 0%, #0F0300 100%)',
        color: '#fff',
        padding: '80px 1.5rem 30px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow Blob */}
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700,
          height: 350,
          background: 'radial-gradient(ellipse, rgba(255,77,0,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          
          {/* Big Header CTA */}
          <div style={{ textAlign: 'center', marginBottom: 60, paddingBottom: 50, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.4rem)', fontWeight: 900, marginBottom: 14, lineHeight: 1.15 }}>
              Ready for Your Ultimate Slice? 🍕
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem', marginBottom: 32, maxWidth: 540, margin: '0 auto 32px' }}>
              Fresh hand-tossed crust, signature sauce, and cheese pull you'll never forget.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/build"
                style={{
                  background: 'linear-gradient(135deg, #FF4D00, #FF8C42)',
                  color: '#fff',
                  padding: '16px 44px',
                  borderRadius: 50,
                  fontWeight: 900,
                  fontSize: '1.02rem',
                  textDecoration: 'none',
                  boxShadow: '0 8px 30px rgba(255,77,0,0.45)',
                }}
              >
                🛠️ Build Pizza Now
              </Link>
              <Link
                to="/orders"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  border: '1.5px solid rgba(255,255,255,0.25)',
                  padding: '16px 36px',
                  borderRadius: 50,
                  fontWeight: 800,
                  fontSize: '1rem',
                  textDecoration: 'none',
                }}
              >
                Track My Orders 📦
              </Link>
            </div>
          </div>

          {/* Links Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40, marginBottom: 50 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #FF4D00, #FF8C42)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🍕</div>
                <span style={{ fontWeight: 900, fontSize: '1.3rem', color: '#fff' }}>Pizza<span style={{ color: '#FF8C42' }}>Hub</span></span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Full-Stack Pizza Ordering & Inventory Management platform built for Oasis Infobyte Level 3 Task 1.
              </p>
            </div>

            <div>
              <h4 style={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem', marginBottom: 14 }}>Customer Links</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.85rem' }}>
                <li><Link to="/menu" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>Pizza Menu</Link></li>
                <li><Link to="/build" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>Custom Pizza Builder</Link></li>
                <li><Link to="/about" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>About PizzaHub</Link></li>
                <li><Link to="/contact" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>Contact & Support</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem', marginBottom: 14 }}>Management & Admin</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.85rem' }}>
                <li><Link to="/admin/login" style={{ color: '#FF8C42', textDecoration: 'none', fontWeight: 700 }}>🛡️ Admin Portal Login</Link></li>
                <li><Link to="/admin" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>Inventory & Stock Dashboard</Link></li>
                <li><Link to="/admin" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>Order Status Dispatcher</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem', marginBottom: 14 }}>Store Hours</h4>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
                Everyday: 10:00 AM – 1:00 AM<br />
                Delivery Radius: Citywide (30 Mins)<br />
                Support: support@pizzahub.com
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
            © 2026 PizzaHub • OASIS INFOBYTE Web Development & Designing Level 3 Task 1 • Made with ❤️
          </div>

        </div>
      </footer>

      {/* Global CSS keyframes for this page */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(2deg); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 640px) {
          .hero-arrow {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
