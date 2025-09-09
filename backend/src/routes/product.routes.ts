import { Router } from 'express';

const router = Router();

// GET /api/products
router.get('/', (req, res) => {
  // TODO: Get all products with pagination and filters
  res.json({ 
    message: 'Products list endpoint - Coming soon!',
    data: []
  });
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  // TODO: Get single product by ID
  const { id } = req.params;
  res.json({ 
    message: `Product ${id} details endpoint - Coming soon!`
  });
});

// POST /api/products (Admin only)
router.post('/', (req, res) => {
  // TODO: Create new product (admin only)
  res.json({ message: 'Create product endpoint - Coming soon!' });
});

// PUT /api/products/:id (Admin only)
router.put('/:id', (req, res) => {
  // TODO: Update product (admin only)
  const { id } = req.params;
  res.json({ 
    message: `Update product ${id} endpoint - Coming soon!`
  });
});

// DELETE /api/products/:id (Admin only)
router.delete('/:id', (req, res) => {
  // TODO: Delete product (admin only)
  const { id } = req.params;
  res.json({ 
    message: `Delete product ${id} endpoint - Coming soon!`
  });
});

export default router;
