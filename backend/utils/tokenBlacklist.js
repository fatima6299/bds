/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: Token blacklist utility - manages revoked JWT tokens for secure logout
 */

// Gestion des tokens révoqués (blacklist)
// En production, utilisez Redis ou une base de données

const revokedTokens = new Set();

// Ajouter un token à la blacklist
const revokeToken = (token) => {
  revokedTokens.add(token);
};

// Vérifier si un token est révoqué
const isTokenRevoked = (token) => {
  return revokedTokens.has(token);
};

// Nettoyer les tokens expirés (optionnel - pour optimiser la mémoire)
const cleanExpiredTokens = () => {
  // Cette fonction pourrait décoder les tokens et supprimer ceux expirés
  // Pour simplifier, on garde tous les tokens révoqués
};

module.exports = {
  revokeToken,
  isTokenRevoked,
  cleanExpiredTokens
};