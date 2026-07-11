/**
 * Author: Fatimata Tidiane Dia
 * Created: December 1, 2025
 * Description: Upload routes - handles product image upload (Admin/SuperAdmin only)
 */

const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const { uploadProductImage } = require('../middleware/upload.middleware');

// Téléverser une image de produit
router.post('/image', verifyToken, isAdmin, uploadProductImage, uploadController.uploadImage);

// Export the router to be used in server.js
module.exports = router;
