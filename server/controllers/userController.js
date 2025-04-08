//userController.js source code

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// JWT үүсгэх функц
const generateToken = (id, isAdmin) => {
    return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// 1️⃣ Хэрэглэгч бүртгүүлэх
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400);
        throw new Error('Бүх талбарыг бөглөнө үү');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        res.json({ message: 'Бүртгэлтэй email байна' });
        throw new Error('Бүртгэлтэй email байна');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        isAdmin: false, // Анхдагч байдлаар admin биш
    });

    res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        token: generateToken(newUser._id, newUser.isAdmin),
    });
});

// 2️⃣ Хэрэглэгч нэвтрэх
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id, user.isAdmin),
        });
    } else {
        res.status(401);
        res.json({ message: 'Нэвтрэх нэр эсвэл нууц үг буруу байна' });
        throw new Error('Нэвтрэх нэр эсвэл нууц үг буруу');
    }
});

// 3️⃣ Хэрэглэгчийн профайл авах
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error('Хэрэглэгч олдсонгүй');
    }
});

// 4️⃣ Хэрэглэгчийн мэдээлэл шинэчлэх
const updateUser = asyncHandler(async (req, res) => {
    const { username, email } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
        res.status(404);
        throw new Error('Хэрэглэгч олдсонгүй');
    }

    user.username = username || user.username;
    user.email = email || user.email;

    const updatedUser = await user.save();

    res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id, updatedUser.isAdmin),
    });
});

// 5️⃣ Нууц үг солих
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
        res.status(400);
        throw new Error('Шинэ нууц үг нь хамгийн багадаа 8 тэмдэгттэй, дээд үсэг, доод үсэг, тоо агуулсан байх ёстой');
    }

    const user = await User.findById(req.user.id);

    if (user && (await bcrypt.compare(currentPassword, user.password))) {
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: 'Нууц үг амжилттай шинэчлэгдлээ' });
    } else {
        res.status(400);
        throw new Error('Одоогийн нууц үг буруу байна');
    }
});

// 6️⃣ Хэрэглэгч устгах (Зөвхөн админ эрхтэй хэрэглэгч устгах боломжтой)
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.deleteOne();
        res.json({ message: 'Хэрэглэгч амжилттай устгагдлаа' });
    } else {
        res.status(404);
        throw new Error('Хэрэглэгч олдсонгүй');
    }
});

module.exports = { registerUser, loginUser, getUserProfile, updateUser, changePassword, deleteUser };
