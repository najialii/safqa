'use client';

import { useEffect, useState } from 'react';
import { itemsApi } from '@/lib/api';
import { Item } from '@/types';

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">صفقة</h1>
                <p className="text-xs text-gray-500">منصة التبادل الذكي</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-all">
                عناصري
              </button>
              <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium">
                + إضافة عنصر
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">اكتشف وتبادل</h2>
            <p className="text-lg text-gray-600">ابحث عن العناصر التي تريدها وابدأ التبادل</p>
          </div>
          
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن أي شيء..."
                className="w-full px-6 py-5 pr-14 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-right text-lg shadow-sm"
              />
              <button
                type="submit"
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div className="relative h-56 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <span className="text-5xl">
                        {item.category_id === 1 ? '📱' : 
                         item.category_id === 2 ? '🛋️' :
                         item.category_id === 3 ? '👔' :
                         item.category_id === 4 ? '📚' :
                         item.category_id === 5 ? '⚽' :
                         item.category_id === 6 ? '🎮' :
                         item.category_id === 7 ? '🚗' : '🏠'}
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 shadow-sm">
                    الكمية: {item.qty}
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 text-right group-hover:text-blue-600 transition-colors">{item.name}</h3>
                  <p className="text-gray-600 mb-4 text-right text-sm line-clamp-2 leading-relaxed">{item.description}</p>
                  
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">القيمة التقديرية</div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {item.price.toLocaleString()} ر.س
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold text-base group-hover:scale-[1.02] flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    طلب تبادل
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-6xl">🔍</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">لا توجد نتائج</h3>
            <p className="text-gray-600 text-lg">جرب البحث بكلمات مختلفة أو تصفح جميع العناصر</p>
          </div>
        )}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedItem(null)}>
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-80 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-2xl">
                  <span className="text-7xl">
                    {selectedItem.category_id === 1 ? '📱' : 
                     selectedItem.category_id === 2 ? '🛋️' :
                     selectedItem.category_id === 3 ? '👔' :
                     selectedItem.category_id === 4 ? '📚' :
                     selectedItem.category_id === 5 ? '⚽' :
                     selectedItem.category_id === 6 ? '🎮' :
                     selectedItem.category_id === 7 ? '🚗' : '🏠'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 text-right">{selectedItem.name}</h2>
              <p className="text-gray-600 mb-6 text-right leading-relaxed text-lg">{selectedItem.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-5 text-right">
                  <div className="text-sm text-gray-600 mb-1">القيمة التقديرية</div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {selectedItem.price.toLocaleString()} ر.س
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 text-right">
                  <div className="text-sm text-gray-600 mb-1">الكمية المتاحة</div>
                  <div className="text-3xl font-bold text-gray-900">{selectedItem.qty}</div>
                </div>
              </div>
              
              <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-xl transition-all font-bold text-lg flex items-center justify-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                اختر عنصرك للتبادل
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
