import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const banners = [
  {
    id: 1,
    title: "Taste The Real Pizza Magic",
    highlight: "Real Pizza Magic",
    subtitle: "Stone-baked artisanal crusts, farm-fresh ingredients, and melted cheese perfection delivered piping hot in 30 minutes.",
    offer: "🎉 20% OFF FIRST ORDER",
    badge: "FRESH & HOT",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1600&q=95",
    accent: "#FF4D00",
  },
  {
    id: 2,
    title: "Craft Your Dream Custom Pizza",
    highlight: "Custom Pizza",
    subtitle: "4 simple steps: Pick your crust, signature sauce, artisan cheese, and mountain of toppings. Dynamic price, zero compromises.",
    offer: "🧀 B1G1 WEEKEND SPECIAL",
    badge: "CUSTOM BUILDER",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1600&q=95",
    accent: "#FF6B00",
  },
  {
    id: 3,
    title: "Wood Fired Authentic Goodness",
    highlight: "Authentic Goodness",
    subtitle: "Made with 100% whole milk mozzarella, cold-fermented sourdough, and sun-ripened Italian plum tomatoes.",
    offer: "🚀 FREE 30-MIN DELIVERY",
    badge: "CHEF SPECIAL",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1600&q=95",
    accent: "#E63946",
  },
]

const pizzas = [
  {
    name: "Margherita Classic",
    price: 299,
    rating: 4.9,
    orders: "2.4k",
    tag: "Bestseller",
    tagBg: "#10B981",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&q=90",
    desc: "San Marzano sauce, fresh buffalo mozzarella, fragrant sweet basil, extra virgin olive oil.",
  },
  {
    name: "Smoky BBQ Chicken",
    price: 399,
    rating: 4.8,
    orders: "1.9k",
    tag: "🌶️ Spicy",
    tagBg: "#EF4444",
    image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&q=90",
    desc: "Hickory-smoked BBQ chicken breast, red onions, gouda cheese blend, and fresh cilantro.",
  },
  {
    name: "Garden Veggie Supreme",
    price: 349,
    rating: 4.7,
    orders: "1.5k",
    tag: "🌿 Pure Veg",
    tagBg: "#059669",
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&q=90",
    desc: "Crisp bell peppers, button mushrooms, black olives, sweet corn, and creamy cheddar.",
  },
  {
    name: "Pepperoni Burst",
    price: 449,
    rating: 4.9,
    orders: "3.6k",
    tag: "🔥 Fan Favorite",
    tagBg: "#6366F1",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=90",
    desc: "Generous layers of crispy beef pepperoni, double mozzarella, and garlic butter glaze.",
  },
]

const features = [
  { icon: "⚡", title: "30-Min Fast Delivery", desc: "Piping hot delivery to your door or your next order is on us", color: "#FF4D00" },
  { icon: "🍅", title: "100% Fresh Daily", desc: "Farm-sourced vegetables and fresh daily hand-kneaded dough", color: "#10B981" },
  { icon: "🛠️", title: "4-Step Custom Builder", desc: "Choose crust, sauce, cheese, and unlimited fresh toppings", color: "#F59E0B" },
  { icon: "🛵", title: "Live Real-Time Tracking", desc: "Follow every status from In Kitchen to Sent for Delivery", color: "#6366F1" },
]

const builderSteps = [
  { step: "01", name: "Artisan Crust", icon: "🍞", desc: "5 choices: Thin, Thick, Cheese Burst, Wheat, Gluten-Free" },
  { step: "02", name: "Signature Sauce", icon: "🍅", desc: "Tomato Basil, BBQ, Pesto, Garlic White, Arrabiata" },
  { step: "03", name: "Gourmet Cheese", icon: "🧀", desc: "Mozzarella, Cheddar, Parmesan, or Gouda" },
  { step: "04", name: "Farm Toppings", icon: "🥦", desc: "Mushrooms, Olives, Jalapenos, Peppers, Corn, and more" },
]

const reviews = [
  { name: "Rahul Ahmed", role: "Food Critic & Blogger", text: "The 4-step custom builder is brilliant! The cheese burst crust with spicy arrabiata and olives was absolute perfection. Delivered in 24 minutes flat!", stars: 5, color: "#FF4D00" },
  { name: "Priya Das", role: "Regular Customer (40+ Orders)", text: "PizzaHub is our family's weekly ritual. Real-time order tracking lets us know the exact minute it leaves the kitchen. Truly 10/10 service!", stars: 5, color: "#6366F1" },
  { name: "Sabbir Hossain", role: "Verified Foodie", text: "Best pizza in town by far. Crisp crust, authentic sauces, and generous cheese. Even test checkout worked smoothly like magic.", stars: 5, color: "#10B981" },
]

export default function Home() {
  const [current, setCurrent] = useState(0)
  const [sliding, setSliding] = useState(false)
  const timerRef = useRef(null)
  const navigate = useNavigate()

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

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: '#FFF8F3', color: '#1A0500' }}>

      {/* ══════════════════ HERO SECTION ══════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: '94vh', display: 'flex', alignItems: 'center', background: '#0F0300' }}>
        
        {/* Background Image Carousel */}
        <div
          key={current}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${b.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.42,
            transition: 'opacity 0.8s ease, transform 6s ease',
            transform: 'scale(1.04)',
          }}
        />

        {/* Cinematic Gradient Overlays */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 30% 50%, rgba(26,5,0,0.85) 0%, rgba(15,3,0,0.95) 75%)',
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
          background: `radial-gradient(circle, ${b.accent}40 0%, transparent 70%)`,
          top: '15%',
          left: '5%',
          borderRadius: '50%',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />

        {/* Content Container */}
        <div className="container relative z-10" style={{ maxWidth: 1220, margin: '0 auto', padding: '4rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          
          {/* Left Column: Text & CTAs */}
          <div style={{ animation: 'slideUp 0.7s ease' }}>
            
            {/* Offer Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: '1.4rem' }}>
              <span style={{
                background: b.accent,
                color: '#fff',
                padding: '5px 16px',
                borderRadius: 30,
                fontSize: '0.75rem',
                fontWeight: 900,
                letterSpacing: 1.5,
                boxShadow: `0 4px 15px ${b.accent}66`,
              }}>
                {b.badge}
              </span>
              <span style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,215,0,0.4)',
                color: '#FFD700',
                padding: '5px 16px',
                borderRadius: 30,
                fontSize: '0.8rem',
                fontWeight: 800,
                backdropFilter: 'blur(8px)',
              }}>
                {b.offer}
              </span>
            </div>

            {/* Main Headline */}
            <h1 style={{
              fontSize: 'clamp(2.4rem, 5.2vw, 4.4rem)',
              fontWeight: 900,
              color: '#fff',
              lineHeight: 1.08,
              letterSpacing: '-1px',
              marginBottom: '1.4rem',
              textShadow: '0 4px 30px rgba(0,0,0,0.6)',
            }}>
              Taste The Real <br />
              <span style={{
                background: 'linear-gradient(135deg, #FF4D00, #FFA726)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Pizza Magic 🍕
              </span>
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
              color: 'rgba(255,255,255,0.78)',
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
                  padding: '16px 36px',
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

          {/* Right Column: Hero Visual Showcase Card */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            
            {/* Glowing Backdrop Circle */}
            <div style={{
              position: 'absolute',
              width: 380,
              height: 380,
              background: 'radial-gradient(circle, rgba(255,77,0,0.35) 0%, transparent 70%)',
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
                margin: '0 auto 18px',
                border: '5px solid rgba(255,140,66,0.3)',
                boxShadow: '0 15px 40px rgba(255,77,0,0.35)',
                animation: 'float 4s ease-in-out infinite',
              }}>
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=90"
                  alt="Pizza Visual"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <span style={{ background: 'rgba(255,77,0,0.2)', color: '#FF8C42', border: '1px solid rgba(255,77,0,0.4)', padding: '3px 12px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 800, letterSpacing: 1 }}>
                CHEESE BURST CRUST
              </span>
              <h3 style={{ color: '#fff', fontWeight: 900, fontSize: '1.4rem', margin: '8px 0 4px' }}>
                Supreme Cheese Craver
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', margin: '0 0 16px' }}>
                Garlic herb butter crust filled with molten mozzarella & topped with smoked gouda.
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '10px 16px', borderRadius: 16 }}>
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem' }}>Starting at</span>
                  <p style={{ color: '#FF4D00', fontWeight: 900, fontSize: '1.3rem', margin: 0 }}>৳349</p>
                </div>
                <Link
                  to="/build"
                  style={{
                    background: 'linear-gradient(135deg,#FF4D00,#FF8C42)',
                    color: '#fff',
                    textDecoration: 'none',
                    padding: '8px 18px',
                    borderRadius: 20,
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    boxShadow: '0 4px 14px rgba(255,77,0,0.3)',
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
                background: 'rgba(16,185,129,0.92)',
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

        {/* Carousel controls */}
        <div style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 10 }}>
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); startTimer() }}
              style={{
                width: i === current ? 36 : 10,
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

      {/* ══════════════════ FEATURES HIGHLIGHT BAR ══════════════════ */}
      <section style={{ background: '#fff', boxShadow: '0 6px 30px rgba(0,0,0,0.06)', position: 'relative', zIndex: 5 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 14px', borderRadius: 14, transition: 'transform 0.2s' }}>
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
                <p style={{ fontWeight: 800, color: '#1A0500', fontSize: '0.95rem', margin: 0 }}>{f.title}</p>
                <p style={{ color: '#777', fontSize: '0.78rem', margin: '3px 0 0', lineHeight: 1.4 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════ 4-STEP PIZZA BUILDER SPOTLIGHT ══════════════════ */}
      <section style={{ maxWidth: 1220, margin: '0 auto', padding: '80px 1.5rem' }}>
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
                borderRadius: 20,
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
                <div style={{ width: 48, height: 48, borderRadius: 14, background: '#FFF0E6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
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

      {/* ══════════════════ POPULAR PIZZAS SECTION ══════════════════ */}
      <section style={{ maxWidth: 1220, margin: '0 auto', padding: '40px 1.5rem 80px' }}>
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
            MOST LOVED RECIPES
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#1A0500', margin: '8px 0 10px' }}>
            Popular Chef's Specialties 🍕
          </h2>
          <p style={{ color: '#777', fontSize: '1.02rem' }}>
            Handcrafted with love, baked fresh in stone ovens upon every order
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {pizzas.map((pizza, i) => (
            <div
              key={i}
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
                  <h3 style={{ fontWeight: 800, color: '#1A0500', fontSize: '1.15rem', marginBottom: 6 }}>
                    {pizza.name}
                  </h3>
                  <p style={{ color: '#777', fontSize: '0.84rem', lineHeight: 1.5, marginBottom: 18 }}>
                    {pizza.desc}
                  </p>
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
            Explore Complete Menu (15+ Items) →
          </Link>
        </div>
      </section>

      {/* ══════════════════ PROMO CODE BANNER ══════════════════ */}
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

      {/* ══════════════════ HOW IT WORKS (3 SIMPLE STEPS) ══════════════════ */}
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

      {/* ══════════════════ REVIEWS / TESTIMONIALS ══════════════════ */}
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
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

      {/* ══════════════════ FOOTER CTA & LINKS ══════════════════ */}
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
                <li><Link to="/orders" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>My Orders & Live Tracker</Link></li>
                <li><Link to="/login" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>Customer Login</Link></li>
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
                Everyday: 10:00 AM – 11:30 PM<br />
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
      `}</style>
    </div>
  )
}
