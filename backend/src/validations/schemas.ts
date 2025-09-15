import { z } from 'zod';

// User validation schemas
export const userCreateSchema = z.object({
  username: z.string().min(2, 'El nombre de usuario debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export const userUpdateSchema = z.object({
  username: z.string().min(2, 'El nombre de usuario debe tener al menos 2 caracteres').optional(),
  email: z.string().email('Email inválido').optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

// Product validation schemas
export const productCreateSchema = z.object({
  name: z.string().min(2, 'El nombre del producto debe tener al menos 2 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  price: z.number().positive('El precio debe ser positivo'),
  category: z.string().min(2, 'La categoría es requerida'),
  stock: z.number().int().min(0, 'El stock no puede ser negativo'),
  imageUrl: z.string().url('URL de imagen inválida').optional(),
  features: z.array(z.string()).optional(),
});

export const productUpdateSchema = z.object({
  name: z.string().min(2, 'El nombre del producto debe tener al menos 2 caracteres').optional(),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres').optional(),
  price: z.number().positive('El precio debe ser positivo').optional(),
  category: z.string().min(2, 'La categoría es requerida').optional(),
  stock: z.number().int().min(0, 'El stock no puede ser negativo').optional(),
  imageUrl: z.string().url('URL de imagen inválida').optional(),
  features: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export const productQuerySchema = z.object({
  page: z.string().transform(val => parseInt(val)).refine(val => val > 0, 'La página debe ser mayor a 0').optional(),
  limit: z.string().transform(val => parseInt(val)).refine(val => val > 0 && val <= 100, 'El límite debe estar entre 1 y 100').optional(),
  category: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'price', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  minPrice: z.string().transform(val => parseFloat(val)).refine(val => val >= 0, 'El precio mínimo debe ser mayor o igual a 0').optional(),
  maxPrice: z.string().transform(val => parseFloat(val)).refine(val => val >= 0, 'El precio máximo debe ser mayor o igual a 0').optional(),
});

// Cart validation schemas
export const cartItemCreateSchema = z.object({
  productId: z.number().int().positive('ID de producto inválido'),
  quantity: z.number().int().positive('La cantidad debe ser positiva'),
});

export const cartItemUpdateSchema = z.object({
  quantity: z.number().int().positive('La cantidad debe ser positiva'),
});

// Order validation schemas
export const createOrderSchema = z.object({
  shipping_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  shipping_email: z.string().email('Email inválido'),
  shipping_phone: z.string().optional(),
  shipping_address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  shipping_city: z.string().min(2, 'La ciudad debe tener al menos 2 caracteres'),
  shipping_state: z.string().min(2, 'El estado/provincia debe tener al menos 2 caracteres'),
  shipping_postal_code: z.string().min(3, 'El código postal debe tener al menos 3 caracteres'),
  shipping_country: z.string().min(2, 'El país debe tener al menos 2 caracteres').default('España'),
  payment_method: z.enum(['credit_card', 'debit_card', 'paypal', 'bank_transfer']).default('credit_card'),
});

export const addressSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  street: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  city: z.string().min(2, 'La ciudad debe tener al menos 2 caracteres'),
  state: z.string().min(2, 'El estado/provincia debe tener al menos 2 caracteres'),
  zipCode: z.string().min(3, 'El código postal debe tener al menos 3 caracteres'),
  country: z.string().min(2, 'El país debe tener al menos 2 caracteres'),
  phone: z.string().optional(),
});

export const orderCreateSchema = z.object({
  shippingAddress: addressSchema,
  billingAddress: addressSchema,
  paymentMethod: z.string().min(2, 'El método de pago es requerido'),
});

// ID parameter validation
export const idParamSchema = z.object({
  id: z.string().transform(val => parseInt(val)).refine(val => val > 0, 'ID inválido'),
});

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
// User profile schemas
export const userProfileSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
  newPassword: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
});

// Address schema
export const addressCreateSchema = z.object({
  street: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  city: z.string().min(2, 'La ciudad debe tener al menos 2 caracteres'),
  state: z.string().min(2, 'El estado/provincia debe tener al menos 2 caracteres'),
  zipCode: z.string().min(3, 'El código postal debe tener al menos 3 caracteres'),
  country: z.string().min(2, 'El país debe tener al menos 2 caracteres'),
  isDefault: z.boolean().optional(),
});

export type CartItemCreateInput = z.infer<typeof cartItemCreateSchema>;
export type CartItemUpdateInput = z.infer<typeof cartItemUpdateSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type OrderCreateInput = z.infer<typeof orderCreateSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type IdParam = z.infer<typeof idParamSchema>;
export type UserProfileInput = z.infer<typeof userProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type AddressCreateInput = z.infer<typeof addressCreateSchema>;
