// tests/mocks/auth.js

const jwt = require('jsonwebtoken');
const secret = 'your_jwt_secret_key';

const generateToken = (userId) => {
  return jwt.sign({ userId }, secret, { expiresIn: '1h' });
};

module.exports = { generateToken };
