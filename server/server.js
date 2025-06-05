const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const audit = require('express-requests-logger')
const testAuthMiddleware = require('./middleware/testAuthMiddleware')

// Routes
const userRoutes    = require('./routes/userRoutes')
const itemRoutes    = require('./routes/itemRoutes')
const orderRoutes   = require('./routes/orderRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const escrowRoutes  = require('./routes/escrowRoutes')
const chatRoutes    = require('./routes/chatRoutes')
const disputeRoutes = require('./routes/disputeRoutes')
const adminRoutes   = require('./routes/adminRoutes')
const basketRoutes  = require('./routes/basketRoutes')
const wishlistRoutes= require('./routes/wishlistRoutes')

// Load environment variables
dotenv.config()
console.log("MONGODB_URI:", process.env.MONGODB_URI)

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())
// Тест орчинд тестAuthMiddleware, бусад үед JWT шалгалт хийнэ
app.use(testAuthMiddleware)

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Request auditing
app.use(audit({
  excludeURLs: ['health','metrics'],
  request:  { maskBody:['password'], excludeHeaders:['authorization'], maxBodyLength:50 },
  response: { maskBody:['session_token'], excludeHeaders:['*'],   maxBodyLength:50 },
  shouldSkipAuditFunc: () => false
}))

// Health check
app.get('/', (req, res) => res.send('API server is running successfully!'))

// API routes
app.use('/api/users',     userRoutes)
app.use('/api/items',     itemRoutes)
app.use('/api/orders',    orderRoutes)
app.use('/api/payments',  paymentRoutes)
app.use('/api/escrow',    escrowRoutes) 
app.use('/api/chats',     chatRoutes)
app.use('/api/disputes',  disputeRoutes)
app.use('/api/admin',     adminRoutes)
app.use('/api/wishlist',  wishlistRoutes)
app.use('/api/basket',    basketRoutes)

// 404 handler
app.use((req, res) => res.status(404).json({ message: "Not Found" }))

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500
  res.status(status).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  })
})

// Connect DB & start server (skip in test environment)
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => console.log('MongoDB successfully connected'))
    .catch(err => console.log('MongoDB connection error:', err))

  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
}

module.exports = app
