/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: Authentication messages - success and error messages for auth operations
 */

module.exports = {
  auth: {
    // Succès
    registerSuccess: 'Inscription réussie.',
    loginSuccess: 'Connexion réussie.',
    logoutSuccess: 'Déconnexion réussie.',
    adminCreatedSuccess: 'Administrateur créé avec succès.',
    superAdminCreatedSuccess: 'Super administrateur créé avec succès.',
    passwordChangedSuccess: 'Mot de passe modifié avec succès.',
    resetTokenSentSuccess: 'Token de réinitialisation généré avec succès.',
    passwordResetSuccess: 'Mot de passe réinitialisé avec succès.',
    profileUpdatedSuccess: 'Profil mis à jour avec succès.',
    
    // Erreurs
    emailAlreadyExists: 'Cet email est déjà utilisé.',
    phoneAlreadyExists: 'Ce numéro de téléphone est déjà utilisé.',
    invalidCredentials: 'Identifiants incorrects.',
    registerError: 'Erreur lors de l\'inscription.',
    loginError: 'Erreur lors de la connexion.',
    createAdminError: 'Erreur lors de la création de l\'administrateur.',
    profileError: 'Erreur lors de la récupération du profil.',
    changePasswordError: 'Erreur lors de la modification du mot de passe.',
    currentPasswordIncorrect: 'Le mot de passe actuel est incorrect.',
    resetTokenError: 'Erreur lors de la génération du token de réinitialisation.',
    resetPasswordError: 'Erreur lors de la réinitialisation du mot de passe.',
    invalidResetToken: 'Token de réinitialisation invalide ou expiré.',
    updateProfileError: 'Erreur lors de la mise à jour du profil.',
    logoutError: 'Erreur lors de la déconnexion.',
    
    // Validation
    firstnameRequired: 'Le prénom ne peut pas être vide',
    lastnameRequired: 'Le nom ne peut pas être vide',
    emailInvalid: 'Email invalide',
    phoneInvalid: 'Numéro de téléphone invalide',
    passwordMinLength: 'Le mot de passe doit contenir au moins 6 caractères',
    passwordUppercase: 'Le mot de passe doit contenir au moins une majuscule',
    passwordLowercase: 'Le mot de passe doit contenir au moins une minuscule',
    passwordNumber: 'Le mot de passe doit contenir au moins un chiffre',
    roleInvalid: 'Rôle invalide',
    identifierRequired: 'Email ou téléphone requis',
    passwordRequired: 'Mot de passe requis',
    currentPasswordRequired: 'Le mot de passe actuel est requis',
    newPasswordRequired: 'Le nouveau mot de passe est requis',
    passwordsNotMatch: 'Les mots de passe ne correspondent pas',
    resetTokenRequired: 'Token de réinitialisation requis',
    emailRequired: 'Email requis pour la réinitialisation',
    
    // Middlewares
    tokenMissing: 'Accès refusé. Token manquant.',
    tokenInvalid: 'Token invalide ou expiré.',
    adminRequired: 'Accès refusé. Droits administrateur requis.',
    superAdminRequired: 'Accès refusé. Droits super administrateur requis.',
    
    // Autres
    userNotFound: 'Utilisateur non trouvé.',
    
    // Console logs
    logRegisterError: 'Erreur lors de l\'inscription:',
    logCreateAdminError: 'Erreur lors de la création de l\'admin:',
    logLoginError: 'Erreur lors de la connexion:',
    logProfileError: 'Erreur lors de la récupération du profil:',
    logChangePasswordError: 'Erreur lors du changement de mot de passe:',
    logResetTokenError: 'Erreur lors de la génération du token de réinitialisation:',
    logResetPasswordError: 'Erreur lors de la réinitialisation du mot de passe:',
    logUpdateProfileError: 'Erreur lors de la mise à jour du profil:'
  }
};
