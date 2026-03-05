'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Plus, Trash2, Package, Tag, ListPlus, AlertCircle, Upload, X } from 'lucide-react';

interface Category {
  id: number;
  name: string;
}

export default function AddItemPage() {
  const [formData, setFormData] = useState({
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    quantity: '1',
    estimated_value: '',
    category_id: '',
    desired_items: [''],
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchCategories();
  }, [router]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleAddDesiredItem = () => {
    setFormData({ ...formData, desired_items: [...formData.desired_items, ''] });
  };

  const handleRemoveDesiredItem = (index: number) => {
    const newDesiredItems = formData.desired_items.filter((_, i) => i !== index);
    setFormData({ ...formData, desired_items: newDesiredItems.length > 0 ? newDesiredItems : [''] });
  };

  const handleDesiredItemChange = (index: number, value: string) => {
    const newDesiredItems = [...formData.desired_items];
    newDesiredItems[index] = value;
    setFormData({ ...formData, desired_items: newDesiredItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const filteredDesiredItems = formData.desired_items.filter(item => item.trim() !== '');
      
      const formDataToSend = new FormData();
      formDataToSend.append('name_ar', formData.name_ar);
      formDataToSend.append('name_en', formData.name_en);
      formDataToSend.append('description_ar', formData.description_ar);
      formDataToSend.append('description_en', formData.description_en);
      formDataToSend.append('quantity', formData.quantity);
      formDataToSend.append('estimated_value', formData.estimated_value);
      formDataToSend.append('category_id', formData.category_id);
      
      images.forEach((img) => {
        formDataToSend.append('images[]', img);
      });
      
      if (filteredDesiredItems.length > 0) {
        filteredDesiredItems.forEach((item, index) => {
          formDataToSend.append(`desired_items[${index}]`, item);
        });
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/items`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        router.push('/items');
      } else {
        const data = await response.json();
        setError(data.message || 'حدث خطأ ما');
      }
    } catch (err) {
      setError('فشل الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImages([...images, ...files]);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <button 
          onClick={() => router.back()} 
          className="group flex items-center gap-2 text-gray-500 hover:text-black mb-10 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center group-hover:bg-gray-50 transition-all">
            <ChevronRight className="w-4 h-4 rotate-180" />
          </div>
          <span className="text-sm font-semibold">العودة للرئيسية</span>
        </button>

        <div className="mb-10 text-right">
          <h1 className="text-3xl font-black text-gray-900 mb-2">إضافة عرض جديد</h1>
          <p className="text-gray-500 font-medium">املأ البيانات بالأسفل لإدراج عنصرك في السوق</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] overflow-hidden">
            <CardContent className="p-8 md:p-10 space-y-8">
              
              <div className="space-y-3 text-right">
                <Label className="text-gray-900 font-bold text-lg flex items-center gap-2 justify-end">
                  صور العنصر
                  <Upload className="w-4 h-4 text-amber-500" />
                </Label>
                
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative w-full h-40 rounded-2xl overflow-hidden bg-gray-100">
                        <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <Upload className="w-10 h-10 text-gray-400 mb-2" />
                  <span className="text-gray-600 font-semibold">اضغط لرفع صور</span>
                  <span className="text-gray-400 text-sm mt-1">PNG, JPG حتى 2MB لكل صورة</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="space-y-3 text-right">
                <Label htmlFor="name_ar" className="text-gray-900 font-bold text-lg flex items-center gap-2 justify-end">
                  اسم العنصر (عربي)
                  <Tag className="w-4 h-4 text-amber-500" />
                </Label>
                <Input
                  id="name_ar"
                  value={formData.name_ar}
                  onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                  placeholder="مثال: لابتوب ماك بوك برو"
                  className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-amber-500/20 text-right text-lg transition-all"
                  required
                />
              </div>

              <div className="space-y-3 text-right">
                <Label htmlFor="name_en" className="text-gray-900 font-bold text-lg flex items-center gap-2 justify-end">
                  اسم العنصر (إنجليزي)
                  <Tag className="w-4 h-4 text-amber-500" />
                </Label>
                <Input
                  id="name_en"
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                  placeholder="Example: MacBook Pro Laptop"
                  className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-amber-500/20 text-left text-lg transition-all"
                  required
                />
              </div>

              <div className="space-y-3 text-right">
                <Label htmlFor="description_ar" className="text-gray-900 font-bold text-lg flex items-center gap-2 justify-end">
                  الوصف التفصيلي (عربي)
                </Label>
                <textarea
                  id="description_ar"
                  value={formData.description_ar}
                  onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                  placeholder="اشرح حالة العنصر والمواصفات..."
                  className="w-full h-40 p-5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-right resize-none text-lg"
                  required
                />
              </div>

              <div className="space-y-3 text-right">
                <Label htmlFor="description_en" className="text-gray-900 font-bold text-lg flex items-center gap-2 justify-end">
                  الوصف التفصيلي (إنجليزي)
                </Label>
                <textarea
                  id="description_en"
                  value={formData.description_en}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  placeholder="Describe the item condition and specifications..."
                  className="w-full h-40 p-5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-left resize-none text-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 text-right">
                  <Label htmlFor="quantity" className="text-gray-900 font-bold text-lg flex items-center gap-2 justify-end">
                    الكمية
                    <Package className="w-4 h-4 text-amber-500" />
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 text-right text-lg"
                    required
                  />
                </div>
                <div className="space-y-3 text-right">
                  <Label htmlFor="estimated_value" className="text-gray-900 font-bold text-lg flex items-center gap-2 justify-end">
                    القيمة التقديرية (ر.س)
                  </Label>
                  <Input
                    id="estimated_value"
                    type="number"
                    min="0"
                    value={formData.estimated_value}
                    onChange={(e) => setFormData({ ...formData, estimated_value: e.target.value })}
                    placeholder="مثال: 5000"
                    className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 text-right text-lg"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3 text-right">
                <Label htmlFor="category" className="text-gray-900 font-bold text-lg flex items-center gap-2 justify-end">
                  التصنيف
                </Label>
                <select
                  id="category"
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full h-14 px-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-amber-500 outline-none transition-all text-right text-lg appearance-none cursor-pointer"
                  required
                >
                  <option value="">اختر التصنيف</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="pt-4 space-y-4 text-right border-t border-gray-50">
                <Label className="text-gray-900 font-bold text-lg flex items-center gap-2 justify-end">
                  عناصر تود مبادلتها
                  <ListPlus className="w-4 h-4 text-amber-500" />
                </Label>
                <div className="space-y-3">
                  {formData.desired_items.map((item, index) => (
                    <div key={index} className="flex gap-2 group animate-in fade-in slide-in-from-right-2">
                      {formData.desired_items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDesiredItem(index)}
                          className="w-14 h-14 flex items-center justify-center rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm shadow-red-100"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                      <Input
                        type="text"
                        value={item}
                        onChange={(e) => handleDesiredItemChange(index, e.target.value)}
                        placeholder="مثل: آيباد إير"
                        className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 text-right text-lg"
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddDesiredItem}
                    className="w-full h-14 rounded-2xl border-dashed border-2 border-amber-200 text-amber-600 hover:bg-amber-50 hover:border-amber-500 transition-all font-bold"
                  >
                    <Plus className="w-4 h-4 ml-2" /> إضافة عنصر آخر
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 p-4 rounded-2xl text-red-600 text-right">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="font-semibold text-sm">{error}</span>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full h-16 bg-gray-900 hover:bg-black text-white rounded-3xl text-xl font-bold shadow-xl shadow-gray-200 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'جاري النشر...' : 'نشر العرض الآن'}
          </Button>
        </form>
      </div>
    </div>
  );
}