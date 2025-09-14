import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback
} from 'react'
import axios from 'axios'

// API base URL configuration
const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

const AuthContext = createContext()

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
        error: null
      }
    case 'SET_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    case 'LOGIN_SUCCESS':
    case 'SIGNUP_SUCCESS':
      localStorage.setItem('token', action.payload.token)
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      }
    case 'USER_LOADED':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      }
    case 'LOGOUT':
    case 'AUTH_ERROR':
      localStorage.removeItem('token')
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload || null
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Set token in axios headers
  const setAuthToken = useCallback(token => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [])

  // Load user
  const loadUser = useCallback(async () => {
    if (state.token) {
      setAuthToken(state.token)
      try {
        const response = await axios.get(`${API_BASE_URL}/auth/me`)
        dispatch({ type: 'USER_LOADED', payload: response.data.user })
      } catch (error) {
        dispatch({ type: 'AUTH_ERROR' })
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [state.token, setAuthToken])

  // Login user
  const login = useCallback(
    async (email, password) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
          email,
          password
        })

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: response.data.user,
            token: response.data.token
          }
        })

        setAuthToken(response.data.token)
        return { success: true, message: response.data.message }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Login failed'
        dispatch({ type: 'SET_ERROR', payload: errorMessage })
        return { success: false, message: errorMessage }
      }
    },
    [setAuthToken]
  )

  // Register user
  const signup = useCallback(
    async (name, email, password) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })
        const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
          name,
          email,
          password
        })

        dispatch({
          type: 'SIGNUP_SUCCESS',
          payload: {
            user: response.data.user,
            token: response.data.token
          }
        })

        setAuthToken(response.data.token)
        return { success: true, message: response.data.message }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Signup failed'
        dispatch({ type: 'SET_ERROR', payload: errorMessage })
        return { success: false, message: errorMessage }
      }
    },
    [setAuthToken]
  )

  // Logout user
  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' })
    setAuthToken(null)
  }, [setAuthToken])

  // Clear errors
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' })
  }, [])

  // Update profile
  const updateProfile = useCallback(async (name, email) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await axios.put(`${API_BASE_URL}/auth/profile`, {
        name,
        email
      })

      dispatch({ type: 'USER_LOADED', payload: response.data.user })
      return { success: true, message: response.data.message }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Profile update failed'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      return { success: false, message: errorMessage }
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const value = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    login,
    signup,
    logout,
    clearError,
    updateProfile
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
