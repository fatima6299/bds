/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: Database migration script - creates the contact_messages table
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function addContactMessagesTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'bds'
  });

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(150) NOT NULL,
          email VARCHAR(150) NOT NULL,
          message TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table contact_messages prête.');
  } finally {
    await connection.end();
  }
}

addContactMessagesTable().catch(err => {
  console.error('❌ Erreur lors de la migration contact_messages :', err.message);
  process.exit(1);
});
