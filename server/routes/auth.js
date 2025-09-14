const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { generateToken } = require('../utils/jwt')
const { protect } = require('../middleware/auth')

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Please provide name, email, and password'
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters'
      })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this email'
      })
    }

    // Create user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password
    })

    const savedUser = await user.save()

    // Generate token
    const token = generateToken(savedUser._id)

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: savedUser.toAuthJSON()
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({ message: 'Validation error', errors })
    }
    console.error('Signup error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide email and password'
      })
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim()
    }).select('+password')

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }

    // Check password
    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }

    const token = generateToken(user._id)

    res.json({
      message: 'Login successful',
      token,
      user: user.toAuthJSON()
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

router.get('/me', protect, async (req, res) => {
  try {
    res.json({
      user: req.user.toAuthJSON()
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

router.put('/profile', protect, async (req, res) => {
  try {
    const { name, email } = req.body

    const user = req.user

    if (name) user.name = name.trim()
    if (email) user.email = email.toLowerCase().trim()

    const updatedUser = await user.save()

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser.toAuthJSON()
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Email already exists'
      })
    }
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({ message: 'Validation error', errors })
    }
    console.error('Profile update error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router
