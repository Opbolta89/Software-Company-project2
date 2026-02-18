import { useState, useEffect } from 'react';

const API_URL = '/api';

export default function OrdersManager() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch(`${API_URL}/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders Management</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Order ID</th>
              <th className="px-6 py-3 text-left">Customer</th>
              <th className="px-6 py-3 text-left">Items</th>
              <th className="px-6 py-3 text-left">Total</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">#{order.id}</td>
                <td className="px-6 py-4">
                  <div>{order.customerName || 'N/A'}</div>
                  <div className="text-sm text-gray-500">{order.email || ''}</div>
                </td>
                <td className="px-6 py-4">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="text-sm">
                      {item.name} x{item.quantity}
                    </div>
                  )) || 'N/A'}
                </td>
                <td className="px-6 py-4">₹{order.total || 0}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="text-center py-8 text-gray-500">No orders found</p>
        )}
      </div>
    </div>
  );
}
