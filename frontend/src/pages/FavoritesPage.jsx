import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { favoriteListings } from '../mockData';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Heart, Trash2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { toast } from '../hooks/use-toast';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState(favoriteListings);

  const handleRemove = (id) => {
    setFavorites(favorites.filter(f => f.id !== id));
    toast({
      title: "Favorilerden Çıkarıldı",
      description: "İlan favorilerden kaldırıldı."
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Heart className="h-6 w-6 text-red-500 fill-red-500" />
          <h1 className="text-3xl font-bold">Favorilerim</h1>
        </div>

        {favorites.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Favori İlanınız Yok</h2>
              <p className="text-gray-600 mb-4">
                Beğendiğiniz ilanları favorilere ekleyerek daha sonra kolayca erişebilirsiniz.
              </p>
              <Button
                onClick={() => navigate('/ilanlar')}
                className="bg-[#FFD100] text-black hover:bg-[#FFD100]/90"
              >
                İlanları Görüntüle
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <p className="text-gray-600 mb-6">{favorites.length} favori ilan</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {favorites.map((listing) => (
                <Card
                  key={listing.id}
                  className="overflow-hidden group relative"
                >
                  <div
                    className="cursor-pointer"
                    onClick={() => navigate(`/ilan/${listing.id}`)}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2 min-h-[40px]">
                        {listing.title}
                      </h3>
                      <p className="text-lg font-bold text-[#FFD100] mb-2">
                        {listing.price.toLocaleString('tr-TR')} {listing.currency}
                      </p>
                      <p className="text-sm text-gray-500">{listing.location}</p>
                    </CardContent>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(listing.id);
                    }}
                    className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors z-10"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default FavoritesPage;
