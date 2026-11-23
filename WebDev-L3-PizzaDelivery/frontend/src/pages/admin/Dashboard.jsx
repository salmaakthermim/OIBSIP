import { useState, useEffect } from 'react'
import api from '../../utils/api'

export default function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders')
      .then(res => setOrders(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/orders/${id}/status`, { status })
      setOrders(orders.map(o => o._id === id ? data : o))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="text-center py-20">Loading...</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-red-600 mb-6">Admin Dashboard</h2>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="p-3">#{order._id.slice(-6).toUpperCase()}</td>
                <td className="p-3">{order.user?.name || 'N/A'}</td>
                <td className="p-3">৳{order.totalAmount}</td>
                <td className="p-3 capitalize">{order.status}</td>
                <td className="p-3">
                  <select
                    value={order.status}
                    onChange={e => updateStatus(order._id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    {['pending','confirmed','preparing','out-for-delivery','delivered','cancelled'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
