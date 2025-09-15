const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingAdmin = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      ['admin@fullmart.com']
    );

    if (existingAdmin.rows.length > 0) {
      console.log('❌ El usuario administrador ya existe');
      return;
    }

    // Create admin user
    const hashedPassword = '$2a$10$ibmmcVu1Jf6UDqNgEMMECe1zc3gTzIwsvx8VV2EBa8slqy1X8eU8W'; // admin123
    
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, name, email, role`,
      ['Administrador', 'admin@fullmart.com', hashedPassword, 'admin']
    );

    console.log('✅ Usuario administrador creado exitosamente:');
    console.log('📧 Email: admin@fullmart.com');
    console.log('🔑 Contraseña: admin123');
    console.log('👤 Rol: admin');
    console.log('🆔 ID:', result.rows[0].id);

  } catch (error) {
    console.error('❌ Error al crear usuario administrador:', error.message);
  } finally {
    await pool.end();
  }
}

createAdminUser();
