const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required']
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      validate: {
        validator: function (v) {
          return v !== 0
        },
        message: 'Amount cannot be zero'
      }
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Food & Dining',
        'Transportation',
        'Shopping',
        'Entertainment',
        'Bills & Utilities',
        'Healthcare',
        'Education',
        'Travel',
        'Income',
        'Investment',
        'Other'
      ]
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      default: function () {
        return this.amount > 0 ? 'income' : 'expense'
      }
    }
  },
  {
    timestamps: true
  }
)

transactionSchema.pre('save', function (next) {
  this.type = this.amount > 0 ? 'income' : 'expense'
  next()
})

transactionSchema.methods.getFormattedAmount = function () {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(Math.abs(this.amount))
}

transactionSchema.statics.getByDateRange = function (startDate, endDate) {
  return this.find({
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ date: -1 })
}

module.exports = mongoose.model('Transaction', transactionSchema)
