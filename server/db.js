const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'MySQL@12345',
  database: process.env.DB_NAME || 'aolo_cabs',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log(`✅ [MySQL] Connected successfully to database: ${process.env.DB_NAME || 'aolo_cabs'}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ [MySQL] Connection failed:', error.message);
    return false;
  }
}

module.exports = { pool, testConnection };
