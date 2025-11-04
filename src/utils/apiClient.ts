import { config } from './config'
import { firebaseAuth } from '../services/firebaseAuth'
import { firebaseProperties } from '../services/firebaseProperties'

export interface ApiResponse<T = any> {
  data?: T
  message?: string
  success: boolean
  error?: string
}

export interface ApiError {
  message: string
  status: number
  data?: any
}

class ApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>
  private useFirebase: boolean

  constructor() {
    this.baseURL = config.apiBaseUrl || ''
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
    // Use Firebase if no API base URL is configured
    this.useFirebase = !config.apiBaseUrl || config.apiBaseUrl === ''
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // If no API base URL is configured, throw error
    if (!this.baseURL || this.baseURL === '') {
      throw new Error('API not configured. Please set VITE_API_BASE_URL environment variable.')
    }
    
    const url = `${this.baseURL}${endpoint}`
    
    // Get auth token from localStorage
    const token = localStorage.getItem('auth:token')
    
    const headers = {
      ...this.defaultHeaders,
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Server returned non-JSON response: ${response.status}`)
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<ApiResponse<{ user: any; token: string }>> {
    try {
      return await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
    } catch (error) {
      return {
        success: false,
        error: 'Unable to connect to server. Please try again later.'
      }
    }
  }

  async register(userData: {
    name: string
    email: string
    phone: string
    password: string
    role: 'user' | 'agent'
  }): Promise<ApiResponse<{ user: any; token: string }>> {
    try {
      return await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      })
    } catch (error) {
      return {
        success: false,
        error: 'Unable to connect to server. Please try again later.'
      }
    }
  }

  async logout(): Promise<ApiResponse> {
    if (this.useFirebase) {
      try {
        await firebaseAuth.logout()
        return { success: true }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Logout failed'
        }
      }
    }
    
    return this.request('/auth/logout', {
      method: 'POST',
    })
  }

  async getCurrentUser(): Promise<ApiResponse<any>> {
    if (this.useFirebase) {
      try {
        const user = await firebaseAuth.getCurrentUser()
        return {
          success: true,
          data: user
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to get user'
        }
      }
    }
    
    return this.request('/auth/me')
  }

  async updateProfile(userData: any): Promise<ApiResponse<any>> {
    if (this.useFirebase) {
      try {
        const updatedUser = await firebaseAuth.updateUser(userData.id, userData)
        return {
          success: true,
          data: updatedUser
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Update failed'
        }
      }
    }
    
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  }

  // Property endpoints
  async getProperties(params?: {
    page?: number
    limit?: number
    type?: string
    transactionType?: string
    city?: string
    minPrice?: number
    maxPrice?: number
    bedrooms?: number
    bathrooms?: number
    search?: string
  }): Promise<ApiResponse<{ properties: any[]; total: number; page: number; limit: number }>> {
    if (this.useFirebase) {
      try {
        const result = await firebaseProperties.getProperties(params)
        return {
          success: true,
          data: result
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to fetch properties'
        }
      }
    }
    
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString())
        }
      })
    }
    
    const query = queryParams.toString()
    return this.request(`/properties${query ? `?${query}` : ''}`)
  }

  async getProperty(id: string): Promise<ApiResponse<any>> {
    return this.request(`/properties/${id}`)
  }

  async createProperty(propertyData: any): Promise<ApiResponse<any>> {
    return this.request('/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    })
  }

  async updateProperty(id: string, propertyData: any): Promise<ApiResponse<any>> {
    return this.request(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(propertyData),
    })
  }

  async deleteProperty(id: string): Promise<ApiResponse> {
    return this.request(`/properties/${id}`, {
      method: 'DELETE',
    })
  }

  // Contact endpoints
  async sendContactMessage(messageData: {
    name: string
    email: string
    phone: string
    subject: string
    message: string
    propertyId?: string
  }): Promise<ApiResponse> {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(messageData),
    })
  }

  // Newsletter endpoints
  async subscribeNewsletter(email: string): Promise<ApiResponse> {
    return this.request('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async unsubscribeNewsletter(email: string): Promise<ApiResponse> {
    return this.request('/newsletter/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  // Favorites endpoints
  async getFavorites(): Promise<ApiResponse<any[]>> {
    return this.request('/favorites')
  }

  async addToFavorites(propertyId: string): Promise<ApiResponse> {
    return this.request('/favorites', {
      method: 'POST',
      body: JSON.stringify({ propertyId }),
    })
  }

  async removeFromFavorites(propertyId: string): Promise<ApiResponse> {
    return this.request(`/favorites/${propertyId}`, {
      method: 'DELETE',
    })
  }

  // Get user's properties
  async getUserProperties(): Promise<ApiResponse<any[]>> {
    try {
      return await this.request('/properties/user/my-properties')
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user properties'
      }
    }
  }
}

export const apiClient = new ApiClient()
