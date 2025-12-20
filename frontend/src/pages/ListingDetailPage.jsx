import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockListings } from '../mockData';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ChevronLeft, ChevronRight, Heart, Share2, Phone, Mail, MapPin, Eye, Calendar, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { toast } from '../hooks/use-toast';

const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const listing = mockListings.find(l => l.id === parseInt(id));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">İlan Bulunamadı</h1>
          <Button onClick={() => navigate('/')}>Ana Sayfaya Dön</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Favorilerden çıkarıldı" : "Favorilere eklendi",
      description: listing.title,
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link kopyalandı",
      description: "İlan linki panoya kopyalandı.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-4">
          <button onClick={() => navigate('/')} className="hover:underline">Ana Sayfa</button>
          <span className="mx-2">/</span>
          <button onClick={() => navigate('/ilanlar')} className="hover:underline">İlanlar</button>
          <span className="mx-2">/</span>
          <button onClick={() => navigate(`/kategori/${listing.category.toLowerCase()}`)} className="hover:underline">
            {listing.category}
          </button>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{listing.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="relative aspect-[16/10] bg-black rounded-t-lg overflow-hidden">
                  <img
                    src={listing.images[currentImageIndex]}
                    alt={listing.title}
                    className="w-full h-full object-contain"
                  />
                  {listing.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {listing.images.length}
                      </div>
                    </>
                  )}
                  {listing.featured && (
                    <Badge className="absolute top-4 left-4 bg-[#FFD100] text-black hover:bg-[#FFD100]/90">
                      Vitrin İlan
                    </Badge>
                  )}
                </div>
                {listing.images.length > 1 && (
                  <div className="flex gap-2 p-4 overflow-x-auto">
                    {listing.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
                          idx === currentImageIndex ? 'border-[#FFD100]' : 'border-gray-300'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Title and Actions */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {listing.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {listing.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {listing.views} görüntüleme
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleFavorite}
                      className={isFavorite ? 'text-red-500 border-red-500' : ''}
                    >
                      <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500' : ''}`} />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleShare}>
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <div className="text-3xl font-bold text-[#FFD100]">
                  {listing.price.toLocaleString('tr-TR')} {listing.currency}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">İlan Açıklaması</h2>
                <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
              </CardContent>
            </Card>

            {/* Details */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">İlan Detayları</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Kategori</span>
                    <p className="font-medium">{listing.category}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Alt Kategori</span>
                    <p className="font-medium">{listing.subCategory}</p>
                  </div>
                  {Object.entries(listing.details).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-sm text-gray-600">{key}</span>
                      <p className="font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Info */}
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  İlan Sahibi
                  {listing.seller.verified && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </h3>
                <div className="mb-4">
                  <p className="font-medium text-lg">{listing.seller.name}</p>
                  {listing.seller.verified && (
                    <span className="text-xs text-green-600">Doğrulanmış Üye</span>
                  )}
                </div>
                <div className="space-y-2">
                  <Button className="w-full bg-[#FFD100] text-black hover:bg-[#FFD100]/90 flex items-center justify-center gap-2">
                    <Phone className="h-4 w-4" />
                    Telefonu Göster
                  </Button>
                  <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4" />
                    Mesaj Gönder
                  </Button>
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">
                    ⚠️ Güvenliğiniz için alışverişlerinizi Görüntülü Görüşme ile yapın.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Konum</h3>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{listing.location}</p>
                    <p className="text-gray-600 mt-2">Harita gösterimi yakında eklenecek</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar Listings */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Benzer İlanlar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockListings
              .filter(l => l.category === listing.category && l.id !== listing.id)
              .slice(0, 4)
              .map((similarListing) => (
                <Card
                  key={similarListing.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden group"
                  onClick={() => {
                    navigate(`/ilan/${similarListing.id}`);
                    window.scrollTo(0, 0);
                  }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={similarListing.image}
                      alt={similarListing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                      {similarListing.title}
                    </h3>
                    <p className="text-lg font-bold text-[#FFD100] mb-1">
                      {similarListing.price.toLocaleString('tr-TR')} {similarListing.currency}
                    </p>
                    <p className="text-xs text-gray-500">{similarListing.location}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ListingDetailPage;
