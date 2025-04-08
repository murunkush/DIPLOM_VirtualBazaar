const mongoose = require('mongoose');
const Chat = require('../models/chatModel');
const asyncHandler = require('express-async-handler');

// Шинэ чат үүсгэх
const createChat = async (req, res) => {
  try {
    const { users } = req.body;
    // Шинэ чат үүсгэх код
    const chat = new Chat({ users });
    await chat.save();
    res.status(201).json(chat);
  } catch (err) {
    console.log(err);  // Алдааг консольд хэвлэх
    res.status(400).json({ message: 'Чат үүсгэхэд алдаа гарлаа', error: err.message });
  }
};

// Мессеж илгээх
const sendMessage = asyncHandler(async (req, res) => {
  const { chatId, content } = req.body;
  const sender = req.user._id;
  if (!chatId || !content) {
    return res.status(400).json({ message: 'Чат ID болон мессежийн агуулга шаардлагатай' });
  }
  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    return res.status(400).json({ message: 'Буруу чат ID' });
  }
  const chat = await Chat.findById(chatId);
  if (!chat) {
    return res.status(404).json({ message: 'Чат олдсонгүй' });
  }
  const newMessage = { sender, content };
  chat.messages.push(newMessage);
  await chat.save();
  res.status(201).json({ message: 'Мессеж амжилттай илгээгдлээ' });
});

// Чатны бүх мессежийг авах
const getChatMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    return res.status(400).json({ message: 'Буруу чат ID' });
  }
  const chat = await Chat.findById(chatId).populate('messages.sender', 'username email');
  if (!chat) {
    return res.status(404).json({ message: 'Чат олдсонгүй' });
  }
  res.status(200).json(chat.messages);
});

// Мессеж хүлээн авсан эсэхийг шалгах
const checkIfReceived = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  const chat = await Chat.findOne({ 'messages._id': messageId });

  if (!chat) {
    res.status(404).json({ message: 'Мессеж олдсонгүй' });
    return;
  }

  const message = chat.messages.id(messageId);
  res.status(200).json({ received: message.received });
});

// Мессеж устгах
const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    return res.status(400).json({ message: 'Буруу мессеж ID' });
  }
  const chat = await Chat.findOne({ 'messages._id': messageId });
  if (!chat) {
    return res.status(404).json({ message: 'Мессеж олдсонгүй' });
  }
  chat.messages = chat.messages.filter((msg) => msg._id.toString() !== messageId);
  await chat.save();
  res.status(200).json({ message: 'Мессеж амжилттай устгагдлаа' });
});

module.exports = {
  createChat,
  sendMessage,
  getChatMessages,
  checkIfReceived,
  deleteMessage,
};