import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTransaction } from '../context/TransactionContext'

const AddTransaction = () => {
  const navigate = useNavigate()
  const { addTransaction, loading } = useTransaction()

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0], // Today's date
    category: 'Other'
  })

  const [errors, setErrors] = useState({})

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

      await addTransaction(transactionData)
      navigate('/')
    } catch (error) {
      console.error('Failed to add transaction:', error)
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

  return (
    <div className='add-transaction'>
      <div className='container'>
        <div className='form-header'>
          <h2>Add New Transaction</h2>
          <button
            type='button'
            onClick={() => navigate('/')}
            className='btn btn-secondary'
          >
            Cancel
          </button>
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
              {loading ? 'Adding...' : 'Add Transaction'}
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

        <div className='form-help'>
          <h4>Tips:</h4>
          <ul>
            <li>
              Use <strong>positive numbers</strong> for income (e.g., salary,
              freelance payment)
            </li>
            <li>
              Use <strong>negative numbers</strong> for expenses (e.g., -25 for
              lunch)
            </li>
            <li>Choose the most appropriate category to help with tracking</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AddTransaction
