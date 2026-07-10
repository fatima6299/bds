/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: Cart model - handles shopping cart data operations
 */

const db = require('../../config/db');
const queries = require('../queries').cart;

class Cart {
  // Ajouter un produit au panier
  static async addItem(userId, productId, quantity) {
    await db.query(queries.addToCart, [userId, productId, quantity]);
    return this.getCartByUserId(userId);
  }

  // Ajouter ou mettre à jour avec une quantité spécifique
  static async addOrUpdateItem(userId, productId, quantity) {
    await db.query(queries.addOrUpdateCart, [userId, productId, quantity, quantity]);
    return this.getCartByUserId(userId);
  }

  // Récupérer le panier d'un utilisateur avec détails des produits
  static async getCartByUserId(userId) {
    const [rows] = await db.query(queries.getCartByUserId, [userId]);
    return rows;
  }

  // Vérifier si un produit est dans le panier
  static async getCartItem(userId, productId) {
    const [rows] = await db.query(queries.getCartItem, [userId, productId]);
    return rows[0];
  }

  // Récupérer un item du panier par ID
  static async getCartItemById(cartId, userId) {
    const [rows] = await db.query(queries.getCartItemById, [cartId, userId]);
    return rows[0];
  }

  // Calculer le total du panier
  static async calculateTotal(userId) {
    const [rows] = await db.query(queries.calculateCartTotal, [userId]);
    return parseFloat(rows[0].total || 0);
  }

  // Compter le nombre d'items dans le panier
  static async countItems(userId) {
    const [rows] = await db.query(queries.countCartItems, [userId]);
    return rows[0].count;
  }

  // Mettre à jour la quantité d'un produit
  static async updateQuantity(userId, productId, quantity) {
    await db.query(queries.updateQuantity, [quantity, userId, productId]);
    return this.getCartByUserId(userId);
  }

  // Incrémenter la quantité
  static async incrementQuantity(userId, productId, quantity) {
    await db.query(queries.incrementQuantity, [quantity, userId, productId]);
    return this.getCartByUserId(userId);
  }

  // Retirer un produit du panier
  static async removeItem(userId, productId) {
    const [result] = await db.query(queries.removeFromCart, [userId, productId]);
    return result.affectedRows > 0;
  }

  // Retirer un item par ID
  static async removeItemById(cartId, userId) {
    const [result] = await db.query(queries.removeItemById, [cartId, userId]);
    return result.affectedRows > 0;
  }

  // Vider le panier
  static async clearCart(userId) {
    const [result] = await db.query(queries.clearCart, [userId]);
    return result.affectedRows > 0;
  }
}

module.exports = Cart;
