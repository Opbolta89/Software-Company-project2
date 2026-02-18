import React from 'react';
import { Award, Shield, Truck, Sparkles } from 'lucide-react';

const FeaturedSection = () => {
  const features = [
    {
      icon: Award,
      title: 'Certified Authenticity',
      description: 'Every piece comes with a certificate of authenticity and quality assurance'
    },
    {
      icon: Shield,
      title: 'Lifetime Warranty',
      description: 'Comprehensive warranty coverage on all our precious jewelry pieces'
    },
    {
      icon: Truck,
      title: 'Secure Delivery',
      description: 'Free insured shipping on all orders with real-time tracking'
    },
    {
      icon: Sparkles,
      title: 'Custom Design',
      description: 'Bring your vision to life with our bespoke jewelry design service'
    }
  ];

  return (
    <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group text-center p-8 rounded-lg border border-gray-100 hover:border-amber-400 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 group-hover:bg-amber-500 transition-all duration-500 mb-4">
                  <Icon className="w-8 h-8 text-amber-600 group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Testimonial Section */}
        <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50 rounded-2xl p-12 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-6 h-6 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <p className="text-xl md:text-2xl text-gray-700 italic font-light mb-6 leading-relaxed">
              "The craftsmanship is absolutely stunning. Each piece tells a story of heritage and luxury. Radharani Jewelers has become my go-to destination for all special occasions."
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center text-white font-semibold">
                PS
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800">Priya Sharma</p>
                <p className="text-sm text-gray-600">Verified Customer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedSection;