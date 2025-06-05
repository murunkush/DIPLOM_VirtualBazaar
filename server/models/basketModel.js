const mongoose = require('mongoose');

const basketItemSchema = mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
      unique: false,
    },
  },
  { _id: false }
);

const basketSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [basketItemSchema],
  },
  {
    timestamps: true,
  }
);

const Basket = mongoose.model('Basket', basketSchema);

module.exports = Basket;
