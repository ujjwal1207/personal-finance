const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { verifyToken } = require('../utils/jwt')

// Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    let token

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({
        message: 'Not authorized to access this route'
      })
    }

    try {
      // Verify token
      const decoded = verifyToken(token)

      // Get user from token
      req.user = await User.findById(decoded.userId).select('-password')

      if (!req.user) {
        return res.status(401).json({
          message: 'No user found with this token'
        })
      }

      next()
    } catch (error) {
      return res.status(401).json({
        message: 'Not authorized to access this route'
      })
    }
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(500).json({
      message: 'Server error in authentication'
    })
  }
}

const optionalAuth = async (req, res, next) => {
  try {
    let token

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]

      try {
        const decoded = verifyToken(token)
        req.user = await User.findById(decoded.userId).select('-password')
      } catch (error) {
        // Token invalid but continue anyway
        req.user = null
      }
    }

    next()
  } catch (error) {
    next()
  }
}

module.exports = {
  protect,
  optionalAuth
}
