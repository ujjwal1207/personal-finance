const express = require('express')
const router = express.Router()
const Transaction = require('../models/Transaction')
const { protect } = require('../middleware/auth')

// @route   GET /api/transactions
// @desc    Get all transactions for authenticated user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      type,
      startDate,
      endDate
    } = req.query

    let query = {
      user: req.user._id // Filter by authenticated user
    }

    // Filter by category
    if (category && category !== 'all') {
      query.category = category
    }

    // Filter by type
    if (type && type !== 'all') {
      query.type = type
    }

    // Filter by date range
    if (startDate || endDate) {
      query.date = {}
      if (startDate) query.date.$gte = new Date(startDate)
      if (endDate) query.date.$lte = new Date(endDate)
    }

    const transactions = await Transaction.find(query)
      .sort({ date: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Transaction.countDocuments(query)
    const totalPages = Math.ceil(total / limit)

    // Calculate totals
    const allTransactions = await Transaction.find(query)
    const totalIncome = allTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0)
    const totalExpenses = allTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    const balance = totalIncome - totalExpenses

    res.json({
      transactions,
      currentPage: page,
      totalPages,
      total,
      summary: {
        totalIncome,
        totalExpenses,
        balance
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// @route   GET /api/transactions/:id
// @desc    Get single transaction for authenticated user
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id
    })

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    res.json(transaction)
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Transaction not found' })
    }
    console.error(error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// @route   POST /api/transactions
// @desc    Create new transaction for authenticated user
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, amount, date, category } = req.body

    // Validation
    if (!title || !amount || !category) {
      return res.status(400).json({
        message: 'Please provide title, amount, and category'
      })
    }

    if (amount === 0) {
      return res.status(400).json({
        message: 'Amount cannot be zero'
      })
    }

    const transaction = new Transaction({
      user: req.user._id,
      title: title.trim(),
      amount: parseFloat(amount),
      date: date ? new Date(date) : new Date(),
      category
    })

    const savedTransaction = await transaction.save()
    res.status(201).json(savedTransaction)
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({ message: 'Validation error', errors })
    }
    console.error(error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// @route   PUT /api/transactions/:id
// @desc    Update transaction for authenticated user
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, amount, date, category } = req.body

    // Find transaction for this user
    let transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id
    })

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    // Validation
    if (amount === 0) {
      return res.status(400).json({
        message: 'Amount cannot be zero'
      })
    }

    // Update fields
    if (title !== undefined) transaction.title = title.trim()
    if (amount !== undefined) transaction.amount = parseFloat(amount)
    if (date !== undefined) transaction.date = new Date(date)
    if (category !== undefined) transaction.category = category

    const updatedTransaction = await transaction.save()
    res.json(updatedTransaction)
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Transaction not found' })
    }
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({ message: 'Validation error', errors })
    }
    console.error(error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// @route   DELETE /api/transactions/:id
// @desc    Delete transaction for authenticated user
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    // Find transaction for this user
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id
    })

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    await Transaction.findByIdAndDelete(req.params.id)
    res.json({ message: 'Transaction deleted successfully' })
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Transaction not found' })
    }
    console.error(error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// @route   GET /api/transactions/stats/summary
// @desc    Get transaction statistics for authenticated user
// @access  Private
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    let query = { user: req.user._id }
    if (startDate || endDate) {
      query.date = {}
      if (startDate) query.date.$gte = new Date(startDate)
      if (endDate) query.date.$lte = new Date(endDate)
    }

    const transactions = await Transaction.find(query)

    const totalIncome = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    const balance = totalIncome - totalExpenses

    // Category breakdown
    const categoryStats = {}
    transactions.forEach(transaction => {
      const category = transaction.category
      if (!categoryStats[category]) {
        categoryStats[category] = { income: 0, expenses: 0, total: 0 }
      }

      if (transaction.amount > 0) {
        categoryStats[category].income += transaction.amount
      } else {
        categoryStats[category].expenses += Math.abs(transaction.amount)
      }
      categoryStats[category].total += transaction.amount
    })

    res.json({
      totalIncome,
      totalExpenses,
      balance,
      transactionCount: transactions.length,
      categoryStats
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router
