/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: Product routes - handles product CRUD operations and public product access
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');
const { product } = require('../locales');

// Validations pour créer/modifier un produit
const productValidation = [
  body('name').trim().notEmpty().withMessage(product.nameRequired),
  body('price').isFloat({ min: 0 }).withMessage(product.priceInvalid),
  body('discount_percent').optional().isFloat({ min: 0, max: 100 }).withMessage(product.discountInvalid),
  body('stock').optional().isInt({ min: 0 }).withMessage(product.stockInvalid),
  body('gender').optional().isIn(['male', 'female', 'unisex']).withMessage(product.genderInvalid)
];

// Routes publiques (accessibles à tous)

// Récupérer tous les produits (avec filtres et recherche)
// Query params: ?category=xxx&gender=xxx&search=xxx&page=1&limit=10
router.get('/', productController.getAllProducts);

// Récupérer un produit par ID
router.get('/:id', productController.getProductById);

// Routes protégées (Admin/SuperAdmin uniquement)

// Créer un nouveau produit
router.post('/', verifyToken, isAdmin, productValidation, validate, productController.createProduct);

// Mettre à jour un produit
router.put('/:id', verifyToken, isAdmin, productValidation, validate, productController.updateProduct);

// Supprimer un produit
router.delete('/:id', verifyToken, isAdmin, productController.deleteProduct);

// Obtenir le nombre total de produits
router.get('/count/total', verifyToken, isAdmin, productController.getProductCount);

// Export the router to be used in server.js
module.exports = router;