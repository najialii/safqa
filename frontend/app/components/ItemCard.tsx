'use client';

import { Item } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeftRight, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { getLocalizedField } from '@/lib/utils';

interface ItemCardProps {
  item: Item;
  onClick?: () => void;
}

export default function ItemCard({ item, onClick }: ItemCardProps) {
  const router = useRouter();
  const { locale, t } = useI18n();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/items/${item.id}`);
    }
  };

  const getImageUrl = () => {
    if (!item.images || item.images.length === 0) return null;
    const imagePath = item.images[0];
    return `http://localhost:8000/storage/${imagePath}`;
  };

  const imageUrl = getImageUrl();
  const itemName = getLocalizedField(item, 'name', locale);
  const itemDescription = getLocalizedField(item, 'description', locale);

  return (
    <Card
      className="border-none bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] transition-all duration-500 overflow-hidden group cursor-pointer rounded-3xl"
      onClick={handleClick}
    >
      <div className="relative h-60 bg-gradient-to-br from-gray-50 to-amber-50/50 overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl}
            alt={itemName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:scale-110 transition-transform duration-700">
            <ArrowLeftRight className="w-20 h-20 text-amber-200" />
          </div>
        )}
        
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <div className="px-3 py-1 bg-white/80 backdrop-blur-md rounded-full text-[11px] font-bold text-gray-700 shadow-sm border border-white/20 flex items-center gap-1.5">
            <Package className="w-3 h-3 text-amber-500" />
            {t('items.quantity')}: {item.quantity}
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex flex-col gap-3">
          <div>
            <h3 className="text-xl font-black text-gray-900 text-right group-hover:text-amber-600 transition-colors duration-300">
              {itemName}
            </h3>
            <p className="text-gray-500 text-right text-sm line-clamp-2 leading-relaxed font-medium">
              {itemDescription}
            </p>
          </div>
          {item.estimated_value && (
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-500">{t('items.estimatedValue')}</span>
              <span className="text-lg font-bold text-amber-600">{item.estimated_value.toLocaleString()} {t('common.currency')}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
