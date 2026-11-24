import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const hoverTimeoutRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    setDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false)
    }, 220)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false)
    setDropdownOpen(false)
  }, [location])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const transparent = isHome && !scrolled

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    toast.success('Logged out successfully')
    navigate('/')
  }

  // Base navigation links
  const navLinks = [
    ['/', 'Home', '🏠'],
    ['/menu', 'Menu', '🍕'],
    ['/build', 'Build Pizza', '🛠️'],
    ['/about', 'About Us', '✨'],
    ['/contact', 'Contact', '📞'],
    ...(user && !isAdmin ? [
      ['/orders', 'My Orders', '📦'],
    ] : []),
  ]

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: transparent ? 'rgba(0,0,0,0)' : 'rgba(15,3,0,0.97)',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.35)' : 'none',
        transition: 'all 0.35s ease',
      }}>
        <div style={{ maxWidth: 1220, margin: '0 auto', padding: '0 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 66 }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38,
              height: 38,
              background: 'linear-gradient(135deg,#FF4D00,#FF8C42)',
              borderRadius: 11,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              boxShadow: '0 4px 14px rgba(255,77,0,0.45)',
            }}>
              🍕
            </div>
            <span style={{ fontWeight: 900, fontSize: '1.25rem', color: '#fff', letterSpacing: '-0.3px' }}>
              Pizza<span style={{ color: '#FF8C42' }}>Hub</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} className="desktop-nav">
            {navLinks.map(([path, label]) => (
              <Link
                key={path}
                to={path}
                style={{
                  color: location.pathname === path ? '#FF8C42' : 'rgba(255,255,255,0.78)',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  padding: '8px 14px',
                  borderRadius: 10,
                  background: location.pathname === path ? 'rgba(255,77,0,0.15)' : 'transparent',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  if (location.pathname !== path) {
                    e.currentTarget.style.color = '#fff'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                  }
                }}
                onMouseLeave={e => {
                  if (location.pathname !== path) {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.78)'
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                {label}
              </Link>
            ))}

            {/* Profile Pill & Dropdown (When Logged In) */}
            {user ? (
              <div
                ref={dropdownRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ position: 'relative', marginLeft: 8 }}
              >
                
                {/* Profile Trigger Button */}
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 9,
                    background: dropdownOpen ? 'rgba(255,77,0,0.22)' : 'rgba(255,255,255,0.08)',
                    border: `1.5px solid ${dropdownOpen ? '#FF8C42' : 'rgba(255,255,255,0.15)'}`,
                    borderRadius: 30,
                    padding: '4px 14px 4px 5px',
                    cursor: 'pointer',
                    transition: 'all 0.25s',
                  }}
                  onMouseEnter={e => {
                    if (!dropdownOpen) e.currentTarget.style.borderColor = 'rgba(255,140,66,0.6)'
                  }}
                  onMouseLeave={e => {
                    if (!dropdownOpen) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                  }}
                >
                  {/* Avatar Circle */}
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: isAdmin
                      ? 'linear-gradient(135deg,#FF4D00,#E63946)'
                      : 'linear-gradient(135deg,#FF4D00,#FF8C42)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    color: '#fff',
                    fontSize: 13,
                    boxShadow: '0 2px 8px rgba(255,77,0,0.3)',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}>
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                      />
                    ) : (
                      user.name?.charAt(0).toUpperCase()
                    )}
                  </div>

                  <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 700 }}>
                    {user.name?.split(' ')[0]}
                  </span>

                  {isAdmin && (
                    <span style={{
                      background: 'rgba(239,68,68,0.2)',
                      color: '#F87171',
                      border: '1px solid rgba(239,68,68,0.4)',
                      padding: '1px 6px',
                      borderRadius: 12,
                      fontSize: '0.68rem',
                      fontWeight: 800,
                    }}>
                      ADMIN
                    </span>
                  )}

                  <span style={{
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '0.7rem',
                    transition: 'transform 0.2s',
                    transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}>
                    ▼
                  </span>
                </button>

                {/* Floating Profile Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 10px)',
                      right: 0,
                      width: 260,
                      background: 'rgba(26, 6, 1, 0.96)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,140,66,0.25)',
                      borderRadius: 18,
                      padding: '12px 8px',
                      boxShadow: '0 18px 45px rgba(0,0,0,0.6), 0 0 30px rgba(255,77,0,0.1)',
                      animation: 'slideUp 0.2s ease',
                      zIndex: 1100,
                    }}
                  >
                    
                    {/* User Info Header */}
                    <div style={{
                      padding: '10px 12px 12px',
                      borderBottom: '1px solid rgba(255,255,255,0.08)',
                      marginBottom: 8,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}>
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: isAdmin
                          ? 'linear-gradient(135deg,#FF4D00,#E63946)'
                          : 'linear-gradient(135deg,#FF4D00,#FF8C42)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        color: '#fff',
                        fontSize: 16,
                        overflow: 'hidden',
                        flexShrink: 0,
                        border: '2px solid rgba(255,140,66,0.5)',
                      }}>
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.currentTarget.style.display = 'none' }}
                          />
                        ) : (
                          user.name?.charAt(0).toUpperCase()
                        )}
                      </div>

                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ color: '#fff', fontWeight: 800, fontSize: '0.92rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user.name}
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.74rem', margin: '2px 0 5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user.email}
                        </p>
                        <span style={{
                          display: 'inline-block',
                          background: isAdmin ? 'rgba(239,68,68,0.18)' : 'rgba(16,185,129,0.18)',
                          color: isAdmin ? '#F87171' : '#34D399',
                          border: `1px solid ${isAdmin ? 'rgba(239,68,68,0.35)' : 'rgba(16,185,129,0.35)'}`,
                          padding: '2px 8px',
                          borderRadius: 12,
                          fontSize: '0.68rem',
                          fontWeight: 800,
                        }}>
                          {isAdmin ? '🛡️ Administrator' : '✓ Verified Customer'}
                        </span>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      
                      {/* My Profile */}
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 12px',
                          borderRadius: 10,
                          color: '#fff',
                          textDecoration: 'none',
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <span style={{ fontSize: 16 }}>👤</span>
                        <span>My Profile</span>
                      </Link>

                      {/* My Orders */}
                      <Link
                        to="/orders"
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 12px',
                          borderRadius: 10,
                          color: '#fff',
                          textDecoration: 'none',
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <span style={{ fontSize: 16 }}>📦</span>
                        <span>My Orders</span>
                      </Link>

                      {/* Admin Dashboard in Dropdown */}
                      {isAdmin ? (
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '10px 12px',
                            borderRadius: 10,
                            background: 'rgba(255,77,0,0.15)',
                            color: '#FF8C42',
                            textDecoration: 'none',
                            fontSize: '0.88rem',
                            fontWeight: 800,
                            transition: 'background 0.15s',
                            marginTop: 2,
                            border: '1px solid rgba(255,77,0,0.3)',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,77,0,0.28)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,77,0,0.15)'}
                        >
                          <span style={{ fontSize: 16 }}>🛡️</span>
                          <span>Admin Dashboard</span>
                        </Link>
                      ) : (
                        <Link
                          to="/admin/login"
                          onClick={() => setDropdownOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '10px 12px',
                            borderRadius: 10,
                            color: 'rgba(255,255,255,0.65)',
                            textDecoration: 'none',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                            e.currentTarget.style.color = '#FF8C42'
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent'
                            e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                          }}
                        >
                          <span style={{ fontSize: 15 }}>🔒</span>
                          <span>Admin Portal</span>
                        </Link>
                      )}

                      {/* Divider */}
                      <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '6px 4px' }} />

                      {/* Logout Button */}
                      <button
                        type="button"
                        onClick={handleLogout}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 12px',
                          borderRadius: 10,
                          background: 'transparent',
                          border: 'none',
                          color: '#F87171',
                          fontWeight: 700,
                          fontSize: '0.86rem',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.14)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <span style={{ fontSize: 16 }}>🚪</span>
                        <span>Logout</span>
                      </button>

                    </div>

                  </div>
                )}

              </div>
            ) : (
              /* Auth Buttons (When Not Logged In) */
              <div style={{ display: 'flex', gap: 8, marginLeft: 6 }}>
                <Link
                  to="/login"
                  style={{
                    color: 'rgba(255,255,255,0.85)',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    padding: '8px 16px',
                    borderRadius: 10,
                    border: '1.5px solid rgba(255,255,255,0.2)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'
                    e.currentTarget.style.color = '#fff'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.85)'
                  }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  style={{
                    background: 'linear-gradient(135deg,#FF4D00,#FF8C42)',
                    color: '#fff',
                    textDecoration: 'none',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    padding: '8px 18px',
                    borderRadius: 10,
                    boxShadow: '0 3px 12px rgba(255,77,0,0.35)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.03)'
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,77,0,0.5)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = '0 3px 12px rgba(255,77,0,0.35)'
                  }}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-nav"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 8,
              color: '#fff',
              width: 40,
              height: 40,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
              cursor: 'pointer',
            }}
          >
            {menuOpen ? (
              <span style={{ fontSize: 18, fontWeight: 800 }}>✕</span>
            ) : (
              [0, 1, 2].map(i => (
                <span key={i} style={{ display: 'block', width: 18, height: 2, background: '#fff', borderRadius: 1 }} />
              ))
            )}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        <div style={{
          maxHeight: menuOpen ? 520 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.35s ease',
          background: 'rgba(15,3,0,0.98)',
          borderTop: menuOpen ? '1px solid rgba(255,255,255,0.08)' : 'none',
        }}>
          <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {navLinks.map(([path, label, icon]) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMenuOpen(false)}
                style={{
                  color: location.pathname === path ? '#FF8C42' : 'rgba(255,255,255,0.85)',
                  textDecoration: 'none',
                  fontWeight: 700,
                  padding: '11px 14px',
                  borderRadius: 10,
                  background: location.pathname === path ? 'rgba(255,77,0,0.15)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: '0.95rem',
                }}
              >
                {icon} {label}
              </Link>
            ))}

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '8px 0', paddingTop: 8 }}>
              {user ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 14px',
                      borderRadius: 10,
                      background: 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      textDecoration: 'none',
                      fontWeight: 700,
                    }}
                  >
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg,#FF4D00,#FF8C42)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      flexShrink: 0,
                      fontSize: 12,
                      fontWeight: 800,
                    }}>
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none' }} />
                      ) : (
                        user.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span>My Profile ({user.name})</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 14px',
                        borderRadius: 10,
                        background: 'rgba(255,77,0,0.18)',
                        color: '#FF8C42',
                        textDecoration: 'none',
                        fontWeight: 800,
                      }}
                    >
                      <span>🛡️</span>
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    style={{
                      marginTop: 4,
                      background: 'rgba(239,68,68,0.18)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      color: '#F87171',
                      padding: '10px',
                      borderRadius: 10,
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                    }}
                  >
                    Logout 🚪
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 8, padding: '4px 0' }}>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      color: '#fff',
                      textDecoration: 'none',
                      padding: '10px',
                      borderRadius: 10,
                      border: '1.5px solid rgba(255,255,255,0.2)',
                      fontWeight: 700,
                    }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      color: '#fff',
                      textDecoration: 'none',
                      padding: '10px',
                      borderRadius: 10,
                      background: 'linear-gradient(135deg,#FF4D00,#FF8C42)',
                      fontWeight: 800,
                    }}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <style>{`
        .desktop-nav { display: flex !important; }
        .mobile-nav { display: none !important; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: flex !important; }
        }
      `}</style>
    </>
  )
}
