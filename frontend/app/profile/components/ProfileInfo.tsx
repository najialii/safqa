'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, MapPin, Building2, Save, Loader2, ChevronDown } from 'lucide-react';

interface Region {
  region_id: number;
  name_ar: string;
}

interface City {
  city_id: number;
  region_id: number;
  name_ar: string;
}

interface ProfileInfoProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export default function ProfileInfo({ onSuccess, onError }: ProfileInfoProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    region_id: '',
    city_id: '',
  });
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/regions.json').then((res) => res.json()).then(setRegions);
    fetch('/cities.json').then((res) => res.json()).then(setCities);
    fetchProfile();
  }, []);

  useEffect(() => {
    if (formData.region_id) {
      const filtered = cities.filter(c => c.region_id === parseInt(formData.region_id));
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  }, [formData.region_id, cities]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/profile`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setFormData({
          name: data.name || '',
          email: data.email || '',
          region_id: data.region_id?.toString() || '',
          city_id: data.city_id?.toString() || '',
        });
      }
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (response.ok) onSuccess('تم حفظ التغييرات بنجاح');
      else onError('حدث خطأ أثناء التحديث');
    } catch (err) { onError('فشل الاتصال بالخادم'); }
    finally { setLoading(false); }
  };

  return (
    <Card className="border border-[#EEE] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] rounded-[2.5rem] overflow-hidden bg-white" dir="rtl">
      <CardHeader className="p-10 pb-6 border-b border-[#F5F5F5]">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-[#1A1A1A] rounded-2xl flex items-center justify-center">
            <User className="w-7 h-7 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl font-[1000] tracking-tight text-[#1A1A1A]">الملف الشخصي</CardTitle>
            <p className="text-sm font-bold text-[#A1A1A1] uppercase tracking-widest mt-1">General Information</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            
            {/* Name Input */}
            <div className="space-y-3">
              <Label className="text-xs font-[900] uppercase tracking-[0.2em] text-[#A1A1A1] pr-1">الاسم الكامل</Label>
              <div className="relative group">
                <Input
                  className="pr-4 h-14 bg-[#F9F9F9] border-transparent rounded-2xl focus:bg-white focus:border-[#1A1A1A] transition-all font-bold text-lg"
                  placeholder="أدخل اسمك الكامل"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-3">
              <Label className="text-xs font-[900] uppercase tracking-[0.2em] text-[#A1A1A1] pr-1">البريد الإلكتروني</Label>
              <div className="relative group">
                <Input
                  className="pr-4 h-14 bg-[#F9F9F9] border-transparent rounded-2xl focus:bg-white focus:border-[#1A1A1A] transition-all font-bold text-lg"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Region Select */}
            <div className="space-y-3">
              <Label className="text-xs font-[900] uppercase tracking-[0.2em] text-[#A1A1A1] pr-1">المنطقة</Label>
              <div className="relative">
                <select
                  className="w-full pr-4 pl-10 h-14 bg-[#F9F9F9] border-transparent rounded-2xl appearance-none focus:outline-none focus:bg-white focus:border-[#1A1A1A] transition-all font-bold text-lg"
                  value={formData.region_id}
                  onChange={(e) => setFormData({ ...formData, region_id: e.target.value, city_id: '' })}
                >
                  <option value="">اختر المنطقة</option>
                  {regions.map((r) => <option key={r.region_id} value={r.region_id}>{r.name_ar}</option>)}
                </select>
                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#AAA] pointer-events-none" />
              </div>
            </div>

            {/* City Select */}
            <div className="space-y-3">
              <Label className="text-xs font-[900] uppercase tracking-[0.2em] text-[#A1A1A1] pr-1">المدينة</Label>
              <div className="relative">
                <select
                  className="w-full pr-4 pl-10 h-14 bg-[#F9F9F9] border-transparent rounded-2xl appearance-none focus:outline-none focus:bg-white focus:border-[#1A1A1A] disabled:opacity-40 transition-all font-bold text-lg"
                  value={formData.city_id}
                  onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
                  disabled={!formData.region_id}
                >
                  <option value="">اختر المدينة</option>
                  {filteredCities.map((c) => <option key={c.city_id} value={c.city_id}>{c.name_ar}</option>)}
                </select>
                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#AAA] pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#F5F5F5] flex justify-end">
            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full md:w-auto h-16 px-12 bg-[#1A1A1A] hover:bg-black text-white rounded-2xl text-xl font-black transition-all active:scale-[0.97] flex gap-3 shadow-2xl shadow-black/10"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
              {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}