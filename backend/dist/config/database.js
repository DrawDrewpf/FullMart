"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeTables = exports.connectDB = exports.pool = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
// Test database connection
const connectDB = async () => {
    try {
        const client = await exports.pool.connect();
        console.log('✅ Database connected successfully');
        client.release();
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
// Create tables if they don't exist
const initializeTables = async () => {
    try {
        const client = await exports.pool.connect();
        // Users table
        await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        // Products table
        await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        image_url TEXT,
        rating DECIMAL(3,2) DEFAULT 0,
        reviews INTEGER DEFAULT 0,
        features JSONB,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        // Cart items table
        await client.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
      )
    `);
        // Orders table
        await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
        total DECIMAL(10,2) NOT NULL,
        shipping_address JSONB NOT NULL,
        billing_address JSONB NOT NULL,
        payment_method VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        // Order items table
        await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        // Create indexes for better performance
        await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
      CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
      CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);
      CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    `);
        // Create updated_at trigger function
        await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);
        // Create triggers for updated_at
        await client.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_products_updated_at ON products;
      CREATE TRIGGER update_products_updated_at
        BEFORE UPDATE ON products
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_cart_items_updated_at ON cart_items;
      CREATE TRIGGER update_cart_items_updated_at
        BEFORE UPDATE ON cart_items
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
      CREATE TRIGGER update_orders_updated_at
        BEFORE UPDATE ON orders
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);
        client.release();
        console.log('✅ Database tables initialized successfully');
    }
    catch (error) {
        console.error('❌ Database initialization failed:', error);
        throw error;
    }
};
exports.initializeTables = initializeTables;
