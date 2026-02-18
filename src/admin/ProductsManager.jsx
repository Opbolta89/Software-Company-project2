import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const CATEGORIES = [
  { id: 'necklace', label: 'Necklaces', icon: '📿' },
  { id: 'bracelets', label: 'Bracelets', icon: '⭕' },
  { id: 'earring', label: 'Earrings', icon: '💎' },
  { id: 'rings', label: 'Rings', icon: '💍' },
  { id: 'anklets', label: 'Anklets', icon: '🦶' },
  { id: 'pendants', label: 'Pendants', icon: '🔶' },
  { id: 'nosepins', label: 'Nosepins', icon: '💠' },
  { id: 'mangalsutra', label: 'Mangalsutra', icon: '⚫' },
  { id: 'bangles', label: 'Bangles', icon: '🔵' },
];

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'necklace',
    image: '',
    description: '',
    material: '',
    weight: '',
    purity: '',
    tag: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery === '' ||
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' ||
      product.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingProduct
        ? `${API_URL}/products/${editingProduct.id}`
        : `${API_URL}/products`;
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchProducts();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      price: product.price || '',
      category: product.category || 'necklace',
      image: product.image || '',
      description: product.description || '',
      material: product.material || '',
      weight: product.weight || '',
      purity: product.purity || '',
      tag: product.tag || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      category: 'necklace',
      image: '',
      description: '',
      material: '',
      weight: '',
      purity: '',
      tag: ''
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                placeholder="e.g., Royal Gold Choker"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
              <input
                type="number"
                placeholder="e.g., 45000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-amber-500"
                required
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
              <select
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-amber-500"
              >
                <option value="">No Tag</option>
                <option value="New">New</option>
                <option value="Bestseller">Bestseller</option>
                <option value="Trending">Trending</option>
                <option value="Premium">Premium</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                placeholder="Product description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-amber-500"
                rows="3"
                required
              />
            </div>

            {/* Additional Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
              <input
                type="text"
                placeholder="e.g., 22K Gold"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
              <input
                type="text"
                placeholder="e.g., 45.5 grams"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purity</label>
              <input
                type="text"
                placeholder="e.g., 916 Hallmark"
                value={formData.purity}
                onChange={(e) => setFormData({ ...formData, purity: e.target.value })}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="md:col-span-2 flex gap-2 mt-4">
              <button type="submit" className="bg-amber-600 text-white px-6 py-2 rounded hover:bg-amber-700">
                {editingProduct ? 'Update' : 'Add'} Product
              </button>
              <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Image</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Tag</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">
                  <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                </td>
                <td className="px-6 py-4 font-medium">{product.name}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                    {CATEGORIES.find(c => c.id === product.category)?.icon} {product.category}
                  </span>
                </td>
                <td className="px-6 py-4">{formatPrice(product.price)}</td>
                <td className="px-6 py-4">
                  {product.tag && (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.tag === 'New' ? 'bg-green-100 text-green-800' :
                      product.tag === 'Bestseller' ? 'bg-red-100 text-red-800' :
                      product.tag === 'Trending' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {product.tag}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <p className="text-center py-8 text-gray-500">No products found</p>
        )}
      </div>
    </div>
  );
}
