/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: Database migration script - creates the product_images table and
 * migrates existing image_url_2 / image_url_3 columns into it
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function addProductImagesTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'bds'
  });

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_images (
          id INT AUTO_INCREMENT PRIMARY KEY,
          product_id INT NOT NULL,
          image_url VARCHAR(255) NOT NULL,
          position INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      );
    `);
    console.log('✅ Table product_images prête.');

    const [products] = await connection.query(
      `SELECT id, image_url_2, image_url_3 FROM products WHERE image_url_2 IS NOT NULL OR image_url_3 IS NOT NULL`
    );

    let migrated = 0;
    for (const product of products) {
      const extraImages = [product.image_url_2, product.image_url_3].filter(Boolean);
      for (let i = 0; i < extraImages.length; i++) {
        const [existing] = await connection.query(
          `SELECT id FROM product_images WHERE product_id = ? AND image_url = ?`,
          [product.id, extraImages[i]]
        );
        if (existing.length === 0) {
          await connection.query(
            `INSERT INTO product_images (product_id, image_url, position) VALUES (?, ?, ?)`,
            [product.id, extraImages[i], i]
          );
          migrated++;
        }
      }
    }
    console.log(`✅ ${migrated} image(s) migrée(s) depuis image_url_2 / image_url_3 vers product_images.`);
  } finally {
    await connection.end();
  }
}

addProductImagesTable().catch(err => {
  console.error('❌ Erreur lors de la migration product_images :', err.message);
  process.exit(1);
});
