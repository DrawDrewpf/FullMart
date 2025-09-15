"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const types_1 = require("../types");
const schemas_1 = require("../validations/schemas");
const validation_1 = require("../middleware/validation");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get all products
router.get('/', async (req, res, next) => {
    try {
        const { page = 1, limit = 12, category, search, minPrice, maxPrice, sortBy = 'created_at', sortOrder = 'DESC' } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        let whereClause = 'WHERE is_active = true';
        const queryParams = [];
        let paramCount = 0;
        // Add filters
        if (category) {
            // Handle multiple categories (comma-separated)
            const categories = typeof category === 'string' ? category.split(',').map(cat => cat.trim()) : [category];
            if (categories.length > 0) {
                paramCount++;
                const placeholders = categories.map((_, index) => `$${paramCount + index}`).join(', ');
                whereClause += ` AND category IN (${placeholders})`;
                queryParams.push(...categories);
                paramCount += categories.length - 1;
            }
        }
        if (search) {
            paramCount++;
            whereClause += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
            queryParams.push(`%${search}%`);
        }
        if (minPrice) {
            paramCount++;
            whereClause += ` AND price >= $${paramCount}`;
            queryParams.push(Number(minPrice));
        }
        if (maxPrice) {
            paramCount++;
            whereClause += ` AND price <= $${paramCount}`;
            queryParams.push(Number(maxPrice));
        }
        // Count total products
        const countQuery = `SELECT COUNT(*) FROM products ${whereClause}`;
        const countResult = await database_1.pool.query(countQuery, queryParams);
        const totalCount = parseInt(countResult.rows[0].count);
        // Get products with pagination
        paramCount++;
        const limitParam = paramCount;
        paramCount++;
        const offsetParam = paramCount;
        const productsQuery = `
      SELECT * FROM products 
      ${whereClause} 
      ORDER BY ${sortBy} ${sortOrder} 
      LIMIT $${limitParam} OFFSET $${offsetParam}
    `;
        queryParams.push(Number(limit), offset);
        const result = await database_1.pool.query(productsQuery, queryParams);
        const response = {
            success: true,
            data: result.rows,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total: totalCount,
                totalPages: Math.ceil(totalCount / Number(limit))
            }
        };
        res.json(response);
    }
    catch (error) {
        next(error);
    }
});
// Get product by ID
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await database_1.pool.query('SELECT * FROM products WHERE id = $1 AND is_active = true', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        const response = {
            success: true,
            data: result.rows[0]
        };
        res.json(response);
    }
    catch (error) {
        next(error);
    }
});
// Create product (Admin only)
router.post('/', auth_1.authenticateToken, (0, auth_1.requireRole)([types_1.UserRole.ADMIN]), (0, validation_1.validateBody)(schemas_1.productCreateSchema), async (req, res, next) => {
    try {
        const { name, description, price, category, stock, image_url, features } = req.body;
        const result = await database_1.pool.query(`INSERT INTO products (name, description, price, category, stock, image_url, features)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`, [name, description, price, category, stock, image_url, JSON.stringify(features)]);
        const response = {
            success: true,
            data: result.rows[0],
            message: 'Product created successfully'
        };
        res.status(201).json(response);
    }
    catch (error) {
        next(error);
    }
});
// Update product (Admin only)
router.put('/:id', auth_1.authenticateToken, (0, auth_1.requireRole)([types_1.UserRole.ADMIN]), (0, validation_1.validateBody)(schemas_1.productUpdateSchema), async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, stock, image_url, features, is_active } = req.body;
        // Check if product exists
        const existingProduct = await database_1.pool.query('SELECT id FROM products WHERE id = $1', [id]);
        if (existingProduct.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        const result = await database_1.pool.query(`UPDATE products 
         SET name = $1, description = $2, price = $3, category = $4, 
             stock = $5, image_url = $6, features = $7, is_active = $8,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $9
         RETURNING *`, [name, description, price, category, stock, image_url, JSON.stringify(features), is_active, id]);
        const response = {
            success: true,
            data: result.rows[0],
            message: 'Product updated successfully'
        };
        res.json(response);
    }
    catch (error) {
        next(error);
    }
});
// Delete product (Admin only)
router.delete('/:id', auth_1.authenticateToken, (0, auth_1.requireRole)([types_1.UserRole.ADMIN]), async (req, res, next) => {
    try {
        const { id } = req.params;
        // Soft delete - set is_active to false
        const result = await database_1.pool.query('UPDATE products SET is_active = false WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        const response = {
            success: true,
            data: null,
            message: 'Product deleted successfully'
        };
        res.json(response);
    }
    catch (error) {
        next(error);
    }
});
// Get product categories
router.get('/categories/list', async (req, res, next) => {
    try {
        const result = await database_1.pool.query('SELECT DISTINCT category FROM products WHERE is_active = true ORDER BY category');
        const categories = result.rows.map(row => row.category);
        const response = {
            success: true,
            data: categories
        };
        res.json(response);
    }
    catch (error) {
        next(error);
    }
});
// Get filters data (categories and price range)
router.get('/filters/categories', async (req, res, next) => {
    try {
        // Get categories with count and price range for each
        const categoriesResult = await database_1.pool.query(`
      SELECT 
        category,
        COUNT(*) as count,
        MIN(price) as min_price,
        MAX(price) as max_price
      FROM products 
      WHERE is_active = true 
      GROUP BY category 
      ORDER BY category
    `);
        const categories = categoriesResult.rows.map(row => ({
            category: row.category,
            count: parseInt(row.count),
            min_price: parseFloat(row.min_price),
            max_price: parseFloat(row.max_price)
        }));
        // Get overall price range
        const priceResult = await database_1.pool.query('SELECT MIN(price) as min_price, MAX(price) as max_price FROM products WHERE is_active = true');
        const priceRange = priceResult.rows[0];
        const filtersData = {
            categories,
            priceRange: {
                min_price: parseFloat(priceRange.min_price) || 0,
                max_price: parseFloat(priceRange.max_price) || 1000
            }
        };
        const response = {
            success: true,
            data: filtersData
        };
        res.json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
