'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';

interface PasswordChangeProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export default function PasswordChange({ onSuccess, onError }: PasswordChangeProps) {
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess('تم تحديث كلمة المرور بنجاح');
        setPasswordData({ current_password: '', new_password: '' });
      } else {
        onError(data.message || 'كلمة المرور الحالية غير صحيحة');
      }
    } catch (err) {
      onError('فشل الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border border-[#EEE] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] rounded-[2.5rem] overflow-hidden bg-white" dir="rtl">
      <CardHeader className="p-10 pb-6 border-b border-[#F5F5F5]">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-[#1A1A1A] rounded-2xl flex items-center justify-center shadow-xl shadow-black/10">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl font-[1000] tracking-tight text-[#1A1A1A]">الأمان</CardTitle>
            <p className="text-sm font-bold text-[#A1A1A1] uppercase tracking-widest mt-1">Security Update</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-10">
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-10">
          
          <div className="grid grid-cols-1 gap-8">
            {/* Current Password */}
            <div className="space-y-3">
              <Label className="text-xs font-[900] uppercase tracking-[0.2em] text-[#A1A1A1] pr-1">كلمة المرور الحالية</Label>
              <div className="relative">
                <Input
                  type={showCurrent ? "text" : "password"}
                  className="pr-5 pl-14 h-16 bg-[#F9F9F9] border-transparent rounded-2xl focus:bg-white focus:border-[#1A1A1A] transition-all font-bold text-xl tracking-widest"
                  placeholder="••••••••"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-[#AAA] hover:text-black transition-colors p-1"
                >
                  {showCurrent ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-3">
              <div className="flex justify-between items-center pr-1">
                <Label className="text-xs font-[900] uppercase tracking-[0.2em] text-[#A1A1A1]">كلمة المرور الجديدة</Label>
                <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md uppercase tracking-tighter">Strong Required</span>
              </div>
              <div className="relative">
                <Input
                  type={showNew ? "text" : "password"}
                  className="pr-5 pl-14 h-16 bg-[#F9F9F9] border-transparent rounded-2xl focus:bg-white focus:border-[#1A1A1A] transition-all font-bold text-xl tracking-widest"
                  placeholder="••••••••"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-[#AAA] hover:text-black transition-colors p-1"
                >
                  {showNew ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>
              </div>
              <p className="text-[10px] font-bold text-[#BBB] pr-1">استخدم مزيجاً من الحروف والأرقام (8 رموز كحد أدنى)</p>
            </div>
          </div>

          <div className="pt-6 border-t border-[#F5F5F5] flex justify-end">
            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full md:w-auto h-16 px-12 bg-[#1A1A1A] hover:bg-black text-white rounded-2xl text-xl font-black transition-all active:scale-[0.97] flex gap-3 shadow-2xl shadow-black/10"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShieldCheck className="w-6 h-6" />}
              {loading ? 'جاري التحديث...' : 'تأكيد التعديل'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}