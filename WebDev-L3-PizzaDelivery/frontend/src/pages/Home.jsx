import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const banners = [
  {
    id: 1,
    title: "Taste the Magic",
    subtitle: "Handcrafted pizzas delivered hot to your door in 30 minutes",
    offer: "🎉 20% OFF on First Order",
    badge: "NEW",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1400&q=90",
    accent: "#FF4D00",
  },
  {
    id: 2,
    title: "Cheesy Heaven",
    subtitle: "Triple cheese loaded with premium toppings you'll crave every day",
    offer: "🧀 Buy 1 Get 1 Free",
    badge: "HOT",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1400&q=90",
    accent: "#FF6B00",
  },
  {
    id: 3,
    title: "Wood Fired Bliss",
    subtitle: "Authentic Italian recipe, baked fresh in stone oven every time",
    offer: "🚀 Free Delivery Above ৳500",
    badge: "POPULAR",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1400&q=90",
    accent: "#E63946",
  },
]

const pizzas = [
  {
    name: "Margherita Classic",
    price: 299,
    rating: 4.9,
    orders: "2.1k",
    tag: "Bestseller",
    tagBg: "#10B981",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&q=90",
    desc: "Fresh tomato, mozzarella & basil",
  },
  {
    name: "BBQ Chicken",
    price: 399,
    rating: 4.8,
    orders: "1.8k",
    tag: "🌶️ Spicy",
    tagBg: "#EF4444",
    image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=500&q=90",
    desc: "Smoky BBQ sauce with grilled chicken",
  },
  {
    name: "Veggie Supreme",
    price: 349,
    rating: 4.7,
    orders: "1.2k",
    tag: "🌿 Veg",
    tagBg: "#059669",
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=500&q=90",
    desc: "Loaded with fresh garden veggies",
  },
  {
    name: "Pepperoni Feast",
    price: 449,
    rating: 4.9,
    orders: "3.2k",
    tag: "🆕 New",
    tagBg: "#6366F1",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=90",
    desc: "Double pepperoni with extra cheese",
  },
]

const features = [
  { icon: "⚡", title: "30 Min Delivery", desc: "Or your next order is free", color: "#FF4D00" },
  { icon: "🍅", title: "Fresh Daily", desc: "Never frozen, always fresh", color: "#10B981" },
  { icon: "🔒", title: "Secure Payment", desc: "100% safe checkout", color: "#6366F1" },
  { icon: "⭐", title: "4.9 Rated", desc: "By 10,000+ happy customers", color: "#F59E0B" },
]

const reviews = [
  { name: "Rahul Ahmed", role: "Food Blogger", text: "Absolutely the best pizza in town! Crispy crust, generous toppings — 10/10 every time.", stars: 5, color: "#FF4D00" },
  { name: "Priya Das", role: "Regular Customer", text: "Ordered 50+ times. Never once disappointed. The cheesy crust is unreal! 🧀", stars: 5, color: "#6366F1" },
  { name: "Sabbir Khan", role: "Pizza Lover", text: "Delivery is always on time and piping hot. Best value for money in the city.", stars: 5, color: "#10B981" },
]

export default function Home() {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState(null)
  const [sliding, setSliding] = useState(false)
  const [direction, setDirection] = useState('next')
  const timerRef = useRef(null)

  const startTimer = () => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => slide('next'), 5000)
  }

  useEffect(() => {
    startTimer()
    return () => clearInterval(timerRef.current)
  }, [current])

  const slide = (dir) => {
    if (sliding) return
    setDirection(dir)
    setSliding(true)
    setPrev(current)
    setTimeout(() => {
      setCurrent(c =>
        dir === 'next' ? (c + 1) % banners.length : (c - 1 + banners.length) % banners.length
      )
      setSliding(false)
      setPrev(null)
    }, 600)
  }

  const goTo = (i) => {
    if (i === current || sliding) return
    setDirection(i > current ? 'next' : 'prev')
    setSliding(true)
    setPrev(current)
    setTimeout(() => {
      setCurrent(i)
      setSliding(false)
      setPrev(null)
      startTimer()
    }, 600)
  }

  const b = banners[current]

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: '#FFF8F3' }}>

      {/* ══════════════════ HERO SLIDER ══════════════════ */}
      <section className="relative overflow-hidden" style={{ height: '92vh', minHeight: 560 }}>

        {/* Background image with crossfade */}
        <div
          key={current}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${b.image})`,
            animation: 'fadeIn 0.8s ease',
          }}
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.2) 100%)'
        }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)'
        }} />

        {/* Animated glow blob */}
        <div className="absolute rounded-full" style={{
          width: 500, height: 500,
          background: `radial-gradient(circle, ${b.accent}33 0%, transparent 70%)`,
          top: '10%', left: '-5%',
          animation: 'pulse 4s ease-in-out infinite',
        }} />

        {/* Content */}
        <div
          key={`content-${current}`}
          className="relative h-full flex items-center"
          style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem', animation: 'slideUp 0.7s ease' }}
        >
          <div style={{ maxWidth: 620 }}>

            {/* Badge */}
            <div className="flex items-center gap-3 mb-5">
              <span style={{
                background: b.accent,
                color: '#fff',
                padding: '4px 14px',
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 2,
              }}>{b.badge}</span>
              <span style={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
                color: '#FFD700',
                padding: '4px 16px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
                border: '1px solid rgba(255,215,0,0.3)',
              }}>{b.offer}</span>
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
              fontWeight: 900,
              color: '#fff',
              lineHeight: 1.05,
              marginBottom: '1.2rem',
              textShadow: '0 4px 30px rgba(0,0,0,0.5)',
            }}>{b.title}</h1>

            {/* Subtitle */}
            <p style={{
              fontSize: '1.15rem',
              color: 'rgba(255,255,255,0.75)',
              marginBottom: '2.5rem',
              lineHeight: 1.6,
              maxWidth: 480,
            }}>{b.subtitle}</p>

            {/* Buttons */}
            <div className="flex gap-4 flex-wrap">
              <Link to="/menu" style={{
                background: `linear-gradient(135deg, ${b.accent}, #FF8C42)`,
                color: '#fff',
                padding: '14px 36px',
                borderRadius: 50,
                fontWeight: 800,
                fontSize: '1rem',
                textDecoration: 'none',
                boxShadow: `0 8px 30px ${b.accent}66`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'inline-block',
              }}
                onMouseEnter={e => { e.target.style.transform = 'scale(1.06)'; e.target.style.boxShadow = `0 12px 40px ${b.accent}99` }}
                onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = `0 8px 30px ${b.accent}66` }}
              >
                Order Now 🍕
              </Link>
              <Link to="/menu" style={{
                background: 'rgba(255,255,255,0.12)',
                color: '#fff',
                padding: '14px 36px',
                borderRadius: 50,
                fontWeight: 700,
                fontSize: '1rem',
                textDecoration: 'none',
                border: '2px solid rgba(255,255,255,0.35)',
                backdropFilter: 'blur(8px)',
                transition: 'background 0.2s, transform 0.2s',
                display: 'inline-block',
              }}
                onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.22)'; e.target.style.transform = 'scale(1.04)' }}
                onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.12)'; e.target.style.transform = 'scale(1)' }}
              >
                Explore Menu →
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-10">
              {[['10k+', 'Happy Customers'], ['30 min', 'Avg Delivery'], ['4.9★', 'App Rating']].map(([val, label]) => (
                <div key={label}>
                  <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFD700' }}>{val}</p>
                  <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Arrows */}
        {['prev', 'next'].map(dir => (
          <button key={dir} onClick={() => { slide(dir); startTimer() }} style={{
            position: 'absolute',
            top: '50%',
            [dir === 'prev' ? 'left' : 'right']: 24,
            transform: 'translateY(-50%)',
            width: 48, height: 48,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            border: '2px solid rgba(255,255,255,0.3)',
            color: '#fff',
            fontSize: 20,
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.15)'}
          >{dir === 'prev' ? '‹' : '›'}</button>
        ))}

        {/* Dots */}
        <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
          {banners.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} style={{
              width: i === current ? 32 : 10,
              height: 10,
              borderRadius: 5,
              background: i === current ? b.accent : 'rgba(255,255,255,0.4)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }} />
          ))}
        </div>

        {/* Slide number */}
        <div style={{
          position: 'absolute', bottom: 28, right: 32,
          color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600,
        }}>
          <span style={{ color: '#fff', fontWeight: 800 }}>{String(current + 1).padStart(2, '0')}</span>
          {' / '}{String(banners.length).padStart(2, '0')}
        </div>
      </section>

      {/* ══════════════════ FEATURES BAR ══════════════════ */}
      <section style={{ background: '#fff', boxShadow: '0 4px 30px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
          {features.map((f, i) => (
            <div key={i} className="group" style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 16px', borderRadius: 14,
              transition: 'background 0.2s',
              cursor: 'default',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#FFF5F0'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: 50, height: 50, borderRadius: 14,
                background: f.color + '18',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, flexShrink: 0,
                transition: 'transform 0.2s',
              }}>{f.icon}</div>
              <div>
                <p style={{ fontWeight: 700, color: '#1A1A1A', fontSize: '0.9rem' }}>{f.title}</p>
                <p style={{ color: '#888', fontSize: '0.78rem', marginTop: 2 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════ POPULAR PIZZAS ══════════════════ */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <span style={{
            background: 'linear-gradient(135deg, #FF4D00, #FF8C42)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            fontWeight: 700, fontSize: '0.8rem', letterSpacing: 3, textTransform: 'uppercase',
          }}>Most Loved</span>
          <h2 style={{ fontSize: '2.6rem', fontWeight: 900, color: '#1A1A1A', margin: '8px 0 12px', lineHeight: 1.15 }}>
            Popular Pizzas 🍕
          </h2>
          <p style={{ color: '#888', fontSize: '1rem' }}>Handcrafted with love, baked fresh every order</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
          {pizzas.map((pizza, i) => (
            <div key={i} style={{
              background: '#fff',
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              cursor: 'pointer',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.12)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.07)' }}
            >
              {/* Image */}
              <div style={{ position: 'relative', overflow: 'hidden', height: 200 }}>
                <img src={pizza.image} alt={pizza.name} style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  transition: 'transform 0.5s',
                }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                />
                <span style={{
                  position: 'absolute', top: 12, left: 12,
                  background: pizza.tagBg,
                  color: '#fff', fontSize: 11, fontWeight: 700,
                  padding: '4px 12px', borderRadius: 20,
                }}>{pizza.tag}</span>
                <div style={{
                  position: 'absolute', top: 12, right: 12,
                  background: 'rgba(0,0,0,0.5)',
                  color: '#FFD700', fontSize: 12, fontWeight: 700,
                  padding: '4px 10px', borderRadius: 20,
                  backdropFilter: 'blur(4px)',
                }}>⭐ {pizza.rating}</div>
              </div>

              {/* Info */}
              <div style={{ padding: '16px 18px 20px' }}>
                <h3 style={{ fontWeight: 800, color: '#1A1A1A', fontSize: '1.05rem', marginBottom: 4 }}>{pizza.name}</h3>
                <p style={{ color: '#999', fontSize: '0.82rem', marginBottom: 12 }}>{pizza.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FF4D00' }}>৳{pizza.price}</span>
                    <span style={{ color: '#bbb', fontSize: '0.75rem', marginLeft: 6 }}>{pizza.orders} orders</span>
                  </div>
                  <Link to="/menu" style={{
                    background: 'linear-gradient(135deg, #FF4D00, #FF8C42)',
                    color: '#fff',
                    padding: '8px 18px',
                    borderRadius: 25,
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(255,77,0,0.35)',
                    transition: 'transform 0.2s',
                  }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.07)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  >Add +</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link to="/menu" style={{
            display: 'inline-block',
            border: '2px solid #FF4D00',
            color: '#FF4D00',
            padding: '13px 40px',
            borderRadius: 50,
            fontWeight: 700,
            textDecoration: 'none',
            fontSize: '0.95rem',
            transition: 'all 0.25s',
          }}
            onMouseEnter={e => { e.target.style.background = '#FF4D00'; e.target.style.color = '#fff' }}
            onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#FF4D00' }}
          >View Full Menu →</Link>
        </div>
      </section>

      {/* ══════════════════ OFFER BANNER ══════════════════ */}
      <section style={{
        position: 'relative',
        backgroundImage: "url('https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=1400&q=90')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '90px 2rem',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(20,0,0,0.88) 0%, rgba(180,30,0,0.65) 100%)' }} />
        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <span style={{
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            color: '#1A1A1A',
            padding: '6px 20px', borderRadius: 25,
            fontSize: 12, fontWeight: 800, letterSpacing: 2,
            textTransform: 'uppercase',
          }}>⚡ Limited Time Deal</span>
          <h2 style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
            fontWeight: 900, color: '#fff',
            margin: '20px 0 12px', lineHeight: 1.15,
            textShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}>Buy 1 Pizza, Get 1 Absolutely FREE! 🎉</h2>
          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '1.05rem', marginBottom: 32 }}>
            Every Friday & Saturday • Use code:{' '}
            <span style={{
              background: 'rgba(255,215,0,0.2)',
              border: '1.5px solid #FFD700',
              color: '#FFD700', padding: '2px 12px',
              borderRadius: 8, fontWeight: 800, letterSpacing: 1,
            }}>PIZZA2X</span>
          </p>
          <Link to="/menu" style={{
            background: 'linear-gradient(135deg, #FF4D00, #FF8C42)',
            color: '#fff',
            padding: '16px 48px',
            borderRadius: 50, fontWeight: 800,
            fontSize: '1.05rem', textDecoration: 'none',
            boxShadow: '0 10px 40px rgba(255,77,0,0.5)',
            display: 'inline-block',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
            onMouseEnter={e => { e.target.style.transform = 'scale(1.06)'; e.target.style.boxShadow = '0 14px 50px rgba(255,77,0,0.65)' }}
            onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 10px 40px rgba(255,77,0,0.5)' }}
          >Grab the Deal 🔥</Link>
        </div>
      </section>

      {/* ══════════════════ HOW IT WORKS ══════════════════ */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <span style={{
            background: 'linear-gradient(135deg, #FF4D00, #FF8C42)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            fontWeight: 700, fontSize: '0.8rem', letterSpacing: 3, textTransform: 'uppercase',
          }}>Simple & Fast</span>
          <h2 style={{ fontSize: '2.6rem', fontWeight: 900, color: '#1A1A1A', margin: '8px 0' }}>
            How It Works
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 32, position: 'relative' }}>
          {[
            { step: '01', icon: '🛒', title: 'Pick Your Pizza', desc: 'Browse our fresh menu and choose your favorites', color: '#FF4D00' },
            { step: '02', icon: '💳', title: 'Quick Payment', desc: 'Pay securely with UPI, card or cash on delivery', color: '#6366F1' },
            { step: '03', icon: '🚀', title: 'Fast Delivery', desc: 'Get your hot pizza in 30 minutes or less', color: '#10B981' },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center' }}
              onMouseEnter={e => e.currentTarget.querySelector('.step-icon').style.transform = 'scale(1.12) rotate(-5deg)'}
              onMouseLeave={e => e.currentTarget.querySelector('.step-icon').style.transform = 'scale(1) rotate(0deg)'}
            >
              <div className="step-icon" style={{
                width: 90, height: 90, borderRadius: '50%',
                background: item.color + '15',
                border: `3px solid ${item.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 36, margin: '0 auto 16px',
                position: 'relative',
                transition: 'transform 0.3s',
              }}>
                {item.icon}
                <span style={{
                  position: 'absolute', top: -8, right: -8,
                  background: `linear-gradient(135deg, ${item.color}, ${item.color}cc)`,
                  color: '#fff', fontSize: 11, fontWeight: 800,
                  width: 28, height: 28, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{item.step}</span>
              </div>
              <h3 style={{ fontWeight: 800, color: '#1A1A1A', fontSize: '1.1rem', marginBottom: 8 }}>{item.title}</h3>
              <p style={{ color: '#888', fontSize: '0.88rem', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════ REVIEWS ══════════════════ */}
      <section style={{ background: 'linear-gradient(135deg, #FFF5F0, #FFF0E6)', padding: '80px 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <span style={{
              background: 'linear-gradient(135deg, #FF4D00, #FF8C42)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              fontWeight: 700, fontSize: '0.8rem', letterSpacing: 3, textTransform: 'uppercase',
            }}>Testimonials</span>
            <h2 style={{ fontSize: '2.6rem', fontWeight: 900, color: '#1A1A1A', margin: '8px 0' }}>
              What They Say ❤️
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 24 }}>
            {reviews.map((r, i) => (
              <div key={i} style={{
                background: '#fff',
                borderRadius: 20, padding: '28px 24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                borderTop: `4px solid ${r.color}`,
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(0,0,0,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)' }}
              >
                <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
                  {[...Array(r.stars)].map((_, j) => (
                    <span key={j} style={{ color: '#FFB800', fontSize: 18 }}>★</span>
                  ))}
                </div>
                <p style={{ color: '#444', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>
                  "{r.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${r.color}, ${r.color}99)`,
                    color: '#fff', fontWeight: 800, fontSize: 18,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{r.name[0]}</div>
                  <div>
                    <p style={{ fontWeight: 700, color: '#1A1A1A', fontSize: '0.9rem' }}>{r.name}</p>
                    <p style={{ color: '#aaa', fontSize: '0.78rem' }}>{r.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ FOOTER CTA ══════════════════ */}
      <section style={{
        background: 'linear-gradient(135deg, #1A0500, #2D0A00)',
        padding: '80px 2rem', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 600, height: 300,
          background: 'radial-gradient(ellipse, rgba(255,77,0,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative' }}>
          <p style={{ color: '#FF8C42', fontWeight: 700, fontSize: '0.85rem', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>
            What Are You Waiting For?
          </p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, color: '#fff', marginBottom: 16, lineHeight: 1.15 }}>
            Hungry? Let's Fix That! 🍕
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', marginBottom: 40 }}>
            Fresh pizzas, made with love, delivered hot to your door
          </p>
          <Link to="/menu" style={{
            background: 'linear-gradient(135deg, #FF4D00, #FF8C42)',
            color: '#fff',
            padding: '16px 52px',
            borderRadius: 50, fontWeight: 800,
            fontSize: '1.05rem', textDecoration: 'none',
            boxShadow: '0 10px 40px rgba(255,77,0,0.45)',
            display: 'inline-block',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
            onMouseEnter={e => { e.target.style.transform = 'scale(1.07)'; e.target.style.boxShadow = '0 16px 50px rgba(255,77,0,0.65)' }}
            onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 10px 40px rgba(255,77,0,0.45)' }}
          >Order Your Pizza Now</Link>
          <p style={{ color: 'rgba(255,255,255,0.2)', marginTop: 48, fontSize: '0.82rem' }}>
            © 2025 PizzaHub • Made with ❤️ for pizza lovers
          </p>
        </div>
      </section>

      {/* ══════════════════ KEYFRAME STYLES ══════════════════ */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 1; }
        }
      `}</style>

    </div>
  )
}
