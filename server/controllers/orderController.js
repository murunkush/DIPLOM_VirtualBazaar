const Order = require('../models/orderModel');

//  Захиалга үүсгэх
const createOrder = async (req, res) => {
  try {
    const { seller, item, price } = req.body;
    const buyer = req.user.id; // Token-аас buyer-г авах

    const newOrder = new Order({ buyer, seller, item, price });
    await newOrder.save();

    res.status(201).json({ message: 'Захиалга амжилттай үүсгэлээ', order: newOrder });
  } catch (error) {
    res.status(400).json({ message: 'Захиалга үүсгэхэд алдаа гарлаа', error });
  }
};

// Тухайн ID-тай захиалгыг авах
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('buyer seller item');
    
    if (!order) {
      return res.status(404).json({ message: 'Захиалга олдсонгүй' });
    }

    // Захиалга зөвхөн хэрэглэгчийнх эсвэл админы хувьд авах
    if (order.buyer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Танд энэ захиалгыг үзэх эрх байхгүй' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: 'Захиалга авахад алдаа гарлаа', error });
  }
};

// Бүх захиалгуудыг авах (Админ)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('buyer seller item');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Захиалгуудыг авахад алдаа гарлаа', error });
  }
};

//  Захиалгын төлөв шинэчлэх
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Захиалга олдсонгүй' });
    }

    if (order.buyer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Танд энэ захиалгыг шинэчлэх эрх байхгүй' });
    }

    order.status = req.body.status || order.status;
    await order.save();

    res.status(200).json({ message: 'Захиалгын төлөв шинэчлэгдлээ', order });
  } catch (error) {
    res.status(400).json({ message: 'Захиалгын төлөв шинэчлэхэд алдаа гарлаа', error });
  }
};

//  Захиалгыг цуцлах
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Захиалга олдсонгүй' });
    }

    if (order.buyer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Танд энэ захиалгыг цуцлах эрх байхгүй' });
    }

    order.status = 'Cancelled';
    await order.save();

    res.status(200).json({ message: 'Захиалга цуцлагдлаа', order });
  } catch (error) {
    res.status(400).json({ message: 'Захиалгыг цуцлахад алдаа гарлаа', error });
  }
};

//  Захиалга амжилттай дууссан гэж баталгаажуулах
const confirmDelivery = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Захиалга олдсонгүй' });
    }

    if (order.buyer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Танд энэ захиалгыг баталгаажуулах эрх байхгүй' });
    }

    order.status = 'Completed';
    await order.save();

    res.status(200).json({ message: 'Захиалга амжилттай дууслаа', order });
  } catch (error) {
    res.status(400).json({ message: 'Захиалга дуусгах үед алдаа гарлаа', error });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  confirmDelivery,
};
