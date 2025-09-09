-- Crear usuario y base de datos para FullMart
CREATE USER fullmart WITH PASSWORD 'fullmart123';
CREATE DATABASE fullmart_db WITH OWNER fullmart;

-- Conectar a la base de datos fullmart_db
\c fullmart_db;

-- Otorgar privilegios al usuario
GRANT ALL PRIVILEGES ON DATABASE fullmart_db TO fullmart;
GRANT ALL ON SCHEMA public TO fullmart;

-- Crear tablas
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500),
    category VARCHAR(100),
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_cart_items_user ON cart_items(user_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- Función para actualizar timestamp automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at automáticamente
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Insertar datos de ejemplo
INSERT INTO products (name, description, price, image_url, category, stock_quantity) VALUES
('Laptop Gaming', 'Laptop de alto rendimiento para gaming', 1299.99, 'https://via.placeholder.com/300x200?text=Laptop', 'Electronics', 15),
('Smartphone Pro', 'Smartphone de última generación', 899.99, 'https://via.placeholder.com/300x200?text=Phone', 'Electronics', 30),
('Auriculares Bluetooth', 'Auriculares inalámbricos de alta calidad', 199.99, 'https://via.placeholder.com/300x200?text=Headphones', 'Electronics', 50),
('Camiseta Deportiva', 'Camiseta cómoda para ejercicio', 29.99, 'https://via.placeholder.com/300x200?text=T-Shirt', 'Clothing', 100),
('Zapatillas Running', 'Zapatillas profesionales para correr', 129.99, 'https://via.placeholder.com/300x200?text=Shoes', 'Clothing', 75),
('Libro de Programación', 'Guía completa de desarrollo web', 39.99, 'https://via.placeholder.com/300x200?text=Book', 'Books', 200),
('Cafetera Automática', 'Cafetera con funciones automáticas', 249.99, 'https://via.placeholder.com/300x200?text=Coffee', 'Home', 25),
('Silla de Oficina', 'Silla ergonómica para oficina', 299.99, 'https://via.placeholder.com/300x200?text=Chair', 'Home', 40);

-- Insertar usuario de prueba
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@fullmart.com', '$2b$10$8dkJ.wJ1Qw0JQf9bI5z3KO8pMc9B7aV5YHjKgP4PqC5xR7Vm2nX8e', 'admin'),
('testuser', 'test@fullmart.com', '$2b$10$8dkJ.wJ1Qw0JQf9bI5z3KO8pMc9B7aV5YHjKgP4PqC5xR7Vm2nX8e', 'user');

-- Confirmar creación exitosa
SELECT 'Base de datos FullMart creada exitosamente' as mensaje;
