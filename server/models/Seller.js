// models/Seller.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sellerSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;
