import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Mail, Lock, User, Phone } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { toast } from '../hooks/use-toast';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [smsVerification, setSmsVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast({
        title: "Hata",
        description: "Lütfen tüm alanları doldurun.",
        variant: "destructive"
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Hata",
        description: "Şifreler eşleşmiyor.",
        variant: "destructive"
      });
      return;
    }

    // Mock SMS verification
    setSmsVerification(true);
    toast({
      title: "SMS Gönderildi",
      description: "Telefonunuza bir doğrulama kodu gönderildi."
    });
  };

  const handleVerification = (e) => {
    e.preventDefault();
    
    if (verificationCode.length !== 6) {
      toast({
        title: "Hata",
        description: "Lütfen 6 haneli kodu girin.",
        variant: "destructive"
      });
      return;
    }

    // Mock verification success
    toast({
      title: "Başarılı!",
      description: "Hesabınız oluşturuldu."
    });

    setTimeout(() => {
      navigate('/giris');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-md mx-auto px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {smsVerification ? 'Telefon Doğrulama' : 'Üye Ol'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!smsVerification ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Ad Soyad</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Adınız Soyadınız"
                      className="pl-10"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">E-posta</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="ornek@email.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Telefon Numarası</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="05XX XXX XX XX"
                      className="pl-10"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">Şifre</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <input type="checkbox" required className="mt-1 rounded" />
                  <span className="text-sm text-gray-600">
                    <Link to="/kullanim-kosullari" className="text-[#FFD100] hover:underline">
                      Kullanım Koşulları
                    </Link>
                    {' '}ve{' '}
                    <Link to="/gizlilik" className="text-[#FFD100] hover:underline">
                      Gizlilik Politikası
                    </Link>
                    'nı okudum ve kabul ediyorum.
                  </span>
                </div>

                <Button type="submit" className="w-full bg-[#FFD100] text-black hover:bg-[#FFD100]/90">
                  Devam Et
                </Button>

                <p className="text-center text-sm text-gray-600 mt-4">
                  Zaten üye misiniz?{' '}
                  <Link to="/giris" className="text-[#FFD100] hover:underline font-medium">
                    Giriş Yap
                  </Link>
                </p>
              </form>
            ) : (
              <form onSubmit={handleVerification} className="space-y-4">
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-600">
                    <strong>{formData.phone}</strong> numarasına gönderilen 6 haneli kodu girin.
                  </p>
                </div>

                <div>
                  <Label htmlFor="code">Doğrulama Kodu</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    className="text-center text-2xl tracking-widest"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  />
                </div>

                <Button type="submit" className="w-full bg-[#FFD100] text-black hover:bg-[#FFD100]/90">
                  Doğrula
                </Button>

                <div className="text-center">
                  <button type="button" className="text-sm text-[#FFD100] hover:underline">
                    Kodu Tekrar Gönder
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setSmsVerification(false)}
                    className="text-sm text-gray-600 hover:underline"
                  >
                    Geri Dön
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default RegisterPage;
