import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, Eye, Loader } from 'lucide-react';

const API_URL = '/api';

const JewelryStore = ({ filter = 'all', searchQuery = '' }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [filter, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      // Show only Radharani products (not Kisna)
      const radharaniProducts = data.filter(p => !p.store || p.store !== 'kisna');
      setProducts(radharaniProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const filteredItems = products.filter(item => {
    const matchesCategory = filter === 'all' || item.category?.toLowerCase() === filter.toLowerCase();
    const matchesSearch = searchQuery === '' ||
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
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
      <div className="bg-gradient-to-b from-gray-50 to-white py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-center items-center min-h-[400px]">
          <Loader className="w-10 h-10 animate-spin text-amber-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif text-center text-gray-800 mb-4">
          Our Collection
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Discover our exquisite collection of handcrafted jewelry
        </p>

        {filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
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
                      onClick={() => toggleFavorite(item.id)}
                      className={`p-2 rounded-full bg-white shadow-lg hover:bg-amber-50 transition-colors ${favorites.includes(item.id) ? 'text-red-500' : 'text-gray-600'}`}
                    >
                      <Heart className={`w-5 h-5 ${favorites.includes(item.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => navigate(`/product/${item.id}`)}
                      className="p-2 rounded-full bg-white shadow-lg hover:bg-amber-50 text-gray-600 transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                  {item.tag && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-amber-600 text-white text-xs font-medium rounded-full">
                      {item.tag}
                    </div>
                  )}
                </div>
                <div className="p-4">
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

export default JewelryStore;
