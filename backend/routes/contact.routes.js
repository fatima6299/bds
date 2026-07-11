/**
 * Author: Fatimata Tidiane Dia
 * Created: December 1, 2025
 * Description: Contact routes - handles contact form submission and admin message listing
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');
const { contact } = require('../locales');

const sendMessageValidation = [
  body('name').trim().notEmpty().withMessage(contact.nameRequired),
  body('email').isEmail().withMessage(contact.emailInvalid),
  body('message').trim().notEmpty().withMessage(contact.messageRequired)
];

// Envoyer un message (Public)
router.post('/', sendMessageValidation, validate, contactController.sendMessage);

// Récupérer tous les messages (Admin/SuperAdmin)
router.get('/', verifyToken, isAdmin, contactController.getAllMessages);

// Export the router to be used in server.js
module.exports = router;
