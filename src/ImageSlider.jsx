import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageSlider = () => {
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1920&q=80",
      title: "HERITAGE COLLECTION",
      subtitle: "Timeless Elegance Redefined",
      cta: "Explore Now"
    },
    {
      image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1920&q=80",
      title: "BRIDAL SYMPHONY",
      subtitle: "Your Perfect Wedding Moment",
      cta: "Discover More"
    },
    {
      image: "https://images.unsplash.com/photo-1573408302355-4e0b7caf3ad6?auto=format&fit=crop&w=1920&q=80",
      title: "DIAMOND RADIANCE",
      subtitle: "Where Dreams Meet Luxury",
      cta: "Shop Collection"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }
  };

  const prevSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsTransitioning(false), 800);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  useEffect(() => {
    const autoPlay = setInterval(nextSlide, 5000);
    return () => clearInterval(autoPlay);
  }, [currentIndex]);

  return (
    <div className="relative w-full h-[85vh] overflow-hidden group">
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentIndex 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-105'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <div 
          className={`transition-all duration-1000 ${
            isTransitioning ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
          }`}
        >
          {/* Decorative Line */}
          <div className="flex items-center justify-center mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <div className="mx-3 w-1.5 h-1.5 rounded-full bg-amber-400" />
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 tracking-wider">
            <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent drop-shadow-2xl">
              {slides[currentIndex].title}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/90 text-lg md:text-2xl mb-8 tracking-widest font-light">
            {slides[currentIndex].subtitle}
          </p>

          {/* CTA Button */}
          <button className="group/btn relative px-8 py-3 bg-white/10 backdrop-blur-sm border border-amber-400/50 text-white overflow-hidden transition-all duration-500 hover:bg-amber-400 hover:border-amber-400">
            <span className="relative z-10 tracking-widest text-sm font-medium">
              {slides[currentIndex].cta}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-500" />
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/20 hover:scale-110"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/20 hover:scale-110"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Progress Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsTransitioning(true);
              setCurrentIndex(index);
            }}
            className="group/dot relative"
          >
            <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
              currentIndex === index 
                ? 'bg-amber-400 w-8' 
                : 'bg-white/40 hover:bg-white/60'
            }`} />
          </button>
        ))}
      </div>

      {/* Brand Watermark */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2">
        <p className="text-white/60 text-xs tracking-[0.3em] font-light">
          RADHARANI JEWELERS
        </p>
      </div>
    </div>
  );
};

export default ImageSlider;