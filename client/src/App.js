import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AddTransaction from './components/AddTransaction';
import EditTransaction from './components/EditTransaction';
import DeleteTransaction from './components/DeleteTransaction';
import TransactionProvider from './context/TransactionContext';
import './App.css';

function App() {
  return (
    <TransactionProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add" element={<AddTransaction />} />
              <Route path="/:id/edit" element={<EditTransaction />} />
              <Route path="/:id/delete" element={<DeleteTransaction />} />
            </Routes>
          </main>
        </div>
      </Router>
    </TransactionProvider>
  );
}

export default App;