import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'
import { apiClient } from '../utils/apiClient'
import { validateEmail, validatePassword, validateName, sanitizeInput } from '../utils/validation'
import { localAuth } from '../services/localAuth'

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
      return { ...state, loading: true, error: null }
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload, isAuthenticated: true, loading: false, error: null }
    case 'LOGIN_FAILURE':
      return { ...state, user: null, isAuthenticated: false, loading: false, error: action.payload }
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, loading: false, error: null }
    case 'UPDATE_USER':
      return { ...state, user: state.user ? { ...state.user, ...action.payload } : null }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
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

function isFirebaseConfigured(): boolean {
  try {
    // Dynamic check to avoid import errors
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
    return !!(apiKey && !apiKey.startsWith('your-'))
  } catch {
    return false
  }
}

function normalizeUser(raw: any): User {
  return {
    id: raw.id || raw.uid || '',
    name: raw.name || raw.displayName || '',
    email: raw.email || '',
    phone: raw.phone || raw.phoneNumber || '',
    avatar: raw.avatar || raw.photoURL || '',
    role: raw.role || 'user',
    verified: raw.verified ?? raw.emailVerified ?? false,
    preferences: raw.preferences || {
      propertyTypes: [],
      locations: [],
      priceRange: { min: 0, max: 10000000 },
      notifications: { email: true, sms: false, push: true },
    },
    createdAt: raw.createdAt || new Date().toISOString(),
    lastLogin: raw.lastLogin || new Date().toISOString(),
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

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

    if (!validateEmail(email)) {
      const msg = 'Please enter a valid email address'
      dispatch({ type: 'LOGIN_FAILURE', payload: msg })
      throw new Error(msg)
    }
    if (!password.trim()) {
      const msg = 'Password is required'
      dispatch({ type: 'LOGIN_FAILURE', payload: msg })
      throw new Error(msg)
    }

    const sanitizedEmail = sanitizeInput(email.toLowerCase())
    const sanitizedPassword = sanitizeInput(password)

    // Try Firebase if configured
    if (isFirebaseConfigured()) {
      try {
        const { firebaseAuth } = await import('../services/firebaseAuth')
        const result = await firebaseAuth.login(sanitizedEmail, sanitizedPassword)
        if (result.success && result.user) {
          const user = normalizeUser(result.user)
          localStorage.setItem('auth:token', result.token || 'firebase-token')
          localStorage.setItem('auth:user', JSON.stringify(user))
          dispatch({ type: 'LOGIN_SUCCESS', payload: user })
          return
        }
        const msg = result.error || 'Login failed'
        dispatch({ type: 'LOGIN_FAILURE', payload: msg })
        throw new Error(msg)
      } catch (err: any) {
        if (err.message && err.message !== 'Login failed') throw err
      }
    }

    // Fallback: local storage auth
    const result = await localAuth.login(sanitizedEmail, sanitizedPassword)
    if (result.success && result.user) {
      const user = normalizeUser(result.user)
      localStorage.setItem('auth:token', result.token || 'local-token')
      localStorage.setItem('auth:user', JSON.stringify(user))
      dispatch({ type: 'LOGIN_SUCCESS', payload: user })
      return
    }
    const msg = result.error || 'Invalid email or password'
    dispatch({ type: 'LOGIN_FAILURE', payload: msg })
    throw new Error(msg)
  }

  const register = async (userData: RegisterData) => {
    dispatch({ type: 'LOGIN_START' })

    const nameValidation = validateName(userData.name)
    if (!nameValidation.isValid) {
      const msg = nameValidation.errors[0].message
      dispatch({ type: 'LOGIN_FAILURE', payload: msg })
      throw new Error(msg)
    }
    if (!validateEmail(userData.email)) {
      const msg = 'Please enter a valid email address'
      dispatch({ type: 'LOGIN_FAILURE', payload: msg })
      throw new Error(msg)
    }
    const passwordValidation = validatePassword(userData.password)
    if (!passwordValidation.isValid) {
      const msg = passwordValidation.errors[0].message
      dispatch({ type: 'LOGIN_FAILURE', payload: msg })
      throw new Error(msg)
    }

    const sanitizedData = {
      name: sanitizeInput(userData.name.trim()),
      email: sanitizeInput(userData.email.toLowerCase()),
      phone: sanitizeInput(userData.phone),
      password: sanitizeInput(userData.password),
      role: userData.role,
    }

    // Try Firebase if configured
    if (isFirebaseConfigured()) {
      try {
        const { firebaseAuth } = await import('../services/firebaseAuth')
        const result = await firebaseAuth.register(sanitizedData)
        if (result.success && result.user) {
          const user = normalizeUser(result.user)
          localStorage.setItem('auth:token', result.token || 'firebase-token')
          localStorage.setItem('auth:user', JSON.stringify(user))
          dispatch({ type: 'LOGIN_SUCCESS', payload: user })
          return
        }
        const msg = result.error || 'Registration failed'
        dispatch({ type: 'LOGIN_FAILURE', payload: msg })
        throw new Error(msg)
      } catch (err: any) {
        if (err.message && err.message !== 'Registration failed') throw err
      }
    }

    // Fallback: local storage auth
    const result = await localAuth.register(sanitizedData)
    if (result.success && result.user) {
      const user = normalizeUser(result.user)
      localStorage.setItem('auth:token', result.token || 'local-token')
      localStorage.setItem('auth:user', JSON.stringify(user))
      dispatch({ type: 'LOGIN_SUCCESS', payload: user })
      return
    }
    const msg = result.error || 'Registration failed'
    dispatch({ type: 'LOGIN_FAILURE', payload: msg })
    throw new Error(msg)
  }

  const logout = async () => {
    try {
      await apiClient.logout()
    } catch {
      // ignore
    }
    try {
      await localAuth.logout()
    } catch {
      // ignore
    }
    dispatch({ type: 'LOGOUT' })
    try {
      localStorage.removeItem('auth:user')
      localStorage.removeItem('auth:token')
    } catch {}
  }

  const updateUser = async (userData: Partial<User>) => {
    try {
      const response = await apiClient.updateProfile(userData)
      if (response.success && response.data) {
        dispatch({ type: 'UPDATE_USER', payload: response.data })
        localStorage.setItem('auth:user', JSON.stringify(response.data))
        return
      }
    } catch {
      // fall through to local update
    }
    dispatch({ type: 'UPDATE_USER', payload: userData })
    try {
      const stored = localStorage.getItem('auth:user')
      if (stored) {
        const current: User = JSON.parse(stored)
        localStorage.setItem('auth:user', JSON.stringify({ ...current, ...userData }))
      }
    } catch {}
  }

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' })

  return (
    <AuthContext.Provider value={{ state, dispatch, login, register, logout, updateUser, clearError }}>
      {children}
    </AuthContext.Provider>
  )
}
