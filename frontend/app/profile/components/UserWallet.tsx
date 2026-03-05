'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, ArrowUpRight, History, Gift, Plus } from 'lucide-react';

export default function UserWallet() {
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  const fetchWalletBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/profile`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setPoints(data.points || 0);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-2 space-y-6" dir="rtl">
      
      {/* Main Balance Card: Premium Dark Aesthetic */}
      <Card className="overflow-hidden border-none bg-[#1A1A1A] text-white rounded-[2.5rem] shadow-2xl shadow-black/20">
        <CardContent className="p-10">
          <div className="flex justify-between items-center mb-12">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A1A1A1]">Active Wallet</span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[#A1A1A1] text-xs font-[900] uppercase tracking-[0.2em]">إجمالي الرصيد</p>
            {loading ? (
              <div className="h-16 w-32 bg-white/5 animate-pulse rounded-2xl" />
            ) : (
              <div className="flex items-baseline gap-3">
                <span className="text-7xl font-[1000] tracking-tighter">
                  {points.toLocaleString()}
                </span>
                <span className="text-xl font-black text-amber-500 italic">PTS</span>
              </div>
            )}
          </div>

          <div className="mt-12 flex gap-3">
            <button className="flex-1 bg-white text-black h-14 rounded-2xl flex items-center justify-center gap-2 font-black text-sm uppercase tracking-tighter hover:bg-amber-500 transition-colors group">
              <Plus className="w-4 h-4" />
              شحن الرصيد
            </button>
            <button className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-colors">
              <History className="w-6 h-6 text-white" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats / Secondary Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button className="p-6 bg-white border border-[#EEE] rounded-[2rem] hover:border-black transition-all group text-right">
          <div className="w-10 h-10 bg-[#F5F5F5] rounded-xl flex items-center justify-center mb-4 group-hover:bg-black transition-colors">
            <Gift className="w-5 h-5 text-black group-hover:text-white" />
          </div>
          <p className="text-[10px] font-black text-[#A1A1A1] uppercase tracking-widest">Rewards</p>
          <p className="text-lg font-black text-[#1A1A1A]">استبدال</p>
        </button>

        <button className="p-6 bg-white border border-[#EEE] rounded-[2rem] hover:border-black transition-all group text-right">
          <div className="w-10 h-10 bg-[#F5F5F5] rounded-xl flex items-center justify-center mb-4 group-hover:bg-black transition-colors">
            <ArrowUpRight className="w-5 h-5 text-black group-hover:text-white" />
          </div>
          <p className="text-[10px] font-black text-[#A1A1A1] uppercase tracking-widest">Transfer</p>
          <p className="text-lg font-black text-[#1A1A1A]">تحويل</p>
        </button>
      </div>

      {/* Footer Info */}
      <div className="pt-4 px-4">
        <div className="bg-[#F9F9F9] p-4 rounded-2xl border border-[#EEE]">
           <p className="text-[9px] leading-relaxed text-[#888] font-bold text-center uppercase tracking-widest">
             جميع نقاط "صفقة" محمية وموثقة عبر نظام التشفير الموحد لعام 2026.
           </p>
        </div>
      </div>
    </div>
  );
}