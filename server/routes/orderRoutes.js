const express = require('express');
const asyncHandler = require('express-async-handler');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  confirmDelivery,
  deleteCancelledOrder,
  moveToEscrow,
  confirmEscrowPayment,
  buyerConfirmEscrowCompletion,
  deliverOrder    // ← импортлов
} = require('../controllers/orderController');
const { protect, protectAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// CRUD
router.post('/',           protect, createOrder);
router.get('/',            protect, getOrders);
router.get('/:id',         protect, getOrderById);

// Статус шинэчлэх
router.put('/:id/status',  protect, updateOrderStatus);
router.put('/:id/cancel',  protect, cancelOrder);
router.put('/:id/confirm', protect, confirmDelivery);

// Хүргэлтийн мэдээлэл илгээх
router.put('/:id/deliver', protect, deliverOrder);

// Устгах (cancelled only)
router.delete(
  '/:id/delete-cancelled',
  protect,
  asyncHandler(async (req, res, next) => {
    const order = await require('../models/orderModel').findById(req.params.id);
    if (!order) { res.status(404); throw new Error('Order not found'); }
    const { id: uid, role } = req.user;
    if (order.buyer.toString() !== uid && order.seller.toString() !== uid && role !== 'admin') {
      res.status(403); throw new Error('No permission');
    }
    next();
  }),
  deleteCancelledOrder
);

// Escrow амьдралын мөчлөг
router.put('/:id/escrow',          protect,      moveToEscrow);
router.put('/:id/escrow/confirm',  protectAdmin, confirmEscrowPayment);
router.put('/:id/escrow/complete', protect,      buyerConfirmEscrowCompletion);

module.exports = router;
