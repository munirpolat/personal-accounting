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
import { authAPI } from '../api';

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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await authAPI.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      
      setSmsVerification(true);
      toast({
        title: "SMS Sent",
        description: "A verification code has been sent to your phone."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Unable to register.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    
    if (verificationCode.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter the 6-digit code.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await authAPI.verifySMS({
        phone: formData.phone,
        code: verificationCode
      });
      
      toast({
        title: "Success!",
        description: "Your account has been created."
      });

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Invalid verification code.",
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
            <CardTitle className="text-2xl text-center">
              {smsVerification ? 'Phone Verification' : 'Register'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!smsVerification ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      className="pl-10"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 416 555 0100"
                      className="pl-10"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
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

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <input type="checkbox" required className="mt-1 rounded" />
                  <span className="text-sm text-gray-600">
                    I agree to the{' '}
                    <Link to="/terms" className="text-[#0066CC] hover:underline">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-[#0066CC] hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#0066CC] text-white hover:bg-[#0052A3]"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Continue'}
                </Button>

                <p className="text-center text-sm text-gray-600 mt-4">
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#0066CC] hover:underline font-medium">
                    Sign In
                  </Link>
                </p>
              </form>
            ) : (
              <form onSubmit={handleVerification} className="space-y-4">
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-600">
                    Enter the 6-digit code sent to <strong>{formData.phone}</strong>
                  </p>
                </div>

                <div>
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    className="text-center text-2xl tracking-widest"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    disabled={loading}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#0066CC] text-white hover:bg-[#0052A3]"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </Button>

                <div className="text-center">
                  <button type="button" className="text-sm text-[#0066CC] hover:underline">
                    Resend Code
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setSmsVerification(false)}
                    className="text-sm text-gray-600 hover:underline"
                  >
                    Go Back
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
