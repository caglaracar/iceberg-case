import axios, { type AxiosInstance } from 'axios'
import { notification } from 'ant-design-vue'

// Cookie utilities for JWT
const setCookie = (name: string, value: string, days = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict; Secure=false`
}

const getCookie = (name: string): string | null => {
  const value = document.cookie.split('; ')
    .find(row => row.startsWith(`${name}=`))
    ?.split('=')[1]
  return value ? decodeURIComponent(value) : null
}

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict; Secure=false`
}

// JWT utilities
export const setAuthToken = (token: string) => {
  setCookie('jwt_token', token)
}

export const getAuthToken = (): string | null => {
  return getCookie('jwt_token')
}

export const removeAuthToken = () => {
  deleteCookie('jwt_token')
}

export const isAuthenticated = (): boolean => {
  return !!getAuthToken()
}

// Mock login - sets demo JWT
export const mockLogin = (email: string, password: string): Promise<{ success: boolean; token?: string; message?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (email === 'admin@iceberg.com' && password === 'admin123') {
        const mockToken = btoa(JSON.stringify({
          sub: '1',
          email: 'admin@iceberg.com',
          name: 'Admin User',
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
        }))
        
        setAuthToken(mockToken)
        resolve({ success: true, token: mockToken })
      } else {
        resolve({ success: false, message: 'Invalid credentials' })
      }
    }, 1000)
  })
}

// Mock logout
export const mockLogout = (): Promise<void> => {
  return new Promise((resolve) => {
    removeAuthToken()
    resolve()
  })
}

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - Add authentication
api.interceptors.request.use(
  (config) => {
    // Use Airtable API key for data requests
    const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY
    if (apiKey) {
      config.headers.Authorization = `Bearer ${apiKey}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors and responses
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle different error scenarios
    const errorMessage = error.response?.data?.error?.message || error.message
    const statusCode = error.response?.status
    
    // API error details logged for debugging
    
    // Handle specific HTTP status codes with toast notifications
    switch (statusCode) {
      case 401:
        // Don't show auth errors for Airtable API - JWT is managed separately
        // Only show generic error for data requests
        if (statusCode >= 400) {
          console.warn('API request failed:', errorMessage)
        }
        break
      case 403:
        // Access forbidden
        notification.error({
          message: 'Access Forbidden',
          description: 'You don\'t have permission to perform this action',
          duration: 4
        })
        break
      case 404:
        // Resource not found
        notification.error({
          message: 'Resource Not Found',
          description: 'The requested resource could not be found',
          duration: 4
        })
        break
      case 422:
        // Validation error
        notification.error({
          message: 'Validation Error',
          description: 'Please check your input data',
          duration: 4
        })
        break
      case 429:
        // Rate limit exceeded
        notification.warning({
          message: 'Rate Limit Exceeded',
          description: 'Too many requests. Please wait 30 seconds',
          duration: 6
        })
        break
      case 500:
        // Server error
        notification.error({
          message: 'Server Error',
          description: 'Something went wrong on the server',
          duration: 4
        })
        break
      default:
        if (statusCode >= 400) {
          notification.error({
            message: 'Request Failed',
            description: errorMessage || 'An unexpected error occurred',
            duration: 4
          })
        }
        break
    }
    
    return Promise.reject({
      status: statusCode,
      message: errorMessage,
      originalError: error
    })
  }
)

export default api
