/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: User model - handles user data operations and authentication
 */

const db = require('../../config/db');
const queries = require('../queries').user;

class User {
  // Créer un nouvel utilisateur
  static async create(userData) {
    const { firstname, lastname, email, phone, password, role = 'user' } = userData;
    
    const [result] = await db.query(queries.createUser, [
      firstname, lastname, email, phone, password, role
    ]);
    
    return result.insertId;
  }

  // Trouver un utilisateur par email
  static async findByEmail(email) {
    const [rows] = await db.query(queries.findByEmail, [email]);
    return rows[0];
  }

  // Trouver un utilisateur par téléphone
  static async findByPhone(phone) {
    const [rows] = await db.query(queries.findByPhone, [phone]);
    return rows[0];
  }

  // Trouver un utilisateur par ID
  static async findById(id) {
    const [rows] = await db.query(queries.findById, [id]);
    return rows[0];
  }

  // Trouver un utilisateur par ID avec le mot de passe (pour auth)
  static async findByIdWithPassword(id) {
    const [rows] = await db.query(queries.findByIdWithPassword, [id]);
    return rows[0];
  }

  // Vérifier si un email existe déjà
  static async emailExists(email) {
    const [rows] = await db.query(queries.checkEmailExists, [email]);
    return rows.length > 0;
  }

  // Vérifier si un téléphone existe déjà
  static async phoneExists(phone) {
    const [rows] = await db.query(queries.checkPhoneExists, [phone]);
    return rows.length > 0;
  }

  // Mettre à jour un utilisateur
  static async update(id, userData) {
    const { firstname, lastname, email, phone } = userData;
    
    await db.query(queries.updateUser, [
      firstname, lastname, email, phone, id
    ]);
    
    return this.findById(id);
  }

  // Mettre à jour le mot de passe
  static async updatePassword(id, hashedPassword) {
    await db.query(queries.updatePassword, [hashedPassword, id]);
    return true;
  }

  // Mettre à jour le token de réinitialisation
  static async updateResetToken(id, resetToken, expiresAt) {
    await db.query(queries.updateResetToken, [resetToken, expiresAt, id]);
    return true;
  }

  // Trouver par token de réinitialisation
  static async findByResetToken(resetToken) {
    const [rows] = await db.query(queries.findByResetToken, [resetToken]);
    return rows[0];
  }

  // Supprimer le token de réinitialisation
  static async clearResetToken(id) {
    await db.query(queries.clearResetToken, [id]);
    return true;
  }

  // Supprimer un utilisateur
  static async delete(id) {
    const [result] = await db.query(queries.deleteUser, [id]);
    return result.affectedRows > 0;
  }

  // Récupérer tous les utilisateurs (admin)
  static async findAll() {
    const [rows] = await db.query(queries.findAll);
    return rows;
  }
}

module.exports = User;
