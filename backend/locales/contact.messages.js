/**
 * Author: Fatimata Tidiane Dia
 * Created: December 1, 2025
 * Description: Contact messages - success and error messages for contact form
 */

module.exports = {
  contact: {
    // Succès
    messageSentSuccess: 'Votre message a bien été envoyé. Nous vous répondrons rapidement.',

    // Erreurs
    sendMessageError: "Erreur lors de l'envoi du message.",
    retrieveMessagesError: 'Erreur lors de la récupération des messages.',

    // Validation
    nameRequired: 'Le nom est requis',
    emailInvalid: 'Adresse email invalide',
    messageRequired: 'Le message est requis',

    // Console logs
    logSendError: "Erreur lors de l'envoi du message de contact:"
  }
};
