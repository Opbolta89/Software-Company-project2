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

const ProductListPage = () => {
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
      // Only show Radharani products (not Kisna)
      const radharaniProducts = data.filter(p => p.store !== 'kisna');
      setProducts(radharaniProducts);
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
    switch(sortBy) {
      case 'price-low':
        return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
      case 'price-high':
        return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
      case 'rating':
        return (b.rating || 4) - (a.rating || 4);
      default:
        return 0;
    }
  });

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate(`/products?category=${currentFilter}`);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  };

  const getCategoryCount = (catId) => {
    if (catId === 'all') return products.length;
    return products.filter(p => p.category?.toLowerCase() === catId.toLowerCase()).length;
  };

  const getCategoryTitle = () => {
    if (searchParam) return `Search: "${searchParam}"`;
    const category = CATEGORIES.find(cat => cat.id === currentFilter);
    return category ? category.label : 'All Jewelry';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-10 h-10 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-amber-50 to-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-colors mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">
                {getCategoryTitle()}
              </h1>
              <p className="text-gray-600">
                {sortedProducts.length} {sortedProducts.length === 1 ? 'Product' : 'Products'} Found
              </p>
            </div>

            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-amber-400 w-64"
                />
              </div>
              <button type="submit" className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-amber-600" />
                Filter By Category
              </h3>

              <div className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setCurrentFilter(cat.id);
                      navigate(`/products?category=${cat.id}`);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-between group ${
                        currentFilter === cat.id && !searchParam
                          ? 'bg-amber-500 text-white shadow-lg'
                          : 'bg-gray-50 text-gray-700 hover:bg-amber-50 hover:text-amber-600'
                      }`}
                  >
                    <span className="font-medium flex items-center gap-2">
                      <span>{cat.icon}</span> {cat.label}
                    </span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      currentFilter === cat.id && !searchParam
                        ? 'bg-white/20'
                        : 'bg-gray-200 group-hover:bg-amber-100'
                    }`}>
                      {getCategoryCount(cat.id)}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-amber-400 bg-white"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex-1">
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((item) => (
                  <div
                    key={item.id}
                    className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <div
                      className="relative overflow-hidden bg-gray-100 aspect-[3/4] cursor-pointer"
                      onClick={() => navigate(`/product/${item.id}`)}
                    >
                      <img
                        src={item.image || item.img}
                        alt={item.name || item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {item.tag && (
                        <div className="absolute top-4 left-4 px-3 py-1 bg-amber-500 text-white text-xs font-semibold tracking-wider rounded-sm shadow-lg">
                          {item.tag}
                        </div>
                      )}

                      <div className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-500 ${
                        hoveredId === item.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                      }`}>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
                          className="p-2 bg-white rounded-full shadow-lg hover:bg-amber-500 hover:text-white transition-all duration-300"
                        >
                          <Heart className={`w-5 h-5 ${favorites.includes(item.id) ? 'fill-red-500 text-red-500' : ''}`} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/product/${item.id}`); }}
                          className="p-2 bg-white rounded-full shadow-lg hover:bg-amber-500 hover:text-white transition-all duration-300"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>

                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/product/${item.id}`); }}
                        className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-black text-white flex items-center gap-2 rounded-sm transition-all duration-500 hover:bg-amber-500 ${
                        hoveredId === item.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                      }`}>
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium tracking-wide">View Details</span>
                      </button>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(item.rating || 4) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                        ))}
                        <span className="text-xs text-gray-600 ml-1">({item.rating || 4.0})</span>
                      </div>

                      <h3 onClick={() => navigate(`/product/${item.id}`)} className="font-semibold text-gray-800 text-base mb-2 group-hover:text-amber-600 transition-colors duration-300 cursor-pointer">
                        {item.name || item.title}
                      </h3>

                      <div className="flex items-center justify-between">
                        <p className="text-xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>

                    <div className="h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-gray-400 mb-4">
                  <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Products Found</h3>
                <p className="text-gray-500 mb-6">Try selecting a different category or search term</p>
                <button
                  onClick={() => navigate('/products?category=all')}
                  className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                  View All Products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
