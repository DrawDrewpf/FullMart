"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const schemas_1 = require("../validations/schemas");
const validation_1 = require("../middleware/validation");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All cart routes require authentication
router.use(auth_1.authenticateToken);
// GET /api/cart
router.get('/', async (req, res, next) => {
    try {
        const userId = req.user.id;
        const result = await database_1.pool.query(`
      SELECT 
        ci.id,
        ci.quantity,
        ci.created_at,
        ci.updated_at,
        p.id as product_id,
        p.name as product_name,
        p.description,
        p.price,
        p.image_url,
        p.stock_quantity,
        p.category
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = $1 AND p.is_active = true
      ORDER BY ci.created_at DESC
    `, [userId]);
        const cartItems = result.rows.map(row => ({
            id: row.id,
            user_id: userId,
            product_id: row.product_id,
            quantity: row.quantity,
            created_at: row.created_at,
            updated_at: row.updated_at,
            product: {
                id: row.product_id,
                name: row.product_name,
                description: row.description || '',
                price: parseFloat(row.price),
                image_url: row.image_url,
                category: row.category,
                stock_quantity: row.stock_quantity,
                is_active: true,
                created_at: row.created_at,
                updated_at: row.updated_at
            }
        }));
        const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        const response = {
            success: true,
            data: {
                items: cartItems,
                total: total
            }
        };
        res.json(response);
    }
    catch (error) {
        next(error);
    }
});
// POST /api/cart/add
router.post('/add', (0, validation_1.validateBody)(schemas_1.cartItemCreateSchema), async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId, quantity = 1 } = req.body;
        // Check if product exists and is active
        const productResult = await database_1.pool.query('SELECT id, stock_quantity FROM products WHERE id = $1 AND is_active = true', [productId]);
        if (productResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        const product = productResult.rows[0];
        // Check if there's enough stock
        if (product.stock_quantity < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock'
            });
        }
        // Check if item already exists in cart
        const existingItem = await database_1.pool.query('SELECT id, quantity FROM cart_items WHERE user_id = $1 AND product_id = $2', [userId, productId]);
        let result;
        if (existingItem.rows.length > 0) {
            // Update existing item
            const newQuantity = existingItem.rows[0].quantity + quantity;
            if (newQuantity > product.stock_quantity) {
                return res.status(400).json({
                    success: false,
                    message: 'Total quantity would exceed available stock'
                });
            }
            result = await database_1.pool.query('UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *', [newQuantity, existingItem.rows[0].id]);
        }
        else {
            // Create new cart item
            result = await database_1.pool.query('INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *', [userId, productId, quantity]);
        }
        // After adding/updating the item, fetch the complete updated cart
        const cartResult = await database_1.pool.query(`
        SELECT 
          ci.id,
          ci.quantity,
          ci.created_at,
          ci.updated_at,
          p.id as product_id,
          p.name as product_name,
          p.description,
          p.price,
          p.image_url,
          p.category,
          p.stock_quantity,
          p.is_active
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.user_id = $1 AND p.is_active = true
        ORDER BY ci.created_at DESC
      `, [userId]);
        const cartItems = cartResult.rows.map(row => ({
            id: row.id,
            userId: userId,
            productId: row.product_id,
            quantity: row.quantity,
            product: {
                id: row.product_id,
                name: row.product_name,
                description: row.description,
                price: parseFloat(row.price),
                category: row.category,
                stock: row.stock_quantity,
                imageUrl: row.image_url,
                isActive: row.is_active,
                createdAt: row.created_at,
                updatedAt: row.updated_at
            },
            createdAt: row.created_at,
            updatedAt: row.updated_at
        }));
        const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        const response = {
            success: true,
            data: { items: cartItems, total },
            message: 'Item added to cart successfully'
        };
        res.json(response);
    }
    catch (error) {
        next(error);
    }
});
// PUT /api/cart/update
router.put('/update', (0, validation_1.validateBody)(schemas_1.cartItemUpdateSchema), async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;
        if (quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be greater than 0'
            });
        }
        // Check if product exists and has enough stock
        const productResult = await database_1.pool.query('SELECT stock_quantity FROM products WHERE id = $1 AND is_active = true', [productId]);
        if (productResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        if (productResult.rows[0].stock_quantity < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock'
            });
        }
        // Update cart item
        const result = await database_1.pool.query('UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND product_id = $3 RETURNING *', [quantity, userId, productId]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }
        // After updating the item, fetch the complete updated cart
        const cartResult = await database_1.pool.query(`
        SELECT 
          ci.id,
          ci.quantity,
          ci.created_at,
          ci.updated_at,
          p.id as product_id,
          p.name as product_name,
          p.description,
          p.price,
          p.image_url,
          p.category,
          p.stock_quantity,
          p.is_active
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.user_id = $1 AND p.is_active = true
        ORDER BY ci.created_at DESC
      `, [userId]);
        const cartItems = cartResult.rows.map(row => ({
            id: row.id,
            userId: userId,
            productId: row.product_id,
            quantity: row.quantity,
            product: {
                id: row.product_id,
                name: row.product_name,
                description: row.description,
                price: parseFloat(row.price),
                category: row.category,
                stock: row.stock_quantity,
                imageUrl: row.image_url,
                isActive: row.is_active,
                createdAt: row.created_at,
                updatedAt: row.updated_at
            },
            createdAt: row.created_at,
            updatedAt: row.updated_at
        }));
        const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        const response = {
            success: true,
            data: { items: cartItems, total },
            message: 'Cart updated successfully'
        };
        res.json(response);
    }
    catch (error) {
        next(error);
    }
});
// DELETE /api/cart/remove/:productId
router.delete('/remove/:productId', async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        const result = await database_1.pool.query('DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2 RETURNING *', [userId, productId]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }
        const response = {
            success: true,
            data: { message: 'Item removed from cart successfully' },
            message: 'Item removed from cart successfully'
        };
        res.json(response);
    }
    catch (error) {
        next(error);
    }
});
// DELETE /api/cart/clear
router.delete('/clear', async (req, res, next) => {
    try {
        const userId = req.user.id;
        await database_1.pool.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
        const response = {
            success: true,
            data: { message: 'Cart cleared successfully' },
            message: 'Cart cleared successfully'
        };
        res.json(response);
    }
    catch (error) {
        next(error);
    }
});
// POST /api/cart/checkout
router.post('/checkout', (req, res) => {
    // TODO: Process checkout
    res.json({ message: 'Checkout endpoint - Coming soon!' });
});
exports.default = router;
