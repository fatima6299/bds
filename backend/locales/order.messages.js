/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: Order messages - success and error messages for order operations
 */

module.exports = {
  order: {
    // Succès
    orderCreatedSuccess: 'Commande créée avec succès.',
    orderUpdatedSuccess: 'Commande mise à jour avec succès.',
    orderCancelledSuccess: 'Commande annulée avec succès.',
    paymentConfirmedSuccess: 'Paiement confirmé avec succès.',
    
    // Erreurs
    orderNotFound: 'Commande non trouvée.',
    emptyCart: 'Votre panier est vide.',
    insufficientStock: 'Stock insuffisant pour certains produits.',
    createOrderError: 'Erreur lors de la création de la commande.',
    updateOrderError: 'Erreur lors de la mise à jour de la commande.',
    retrieveOrdersError: 'Erreur lors de la récupération des commandes.',
    retrieveOrderError: 'Erreur lors de la récupération de la commande.',
    
    // Permissions
    unauthorizedAccess: 'Vous n\'avez pas accès à cette commande.',
    cannotCancelOrder: 'Cette commande ne peut plus être annulée.',
    cannotUpdateOrder: 'Cette commande ne peut plus être modifiée. Seules les commandes en attente peuvent être modifiées.',
    
    // Validation
    paymentStatusInvalid: 'Statut de paiement invalide (pending, paid, failed)'
  }
};
