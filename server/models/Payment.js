const mongoose = require('mongoose'); // mongoose-г хамааруулсан байна

const paymentSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order', // Өгөгдлийг холбох
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Payment = mongoose.model('Payment', paymentSchema); // Payment модель үүсгэсэн байна

module.exports = Payment;
