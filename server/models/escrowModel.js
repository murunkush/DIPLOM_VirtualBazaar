// models/escrowModel.js
const mongoose = require('mongoose');

const escrowSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: [
      'pending',     // Эхний төлөв
      'confirmed',   // Admin баталгаажуулсан
      'completed',   // Buyer баталгаажуулсан
      'disputed',    // Маргаан үүсгэсэн
      'refunded',    // Систем/Админ буцаасан
      'cancelled'    // Buyer/admin хүчингүй болгосон
    ],
    default: 'pending',
  },
  paymentDate: Date,
  confirmationDate: Date,
  completionDate: Date,
  disputeReason: String,
}, { timestamps: true });

module.exports = mongoose.model('Escrow', escrowSchema);
