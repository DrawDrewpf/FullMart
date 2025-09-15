// Tipos que coinciden exactamente con el backend
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  username?: string; // For backward compatibility
  name?: string; // New field
  email: string;
  phone?: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Order types
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type PaymentMethod = 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer';

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_name: string;
  product_image_url?: string;
}

export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  total_amount: number;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  shipping_name: string;
  shipping_email: string;
  shipping_phone?: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  created_at: string;
  items: OrderItem[];
}

export interface CreateOrderRequest {
  shipping_name: string;
  shipping_email: string;
  shipping_phone?: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;
  payment_method: PaymentMethod;
}

export interface ShippingFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  paymentMethod: PaymentMethod;
}

// Admin types
export interface AdminDashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface AdminRecentOrder {
  id: number;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
  user_email: string;
  user_name: string;
}

export interface AdminMonthlyRevenue {
  month: string;
  revenue: number;
  orders_count: number;
}

export interface AdminTopProduct {
  id: number;
  name: string;
  price: number;
  image_url: string;
  total_sold: number;
  total_revenue: number;
}

export interface AdminDashboardData {
  stats: AdminDashboardStats;
  recentOrders: AdminRecentOrder[];
  monthlyRevenue: AdminMonthlyRevenue[];
  topProducts: AdminTopProduct[];
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface AdminOrder {
  id: number;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  shipping_name: string;
  shipping_email: string;
  shipping_address: string;
  shipping_city: string;
  user_name: string;
  user_email: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Admin API response structures
export interface AdminProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AdminUsersResponse {
  users: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AdminOrdersResponse {
  orders: AdminOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
