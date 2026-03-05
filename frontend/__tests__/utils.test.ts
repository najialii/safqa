import { getLocalizedField } from '@/lib/utils';

describe('getLocalizedField', () => {
  it('should return Arabic field when locale is ar', () => {
    const item = {
      name_ar: 'اسم العنصر',
      name_en: 'Item Name',
    };

    const result = getLocalizedField(item, 'name', 'ar');
    expect(result).toBe('اسم العنصر');
  });

  it('should return English field when locale is en', () => {
    const item = {
      name_ar: 'اسم العنصر',
      name_en: 'Item Name',
    };

    const result = getLocalizedField(item, 'name', 'en');
    expect(result).toBe('Item Name');
  });

  it('should fallback to English when Arabic is missing', () => {
    const item = {
      name_en: 'Item Name',
    };

    const result = getLocalizedField(item, 'name', 'ar');
    expect(result).toBe('Item Name');
  });

  it('should return empty string when both fields are missing', () => {
    const item = {};

    const result = getLocalizedField(item, 'name', 'ar');
    expect(result).toBe('');
  });

  it('should work with description fields', () => {
    const item = {
      description_ar: 'وصف العنصر',
      description_en: 'Item Description',
    };

    const resultAr = getLocalizedField(item, 'description', 'ar');
    const resultEn = getLocalizedField(item, 'description', 'en');

    expect(resultAr).toBe('وصف العنصر');
    expect(resultEn).toBe('Item Description');
  });

  it('should handle category name fields', () => {
    const category = {
      name_ar: 'الفئة',
      name_en: 'Category',
    };

    const resultAr = getLocalizedField(category, 'name', 'ar');
    const resultEn = getLocalizedField(category, 'name', 'en');

    expect(resultAr).toBe('الفئة');
    expect(resultEn).toBe('Category');
  });
});
