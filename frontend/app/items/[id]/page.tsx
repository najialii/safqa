'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { itemsApi } from '@/lib/api';
import { Item } from '@/types';
import { ArrowLeftRight, Package, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import ExchangeModal from '@/components/ExchangeModal';
import { useI18n } from '@/lib/i18n';
import { getLocalizedField } from '@/lib/utils';

export default function ItemDetailPage() {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const router = useRouter();
  const params = useParams();
  const { locale, t } = useI18n();

  const getImageUrl = (imagePath: string) => {
    return `http://localhost:8000/storage/${imagePath}`;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newZoom = Math.min(Math.max(1, zoom + delta), 4);
    setZoom(newZoom);
    if (newZoom === 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchItem();
  }, [params.id, router]);

  const fetchItem = async () => {
    try {
      const response = await itemsApi.getById(params.id as string);
      const itemData = response.data;
      if (itemData.images && typeof itemData.images === 'string') {
        itemData.images = JSON.parse(itemData.images);
      }
      setItem(itemData);
    } catch (error) {
      console.error('Error fetching item:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (item?.images && item.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
      resetZoom();
    }
  };

  const prevImage = () => {
    if (item?.images && item.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length);
      resetZoom();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-200 border-t-yellow-600"></div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('items.notFound')}</h3>
            <Button onClick={() => router.push('/items')}>{t('items.backToItems')}</Button>
          </div>
        </div>
      </div>
    );
  }

  const itemName = getLocalizedField(item, 'name', locale);
  const itemDescription = getLocalizedField(item, 'description', locale);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          ← {t('common.back')}
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg group">
              {item.images && item.images.length > 0 ? (
                <>
                  <div className="relative aspect-square">
                    <img 
                      src={getImageUrl(item.images[currentImageIndex])}
                      alt={itemName}
                      className="w-full h-full object-cover cursor-zoom-in"
                      onClick={() => setIsModalOpen(true)}
                    />
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="absolute top-4 left-4 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all"
                    >
                      <ZoomIn className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {item.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <ArrowLeftRight className="w-24 h-24 text-gray-300" />
                </div>
              )}
            </div>

            {item.images && item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {item.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-square rounded-2xl overflow-hidden transition-all ${
                      index === currentImageIndex ? 'ring-4 ring-amber-500' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={getImageUrl(img)}
                      alt={`${itemName} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-3 text-right">{itemName}</h1>
              <p className="text-gray-600 text-right leading-relaxed text-lg">{itemDescription}</p>
            </div>

            <Card className="border-none shadow-lg">
              <CardContent className="p-6 space-y-4">
                {item.estimated_value && (
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <span className="text-gray-600 font-semibold">{t('items.estimatedValue')}</span>
                    <span className="text-3xl font-black text-amber-600">{item.estimated_value.toLocaleString()} {t('common.currency')}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t('items.availableQuantity')}</span>
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-amber-500" />
                    <span className="text-2xl font-bold text-gray-900">{item.quantity}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t('items.category')}</span>
                  <span className="font-semibold text-gray-900">#{item.category_id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t('items.dateAdded')}</span>
                  <span className="text-sm text-gray-600">
                    {new Date(item.created_at).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Button className="w-full h-16 text-xl font-bold rounded-2xl" size="lg" onClick={() => setIsExchangeModalOpen(true)}>
              <ArrowLeftRight className="w-6 h-6" />
              {t('items.requestExchange')}
            </Button>
          </div>
        </div>
      </div>

      {isModalOpen && item.images && item.images.length > 0 && (
        <div 
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4"
          onClick={() => { setIsModalOpen(false); resetZoom(); }}
        >
          <button
            onClick={() => { setIsModalOpen(false); resetZoom(); }}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="absolute top-4 left-4 text-white text-sm bg-black/50 px-4 py-2 rounded-full z-10">
            {Math.round(zoom * 100)}% - {t('items.zoomHint')}
          </div>

          <div 
            className="relative max-w-6xl w-full h-full flex items-center justify-center overflow-hidden cursor-move"
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img 
              src={getImageUrl(item.images[currentImageIndex])}
              alt={itemName}
              className="max-w-full max-h-full object-contain select-none transition-transform"
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
              }}
              draggable={false}
            />

            {item.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                  {item.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => { setCurrentImageIndex(index); resetZoom(); }}
                      className={`h-2 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white w-8' : 'bg-white/40 w-2'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {item && (
        <ExchangeModal
          isOpen={isExchangeModalOpen}
          onClose={() => setIsExchangeModalOpen(false)}
          requestedItem={item}
        />
      )}
    </div>
  );
}
