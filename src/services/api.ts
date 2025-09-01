import axios, { type AxiosInstance } from 'axios'
import { notification } from 'ant-design-vue'

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
    const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY
    if (apiKey) {
      config.headers.Authorization = `Bearer ${apiKey}`
    }
    
    return config
  },
  (error) => {
    // Request error logged
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
        // Authentication failed
        notification.error({
          message: 'Authentication Failed',
          description: 'Please check your API key configuration',
          duration: 4
        })
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
