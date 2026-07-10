/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: Product messages - success and error messages for product operations
 */

module.exports = {
  product: {
    // Succès
    productCreatedSuccess: 'Produit créé avec succès.',
    productUpdatedSuccess: 'Produit mis à jour avec succès.',
    productDeletedSuccess: 'Produit supprimé avec succès.',
    productsRetrievedSuccess: 'Produits récupérés avec succès.',
    
    // Erreurs
    productNotFound: 'Produit non trouvé.',
    createProductError: 'Erreur lors de la création du produit.',
    updateProductError: 'Erreur lors de la mise à jour du produit.',
    deleteProductError: 'Erreur lors de la suppression du produit.',
    retrieveProductsError: 'Erreur lors de la récupération des produits.',
    retrieveProductError: 'Erreur lors de la récupération du produit.',
    
    // Validation
    nameRequired: 'Le nom du produit est requis',
    priceRequired: 'Le prix est requis',
    priceInvalid: 'Le prix doit être un nombre positif',
    stockInvalid: 'Le stock doit être un nombre positif',
    discountInvalid: 'La réduction doit être entre 0 et 100',
    categoryInvalid: 'Catégorie invalide',
    genderInvalid: 'Genre invalide (male, female, unisex)',
    
    // Console logs
    logCreateError: 'Erreur lors de la création du produit:',
    logUpdateError: 'Erreur lors de la mise à jour du produit:',
    logDeleteError: 'Erreur lors de la suppression du produit:',
    logRetrieveError: 'Erreur lors de la récupération des produits:'
  }
};
