import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Don't show nav for login/signup pages
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return (
      <header className='header'>
        <div className='container'>
          <div className='header-content'>
            <h1 className='logo'>
              <Link to='/'>💰 Finance Tracker</Link>
            </h1>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className='header'>
      <div className='container'>
        <div className='header-content'>
          <h1 className='logo'>
            <Link to='/'>💰 Finance Tracker</Link>
          </h1>

          {user && (
            <>
              <nav className='nav'>
                <Link
                  to='/'
                  className={`nav-link ${
                    location.pathname === '/' ? 'active' : ''
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to='/add'
                  className={`nav-link ${
                    location.pathname === '/add' ? 'active' : ''
                  }`}
                >
                  Add Transaction
                </Link>
              </nav>

              <div className='user-menu'>
                <span style={{ marginRight: '1rem', fontSize: '0.9rem' }}>
                  Hello, {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className='nav-link'
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
