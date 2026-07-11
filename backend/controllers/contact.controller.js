/**
 * Author: Fatimata Tidiane Dia
 * Created: December 1, 2025
 * Description: Contact controller - handles contact form submissions
 */

const ContactMessage = require('../models/contact.model');
const { contact } = require('../locales');

// Envoyer un message de contact (Public)
exports.sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    await ContactMessage.create({ name, email, message });

    res.status(201).json({
      success: true,
      message: contact.messageSentSuccess
    });
  } catch (error) {
    console.error(contact.logSendError, error);
    res.status(500).json({
      success: false,
      message: contact.sendMessageError
    });
  }
};

// Récupérer tous les messages de contact (Admin/SuperAdmin)
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.findAll();

    res.json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    console.error(contact.logSendError, error);
    res.status(500).json({
      success: false,
      message: contact.retrieveMessagesError
    });
  }
};
