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
            <div className="bg-[#FFD100] inline-block px-3 py-1 rounded mb-4">
              <span className="text-lg font-bold text-black">sahibinden.com</span>
            </div>
            <p className="text-sm mb-4">
              Türkiye'nin en büyük ilan ve alışveriş platformu
            </p>
            <div className="flex gap-3">
              <a href="#" className="hover:text-[#FFD100] transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-[#FFD100] transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-[#FFD100] transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-[#FFD100] transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Hızlı Erişim</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-[#FFD100] transition-colors">Ana Sayfa</Link></li>
              <li><Link to="/ilanlar" className="hover:text-[#FFD100] transition-colors">Tüm İlanlar</Link></li>
              <li><Link to="/ilan-ver" className="hover:text-[#FFD100] transition-colors">İlan Ver</Link></li>
              <li><Link to="/hesabim" className="hover:text-[#FFD100] transition-colors">Hesabım</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Popüler Kategoriler</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/kategori/emlak" className="hover:text-[#FFD100] transition-colors">Emlak</Link></li>
              <li><Link to="/kategori/vasita" className="hover:text-[#FFD100] transition-colors">Vasıta</Link></li>
              <li><Link to="/kategori/ikinci-el" className="hover:text-[#FFD100] transition-colors">İkinci El</Link></li>
              <li><Link to="/kategori/hayvanlar" className="hover:text-[#FFD100] transition-colors">Hayvanlar Alemi</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Yardım & Destek</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/hakkimizda" className="hover:text-[#FFD100] transition-colors">Hakkımızda</Link></li>
              <li><Link to="/yardim" className="hover:text-[#FFD100] transition-colors">Yardım</Link></li>
              <li><Link to="/iletisim" className="hover:text-[#FFD100] transition-colors">İletişim</Link></li>
              <li><Link to="/gizlilik" className="hover:text-[#FFD100] transition-colors">Gizlilik Politikası</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2024 sahibinden.com - Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
