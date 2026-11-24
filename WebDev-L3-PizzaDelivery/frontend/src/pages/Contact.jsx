import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      return toast.error('Please fill in all required fields')
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      toast.success('🎉 Thank you! Your message has been sent. We will get back to you shortly!')
    }, 600)
  }

  const contactCards = [
    {
      icon: '📞',
      title: 'Call Hotline (24/7)',
      detail: '+880 1712-345678',
      sub: 'Toll-free customer & delivery support',
      link: 'tel:+8801712345678',
      color: '#FF4D00',
    },
    {
      icon: '✉️',
      title: 'Email Us',
      detail: 'support@pizzahub.com',
      sub: 'Replies within 30 minutes guaranteed',
      link: 'mailto:support@pizzahub.com',
      color: '#10B981',
    },
    {
      icon: '📍',
      title: 'Central Hub',
      detail: 'Gulshan 2, Road 11',
      sub: 'Dhaka - 1212, Bangladesh',
      link: '#',
      color: '#6366F1',
    },
    {
      icon: '⏰',
      title: 'Kitchen Hours',
      detail: '10:00 AM – 1:00 AM',
      sub: 'Open 7 days a week including holidays',
      link: '#',
      color: '#F59E0B',
    },
  ]

  const faqs = [
    {
      q: 'How fast is the delivery guarantee?',
      a: 'We guarantee 30-minute delivery from the moment your payment is confirmed. If your pizza arrives late, your next pizza is on us!',
    },
    {
      q: 'Can I customize any pizza with the 4-step builder?',
      a: 'Absolutely! Our Custom Pizza Builder allows you to choose your Crust, Sauce, Gourmet Cheese, and unlimited fresh farm Vegetables with real-time price calculation.',
    },
    {
      q: 'Do you cater for office parties and large corporate events?',
      a: 'Yes, we handle orders of up to 500+ pizzas for birthday parties, university fests, and corporate events. Contact us using the form for party discounts!',
    },
    {
      q: 'How can I track my live order status?',
      a: 'After ordering, visit the "My Orders" tab on the Navbar. Our real-time Socket.IO tracker shows you every status from "Order Received" to "In Kitchen" and "Sent to Delivery".',
    },
  ]

  return (
    <div style={{ background: '#FFF8F3', minHeight: '100vh', color: '#1A0500', fontFamily: "'Segoe UI', system-ui, sans-serif", overflowX: 'hidden' }}>
      
      {/* ════════════ HERO BANNER ════════════ */}
      <section style={{
        background: 'linear-gradient(135deg, #1A0500 0%, #350A00 50%, #150200 100%)',
        padding: 'clamp(3.5rem, 7vw, 5.5rem) 1.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1600&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.12,
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 780, margin: '0 auto' }}>
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
            marginBottom: 16,
          }}>
            WE ARE HERE FOR YOU
          </span>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
            fontWeight: 900,
            color: '#fff',
            lineHeight: 1.15,
            margin: '0 0 14px',
          }}>
            Get In Touch With <br />
            <span style={{
              background: 'linear-gradient(135deg, #FF4D00, #FF8C42)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              PizzaHub Team 🍕
            </span>
          </h1>

          <p style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
            lineHeight: 1.6,
            maxWidth: 620,
            margin: '0 auto',
          }}>
            Have questions about an order, ingredient allergies, party catering, or just want to tell us how much you loved your slice? We are always listening.
          </p>
        </div>
      </section>

      {/* ════════════ QUICK CONTACT CARDS ════════════ */}
      <section style={{ maxWidth: 1140, margin: '-2.5rem auto 0', padding: '0 1.25rem', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
          {contactCards.map((c, idx) => (
            <div
              key={idx}
              style={{
                background: '#fff',
                borderRadius: 20,
                padding: '24px',
                boxShadow: '0 10px 35px rgba(0,0,0,0.06)',
                border: '1.5px solid #F5EDE8',
                transition: 'transform 0.25s, box-shadow 0.25s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 35px rgba(0,0,0,0.06)' }}
            >
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: c.color + '18',
                border: `1.5px solid ${c.color}35`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                marginBottom: 14,
              }}>
                {c.icon}
              </div>
              <p style={{ margin: '0 0 4px', fontSize: '0.8rem', color: '#888', fontWeight: 700, textTransform: 'uppercase' }}>
                {c.title}
              </p>
              <h3 style={{ margin: '0 0 6px', fontSize: '1.1rem', fontWeight: 900, color: '#1A0500' }}>
                {c.detail}
              </h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#777' }}>
                {c.sub}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════ FORM & FAQ GRID ════════════ */}
      <section style={{ maxWidth: 1140, margin: '5rem auto', padding: '0 1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'flex-start' }}>
          
          {/* Contact Form Card */}
          <div style={{
            background: '#fff',
            borderRadius: 24,
            padding: 'clamp(1.8rem, 4vw, 2.8rem)',
            boxShadow: '0 12px 45px rgba(0,0,0,0.07)',
            border: '1.5px solid #F5EDE8',
          }}>
            <span style={{ color: '#FF4D00', fontWeight: 800, fontSize: '0.82rem', letterSpacing: 1.5, textTransform: 'uppercase' }}>
              DIRECT MESSAGE
            </span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1A0500', margin: '6px 0 16px' }}>
              Send Us A Message ✉️
            </h2>

            {submitted ? (
              <div style={{
                background: '#ECFDF5',
                border: '1.5px solid #A7F3D0',
                borderRadius: 16,
                padding: '2rem',
                textAlign: 'center',
              }}>
                <div style={{ width: 64, height: 64, background: '#10B981', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, margin: '0 auto 16px' }}>
                  ✓
                </div>
                <h3 style={{ fontWeight: 900, color: '#065F46', margin: '0 0 8px', fontSize: '1.4rem' }}>
                  Message Received!
                </h3>
                <p style={{ color: '#047857', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 20px' }}>
                  Thank you for reaching out, <strong>{form.name}</strong>. Our guest relations team has received your inquiry and will reach back to <strong>{form.email}</strong> shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false)
                    setForm({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' })
                  }}
                  style={{
                    background: 'linear-gradient(135deg,#FF4D00,#FF8C42)',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 24px',
                    borderRadius: 10,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.84rem', color: '#555', marginBottom: 6 }}>Your Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Shakib Al Hasan"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #EDE0D8', fontSize: '0.92rem', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.84rem', color: '#555', marginBottom: 6 }}>Email Address *</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      required
                      style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #EDE0D8', fontSize: '0.92rem', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.84rem', color: '#555', marginBottom: 6 }}>Phone (Optional)</label>
                    <input
                      type="tel"
                      placeholder="+880 1712-345678"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #EDE0D8', fontSize: '0.92rem', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.84rem', color: '#555', marginBottom: 6 }}>Topic / Subject</label>
                  <select
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #EDE0D8', fontSize: '0.92rem', outline: 'none', background: '#fff' }}
                  >
                    <option value="General Inquiry">General Inquiry ❓</option>
                    <option value="Order Tracking Feedback">Order Tracking & Feedback 📦</option>
                    <option value="Event Catering & Bulk Order">Event Catering & Bulk Party Order 🎉</option>
                    <option value="Business Partnership">Partnership & Franchise 🤝</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.84rem', color: '#555', marginBottom: 6 }}>Message *</label>
                  <textarea
                    rows="4"
                    placeholder="Tell us what you're thinking, how we can help, or your pizza order feedback..."
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    required
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #EDE0D8', fontSize: '0.92rem', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: loading ? '#ccc' : 'linear-gradient(135deg, #FF4D00, #FF8C42)',
                    color: '#fff',
                    border: 'none',
                    padding: '15px',
                    borderRadius: 12,
                    fontWeight: 900,
                    fontSize: '1rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 6px 20px rgba(255,77,0,0.35)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    marginTop: 6,
                  }}
                >
                  {loading ? 'Submitting Message...' : 'Send Message Now 🚀'}
                </button>
              </form>
            )}
          </div>

          {/* FAQ & Support Section */}
          <div>
            <span style={{ color: '#FF4D00', fontWeight: 800, fontSize: '0.82rem', letterSpacing: 1.5, textTransform: 'uppercase' }}>
              INSTANT ANSWERS
            </span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1A0500', margin: '6px 0 20px' }}>
              Frequently Asked Questions 💡
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  style={{
                    background: '#fff',
                    borderRadius: 18,
                    padding: '20px 22px',
                    boxShadow: '0 4px 18px rgba(0,0,0,0.05)',
                    border: '1.5px solid #F5EDE8',
                  }}
                >
                  <h4 style={{ margin: '0 0 8px', fontWeight: 800, color: '#1A0500', fontSize: '0.98rem' }}>
                    {faq.q}
                  </h4>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.88rem', lineHeight: 1.6 }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick Delivery Map Pill */}
            <div style={{
              background: 'linear-gradient(135deg, #1A0500, #3D0A00)',
              borderRadius: 20,
              padding: '24px',
              marginTop: 22,
              color: '#fff',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <span style={{ fontSize: 24 }}>🛵</span>
                <h4 style={{ margin: 0, fontWeight: 900, fontSize: '1.1rem' }}>Active Express Delivery Zones</h4>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', margin: '0 0 14px' }}>
                We deliver sizzling hot within 30 minutes across all primary hubs:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['Gulshan', 'Banani', 'Dhanmondi', 'Uttara', 'Bashundhara', 'Mirpur DOHS', 'Mohakhali'].map(zone => (
                  <span
                    key={zone}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      padding: '4px 12px',
                      borderRadius: 20,
                      fontSize: '0.78rem',
                      fontWeight: 700,
                    }}
                  >
                    📍 {zone}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  )
}
