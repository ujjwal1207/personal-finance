import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback
} from 'react'
import axios from 'axios'
import { useAuth } from './AuthContext'

const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

const TransactionContext = createContext()

const initialState = {
  transactions: [],
  loading: false,
  error: null,
  summary: {
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0
  },
  filters: {
    category: 'all',
    type: 'all',
    startDate: '',
    endDate: ''
  }
}

const transactionReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload.transactions || [],
        summary: action.payload.summary || state.summary,
        loading: false,
        error: null
      }
    case 'ADD_TRANSACTION':
      // Also save to localStorage
      const updatedTransactions = [action.payload, ...state.transactions]
      localStorage.setItem('transactions', JSON.stringify(updatedTransactions))
      return {
        ...state,
        transactions: updatedTransactions
      }
    case 'UPDATE_TRANSACTION':
      const updated = state.transactions.map(t =>
        t._id === action.payload._id ? action.payload : t
      )
      localStorage.setItem('transactions', JSON.stringify(updated))
      return {
        ...state,
        transactions: updated
      }
    case 'DELETE_TRANSACTION':
      const filtered = state.transactions.filter(t => t._id !== action.payload)
      localStorage.setItem('transactions', JSON.stringify(filtered))
      return {
        ...state,
        transactions: filtered
      }
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      }
    case 'LOAD_FROM_LOCALSTORAGE':
      return {
        ...state,
        transactions: action.payload
      }
    default:
      return state
  }
}

export const TransactionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState)
  const { token } = useAuth()

  // Create auth headers if token exists
  const getAuthHeaders = () => {
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('transactions')
    if (saved) {
      try {
        const transactions = JSON.parse(saved)
        dispatch({ type: 'LOAD_FROM_LOCALSTORAGE', payload: transactions })
      } catch (error) {
        console.error('Error loading from localStorage:', error)
      }
    }
  }, [])

  // API Functions
  const fetchTransactions = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const queryParams = new URLSearchParams()

      Object.entries(state.filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          queryParams.append(key, value)
        }
      })

      const response = await axios.get(
        `${API_BASE_URL}/transactions?${queryParams}`,
        { headers: getAuthHeaders() }
      )
      dispatch({ type: 'SET_TRANSACTIONS', payload: response.data })
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Failed to fetch transactions'
      })
      const saved = localStorage.getItem('transactions')
      if (saved) {
        try {
          const transactions = JSON.parse(saved)
          dispatch({ type: 'LOAD_FROM_LOCALSTORAGE', payload: transactions })
        } catch (parseError) {
          console.error('Error parsing localStorage:', parseError)
        }
      }
    }
  }, [token])

  const addTransaction = useCallback(
    async transactionData => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })
        const response = await axios.post(
          `${API_BASE_URL}/transactions`,
          transactionData,
          { headers: getAuthHeaders() }
        )
        dispatch({ type: 'ADD_TRANSACTION', payload: response.data })
        return response.data
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error.response?.data?.message || 'Failed to add transaction'
        })
        // Add to localStorage as fallback
        const tempTransaction = {
          _id: Date.now().toString(),
          ...transactionData,
          date: transactionData.date || new Date().toISOString(),
          createdAt: new Date().toISOString()
        }
        dispatch({ type: 'ADD_TRANSACTION', payload: tempTransaction })
        return tempTransaction
      }
    },
    [token]
  )

  const updateTransaction = async (id, transactionData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await axios.put(
        `${API_BASE_URL}/transactions/${id}`,
        transactionData,
        { headers: getAuthHeaders() }
      )
      dispatch({ type: 'UPDATE_TRANSACTION', payload: response.data })
      return response.data
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Failed to update transaction'
      })
      // Update in localStorage as fallback
      const updatedTransaction = { ...transactionData, _id: id }
      dispatch({ type: 'UPDATE_TRANSACTION', payload: updatedTransaction })
      return updatedTransaction
    }
  }

  const deleteTransaction = async id => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      await axios.delete(`${API_BASE_URL}/transactions/${id}`, {
        headers: getAuthHeaders()
      })
      dispatch({ type: 'DELETE_TRANSACTION', payload: id })
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Failed to delete transaction'
      })
      // Delete from localStorage as fallback
      dispatch({ type: 'DELETE_TRANSACTION', payload: id })
    }
  }

  const getTransactionById = id => {
    return state.transactions.find(t => t._id === id)
  }

  const setFilters = filters => {
    dispatch({ type: 'SET_FILTERS', payload: filters })
  }

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null })
  }

  const value = {
    ...state,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionById,
    setFilters,
    clearError
  }

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  )
}

export const useTransaction = () => {
  const context = useContext(TransactionContext)
  if (!context) {
    throw new Error('useTransaction must be used within a TransactionProvider')
  }
  return context
}

export default TransactionProvider
