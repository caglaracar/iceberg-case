import axios, { type AxiosInstance } from 'axios'

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
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        hasApiKey: !!apiKey,
        apiKeyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'MISSING'
      })
    }
    
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors and responses
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data
      })
    }
    
    return response
  },
  (error) => {
    // Handle different error scenarios
    const errorMessage = error.response?.data?.error?.message || error.message
    const statusCode = error.response?.status
    
    console.error('❌ API Error:', {
      status: statusCode,
      message: errorMessage,
      url: error.config?.url
    })
    
    // Handle specific HTTP status codes
    switch (statusCode) {
      case 401:
        console.error('🔒 Authentication failed - check API key')
        break
      case 403:
        console.error('🚫 Access forbidden - insufficient permissions')
        break
      case 404:
        console.error('🔍 Resource not found')
        break
      case 422:
        console.error('📝 Validation error')
        break
      case 429:
        console.error('⏱️ Rate limit exceeded - wait 30 seconds')
        break
      case 500:
        console.error('🔧 Server error')
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
