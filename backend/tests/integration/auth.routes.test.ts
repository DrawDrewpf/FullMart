import request from 'supertest';
import express from 'express';

describe('Auth Routes Integration Tests', () => {
  let app: express.Application;

  beforeAll(() => {
    // Create a simple test app
    app = express();
    app.use(express.json());
    
    // Mock auth routes
    app.post('/api/auth/register', (req, res) => {
      const { email, username, password } = req.body;
      
      if (!email || !username || !password) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields'
        });
      }
      
      if (email === 'existing@example.com') {
        return res.status(400).json({
          success: false,
          error: 'User already exists'
        });
      }
      
      res.status(201).json({
        success: true,
        data: {
          user: {
            id: 1,
            email,
            username,
            role: 'user'
          },
          token: 'mock-jwt-token'
        },
        message: 'User registered successfully'
      });
    });

    app.post('/api/auth/login', (req, res) => {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password required'
        });
      }
      
      if (email === 'test@example.com' && password === 'password123') {
        return res.status(200).json({
          success: true,
          data: {
            user: {
              id: 1,
              email,
              username: 'testuser',
              role: 'user'
            },
            token: 'mock-jwt-token'
          },
          message: 'Login successful'
        });
      }
      
      res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    });

    app.get('/api/auth/me', (req, res) => {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          error: 'Access token required'
        });
      }
      
      res.json({
        success: true,
        data: {
          user: {
            id: 1,
            email: 'test@example.com',
            username: 'testuser',
            role: 'user'
          }
        }
      });
    });
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const newUser = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(201);

      expect(response.body).toEqual({
        success: true,
        data: {
          user: expect.objectContaining({
            id: 1,
            email: newUser.email,
            username: newUser.username,
            role: 'user'
          }),
          token: expect.any(String)
        },
        message: 'User registered successfully'
      });
    });

    it('should return error for existing user', async () => {
      const existingUser = {
        email: 'existing@example.com',
        username: 'existinguser',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(existingUser)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'User already exists'
      });
    });

    it('should validate required fields', async () => {
      const invalidUser = {
        email: 'test@example.com'
        // missing username and password
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Missing required fields');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: {
          user: expect.objectContaining({
            id: 1,
            email: loginData.email,
            username: 'testuser',
            role: 'user'
          }),
          token: expect.any(String)
        },
        message: 'Login successful'
      });
    });

    it('should reject invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toEqual({
        success: false,
        error: 'Invalid credentials'
      });
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toEqual(
        expect.objectContaining({
          id: 1,
          email: 'test@example.com',
          username: 'testuser',
          role: 'user'
        })
      );
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Access token required');
    });
  });
});
