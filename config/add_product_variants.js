/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: Database migration script - adds size/color variant support
 * (products.sizes/colors, cart.size/color, order_items.size/color)
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function addColumnIfMissing(connection, table, columnDefSql, columnName) {
  try {
    await connection.query(`ALTER TABLE ${table} ADD COLUMN ${columnDefSql}`);
    console.log(`✅ Colonne ${columnName} ajoutée à ${table}.`);
  } catch (error) {
    if (error.message.includes('Duplicate column name')) {
      console.log(`ℹ️  Colonne ${columnName} déjà présente sur ${table}.`);
    } else {
      throw error;
    }
  }
}

async function addProductVariants() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'bds'
  });

  try {
    // Tailles/couleurs disponibles pour un produit (texte libre séparé par virgules)
    await addColumnIfMissing(connection, 'products', 'sizes VARCHAR(255) NULL', 'sizes');
    await addColumnIfMissing(connection, 'products', 'colors VARCHAR(255) NULL', 'colors');

    // Variante choisie dans le panier ('' = pas de variante, pour que la contrainte
    // unique fonctionne comme avant sur les produits sans taille/couleur)
    await addColumnIfMissing(connection, 'cart', "size VARCHAR(50) NOT NULL DEFAULT ''", 'size');
    await addColumnIfMissing(connection, 'cart', "color VARCHAR(50) NOT NULL DEFAULT ''", 'color');

    try {
      await connection.query('ALTER TABLE cart DROP INDEX unique_user_product');
      console.log('✅ Ancien index unique_user_product supprimé.');
    } catch (error) {
      if (error.message.includes("check that column/key exists")) {
        console.log('ℹ️  Index unique_user_product déjà absent.');
      } else {
        throw error;
      }
    }

    try {
      await connection.query(
        'ALTER TABLE cart ADD UNIQUE KEY unique_user_product_variant (user_id, product_id, size, color)'
      );
      console.log('✅ Nouvel index unique_user_product_variant créé.');
    } catch (error) {
      if (error.message.includes('Duplicate key name')) {
        console.log('ℹ️  Index unique_user_product_variant déjà présent.');
      } else {
        throw error;
      }
    }

    // Variante choisie, conservée dans l'historique de commande
    await addColumnIfMissing(connection, 'order_items', "size VARCHAR(50) NULL", 'size');
    await addColumnIfMissing(connection, 'order_items', "color VARCHAR(50) NULL", 'color');

    console.log('🎉 Migration des variantes taille/couleur terminée.');
  } finally {
    await connection.end();
  }
}

addProductVariants().catch(err => {
  console.error('❌ Erreur lors de la migration des variantes:', err.message);
  process.exit(1);
});
