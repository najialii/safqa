'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeftRight, Loader2, KeyRound, Mail } from 'lucide-react';
import { authApi } from '@/lib/api';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.login(formData);
      const data = response.data;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/items');
    } catch (err: any) {
      console.error('Login error:', err.response?.data);
      const errorData = err.response?.data;
      if (errorData?.errors) {
        const errorMessages = Object.values(errorData.errors).flat().join(', ');
        setError(errorMessages);
      } else {
        setError(errorData?.message || 'خطأ في البريد أو كلمة المرور');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6" dir="rtl">
      <div className="w-full max-w-[440px] space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-[#1A1A1A] rounded-[22px] flex items-center justify-center shadow-2xl shadow-black/10 mx-auto transition-all hover:rotate-12">
            <ArrowLeftRight className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-[1000] tracking-tighter text-[#1A1A1A]">عودة حميدة</h1>
            <p className="text-[10px] font-black text-[#A1A1A1] uppercase tracking-[0.4em]">Secure Access Protocol</p>
          </div>
        </div>

        <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] rounded-[2.5rem] bg-white overflow-hidden">
          <CardContent className="p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Email Input */}
              <div className="space-y-2">
                <Label className="text-[10px] font-[900] uppercase tracking-[0.2em] text-[#A1A1A1] pr-1 flex items-center gap-2">
                  <Mail className="w-3 h-3" />
                  البريد الإلكتروني
                </Label>
                <Input
                  type="email"
                  className="h-14 bg-[#F9F9F9] border-transparent rounded-2xl focus:bg-white focus:border-[#1A1A1A] transition-all font-bold text-lg"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center pr-1">
                  <Label className="text-[10px] font-[900] uppercase tracking-[0.2em] text-[#A1A1A1] flex items-center gap-2">
                    <KeyRound className="w-3 h-3" />
                    كلمة المرور
                  </Label>
                  <Link href="/forgot" className="text-[10px] font-black text-amber-600 hover:text-amber-700 transition-colors">
                    نسيت الكلمة؟
                  </Link>
                </div>
                <Input
                  type="password"
                  className="h-14 bg-[#F9F9F9] border-transparent rounded-2xl focus:bg-white focus:border-[#1A1A1A] transition-all font-bold text-lg tracking-[0.3em]"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[11px] font-[900] text-center uppercase tracking-wider">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full h-16 bg-[#1A1A1A] hover:bg-black text-white rounded-2xl text-xl font-[1000] shadow-xl shadow-black/10 transition-all active:scale-[0.98]"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'دخول'}
              </Button>
            </form>

            <div className="mt-8 pt-8 border-t border-[#F5F5F5] text-center">
              <p className="text-[11px] font-[900] text-[#A1A1A1] uppercase tracking-[0.2em]">
                ليس لديك عضوية؟{' '}
                <Link href="/auth" className="text-[#1A1A1A] hover:underline underline-offset-4">
                  أنشئ حساباً الآن
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all">
           <span className="text-[9px] font-black text-[#1A1A1A] tracking-tighter">ENCRYPTION 256-BIT</span>
           <span className="text-[9px] font-black text-[#1A1A1A] tracking-tighter">SLA 99.9%</span>
        </div>
      </div>
    </div>
  );
}