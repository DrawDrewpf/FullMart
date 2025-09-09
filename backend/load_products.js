const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuración de la base de datos
const pool = new Pool({
  user: 'fullmart',
  host: 'localhost',
  database: 'fullmart_db',
  password: 'fullmart123',
  port: 5432,
});

async function loadProducts() {
  try {
    console.log('Conectando a la base de datos...');
    
    // Leer el archivo SQL
    const sqlFile = path.join(__dirname, 'sql', 'add_100_products.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    console.log('Ejecutando script SQL...');
    await pool.query(sqlContent);
    
    console.log('✅ 100 productos cargados exitosamente!');
    
    // Verificar cuántos productos tenemos
    const result = await pool.query('SELECT COUNT(*) FROM products');
    console.log(`Total de productos en la base de datos: ${result.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error al cargar productos:', error);
  } finally {
    await pool.end();
  }
}

loadProducts();
