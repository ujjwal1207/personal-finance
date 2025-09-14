import React, { useEffect, useState } from 'react'
import { useTransaction } from '../context/TransactionContext'
import TransactionList from './TransactionList'
import SummaryCards from './SummaryCards'
import FilterBar from './FilterBar'
import Charts from './Charts'

const Dashboard = () => {
  const {
    transactions,
    loading,
    error,
    summary,
    fetchTransactions,
    clearError
  } = useTransaction()

  const [showCharts, setShowCharts] = useState(false)

  useEffect(() => {
    fetchTransactions()
  }, []) // Remove fetchTransactions from dependency

  const calculateSummary = () => {
    const totalIncome = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    const balance = totalIncome - totalExpenses

    return { totalIncome, totalExpenses, balance }
  }

  const currentSummary = summary.totalIncome > 0 ? summary : calculateSummary()

  if (loading && transactions.length === 0) {
    return (
      <div className='loading-container'>
        <div className='loading-spinner'></div>
        <p>Loading transactions...</p>
      </div>
    )
  }

  return (
    <div className='dashboard'>
      <div className='container'>
        <div className='dashboard-header'>
          <h2>Financial Dashboard</h2>
          <button
            className='toggle-charts-btn'
            onClick={() => setShowCharts(!showCharts)}
          >
            {showCharts ? 'Hide Charts' : 'Show Charts'}
          </button>
        </div>

        {error && (
          <div className='error-banner'>
            <p>{error}</p>
            <button onClick={clearError} className='close-error'>
              ×
            </button>
          </div>
        )}

        <SummaryCards summary={currentSummary} />

        {showCharts && transactions.length > 0 && (
          <Charts transactions={transactions} />
        )}

        <FilterBar />

        <TransactionList />

        {transactions.length === 0 && !loading && (
          <div className='empty-state'>
            <h3>No transactions yet</h3>
            <p>Start by adding your first transaction!</p>
            <a href='/add' className='btn btn-primary'>
              Add Transaction
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
