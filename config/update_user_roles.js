/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: User roles update script - adds superadmin role to user table
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateUserRoles() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'bds'
  });

  try {
    console.log('🔧 Mise à jour de la table users pour ajouter le rôle "superadmin"...\n');

    // Modifier la colonne role pour accepter superadmin, admin, user
    await connection.query(`
      ALTER TABLE users 
      MODIFY COLUMN role ENUM('superadmin', 'admin', 'user') DEFAULT 'user'
    `);

    console.log('✅ Table users mise à jour avec succès !');
    console.log('   Rôles disponibles : superadmin, admin, user\n');

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

updateUserRoles();
