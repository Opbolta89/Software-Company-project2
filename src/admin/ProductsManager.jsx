import { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, Search, Store, Upload, X, Image as ImageIcon } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';
const CLOUDINARY_CLOUD = 'dl2eo7viu';
const CLOUDINARY_PRESET = 'brajstay-hotels';

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
  const [storeFilter, setStoreFilter] = useState('radharani');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'necklace',
    image: '',
    images: [],
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

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const url = await uploadToCloudinary(file);
          return url;
        })
      );

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
        image: prev.image || uploadedUrls[0]
      }));
    } catch (error) {
      alert('Error uploading images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: newImages,
        image: newImages[0] || ''
      };
    });
  };

  const setAsPrimary = (index) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      const [removed] = newImages.splice(index, 1);
      return {
        ...prev,
        images: [removed, ...newImages],
        image: removed
      };
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesStore = storeFilter === 'all' || product.store === storeFilter;
    const matchesSearch = searchQuery === '' ||
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' ||
      product.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesStore && matchesSearch && matchesCategory;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingProduct
        ? `${API_URL}/products/${editingProduct.id}`
        : `${API_URL}/products`;
      const method = editingProduct ? 'PUT' : 'POST';

      const productData = {
        ...formData,
        store: storeFilter,
        image: formData.images[0] || formData.image,
        images: formData.images
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
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
    setStoreFilter(product.store || 'radharani');
    setFormData({
      name: product.name || '',
      price: product.price || '',
      category: product.category || 'necklace',
      image: product.image || '',
      images: product.images || (product.image ? [product.image] : []),
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
      images: [],
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

  const productCounts = {
    radharani: products.filter(p => p.store === 'radharani' || !p.store).length,
    kisna: products.filter(p => p.store === 'kisna').length
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

      {/* Store Filter Tabs */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setStoreFilter('radharani')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                storeFilter === 'radharani' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Store size={18} />
              Radharani Jewelers
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">{productCounts.radharani}</span>
            </button>
            <button
              onClick={() => setStoreFilter('kisna')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                storeFilter === 'kisna' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Store size={18} />
              Kisna Jewelers
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">{productCounts.kisna}</span>
            </button>
          </div>

          <div className="relative flex-1 max-w-md">
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
        <div className="bg-white rounded-lg shadow p-6 mb-6 max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">
            {editingProduct ? 'Edit Product' : `Add New Product to ${storeFilter === 'kisna' ? 'Kisna' : 'Radharani'}`}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Image Upload Section */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images (Upload to Cloudinary) *
              </label>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {uploading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full"></div>
                    <span>Uploading to Cloudinary...</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 mx-auto px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200"
                  >
                    <Upload size={20} />
                    Click to Upload Images
                  </button>
                )}

                <p className="text-xs text-gray-500 mt-2">
                  Upload multiple images (max 5). First image will be main image.
                </p>
              </div>

              {/* Uploaded Images Preview */}
              {formData.images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Uploaded Images ({formData.images.length}):
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {formData.images.map((img, index) => (
                      <div key={index} className={`relative group rounded-lg overflow-hidden border-2 ${index === 0 ? 'border-amber-500' : 'border-gray-200'}`}>
                        <img src={img} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          {index !== 0 && (
                            <button
                              type="button"
                              onClick={() => setAsPrimary(index)}
                              className="p-1 bg-white rounded text-xs text-gray-700"
                            >
                              Primary
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="p-1 bg-red-500 rounded"
                          >
                            <X size={14} className="text-white" />
                          </button>
                        </div>
                        {index === 0 && (
                          <span className="absolute top-1 left-1 bg-amber-500 text-white text-xs px-2 py-0.5 rounded">Main</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Manual URL Input */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Or Add Image URL Manually
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value, images: [e.target.value, ...formData.images.filter(i => i !== e.target.value)] })}
                    className="flex-1 border p-2 rounded focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

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
              <th className="px-6 py-3 text-left">Images</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Store</th>
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
                  <div className="flex -space-x-2">
                    {(product.images || [product.image]).slice(0, 3).map((img, idx) => (
                      <img key={idx} src={img} alt={product.name} className="w-12 h-12 object-cover rounded border-2 border-white" />
                    ))}
                    {(product.images?.length || 0) > 3 && (
                      <div className="w-12 h-12 rounded border-2 border-white bg-gray-200 flex items-center justify-center text-xs">
                        +{product.images.length - 3}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 font-medium">{product.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    product.store === 'kisna' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {product.store === 'kisna' ? 'Kisna' : 'Radharani'}
                  </span>
                </td>
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
