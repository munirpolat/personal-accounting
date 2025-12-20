import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Plus, Heart, Menu, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock login state

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/ilanlar?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      {/* Top Bar */}
      <div className="bg-[#FFD100] py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Türkiye'nin En Büyük İlan Sitesi</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm hover:underline" onClick={() => navigate('/giris')}>
              {isLoggedIn ? 'Hesabım' : 'Giriş Yap'}
            </button>
            {!isLoggedIn && (
              <>
                <span className="text-sm">|</span>
                <button className="text-sm hover:underline" onClick={() => navigate('/kayit')}>
                  Üye Ol
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="flex items-center">
              <div className="bg-[#FFD100] px-4 py-2 rounded">
                <span className="text-2xl font-bold text-black">sahibinden</span>
                <span className="text-xl font-bold text-black">.com</span>
              </div>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Kelime, ilan no veya mağaza adı ile ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 h-11"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>

          {/* Action Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => navigate('/favoriler')}
            >
              <Heart className="h-4 w-4" />
              <span className="hidden lg:inline">Favoriler</span>
            </Button>
            <Button
              className="flex items-center gap-2 bg-[#FFD100] text-black hover:bg-[#FFD100]/90"
              onClick={() => navigate('/ilan-ver')}
            >
              <Plus className="h-4 w-4" />
              <span>İlan Ver</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(isLoggedIn ? '/hesabim' : '/giris')}
            >
              <User className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Search Bar - Mobile */}
        <form onSubmit={handleSearch} className="md:hidden mt-4">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            <Button
              className="w-full justify-start"
              variant="ghost"
              onClick={() => {
                navigate('/favoriler');
                setMobileMenuOpen(false);
              }}
            >
              <Heart className="h-4 w-4 mr-2" />
              Favoriler
            </Button>
            <Button
              className="w-full justify-start bg-[#FFD100] text-black hover:bg-[#FFD100]/90"
              onClick={() => {
                navigate('/ilan-ver');
                setMobileMenuOpen(false);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              İlan Ver
            </Button>
            <Button
              className="w-full justify-start"
              variant="ghost"
              onClick={() => {
                navigate(isLoggedIn ? '/hesabim' : '/giris');
                setMobileMenuOpen(false);
              }}
            >
              <User className="h-4 w-4 mr-2" />
              {isLoggedIn ? 'Hesabım' : 'Giriş Yap'}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
