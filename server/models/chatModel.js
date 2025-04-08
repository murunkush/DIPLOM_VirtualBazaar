const mongoose = require('mongoose');

// Message схем
const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // Хүлээн авагч хэрэглэгчийн ID
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    received: {
      type: Boolean,
      default: false, // Хүлээн авсан эсэх
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
);

// Chat схем
const chatSchema = new mongoose.Schema(
  {
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Хэрэглэгчийн ID-үүд
      required: true,
    }],
    messages: [messageSchema], // Мессежүүд
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
);

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
