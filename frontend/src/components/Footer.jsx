import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="bg-[#0066CC] inline-block px-3 py-1 rounded mb-4">
              <span className="text-lg font-bold text-white">fromowner.ca</span>
            </div>
            <p className="text-sm mb-4">
              Canada's leading buy and sell marketplace
            </p>
            <div className="flex gap-3">
              <a href="#" className="hover:text-[#0066CC] transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-[#0066CC] transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-[#0066CC] transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-[#0066CC] transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-[#0066CC] transition-colors">Home</Link></li>
              <li><Link to="/listings" className="hover:text-[#0066CC] transition-colors">All Listings</Link></li>
              <li><Link to="/post-ad" className="hover:text-[#0066CC] transition-colors">Post Ad</Link></li>
              <li><Link to="/account" className="hover:text-[#0066CC] transition-colors">My Account</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Popular Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/category/real-estate" className="hover:text-[#0066CC] transition-colors">Real Estate</Link></li>
              <li><Link to="/category/vehicles" className="hover:text-[#0066CC] transition-colors">Vehicles</Link></li>
              <li><Link to="/category/buy-sell" className="hover:text-[#0066CC] transition-colors">Buy & Sell</Link></li>
              <li><Link to="/category/pets" className="hover:text-[#0066CC] transition-colors">Pets</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Help & Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-[#0066CC] transition-colors">About Us</Link></li>
              <li><Link to="/help" className="hover:text-[#0066CC] transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-[#0066CC] transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="hover:text-[#0066CC] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2024 fromowner.ca - All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
