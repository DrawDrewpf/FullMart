import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { pool } from '../config/database';
import { User, ApiResponse, UserRole, UserResponse } from '../types';
import { userCreateSchema, loginSchema } from '../validations/schemas';
import { validateBody } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { authRateLimit, cacheService } from '../middleware/cache';

const router = Router();

// POST /api/auth/register
router.post('/register', 
  authRateLimit,
  validateBody(userCreateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password } = req.body;

      // Check if user already exists
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1 OR username = $2',
        [email, username]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email or username'
        });
      }

      // Hash password
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const result = await pool.query(
        `INSERT INTO users (username, email, password_hash, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, username, email, role, created_at`,
        [username, email, hashedPassword, UserRole.USER]
      );

      const user = result.rows[0];

      // Generate JWT token
      const payload = { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      };
      const secret = process.env.JWT_SECRET || 'fallback-secret';
      
      const token = jwt.sign(payload, secret);

      const response: ApiResponse<{ user: UserResponse, token: string }> = {
        success: true,
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            created_at: user.created_at,
            updated_at: user.created_at
          },
          token
        },
        message: 'User registered successfully'
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/auth/login
router.post('/login', 
  authRateLimit,
  validateBody(loginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      // Find user
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      const user = result.rows[0];

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Generate JWT token
      const payload = { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      };
      const secret = process.env.JWT_SECRET || 'fallback-secret';
      
      const token = jwt.sign(payload, secret);

      const response: ApiResponse<{ user: UserResponse, token: string }> = {
        success: true,
        data: {
          user: {
            id: user.id,
            username: user.name, // Using name as username for compatibility
            email: user.email,
            role: user.role,
            created_at: user.created_at,
            updated_at: user.updated_at
          },
          token
        },
        message: 'Login successful'
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/auth/logout
router.post('/logout', (req: Request, res: Response) => {
  // Since we're using JWT tokens, logout is handled client-side
  // The client should remove the token from storage
  const response: ApiResponse<null> = {
    success: true,
    data: null,
    message: 'Logout successful'
  };
  
  res.json(response);
});

// GET /api/auth/me - Get current user info
router.get('/me', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    
    const result = await pool.query(
      'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const user = result.rows[0];
    const response: ApiResponse<UserResponse> = {
      success: true,
      data: {
        id: user.id,
        username: user.name, // Using name as username for compatibility
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
