import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Heart, Search, User, Loader } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [cartCount] = useState(0);
  const [wishlistCount] = useState(0);
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Kisna', path: '/kisna', isBrand: true },
    { name: 'New Arrivals', path: '/products?filter=new' },
    { name: 'Best Sellers', path: '/products?filter=bestseller' },
    { name: 'Fine Silver', path: '/products?category=silver' },
    { name: '9KT Gold', path: '/products?category=gold' },
    { name: 'Bridal Collection', path: '/products?category=bridal' },
    { name: 'Gifting', path: '/products?category=gifting' },
    { name: 'About Us', path: '/#about' },
  ];

  // Search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchSuggestions([]);
        return;
      }

      setLoadingSuggestions(true);
      try {
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();
        const filtered = data
          .filter(p => !p.store || p.store === 'radharani')
          .filter(p =>
            p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category?.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 5);
        setSearchSuggestions(filtered);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSuggestionClick = (productId) => {
    setShowSuggestions(false);
    setSearchQuery('');
    navigate(`/product/${productId}`);
  };

  return (
    <>
      <div className="bg-black text-white py-2 px-4 text-center">
        <p className="text-xs md:text-sm tracking-widest font-light">
          ✨ FREE SHIPPING ON ORDERS ABOVE ₹50,000 ✨
        </p>
      </div>

      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link to="/" className="flex-shrink-0">
              <img src="https://radharani.co/cdn/shop/files/rrj_logo.png?v=1685590178&width=135" alt="Radharani" className="h-16 md:h-20 w-auto" />
            </Link>

            {/* Desktop Search with Suggestions */}
            <div className="hidden md:block flex-1 mx-10 max-w-2xl relative">
              <form onSubmit={handleSearch}>
                <div className="relative w-full group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-amber-600" />
                  <input
                    type="text"
                    placeholder="Search for jewelry..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full bg-gray-50 border-2 border-gray-200 text-gray-900 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-amber-400 focus:bg-white"
                  />
                </div>
              </form>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && (searchQuery.length >= 2) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border z-50 max-h-80 overflow-y-auto">
                  {loadingSuggestions ? (
                    <div className="p-4 flex items-center gap-2 text-gray-500">
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Searching...</span>
                    </div>
                  ) : searchSuggestions.length > 0 ? (
                    <>
                      {searchSuggestions.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleSuggestionClick(product.id)}
                          className="flex items-center gap-3 p-3 hover:bg-amber-50 cursor-pointer transition-colors"
                        >
                          <img src={product.images?.[0] || product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{product.name}</p>
                            <p className="text-sm text-amber-600">₹{parseInt(product.price).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                      <div
                        onClick={() => { setShowSuggestions(false); navigate(`/products?search=${searchQuery}`); }}
                        className="p-3 text-center text-amber-600 hover:bg-amber-50 cursor-pointer border-t"
                      >
                        See all results for "{searchQuery}"
                      </div>
                    </>
                  ) : (
                    <div className="p-4 text-gray-500 text-center">No products found</div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-4 md:gap-6 items-center">
              <Link to="/admin/login" className="hover:text-amber-600 p-2 rounded-full hover:bg-amber-50">
                <User className="w-5 h-5 md:w-6 md:h-6" />
              </Link>
              <button className="relative hover:text-red-500 p-2 rounded-full hover:bg-red-50">
                <Heart className="w-5 h-5 md:w-6 md:h-6" />
                {wishlistCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center">{wishlistCount}</span>}
              </button>
              <button className="relative hover:text-amber-600 p-2 rounded-full hover:bg-amber-50">
                <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
                {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center">{cartCount}</span>}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="md:hidden mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jewelry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-full py-3 pl-10 pr-4 focus:outline-none focus:border-amber-400"
              />
            </div>
          </form>

          <div className="hidden md:block mt-4">
            <ul className="flex justify-center items-center gap-8 border-t border-gray-100 pt-4">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className={`group relative text-sm font-medium transition-colors uppercase ${link.isBrand ? 'text-purple-600 hover:text-purple-700' : 'text-gray-700 hover:text-amber-600'}`}>
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <ul className="py-4 px-6 space-y-4">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} onClick={() => setIsMenuOpen(false)} className={`block font-medium transition-colors uppercase text-sm py-2 ${link.isBrand ? 'text-purple-600' : 'text-gray-700'}`}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;