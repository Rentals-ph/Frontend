const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  errors?: Record<string, string[]>
}

async function getAuthToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = await getAuthToken()
  
  const headers: HeadersInit = {
    'Accept': 'application/json',
    ...options.headers,
  }

  // Only add Authorization header if we have a token
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // For FormData, don't set Content-Type (browser will set it with boundary)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'An error occurred',
        errors: data.errors,
      }
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message,
    }
  } catch (error) {
    console.error('API request failed:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error occurred',
    }
  }
}

export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'GET' }),
  
  post: <T>(endpoint: string, body?: any) => {
    const isFormData = body instanceof FormData
    return apiRequest<T>(endpoint, {
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body),
    })
  },
  
  put: <T>(endpoint: string, body?: any) => {
    const isFormData = body instanceof FormData
    return apiRequest<T>(endpoint, {
      method: 'PUT',
      body: isFormData ? body : JSON.stringify(body),
    })
  },
  
  delete: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'DELETE' }),
}

export default api

