// middleware/adminOnly.js
module.exports = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Admin эрх шаардлагатай');
  }
};
