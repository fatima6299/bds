/**
 * Author: Saliou Samba DIAO
 * Created: December 1, 2025
 * Description: User controller - handles user management operations for admins
 */

const User = require('../models/user.model');
const { user } = require('../locales');
const queries = require('../queries').user;
const db = require('../../config/db');

// Récupérer tous les utilisateurs (role: user) - Admin et SuperAdmin
exports.getAllUsers = async (req, res) => {
  try {
    // Récupérer tous les utilisateurs et filtrer seulement les users
    const allUsers = await User.findAll();
    const users = allUsers.filter(u => u.role === 'user');

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ 
      success: false, 
      message: user.retrieveUsersError 
    });
  }
};

// Récupérer tous les admins - SuperAdmin uniquement
exports.getAllAdmins = async (req, res) => {
  try {
    // Récupérer tous les utilisateurs et filtrer les admins
    const allUsers = await User.findAll();
    const admins = allUsers.filter(u => u.role === 'admin' || u.role === 'superadmin');

    res.json({
      success: true,
      count: admins.length,
      admins
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des administrateurs:', error);
    res.status(500).json({ 
      success: false, 
      message: user.retrieveAdministratorsError 
    });
  }
};

// Récupérer un utilisateur par ID - Admin et SuperAdmin
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const foundUser = await User.findById(id);

    if (!foundUser) {
      return res.status(404).json({ 
        success: false, 
        message: user.userNotFound 
      });
    }

    res.json({
      success: true,
      user: foundUser
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({ 
      success: false, 
      message: user.retrieveUserError 
    });
  }
};

// Mettre à jour un utilisateur - Admin et SuperAdmin
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, email, phone } = req.body;

    // Vérifier que l'utilisateur existe
    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return res.status(404).json({ 
        success: false, 
        message: user.userNotFound 
      });
    }

    // Vérifier le rôle de l'utilisateur cible
    if (userToUpdate.role === 'admin' || userToUpdate.role === 'superadmin') {
      // Seul un superadmin peut modifier un admin ou superadmin
      if (req.user.role !== 'superadmin') {
        return res.status(403).json({ 
          success: false, 
          message: user.cannotModifyAdminInfo 
        });
      }
    }

    // Vérifier si l'email est déjà utilisé
    if (email && email !== userToUpdate.email) {
      const emailExists = await User.emailExists(email);
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: auth.emailAlreadyExists
        });
      }
    }

    // Vérifier si le téléphone est déjà utilisé
    if (phone && phone !== userToUpdate.phone) {
      const phoneExists = await User.phoneExists(phone);
      if (phoneExists) {
        return res.status(400).json({
          success: false,
          message: auth.phoneAlreadyExists
        });
      }
    }

    const updatedUser = await User.update(id, {
      firstname: firstname || userToUpdate.firstname,
      lastname: lastname || userToUpdate.lastname,
      email: email || userToUpdate.email,
      phone: phone || userToUpdate.phone
    });

    res.json({
      success: true,
      message: user.userUpdatedSuccess,
      user: updatedUser
    });
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({ 
      success: false, 
      message: user.updateUserError 
    });
  }
};

// Supprimer un utilisateur - Admin et SuperAdmin
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que l'utilisateur existe
    const userToDelete = await User.findById(id);
    if (!userToDelete) {
      return res.status(404).json({ 
        success: false, 
        message: user.userNotFound 
      });
    }

    // Protection: Un superadmin ne peut pas se supprimer lui-même
    if (userToDelete.role === 'superadmin' && req.user.id === parseInt(id)) {
      return res.status(403).json({ 
        success: false, 
        message: user.cannotDeleteYourself 
      });
    }

    // Protection: Un superadmin ne peut pas supprimer un autre superadmin
    if (userToDelete.role === 'superadmin' && req.user.role === 'superadmin') {
      return res.status(403).json({ 
        success: false, 
        message: user.cannotDeleteSuperAdmin 
      });
    }

    // Vérifier le rôle de l'utilisateur cible
    if (userToDelete.role === 'admin' || userToDelete.role === 'superadmin') {
      // Seul un superadmin peut supprimer un admin
      if (req.user.role !== 'superadmin') {
        return res.status(403).json({ 
          success: false, 
          message: user.onlySuperAdminCanDeleteAdmin 
        });
      }
    }

    await User.delete(id);

    res.json({ 
      success: true, 
      message: user.userDeletedSuccess 
    });
  } catch (error) {
    console.error('❌ Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({ 
      success: false, 
      message: user.deleteUserError 
    });
  }
};
