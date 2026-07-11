/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: Upload messages - success and error messages for image upload operations
 */

module.exports = {
  upload: {
    // Succès
    uploadSuccess: 'Image téléchargée avec succès.',

    // Erreurs
    fileRequired: 'Aucun fichier image fourni.',
    invalidFileType: 'Format de fichier invalide. Formats acceptés : JPEG, PNG, WEBP, GIF.',
    fileTooLarge: 'Fichier trop volumineux (5 Mo maximum).',
    uploadError: "Erreur lors du téléchargement de l'image.",

    // Console logs
    logUploadError: "Erreur lors du téléchargement de l'image:"
  }
};
