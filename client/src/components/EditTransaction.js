import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTransaction } from '../context/TransactionContext'
import { format } from 'date-fns'

const EditTransaction = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { getTransactionById, updateTransaction, loading } = useTransaction()

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: '',
    category: 'Other'
  })

  const [errors, setErrors] = useState({})
  const [transaction, setTransaction] = useState(null)

  const categories = [
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

  useEffect(() => {
    const foundTransaction = getTransactionById(id)
    if (foundTransaction) {
      setTransaction(foundTransaction)
      setFormData({
        title: foundTransaction.title,
        amount: foundTransaction.amount.toString(),
        date: format(new Date(foundTransaction.date), 'yyyy-MM-dd'),
        category: foundTransaction.category
      })
    } else {
      // Transaction not found, redirect to dashboard
      navigate('/')
    }
  }, [id, getTransactionById, navigate])

  const validate = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required'
    } else if (parseFloat(formData.amount) === 0) {
      newErrors.amount = 'Amount cannot be zero'
    } else if (isNaN(parseFloat(formData.amount))) {
      newErrors.amount = 'Amount must be a valid number'
    }

    if (!formData.date) {
      newErrors.date = 'Date is required'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!validate()) return

    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        title: formData.title.trim()
      }

      await updateTransaction(id, transactionData)
      navigate('/')
    } catch (error) {
      console.error('Failed to update transaction:', error)
    }
  }

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  if (!transaction) {
    return (
      <div className='edit-transaction'>
        <div className='container'>
          <div className='loading-container'>
            <div className='loading-spinner'></div>
            <p>Loading transaction...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='edit-transaction'>
      <div className='container'>
        <div className='form-header'>
          <h2>Edit Transaction</h2>
          <button
            type='button'
            onClick={() => navigate('/')}
            className='btn btn-secondary'
          >
            Cancel
          </button>
        </div>

        <div className='transaction-info'>
          <p>
            <strong>Original:</strong> {transaction.title} - $
            {Math.abs(transaction.amount)} (
            {transaction.amount > 0 ? 'Income' : 'Expense'})
          </p>
        </div>

        <form onSubmit={handleSubmit} className='transaction-form'>
          <div className='form-group'>
            <label htmlFor='title'>Transaction Title *</label>
            <input
              type='text'
              id='title'
              name='title'
              value={formData.title}
              onChange={handleChange}
              placeholder='e.g., Grocery shopping, Salary, Coffee'
              className={errors.title ? 'error' : ''}
            />
            {errors.title && (
              <span className='error-message'>{errors.title}</span>
            )}
          </div>

          <div className='form-group'>
            <label htmlFor='amount'>
              Amount *
              <small>
                (Use positive numbers for income, negative for expenses)
              </small>
            </label>
            <input
              type='number'
              id='amount'
              name='amount'
              value={formData.amount}
              onChange={handleChange}
              placeholder='e.g., 100 or -50'
              step='0.01'
              className={errors.amount ? 'error' : ''}
            />
            {errors.amount && (
              <span className='error-message'>{errors.amount}</span>
            )}
          </div>

          <div className='form-group'>
            <label htmlFor='date'>Date *</label>
            <input
              type='date'
              id='date'
              name='date'
              value={formData.date}
              onChange={handleChange}
              className={errors.date ? 'error' : ''}
            />
            {errors.date && (
              <span className='error-message'>{errors.date}</span>
            )}
          </div>

          <div className='form-group'>
            <label htmlFor='category'>Category *</label>
            <select
              id='category'
              name='category'
              value={formData.category}
              onChange={handleChange}
              className={errors.category ? 'error' : ''}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className='error-message'>{errors.category}</span>
            )}
          </div>

          <div className='form-actions'>
            <button
              type='submit'
              className='btn btn-primary'
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Transaction'}
            </button>
            <button
              type='button'
              onClick={() => navigate('/')}
              className='btn btn-secondary'
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditTransaction
