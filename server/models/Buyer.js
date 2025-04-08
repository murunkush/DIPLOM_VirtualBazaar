// models/Buyer.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const buyerSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const Buyer = mongoose.model('Buyer', buyerSchema);

module.exports = Buyer;
