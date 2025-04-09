const express = require('express');
const {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  searchItems,
  getItemsBySeller,
  purchaseItem
} = require('../controllers/itemController');

const { protect, protectAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // ← import

const router = express.Router();

// ✅ Шинэ бараа нэмэх
router.post('/', [upload.single('images'), protect], createItem);

// ✅ Бүх барааг авах
router.get('/', getAllItems);

// ✅ Нэг барааны мэдээлэл авах
router.get('/:id', getItemById);

// ✅ Барааны мэдээлэл шинэчлэх
router.put('/:id', protect, updateItem);

// ✅ Бараа устгах
router.delete('/:id', protect, deleteItem);

// ✅ Тодорхой нөхцлөөр бараа хайх
router.get('/search/:query', searchItems);

// ✅ Хэрэглэгчийн оруулсан бараануудыг авах
router.get('/seller/:sellerId', getItemsBySeller);

// ✅ Бараа худалдаж авах
router.post('/purchase/:id', protect, purchaseItem);

// ✅ Зураг upload хийх route
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
