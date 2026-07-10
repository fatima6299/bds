/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: Product SQL queries - all database queries for product operations
 */

// Requêtes SQL pour la gestion des produits

module.exports = {
  // Création
  createProduct: `
    INSERT INTO products (name, description, category, price, discount_percent, stock, image_url, gender) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,

  // Lecture
  findById: `SELECT * FROM products WHERE id = ?`,
  
  findAll: `
    SELECT * FROM products 
    ORDER BY created_at DESC
  `,
  
  findByCategory: `
    SELECT * FROM products 
    WHERE category = ? 
    ORDER BY created_at DESC
  `,
  
  findByGender: `
    SELECT * FROM products 
    WHERE gender = ? 
    ORDER BY created_at DESC
  `,
  
  findByCategoryAndGender: `
    SELECT * FROM products 
    WHERE category = ? AND gender = ? 
    ORDER BY created_at DESC
  `,
  
  searchProducts: `
    SELECT * FROM products 
    WHERE name LIKE ? OR description LIKE ? OR category LIKE ?
    ORDER BY created_at DESC
  `,
  
  findWithPagination: `
    SELECT * FROM products 
    ORDER BY created_at DESC 
    LIMIT ? OFFSET ?
  `,

  // Mise à jour
  updateProduct: `
    UPDATE products 
    SET name = ?, description = ?, category = ?, price = ?, 
        discount_percent = ?, stock = ?, image_url = ?, gender = ? 
    WHERE id = ?
  `,
  
  updateStock: `
    UPDATE products 
    SET stock = ? 
    WHERE id = ?
  `,
  
  decrementStock: `
    UPDATE products 
    SET stock = stock - ? 
    WHERE id = ? AND stock >= ?
  `,
  
  incrementStock: `
    UPDATE products 
    SET stock = stock + ? 
    WHERE id = ?
  `,

  // Suppression
  deleteProduct: `DELETE FROM products WHERE id = ?`,
  
  // Vérifications
  checkStock: `SELECT stock FROM products WHERE id = ?`,
  
  countProducts: `SELECT COUNT(*) as total FROM products`
};
