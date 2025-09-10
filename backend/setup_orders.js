const { Pool } = require('pg');
const { readFileSync } = require('fs');
const { join } = require('path');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://fullmart:fullmart123@localhost:5432/fullmart_db'
});

async function runOrdersSchema() {
  try {
    console.log('🚀 Executing orders schema...');
    
    // Read the SQL file
    const sqlPath = join(__dirname, 'sql', 'orders_schema.sql');
    const sql = readFileSync(sqlPath, 'utf8');
    
    // Execute the SQL
    await pool.query(sql);
    
    console.log('✅ Orders schema created successfully!');
    console.log('📦 Tables created:');
    console.log('   - orders');
    console.log('   - order_items');
    console.log('🔧 Functions and triggers created');
    
  } catch (error) {
    console.error('❌ Error executing orders schema:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the function
runOrdersSchema();
