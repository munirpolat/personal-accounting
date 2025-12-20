import React from 'react';
import { useNavigate } from 'react-router-dom';
import { categories, mockListings } from '../mockData';
import * as Icons from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HomePage = () => {
  const navigate = useNavigate();
  const featuredListings = mockListings.filter(l => l.featured).slice(0, 8);

  const getIcon = (iconName) => {
    const Icon = Icons[iconName];
    return Icon ? <Icon className="h-8 w-8" /> : <Icons.Circle className="h-8 w-8" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#FFD100]/10 to-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Türkiye'nin En Büyük İlan Sitesi
          </h1>
          <p className="text-center text-gray-600 text-lg mb-8">
            Binlerce ilan arasından aradığını bul veya kolayca ilan ver
          </p>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">Kategoriler</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => navigate(`/kategori/${category.slug}`)}
                  className="flex flex-col items-center p-4 rounded-lg border-2 border-gray-200 hover:border-[#FFD100] hover:bg-[#FFD100]/5 transition-all duration-200 group"
                >
                  <div className="text-gray-700 group-hover:text-[#FFD100] transition-colors mb-2">
                    {getIcon(category.icon)}
                  </div>
                  <span className="text-sm font-medium text-center">{category.name}</span>
                  <span className="text-xs text-gray-500 mt-1">
                    {mockListings.filter(l => l.category === category.name).length} ilan
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Listings */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Vitrin İlanları</h2>
          <button
            onClick={() => navigate('/ilanlar')}
            className="text-[#FFD100] hover:underline font-medium"
          >
            Tümünü Gör
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredListings.map((listing) => (
            <Card
              key={listing.id}
              className="cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden group"
              onClick={() => navigate(`/ilan/${listing.id}`)}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {listing.featured && (
                  <Badge className="absolute top-2 left-2 bg-[#FFD100] text-black hover:bg-[#FFD100]/90">
                    Vitrin
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-2 line-clamp-2 min-h-[40px]">
                  {listing.title}
                </h3>
                <p className="text-xl font-bold text-[#FFD100] mb-2">
                  {listing.price.toLocaleString('tr-TR')} {listing.currency}
                </p>
                <p className="text-sm text-gray-500">{listing.location}</p>
                <p className="text-xs text-gray-400 mt-1">{listing.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 mt-16">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-white">
          <h2 className="text-3xl font-bold text-center mb-8">sahibinden.com ile</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#FFD100] mb-2">60M+</div>
              <div className="text-sm">Aylık Ziyaret</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#FFD100] mb-2">3M+</div>
              <div className="text-sm">Aktif İlan</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#FFD100] mb-2">15M+</div>
              <div className="text-sm">Üye</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#FFD100] mb-2">20+</div>
              <div className="text-sm">Yıllık Tecrübe</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
