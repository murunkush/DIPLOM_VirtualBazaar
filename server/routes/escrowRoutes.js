const express = require('express')
const { protect, protectAdmin } = require('../middleware/authMiddleware')
const {
  createEscrow,
  confirmEscrow,
  completeEscrow,
  disputeEscrow
} = require('../controllers/escrowController')

const router = express.Router()

// Buyer үүсгэх
router.post(   '/',         protect, createEscrow)
// Admin баталгаажуулах
router.put(    '/:id',      protectAdmin, confirmEscrow)
// Buyer гүйцэтгэх
router.put(    '/:id/complete', protect, completeEscrow)
// Buyer маргаан үүсгэх
router.post(   '/:id/dispute',   protect, disputeEscrow)

module.exports = router
