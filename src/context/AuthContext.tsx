import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'
import { apiClient } from '../utils/apiClient'
import { validateEmail, validatePassword, validateName, sanitizeInput } from '../utils/validation'

// Types
export interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  role: 'user' | 'agent' | 'admin'
  verified: boolean
  preferences: {
    propertyTypes: string[]
    locations: string[]
    priceRange: {
      min: number
      max: number
    }
    notifications: {
      email: boolean
      sms: boolean
      push: boolean
    }
  }
  createdAt: string
  lastLogin: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'CLEAR_ERROR' }

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null,
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

interface AuthContextType {
  state: AuthState
  dispatch: React.Dispatch<AuthAction>
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  clearError: () => void
}

interface RegisterData {
  name: string
  email: string
  phone: string
  password: string
  role: 'user' | 'agent'
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Rehydrate auth state from storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('auth:user')
      if (stored) {
        const user: User = JSON.parse(stored)
        dispatch({ type: 'LOGIN_SUCCESS', payload: user })
      }
    } catch {
      // ignore
    }
  }, [])

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' })
    
    try {
      // Validate inputs
      if (!validateEmail(email)) {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Please enter a valid email address' })
        return
      }
      
      if (!password.trim()) {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Password is required' })
        return
      }
      
      // Sanitize inputs
      const sanitizedEmail = sanitizeInput(email.toLowerCase())
      const sanitizedPassword = sanitizeInput(password)
      
      try {
        // Use real API authentication
        const response = await apiClient.login(sanitizedEmail, sanitizedPassword)
        
        if (response.success && response.data) {
          const { user, token } = response.data
          
          // Store token and user data
          localStorage.setItem('auth:token', token)
          localStorage.setItem('auth:user', JSON.stringify(user))
          
          dispatch({ type: 'LOGIN_SUCCESS', payload: user })
          return
        } else {
          dispatch({ type: 'LOGIN_FAILURE', payload: response.error || 'Login failed' })
          return
        }
      } catch (apiError) {
        console.error('Login API error:', apiError)
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Login failed. Please check your connection and try again.' })
        return
      }
      
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Login failed. Please try again.' })
    }
  }

  const register = async (userData: RegisterData) => {
    dispatch({ type: 'LOGIN_START' })
    
    try {
      // Validate inputs
      const nameValidation = validateName(userData.name)
      if (!nameValidation.isValid) {
        dispatch({ type: 'LOGIN_FAILURE', payload: nameValidation.errors[0].message })
        return
      }
      
      if (!validateEmail(userData.email)) {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Please enter a valid email address' })
        return
      }
      
      const passwordValidation = validatePassword(userData.password)
      if (!passwordValidation.isValid) {
        dispatch({ type: 'LOGIN_FAILURE', payload: passwordValidation.errors[0].message })
        return
      }
      
      // Sanitize inputs
      const sanitizedData = {
        name: sanitizeInput(userData.name.trim()),
        email: sanitizeInput(userData.email.toLowerCase()),
        phone: sanitizeInput(userData.phone),
        password: sanitizeInput(userData.password),
        role: userData.role,
      }
      
      try {
        // Use real API registration
        const response = await apiClient.register(sanitizedData)
        
        if (response.success && response.data) {
          const { user, token } = response.data
          
          // Store token and user data
          localStorage.setItem('auth:token', token)
          localStorage.setItem('auth:user', JSON.stringify(user))
          
          dispatch({ type: 'LOGIN_SUCCESS', payload: user })
          return
        } else {
          dispatch({ type: 'LOGIN_FAILURE', payload: response.error || 'Registration failed' })
          return
        }
      } catch (apiError) {
        console.error('Registration API error:', apiError)
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Registration failed. Please check your connection and try again.' })
        return
      }
      
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Registration failed. Please try again.' })
    }
  }

  const logout = async () => {
    try {
      // Try to logout from API
      await apiClient.logout()
    } catch (error) {
      // Ignore API errors for logout
      console.warn('API logout failed:', error)
    }
    
    dispatch({ type: 'LOGOUT' })
    try {
      localStorage.removeItem('auth:user')
      localStorage.removeItem('auth:token')
    } catch {}
  }

  const updateUser = async (userData: Partial<User>) => {
    try {
      // Try API call first
      const response = await apiClient.updateProfile(userData)
      
      if (response.success && response.data) {
        dispatch({ type: 'UPDATE_USER', payload: response.data })
        localStorage.setItem('auth:user', JSON.stringify(response.data))
        return
      }
    } catch (apiError) {
      // If API fails, fall back to local update
      console.warn('API not available, using local update:', apiError)
    }
    
    // Fallback to local update
    dispatch({ type: 'UPDATE_USER', payload: userData })
    try {
      const stored = localStorage.getItem('auth:user')
      if (stored) {
        const current: User = JSON.parse(stored)
        const updated = { ...current, ...userData }
        localStorage.setItem('auth:user', JSON.stringify(updated))
      }
    } catch {}
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value = {
    state,
    dispatch,
    login,
    register,
    logout,
    updateUser,
    clearError,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}


