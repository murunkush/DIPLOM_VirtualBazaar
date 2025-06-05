const express = require('express');
const router = express.Router();

const {
  getBasket,
  addToBasket,
  removeFromBasket,
  clearBasket
} = require('../controllers/basketController');

const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getBasket)
  .post(protect, addToBasket)
  .delete(protect, clearBasket);

router.route('/:itemId')
  .delete(protect, removeFromBasket);

module.exports = router;
