import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, Eye, Loader } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

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
      setProducts(data);
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
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-3">
            Luxury Collection
          </h2>
          <p className="text-gray-600 tracking-wider text-sm">
            {filteredItems.length} Exquisite Pieces
          </p>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredItems.map((item) => (
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
                    <button className="p-2 bg-white rounded-full shadow-lg hover:bg-amber-500 hover:text-white transition-all duration-300">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/product/${item.id}`); }}
                    className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-black text-white flex items-center gap-2 rounded-sm transition-all duration-500 hover:bg-amber-500 ${
                      hoveredId === item.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium tracking-wide">View Details</span>
                  </button>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(item.rating || 4) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-xs text-gray-600 ml-1">({item.rating || 4.0})</span>
                  </div>

                  <h3
                    onClick={() => navigate(`/product/${item.id}`)}
                    className="font-semibold text-gray-800 text-base mb-2 group-hover:text-amber-600 transition-colors duration-300 cursor-pointer"
                  >
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
        )}
      </div>
    </div>
  );
};

export default JewelryStore;
