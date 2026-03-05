'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Item } from '@/types';
import { Package, X, ArrowLeftRight, Check, Plus, AlertCircle } from 'lucide-react';

interface ExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestedItem: Item;
}

export default function ExchangeModal({ isOpen, onClose, requestedItem }: ExchangeModalProps) {
  const [myItems, setMyItems] = useState<Item[]>([]);
  const [selectedMyItem, setSelectedMyItem] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8000/storage/${imagePath}`;
  };

  useEffect(() => {
    if (isOpen) fetchMyItems();
  }, [isOpen]);

  const fetchMyItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/items/my', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      const parsedData = data.map((item: any) => {
        if (item.images && typeof item.images === 'string') {
          item.images = JSON.parse(item.images);
        }
        return item;
      });
      setMyItems(parsedData);
    } catch (error) {
      console.error('Error fetching my items:', error);
    }
  };

  const handleExchangeRequest = async () => {
    if (!selectedMyItem) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/safqas', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          offered_item_id: selectedMyItem,
          requsted_item_id: requestedItem.id,
          receiver_id: requestedItem.user_id,
        }),
      });

      if (response.ok) {
        onClose();
        alert('تم إرسال طلب التبادل بنجاح!');
      } else {
        alert('حدث خطأ أثناء إرسال الطلب');
      }
    } catch (error) {
      alert('فشل الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const selectedItemData = myItems.find(i => i.id === selectedMyItem);

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <Card 
        className="max-w-4xl w-full max-h-[90vh] overflow-hidden border-none shadow-2xl rounded-[2rem]" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </Button>
          <div className="text-right">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">إتمام الصفقة</h2>
            <p className="text-sm text-gray-500 font-medium">اختر أحد مقتنياتك للمبادلة</p>
          </div>
        </div>

        <div className="p-8 overflow-y-auto max-h-[calc(90vh-180px)] bg-gray-50/50">
          {/* Comparison Area */}
          <div className="flex flex-col md:flex-row items-center gap-4 mb-10 relative">
            
            {/* Requested Item */}
            <div className="w-full space-y-3">
              <label className="text-xs font-black text-green-600 uppercase tracking-widest block text-right">العنصر المطلوب</label>
              <div className="bg-white border-2 border-green-100 p-4 rounded-3xl shadow-sm flex flex-row-reverse gap-4 items-center">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                  {requestedItem.images?.[0] ? (
                    <img src={getImageUrl(requestedItem.images[0])} className="w-full h-full object-cover" />
                  ) : <Package className="w-full h-full p-4 text-gray-300" />}
                </div>
                <div className="text-right flex-1">
                  <h4 className="font-bold text-gray-900 leading-tight truncate">{requestedItem.name}</h4>
                  <p className="text-sm font-black text-green-600 mt-1">{requestedItem.estimated_value?.toLocaleString()} ر.س</p>
                </div>
              </div>
            </div>

            {/* VS Icon */}
            <div className="z-10 bg-gray-900 text-white p-3 rounded-full shadow-xl border-4 border-white">
              <ArrowLeftRight className="w-6 h-6" />
            </div>

            {/* Offered Item */}
            <div className="w-full space-y-3">
              <label className="text-xs font-black text-amber-600 uppercase tracking-widest block text-right">عنصرك المعروض</label>
              {selectedItemData ? (
                <div className="bg-white border-2 border-amber-100 p-4 rounded-3xl shadow-sm flex flex-row-reverse gap-4 items-center animate-in zoom-in-95 duration-200">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                    {selectedItemData.images?.[0] ? (
                      <img src={getImageUrl(selectedItemData.images[0])} className="w-full h-full object-cover" />
                    ) : <Package className="w-full h-full p-4 text-gray-300" />}
                  </div>
                  <div className="text-right flex-1">
                    <h4 className="font-bold text-gray-900 leading-tight truncate">{selectedItemData.name}</h4>
                    <p className="text-sm font-black text-amber-600 mt-1">{selectedItemData.estimated_value?.toLocaleString()} ر.س</p>
                  </div>
                  <button onClick={() => setSelectedMyItem('')} className="text-gray-300 hover:text-red-500 p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-200 p-4 rounded-3xl h-[104px] flex items-center justify-center bg-white/50">
                  <p className="text-sm text-gray-400 font-bold">لم يتم الاختيار بعد</p>
                </div>
              )}
            </div>
          </div>

          {/* Selection Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-row-reverse">
              <h3 className="text-lg font-black text-gray-900">مقتنياتك المتاحة</h3>
              <span className="text-xs font-bold px-3 py-1 bg-gray-200 rounded-full text-gray-600">{myItems.length} عنصر</span>
            </div>

            {myItems.length === 0 ? (
              <div className="bg-white rounded-[2rem] p-12 text-center border border-gray-100">
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-10 h-10 text-amber-500" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">خزانتك فارغة!</h3>
                <p className="text-gray-500 mb-6 max-w-xs mx-auto">تحتاج لإضافة عناصر إلى حسابك أولاً لتتمكن من مقايضتها مع الآخرين</p>
                <Button 
                  onClick={() => router.push('/items/add')}
                  className="rounded-xl px-8 h-12 bg-amber-500 hover:bg-amber-600 font-bold gap-2"
                >
                  <Plus className="w-4 h-4" /> إضافة عنصر جديد
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myItems.map((item) => {
                  const isSelected = selectedMyItem === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedMyItem(isSelected ? '' : item.id)}
                      className={`group relative flex flex-row-reverse gap-4 p-4 rounded-3xl border-2 transition-all text-right items-center ${
                        isSelected
                          ? 'border-amber-500 bg-white shadow-lg shadow-amber-100'
                          : 'border-white bg-white hover:border-gray-200 hover:shadow-md shadow-sm'
                      }`}
                    >
                      <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                        {item.images?.[0] ? (
                          <img src={getImageUrl(item.images[0])} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        ) : <Package className="w-full h-full p-4 text-gray-200" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 text-sm mb-0.5 truncate">{item.name}</h4>
                        <p className="text-xs font-black text-amber-500">{item.estimated_value?.toLocaleString()} ر.س</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-amber-500 border-amber-500' : 'border-gray-100 group-hover:border-amber-200'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        {myItems.length > 0 && (
          <div className="p-8 bg-white border-t border-gray-100">
            <div className="flex flex-col gap-4">
              {!selectedMyItem && (
                <div className="flex items-center justify-center gap-2 text-amber-600 bg-amber-50 py-2 rounded-xl animate-pulse">
                  <AlertCircle className="w-4 h-4" />
                  <p className="text-xs font-black">يرجى اختيار عنصر للمتابعة</p>
                </div>
              )}
              <Button
                onClick={handleExchangeRequest}
                disabled={!selectedMyItem || loading}
                className={`w-full h-16 text-lg font-black rounded-2xl shadow-xl transition-all duration-300 ${
                  selectedMyItem 
                    ? 'bg-gray-900 hover:bg-black text-white shadow-gray-200' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                }`}
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>جاري إرسال طلبك...</span>
                  </div>
                ) : 'إرسال طلب التبادل الآن'}
              </Button>
              <p className="text-[10px] text-gray-400 text-center font-medium">بضغطك على إرسال، أنت توافق على شروط وقوانين منصة صفقة للتبادل التجاري</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}