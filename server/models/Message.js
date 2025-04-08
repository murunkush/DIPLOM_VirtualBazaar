const messageSchema = new mongoose.Schema({
    chatId: mongoose.Schema.Types.ObjectId,
    senderId: mongoose.Schema.Types.ObjectId,
    content: String,
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);