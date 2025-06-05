const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');

// 1️⃣ Create Order
const createOrder = asyncHandler(async (req, res) => {
  const { seller, item, price } = req.body;
  const buyer = req.user.id;
  const newOrder = new Order({ buyer, seller, item, price });
  const created = await newOrder.save();
  res.status(201).json({ message: 'Order created', order: created });
});

// 2️⃣ Get Orders
const getOrders = asyncHandler(async (req, res) => {
  const { id: userId, role } = req.user;
  const filter = role === 'admin'
    ? {}
    : { $or: [{ buyer: userId }, { seller: userId }] };
  const orders = await Order.find(filter)
    .populate('buyer',  'username email')
    .populate('seller', 'username email')
    .populate('item');
  res.json(orders);
});

// 3️⃣ Get Order By ID
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('buyer',  'username email')
    .populate('seller', 'username email')
    .populate('item');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  const { id: userId, role } = req.user;
  if (role !== 'admin' &&
      order.buyer._id.toString() !== userId &&
      order.seller._id.toString() !== userId) {
    res.status(403);
    throw new Error('No permission');
  }
  res.json(order);
});

// 4️⃣ Update Status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  const { id: userId, role } = req.user;
  const { status: newStatus, note } = req.body;

  const isBuyer = order.buyer.toString() === userId;
  const buyerCanPending = newStatus === 'PendingPayment' && isBuyer;
  const buyerCanPaid    = newStatus === 'Paid'           && isBuyer;
  const sellerOrAdmin   = order.seller.toString() === userId || role === 'admin';

  if (!buyerCanPending && !buyerCanPaid && !sellerOrAdmin) {
    res.status(403);
    throw new Error('No permission');
  }

  if (!order.logs) order.logs = [];
  const old = order.status;
  order.status = newStatus;
  order.logs.push({
    actor: userId,
    from:  old,
    to:    newStatus,
    note:  note || ''
  });

  await order.save();
  res.json({ message: 'Status updated', order });
});

// 5️⃣ Cancel Order
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  const { id: userId, role } = req.user;
  if (order.buyer.toString() !== userId && role !== 'admin') {
    res.status(403);
    throw new Error('No permission');
  }
  const old = order.status;
  order.status = 'Cancelled';
  order.logs.push({ actor: userId, from: old, to: 'Cancelled', note: 'Order cancelled' });
  await order.save();
  res.json({ message: 'Order cancelled', order });
});

// 6️⃣ Confirm Delivery (Verified)
const confirmDelivery = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  const { id: userId, role } = req.user;
  if (order.buyer.toString() !== userId && role !== 'admin') {
    res.status(403);
    throw new Error('No permission');
  }
  const old = order.status;
  order.status = 'Verified';
  order.logs.push({ actor: userId, from: old, to: 'Verified', note: 'Delivery verified' });
  await order.save();
  res.json({ message: 'Delivery confirmed', order });
});

// 🔸 Deliver Order (Seller sets deliveryInfo)
const deliverOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  const { id: userId, role } = req.user;
  if (order.seller.toString() !== userId && role !== 'admin') {
    res.status(403);
    throw new Error('No permission to deliver');
  }
  const { deliveryInfo } = req.body;
  if (!deliveryInfo) {
    res.status(400);
    throw new Error('Delivery info required');
  }
  const old = order.status;
  order.deliveryInfo = deliveryInfo;
  order.status = 'Delivered';
  order.logs.push({ actor: userId, from: old, to: 'Delivered', note: deliveryInfo });
  const updated = await order.save();
  res.json({ message: 'Delivery info saved', order: updated });
});

// 7️⃣ Delete Cancelled
const deleteCancelledOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  const { id: userId, role } = req.user;
  if (order.buyer.toString() !== userId &&
      order.seller.toString() !== userId &&
      role !== 'admin') {
    res.status(403);
    throw new Error('No permission');
  }
  if (order.status !== 'Cancelled') {
    res.status(400);
    throw new Error('Only cancelled orders can be deleted');
  }
  await Order.findByIdAndDelete(req.params.id);
  res.json({ message: 'Order deleted' });
});

// 8️⃣ Move to Escrow
const moveToEscrow = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  const { id: userId, role } = req.user;
  if (![order.buyer.toString(), order.seller.toString()].includes(userId) && role !== 'admin') {
    res.status(403);
    throw new Error('No permission');
  }
  if (order.status !== 'Paid') {
    res.status(400);
    throw new Error('Must be Paid first');
  }
  const old = order.status;
  order.status = 'EscrowPending';
  order.logs.push({ actor: userId, from: old, to: 'EscrowPending', note: 'Moved to escrow' });
  await order.save();
  res.json({ message: 'Moved to escrow', order });
});

// 9️⃣ Confirm Escrow Payment
const confirmEscrowPayment = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  const { id: userId, role } = req.user;
  if (order.seller.toString() !== userId && role !== 'admin') {
    res.status(403);
    throw new Error('No permission');
  }
  if (order.status !== 'EscrowPending') {
    res.status(400);
    throw new Error('Must be in EscrowPending');
  }
  const old = order.status;
  order.status = 'EscrowConfirmed';
  order.logs.push({ actor: userId, from: old, to: 'EscrowConfirmed', note: 'Escrow confirmed' });
  await order.save();
  res.json({ message: 'Escrow confirmed', order });
});

// 🔟 Buyer Confirm Escrow Completion
const buyerConfirmEscrowCompletion = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  const { id: userId, role } = req.user;
  if (order.buyer.toString() !== userId && role !== 'admin') {
    res.status(403);
    throw new Error('No permission');
  }
  if (order.status !== 'EscrowConfirmed') {
    res.status(400);
    throw new Error('Must be EscrowConfirmed');
  }
  const old = order.status;
  order.status = 'EscrowCompleted';
  order.logs.push({ actor: userId, from: old, to: 'EscrowCompleted', note: 'Escrow completed' });
  await order.save();
  res.json({ message: 'Escrow completed', order });
});

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  confirmDelivery,
  deliverOrder,
  deleteCancelledOrder,
  moveToEscrow,
  confirmEscrowPayment,
  buyerConfirmEscrowCompletion
};
