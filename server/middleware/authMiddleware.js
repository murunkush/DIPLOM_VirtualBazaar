const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

//  Хэрэглэгчийг хамгаалах middleware (JWT шалгах)
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Authorization header-ээс токеныг авах
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]; // Токеныг гаргаж авна
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Токеныг шалгах

            // Хэрэглэгчийн мэдээлэл авах
            req.user = await User.findById(decoded.id).select('-password'); // Нууц үгийг хасна

            // Хэрэглэгчийг хамгаалаад дараагийн middleware рүү явуулна
            next();
        } catch (error) {
            res.status(401); // Unauthorized error
            throw new Error('Нэвтрэх эрх байхгүй, токен буруу байна');
        }
    }

    // Токен байхгүй үед
    if (!token) {
        res.status(401); // Unauthorized error
        throw new Error('Нэвтрэх эрх байхгүй, токен байхгүй байна');
    }
});

//  Админ эрх шалгах middleware
const protectAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // Админ бол дараагийн middleware рүү үргэлжлүүлнэ
    } else {
        res.status(403); // Forbidden error
        throw new Error('Танд админ эрх байхгүй');
    }
};

module.exports = { protect, protectAdmin };
