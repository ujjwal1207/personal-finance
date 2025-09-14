const jwt = require('jsonwebtoken')

// Generate JWT Token
const generateToken = userId => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  })
}

// Verify JWT Token
const verifyToken = token => {
  return jwt.verify(token, process.env.JWT_SECRET)
}

module.exports = {
  generateToken,
  verifyToken
}
