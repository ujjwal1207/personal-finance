import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordMatch, setPasswordMatch] = useState(true)

  const { signup, loading, error, isAuthenticated, clearError } = useAuth()
  const navigate = useNavigate()

  const { name, email, password, confirmPassword } = formData

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    clearError()
  }, [clearError])

  useEffect(() => {
    if (confirmPassword) {
      setPasswordMatch(password === confirmPassword)
    }
  }, [password, confirmPassword])

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!name || !email || !password || !confirmPassword) {
      return
    }

    if (password !== confirmPassword) {
      setPasswordMatch(false)
      return
    }

    if (password.length < 6) {
      return
    }

    const result = await signup(name, email, password)
    if (result.success) {
      navigate('/')
    }
  }

  return (
    <div className='auth-container'>
      <div className='auth-card'>
        <div className='auth-header'>
          <h2>Create Account</h2>
          <p>Join us to start tracking your finances</p>
        </div>

        {error && <div className='error-message'>{error}</div>}

        <form onSubmit={handleSubmit} className='auth-form'>
          <div className='form-group'>
            <label htmlFor='name'>Full Name</label>
            <input
              type='text'
              id='name'
              name='name'
              value={name}
              onChange={handleChange}
              placeholder='Enter your full name'
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='email'>Email Address</label>
            <input
              type='email'
              id='email'
              name='email'
              value={email}
              onChange={handleChange}
              placeholder='Enter your email'
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <div className='password-input'>
              <input
                type={showPassword ? 'text' : 'password'}
                id='password'
                name='password'
                value={password}
                onChange={handleChange}
                placeholder='Enter your password (min 6 characters)'
                required
                minLength='6'
              />
              <button
                type='button'
                className='password-toggle'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className='form-group'>
            <label htmlFor='confirmPassword'>Confirm Password</label>
            <div className='password-input'>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id='confirmPassword'
                name='confirmPassword'
                value={confirmPassword}
                onChange={handleChange}
                placeholder='Confirm your password'
                required
                className={!passwordMatch ? 'error' : ''}
              />
              <button
                type='button'
                className='password-toggle'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {!passwordMatch && confirmPassword && (
              <div className='field-error'>Passwords do not match</div>
            )}
          </div>

          <button
            type='submit'
            className={`btn btn-primary auth-submit ${
              loading ? 'loading' : ''
            }`}
            disabled={loading || !passwordMatch}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className='auth-footer'>
          <p>
            Already have an account?{' '}
            <Link to='/login' className='auth-link'>
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
