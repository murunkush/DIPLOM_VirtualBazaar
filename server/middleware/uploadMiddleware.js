const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads', // Uploads folder
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max 10MB
});

module.exports = upload;
