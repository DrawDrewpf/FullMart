import { Router } from 'express';
import { Pool } from 'pg';
import { authenticateToken } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { createOrderSchema } from '../validations/schemas';
import { 
  CreateOrderRequest, 
  OrderResponse, 
  OrderWithItems,
  PaymentMethod,
  PaymentStatus,
  OrderStatus 
} from '../types';

const router = Router();

// Database connection (will be injected)
let pool: Pool;

export const setDatabasePool = (dbPool: Pool) => {
  pool = dbPool;
};

/**
 * POST /api/orders
 * Create a new order from user's cart
 */
router.post('/', authenticateToken, validateBody(createOrderSchema), async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const userId = req.user!.userId;
    const orderData = req.body as CreateOrderRequest;
    
    // 1. Get user's cart items
    const cartQuery = `
      SELECT 
        ci.product_id,
        ci.quantity,
        p.name as product_name,
        p.price as unit_price,
        p.image_url as product_image_url,
        (ci.quantity * p.price) as total_price
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = $1
    `;
    
    const cartResult = await client.query(cartQuery, [userId]);
    
    if (cartResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        error: 'El carrito está vacío'
      });
    }
    
    // 2. Calculate totals
    const subtotal = cartResult.rows.reduce((sum, item) => sum + parseFloat(item.total_price), 0);
    const taxRate = 0.21; // 21% IVA in Spain
    const taxAmount = subtotal * taxRate;
    const shippingAmount = subtotal > 50 ? 0 : 5.99; // Free shipping over €50
    const totalAmount = subtotal + taxAmount + shippingAmount;
    
    // 3. Generate order number
    const orderNumberQuery = `
      SELECT 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0') as order_number
    `;
    const orderNumberResult = await client.query(orderNumberQuery);
    const orderNumber = orderNumberResult.rows[0].order_number;
    
    // 4. Create order
    const createOrderQuery = `
      INSERT INTO orders (
        user_id, order_number, status, total_amount, subtotal, tax_amount, shipping_amount,
        shipping_name, shipping_email, shipping_phone, shipping_address, shipping_city,
        shipping_state, shipping_postal_code, shipping_country, payment_method, payment_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `;
    
    const orderValues = [
      userId,
      orderNumber,
      OrderStatus.PENDING,
      totalAmount,
      subtotal,
      taxAmount,
      shippingAmount,
      orderData.shipping_name,
      orderData.shipping_email,
      orderData.shipping_phone || null,
      orderData.shipping_address,
      orderData.shipping_city,
      orderData.shipping_state,
      orderData.shipping_postal_code,
      orderData.shipping_country,
      orderData.payment_method,
      PaymentStatus.COMPLETED // Simulated payment
    ];
    
    const orderResult = await client.query(createOrderQuery, orderValues);
    const order = orderResult.rows[0];
    
    // 5. Create order items
    const orderItems = [];
    for (const cartItem of cartResult.rows) {
      const createOrderItemQuery = `
        INSERT INTO order_items (
          order_id, product_id, quantity, unit_price, total_price, product_name, product_image_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      
      const orderItemValues = [
        order.id,
        cartItem.product_id,
        cartItem.quantity,
        cartItem.unit_price,
        cartItem.total_price,
        cartItem.product_name,
        cartItem.product_image_url
      ];
      
      const orderItemResult = await client.query(createOrderItemQuery, orderItemValues);
      orderItems.push(orderItemResult.rows[0]);
    }
    
    // 6. Clear user's cart
    await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
    
    await client.query('COMMIT');
    
    // 7. Format response
    const response: OrderResponse = {
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      total_amount: parseFloat(order.total_amount),
      subtotal: parseFloat(order.subtotal),
      tax_amount: parseFloat(order.tax_amount),
      shipping_amount: parseFloat(order.shipping_amount),
      shipping_name: order.shipping_name,
      shipping_email: order.shipping_email,
      shipping_phone: order.shipping_phone,
      shipping_address: order.shipping_address,
      shipping_city: order.shipping_city,
      shipping_state: order.shipping_state,
      shipping_postal_code: order.shipping_postal_code,
      shipping_country: order.shipping_country,
      payment_method: order.payment_method as PaymentMethod,
      payment_status: order.payment_status as PaymentStatus,
      created_at: order.created_at,
      items: orderItems.map(item => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: parseFloat(item.unit_price),
        total_price: parseFloat(item.total_price),
        product_name: item.product_name,
        product_image_url: item.product_image_url
      }))
    };
    
    res.status(201).json({
      success: true,
      data: response,
      message: 'Pedido creado exitosamente'
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  } finally {
    client.release();
  }
});

/**
 * GET /api/orders
 * Get user's order history
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.userId;
    
    const ordersQuery = `
      SELECT 
        o.*,
        json_agg(
          json_build_object(
            'id', oi.id,
            'product_id', oi.product_id,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'total_price', oi.total_price,
            'product_name', oi.product_name,
            'product_image_url', oi.product_image_url
          ) ORDER BY oi.id
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;
    
    const result = await pool.query(ordersQuery, [userId]);
    
    const orders = result.rows.map(row => ({
      id: row.id,
      order_number: row.order_number,
      status: row.status,
      total_amount: parseFloat(row.total_amount),
      subtotal: parseFloat(row.subtotal),
      tax_amount: parseFloat(row.tax_amount),
      shipping_amount: parseFloat(row.shipping_amount),
      shipping_name: row.shipping_name,
      shipping_email: row.shipping_email,
      shipping_phone: row.shipping_phone,
      shipping_address: row.shipping_address,
      shipping_city: row.shipping_city,
      shipping_state: row.shipping_state,
      shipping_postal_code: row.shipping_postal_code,
      shipping_country: row.shipping_country,
      payment_method: row.payment_method,
      payment_status: row.payment_status,
      created_at: row.created_at,
      items: row.items || []
    }));
    
    res.json({
      success: true,
      data: orders
    });
    
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * GET /api/orders/:id
 * Get specific order details
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const orderId = parseInt(req.params.id);
    
    if (isNaN(orderId)) {
      return res.status(400).json({
        success: false,
        error: 'ID de pedido inválido'
      });
    }
    
    const orderQuery = `
      SELECT 
        o.*,
        json_agg(
          json_build_object(
            'id', oi.id,
            'product_id', oi.product_id,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'total_price', oi.total_price,
            'product_name', oi.product_name,
            'product_image_url', oi.product_image_url
          ) ORDER BY oi.id
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = $1 AND o.user_id = $2
      GROUP BY o.id
    `;
    
    const result = await pool.query(orderQuery, [orderId, userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Pedido no encontrado'
      });
    }
    
    const row = result.rows[0];
    const order = {
      id: row.id,
      order_number: row.order_number,
      status: row.status,
      total_amount: parseFloat(row.total_amount),
      subtotal: parseFloat(row.subtotal),
      tax_amount: parseFloat(row.tax_amount),
      shipping_amount: parseFloat(row.shipping_amount),
      shipping_name: row.shipping_name,
      shipping_email: row.shipping_email,
      shipping_phone: row.shipping_phone,
      shipping_address: row.shipping_address,
      shipping_city: row.shipping_city,
      shipping_state: row.shipping_state,
      shipping_postal_code: row.shipping_postal_code,
      shipping_country: row.shipping_country,
      payment_method: row.payment_method,
      payment_status: row.payment_status,
      created_at: row.created_at,
      items: row.items || []
    };
    
    res.json({
      success: true,
      data: order
    });
    
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

export default router;
