import React from 'react';
import { Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <img
              src="https://radharani.co/cdn/shop/files/rrj_logo.png?v=1685590178&width=135"
              alt="Radharani Jewelers"
              className="h-16 brightness-0 invert"
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              Crafting timeless elegance since generations. Where tradition meets luxury in every piece.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-amber-500 transition-all duration-300 group">
                <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-amber-500 transition-all duration-300 group">
                <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-amber-500 transition-all duration-300 group">
                <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-amber-500 transition-all duration-300 group">
                <Youtube className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-amber-400 tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              {['About Us', 'Collections', 'New Arrivals', 'Best Sellers', 'Custom Design', 'Gift Cards'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-0 h-px bg-amber-400 group-hover:w-3 transition-all duration-300" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-amber-400 tracking-wider">Customer Care</h3>
            <ul className="space-y-3">
              {['Track Order', 'Returns & Exchange', 'Shipping Info', 'Size Guide', 'Care Instructions', 'FAQs'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-0 h-px bg-amber-400 group-hover:w-3 transition-all duration-300" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-amber-400 tracking-wider">Get In Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>123 Jewelry Street, Diamond District, Mumbai - 400001</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span>info@radharani.co</span>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-3">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-white/10 border border-white/20 rounded px-4 py-2 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
                <button className="bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded font-medium text-sm transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p className="flex items-center gap-2">
              © 2024 Radharani Jewelers. Crafted with <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" /> in India
            </p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-amber-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;