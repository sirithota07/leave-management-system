// ============ MySQL CONNECTION + TABLE CREATION ============
const mysql = require("mysql2/promise");

let pool;
const getPool = () => pool;

async function init() {
  const dbName = process.env.DB_NAME || "leave_management";
  if (!/^[A-Za-z0-9_]+$/.test(dbName)) throw new Error("DB_NAME can have only letters, numbers and _");

  const config = {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || ""
  };

  // 1) create the database if it does not exist
  const conn = await mysql.createConnection(config);
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  await conn.end();

  // 2) connect to that database
  pool = mysql.createPool({ ...config, database: dbName, waitForConnections: true, connectionLimit: 10 });

  // 3) create tables if they do not exist
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('employee','admin') NOT NULL DEFAULT 'employee',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS leaves (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      leave_type ENUM('Casual','Sick','Earned','Other') NOT NULL DEFAULT 'Casual',
      reason TEXT NOT NULL,
      leave_from VARCHAR(10) NOT NULL,
      leave_to VARCHAR(10) NOT NULL,
      status ENUM('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
      admin_comment VARCHAR(255) NOT NULL DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);
}

module.exports = { init, getPool };
