/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: Admin creation script - creates the first super administrator
 */

const bcrypt = require('bcryptjs');
const db = require('./db');
require('dotenv').config();

async function createFirstAdmin() {
  try {
    console.log('🔧 Création du premier super administrateur...\n');

    // Données du premier admin (à personnaliser)
    const adminData = {
      firstname: 'Super',
      lastname: 'Admin',
      email: 'superadmin@bds.com',
      phone: '+221770000000',
      password: 'SuperAdmin123', // À changer après première connexion
      role: 'superadmin'
    };

    // Vérifier si un superadmin existe déjà
    const [existingAdmins] = await db.query(
      'SELECT id FROM users WHERE role = ? LIMIT 1',
      ['superadmin']
    );

    if (existingAdmins.length > 0) {
      console.log('⚠️  Un super administrateur existe déjà dans la base de données.');
      console.log('❌ Création annulée pour éviter les doublons.\n');
      process.exit(0);
    }

    // Vérifier si l'email existe
    const [emailCheck] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [adminData.email]
    );

    if (emailCheck.length > 0) {
      console.log(`❌ L'email ${adminData.email} est déjà utilisé.`);
      console.log('Veuillez modifier l\'email dans le script.\n');
      process.exit(1);
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Créer l'admin
    const [result] = await db.query(
      `INSERT INTO users (firstname, lastname, email, phone, password, role) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        adminData.firstname,
        adminData.lastname,
        adminData.email,
        adminData.phone,
        hashedPassword,
        adminData.role
      ]
    );

    console.log('✅ Premier super administrateur créé avec succès !\n');
    console.log('📋 Informations de connexion :');
    console.log('   Email    :', adminData.email);
    console.log('   Password :', adminData.password);
    console.log('   Role     :', adminData.role);
    console.log('\n⚠️  IMPORTANT : Changez le mot de passe après la première connexion !\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error.message);
    process.exit(1);
  }
}

createFirstAdmin();
