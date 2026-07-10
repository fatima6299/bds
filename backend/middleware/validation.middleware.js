/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: Validation middleware - handles request data validation and error formatting
 */

const { validationResult } = require('express-validator');

// Middleware pour valider les erreurs
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  
  next();
};

module.exports = validate;
