const express = require('express');
const {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  searchItems,
  getItemsBySeller,
  purchaseItem,
} = require('../controllers/itemController');

const { protect, protectAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Multer middleware

const router = express.Router();
// ✅ Тодорхой нөхцлөөр бараа хайх
router.get('/search/:query', searchItems);

// ✅ Шинэ бараа нэмэх (олон зурагтай)
router.post('/', [upload.array('images', 5), protect], createItem);

// ✅ Бүх барааг авах
router.get('/', getAllItems);

// ✅ Нэг барааны мэдээлэл авах
router.get('/:id', getItemById);

// ✅ Барааны мэдээлэл шинэчлэх
router.put('/:id', protect, updateItem);

// ✅ Бараа устгах
router.delete('/:id', protect, deleteItem);

// ✅ Хэрэглэгчийн оруулсан бараануудыг авах
router.get('/seller/:sellerId', getItemsBySeller);

// ✅ Бараа худалдаж авах
router.post('/purchase/:id', protect, purchaseItem);

// ✅ Зураг upload хийх тусдаа route (хэрвээ шаардлагатай бол)
router.post('/upload-images', upload.array('images', 5), (req, res) => {
  try {
    const files = req.files;
    const imagePaths = files.map(file => `/uploads/${file.filename}`);
    res.status(200).json({ success: true, imagePaths });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
