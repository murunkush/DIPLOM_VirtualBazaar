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

const router = express.Router();

// ✅ Шинэ бараа нэмэх
router.post('/', protect, createItem);

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
