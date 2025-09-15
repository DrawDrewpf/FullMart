import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticateToken, requireRole } from '../../src/middleware/auth';
import { UserRole } from '../../src/types';

// Mock dependencies
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
const _mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe('Auth Middleware', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = {
      headers: {},
      user: null
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
  });

  describe('authenticateToken', () => {
    it('should authenticate valid token', () => {
      const mockUser = { id: 1, email: 'test@test.com', role: UserRole.USER };
      mockReq.headers.authorization = 'Bearer valid-token';
      (mockedJwt.verify as jest.Mock).mockReturnValue(mockUser);

      authenticateToken(mockReq, mockRes, mockNext);

      expect(mockReq.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should reject request without token', () => {
      authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token de acceso requerido'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject invalid token', () => {
      mockReq.headers.authorization = 'Bearer invalid-token';
      (mockedJwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token inválido'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('requireRole', () => {
    it('should allow admin access to admin routes', () => {
      mockReq.user = { id: 1, email: 'admin@test.com', role: UserRole.ADMIN };
      const middleware = requireRole([UserRole.ADMIN]);

      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should deny user access to admin routes', () => {
      mockReq.user = { id: 1, email: 'user@test.com', role: UserRole.USER };
      const middleware = requireRole([UserRole.ADMIN]);

      middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Permisos insuficientes'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should allow multiple roles', () => {
      mockReq.user = { id: 1, email: 'user@test.com', role: UserRole.USER };
      const middleware = requireRole([UserRole.USER, UserRole.ADMIN]);

      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
});
