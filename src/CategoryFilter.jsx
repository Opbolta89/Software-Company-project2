import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, ArrowRight } from 'lucide-react';

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

const CategoryFilter = ({ onFilterChange }) => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');

  const handleFilter = (filterId) => {
    setActiveFilter(filterId);
    if (onFilterChange) {
      onFilterChange(filterId);
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-white to-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-amber-600" />
            <p className="text-amber-600 tracking-[0.3em] text-xs uppercase font-light">
              Filter By Category
            </p>
          </div>
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-800">
            Discover Your Perfect Piece
          </h3>
        </div>

        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleFilter(cat.id)}
              className={`group relative px-6 md:px-8 py-3 md:py-4 font-medium tracking-wider text-sm md:text-base overflow-hidden transition-all duration-500 ${
                activeFilter === cat.id
                  ? 'bg-black text-white scale-105 shadow-xl'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-amber-400 hover:shadow-lg'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 transition-transform duration-500 ${
                activeFilter === cat.id
                  ? 'translate-y-0'
                  : 'translate-y-full group-hover:translate-y-0'
              }`} />

              <span className="relative z-10 flex items-center gap-2">
                <span className="text-lg">{cat.icon}</span>
                <span className={activeFilter === cat.id ? 'text-white' : 'group-hover:text-white'}>
                  {cat.label}
                </span>
              </span>

              {activeFilter === cat.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-300 animate-pulse" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center mt-10">
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate(`/products?category=${activeFilter}`)}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <span className="tracking-wider">View More {activeFilter !== 'all' && CATEGORIES.find(c => c.id === activeFilter)?.label}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
          </button>
          <p className="text-sm text-gray-500 mt-3">
            Explore our complete collection
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
