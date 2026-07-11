/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: Order controller - handles order creation, management and payment status
 */

const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const { order } = require('../locales');

// Créer une commande à partir du panier
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const payment_status = req.body?.payment_status || 'pending';

    console.log('📦 Création de commande pour user:', userId);
    console.log('💳 Payment status:', payment_status);

    // Récupérer le panier de l'utilisateur
    const cartItems = await Cart.getCartByUserId(userId);
    console.log('🛒 Items du panier:', cartItems.length);

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: order.emptyCart
      });
    }

    // Vérifier le stock pour chaque produit
    for (const item of cartItems) {
      const availableStock = await Product.checkStock(item.product_id);
      if (item.quantity > availableStock) {
        return res.status(400).json({
          success: false,
          message: `${order.insufficientStock} "${item.name}" (${order.availableLabel}: ${availableStock}).`,
          product: item.name,
          available: availableStock
        });
      }
    }

    // Calculer le total
    const totalAmount = await Cart.calculateTotal(userId);
    console.log('💰 Total commande:', totalAmount);

    // Créer la commande
    const orderId = await Order.create(userId, totalAmount, payment_status);
    console.log('✅ Commande créée, ID:', orderId);

    // Créer les items de commande et décrémenter le stock
    for (const item of cartItems) {
      console.log('📝 Ajout item:', item.product_id, 'x', item.quantity);
      // Ajouter l'item à la commande
      await Order.createOrderItem(
        orderId,
        item.product_id,
        item.quantity,
        item.discounted_price,
        item.size,
        item.color
      );

      // Décrémenter le stock du produit
      await Product.decrementStock(item.product_id, item.quantity);
    }

    // Vider le panier après la commande
    await Cart.clearCart(userId);
    console.log('🧹 Panier vidé');

    // Récupérer la commande complète avec les items
    const newOrder = await Order.findById(orderId);
    const orderItems = await Order.findOrderItems(orderId);
    console.log('✅ Commande finalisée');

    res.status(201).json({
      success: true,
      message: order.orderCreatedSuccess,
      order: {
        ...newOrder,
        items: orderItems
      }
    });
  } catch (error) {
    console.error('❌ Erreur lors de la création de la commande:', error);
    res.status(500).json({
      success: false,
      message: order.createOrderError
    });
  }
};

// Récupérer toutes les commandes de l'utilisateur connecté
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.findByUserId(userId);
    const count = await Order.countUserOrders(userId);

    const ordersWithItems = await Promise.all(
      orders.map(async (o) => ({ ...o, items: await Order.findOrderItems(o.id) }))
    );

    res.json({
      success: true,
      count,
      orders: ordersWithItems
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des commandes:', error);
    res.status(500).json({
      success: false,
      message: order.retrieveOrdersError
    });
  }
};

// Récupérer toutes les commandes (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    const count = await Order.count();
    const totalSales = await Order.getTotalSales();

    const ordersWithItems = await Promise.all(
      orders.map(async (o) => ({ ...o, items: await Order.findOrderItems(o.id) }))
    );

    res.json({
      success: true,
      count,
      totalSales,
      orders: ordersWithItems
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des commandes:', error);
    res.status(500).json({
      success: false,
      message: order.retrieveOrdersError
    });
  }
};

// Récupérer une commande spécifique avec ses items
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const foundOrder = await Order.findById(id);

    if (!foundOrder) {
      return res.status(404).json({
        success: false,
        message: order.orderNotFound
      });
    }

    // Vérifier que l'utilisateur a accès à cette commande
    // (soit c'est sa commande, soit c'est un admin)
    if (foundOrder.user_id !== userId && userRole !== 'admin' && userRole !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: order.unauthorizedAccess
      });
    }

    // Récupérer les items de la commande
    const orderItems = await Order.findOrderItems(id);

    res.json({
      success: true,
      order: {
        ...foundOrder,
        items: orderItems
      }
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de la commande:', error);
    res.status(500).json({
      success: false,
      message: order.retrieveOrderError
    });
  }
};

// Mettre à jour le statut d'une commande (Admin uniquement)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;

    // Vérifier que la commande existe
    const existingOrder = await Order.findById(id);
    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: order.orderNotFound
      });
    }

    // Mettre à jour le statut
    const updatedOrder = await Order.updateStatus(id, payment_status);

    res.json({
      success: true,
      message: order.orderUpdatedSuccess,
      order: updatedOrder
    });
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour de la commande:', error);
    res.status(500).json({
      success: false,
      message: order.updateOrderError
    });
  }
};

// Annuler une commande
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Vérifier que la commande existe
    const existingOrder = await Order.findById(id);
    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: order.orderNotFound
      });
    }

    // Vérifier que l'utilisateur a le droit d'annuler
    if (existingOrder.user_id !== userId && userRole !== 'admin' && userRole !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: order.unauthorizedAccess
      });
    }

    // On ne peut annuler qu'une commande en attente
    if (existingOrder.payment_status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: order.cannotCancelOrder
      });
    }

    // Récupérer les items pour restaurer le stock
    const orderItems = await Order.findOrderItems(id);

    // Restaurer le stock des produits
    for (const item of orderItems) {
      await Product.incrementStock(item.product_id, item.quantity);
    }

    // Supprimer la commande
    await Order.delete(id);

    res.json({
      success: true,
      message: order.orderCancelledSuccess
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'annulation de la commande:', error);
    res.status(500).json({
      success: false,
      message: order.updateOrderError
    });
  }
};
