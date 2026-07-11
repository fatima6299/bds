/**
 * Author: Fatimata Tidiane Dia
 * Created: December 1, 2025
 * Description: Authentication controller - handles user registration, login, logout, password management
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user.model');
const { auth } = require('../locales');
const { revokeToken } = require('../utils/tokenBlacklist');

// Inscription d'un nouvel utilisateur (toujours avec role 'user')
exports.register = async (req, res) => {
  try {
    const { firstname, lastname, email, phone, password } = req.body;

    // Vérifier si l'email existe déjà
    if (email && await User.emailExists(email)) {
      return res.status(400).json({ 
        success: false, 
        message: auth.emailAlreadyExists 
      });
    }

    // Vérifier si le téléphone existe déjà
    if (phone && await User.phoneExists(phone)) {
      return res.status(400).json({ 
        success: false, 
        message: auth.phoneAlreadyExists 
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur avec le rôle 'user' par défaut
    const userId = await User.create({
      firstname,
      lastname,
      email,
      phone,
      password: hashedPassword,
      role: 'user' // Toujours 'user' pour l'inscription publique
    });

    res.status(201).json({
      success: true,
      message: auth.registerSuccess,
      userId
    });
  } catch (error) {
    console.error(auth.logRegisterError, error);
    res.status(500).json({ 
      success: false, 
      message: auth.registerError 
    });
  }
};

// Créer un utilisateur admin (réservé aux admins uniquement)
exports.createAdmin = async (req, res) => {
  try {
    const { firstname, lastname, email, phone, password } = req.body;

    // Vérifier si l'email existe déjà
    if (email && await User.emailExists(email)) {
      return res.status(400).json({ 
        success: false, 
        message: auth.emailAlreadyExists 
      });
    }

    // Vérifier si le téléphone existe déjà
    if (phone && await User.phoneExists(phone)) {
      return res.status(400).json({ 
        success: false, 
        message: auth.phoneAlreadyExists 
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur avec le rôle 'admin'
    const userId = await User.create({
      firstname,
      lastname,
      email,
      phone,
      password: hashedPassword,
      role: 'admin'
    });

    res.status(201).json({
      success: true,
      message: auth.adminCreatedSuccess,
      userId
    });
  } catch (error) {
    console.error(auth.logCreateAdminError, error);
    res.status(500).json({ 
      success: false, 
      message: auth.createAdminError 
    });
  }
};

// Connexion d'un utilisateur
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier = email ou phone

    // Chercher l'utilisateur par email ou téléphone
    let user;
    if (identifier.includes('@')) {
      user = await User.findByEmail(identifier);
    } else {
      user = await User.findByPhone(identifier);
    }

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: auth.invalidCredentials 
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: auth.invalidCredentials 
      });
    }

    // Générer le token JWT avec expiration plus courte
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' } // Token expire dans 2 heures
    );

    res.json({
      success: true,
      message: auth.loginSuccess,
      token,
      expiresIn: '2h', // Informe le client de l'expiration
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error(auth.logLoginError, error);
    res.status(500).json({ 
      success: false, 
      message: auth.loginError 
    });
  }
};

// Obtenir le profil de l'utilisateur connecté
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: auth.userNotFound 
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error(auth.logProfileError, error);
    res.status(500).json({ 
      success: false, 
      message: auth.profileError 
    });
  }
};

// Changer son mot de passe (utilisateur connecté)
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { current_password, new_password } = req.body;

    // Récupérer l'utilisateur avec son mot de passe
    const user = await User.findByIdWithPassword(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: auth.userNotFound
      });
    }

    // Vérifier que le mot de passe actuel est correct
    const isPasswordValid = await bcrypt.compare(current_password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: auth.currentPasswordIncorrect
      });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Mettre à jour le mot de passe
    await User.updatePassword(userId, hashedPassword);

    res.json({
      success: true,
      message: auth.passwordChangedSuccess
    });
  } catch (error) {
    console.error(auth.logChangePasswordError, error);
    res.status(500).json({
      success: false,
      message: auth.changePasswordError
    });
  }
};

// Demander la réinitialisation du mot de passe
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Vérifier que l'utilisateur existe
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: auth.userNotFound
      });
    }

    // Générer un token de réinitialisation (6 chiffres)
    const resetToken = crypto.randomInt(100000, 999999).toString();
    
    // Token expire dans 1 heure
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Enregistrer le token en base
    await User.updateResetToken(user.id, resetToken, expiresAt);

    // En production, vous enverriez un email ici
    // Pour les tests, on retourne le token
    res.json({
      success: true,
      message: auth.resetTokenSentSuccess,
      resetToken // À SUPPRIMER en production !
    });
  } catch (error) {
    console.error(auth.logResetTokenError, error);
    res.status(500).json({
      success: false,
      message: auth.resetTokenError
    });
  }
};

// Réinitialiser le mot de passe avec le token
exports.resetPassword = async (req, res) => {
  try {
    const { reset_token, new_password } = req.body;

    // Vérifier que le token existe et n'est pas expiré
    const user = await User.findByResetToken(reset_token);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: auth.invalidResetToken
      });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Mettre à jour le mot de passe et supprimer le token
    await User.updatePassword(user.id, hashedPassword);
    await User.clearResetToken(user.id);

    res.json({
      success: true,
      message: auth.passwordResetSuccess
    });
  } catch (error) {
    console.error(auth.logResetPasswordError, error);
    res.status(500).json({
      success: false,
      message: auth.resetPasswordError
    });
  }
};

// Mettre à jour son profil (utilisateur connecté)
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstname, lastname, email, phone } = req.body;

    // Vérifier que l'utilisateur existe
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: auth.userNotFound
      });
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email && email !== existingUser.email) {
      const emailExists = await User.emailExists(email);
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: auth.emailAlreadyExists
        });
      }
    }

    // Vérifier si le téléphone est déjà utilisé par un autre utilisateur
    if (phone && phone !== existingUser.phone) {
      const phoneExists = await User.phoneExists(phone);
      if (phoneExists) {
        return res.status(400).json({
          success: false,
          message: auth.phoneAlreadyExists
        });
      }
    }

    // Mettre à jour le profil
    const updatedUser = await User.update(userId, {
      firstname: firstname || existingUser.firstname,
      lastname: lastname || existingUser.lastname,
      email: email || existingUser.email,
      phone: phone || existingUser.phone
    });

    res.json({
      success: true,
      message: auth.profileUpdatedSuccess,
      user: updatedUser
    });
  } catch (error) {
    console.error(auth.logUpdateProfileError, error);
    res.status(500).json({
      success: false,
      message: auth.updateProfileError
    });
  }
};

// Déconnexion (révoque le token)
exports.logout = async (req, res) => {
  try {
    const token = req.token; // Récupéré du middleware verifyToken

    if (token) {
      // Ajouter le token à la blacklist
      revokeToken(token);
      console.log('🔒 Token révoqué pour l\'utilisateur:', req.user.id);
    }

    res.json({
      success: true,
      message: auth.logoutSuccess
    });
  } catch (error) {
    console.error('❌ Erreur lors de la déconnexion:', error);
    res.status(500).json({
      success: false,
      message: auth.logoutError
    });
  }
};
