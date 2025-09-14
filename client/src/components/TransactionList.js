import React from 'react';
import { Link } from 'react-router-dom';
import { useTransaction } from '../context/TransactionContext';
import { format } from 'date-fns';

const TransactionList = () => {
  const { transactions, loading } = useTransaction();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Food & Dining': '🍽️',
      'Transportation': '🚗',
      'Shopping': '🛍️',
      'Entertainment': '🎬',
      'Bills & Utilities': '📋',
      'Healthcare': '🏥',
      'Education': '📚',
      'Travel': '✈️',
      'Income': '💰',
      'Investment': '📈',
      'Other': '📁'
    };
    return icons[category] || '📁';
  };

  if (loading) {
    return (
      <div className="transaction-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading transactions...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="transaction-list">
        <div className="list-header">
          <h3>Recent Transactions</h3>
        </div>
        <div className="empty-transactions">
          <p>No transactions found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      <div className="list-header">
        <h3>Recent Transactions ({transactions.length})</h3>
      </div>
      
      <div className="transaction-items">
        {transactions.map((transaction) => (
          <div 
            key={transaction._id} 
            className={`transaction-item ${transaction.amount > 0 ? 'income' : 'expense'}`}
          >
            <div className="transaction-info">
              <div className="transaction-main">
                <span className="category-icon">
                  {getCategoryIcon(transaction.category)}
                </span>
                <div className="transaction-details">
                  <h4 className="transaction-title">{transaction.title}</h4>
                  <div className="transaction-meta">
                    <span className="category">{transaction.category}</span>
                    <span className="date">{formatDate(transaction.date)}</span>
                  </div>
                </div>
              </div>
              
              <div className="transaction-amount">
                <span className={`amount ${transaction.amount > 0 ? 'positive' : 'negative'}`}>
                  {transaction.amount > 0 ? '+' : '-'}{formatCurrency(transaction.amount)}
                </span>
              </div>
            </div>
            
            <div className="transaction-actions">
              <Link 
                to={`/${transaction._id}/edit`} 
                className="btn btn-sm btn-outline"
                title="Edit transaction"
              >
                ✏️ Edit
              </Link>
              <Link 
                to={`/${transaction._id}/delete`} 
                className="btn btn-sm btn-danger"
                title="Delete transaction"
              >
                🗑️ Delete
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;