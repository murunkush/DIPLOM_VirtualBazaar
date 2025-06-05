const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getWishlist,
  addItemToWishlist,
  removeItemFromWishlist,
  clearWishlist,
} = require('../controllers/wishlistController');

router.route('/')
  .get(protect, getWishlist)
  .post(protect, addItemToWishlist)
  .delete(protect, clearWishlist);

router.route('/:itemId')
  .delete(protect, removeItemFromWishlist);

module.exports = router;
