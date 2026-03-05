'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ProfileInfo from './components/ProfileInfo';
import PasswordChange from './components/PasswordChange';
import UserWallet from './components/UserWallet';
import { User, Lock, Wallet, ChevronLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleSuccess = (message: string) => {
    setSuccess(message);
    setError('');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleError = (message: string) => {
    setError(message);
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]" dir="rtl">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">إعدادات الحساب</h2>
            <p className="text-slate-500 mt-1">تحكم في بياناتك، الأمان، والمحفظة الرقمية</p>
          </div>
          
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors w-fit"
          >
            الرجوع للرئيسية
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Status Messages - Floating Style */}
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
          {success && (
            <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span className="text-sm font-medium">{success}</span>
            </div>
          )}
          {error && (
            <div className="bg-red-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
              <AlertCircle className="w-5 h-5 text-white" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}
        </div>

        {/* Modern Tabs Navigation */}
        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="bg-slate-200/50 p-1.5 rounded-[1.5rem] w-full md:w-fit flex gap-1">
            <TabsTrigger 
              value="profile"
              onClick={() => setActiveTab('profile')}
              className="flex-1 md:flex-none flex items-center gap-2 px-6 py-3 rounded-[1.2rem] data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all font-bold text-slate-600"
            >
              <User className="w-4 h-4" />
              <span>البيانات</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="password"
              onClick={() => setActiveTab('password')}
              className="flex-1 md:flex-none flex items-center gap-2 px-6 py-3 rounded-[1.2rem] data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all font-bold text-slate-600"
            >
              <Lock className="w-4 h-4" />
              <span>الأمان</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="wallet"
              onClick={() => setActiveTab('wallet')}
              className="flex-1 md:flex-none flex items-center gap-2 px-6 py-3 rounded-[1.2rem] data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all font-bold text-slate-600"
            >
              <Wallet className="w-4 h-4" />
              <span>المحفظة</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-8 transition-all duration-300">
            {activeTab === 'profile' && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                <ProfileInfo onSuccess={handleSuccess} onError={handleError} />
              </div>
            )}

            {activeTab === 'password' && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                <PasswordChange onSuccess={handleSuccess} onError={handleError} />
              </div>
            )}

            {activeTab === 'wallet' && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                <UserWallet />
              </div>
            )}
          </div>
        </Tabs>
      </main>
    </div>
  );
}