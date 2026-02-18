import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Heart, Star, Eye, ArrowLeft, SlidersHorizontal, Loader, Search } from 'lucide-react';

const API_URL = '/api';

const CATEGORIES = [
  { id: 'all', label: 'All Jewelry', icon: '✨' },
  { id: 'necklace', label: 'Necklaces', icon: '📿' },
  { id: 'bracelets', label: 'Bracelets', icon: '⭕' },
  { id: 'earring', label: 'Earrings', icon: '💎' },
  { id: 'rings', label: 'Rings', icon: '💍' },
  { id: 'anklets', label: 'Anklets', icon: '🦶' },
  { id: 'pendants', label: 'Pendants', icon: '🔶' },
  { id: 'bangles', label: 'Bangles', icon: '🔵' },
  { id: 'mangalsutra', label: 'Mangalsutra', icon: '⚫' },
];

const KisnaStore = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState(categoryParam);
  const [hoveredId, setHoveredId] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState(searchParam);

  useEffect(() => {
    fetchProducts();
  }, [currentFilter, searchParam]);

  useEffect(() => {
    setSearchQuery(searchParam);
  }, [searchParam]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      // Show only Kisna products
      const kisnaProducts = data.filter(p => p.store === 'kisna');
      setProducts(kisnaProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(item => {
    const matchesCategory = currentFilter === 'all' ||
      item.category?.toLowerCase() === currentFilter.toLowerCase();
    const matchesSearch = searchParam === '' ||
      item.name?.toLowerCase().includes(searchParam.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchParam.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return (a.price || 0) - (b.price || 0);
      case 'price-high': return (b.price || 0) - (a.price || 0);
      case 'name': return (a.name || '').localeCompare(b.name || '');
      default: return 0;
    }
  });

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-10 h-10 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="bg-gradient-to-r from-amber-600 to-amber-800 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Kisna Jewelry</h1>
        <p className="text-amber-100 text-lg">Exquisite Collection</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCurrentFilter(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  currentFilter === cat.id
                    ? 'bg-amber-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-amber-50 border border-amber-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchParam}
                onChange={(e) => {
                  const params = new URLSearchParams(searchParams);
                  if (e.target.value) params.set('search', e.target.value);
                  else params.delete('search');
                  navigate(`/kisna?${params.toString()}`);
                }}
                className="pl-10 pr-4 py-2 border border-amber-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-amber-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {sortedProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {sortedProducts.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => navigate(`/kisna/product/${item.id}`)}
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400'}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
                      className={`p-2 rounded-full bg-white shadow-lg hover:bg-amber-50 transition-colors ${favorites.includes(item.id) ? 'text-red-500' : 'text-gray-600'}`}
                    >
                      <Heart className={`w-5 h-5 ${favorites.includes(item.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  {item.tag && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-amber-600 text-white text-xs font-medium rounded-full">
                      {item.tag}
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-800 mb-1 truncate">{item.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-amber-700">
                      {formatPrice(item.price)}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm text-gray-600">4.5</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KisnaStore;
