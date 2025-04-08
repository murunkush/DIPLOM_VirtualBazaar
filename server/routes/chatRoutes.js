const express = require('express');
const { createChat,sendMessage, getChatMessages, checkIfReceived, deleteMessage} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');  // protect middleware нь хэрэглэгчийн нэвтрэх эрхийг шалгана
const router = express.Router();

// ✅ Шинэ чат үүсгэх
router.post('/create', protect, createChat);

// ✅ Мессеж илгээх
router.post('/send', protect, sendMessage);

// ✅ Чатны бүх мессежийг авах
router.get('/:chatId/messages', protect, getChatMessages);

// ✅ Мессеж хүлээн авсан эсэхийг шалгах
router.get('/message/:messageId/received', protect, checkIfReceived);

// ✅ Мессеж устгах
router.delete('/message/:messageId', protect, deleteMessage);

module.exports = router;
