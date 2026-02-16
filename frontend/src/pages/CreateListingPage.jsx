import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories, cities } from '../mockData';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Upload, X, Plus } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { toast } from '../hooks/use-toast';

const CreateListingPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    subCategory: '',
    price: '',
    city: '',
    description: '',
    images: []
  });
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryChange = (categorySlug) => {
    const category = categories.find(c => c.slug === categorySlug);
    setSelectedCategory(category);
    setFormData({ ...formData, category: categorySlug, subCategory: '' });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (formData.images.length + files.length > 10) {
      toast({
        title: "Hata",
        description: "Maksimum 10 fotoğraf yükleyebilirsiniz.",
        variant: "destructive"
      });
      return;
    }

    // Create preview URLs (in real app, these would be uploaded to server)
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, e.target.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.category || !formData.price || !formData.city || !formData.description) {
      toast({
        title: "Hata",
        description: "Lütfen all gerekli alanları doldurun.",
        variant: "destructive"
      });
      return;
    }

    if (formData.images.length === 0) {
      toast({
        title: "Hata",
        description: "Lütfen en az 1 fotoğraf yükleyin.",
        variant: "destructive"
      });
      return;
    }

    // In real app, this would be sent to backend
    toast({
      title: "Başarılı!",
      description: "Adınız başarıyla oluşturuldu."
    });

    setTimeout(() => {
      navigate('/listinglar');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold mb-6">Ücretsiz Ad Ver</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selection */}
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.slug}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sub Category */}
              {selectedCategory && (
                <div>
                  <Label htmlFor="subCategory">Alt Category *</Label>
                  <Select value={formData.subCategory} onValueChange={(val) => setFormData({...formData, subCategory: val})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Alt Category Seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCategory.subCategories.map(sub => (
                        <SelectItem key={sub.id} value={sub.slug}>
                          {sub.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Title */}
              <div>
                <Label htmlFor="title">Ad Başlığı *</Label>
                <Input
                  id="title"
                  placeholder="Örn: 2020 Model Volkswagen Golf"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.title.length}/100 karakter</p>
              </div>

              {/* Price */}
              <div>
                <Label htmlFor="price">Price (TL) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Price girin"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  min="0"
                />
              </div>

              {/* City */}
              <div>
                <Label htmlFor="city">City *</Label>
                <Select value={formData.city} onValueChange={(val) => setFormData({...formData, city: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="City Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Açıklama *</Label>
                <Textarea
                  id="description"
                  placeholder="Adınız hakkında detaylı bilgi verin..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={6}
                  maxLength={5000}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.description.length}/5000 karakter</p>
              </div>

              {/* Image Upload */}
              <div>
                <Label>Fotoğraflar * (En az 1, en fazla 10)</Label>
                <div className="mt-2">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-300">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-1">
                            Kapak Fotoğrafı
                          </div>
                        )}
                      </div>
                    ))}
                    {formData.images.length < 10 && (
                      <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-[#FFD100] flex flex-col items-center justify-center cursor-pointer transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-xs text-gray-500 text-center px-2">Fotoğraf Ekle</span>
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Details Section */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Ek Bilgiler (Opsiyonel)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="condition">Durum</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Sıfır</SelectItem>
                        <SelectItem value="like-new">Sıfır Ayarında</SelectItem>
                        <SelectItem value="used">İkinci El</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="exchange">Takas</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Evet</SelectItem>
                        <SelectItem value="no">Hayır</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="flex-1"
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#FFD100] text-black hover:bg-[#FFD100]/90"
                >
                  Adı Yayınla
                </Button>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  ℹ️ Adınız yöneticiler tarafından onaylandıktan sonra yayınlanacaktır. Bu işlem genellikle 24 saat içinde tamamlanır.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default CreateListingPage;
