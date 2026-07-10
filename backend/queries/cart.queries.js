/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: Cart SQL queries - all database queries for shopping cart operations
 */

// Requêtes SQL pour la gestion du panier

module.exports = {
  // Création / Ajout
  addToCart: `
    INSERT INTO cart (user_id, product_id, quantity) 
    VALUES (?, ?, ?) 
    ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
  `,
  
  addOrUpdateCart: `
    INSERT INTO cart (user_id, product_id, quantity) 
    VALUES (?, ?, ?) 
    ON DUPLICATE KEY UPDATE quantity = ?
  `,

  // Lecture
  getCartByUserId: `
    SELECT c.id, c.user_id, c.product_id, c.quantity, c.added_at,
           p.name, p.description, p.price, p.discount_percent, p.discounted_price, 
           p.image_url, p.stock,
           (c.quantity * p.discounted_price) as subtotal
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
    ORDER BY c.added_at DESC
  `,
  
  getCartItem: `
    SELECT * FROM cart 
    WHERE user_id = ? AND product_id = ?
  `,
  
  getCartItemById: `
    SELECT * FROM cart 
    WHERE id = ? AND user_id = ?
  `,
  
  calculateCartTotal: `
    SELECT SUM(c.quantity * p.discounted_price) as total
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `,
  
  countCartItems: `
    SELECT COUNT(*) as count 
    FROM cart 
    WHERE user_id = ?
  `,

  // Mise à jour
  updateQuantity: `
    UPDATE cart 
    SET quantity = ? 
    WHERE user_id = ? AND product_id = ?
  `,
  
  incrementQuantity: `
    UPDATE cart 
    SET quantity = quantity + ? 
    WHERE user_id = ? AND product_id = ?
  `,

  // Suppression
  removeFromCart: `
    DELETE FROM cart 
    WHERE user_id = ? AND product_id = ?
  `,
  
  removeItemById: `
    DELETE FROM cart 
    WHERE id = ? AND user_id = ?
  `,
  
  clearCart: `
    DELETE FROM cart 
    WHERE user_id = ?
  `
};
