'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, X } from 'lucide-react';
import { Item } from '@/types';
import { Button } from './ui/button';
import { Card } from './ui/card';

export default function FloatingBag() {
  const [isOpen, setIsOpen] = useState(false);
  const [myItems, setMyItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMyItems = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/items/my`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setMyItems(data);
    } catch (error) {
      console.error('Error fetching my items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isOpen) {
      fetchMyItems();
    }
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 left-8 z-50 w-16 h-16 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      >
        <ShoppingBag className="w-7 h-7" />
        {myItems.length > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full text-xs font-bold flex items-center justify-center">
            {myItems.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4" onClick={() => setIsOpen(false)}>
          <Card className="bg-white rounded-t-3xl md:rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">حقيبتي</h2>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-200 border-t-amber-600"></div>
                </div>
              ) : myItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">حقيبتك فارغة</p>
                  <p className="text-gray-400 text-sm mt-2">أضف عناصر لتبدأ التبادل</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {myItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                      <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="w-8 h-8 text-amber-600" />
                      </div>
                      <div className="flex-1 text-right">
                        <h3 className="font-bold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                        <div className="flex gap-4 mt-2 text-xs text-gray-600">
                          <span>الكمية: {item.quantity}</span>
                          {item.estimated_value && <span>القيمة: {item.estimated_value.toLocaleString()} ر.س</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
