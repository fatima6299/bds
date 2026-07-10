/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: Error handling middleware - centralized error management
 */

const { common } = require('../locales');

// Middleware de gestion centralisée des erreurs
const errorHandler = (err, req, res, next) => {
  console.error(common.logError, err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || common.serverError;

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
