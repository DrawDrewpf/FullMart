import { Pool } from 'pg';

// Mock database for testing
const mockPool = {
  query: jest.fn(),
  connect: jest.fn(),
  end: jest.fn()
};

// Test database setup
export const setupTestDB = async () => {
  const testDBConfig = {
    host: process.env.TEST_DB_HOST || 'localhost',
    port: parseInt(process.env.TEST_DB_PORT || '5432'),
    database: process.env.TEST_DB_NAME || 'fullmart_test',
    user: process.env.TEST_DB_USER || 'postgres',
    password: process.env.TEST_DB_PASSWORD || 'password',
  };

  const pool = new Pool(testDBConfig);
  
  // Clean up database before each test
  await pool.query('DELETE FROM cart_items');
  await pool.query('DELETE FROM order_items');
  await pool.query('DELETE FROM orders');
  await pool.query('DELETE FROM addresses');
  await pool.query('DELETE FROM users WHERE email LIKE %test%');
  
  return pool;
};

// Global test setup
beforeAll(async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret';
});

afterEach(() => {
  jest.clearAllMocks();
});

export { mockPool };
