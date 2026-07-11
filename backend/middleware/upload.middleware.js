/**
 * Author: Fatimata Tidiane Dia
 * Created: December 1, 2025
 * Description: Upload middleware - handles product image uploads (Admin/SuperAdmin only)
 */

const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { upload: uploadMessages } = require('../locales');

const uploadDir = path.join(__dirname, '..', 'uploads', 'products');
fs.mkdirSync(uploadDir, { recursive: true });

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(new Error(uploadMessages.invalidFileType));
  }
  cb(null, true);
};

const multerUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 Mo
}).single('image');

// Middleware pour uploader une image de produit (Admin/SuperAdmin)
const uploadProductImage = (req, res, next) => {
  multerUpload(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      const message = error.code === 'LIMIT_FILE_SIZE' ? uploadMessages.fileTooLarge : error.message;
      return res.status(400).json({ success: false, message });
    }
    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next();
  });
};

module.exports = { uploadProductImage };
