const express = require('express');
const {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  confirmDelivery
} = require('../controllers/orderController');
const { protect, protectAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

//  Захиалга үүсгэх
router.post('/', protect, createOrder);

//  Бүх захиалгуудыг авах (Админ эрхтэй хэрэглэгчдэд)
router.get('/', protect, protectAdmin, getAllOrders);

//  Нэг захиалгын мэдээлэл авах
router.get('/:id', protect, getOrderById);

//  Захиалгын төлөв шинэчлэх
router.put('/:id/status', protect, updateOrderStatus);

//  Захиалга цуцлах
router.put('/:id/cancel', protect, cancelOrder);

//  Захиалга амжилттай дууссан гэж баталгаажуулах
router.put('/:id/confirm', protect, confirmDelivery);

module.exports = router;
