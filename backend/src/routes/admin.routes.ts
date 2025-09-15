import { Router, Request, Response, NextFunction } from 'express';
import { pool } from '../config/database';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { ApiResponse } from '../types';

const router = Router();

// Apply admin authentication to all routes
router.use(authenticateToken, requireAdmin);

// GET /api/admin/dashboard - Dashboard statistics
router.get('/dashboard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get total users
    const usersResult = await pool.query('SELECT COUNT(*) as total FROM users WHERE role = $1', ['user']);
    const totalUsers = parseInt(usersResult.rows[0].total);

    // Get total products
    const productsResult = await pool.query('SELECT COUNT(*) as total FROM products WHERE is_active = true');
    const totalProducts = parseInt(productsResult.rows[0].total);

    // Get total orders
    const ordersResult = await pool.query('SELECT COUNT(*) as total FROM orders');
    const totalOrders = parseInt(ordersResult.rows[0].total);

    // Get total revenue
    const revenueResult = await pool.query('SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE status != $1', ['cancelled']);
    const totalRevenue = parseFloat(revenueResult.rows[0].total);

    // Get recent orders
    const recentOrdersResult = await pool.query(`
      SELECT o.id, o.order_number, o.total_amount, o.status, o.created_at,
             u.email as user_email, u.name as user_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 10
    `);

    // Get monthly revenue (last 6 months)
    const monthlyRevenueResult = await pool.query(`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        SUM(total_amount) as revenue,
        COUNT(*) as orders_count
      FROM orders 
      WHERE created_at >= NOW() - INTERVAL '6 months'
        AND status != 'cancelled'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
    `);

    // Get top selling products
    const topProductsResult = await pool.query(`
      SELECT 
        p.id, p.name, p.price, p.image_url,
        SUM(oi.quantity) as total_sold,
        SUM(oi.total_price) as total_revenue
      FROM products p
      JOIN order_items oi ON p.id = oi.product_id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status != 'cancelled'
      GROUP BY p.id, p.name, p.price, p.image_url
      ORDER BY total_sold DESC
      LIMIT 5
    `);

    const response: ApiResponse<any> = {
      success: true,
      data: {
        stats: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalRevenue
        },
        recentOrders: recentOrdersResult.rows,
        monthlyRevenue: monthlyRevenueResult.rows,
        topProducts: topProductsResult.rows
      }
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/users - Get all users with pagination
router.get('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string || '';
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const queryParams: any[] = [];

    if (search) {
      whereClause += ' AND (name ILIKE $1 OR email ILIKE $1)';
      queryParams.push(`%${search}%`);
    }

    // Get total count
    const countResult = await pool.query(`SELECT COUNT(*) as total FROM users ${whereClause}`, queryParams);
    const totalUsers = parseInt(countResult.rows[0].total);

    // Get users
    const usersQuery = `
      SELECT id, name, email, role, created_at, updated_at
      FROM users ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `;
    
    const usersResult = await pool.query(usersQuery, [...queryParams, limit, offset]);

    const response: ApiResponse<any> = {
      success: true,
      data: {
        users: usersResult.rows,
        pagination: {
          page,
          limit,
          total: totalUsers,
          pages: Math.ceil(totalUsers / limit)
        }
      }
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/orders - Get all orders with pagination
router.get('/orders', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const queryParams: any[] = [];

    if (status && status !== 'all') {
      whereClause += ' AND o.status = $1';
      queryParams.push(status);
    }

    // Get total count
    const countResult = await pool.query(`
      SELECT COUNT(*) as total 
      FROM orders o ${whereClause}
    `, queryParams);
    const totalOrders = parseInt(countResult.rows[0].total);

    // Get orders with user info
    const ordersQuery = `
      SELECT 
        o.id, o.order_number, o.status, o.total_amount, o.created_at,
        o.shipping_name, o.shipping_email, o.shipping_address, o.shipping_city,
        u.name as user_name, u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ${whereClause}
      ORDER BY o.created_at DESC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `;
    
    const ordersResult = await pool.query(ordersQuery, [...queryParams, limit, offset]);

    const response: ApiResponse<any> = {
      success: true,
      data: {
        orders: ordersResult.rows,
        pagination: {
          page,
          limit,
          total: totalOrders,
          pages: Math.ceil(totalOrders / limit)
        }
      }
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/orders/:id/status - Update order status
router.put('/orders/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }

    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    const response: ApiResponse<any> = {
      success: true,
      data: result.rows[0],
      message: 'Order status updated successfully'
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/products - Get all products with pagination (for admin management)
router.get('/products', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string || '';
    const category = req.query.category as string;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const queryParams: any[] = [];

    if (search) {
      whereClause += ' AND (name ILIKE $1 OR description ILIKE $1)';
      queryParams.push(`%${search}%`);
    }

    if (category && category !== 'all') {
      whereClause += ` AND category = $${queryParams.length + 1}`;
      queryParams.push(category);
    }

    // Get total count
    const countResult = await pool.query(`SELECT COUNT(*) as total FROM products ${whereClause}`, queryParams);
    const totalProducts = parseInt(countResult.rows[0].total);

    // Get products
    const productsQuery = `
      SELECT id, name, description, price, image_url, category, stock_quantity, is_active, created_at, updated_at
      FROM products ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `;
    
    const productsResult = await pool.query(productsQuery, [...queryParams, limit, offset]);

    const response: ApiResponse<any> = {
      success: true,
      data: {
        products: productsResult.rows,
        pagination: {
          page,
          limit,
          total: totalProducts,
          pages: Math.ceil(totalProducts / limit)
        }
      }
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/products/:id - Get single product for editing
router.get('/products/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = parseInt(req.params.id);
    
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [productId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    const response: ApiResponse<any> = {
      success: true,
      data: result.rows[0]
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/products - Create new product
router.post('/products', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      description,
      price,
      image_url,
      category,
      stock_quantity,
      is_active = true
    } = req.body;

    // Basic validation
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, description, price, category'
      });
    }

    const result = await pool.query(
      `INSERT INTO products (name, description, price, image_url, category, stock_quantity, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [name, description, price, image_url, category, stock_quantity, is_active]
    );

    const response: ApiResponse<any> = {
      success: true,
      data: result.rows[0],
      message: 'Product created successfully'
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/products/:id - Update product
router.put('/products/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = parseInt(req.params.id);
    const {
      name,
      description,
      price,
      image_url,
      category,
      stock_quantity,
      is_active
    } = req.body;

    // Check if product exists
    const existingProduct = await pool.query('SELECT id FROM products WHERE id = $1', [productId]);
    
    if (existingProduct.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    const result = await pool.query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, image_url = $4, 
           category = $5, stock_quantity = $6, is_active = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 
       RETURNING *`,
      [name, description, price, image_url, category, stock_quantity, is_active, productId]
    );

    const response: ApiResponse<any> = {
      success: true,
      data: result.rows[0],
      message: 'Product updated successfully'
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/products/:id - Delete product (soft delete)
router.delete('/products/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = parseInt(req.params.id);

    // Check if product exists
    const existingProduct = await pool.query('SELECT id FROM products WHERE id = $1', [productId]);
    
    if (existingProduct.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Soft delete by setting is_active to false
    await pool.query(
      'UPDATE products SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [productId]
    );

    const response: ApiResponse<any> = {
      success: true,
      message: 'Product deleted successfully'
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/categories - Get all available product categories
router.get('/categories', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query('SELECT DISTINCT category FROM products ORDER BY category');
    
    const response: ApiResponse<any> = {
      success: true,
      data: result.rows.map(row => row.category)
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
