/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: Cart messages - success and error messages for shopping cart operations
 */

module.exports = {
  cart: {
    // Succès
    itemAddedSuccess: 'Produit ajouté au panier.',
    itemRemovedSuccess: 'Produit retiré du panier.',
    itemUpdatedSuccess: 'Quantité mise à jour.',
    cartClearedSuccess: 'Panier vidé avec succès.',
    
    // Erreurs
    productNotFound: 'Produit non trouvé.',
    insufficientStock: 'Stock insuffisant pour ce produit.',
    itemNotInCart: 'Ce produit n\'est pas dans votre panier.',
    addToCartError: 'Erreur lors de l\'ajout au panier.',
    removeFromCartError: 'Erreur lors du retrait du panier.',
    updateCartError: 'Erreur lors de la mise à jour du panier.',
    clearCartError: 'Erreur lors du vidage du panier.',
    retrieveCartError: 'Erreur lors de la récupération du panier.',
    
    // Validation
    productIdRequired: 'ID du produit requis',
    quantityRequired: 'Quantité requise',
    quantityInvalid: 'La quantité doit être un nombre positif'
  }
};
