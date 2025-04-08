//server.js source code
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const escrowRoutes = require('./routes/escrowRoutes');
const chatRoutes = require('./routes/chatRoutes');
const disputeRoutes = require('./routes/disputeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const audit = require('express-requests-logger');

// Load environment variables
dotenv.config();
console.log("MONGODB_URI:", process.env.MONGODB_URI); // ← энэ мөрийг нэм

const app = express(); // Body-той мэдээ авахын тулд

// Middleware to parse incoming JSON requests
app.use(express.json());
app.use(audit({
    excludeURLs: ['health', 'metrics'], // Exclude paths which enclude 'health' & 'metrics'
    request: {
        maskBody: ['password'], // Mask 'password' field in incoming requests
        excludeHeaders: ['authorization'], // Exclude 'authorization' header from requests
        excludeBody: ['creditCard'], // Exclude 'creditCard' field from requests body
        maskHeaders: ['header1'], // Mask 'header1' header in incoming requests
        maxBodyLength: 50 // limit length to 50 chars + '...'
    },
    response: {
        maskBody: ['session_token'], // Mask 'session_token' field in response body
        excludeHeaders: ['*'], // Exclude all headers from responses,
        excludeBody: ['*'], // Exclude all body from responses
        maskHeaders: ['header1'], // Mask 'header1' header in incoming requests
        maxBodyLength: 50 // limit length to 50 chars + '...'
    },
    shouldSkipAuditFunc: function(req, res){
        // Custom logic here.. i.e: return res.statusCode === 200
        return false;
    }
}));

// MongoDB connection
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000, // Timeout for server connection
})
  .then(() => console.log('MongoDB successfully connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Root endpoint
app.get('/', (req, res) => {
  res.send('API сервер амжилттай ажиллаж байна!');
});

// API routes
app.use(cors());
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/escrow', escrowRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/disputes', disputeRoutes);
app.use('/api/admin', adminRoutes);

// 404 error handler for non-existing routes
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

//  Алдааг барих middleware
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

// General error handler
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

app.use(cors());
