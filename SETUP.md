# Personal Finance Tracker - Quick Setup Guide

## 🚀 Quick Start (Choose your preferred method)

### Method 1: Manual Setup (Recommended for learning)

1. **Install Dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

2. **Setup Environment**
   ```bash
   # Copy example environment file
   cd server
   cp .env.example .env
   
   # Edit .env file with your MongoDB connection
   # For local MongoDB: mongodb://localhost:27017/personal-finance-tracker
   # For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/personal-finance-tracker
   ```

3. **Start Development**
   ```bash
   # From project root - runs both frontend and backend
   npm run dev
   
   # OR run separately:
   # Terminal 1: npm run server
   # Terminal 2: npm run client
   ```

### Method 2: Quick Setup Script

**For Windows (PowerShell):**
```powershell
# Run this in PowerShell from project root
./setup.ps1
```

**For Mac/Linux:**
```bash
# Run this in terminal from project root
chmod +x setup.sh
./setup.sh
```

## 📝 Manual Environment Configuration

Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/personal-finance-tracker
NODE_ENV=development
```

## 🌐 Access Points

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health

## 🐛 Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   - Ensure MongoDB is running locally OR
   - Use MongoDB Atlas connection string

2. **Port Already in Use**
   - Change PORT in server/.env
   - Kill process: `lsof -ti:3000 | xargs kill -9` (Mac/Linux)

3. **npm install fails**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall

4. **CORS Issues**
   - Ensure proxy is set in client/package.json
   - Check backend CORS configuration

### Need Help?
- Check the main README.md for detailed documentation
- Create an issue on GitHub
- Email: your-email@example.com

---
**Happy Coding! 🚀**