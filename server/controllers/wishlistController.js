const Wishlist = require('../models/wishlistModel');
const Item = require('../models/itemModel');

// Get wishlist
const getWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('items');
  if (!wishlist) {
    return res.status(404).json({ message: 'Wishlist not found' });
  }
  res.json(wishlist);
};

// Add item to wishlist
const addItemToWishlist = async (req, res) => {
  const { itemId } = req.body;
  const item = await Item.findById(itemId);

  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = new Wishlist({ user: req.user._id, items: [] });
  }

  if (!wishlist.items.includes(itemId)) {
    wishlist.items.push(itemId);
    await wishlist.save();
  }

  res.status(201).json(wishlist);
};

// Remove item from wishlist
const removeItemFromWishlist = async (req, res) => {
  const { itemId } = req.params;
  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    return res.status(404).json({ message: 'Wishlist not found' });
  }

  wishlist.items = wishlist.items.filter(id => id.toString() !== itemId);
  await wishlist.save();

  res.json(wishlist);
};

// Clear wishlist
const clearWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    return res.status(404).json({ message: 'Wishlist not found' });
  }

  wishlist.items = [];
  await wishlist.save();

  res.json({ message: 'Wishlist cleared' });
};

module.exports = {
  getWishlist,
  addItemToWishlist,
  removeItemFromWishlist,
  clearWishlist,
};
