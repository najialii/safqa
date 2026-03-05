'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Menu, X, Plus, LogOut, User, Settings, ArrowLeftRight, Globe } from 'lucide-react';
import FloatingBag from './FloatingBag';
import { useI18n } from '@/lib/i18n';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { locale, setLocale, t } = useI18n();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(userData);
    
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
  }, [isMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsMenuOpen(false);
    router.push('/login');
  };

  const toggleLanguage = () => {
    setLocale(locale === 'ar' ? 'en' : 'ar');
  };

  return (
    <>
      <FloatingBag />
      <nav className="bg-white/90 backdrop-blur-md border-b border-[#EEE] sticky top-0 z-[60] w-full h-24 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="flex justify-between items-center">
            
            <Link href="/" className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-[#1A1A1A] rounded-xl flex items-center justify-center transition-transform group-active:scale-90">
                <ArrowLeftRight className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-[1000] tracking-tighter text-[#1A1A1A] leading-none">صفقة</span>
                <span className="text-[10px] font-black text-[#A1A1A1] uppercase tracking-[0.2em] mt-1">SAFQA</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[#666] hover:text-black transition-colors"
              >
                <Globe className="w-4 h-4" />
                {locale === 'ar' ? 'EN' : 'AR'}
              </button>

              {user && (
                <Link href="/items" className="text-sm font-black uppercase tracking-widest text-[#666] hover:text-black transition-colors">
                  {t('nav.explore')}
                </Link>
              )}

              {user ? (
                <div className="flex items-center gap-6">
                  <Link href="/profile" className="text-sm font-black uppercase tracking-widest text-[#666] hover:text-black transition-colors">
                    {user.name}
                  </Link>
                  <button onClick={handleLogout} className="text-[#AAA] hover:text-red-500 transition-colors">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link href="/login" className="text-sm font-black uppercase tracking-widest text-[#666] hover:text-black">
                  {t('auth.login')}
                </Link>
              )}
              
              <div className="h-4 w-[1px] bg-[#EEE]" />

              <Link href="/items/add">
                <Button className="bg-[#1A1A1A] hover:bg-black text-white rounded-xl h-12 px-8 font-black text-sm uppercase tracking-widest shadow-xl shadow-black/10 flex gap-3 transition-all active:scale-95">
                  <Plus className="w-4 h-4" />
                  {t('items.addItem')}
                </Button>
              </Link>
            </div>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-12 h-12 flex items-center justify-center bg-[#F5F5F5] rounded-xl text-black"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Fullscreen Mobile Menu: Ultra Clean */}
      <div className={`fixed inset-0 z-[55] bg-white transition-all duration-500 md:hidden ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="pt-32 px-10 flex flex-col h-full">
          <div className="flex flex-col gap-8">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-5xl font-black tracking-tighter text-[#1A1A1A]">{t('nav.home')}</Link>
            <Link href="/items" onClick={() => setIsMenuOpen(false)} className="text-5xl font-black tracking-tighter text-[#1A1A1A]">{t('nav.explore')}</Link>
            {user && (
              <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="text-5xl font-black tracking-tighter text-[#1A1A1A]">{t('nav.myAccount')}</Link>
            )}
            <Link href="/settings" onClick={() => setIsMenuOpen(false)} className="text-5xl font-black tracking-tighter text-[#A1A1A1]">{t('nav.settings')}</Link>
            <button
              onClick={() => { toggleLanguage(); setIsMenuOpen(false); }}
              className="text-5xl font-black tracking-tighter text-[#A1A1A1] text-left flex items-center gap-4"
            >
              <Globe className="w-12 h-12" />
              {locale === 'ar' ? 'English' : 'العربية'}
            </button>
          </div>

          <div className="mt-auto mb-20 space-y-6">
            <Link href="/items/add" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full h-20 bg-[#1A1A1A] text-white text-2xl font-black rounded-3xl">
                {t('items.addItem')}
              </Button>
            </Link>
            {user ? (
              <button onClick={handleLogout} className="w-full text-center text-red-500 font-black uppercase tracking-widest">{t('auth.logout')}</button>
            ) : (
              <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block w-full text-center font-black uppercase tracking-widest text-[#666]">{t('auth.login')}</Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}