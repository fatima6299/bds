/**
 * Author: Fatimata Tidiane Dia
 * Created: December 1, 2025
 * Description: Upload controller - handles product image upload responses
 */

const { upload } = require('../locales');

// Téléverser une image de produit (Admin/SuperAdmin)
exports.uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: upload.fileRequired
      });
    }

    res.status(201).json({
      success: true,
      message: upload.uploadSuccess,
      url: `${req.protocol}://${req.get('host')}/uploads/products/${req.file.filename}`
    });
  } catch (error) {
    console.error(upload.logUploadError, error);
    res.status(500).json({
      success: false,
      message: upload.uploadError
    });
  }
};
