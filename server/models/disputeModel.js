const mongoose = require('mongoose');

const disputeMessageSchema = new mongoose.Schema({
  sender:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message:   { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const disputeSchema = new mongoose.Schema({
  order:       { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  initiator:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason:      { type: String, required: true },
  status:      {
    type: String,
    enum: ['Open','UnderReview','Resolved','Rejected'],
    default: 'Open'
  },
  messages:    [disputeMessageSchema],
  resolution:  { type: String },
  resolvedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolvedAt:  { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Dispute', disputeSchema);
