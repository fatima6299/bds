/**
 * Author: Fatimata Tidiane Dia
 * Created: December 1, 2025
 * Description: Central locales index - imports all message modules for internationalization
 */

// Fichier centralisé pour importer tous les messages
const authMessages = require('./auth.messages');
const userMessages = require('./user.messages');
const productMessages = require('./product.messages');
const cartMessages = require('./cart.messages');
const orderMessages = require('./order.messages');
const commonMessages = require('./common.messages');
const uploadMessages = require('./upload.messages');
const contactMessages = require('./contact.messages');

module.exports = {
  ...authMessages,
  ...userMessages,
  ...productMessages,
  ...cartMessages,
  ...orderMessages,
  ...commonMessages,
  ...uploadMessages,
  ...contactMessages
};
