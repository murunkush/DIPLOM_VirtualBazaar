const asyncHandler = require('express-async-handler');
const Dispute = require('../models/disputeModel');
const Order   = require('../models/orderModel');

// 1️⃣ Маргаан үүсгэх
const createDispute = asyncHandler(async (req, res) => {
  const { order: orderId, reason, message } = req.body;
  const order = await Order.findById(orderId);
  if (!order) { res.status(404); throw new Error('Order not found'); }

  // Buyer/Seller/Admin л үүсгэж болно
  if (!['admin', order.buyer.toString(), order.seller.toString()].includes(req.user.role) &&
      req.user.id !== order.buyer.toString() && req.user.id !== order.seller.toString()) {
    res.status(403); throw new Error('No permission');
  }

  // Захиалга статус Disputed болгоно
  order.status = 'Disputed';
  await order.save();

  const dispute = await Dispute.create({
    order:     orderId,
    initiator: req.user.id,
    reason,
    messages:  message ? [{ sender: req.user.id, message }] : []
  });

  res.status(201).json({ message: 'Dispute created', dispute });
});

// 2️⃣ Тухайн order-ийн бүх маргаан
const getOrderDisputes = asyncHandler(async (req, res) => {
  const disputes = await Dispute.find({ order: req.params.orderId })
    .populate('initiator', 'username email')
    .populate('messages.sender', 'username');
  res.json(disputes);
});

// 3️⃣ Бүх маргаан (админ)
const getAllDisputes = asyncHandler(async (req, res) => {
  const disputes = await Dispute.find()
    .populate('order', 'buyer seller status')
    .populate('initiator', 'username email');
  res.json(disputes);
});

// 4️⃣ Албан шийдвэр (админ)
const resolveDispute = asyncHandler(async (req, res) => {
  const { resolution } = req.body; // 'buyer' эсвэл 'seller'
  const d = await Dispute.findById(req.params.id);
  if (!d) { res.status(404); throw new Error('Dispute not found'); }
  if (req.user.role !== 'admin') { res.status(403); throw new Error('No permission'); }
  if (d.status !== 'Open' && d.status !== 'UnderReview') {
    res.status(400); throw new Error('Already resolved');
  }

  d.status = 'Resolved';
  d.resolution = resolution;
  d.resolvedBy = req.user.id;
  d.resolvedAt = Date.now();
  await d.save();

  // order-ийг buyer/seller талд тохируулж ч болно
  const order = await Order.findById(d.order);
  order.status = resolution === 'buyer' ? 'Cancelled' : 'Verified';
  await order.save();

  res.json({ message: 'Dispute resolved', dispute: d });
});

// 5️⃣ Шинэ message нэмэх (хэн ч)
const addDisputeMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const d = await Dispute.findById(req.params.id);
  if (!d) { res.status(404); throw new Error('Dispute not found'); }
  d.messages.push({ sender: req.user.id, message });
  await d.save();
  res.json({ message: 'Message added', dispute: d });
});

module.exports = {
  createDispute,
  getOrderDisputes,
  getAllDisputes,
  resolveDispute,
  addDisputeMessage
};
