/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: Cart routes - handles shopping cart operations for authenticated users
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');
const { cart } = require('../locales');

// Validations pour ajouter au panier
const addToCartValidation = [
  body('product_id').isInt({ min: 1 }).withMessage(cart.productIdRequired),
  body('quantity').isInt({ min: 1 }).withMessage(cart.quantityInvalid)
];

// Validations pour mettre à jour la quantité
const updateQuantityValidation = [
  body('quantity').isInt({ min: 1 }).withMessage(cart.quantityInvalid)
];

// Toutes les routes du panier sont protégées (utilisateur connecté uniquement)

// Récupérer le panier de l'utilisateur connecté
router.get('/', verifyToken, cartController.getCart);

// Ajouter un produit au panier
router.post('/', verifyToken, addToCartValidation, validate, cartController.addToCart);

// Mettre à jour la quantité d'un produit dans le panier
router.put('/:productId', verifyToken, updateQuantityValidation, validate, cartController.updateCartItem);

// Retirer un produit du panier
router.delete('/:productId', verifyToken, cartController.removeFromCart);

// Vider tout le panier
router.delete('/', verifyToken, cartController.clearCart);

// Export the router to be used in server.js
module.exports = router;