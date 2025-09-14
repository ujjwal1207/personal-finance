import React from 'react';
import { useTransaction } from '../context/TransactionContext';

const FilterBar = () => {
  const { filters, setFilters, fetchTransactions } = useTransaction();

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
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    // Trigger new API call with updated filters
    setTimeout(() => fetchTransactions(), 100);
  };

  const handleDateChange = (key, value) => {
    handleFilterChange(key, value);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: 'all',
      type: 'all',
      startDate: '',
      endDate: ''
    };
    setFilters(clearedFilters);
    setTimeout(() => fetchTransactions(), 100);
  };

  return (
    <div className="filter-bar">
      <div className="filter-section">
        <h4>Filter Transactions</h4>
        
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="category-filter">Category:</label>
            <select
              id="category-filter"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="type-filter">Type:</label>
            <select
              id="type-filter"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="start-date">From:</label>
            <input
              type="date"
              id="start-date"
              value={filters.startDate}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="end-date">To:</label>
            <input
              type="date"
              id="end-date"
              value={filters.endDate}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <button 
              type="button" 
              onClick={clearFilters}
              className="btn btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;