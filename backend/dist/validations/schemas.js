"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationSchema = exports.idParamSchema = exports.orderCreateSchema = exports.addressSchema = exports.createOrderSchema = exports.cartItemUpdateSchema = exports.cartItemCreateSchema = exports.productQuerySchema = exports.productUpdateSchema = exports.productCreateSchema = exports.loginSchema = exports.userUpdateSchema = exports.userCreateSchema = void 0;
const zod_1 = require("zod");
// User validation schemas
exports.userCreateSchema = zod_1.z.object({
    username: zod_1.z.string().min(2, 'El nombre de usuario debe tener al menos 2 caracteres'),
    email: zod_1.z.string().email('Email inválido'),
    password: zod_1.z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});
exports.userUpdateSchema = zod_1.z.object({
    username: zod_1.z.string().min(2, 'El nombre de usuario debe tener al menos 2 caracteres').optional(),
    email: zod_1.z.string().email('Email inválido').optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido'),
    password: zod_1.z.string().min(1, 'La contraseña es requerida'),
});
// Product validation schemas
exports.productCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'El nombre del producto debe tener al menos 2 caracteres'),
    description: zod_1.z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
    price: zod_1.z.number().positive('El precio debe ser positivo'),
    category: zod_1.z.string().min(2, 'La categoría es requerida'),
    stock: zod_1.z.number().int().min(0, 'El stock no puede ser negativo'),
    imageUrl: zod_1.z.string().url('URL de imagen inválida').optional(),
    features: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.productUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'El nombre del producto debe tener al menos 2 caracteres').optional(),
    description: zod_1.z.string().min(10, 'La descripción debe tener al menos 10 caracteres').optional(),
    price: zod_1.z.number().positive('El precio debe ser positivo').optional(),
    category: zod_1.z.string().min(2, 'La categoría es requerida').optional(),
    stock: zod_1.z.number().int().min(0, 'El stock no puede ser negativo').optional(),
    imageUrl: zod_1.z.string().url('URL de imagen inválida').optional(),
    features: zod_1.z.array(zod_1.z.string()).optional(),
    isActive: zod_1.z.boolean().optional(),
});
exports.productQuerySchema = zod_1.z.object({
    page: zod_1.z.string().transform(val => parseInt(val)).refine(val => val > 0, 'La página debe ser mayor a 0').optional(),
    limit: zod_1.z.string().transform(val => parseInt(val)).refine(val => val > 0 && val <= 100, 'El límite debe estar entre 1 y 100').optional(),
    category: zod_1.z.string().optional(),
    search: zod_1.z.string().optional(),
    sortBy: zod_1.z.enum(['name', 'price', 'createdAt']).optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional(),
    minPrice: zod_1.z.string().transform(val => parseFloat(val)).refine(val => val >= 0, 'El precio mínimo debe ser mayor o igual a 0').optional(),
    maxPrice: zod_1.z.string().transform(val => parseFloat(val)).refine(val => val >= 0, 'El precio máximo debe ser mayor o igual a 0').optional(),
});
// Cart validation schemas
exports.cartItemCreateSchema = zod_1.z.object({
    productId: zod_1.z.number().int().positive('ID de producto inválido'),
    quantity: zod_1.z.number().int().positive('La cantidad debe ser positiva'),
});
exports.cartItemUpdateSchema = zod_1.z.object({
    quantity: zod_1.z.number().int().positive('La cantidad debe ser positiva'),
});
// Order validation schemas
exports.createOrderSchema = zod_1.z.object({
    shipping_name: zod_1.z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    shipping_email: zod_1.z.string().email('Email inválido'),
    shipping_phone: zod_1.z.string().optional(),
    shipping_address: zod_1.z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
    shipping_city: zod_1.z.string().min(2, 'La ciudad debe tener al menos 2 caracteres'),
    shipping_state: zod_1.z.string().min(2, 'El estado/provincia debe tener al menos 2 caracteres'),
    shipping_postal_code: zod_1.z.string().min(3, 'El código postal debe tener al menos 3 caracteres'),
    shipping_country: zod_1.z.string().min(2, 'El país debe tener al menos 2 caracteres').default('España'),
    payment_method: zod_1.z.enum(['credit_card', 'debit_card', 'paypal', 'bank_transfer']).default('credit_card'),
});
exports.addressSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: zod_1.z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
    street: zod_1.z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
    city: zod_1.z.string().min(2, 'La ciudad debe tener al menos 2 caracteres'),
    state: zod_1.z.string().min(2, 'El estado/provincia debe tener al menos 2 caracteres'),
    zipCode: zod_1.z.string().min(3, 'El código postal debe tener al menos 3 caracteres'),
    country: zod_1.z.string().min(2, 'El país debe tener al menos 2 caracteres'),
    phone: zod_1.z.string().optional(),
});
exports.orderCreateSchema = zod_1.z.object({
    shippingAddress: exports.addressSchema,
    billingAddress: exports.addressSchema,
    paymentMethod: zod_1.z.string().min(2, 'El método de pago es requerido'),
});
// ID parameter validation
exports.idParamSchema = zod_1.z.object({
    id: zod_1.z.string().transform(val => parseInt(val)).refine(val => val > 0, 'ID inválido'),
});
// Pagination schema
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.number().int().positive().default(1),
    limit: zod_1.z.number().int().positive().max(100).default(10),
});
