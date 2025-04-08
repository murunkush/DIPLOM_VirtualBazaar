const asyncHandler = require('express-async-handler');
const Item = require('../models/itemModel');

// ✅ Шинэ бараа нэмэх
const createItem = asyncHandler(async (req, res) => {
  const { name, description, price, game, seller, imageUrl } = req.body;

  if (!name || !game || !price || !seller) {
    res.status(400);
    throw new Error('Бүх талбарыг бөглөнө үү');
  }

  try {
    const item = await Item.create({
      name,
      description,
      price,
      game,
      seller,
      imageUrl,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: 'Бараа үүсгэхэд алдаа гарлаа', error: error.message });
  }
});

// ✅ Бүх барааг авах
const getAllItems = asyncHandler(async (req, res) => {
  try {
    const items = await Item.find();
    if (items.length === 0) {
      res.status(404).json({ message: 'Бараа олдсонгүй' });
      return;
    }
    res.status(200).json(items);
  } catch (error) {
    res.status(400).json({ message: 'Барааг авахад алдаа гарлаа', error: error.message });
  }
});

// ✅ Нэг барааны мэдээлэл авах
const getItemById = asyncHandler(async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      res.status(404).json({ message: 'Бараа олдсонгүй' });
      return;
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ message: 'Бараа авахад алдаа гарлаа', error: error.message });
  }
});

// ✅ Барааны мэдээлэл шинэчлэх
const updateItem = asyncHandler(async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      res.status(404).json({ message: 'Бараа олдсонгүй' });
      return;
    }

    if (item.seller.toString() !== req.user.id) {
      res.status(401).json({ message: 'Та энэ барааг шинэчлэх эрхгүй' });
      return;
    }

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: 'Бараа шинэчлэхэд алдаа гарлаа', error: error.message });
  }
});

// ✅ Бараа устгах
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Бараа олдсонгүй' });
    }

    // Хэрэглэгч өөрийн нэмсэн барааг устгах боломжтой
    if (item.seller.toString() === req.user._id.toString() || req.user.isAdmin) {
      await Item.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Барааг амжилттай устгалаа' });
    } else {
      res.status(403).json({ message: 'Танд энэ барааг устгах эрх байхгүй' });
    }
  } catch (err) {
    console.error(err);  // Алдааг хэвлэнэ
    res.status(500).json({
      message: 'Барааг устгахад алдаа гарлаа',
      error: err.message || err, // Алдааны мэдээллийг илүү тодорхой оруулах
    });
  }
};

// ✅ Тодорхой нөхцлөөр бараа хайх
const searchItems = async (req, res) => {
  const query = req.params.query; // Хэрэглэгчийн хайх үг

  try {
    // Баримт дээр `name` талбараар хайлт хийх
    const items = await Item.find({ name: { $regex: query, $options: 'i' } });

    if (items.length > 0) {
      res.status(200).json(items);
    } else {
      res.status(404).json({ message: 'Хайлтанд тохирсон бараа олдсонгүй' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Бараа хайхад алдаа гарлаа', error: err });
  }
};

// ✅ Хэрэглэгчийн оруулсан бараануудыг авах
const getItemsBySeller = asyncHandler(async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const items = await Item.find({ seller: sellerId });

    res.status(200).json(items);
  } catch (error) {
    res.status(400).json({ message: 'Барааг авахад алдаа гарлаа', error: error.message });
  }
});

// ✅ Бараа худалдаж авах (Escrow системтэй холбох)
const purchaseItem = asyncHandler(async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      res.status(404).json({ message: 'Бараа олдсонгүй' });
      return;
    }

    // Энд Escrow төлбөрийн системтэй холбох логик бичих ёстой
    res.status(200).json({ message: 'Бараа худалдаж авах хүсэлт илгээгдлээ' });
  } catch (error) {
    res.status(400).json({ message: 'Бараа худалдаж авахад алдаа гарлаа', error: error.message });
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
