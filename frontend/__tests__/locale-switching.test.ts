import { getLocalizedField } from '@/lib/utils';

describe('Locale Switching', () => {
  it('should update displayed content when locale changes from ar to en', () => {
    const item = {
      name_ar: 'اسم العنصر',
      name_en: 'Item Name',
      description_ar: 'وصف العنصر',
      description_en: 'Item Description',
    };

    const nameAr = getLocalizedField(item, 'name', 'ar');
    const nameEn = getLocalizedField(item, 'name', 'en');

    expect(nameAr).toBe('اسم العنصر');
    expect(nameEn).toBe('Item Name');
    expect(nameAr).not.toBe(nameEn);
  });

  it('should update displayed content when locale changes from en to ar', () => {
    const item = {
      name_ar: 'اسم العنصر',
      name_en: 'Item Name',
      description_ar: 'وصف العنصر',
      description_en: 'Item Description',
    };

    const nameEn = getLocalizedField(item, 'name', 'en');
    const nameAr = getLocalizedField(item, 'name', 'ar');

    expect(nameEn).toBe('Item Name');
    expect(nameAr).toBe('اسم العنصر');
    expect(nameEn).not.toBe(nameAr);
  });

  it('should update all text fields when locale switches', () => {
    const item = {
      name_ar: 'اسم العنصر',
      name_en: 'Item Name',
      description_ar: 'وصف العنصر',
      description_en: 'Item Description',
    };

    const fieldsAr = {
      name: getLocalizedField(item, 'name', 'ar'),
      description: getLocalizedField(item, 'description', 'ar'),
    };

    const fieldsEn = {
      name: getLocalizedField(item, 'name', 'en'),
      description: getLocalizedField(item, 'description', 'en'),
    };

    expect(fieldsAr.name).toBe('اسم العنصر');
    expect(fieldsAr.description).toBe('وصف العنصر');
    expect(fieldsEn.name).toBe('Item Name');
    expect(fieldsEn.description).toBe('Item Description');
  });

  it('should handle multiple items with locale switching', () => {
    const items = [
      {
        name_ar: 'عنصر 1',
        name_en: 'Item 1',
      },
      {
        name_ar: 'عنصر 2',
        name_en: 'Item 2',
      },
      {
        name_ar: 'عنصر 3',
        name_en: 'Item 3',
      },
    ];

    const namesAr = items.map(item => getLocalizedField(item, 'name', 'ar'));
    const namesEn = items.map(item => getLocalizedField(item, 'name', 'en'));

    expect(namesAr).toEqual(['عنصر 1', 'عنصر 2', 'عنصر 3']);
    expect(namesEn).toEqual(['Item 1', 'Item 2', 'Item 3']);
  });
});
