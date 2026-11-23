import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import OrderHistory from './pages/OrderHistory'
import AdminDashboard from './pages/admin/Dashboard'
import Navbar from './components/Navbar'

function App() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Home page এ navbar transparent তাই padding নেই, বাকি সব page এ আছে */}
      <div style={{ paddingTop: isHome ? 0 : 68 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
