import { Link } from 'react-router-dom'

export default function About() {
  const pillars = [
    {
      icon: '🌾',
      title: '48-Hour Cold Fermented Dough',
      desc: 'Our secret sourdough recipe undergoes a slow 48-hour fermentation process, creating an airy, light crust with crispy blistered edges that is naturally easy to digest.',
      color: '#FF4D00',
    },
    {
      icon: '🍅',
      title: 'Sun-Ripened Plum Tomatoes',
      desc: 'Imported San Marzano tomatoes, picked at peak sweetness and crushed with fresh garlic, sea salt, and aromatic sweet basil for pure authentic vibrancy.',
      color: '#EF4444',
    },
    {
      icon: '🧀',
      title: '100% Whole Milk Mozzarella',
      desc: 'No processed cheese blends or fillers. Just pure, silky artisanal whole milk mozzarella and smoked gouda that melts into that unforgettable stretchy pull.',
      color: '#F59E0B',
    },
    {
      icon: '🚀',
      title: 'Guaranteed 30-Minute Delivery',
      desc: 'Direct from our 800°F stone oven into thermal heat-lock delivery containers, arriving sizzling hot at your door every single time.',
      color: '#10B981',
    },
  ]

  const stats = [
    { number: '500k+', label: 'Pizzas Delivered', icon: '🍕' },
    { number: '4.9★', label: 'Average Rating (12k+ Reviews)', icon: '⭐' },
    { number: '30 Min', label: 'Guaranteed Delivery Time', icon: '⚡' },
    { number: '100%', label: 'Fresh Daily Ingredients', icon: '🌿' },
  ]

  const chefs = [
    {
      name: 'Antonio Rossi',
      role: 'Executive Master Pizzaiolo',
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=500&q=80',
      bio: '3rd generation Neapolitan pizzaiolo with 18 years crafting stone-baked crusts across Europe and Asia.',
      specialty: 'Wood-Fired Neapolitan Crust',
    },
    {
      name: 'Elena Silva',
      role: 'Head of Culinary & Sauce Artisan',
      image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=500&q=80',
      bio: 'Trained in Tuscany, Elena crafts our 5 signature sauces from farm-fresh herbs and slow-simmered tomatoes.',
      specialty: 'Artisan Garlic White & Pesto',
    },
    {
      name: 'Tanvir Chowdhury',
      role: 'Quality & Operations Director',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80',
      bio: 'Ensuring every single pizza meets strict temperature, hygiene, and ingredient standards before dispatch.',
      specialty: 'Thermal Heat-Lock Logistics',
    },
  ]

  return (
    <div style={{ background: '#FFF8F3', minHeight: '100vh', color: '#1A0500', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      
      {/* ════════════ HERO BANNER ════════════ */}
      <section style={{
        background: 'linear-gradient(135deg, #1A0500 0%, #350A00 50%, #150200 100%)',
        padding: 'clamp(4rem, 8vw, 6.5rem) 1.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1600&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15,
        }} />
        <div style={{
          position: 'absolute',
          width: 500,
          height: 500,
          background: 'radial-gradient(circle, rgba(255,77,0,0.3) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto' }}>
          <span style={{
            background: 'rgba(255,140,66,0.18)',
            border: '1px solid rgba(255,140,66,0.4)',
            color: '#FF8C42',
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: 2,
            padding: '6px 18px',
            borderRadius: 30,
            display: 'inline-block',
            marginBottom: 18,
          }}>
            OUR STORY & CRAFT
          </span>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5.5vw, 3.8rem)',
            fontWeight: 900,
            color: '#fff',
            lineHeight: 1.15,
            margin: '0 0 16px',
          }}>
            Baked With Passion, <br />
            <span style={{
              background: 'linear-gradient(135deg, #FF4D00, #FF8C42)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Delivered With Care 🍕
            </span>
          </h1>

          <p style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 'clamp(0.95rem, 1.8vw, 1.2rem)',
            lineHeight: 1.7,
            maxWidth: 680,
            margin: '0 auto 28px',
          }}>
            PizzaHub was born out of a simple obsession: to free pizza from commercial shortcuts and bring back the true magic of hand-stretched, stone-baked artisan craftsmanship.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/build"
              style={{
                background: 'linear-gradient(135deg, #FF4D00, #FF8C42)',
                color: '#fff',
                padding: '14px 34px',
                borderRadius: 50,
                fontWeight: 800,
                fontSize: '0.98rem',
                textDecoration: 'none',
                boxShadow: '0 8px 25px rgba(255,77,0,0.45)',
              }}
            >
              🛠️ Build Custom Pizza
            </Link>
            <Link
              to="/menu"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1.5px solid rgba(255,255,255,0.25)',
                color: '#fff',
                padding: '14px 30px',
                borderRadius: 50,
                fontWeight: 800,
                fontSize: '0.98rem',
                textDecoration: 'none',
              }}
            >
              Explore Menu →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════ STATS BANNER ════════════ */}
      <section style={{ maxWidth: 1140, margin: '-2.5rem auto 0', padding: '0 1.25rem', position: 'relative', zIndex: 10 }}>
        <div style={{
          background: '#fff',
          borderRadius: 22,
          padding: '28px 20px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
          border: '1.5px solid #F5EDE8',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 20,
          textAlign: 'center',
        }}>
          {stats.map((s, idx) => (
            <div key={idx} style={{ padding: '8px' }}>
              <span style={{ fontSize: 28 }}>{s.icon}</span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FF4D00', margin: '6px 0 2px' }}>
                {s.number}
              </h3>
              <p style={{ color: '#777', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════ OUR STORY SECTION ════════════ */}
      <section style={{ maxWidth: 1140, margin: '5rem auto 0', padding: '0 1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
          
          {/* Image Showcase */}
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '100%',
              height: 420,
              borderRadius: 26,
              overflow: 'hidden',
              boxShadow: '0 15px 45px rgba(0,0,0,0.12)',
              position: 'relative',
            }}>
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&q=85"
                alt="PizzaHub Kitchen"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            
            {/* Floating Highlight Card */}
            <div style={{
              position: 'absolute',
              bottom: -20,
              right: -15,
              background: '#1A0500',
              color: '#fff',
              padding: '16px 22px',
              borderRadius: 18,
              boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,140,66,0.3)',
              maxWidth: 240,
            }}>
              <p style={{ color: '#FF8C42', fontWeight: 900, fontSize: '1.3rem', margin: 0 }}>800°F</p>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.78rem', margin: '4px 0 0', lineHeight: 1.4 }}>
                Authentic volcanic stone ovens lock in maximum flavor and crunch.
              </p>
            </div>
          </div>

          {/* Text Content */}
          <div>
            <span style={{ color: '#FF4D00', fontWeight: 800, fontSize: '0.85rem', letterSpacing: 1.5, textTransform: 'uppercase' }}>
              THE PIZZAHUB PHILOSOPHY
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 900, color: '#1A0500', lineHeight: 1.2, margin: '8px 0 18px' }}>
              We Believe Pizza Is An Art, Not An Assembly Line 🎨
            </h2>
            <p style={{ color: '#666', fontSize: '0.96rem', lineHeight: 1.8, marginBottom: 16 }}>
              At PizzaHub, we refused to settle for rubbery crusts and artificial powders. We began with a single mission: to blend Italian tradition with modern convenience. Every single dough ball is hand-kneaded, rested in controlled temperatures, and baked upon ordering.
            </p>
            <p style={{ color: '#666', fontSize: '0.96rem', lineHeight: 1.8, marginBottom: 24 }}>
              With our revolutionary **4-Step Custom Pizza Builder**, you are the chef. Whether you crave a Gluten-Free crust with Spicy Arrabiata or a Cheese Burst crust overflowing with gourmet mushrooms and jalapenos — we bring your dream slice to life.
            </p>

            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>✓</div>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Zero Preservatives</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>✓</div>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>100% Halal Certified</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ════════════ 4 PILLARS SECTION ════════════ */}
      <section style={{ maxWidth: 1140, margin: '6rem auto 0', padding: '0 1.25rem' }}>
        <div style={{ textAlign: 'center', maxWidth: 650, margin: '0 auto 3rem' }}>
          <span style={{ color: '#FF4D00', fontWeight: 800, fontSize: '0.85rem', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            WHAT MAKES US DIFFERENT
          </span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 900, color: '#1A0500', margin: '8px 0 12px' }}>
            The 4 Pillars of Gourmet Excellence ⭐
          </h2>
          <p style={{ color: '#888', fontSize: '0.95rem' }}>
            Every pizza that leaves our oven passes through four uncompromising quality standards.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
          {pillars.map((p, i) => (
            <div
              key={i}
              style={{
                background: '#fff',
                borderRadius: 22,
                padding: '28px 24px',
                boxShadow: '0 6px 25px rgba(0,0,0,0.05)',
                border: '1.5px solid #F5EDE8',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 25px rgba(0,0,0,0.05)' }}
            >
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: p.color + '18',
                border: `1.5px solid ${p.color}35`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 26,
                marginBottom: 18,
              }}>
                {p.icon}
              </div>
              <h3 style={{ fontWeight: 900, fontSize: '1.15rem', color: '#1A0500', marginBottom: 10 }}>
                {p.title}
              </h3>
              <p style={{ color: '#777', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════ CHEF TEAM HIGHLIGHT ════════════ */}
      <section style={{ maxWidth: 1140, margin: '6rem auto', padding: '0 1.25rem' }}>
        <div style={{ textAlign: 'center', maxWidth: 650, margin: '0 auto 3rem' }}>
          <span style={{ color: '#FF4D00', fontWeight: 800, fontSize: '0.85rem', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            MEET THE ARTISANS
          </span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 900, color: '#1A0500', margin: '8px 0 12px' }}>
            The Masterminds Behind The Crust 🧑‍🍳
          </h2>
          <p style={{ color: '#888', fontSize: '0.95rem' }}>
            Our kitchen is led by culinary veterans who treat every crust as a masterpiece.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 26 }}>
          {chefs.map((c, i) => (
            <div
              key={i}
              style={{
                background: '#fff',
                borderRadius: 22,
                overflow: 'hidden',
                boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                border: '1.5px solid #F5EDE8',
              }}
            >
              <div style={{ height: 260, overflow: 'hidden' }}>
                <img src={c.image} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '22px' }}>
                <span style={{ color: '#FF4D00', fontWeight: 800, fontSize: '0.78rem', letterSpacing: 1 }}>
                  {c.role.toUpperCase()}
                </span>
                <h3 style={{ margin: '4px 0 8px', fontWeight: 900, color: '#1A0500', fontSize: '1.25rem' }}>
                  {c.name}
                </h3>
                <p style={{ color: '#777', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 14 }}>
                  {c.bio}
                </p>
                <div style={{ background: '#FFF8F3', padding: '8px 12px', borderRadius: 10, border: '1px dashed #FF8C42' }}>
                  <span style={{ fontSize: '0.75rem', color: '#555', fontWeight: 700 }}>Specialty: </span>
                  <span style={{ fontSize: '0.78rem', color: '#FF4D00', fontWeight: 800 }}>{c.specialty}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════ CTA BANNER ════════════ */}
      <section style={{ maxWidth: 1140, margin: '0 auto 5rem', padding: '0 1.25rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, #1A0500 0%, #3D0A00 100%)',
          borderRadius: 28,
          padding: 'clamp(2.5rem, 5vw, 4rem) 2rem',
          textAlign: 'center',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
        }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900, margin: '0 0 14px' }}>
            Craving Fresh Wood-Fired Pizza Tonight? 🍕
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', maxWidth: 580, margin: '0 auto 28px', lineHeight: 1.6 }}>
            Customize your crust, sauce, cheese and toppings in 4 simple steps and watch your order arrive sizzling hot!
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/build"
              style={{
                background: 'linear-gradient(135deg, #FF4D00, #FF8C42)',
                color: '#fff',
                padding: '14px 36px',
                borderRadius: 50,
                fontWeight: 900,
                fontSize: '1rem',
                textDecoration: 'none',
                boxShadow: '0 8px 30px rgba(255,77,0,0.5)',
              }}
            >
              Start Building Now →
            </Link>
            <Link
              to="/contact"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1.5px solid rgba(255,255,255,0.3)',
                color: '#fff',
                padding: '14px 30px',
                borderRadius: 50,
                fontWeight: 800,
                fontSize: '1rem',
                textDecoration: 'none',
              }}
            >
              Contact Us 📞
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
