const disputeSchema = new mongoose.Schema({
    orderId: mongoose.Schema.Types.ObjectId,
    buyerId: mongoose.Schema.Types.ObjectId,
    sellerId: mongoose.Schema.Types.ObjectId,
    reason: String,
    status: { type: String, default: 'open' }, // open, resolved, closed
});

module.exports = mongoose.model('Dispute', disputeSchema);