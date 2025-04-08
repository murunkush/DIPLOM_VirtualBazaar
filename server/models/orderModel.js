const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Худалдан авагч
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Худалдагч
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true }, // Худалдан авч буй бараа
    price: { type: Number, required: true }, // Үнийн дүн
    status: { 
      type: String, 
      enum: ['Pending', 'Paid', 'Completed', 'Cancelled'], 
      default: 'Pending' 
    }, // Захиалгын төлөв
    createdAt: { type: Date, default: Date.now }, // Үүсгэсэн огноо
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
