const express = require('express');
const router  = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteUser
} = require('../controllers/userController');
const { protect, protectAdmin } = require('../middleware/authMiddleware');

// Бүртгэл, нэвтрэх
router.post('/register', registerUser);
router.post('/login',    loginUser);

// Профайл, өөрчлөлт, нууц үг
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.put('/change-password', protect, changePassword);

// Админ хэрэглэгч устгах
router.delete('/:id', protect, protectAdmin, deleteUser);

module.exports = router;
