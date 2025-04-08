//userRoutes.js source code
const express = require('express');
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUser, 
  changePassword, 
  deleteUser 
} = require('../controllers/userController');

const { protect, protectAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// ✅ Хэрэглэгч бүртгэх
router.post('/register', registerUser);

// ✅ Хэрэглэгч нэвтрэх
router.post('/login', loginUser);

// ✅ Хэрэглэгчийн профайл авах
router.get('/profile', protect, getUserProfile);

// ✅ Хэрэглэгчийн мэдээлэл шинэчлэх
router.put('/update', protect, updateUser);

// ✅ Нууц үг солих
router.put('/change-password', protect, changePassword);

// ✅ Хэрэглэгч устгах (Зөвхөн админ)
router.delete('/delete/:id', protect, protectAdmin, deleteUser);

module.exports = router;