/**
 * Author: Fatimata Tidiane Dia
 * Created: December 1, 2025
 * Description: Rate limiting middleware - protects sensitive auth endpoints from brute force
 */

const rateLimit = require('express-rate-limit');

// Limite les tentatives de connexion/inscription/réinitialisation par IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Trop de tentatives. Veuillez réessayer dans quelques minutes.'
  }
});

module.exports = { authLimiter };
