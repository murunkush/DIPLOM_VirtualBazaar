const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const audit = require('express-requests-logger');

// Routes
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const escrowRoutes = require('./routes/escrowRoutes');
const chatRoutes = require('./routes/chatRoutes');
const disputeRoutes = require('./routes/disputeRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Load env
dotenv.config();
console.log("MONGODB_URI:", process.env.MONGODB_URI);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // ← Image access
app.use(audit({
  excludeURLs: ['health', 'metrics'],
  request: {
    maskBody: ['password'],
    excludeHeaders: ['authorization'],
    excludeBody: ['creditCard'],
    maskHeaders: ['header1'],
    maxBodyLength: 50
  },
  response: {
    maskBody: ['session_token'],
    excludeHeaders: ['*'],
    excludeBody: ['*'],
    maskHeaders: ['header1'],
    maxBodyLength: 50
  },
  shouldSkipAuditFunc: function (req, res) {
    return false;
  }
}));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
})
  .then(() => console.log('MongoDB successfully connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Root
app.get('/', (req, res) => {
  res.send('API сервер амжилттай ажиллаж байна!');
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/escrow', escrowRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/disputes', disputeRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

// Error Handler
app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  res.status(statusCode).json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? null : error.stack,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
