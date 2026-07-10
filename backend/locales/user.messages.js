/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: User messages - success and error messages for user management operations
 */

module.exports = {
  user: {
    // Succès
    userUpdatedSuccess: 'Utilisateur mis à jour avec succès.',
    userDeletedSuccess: 'Utilisateur supprimé avec succès.',
    usersRetrievedSuccess: 'Utilisateurs récupérés avec succès.',
    
    // Erreurs
    userNotFound: 'Utilisateur non trouvé.',
    retrieveUsersError: 'Erreur lors de la récupération des utilisateurs.',
    retrieveAdminsError: 'Erreur lors de la récupération des admins.',
    retrieveUserError: 'Erreur lors de la récupération de l\'utilisateur.',
    updateUserError: 'Erreur lors de la mise à jour de l\'utilisateur.',
    deleteUserError: 'Erreur lors de la suppression de l\'utilisateur.',
    
    // Permissions
    cannotModifyAdmin: 'Vous ne pouvez pas modifier un administrateur.',
    cannotDeleteSelf: 'Un super administrateur ne peut pas se supprimer lui-même.',
    cannotDeleteSuperAdmin: 'Un super administrateur ne peut pas supprimer un autre super administrateur.',
    onlySuperAdminCanDeleteAdmin: 'Seul un super administrateur peut supprimer un administrateur.',
    cannotModifyAdminInfo: 'Vous ne pouvez pas modifier les informations d\'un administrateur.',
    cannotDeleteYourself: 'Vous ne pouvez pas vous supprimer vous-même.',
    retrieveAdministratorsError: 'Erreur lors de la récupération des administrateurs.',
    
    // Console logs
    logRetrieveUsersError: 'Erreur lors de la récupération des utilisateurs:',
    logRetrieveAdminsError: 'Erreur lors de la récupération des admins:',
    logRetrieveUserError: 'Erreur lors de la récupération de l\'utilisateur:',
    logUpdateError: 'Erreur lors de la mise à jour:',
    logDeleteError: 'Erreur lors de la suppression:'
  }
};
