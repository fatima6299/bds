/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: Authentication middleware - JWT verification and role-based access control
 */

const jwt = require('jsonwebtoken');
const { auth } = require('../locales');
const { isTokenRevoked } = require('../utils/tokenBlacklist');

// Middleware pour vérifier le token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: auth.tokenMissing 
    });
  }

  // Vérifier si le token est dans la blacklist
  if (isTokenRevoked(token)) {
    return res.status(401).json({
      success: false,
      message: 'Token révoqué. Veuillez vous reconnecter.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Ajoute les infos utilisateur à la requête
    req.token = token; // Ajoute le token pour pouvoir le révoquer
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      message: auth.tokenInvalid 
    });
  }
};

// Middleware pour vérifier si l'utilisateur est admin ou superadmin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    return res.status(403).json({ 
      success: false, 
      message: auth.adminRequired 
    });
  }
  next();
};

// Middleware pour vérifier si l'utilisateur est superadmin
const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ 
      success: false, 
      message: auth.superAdminRequired 
    });
  }
  next();
};

module.exports = { verifyToken, isAdmin, isSuperAdmin };
