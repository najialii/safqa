import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const itemsApi = {
  getAll: () => api.get('/items'),
  getById: (id: string) => api.get(`/items/${id}`),
  create: (data: any) => api.post('/items', data),
  update: (id: string, data: any) => api.put(`/items/${id}`, data),
  delete: (id: string) => api.delete(`/items/${id}`),
  search: (query: string) => api.get(`/items/search?query=${query}`),
  filterByCategory: (categoryId: string) => api.get(`/items/category/${categoryId}`),
  filterByPrice: (min: number, max: number) => api.get(`/items/price?min_price=${min}&max_price=${max}`),
};

export const safqaApi = {
  getAll: () => api.get('/safqas'),
  getById: (id: string) => api.get(`/safqas/${id}`),
  create: (data: any) => api.post('/safqas', data),
  update: (id: string, data: any) => api.put(`/safqas/${id}`, data),
  delete: (id: string) => api.delete(`/safqas/${id}`),
  search: (query: string) => api.get(`/safqas/search?query=${query}`),
  getMySafqas: () => api.get('/safqas/my'),
};

export default api;
