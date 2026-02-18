import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Heart, Search, User } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount] = useState(0);
  const [wishlistCount] = useState(0);
  const navigate = useNavigate();

  const navLinks = [
    { name: 'New Arrivals', path: '/products?filter=new' },
    { name: 'Best Sellers', path: '/products?filter=bestseller' },
    { name: 'Fine Silver', path: '/products?category=silver' },
    { name: '9KT Gold', path: '/products?category=gold' },
    { name: 'Bridal Collection', path: '/products?category=bridal' },
    { name: 'Gifting', path: '/products?category=gifting' },
    { name: 'About Us', path: '/#about' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
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
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link to="/" className="flex-shrink-0">
              <img
                src="https://radharani.co/cdn/shop/files/rrj_logo.png?v=1685590178&width=135"
                alt="Radharani Jewelers"
                className="h-16 md:h-20 w-auto"
              />
            </Link>

            {/* Desktop Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-10 max-w-2xl">
              <div className="relative w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-amber-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Search for jewelry, collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 text-gray-900 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-amber-400 focus:bg-white transition-all duration-300"
                />
              </div>
            </form>

            {/* Action Icons */}
            <div className="flex gap-4 md:gap-6 items-center">
              <Link to="/admin/login" className="hover:text-amber-600 transition-colors p-2 rounded-full hover:bg-amber-50">
                <User className="w-5 h-5 md:w-6 md:h-6" />
              </Link>

              <button className="relative hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50">
                <Heart className="w-5 h-5 md:w-6 md:h-6" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button className="relative hover:text-amber-600 transition-colors p-2 rounded-full hover:bg-amber-50">
                <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
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

          {/* Desktop Navigation Links */}
          <div className="hidden md:block mt-4">
            <ul className="flex justify-center items-center gap-8 border-t border-gray-100 pt-4">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="group relative text-sm font-medium text-gray-700 hover:text-amber-600 transition-colors uppercase tracking-wide"
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <ul className="py-4 px-6 space-y-4">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-gray-700 hover:text-amber-600 font-medium transition-colors uppercase tracking-wide text-sm py-2"
                  >
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
