import axios from 'axios';
import type { Product, User, CartItem, LoginCredentials, RegisterData, AuthResponse, ApiResponse } from '../types';

// Configuración base de la API
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: LoginCredentials) => 
    api.post<ApiResponse<AuthResponse>>('/auth/login', credentials),
    
  register: (data: RegisterData) => 
    api.post<ApiResponse<AuthResponse>>('/auth/register', data),
    
  getCurrentUser: () => 
    api.get<ApiResponse<User>>('/auth/me'),
};

// Products API
export const productsAPI = {
  getProducts: (params?: { page?: number; limit?: number; category?: string; search?: string }) => 
    api.get<ApiResponse<Product[]>>('/products', { params }),
    
  getProduct: (id: number) => 
    api.get<ApiResponse<Product>>(`/products/${id}`),
};

// Cart API
export const cartAPI = {
  getCart: () => 
    api.get<ApiResponse<{ items: CartItem[]; total: number }>>('/cart'),
    
  addToCart: (productId: number, quantity: number) => 
    api.post<ApiResponse<{ items: CartItem[]; total: number }>>('/cart/add', { productId, quantity }),
    
  updateCart: (productId: number, quantity: number) => 
    api.put<ApiResponse<{ items: CartItem[]; total: number }>>('/cart/update', { productId, quantity }),
    
  removeFromCart: (productId: number) => 
    api.delete<ApiResponse<void>>(`/cart/remove/${productId}`),
    
  clearCart: () => 
    api.delete<ApiResponse<void>>('/cart/clear'),
};

export default api;
