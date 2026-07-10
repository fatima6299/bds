/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: User SQL queries - all database queries for user operations
 */

// Requêtes SQL pour la gestion des utilisateurs

module.exports = {
  // Création
  createUser: `
    INSERT INTO users (firstname, lastname, email, phone, password, role) 
    VALUES (?, ?, ?, ?, ?, ?)
  `,

  // Lecture
  findByEmail: `SELECT * FROM users WHERE email = ?`,
  
  findByPhone: `SELECT * FROM users WHERE phone = ?`,
  
  findById: `
    SELECT id, firstname, lastname, email, phone, role, created_at 
    FROM users 
    WHERE id = ?
  `,
  
  findByIdWithPassword: `SELECT * FROM users WHERE id = ?`,
  
  findAllUsers: `
    SELECT id, firstname, lastname, email, phone, role, created_at 
    FROM users 
    WHERE role = ?
  `,
  
  findAllAdmins: `
    SELECT id, firstname, lastname, email, phone, role, created_at 
    FROM users 
    WHERE role IN (?, ?)
  `,
  
  findAll: `
    SELECT id, firstname, lastname, email, phone, role, created_at 
    FROM users
  `,

  // Vérifications
  checkEmailExists: `SELECT id FROM users WHERE email = ?`,
  
  checkPhoneExists: `SELECT id FROM users WHERE phone = ?`,

  // Mise à jour
  updateUser: `
    UPDATE users 
    SET firstname = ?, lastname = ?, email = ?, phone = ? 
    WHERE id = ?
  `,
  
  updatePassword: `
    UPDATE users 
    SET password = ? 
    WHERE id = ?
  `,
  
  updateResetToken: `
    UPDATE users 
    SET reset_token = ?, reset_token_expires = ? 
    WHERE id = ?
  `,
  
  findByResetToken: `
    SELECT * FROM users 
    WHERE reset_token = ? AND reset_token_expires > NOW()
  `,
  
  clearResetToken: `
    UPDATE users 
    SET reset_token = NULL, reset_token_expires = NULL 
    WHERE id = ?
  `,

  // Suppression
  deleteUser: `DELETE FROM users WHERE id = ?`
};
