/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: Order routes - handles order creation, management and admin operations
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');
const { order } = require('../locales');

// Validations pour créer une commande
const createOrderValidation = [
  body('payment_status').optional().isIn(['pending', 'paid', 'failed']).withMessage(order.paymentStatusInvalid)
];

// Validations pour mettre à jour le statut
const updateStatusValidation = [
  body('payment_status').isIn(['pending', 'paid', 'failed']).withMessage(order.paymentStatusInvalid)
];

// Routes utilisateur (authentifié)

// Récupérer les commandes de l'utilisateur connecté
router.get('/myorders', verifyToken, orderController.getUserOrders);

// Créer une nouvelle commande (à partir du panier)
router.post('/', verifyToken, createOrderValidation, validate, orderController.createOrder);

// Récupérer une commande spécifique (utilisateur ou admin)
router.get('/:id', verifyToken, orderController.getOrderById);

// Annuler une commande (utilisateur ou admin, seulement si pending)
router.delete('/:id', verifyToken, orderController.cancelOrder);

// Routes admin

// Récupérer toutes les commandes (Admin uniquement)
router.get('/', verifyToken, isAdmin, orderController.getAllOrders);

// Mettre à jour le statut d'une commande (Admin uniquement)
router.put('/:id/status', verifyToken, isAdmin, updateStatusValidation, validate, orderController.updateOrderStatus);

// Export the router to be used in server.js
module.exports = router;