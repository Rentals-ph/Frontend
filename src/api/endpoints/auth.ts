import apiClient from '../client'

/**
 * Authentication API endpoints
 */

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface LoginResponse {
  success: boolean
  message: string
  data?: {
    token?: string
    role?: string
    user?: {
      id: number
      name?: string
      first_name?: string
      last_name?: string
      email: string
      status?: string
      role?: string
    }
    agent?: {
      id: number
      name?: string
      first_name?: string
      last_name?: string
      email: string
      status?: string
      role?: string
    }
    admin?: {
      id: number
      name?: string
      first_name?: string
      last_name?: string
      email: string
      status?: string
      role?: string
    }
  }
  errors?: Record<string, string[]>
}

export interface RegisterCredentials {
  email: string
  password: string
}

export interface RegisterResponse {
  success: boolean
  message: string
  data?: {
    id: number
    email: string
  }
  errors?: Record<string, string[]>
}

export const authApi = {
  /**
   * Login user (agent or admin)
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>('/login', credentials)
      return response.data
    } catch (error: any) {
      console.error('Login API call error:', error)
      throw error
    }
  },

  /**
   * Login admin (uses unified login endpoint)
   */
  adminLogin: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>('/login', credentials)
      return response.data
    } catch (error: any) {
      console.error('Admin login API call error:', error)
      throw error
    }
  },

  /**
   * Register a new user (simplified - only email and password)
   */
  register: async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
    try {
      const response = await apiClient.post<RegisterResponse>('/register', credentials)
      return response.data
    } catch (error: any) {
      console.error('Register API call error:', error)
      throw error
    }
  },
}

