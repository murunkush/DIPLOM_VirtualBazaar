// middleware/testAuthMiddleware.js
const User = require('../models/User');

const testAuthMiddleware = async (req, res, next) => {
  // Зөвхөн тест орчинд ажиллана
  if (process.env.NODE_ENV === 'test' && req.headers['x-test-user']) {
    try {
      const user = await User.findById(req.headers['x-test-user']);
      if (user) {
        req.user = user;
        return next();
      }
    } catch (err) {
      return res.status(401).json({ message: 'Test auth user not found' });
    }
  }

  // Үндсэн auth логик дараа нь ажиллах
  return next();
};

module.exports = testAuthMiddleware;
