import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <h1 className="logo">
            <Link to="/">💰 Finance Tracker</Link>
          </h1>
          
          <nav className="nav">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/add" 
              className={`nav-link ${location.pathname === '/add' ? 'active' : ''}`}
            >
              Add Transaction
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;