const escrowSchema = new mongoose.Schema({
    orderId: mongoose.Schema.Types.ObjectId,
    fundsHeld: Number,
    status: { type: String, default: 'pending' },
});

module.exports = mongoose.model('Escrow', escrowSchema);