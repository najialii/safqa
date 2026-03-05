'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { itemsApi } from '@/lib/api';
import { Item } from '@/types';
import ItemCard from '../components/ItemCard';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/lib/i18n';

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { t } = useI18n();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchItems();
  }, [router]);

  const fetchItems = async () => {
    try {
      const response = await itemsApi.getAll();
      console.log('Items response:', response.data);
      const data = Array.isArray(response.data) ? response.data : [];
      const parsedData = data.map((item: any) => {
        if (item.images && typeof item.images === 'string') {
          item.images = JSON.parse(item.images);
        }
        return item;
      });
      setItems(parsedData);
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
      console.log('Search response:', response.data);
      const data = Array.isArray(response.data) ? response.data : [];
      const parsedData = data.map((item: any) => {
        if (item.images && typeof item.images === 'string') {
          item.images = JSON.parse(item.images);
        }
        return item;
      });
      setItems(parsedData);
    } catch (error) {
      console.error('Error searching items:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">{t('items.explore')}</h2>
            <p className="text-lg text-gray-600">{t('items.exploreDescription')}</p>
          </div>
          
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="relative">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('common.search')}
                className="pr-14 py-5 text-lg"
              />
              <Button
                type="submit"
                className="absolute left-2 top-1/2 -translate-y-1/2"
                size="sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Button>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-200 border-t-yellow-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-6xl">🔍</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('items.noResults')}</h3>
            <p className="text-gray-600 text-lg">{t('items.noResultsDescription')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
