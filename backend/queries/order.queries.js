/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: Order SQL queries - all database queries for order and order items operations
 */

// Requêtes SQL pour la gestion des commandes

module.exports = {
  // Création
  createOrder: `
    INSERT INTO orders (user_id, total_amount, payment_status) 
    VALUES (?, ?, ?)
  `,
  
  createOrderItem: `
    INSERT INTO order_items (order_id, product_id, quantity, unit_price) 
    VALUES (?, ?, ?, ?)
  `,

  // Lecture
  findOrderById: `
    SELECT o.*, u.firstname, u.lastname, u.email, u.phone
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.id = ?
  `,
  
  findOrdersByUserId: `
    SELECT * FROM orders 
    WHERE user_id = ? 
    ORDER BY created_at DESC
  `,
  
  findAllOrders: `
    SELECT o.*, u.firstname, u.lastname, u.email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `,
  
  findOrderItems: `
    SELECT oi.*, p.name, p.description, p.image_url
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
  `,
  
  findOrderWithItems: `
    SELECT o.*, 
           JSON_ARRAYAGG(
             JSON_OBJECT(
               'id', oi.id,
               'product_id', oi.product_id,
               'product_name', p.name,
               'quantity', oi.quantity,
               'unit_price', oi.unit_price,
               'subtotal', oi.subtotal
             )
           ) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE o.id = ?
    GROUP BY o.id
  `,
  
  findOrdersByStatus: `
    SELECT * FROM orders 
    WHERE payment_status = ? 
    ORDER BY created_at DESC
  `,

  // Mise à jour
  updateOrderStatus: `
    UPDATE orders 
    SET payment_status = ? 
    WHERE id = ?
  `,
  
  updateOrderTotal: `
    UPDATE orders 
    SET total_amount = ? 
    WHERE id = ?
  `,

  // Suppression (rare)
  deleteOrder: `DELETE FROM orders WHERE id = ?`,
  
  deleteOrderItems: `DELETE FROM order_items WHERE order_id = ?`,

  // Statistiques
  getTotalSales: `
    SELECT SUM(total_amount) as total 
    FROM orders 
    WHERE payment_status = 'paid'
  `,
  
  getOrderCount: `
    SELECT COUNT(*) as count 
    FROM orders
  `,
  
  getUserOrderCount: `
    SELECT COUNT(*) as count 
    FROM orders 
    WHERE user_id = ?
  `
};
