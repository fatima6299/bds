/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: Contact message SQL queries
 */

module.exports = {
  createMessage: `
    INSERT INTO contact_messages (name, email, message)
    VALUES (?, ?, ?)
  `,

  findAll: `
    SELECT * FROM contact_messages
    ORDER BY created_at DESC
  `
};
