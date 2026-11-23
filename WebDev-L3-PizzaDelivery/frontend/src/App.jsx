import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import PizzaBuilder from './pages/PizzaBuilder'
import OrderSummary from './pages/OrderSummary'
import OrderHistory from './pages/OrderHistory'
import AdminDashboard from './pages/admin/Dashboard'
import AdminLogin from './pages/admin/AdminLogin'
import Navbar from './components/Navbar'

const NO_NAVBAR_ROUTES = ['/admin']

function App() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const hideNavbar = NO_NAVBAR_ROUTES.some(r => location.pathname.startsWith(r))

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: { borderRadius: '12px', fontWeight: 600, fontSize: '0.88rem' },
          success: { style: { background: '#1A0500', color: '#fff', border: '1px solid rgba(255,77,0,0.3)' } },
          error: { style: { background: '#1A0500', color: '#fff', border: '1px solid rgba(239,68,68,0.3)' } },
        }}
      />
      {!hideNavbar && <Navbar />}
      <div style={{ paddingTop: hideNavbar ? 0 : isHome ? 0 : 64 }}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Customer */}
          <Route path="/build" element={<PizzaBuilder />} />
          <Route path="/order-summary" element={<OrderSummary />} />
          <Route path="/orders" element={<OrderHistory />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />

          {/* 404 */}
          <Route path="*" element={
            <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
              <span style={{ fontSize: '5rem' }}>🍕</span>
              <h2 style={{ fontWeight: 800, color: '#1A0500', fontSize: '1.8rem' }}>Page not found</h2>
              <a href="/" style={{ color: '#FF4D00', fontWeight: 700 }}>Go home →</a>
            </div>
          } />
        </Routes>
      </div>
    </div>
  )
}

export default App
