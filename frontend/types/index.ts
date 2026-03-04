export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
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
  name: string;
  created_at: string;
  updated_at: string;
}
