/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: Database migration script - adds password reset columns to users table
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function addResetPasswordColumns() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'bds'
    });

    // Ajouter les colonnes pour la réinitialisation de mot de passe
    await connection.query(`
      ALTER TABLE users 
      ADD COLUMN reset_token VARCHAR(10) NULL,
      ADD COLUMN reset_token_expires DATETIME NULL
    `);

    console.log('✅ Colonnes reset_token et reset_token_expires ajoutées à la table users');
    
    await connection.end();
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des colonnes:', error.message);
    
    // Si les colonnes existent déjà, c'est OK
    if (error.message.includes('Duplicate column name')) {
      console.log('ℹ️  Les colonnes existent déjà');
    }
  }
}

addResetPasswordColumns();