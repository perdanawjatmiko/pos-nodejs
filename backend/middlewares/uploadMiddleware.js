const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Fungsi untuk memastikan folder ada, jika tidak maka buat
const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Fungsi untuk membuat konfigurasi storage berdasarkan folder
const createStorage = (subfolder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const fullPath = path.join('uploads', subfolder);
      ensureDirExists(fullPath);
      cb(null, fullPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    },
  });

// Filter hanya izinkan file gambar
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed (jpg, jpeg, png)'));
  }
};

// Inisialisasi uploaders
const uploadDefault = multer({ storage: createStorage(''), fileFilter });
const uploadAvatar = multer({ storage: createStorage('avatars'), fileFilter });
const uploadProduct = multer({ storage: createStorage('products'), fileFilter });

module.exports = {
  uploadDefault,
  uploadAvatar,
  uploadProduct,
};
