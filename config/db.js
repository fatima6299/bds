/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: Database configuration - MySQL connection pool setup
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Certains hébergeurs MySQL managés (Railway, Clever Cloud...) exigent SSL.
  // Activer avec DB_SSL=true dans l'environnement concerné.
  ...(process.env.DB_SSL === 'true' && { ssl: { rejectUnauthorized: false } })
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