import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userListings } from '../mockData';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { User, Settings, LogOut, Edit, Trash2, Eye } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { toast } from '../hooks/use-toast';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('listinglarim');

  const mockUser = {
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    phone: '0532 XXX XX XX',
    memberSince: '2023',
    verified: true
  };

  const handleLogout = () => {
    toast({
      title: "Çıkış Yapıldı",
      description: "Başarıyla çıkış yaptınız."
    });
    setTimeout(() => navigate('/'), 1000);
  };

  const handleDelete = (id) => {
    toast({
      title: "Ad Silindi",
      description: "Ad başarıyla silindi."
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-20 h-20 bg-[#FFD100] rounded-full flex items-center justify-center mb-3">
                    <User className="h-10 w-10 text-black" />
                  </div>
                  <h2 className="font-bold text-lg">{mockUser.name}</h2>
                  <p className="text-sm text-gray-600">{mockUser.email}</p>
                  {mockUser.verified && (
                    <span className="text-xs text-green-600 mt-1">Doğrulanmış Hesap</span>
                  )}
                </div>

                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setActiveTab('listinglarim')}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Adsım
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setActiveTab('ayarlar')}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Ayarlar
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Çıkış Yap
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="listinglarim">Adsım ({userListings.length})</TabsTrigger>
                <TabsTrigger value="ayarlar">Hesap Ayarları</TabsTrigger>
              </TabsList>

              <TabsContent value="listinglarim">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold">Aktif Adsım</h2>
                      <Button
                        onClick={() => navigate('/listing-ver')}
                        className="bg-[#FFD100] text-black hover:bg-[#FFD100]/90"
                      >
                        Yeni Ad Ver
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {userListings.map((listing) => (
                        <Card key={listing.id} className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="flex flex-col sm:flex-row">
                              <div className="sm:w-48 h-48 sm:h-auto flex-shrink-0">
                                <img
                                  src={listing.image}
                                  alt={listing.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-lg mb-1">{listing.title}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{listing.location}</p>
                                    <p className="text-xl font-bold text-[#FFD100]">
                                      {listing.price.toLocaleString('tr-TR')} {listing.currency}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                  <div className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    {listing.views} views
                                  </div>
                                  <span>•</span>
                                  <span>{listing.date}</span>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigate(`/listing/${listing.id}`)}
                                  >
                                    Görüntüle
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigate(`/listing/duzenle/${listing.id}`)}
                                  >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Düzenle
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:bg-red-50"
                                    onClick={() => handleDelete(listing.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Sil
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ayarlar">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Hesap Ayarları</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-4">Kişisel Bilgiler</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-gray-600">Ad Soyad</label>
                            <p className="font-medium">{mockUser.name}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">E-posta</label>
                            <p className="font-medium">{mockUser.email}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Telefon</label>
                            <p className="font-medium">{mockUser.phone}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Üyelik Yılı</label>
                            <p className="font-medium">{mockUser.memberSince}</p>
                          </div>
                        </div>
                        <Button variant="outline" className="mt-4">
                          Bilgileri Güncelle
                        </Button>
                      </div>

                      <div className="border-t pt-6">
                        <h3 className="font-semibold mb-4">Güvenlik</h3>
                        <Button variant="outline">
                          Şifre Değiştir
                        </Button>
                      </div>

                      <div className="border-t pt-6">
                        <h3 className="font-semibold mb-4">Bildirim Tercihleri</h3>
                        <div className="space-y-3">
                          <label className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span className="text-sm">E-posta bildirimleri</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span className="text-sm">SMS bildirimleri</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm">Pazarlama e-postaları</span>
                          </label>
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <h3 className="font-semibold mb-2 text-red-600">Hesabı Sil</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Hesabınızı silerseniz all verileriniz kalıcı olarak silinecektir.
                        </p>
                        <Button variant="destructive">
                          My Accountı Sil
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;
