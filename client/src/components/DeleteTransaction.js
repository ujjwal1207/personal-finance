import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTransaction } from '../context/TransactionContext'
import { format } from 'date-fns'

const DeleteTransaction = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { getTransactionById, deleteTransaction, loading } = useTransaction()

  const [transaction, setTransaction] = useState(null)

  useEffect(() => {
    const foundTransaction = getTransactionById(id)
    if (foundTransaction) {
      setTransaction(foundTransaction)
    } else {
      // Transaction not found, redirect to dashboard
      navigate('/')
    }
  }, [id, getTransactionById, navigate])

  const handleDelete = async () => {
    try {
      await deleteTransaction(id)
      navigate('/')
    } catch (error) {
      console.error('Failed to delete transaction:', error)
    }
  }

  const formatCurrency = amount => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount))
  }

  const formatDate = dateString => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy')
    } catch (error) {
      return 'Invalid Date'
    }
  }

  if (!transaction) {
    return (
      <div className='delete-transaction'>
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
    <div className='delete-transaction'>
      <div className='container'>
        <div className='delete-header'>
          <h2>Delete Transaction</h2>
        </div>

        <div className='delete-warning'>
          <div className='warning-icon'>⚠️</div>
          <h3>Are you sure you want to delete this transaction?</h3>
          <p>This action cannot be undone.</p>
        </div>

        <div className='transaction-preview'>
          <div className='preview-card'>
            <div className='transaction-details'>
              <h4>{transaction.title}</h4>
              <div className='transaction-meta'>
                <span className='category'>
                  Category: {transaction.category}
                </span>
                <span className='date'>
                  Date: {formatDate(transaction.date)}
                </span>
                <span
                  className={`amount ${
                    transaction.amount > 0 ? 'income' : 'expense'
                  }`}
                >
                  Amount: {transaction.amount > 0 ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </span>
                <span className='type'>
                  Type: {transaction.amount > 0 ? 'Income' : 'Expense'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className='delete-actions'>
          <button
            onClick={handleDelete}
            className='btn btn-danger'
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Yes, Delete Transaction'}
          </button>
          <button onClick={() => navigate('/')} className='btn btn-secondary'>
            Cancel
          </button>
        </div>

        <div className='delete-info'>
          <h4>What happens when you delete?</h4>
          <ul>
            <li>
              This transaction will be permanently removed from your records
            </li>
            <li>Your balance and summary statistics will be updated</li>
            <li>This action cannot be undone</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default DeleteTransaction
