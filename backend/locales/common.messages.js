/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: Common messages - general success and error messages shared across modules
 */

module.exports = {
  common: {
    // Succès généraux
    success: 'Opération réussie.',
    dataRetrievedSuccess: 'Données récupérées avec succès.',
    
    // Erreurs générales
    serverError: 'Erreur serveur interne.',
    notFound: 'Ressource non trouvée.',
    badRequest: 'Requête invalide.',
    unauthorized: 'Non autorisé.',
    forbidden: 'Accès interdit.',
    
    // Validation
    fieldRequired: 'Ce champ est requis',
    invalidFormat: 'Format invalide',
    invalidId: 'ID invalide',
    
    // Console logs
    logError: '❌ Erreur:',
    logServerStarted: '✅ Serveur lancé sur le port',
    logServerAccess: '🌐 Accès:'
  }
};
