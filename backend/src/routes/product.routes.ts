import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/database';
import { Product, ApiResponse, PaginatedResponse, UserRole } from '../types';
import { productCreateSchema, productUpdateSchema } from '../validations/schemas';
import { validateQuery, validateBody } from '../middleware/validation';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// Get all products
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      search, 
      minPrice, 
      maxPrice, 
      sortBy = 'created_at', 
      sortOrder = 'DESC' 
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    let whereClause = 'WHERE is_active = true';
    const queryParams: any[] = [];
    let paramCount = 0;

    // Add filters
    if (category) {
      paramCount++;
      whereClause += ` AND category = $${paramCount}`;
      queryParams.push(category);
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
    const countResult = await pool.query(countQuery, queryParams);
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
    const result = await pool.query(productsQuery, queryParams);

    const response: PaginatedResponse<Product> = {
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
  } catch (error) {
    next(error);
  }
});

// Get product by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM products WHERE id = $1 AND is_active = true', 
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const response: ApiResponse<Product> = {
      success: true,
      data: result.rows[0]
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Create product (Admin only)
router.post('/', 
  authenticateToken, 
  requireRole([UserRole.ADMIN]),
  validateBody(productCreateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description, price, category, stock, image_url, features } = req.body;
      
      const result = await pool.query(
        `INSERT INTO products (name, description, price, category, stock, image_url, features)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [name, description, price, category, stock, image_url, JSON.stringify(features)]
      );

      const response: ApiResponse<Product> = {
        success: true,
        data: result.rows[0],
        message: 'Product created successfully'
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// Update product (Admin only)
router.put('/:id', 
  authenticateToken, 
  requireRole([UserRole.ADMIN]),
  validateBody(productUpdateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name, description, price, category, stock, image_url, features, is_active } = req.body;

      // Check if product exists
      const existingProduct = await pool.query(
        'SELECT id FROM products WHERE id = $1', 
        [id]
      );

      if (existingProduct.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      const result = await pool.query(
        `UPDATE products 
         SET name = $1, description = $2, price = $3, category = $4, 
             stock = $5, image_url = $6, features = $7, is_active = $8,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $9
         RETURNING *`,
        [name, description, price, category, stock, image_url, JSON.stringify(features), is_active, id]
      );

      const response: ApiResponse<Product> = {
        success: true,
        data: result.rows[0],
        message: 'Product updated successfully'
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

// Delete product (Admin only)
router.delete('/:id', 
  authenticateToken, 
  requireRole([UserRole.ADMIN]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      // Soft delete - set is_active to false
      const result = await pool.query(
        'UPDATE products SET is_active = false WHERE id = $1 RETURNING id',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      const response: ApiResponse<null> = {
        success: true,
        data: null,
        message: 'Product deleted successfully'
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

// Get product categories
router.get('/categories/list', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query(
      'SELECT DISTINCT category FROM products WHERE is_active = true ORDER BY category'
    );

    const categories = result.rows.map(row => row.category);

    const response: ApiResponse<string[]> = {
      success: true,
      data: categories
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
