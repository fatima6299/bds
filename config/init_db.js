/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: Database initialization script - creates database and tables
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDB() {
  // Configuration de connexion à MySQL
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });

  const dbName = process.env.DB_NAME || 'bds';

  // 1. Créer la base de données si elle n'existe pas
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
  console.log(`✅ Base de données '${dbName}' prête.`);

  // 2. Se connecter à cette base
  await connection.changeUser({ database: dbName });

  // 3. Créer les tables principales
  
  // Table users
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstname VARCHAR(100),
        lastname VARCHAR(100),
        email VARCHAR(150) UNIQUE,
        phone VARCHAR(30) UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT chk_email_or_phone CHECK (
            email IS NOT NULL OR phone IS NOT NULL
        )
    );
  `);
  console.log('✅ Table users créée');

  // Table products
  await connection.query(`
    CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        price DECIMAL(10,2) NOT NULL,
        discount_percent DECIMAL(5,2) DEFAULT 0,
        discounted_price DECIMAL(10,2) AS (
            price - (price * discount_percent / 100)
        ) STORED,
        stock INT DEFAULT 0,
        image_url VARCHAR(255),
        gender ENUM('male','female','unisex') DEFAULT 'unisex',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);
  console.log('✅ Table products créée');

  // Table orders
  await connection.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      total_amount DECIMAL(10,2) NOT NULL,
      payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
  console.log('✅ Table orders créée');

  // Table order_items (lien entre orders et products)
  await connection.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      product_id INT NOT NULL,
      quantity INT NOT NULL DEFAULT 1,
      unit_price DECIMAL(10,2) NOT NULL,
      subtotal DECIMAL(10,2) AS (quantity * unit_price) STORED,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `);
  console.log('✅ Table order_items créée');

  // Table cart (CORRIGÉE - product_id au lieu de ticket_id)
  await connection.query(`
    CREATE TABLE IF NOT EXISTS cart (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      product_id INT NOT NULL,
      quantity INT DEFAULT 1,
      added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      UNIQUE KEY unique_user_product (user_id, product_id)
    );
  `);
  console.log('✅ Table cart créée');

  console.log("\n🎉 Toutes les tables créées avec succès !");
  await connection.end();
}

initDB().catch(err => {
  console.error("❌ Erreur lors de la création de la base :", err);
  process.exit(1);
});