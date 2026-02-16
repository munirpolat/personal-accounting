import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Mail, Lock } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { toast } from '../hooks/use-toast';
import { authAPI } from '../api';
import { useAuth } from '../AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Hata",
        description: "Lütfen tüm alanları doldurun.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login(formData);
      const { token, user } = response.data;
      
      login(token, user);
      
      toast({
        title: "Başarılı!",
        description: "Giriş yapıldı."
      });

      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      toast({
        title: "Hata",
        description: error.response?.data?.detail || "Giriş yapılamadı.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-md mx-auto px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Giriş Yap</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    disabled={loading}
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
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Beni Hatırla</span>
                </label>
                <Link to="/sifremi-unuttum" className="text-[#FFD100] hover:underline">
                  Şifremi Unuttum
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#FFD100] text-black hover:bg-[#FFD100]/90"
                disabled={loading}
              >
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </Button>

              <p className="text-center text-sm text-gray-600 mt-4">
                Hesabınız yok mu?{' '}
                <Link to="/kayit" className="text-[#FFD100] hover:underline font-medium">
                  Üye Ol
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;
