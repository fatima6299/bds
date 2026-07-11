/**
 * Author: Fatimata Tidiane Dia
 * Created: December 1, 2025
 * Description: Central queries index - imports all SQL queries modules
 */

// Fichier centralisé pour importer toutes les requêtes SQL
const userQueries = require('./user.queries');
const productQueries = require('./product.queries');
const cartQueries = require('./cart.queries');
const orderQueries = require('./order.queries');
const contactQueries = require('./contact.queries');

module.exports = {
  user: userQueries,
  product: productQueries,
  cart: cartQueries,
  order: orderQueries,
  contact: contactQueries
};
