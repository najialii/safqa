export interface Item {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  name?: string;
  description?: string;
  quantity: number;
  estimated_value: number;
  images?: string[];
  user_id?: number;
  category_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Safqa {
  id: string;
  name: string;
  description: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name_ar: string;
  name_en: string;
  name?: string;
  created_at: string;
  updated_at: string;
}
