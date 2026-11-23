import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location])

  const transparent = isHome && !scrolled

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navLinks = [
    ['/', 'Home', '🏠'],
    ['/menu', 'Menu', '🍕'],
    ...(user && !isAdmin ? [
      ['/build', 'Build Pizza', '🔧'],
      ['/orders', 'My Orders', '📦'],
    ] : []),
    ...(isAdmin ? [['/admin', 'Admin', '⚙️']] : []),
  ]

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: transparent ? 'rgba(0,0,0,0)' : 'rgba(15,3,0,0.97)',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : 'none',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none',
        transition: 'all 0.4s ease',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#FF4D00,#FF8C42)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 3px 12px rgba(255,77,0,0.45)' }}>🍕</div>
            <span style={{ fontWeight: 900, fontSize: '1.2rem', color: '#fff', letterSpacing: '-0.3px' }}>Pizza<span style={{ color: '#FF8C42' }}>Hub</span></span>
          </Link>

          {/* Desktop Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="desktop-nav">
            {navLinks.map(([path, label]) => (
              <Link key={path} to={path} style={{
                color: location.pathname === path ? '#FF8C42' : 'rgba(255,255,255,0.75)',
                textDecoration: 'none', fontWeight: 600, fontSize: '0.88rem',
                padding: '7px 13px', borderRadius: 8,
                background: location.pathname === path ? 'rgba(255,77,0,0.15)' : 'transparent',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { if (location.pathname !== path) { e.target.style.color = '#fff'; e.target.style.background = 'rgba(255,255,255,0.08)' } }}
                onMouseLeave={e => { if (location.pathname !== path) { e.target.style.color = 'rgba(255,255,255,0.75)'; e.target.style.background = 'transparent' } }}
              >{label}</Link>
            ))}

            {/* Auth */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 4 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#FF4D00,#FF8C42)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 13, flexShrink: 0 }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.82rem', fontWeight: 600 }}>{user.name?.split(' ')[0]}</span>
                <button onClick={handleLogout} style={{ background: 'rgba(255,77,0,0.15)', border: '1.5px solid rgba(255,77,0,0.4)', color: '#FF8C42', padding: '6px 14px', borderRadius: 8, fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.target.style.background = '#FF4D00'; e.target.style.color = '#fff' }}
                  onMouseLeave={e => { e.target.style.background = 'rgba(255,77,0,0.15)'; e.target.style.color = '#FF8C42' }}>Logout</button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 7, marginLeft: 4 }}>
                <Link to="/login" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem', padding: '7px 14px', borderRadius: 8, border: '1.5px solid rgba(255,255,255,0.2)', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.target.style.borderColor = 'rgba(255,255,255,0.5)'; e.target.style.color = '#fff' }}
                  onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.2)'; e.target.style.color = 'rgba(255,255,255,0.8)' }}>Login</Link>
                <Link to="/register" style={{ background: 'linear-gradient(135deg,#FF4D00,#FF8C42)', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem', padding: '7px 16px', borderRadius: 8, boxShadow: '0 3px 12px rgba(255,77,0,0.35)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { e.target.style.transform = 'scale(1.04)'; e.target.style.boxShadow = '0 6px 20px rgba(255,77,0,0.5)' }}
                  onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 3px 12px rgba(255,77,0,0.35)' }}>Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-nav" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, color: '#fff', width: 40, height: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, cursor: 'pointer' }}>
            {menuOpen ? <span style={{ fontSize: 18 }}>✕</span> : [0,1,2].map(i => <span key={i} style={{ display: 'block', width: 18, height: 2, background: '#fff', borderRadius: 1 }} />)}
          </button>
        </div>

        {/* Mobile Dropdown */}
        <div style={{ maxHeight: menuOpen ? 500 : 0, overflow: 'hidden', transition: 'max-height 0.4s ease', background: 'rgba(15,3,0,0.98)', borderTop: menuOpen ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
          <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {navLinks.map(([path, label, icon]) => (
              <Link key={path} to={path} style={{ color: location.pathname === path ? '#FF8C42' : 'rgba(255,255,255,0.8)', textDecoration: 'none', fontWeight: 600, padding: '11px 14px', borderRadius: 10, background: location.pathname === path ? 'rgba(255,77,0,0.15)' : 'transparent', display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.95rem' }}>{icon} {label}</Link>
            ))}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', margin: '8px 0', paddingTop: 8 }}>
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#FF4D00,#FF8C42)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff' }}>{user.name?.charAt(0)}</div>
                    <div>
                      <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.88rem', margin: 0 }}>{user.name}</p>
                      <p style={{ color: '#888', fontSize: '0.75rem', margin: 0 }}>{user.email}</p>
                    </div>
                  </div>
                  <button onClick={handleLogout} style={{ background: 'rgba(255,77,0,0.2)', border: '1px solid rgba(255,77,0,0.4)', color: '#FF8C42', padding: '7px 14px', borderRadius: 8, fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>Logout</button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 8, padding: '4px 14px' }}>
                  <Link to="/login" style={{ flex: 1, textAlign: 'center', color: '#fff', textDecoration: 'none', padding: '10px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.2)', fontWeight: 700 }}>Login</Link>
                  <Link to="/register" style={{ flex: 1, textAlign: 'center', color: '#fff', textDecoration: 'none', padding: '10px', borderRadius: 10, background: 'linear-gradient(135deg,#FF4D00,#FF8C42)', fontWeight: 700 }}>Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <style>{`
        .desktop-nav { display: flex !important; }
        .mobile-nav { display: none !important; }
        @media (max-width: 768px) { .desktop-nav { display: none !important; } .mobile-nav { display: flex !important; } }
      `}</style>
    </>
  )
}
