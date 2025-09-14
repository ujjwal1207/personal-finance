const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

// CORS configuration using environment variables
const getAllowedOrigins = () => {
  const origins = [
    'http://localhost:3000' // Development default
  ]

  // Add custom origins from environment variable
  if (process.env.ALLOWED_ORIGINS) {
    const envOrigins = process.env.ALLOWED_ORIGINS.split(',').map(origin =>
      origin.trim()
    )
    origins.push(...envOrigins)
  }

  return origins
}

const corsOptions = {
  origin: getAllowedOrigins(),
  credentials: true,
  optionsSuccessStatus: 200
}

// Middleware
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Database configuration
const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://localhost:27017/personal-finance-tracker'

// Add database name based on environment
const dbName =
  process.env.NODE_ENV === 'production'
    ? 'personal-finance-tracker-prod'
    : 'personal-finance-tracker-dev'
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: dbName
}

mongoose
  .connect(MONGODB_URI, mongooseOptions)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err))

// Routes
const transactionRoutes = require('./routes/transactions')
app.use('/api/transactions', transactionRoutes)

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Personal Finance Tracker API is running!' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong!' })
})

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

module.exports = app
