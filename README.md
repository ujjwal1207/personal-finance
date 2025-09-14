# Personal Finance Tracker 💰

A full-stack MERN application for tracking personal income and expenses with real-time analytics and visualizations.

![Finance Tracker](https://img.shields.io/badge/MERN-Stack-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-1.0.0-orange)

## 🚀 Features

### Core Features
- ✅ **Complete CRUD Operations** - Create, Read, Update, Delete transactions
- ✅ **Real-time Balance Tracking** - Automatic calculation of income, expenses, and balance
- ✅ **Category Management** - Organize transactions by predefined categories
- ✅ **Date-based Organization** - Track transactions by date with filtering
- ✅ **Responsive Design** - Works seamlessly on desktop and mobile devices

### Bonus Features
- 🎯 **Advanced Filtering** - Filter by category, type, and date range
- 📊 **Interactive Charts** - Visual analytics with Chart.js
- 💾 **Offline Support** - localStorage backup for offline functionality
- 🎨 **Modern UI/UX** - Clean, intuitive interface with smooth animations
- 📱 **Mobile Responsive** - Optimized for all screen sizes

## 🛠️ Tech Stack

### Frontend
- **React** 18.2.0 - UI library
- **React Router DOM** 6.15.0 - Client-side routing
- **Chart.js & React-Chartjs-2** - Data visualization
- **Axios** - HTTP client
- **Date-fns** - Date manipulation

### Backend
- **Node.js** - Runtime environment
- **Express.js** 4.18.2 - Web framework
- **MongoDB** with **Mongoose** 7.5.0 - Database and ODM
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📋 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Get All Transactions
```http
GET /transactions
```

**Query Parameters:**
- `page` (optional) - Page number for pagination
- `limit` (optional) - Number of items per page
- `category` (optional) - Filter by category
- `type` (optional) - Filter by income/expense
- `startDate` (optional) - Filter from date (YYYY-MM-DD)
- `endDate` (optional) - Filter to date (YYYY-MM-DD)

**Response:**
```json
{
  "transactions": [...],
  "currentPage": 1,
  "totalPages": 5,
  "total": 50,
  "summary": {
    "totalIncome": 5000,
    "totalExpenses": 3000,
    "balance": 2000
  }
}
```

#### Get Single Transaction
```http
GET /transactions/:id
```

#### Create Transaction
```http
POST /transactions
```

**Body:**
```json
{
  "title": "Grocery Shopping",
  "amount": -75.50,
  "date": "2024-01-15",
  "category": "Food & Dining"
}
```

#### Update Transaction
```http
PUT /transactions/:id
```

#### Delete Transaction
```http
DELETE /transactions/:id
```

#### Get Statistics
```http
GET /transactions/stats/summary
```

### Transaction Schema
```javascript
{
  title: String (required, max 100 chars),
  amount: Number (required, cannot be 0),
  date: Date (required, default: now),
  category: String (required, enum: categories),
  type: String (auto-calculated: 'income'|'expense'),
  createdAt: Date,
  updatedAt: Date
}
```

### Categories
- Food & Dining
- Transportation
- Shopping
- Entertainment
- Bills & Utilities
- Healthcare
- Education
- Travel
- Income
- Investment
- Other

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/personal-finance-tracker.git
   cd personal-finance-tracker
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/personal-finance-tracker
   NODE_ENV=development
   ```

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas cloud connection string
   ```

6. **Run the application**
   
   **Option 1: Run both simultaneously (recommended)**
   ```bash
   # From project root
   npm run dev
   ```
   
   **Option 2: Run separately**
   ```bash
   # Terminal 1 - Start backend
   cd server
   npm run dev
   
   # Terminal 2 - Start frontend  
   cd client
   npm start
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

## 🎯 Usage Guide

### Adding Transactions
1. Navigate to "Add Transaction" or use the dashboard button
2. Fill in the form:
   - **Title**: Descriptive name for the transaction
   - **Amount**: Use positive numbers for income, negative for expenses
   - **Date**: Transaction date (defaults to today)
   - **Category**: Select appropriate category
3. Click "Add Transaction"

### Managing Transactions
- **View**: All transactions appear on the dashboard
- **Edit**: Click the "Edit" button on any transaction
- **Delete**: Click the "Delete" button and confirm
- **Filter**: Use the filter bar to narrow down transactions

### Understanding the Dashboard
- **Summary Cards**: Shows total income, expenses, and current balance
- **Transaction List**: Displays all transactions with icons and details
- **Charts**: Visual representations of spending patterns (toggle on/off)
- **Filters**: Refine the view by category, type, or date range

## 🔧 Development

### Project Structure
```
personal-finance-tracker/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # Context API
│   │   ├── App.js         # Main app component
│   │   ├── App.css        # Styles
│   │   └── index.js       # Entry point
│   └── package.json
├── server/                 # Express backend
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── server.js          # Server entry point
│   ├── .env              # Environment variables
│   └── package.json
└── README.md
```

### Available Scripts

**Server:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

**Client:**
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

### Adding New Features

1. **Backend**: Add routes in `server/routes/`, models in `server/models/`
2. **Frontend**: Create components in `client/src/components/`
3. **Styling**: Update `client/src/App.css`
4. **State Management**: Use Context API in `client/src/context/`

## 🌐 Deployment

### Backend Deployment (Railway/Heroku)
1. Create account on Railway/Heroku
2. Set environment variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   NODE_ENV=production
   ```
3. Deploy server folder

### Frontend Deployment (Netlify/Vercel)
1. Build the client:
   ```bash
   cd client
   npm run build
   ```
2. Deploy the `build` folder to Netlify/Vercel
3. Update API base URL in client to your deployed backend

### Database (MongoDB Atlas)
1. Create free cluster at MongoDB Atlas
2. Get connection string
3. Update MONGODB_URI in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email your-email@example.com or create an issue on GitHub.

## 🏆 Acknowledgments

- Icons from various emoji sets
- Charts powered by Chart.js
- UI inspiration from modern fintech applications
- MongoDB for reliable data storage
- React community for excellent documentation

---

**Built with ❤️ using the MERN Stack**