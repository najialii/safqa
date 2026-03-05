'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeftRight, ChevronDown, Loader2 } from 'lucide-react';
import { authApi } from '@/lib/api';

interface Region {
  region_id: number;
  name_ar: string;
}

interface City {
  city_id: number;
  region_id: number;
  name_ar: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    region_id: '',
    city_id: '',
    address: '',
    phone: '',
    sec_phone: '',
  });
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/regions.json').then((res) => res.json()).then(setRegions);
    fetch('/cities.json').then((res) => res.json()).then(setCities);
  }, []);

  useEffect(() => {
    if (formData.region_id) {
      const filtered = cities.filter(c => c.region_id === parseInt(formData.region_id));
      setFilteredCities(filtered);
      setFormData((prev) => ({ ...prev, city_id: '' }));
    }
  }, [formData.region_id, cities]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authApi.register(formData);
      const data = response.data;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/items');
    } catch (err: any) {
      console.error('Registration error:', err.response?.data);
      const errorData = err.response?.data;
      if (errorData?.errors) {
        const errorMessages = Object.values(errorData.errors).flat().join(', ');
        setError(errorMessages);
      } else {
        setError(errorData?.message || 'حدث خطأ في البيانات المدخلة');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white md:bg-[#FAFAFA] flex items-center justify-center p-6" dir="rtl">
      <div className="w-full max-w-[480px] space-y-10">

        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-[#1A1A1A] rounded-[22px] flex items-center justify-center shadow-2xl shadow-black/20 mx-auto transition-transform hover:scale-105">
            <ArrowLeftRight className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-[1000] tracking-tighter text-[#1A1A1A]">انضم إلى صفقة</h1>
            <p className="text-xs font-[900] text-[#A1A1A1] uppercase tracking-[0.3em]">Create your industrial account</p>
          </div>
        </div>

        <Card className="border-none md:border md:border-[#EEE] shadow-none md:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] rounded-[2.5rem] bg-white overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="space-y-2">
                <Label className="text-[10px] font-[900] uppercase tracking-[0.2em] text-[#A1A1A1] pr-1">الاسم الكامل</Label>
                <Input
                  className="h-14 bg-[#F9F9F9] border-transparent rounded-2xl focus:bg-white focus:border-[#1A1A1A] transition-all font-bold text-lg"
                  placeholder="نواف العتيبي"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-[900] uppercase tracking-[0.2em] text-[#A1A1A1] pr-1">المنطقة</Label>
                  <div className="relative">
                    <select
                      className="w-full h-14 bg-[#F9F9F9] border-transparent rounded-2xl appearance-none pr-4 pl-10 focus:bg-white focus:border-[#1A1A1A] transition-all font-bold text-sm"
                      value={formData.region_id}
                      onChange={(e) => setFormData({ ...formData, region_id: e.target.value })}
                      required
                    >
                      <option value="">اختر</option>
                      {regions.map((r) => <option key={r.region_id} value={r.region_id}>{r.name_ar}</option>)}
                    </select>
                    <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AAA] pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-[900] uppercase tracking-[0.2em] text-[#A1A1A1] pr-1">المدينة</Label>
                  <div className="relative">
                    <select
                      className="w-full h-14 bg-[#F9F9F9] border-transparent rounded-2xl appearance-none pr-4 pl-10 focus:bg-white focus:border-[#1A1A1A] disabled:opacity-40 transition-all font-bold text-sm"
                      value={formData.city_id}
                      onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
                      disabled={!formData.region_id}
                      required
                    >
                      <option value="">اختر</option>
                      {filteredCities.map((c) => <option key={c.city_id} value={c.city_id}>{c.name_ar}</option>)}
                    </select>
                    <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AAA] pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-[900] uppercase tracking-[0.2em] text-[#A1A1A1] pr-1">البريد الإلكتروني</Label>
                <Input
                  className="h-14 bg-[#F9F9F9] border-transparent rounded-2xl focus:bg-white focus:border-[#1A1A1A] transition-all font-bold text-lg"
                  type="email"
                  placeholder="name@safqa.sa"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-[900] uppercase tracking-[0.2em] text-[#A1A1A1] pr-1">كلمة المرور</Label>
                <Input
                  className="h-14 bg-[#F9F9F9] border-transparent rounded-2xl focus:bg-white focus:border-[#1A1A1A] transition-all font-bold text-lg tracking-widest"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-[900] uppercase tracking-[0.2em] text-[#A1A1A1] pr-1">العنوان</Label>
                <Input
                  className="h-14 bg-[#F9F9F9] border-transparent rounded-2xl focus:bg-white focus:border-[#1A1A1A] transition-all font-bold text-lg"
                  placeholder="العنوان التفصيلي"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-[900] uppercase tracking-[0.2em] text-[#A1A1A1] pr-1">رقم الهاتف</Label>
                <Input
                  className="h-14 bg-[#F9F9F9] border-transparent rounded-2xl focus:bg-white focus:border-[#1A1A1A] transition-all font-bold text-lg"
                  type="tel"
                  placeholder="05xxxxxxxx"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-[900] uppercase tracking-[0.2em] text-[#A1A1A1] pr-1">رقم الهاتف الثانوي (اختياري)</Label>
                <Input
                  className="h-14 bg-[#F9F9F9] border-transparent rounded-2xl focus:bg-white focus:border-[#1A1A1A] transition-all font-bold text-lg"
                  type="tel"
                  placeholder="05xxxxxxxx"
                  value={formData.sec_phone}
                  onChange={(e) => setFormData({ ...formData, sec_phone: e.target.value })}
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-red-600 text-[11px] font-black uppercase tracking-wider text-center">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-[#1A1A1A] hover:bg-black text-white rounded-2xl text-xl font-[1000] shadow-2xl shadow-black/10 transition-all active:scale-[0.98]"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'إنشاء الحساب'}
              </Button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-[11px] font-[900] text-[#A1A1A1] uppercase tracking-[0.2em]">
                تملك حساباً بالفعل؟{' '}
                <Link href="/login" className="text-[#1A1A1A] hover:underline underline-offset-4">
                  سجل دخولك هنا
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-[9px] font-black text-[#CCC] uppercase tracking-[0.3em]">
          Safqa Smart Exchange Protocol © 2026
        </p>
      </div>
    </div>
  );
}