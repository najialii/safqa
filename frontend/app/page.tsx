'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight, ShieldCheck, Zap, ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import Header from '@/components/Header';
import { useI18n } from '@/lib/i18n';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { t, locale } = useI18n();
  const [districts, setDistricts] = useState<any[]>([]);
  const isRtl = locale === 'ar';

  useEffect(() => {
    fetch('/saudiareasjson/districts_lite.json')
      .then(res => res.json())
      .then(data => {
        const uniqueDistricts = data.slice(0, 50);
        setDistricts(uniqueDistricts);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#0F0F0F] font-sans antialiased selection:bg-[#1A1A1A] selection:text-white" dir={isRtl ? 'rtl' : 'ltr'}>
      <Header />

      <section className="relative pt-24 pb-12 md:pt-32 md:pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className={`flex flex-col ${isRtl ? 'items-start text-right' : 'items-start text-left'}`}>
            
            <div className="flex items-center gap-2 mb-6 bg-[#1A1A1A] text-white px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">{t('home.badge')}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight mb-8 max-w-5xl">
              {t('home.heroTitle1')} <span className="text-amber-500">{t('home.heroTitle2')}</span>
              <br />
              <span className="text-[#A1A1A1] inline-block mt-2">{t('home.heroTitle3')}</span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full items-center">
              <div className="md:col-span-7">
                <p className="text-lg md:text-xl font-medium text-[#444] leading-relaxed max-w-xl">
                  {t('home.heroDescription')}
                </p>
              </div>
              
              <div className={`md:col-span-5 flex flex-col ${isRtl ? 'md:items-end' : 'md:items-start'} gap-4`}>
                <Link href="/auth" className="group">
                  <div className="flex items-center gap-4 bg-[#1A1A1A] text-white px-6 py-4 rounded-xl hover:bg-black transition-all">
                    <span className="text-xl font-black">{t('home.startNow')}</span>
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                      {isRtl ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                    </div>
                  </div>
                </Link>
                <div className="flex gap-4 text-[10px] font-bold text-[#888] uppercase tracking-widest px-2">
                  <span>{t('home.users')}</span>
                  <span>•</span>
                  <span>{t('home.secure')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1A1A1A] text-white p-10 rounded-[2rem] flex flex-col justify-between h-[380px] group overflow-hidden relative">
            <Zap className={`w-10 h-10 text-amber-400 absolute top-8 ${isRtl ? 'left-8' : 'right-8'} opacity-20 group-hover:opacity-100 transition-opacity`} />
            <div className="mt-auto">
              <h3 className="text-3xl font-black mb-3">{t('home.feature1Title')}</h3>
              <p className="text-gray-400 text-base leading-snug">
                {t('home.feature1Description')}
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#EEE] p-10 rounded-[2rem] flex flex-col justify-between h-[380px] shadow-sm">
            <div className="flex justify-between items-start">
              <div className="w-14 h-14 bg-[#F5F5F5] rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-black" />
              </div>
              <ArrowUpRight className="text-[#CCC] w-5 h-5" />
            </div>
            <div>
              <h3 className="text-3xl font-black mb-3 text-[#1A1A1A]">{t('home.feature2Title')}</h3>
              <p className="text-[#666] text-base leading-snug">
                {t('home.feature2Description')}
              </p>
            </div>
          </div>

          <div className="bg-amber-400 p-10 rounded-[2rem] flex flex-col justify-between h-[380px]">
             <div className="text-5xl font-black leading-none tracking-tighter text-amber-900/20 italic uppercase">0% Cash</div>
             <div>
              <h3 className="text-3xl font-black mb-3 text-amber-950">{t('home.feature3Title')}</h3>
              <p className="text-amber-900/70 text-base leading-snug font-bold">
                {t('home.feature3Description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 border-y border-[#EEE] bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-[#AAA] mb-10">{t('home.trustedBy')}</p>
          <div className="relative">
            <div className={`flex ${isRtl ? 'animate-scroll-rtl' : 'animate-scroll-ltr'} gap-8`}>
              {districts.concat(districts).map((district, index) => (
                <span key={index} className="text-lg font-black whitespace-nowrap opacity-30 hover:opacity-100 transition-opacity">
                  {isRtl ? district.name_ar : district.name_en}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-10 text-[#1A1A1A]">
            {t('home.ctaTitle')}
          </h2>
          <Link href="/auth">
            <button className="bg-[#1A1A1A] text-white text-xl font-black px-12 py-6 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl">
              {t('home.ctaButton')}
            </button>
          </Link>
        </div>
      </section>

      <footer className="bg-white py-12 px-6 border-t border-[#EEE]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
               <ArrowLeftRight className="w-5 h-5 text-white" />
             </div>
             <span className="font-black text-xl tracking-tighter">صفقة</span>
          </div>
          
          <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-[#666]">
            <Link href="#" className="hover:text-black">{t('footer.privacy')}</Link>
            <Link href="#" className="hover:text-black">{t('footer.terms')}</Link>
            <Link href="#" className="hover:text-black">{t('footer.contact')}</Link>
          </div>

          <p className="text-[#BBB] text-[10px] font-bold">{t('footer.copyright')}</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes scroll-ltr {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-rtl {
          0% { transform: translateX(0); }
          100% { transform: translateX(50%); }
        }
        .animate-scroll-ltr {
          animation: scroll-ltr 40s linear infinite;
        }
        .animate-scroll-rtl {
          animation: scroll-rtl 40s linear infinite;
        }
      `}</style>
    </div>
  );
}