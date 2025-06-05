const mongoose = require('mongoose');

const orderLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  actor:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  from:      { type: String, required: true },
  to:        { type: String, required: true },
  note:      { type: String }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  buyer:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  item:         { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  price:        { type: Number, required: true },
  status:       {
    type: String,
    enum: [
      'Requested','Approved','PendingPayment','Paid',
      'Delivered','Verified','Cancelled','Disputed',
      'EscrowPending','EscrowConfirmed','EscrowCompleted'
    ],
    default: 'Requested'
  },
  deliveryInfo: { type: String },   // → Хүргэлтийн мессеж энд хадгалах
  logs:         [orderLogSchema]
}, { timestamps: true });

orderSchema.pre('save', function(next) {
  if (this.isNew) {
    this.logs.push({
      actor: this.buyer,
      from: 'Initial',
      to: this.status,
      note: 'Order created'
    });
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
