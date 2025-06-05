const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User   = require('../models/User');

// JWT үүсгэх
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// 1️⃣ Бүртгүүлэх
exports.registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error('Бүх талбарыг бөглөнө үү');
  }

  // email формат шалгах
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error('Зөв email хаяг оруулна уу');
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('Энэ email-ээр бүртгэлтэй хэрэглэгч байна');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    passwordHash
  });

  res.status(201).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    isAdmin: user.isAdmin,
    token: generateToken(user._id, user.role)
  });
});

// 2️⃣ Нэвтрэх
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  const user = await User.findOne({ email });
  console.log(user);
  if (!user) {
    res.status(401);
    throw new Error('Нэвтрэх нэр эсвэл нууц үг буруу байна');
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    res.status(401);
    throw new Error('Нэвтрэх нэр эсвэл нууц үг буруу байна');
  }

  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    isAdmin: user.isAdmin,
    token: generateToken(user._id, user.role)
  });
});

// 3️⃣ Профайл авах
exports.getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error('Хэрэглэгч олдсонгүй');
  }
  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    isAdmin: user.isAdmin
  });
});

// 4️⃣ Профайл засах
exports.updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error('Хэрэглэгч олдсонгүй');
  }

  const { username, email } = req.body;
  if (email && email !== user.email) {
    // шинэ email давхцал шалгах
    const exists = await User.findOne({ email });
    if (exists) {
      res.status(400);
      throw new Error('Энэ email-ээр бүртгэлтэй хэрэглэгч байна');
    }
    // формат шалгах
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400);
      throw new Error('Зөв email хаяг оруулна уу');
    }
    user.email = email;
  }
  if (username) user.username = username;

  const updated = await user.save();
  res.json({
    _id: updated._id,
    username: updated.username,
    email: updated.email,
    role: updated.role,
    isAdmin: updated.isAdmin,
    token: generateToken(updated._id, updated.role)
  });
});

// 5️⃣ Нууц үг солих
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error('Хэрэглэгч олдсонгүй');
  }

  const match = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!match) {
    res.status(400);
    throw new Error('Одоогийн нууц үг буруу байна');
  }

  // шинэ нууц үгийн шалгалт
  const pwdRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  if (!pwdRegex.test(newPassword)) {
    res.status(400);
    throw new Error('Нууц үг нь дор хаяж 8 тэмдэгт, дээд/доод үсэг, тоо агуулсан байх ёстой');
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: 'Нууц үг амжилттай солигдлоо' });
});

// 6️⃣ Хэрэглэгч устгах (зөвхөн админ)
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('Хэрэглэгч олдсонгүй');
  }
  await user.deleteOne();
  res.json({ message: 'Хэрэглэгч амжилттай устгагдлаа' });
});
