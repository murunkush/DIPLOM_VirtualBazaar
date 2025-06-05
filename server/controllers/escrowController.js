// controllers/escrowController.js
const asyncHandler = require('express-async-handler');
const Escrow = require('../models/escrowModel');
const Item   = require('../models/itemModel');

// 1️⃣ Escrow үүсгэх (Buyer)
exports.createEscrow = asyncHandler(async (req, res) => {
  const buyerId = req.user.id;
  const { itemId } = req.body;

  const item = await Item.findById(itemId);
  if (!item) {
    res.status(404);
    throw new Error('Бараа олдсонгүй');
  }

  const escrow = await Escrow.create({
    buyer: buyerId,
    seller: item.seller,
    item: item._id,
    amount: item.price,
    status: 'pending',
    paymentDate: new Date(),
  });

  res.status(201).json({ message: 'Escrow үүсгэгдлээ', escrow });
});

// 2️⃣ Escrow баталгаажуулах (Admin)
exports.confirmEscrow = asyncHandler(async (req, res) => {
  const escrow = await Escrow.findById(req.params.id);
  if (!escrow) {
    res.status(404);
    throw new Error('Escrow олдсонгүй');
  }

  escrow.status = 'confirmed';
  escrow.confirmationDate = new Date();
  await escrow.save();

  res.json({ message: 'Escrow баталгаажлаа', escrow });
});

// 3️⃣ Escrow гүйцэтгэх (Buyer)
exports.completeEscrow = asyncHandler(async (req, res) => {
  const escrow = await Escrow.findById(req.params.id);
  if (!escrow) {
    res.status(404);
    throw new Error('Escrow олдсонгүй');
  }

  escrow.status = 'completed';
  escrow.completionDate = new Date();
  await escrow.save();

  res.json({ message: 'Escrow амжилттай дууслаа', escrow });
});

// 4️⃣ Escrow-д маргаан үүсгэх (Buyer)
exports.disputeEscrow = asyncHandler(async (req, res) => {
  const escrow = await Escrow.findById(req.params.id);
  if (!escrow) {
    res.status(404);
    throw new Error('Escrow олдсонгүй');
  }

  escrow.status = 'disputed';
  escrow.disputeReason = req.body.reason || '';
  await escrow.save();

  res.json({ message: 'Маргаан эхэллээ', escrow });
});
