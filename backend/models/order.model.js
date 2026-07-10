/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: Order model - handles order and order items data operations
 */

const db = require('../../config/db');
const queries = require('../queries').order;

class Order {
  // Créer une nouvelle commande
  static async create(userId, totalAmount, paymentStatus = 'pending') {
    const [result] = await db.query(queries.createOrder, [userId, totalAmount, paymentStatus]);
    return result.insertId;
  }

  // Créer un item de commande
  static async createOrderItem(orderId, productId, quantity, unitPrice) {
    await db.query(queries.createOrderItem, [orderId, productId, quantity, unitPrice]);
  }

  // Trouver une commande par ID avec infos utilisateur
  static async findById(orderId) {
    const [rows] = await db.query(queries.findOrderById, [orderId]);
    return rows[0];
  }

  // Récupérer toutes les commandes d'un utilisateur
  static async findByUserId(userId) {
    const [rows] = await db.query(queries.findOrdersByUserId, [userId]);
    return rows;
  }

  // Récupérer toutes les commandes (Admin)
  static async findAll() {
    const [rows] = await db.query(queries.findAllOrders);
    return rows;
  }

  // Récupérer les items d'une commande
  static async findOrderItems(orderId) {
    const [rows] = await db.query(queries.findOrderItems, [orderId]);
    return rows;
  }

  // Récupérer une commande avec ses items (JSON)
  static async findOrderWithItems(orderId) {
    const [rows] = await db.query(queries.findOrderWithItems, [orderId]);
    return rows[0];
  }

  // Récupérer les commandes par statut
  static async findByStatus(status) {
    const [rows] = await db.query(queries.findOrdersByStatus, [status]);
    return rows;
  }

  // Mettre à jour le statut d'une commande
  static async updateStatus(orderId, status) {
    await db.query(queries.updateOrderStatus, [status, orderId]);
    return this.findById(orderId);
  }

  // Mettre à jour le montant total
  static async updateTotal(orderId, totalAmount) {
    await db.query(queries.updateOrderTotal, [totalAmount, orderId]);
    return this.findById(orderId);
  }

  // Supprimer une commande et ses items
  static async delete(orderId) {
    // Supprimer d'abord les items
    await db.query(queries.deleteOrderItems, [orderId]);
    // Puis la commande
    const [result] = await db.query(queries.deleteOrder, [orderId]);
    return result.affectedRows > 0;
  }

  // Compter les commandes d'un utilisateur
  static async countUserOrders(userId) {
    const [rows] = await db.query(queries.getUserOrderCount, [userId]);
    return rows[0].count;
  }

  // Compter toutes les commandes
  static async count() {
    const [rows] = await db.query(queries.getOrderCount);
    return rows[0].count;
  }

  // Calculer les ventes totales
  static async getTotalSales() {
    const [rows] = await db.query(queries.getTotalSales);
    return parseFloat(rows[0].total || 0);
  }
}

module.exports = Order;
