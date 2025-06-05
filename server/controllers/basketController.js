const asyncHandler = require('express-async-handler');
const Basket = require('../models/basketModel');
const Item = require('../models/itemModel');

// Utils
const getOrCreateBasket = async (userId) => {
  let basket = await Basket.findOne({ user: userId });
  if (!basket) {
    basket = new Basket({ user: userId, items: [] });
  }
  return basket;
};

// @desc Get current user's basket
const getBasket = asyncHandler(async (req, res) => {
  const basket = await Basket.findOne({ user: req.user._id }).populate('items.item');
  res.status(200).json(basket || { items: [] });
});

// @desc Add unique item to basket
const addToBasket = asyncHandler(async (req, res) => {
  const { itemId } = req.body;

  const item = await Item.findById(itemId);
  if (!item) {
    res.status(404);
    throw new Error('Бараа олдсонгүй');
  }

  const basket = await getOrCreateBasket(req.user._id);

  const alreadyExists = basket.items.some(i => i.item.toString() === itemId);
  if (alreadyExists) {
    res.status(400);
    throw new Error('Энэ бараа аль хэдийн сагсанд орсон байна');
  }

  basket.items.push({ item: itemId });
  
  // Амжилттай нэмэхээс өмнө console.log ашиглан шалгах
  console.log('Updated Basket:', basket);

  await basket.save();
  const populated = await basket.populate('items.item');

  // Console log, амжилттай хадгалаад дараа буцаах өгөгдөл
  console.log('Populated Basket:', populated);

  res.status(201).json(populated);
});

// @desc Remove a specific item from basket
const removeFromBasket = asyncHandler(async (req, res) => {
  const basket = await Basket.findOne({ user: req.user._id });

  if (!basket) {
    res.status(404);
    throw new Error('Сагс олдсонгүй');
  }

  const initialLength = basket.items.length;
  basket.items = basket.items.filter(i => i.item.toString() !== req.params.itemId);

  if (basket.items.length === initialLength) {
    res.status(404);
    throw new Error('Тухайн бараа сагсанд байхгүй');
  }

  await basket.save();
  const populated = await basket.populate('items.item');
  res.json(populated);
});

// @desc Clear all items from basket
const clearBasket = asyncHandler(async (req, res) => {
  const deleted = await Basket.findOneAndDelete({ user: req.user._id });
  res.status(200).json({ message: 'Сагсыг цэвэрлэв', deleted });
});

module.exports = {
  getBasket,
  addToBasket,
  removeFromBasket,
  clearBasket
};
