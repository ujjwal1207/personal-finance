import React from 'react'

const SummaryCards = ({ summary }) => {
  const formatCurrency = amount => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className='summary-cards'>
      <div className='summary-card income'>
        <div className='card-header'>
          <h3>Total Income</h3>
          <span className='icon'>📈</span>
        </div>
        <div className='card-value'>{formatCurrency(summary.totalIncome)}</div>
      </div>

      <div className='summary-card expenses'>
        <div className='card-header'>
          <h3>Total Expenses</h3>
          <span className='icon'>📉</span>
        </div>
        <div className='card-value'>
          {formatCurrency(summary.totalExpenses)}
        </div>
      </div>

      <div
        className={`summary-card balance ${
          summary.balance >= 0 ? 'positive' : 'negative'
        }`}
      >
        <div className='card-header'>
          <h3>Balance</h3>
          <span className='icon'>{summary.balance >= 0 ? '💰' : '⚠️'}</span>
        </div>
        <div className='card-value'>{formatCurrency(summary.balance)}</div>
      </div>
    </div>
  )
}

export default SummaryCards
