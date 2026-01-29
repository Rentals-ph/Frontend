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
    user?: {
      id: number
      name: string
      email: string
      status?: string
    }
  }
  errors?: Record<string, string[]>
}

export const authApi = {
  /**
   * Login agent
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials)
      return response.data
    } catch (error: any) {
      console.error('Login API call error:', error)
      throw error
    }
  },
}

