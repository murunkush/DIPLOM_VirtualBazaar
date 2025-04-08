const express = require('express');
const multer = require('multer');  // Multer-ийг импортолсон
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

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Файл хадгалах газар
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);  // Уникаль нэртэйгээр хадгална
  }
});

// `upload` объект үүсгэж Multer тохиргоог хэрэгжүүлсэн
const upload = multer({ storage });

// ✅ Шинэ бараа нэмэх
router.post('/', upload.array('images', 5), createItem);

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

// ✅ Бараа худалдаж авах (Escrow системтэй холбох)
router.post('/purchase/:id', protect, purchaseItem);

module.exports = router;
