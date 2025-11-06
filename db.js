// db.js
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
});

db.connect((err) => {
  if (err) {
    console.error('❌ MySQL Connection Failed:', err.message);
  } else {
    console.log('✅ MySQL Connected Successfully');
    db.query(`
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        course VARCHAR(100) NOT NULL
      )
    `, (e) => {
      if (e) console.error('Table creation failed:', e.message);
      else console.log('✅ students table ready');
    });
  }
});

module.exports = db;
