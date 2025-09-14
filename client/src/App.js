import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import AddTransaction from './components/AddTransaction'
import EditTransaction from './components/EditTransaction'
import DeleteTransaction from './components/DeleteTransaction'
import Login from './components/Login'
import Signup from './components/Signup'
import TransactionProvider from './context/TransactionContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App () {
  return (
    <AuthProvider>
      <TransactionProvider>
        <Router>
          <div className='App'>
            <Header />
            <main className='main-content'>
              <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route
                  path='/'
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path='/add'
                  element={
                    <ProtectedRoute>
                      <AddTransaction />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path='/:id/edit'
                  element={
                    <ProtectedRoute>
                      <EditTransaction />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path='/:id/delete'
                  element={
                    <ProtectedRoute>
                      <DeleteTransaction />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </Router>
      </TransactionProvider>
    </AuthProvider>
  )
}

export default App
