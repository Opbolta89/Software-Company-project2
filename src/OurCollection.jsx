import React from 'react';
import { Sparkles } from 'lucide-react';

const categories = [
  { 
    id: 1, 
    title: 'EARRINGS', 
    image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=400',
    description: 'Elegant Studs & Drops'
  },
  { 
    id: 2, 
    title: 'NECKLACES', 
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=400',
    description: 'Statement Pieces'
  },
  { 
    id: 3, 
    title: 'BRACELETS', 
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400',
    description: 'Timeless Bangles'
  },
  { 
    id: 4, 
    title: 'MANGALSUTRAS', 
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=400',
    description: 'Sacred Traditions'
  },
  { 
    id: 5, 
    title: 'MENS', 
    image: 'https://images.unsplash.com/photo-1611085583191-a3b13000639b?q=80&w=400',
    description: 'Bold & Refined'
  },
  { 
    id: 6, 
    title: 'RINGS', 
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=400',
    description: 'Forever Symbols'
  },
];

const OurCollection = () => {
  return (
    <div className="bg-gradient-to-b from-white via-amber-50/30 to-white py-20 px-4 md:px-10">
      {/* Section Heading */}
      <div className="text-center mb-16 relative">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="w-5 h-5 text-amber-500 mr-3 animate-pulse" />
          <p className="text-amber-600 tracking-[0.3em] text-sm font-light uppercase">
            Curated Excellence
          </p>
          <Sparkles className="w-5 h-5 text-amber-500 ml-3 animate-pulse" />
        </div>
        
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-3">
          Our Jewelry Collections
        </h2>
        
        <div className="flex items-center justify-center mt-4">
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
          <div className="mx-2 w-2 h-2 rotate-45 bg-amber-400" />
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
        </div>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-7xl mx-auto">
        {categories.map((item, index) => (
          <div 
            key={item.id} 
            className="group relative overflow-hidden cursor-pointer rounded-sm shadow-md hover:shadow-2xl transition-shadow duration-500"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-900">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-all duration-700 ease-out 
                           group-hover:scale-110 group-hover:rotate-1 filter brightness-90 group-hover:brightness-75"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5">
              {/* Title */}
              <h3 className="text-white text-sm md:text-base font-bold tracking-widest mb-1 transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-500">
                {item.title}
              </h3>
              
              {/* Description - appears on hover */}
              <p className="text-amber-300 text-xs tracking-wide font-light opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                {item.description}
              </p>
              
              {/* Underline Animation */}
              <div className="mt-2 h-px bg-gradient-to-r from-amber-400 to-transparent w-0 group-hover:w-full transition-all duration-700" />
            </div>

            {/* Corner Accent */}
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[30px] border-t-amber-400/20 border-l-[30px] border-l-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-16">
        <button className="group relative inline-flex items-center gap-3 px-10 py-4 bg-black text-white overflow-hidden transition-all duration-500 hover:bg-amber-500">
          <span className="relative z-10 tracking-[0.2em] text-sm font-medium">
            EXPLORE ALL COLLECTIONS
          </span>
          <svg className="relative z-10 w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        </button>
      </div>
    </div>
  );
};

export default OurCollection;