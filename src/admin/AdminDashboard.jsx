import { useState, useEffect } from 'react';
import { Package, ShoppingCart, MessageSquare, TrendingUp } from 'lucide-react';

const API_URL = '/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, contacts: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes, contactsRes] = await Promise.all([
          fetch(`${API_URL}/products`),
          fetch(`${API_URL}/orders`),
          fetch(`${API_URL}/contacts`),
        ]);
        const [products, orders, contacts] = await Promise.all([
          productsRes.json(),
          ordersRes.json(),
          contactsRes.json(),
        ]);
        setStats({
          products: products.length,
          orders: orders.length,
          contacts: contacts.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Products', value: stats.products, icon: Package, color: 'bg-blue-500' },
    { label: 'Orders', value: stats.orders, icon: ShoppingCart, color: 'bg-green-500' },
    { label: 'Messages', value: stats.contacts, icon: MessageSquare, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
            <div className={`${stat.color} p-4 rounded-lg`}>
              <stat.icon className="text-white" size={32} />
            </div>
            <div>
              <p className="text-gray-500">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-amber-600" />
          <h2 className="text-xl font-semibold">Welcome to Admin Panel</h2>
        </div>
        <p className="text-gray-600">Manage your jewelry store from here. You can:</p>
        <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
          <li>Add, edit, and delete products</li>
          <li>View and manage orders</li>
          <li>Read and delete contact messages</li>
        </ul>
      </div>
    </div>
  );
}
