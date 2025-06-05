const express = require('express')
const {
  createDispute,
  getOrderDisputes,
  getAllDisputes,
  resolveDispute,
  addDisputeMessage
} = require('../controllers/disputeController')
const { protect, protectAdmin } = require('../middleware/authMiddleware')

const router = express.Router()

// Маргаан үүсгэх
router.post(    '/',               protect, createDispute)
// Тухайн order-ийн маргаанууд
router.get(     '/order/:orderId', protect, getOrderDisputes)
// Бүх маргаан (админ)
router.get(     '/',               protectAdmin, getAllDisputes)
// Албан шийдвэр (админ)
router.put(     '/:id/resolve',    protectAdmin, resolveDispute)
// Шинэ message нэмэх
router.put(     '/:id/message',    protect, addDisputeMessage)

module.exports = router
