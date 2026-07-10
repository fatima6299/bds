/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: Database configuration - MySQL connection pool setup
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test de connexion au démarrage
pool.getConnection()
  .then(connection => {
    console.log('✅ Connecté à la base de données MySQL');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Erreur de connexion à MySQL:', err.message);
  });

module.exports = pool;