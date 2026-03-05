import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const itemsApi = {
  getAll: () => api.get('/items'),
  getById: (id: string) => api.get(`/items/${id}`),
  create: (data: any) => api.post('/items', data),
  update: (id: string, data: any) => api.put(`/items/${id}`, data),
  delete: (id: string) => api.delete(`/items/${id}`),
  search: (query: string) => api.get(`/items/search?query=${query}`),
  filterByCategory: (categoryId: string) => api.get(`/items/category/${categoryId}`),
};

export const authApi = {
  login: (data: { email: string; password: string }) => api.post('/login', data),
  register: (data: any) => api.post('/register', data),
};
