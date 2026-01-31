import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { getApiBaseUrl } from '../config/api'

// Get API base URL (respects USE_LOCAL_API env var to switch between local and remote)
const API_BASE_URL = getApiBaseUrl()

// Log the API URL being used (helpful for debugging)
if (typeof window !== 'undefined') {
  console.log('API Base URL:', API_BASE_URL)
}

/**
 * Create and configure the Axios instance
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
})

/**
 * Request interceptor for adding auth tokens, logging, etc.
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

/**
 * Response interceptor for error handling
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle network errors (backend not running, CORS, etc.)
    if (!error.response) {
      console.error('Network Error:', {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
      })
      
      // Provide helpful error message with actual API URL being used
      const backendUrl = API_BASE_URL.startsWith('/') 
        ? 'http://127.0.0.1:8000' 
        : API_BASE_URL.replace('/api', '') || API_BASE_URL
      const networkError = new Error(
        `Unable to connect to the API server at ${backendUrl}. Error: ${error.message}`
      )
      return Promise.reject(networkError)
    }
    
    // Handle common HTTP errors
    if (error.response.status === 401) {
      // Handle unauthorized - clear token, redirect to login
      localStorage.removeItem('auth_token')
      // You can add redirect logic here if needed
    }
    
    // Log error for debugging
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data,
    })
    
    return Promise.reject(error)
  }
)

export default apiClient

