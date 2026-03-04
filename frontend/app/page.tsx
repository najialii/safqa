'use client';

import { useEffect, useState } from 'react';
import { itemsApi } from '@/lib/api';
import { Item } from '@/types';

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await itemsApi.getAll();
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchItems();
      return;
    }
    try {
      const response = await itemsApi.search(searchQuery);
      setItems(response.data);
    } catch (error) {
      console.error('Error searching items:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">ص</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">صفقة</h1>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 text-gray-700 hover:text-emerald-600 font-medium transition-colors">
                عناصري
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all font-medium">
                إضافة عنصر
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن العناصر..."
                className="w-full px-6 py-4 pr-12 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-right shadow-sm"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
              >
                <div className="h-48 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-3xl">📦</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 text-right">{item.name}</h3>
                  <p className="text-gray-600 mb-4 text-right line-clamp-2">{item.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-emerald-600">{item.price} ر.س</span>
                    <span className="text-sm text-gray-500">الكمية: {item.quantity}</span>
                  </div>
                  <button className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all font-medium group-hover:scale-[1.02]">
                    بدء صفقة
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد عناصر</h3>
            <p className="text-gray-600">جرب البحث بكلمات مختلفة</p>
          </div>
        )}
      </main>
    </div>
  );
}
