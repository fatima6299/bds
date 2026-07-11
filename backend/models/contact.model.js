/**
 * Author: Fatimata Tidiane Dia
 * Created: December 1, 2025
 * Description: Contact model - handles contact message storage
 */

const db = require('../../config/db');
const queries = require('../queries').contact;

class ContactMessage {
  static async create({ name, email, message }) {
    const [result] = await db.query(queries.createMessage, [name, email, message]);
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await db.query(queries.findAll);
    return rows;
  }
}

module.exports = ContactMessage;
