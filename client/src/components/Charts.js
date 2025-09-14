import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const Charts = ({ transactions }) => {
  // Prepare data for category breakdown chart
  const getCategoryData = () => {
    const categoryTotals = {}

    transactions.forEach(transaction => {
      const category = transaction.category
      const amount = Math.abs(transaction.amount)

      if (!categoryTotals[category]) {
        categoryTotals[category] = 0
      }
      categoryTotals[category] += amount
    })

    const labels = Object.keys(categoryTotals)
    const data = Object.values(categoryTotals)

    return {
      labels,
      datasets: [
        {
          label: 'Amount Spent',
          data,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#FF6384',
            '#C9CBCF',
            '#4BC0C0',
            '#FF6384',
            '#36A2EB'
          ],
          borderWidth: 1
        }
      ]
    }
  }

  // Prepare data for income vs expenses chart
  const getIncomeExpenseData = () => {
    const income = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0)

    const expenses = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    return {
      labels: ['Income', 'Expenses'],
      datasets: [
        {
          label: 'Amount',
          data: [income, expenses],
          backgroundColor: ['#4CAF50', '#F44336'],
          borderWidth: 1
        }
      ]
    }
  }

  // Prepare data for monthly trend (last 6 months)
  const getMonthlyTrendData = () => {
    const monthlyData = {}
    const last6Months = []

    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = date.toISOString().slice(0, 7) // YYYY-MM
      const monthLabel = date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
      })
      last6Months.push({ key: monthKey, label: monthLabel })
      monthlyData[monthKey] = { income: 0, expenses: 0 }
    }

    transactions.forEach(transaction => {
      const transactionMonth = transaction.date.slice(0, 7)
      if (monthlyData[transactionMonth]) {
        if (transaction.amount > 0) {
          monthlyData[transactionMonth].income += transaction.amount
        } else {
          monthlyData[transactionMonth].expenses += Math.abs(transaction.amount)
        }
      }
    })

    const labels = last6Months.map(month => month.label)
    const incomeData = last6Months.map(month => monthlyData[month.key].income)
    const expenseData = last6Months.map(
      month => monthlyData[month.key].expenses
    )

    return {
      labels,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          backgroundColor: '#4CAF50',
          borderColor: '#4CAF50',
          borderWidth: 1
        },
        {
          label: 'Expenses',
          data: expenseData,
          backgroundColor: '#F44336',
          borderColor: '#F44336',
          borderWidth: 1
        }
      ]
    }
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return '$' + value.toLocaleString()
          }
        }
      }
    }
  }

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right'
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.parsed
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${
              context.label
            }: $${value.toLocaleString()} (${percentage}%)`
          }
        }
      }
    }
  }

  if (transactions.length === 0) {
    return (
      <div className='charts-section'>
        <h3>📊 Financial Charts</h3>
        <p>Add some transactions to see visual insights!</p>
      </div>
    )
  }

  return (
    <div className='charts-section'>
      <h3>📊 Financial Charts</h3>

      <div className='charts-grid'>
        <div className='chart-container'>
          <h4>Income vs Expenses</h4>
          <Pie data={getIncomeExpenseData()} options={pieOptions} />
        </div>

        <div className='chart-container'>
          <h4>Spending by Category</h4>
          <Pie data={getCategoryData()} options={pieOptions} />
        </div>

        <div className='chart-container wide'>
          <h4>Monthly Trend (Last 6 Months)</h4>
          <Bar data={getMonthlyTrendData()} options={chartOptions} />
        </div>
      </div>
    </div>
  )
}

export default Charts
