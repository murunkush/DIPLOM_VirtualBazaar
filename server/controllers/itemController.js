// itemController.js

const asyncHandler = require('express-async-handler');
const Item = require('../models/itemModel');
const User = require('../models/User');

// ✅ Шинэ бараа нэмэх
const createItem = asyncHandler(async (req, res) => {
  const { name, description, price, game } = req.body;

  // Хэрэв шаардлагатай талбарууд хоосон байвал алдаа өгнө
  if (!name || !game || !price) {
    res.status(400);
    res.json({ message: 'Бүх талбарыг бөглөнө үү' });
    throw new Error('Бүх талбарыг бөглөнө үү');
  }

  // Хэрэглэгчийн id авах (auth middleware-ын дараа)
  const seller = req.user._id; // req.user-г auth middleware-аар нэвтрүүлсэн байх ёстой

  // Зурагнуудаас массив үүсгэх
  console.log('req.files:', req.files);  // req.files-ыг шалгаарай
  const imageUrls = req.files ? req.files.map(file => file.path) : []; // Олон зураг авах

  try {
    // Бараа үүсгэх
    const item = await Item.create({
      name,
      description,
      price,
      game,
      seller,  // seller-ийг хэрэглэгчийн _id-аар нэмэх
      imageUrls,  // Олон зургийн замыг хадгалах
    });

    // Барааг амжилттай үүсгэсний дараа
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: 'Бараа үүсгэхэд алдаа гарлаа', error: error.message });
  }
});

// ✅ Бүх барааг авах
const getAllItems = asyncHandler(async (req, res) => {
  try {
    const items = await Item.find().populate('seller', 'username email');
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Бүх барааг авахад алдаа гарлаа', error: error.message });
  }
});

// ✅ Нэг барааны мэдээлэл авах
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
    .populate('seller', 'username email')
    .exec();
  
  if (!item || !item.seller) {
    return res.status(404).json({ message: 'Бараа эсвэл борлуулагч олдсонгүй' });
  }

    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Алдаа гарлаа', error: err.message });
  }
};

// ✅ Барааны мэдээлэл шинэчлэх
const updateItem = asyncHandler(async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Бараа олдсонгүй' });
    }

    if (item.seller.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Та энэ барааг шинэчлэх эрхгүй' });
    }

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Алдаа гарлаа', error: error.message });
  }
});

// ✅ Бараа устгах
const deleteItem = asyncHandler(async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Бараа олдсонгүй' });
    }

    if (item.seller.toString() === req.user._id.toString() || req.user.isAdmin) {
      await Item.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Барааг устгалаа' });
    } else {
      res.status(403).json({ message: 'Танд эрх байхгүй' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Алдаа гарлаа', error: error.message });
  }
});

// ✅ Хайлт хийх
const searchItems = asyncHandler(async (req, res) => {
  const query = req.params.query;

  try {
    const items = await Item.find({ name: { $regex: query, $options: 'i' } });

    if (items.length) {
      return res.status(200).json(items);
    } else {
      return res.status(404).json({ message: 'Хайлтанд тохирсон бараа олдсонгүй' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Алдаа гарлаа', error: error.message });
  }
});

// ✅ Хэрэглэгчийн бараа авах
const getItemsBySeller = asyncHandler(async (req, res) => {
  const sellerId = req.params.sellerId;

  try {
    const items = await Item.find({ seller: sellerId });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Алдаа гарлаа', error: error.message });
  }
});

// ✅ Бараа худалдаж авах
const purchaseItem = asyncHandler(async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Бараа олдсонгүй' });
    }

    // Escrow төгрөгний системийн хамаарал нэмэх
    res.status(200).json({ message: 'Бараа худалдаж авах хүсэлт илгээгдлээ' });
  } catch (error) {
    res.status(500).json({ message: 'Алдаа гарлаа', error: error.message });
  }
});

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  searchItems,
  getItemsBySeller,
  purchaseItem,
};
