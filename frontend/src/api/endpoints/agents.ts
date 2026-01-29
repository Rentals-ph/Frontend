import apiClient from '../client'

/**
 * Agents API endpoints
 */

export interface AgentRegistrationData {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  dateOfBirth?: string
  agencyName?: string
  officeAddress?: string
  city?: string
  state?: string
  zipCode?: string
  prcLicenseNumber: string
  licenseType: 'broker' | 'salesperson'
  expirationDate: string
  yearsOfExperience?: string
  agreeToTerms: boolean
}

export interface AgentRegistrationResponse {
  success: boolean
  message: string
  data?: {
    id: number
    name: string
    email: string
    status: string
  }
  errors?: Record<string, string[]>
}

export const agentsApi = {
  /**
   * Register a new agent
   */
  register: async (data: AgentRegistrationData, file?: File): Promise<AgentRegistrationResponse> => {
    const formData = new FormData()
    
    // Append all form fields
    formData.append('firstName', data.firstName)
    formData.append('lastName', data.lastName)
    formData.append('email', data.email)
    formData.append('password', data.password)
    if (data.phone) formData.append('phone', data.phone)
    if (data.dateOfBirth) formData.append('dateOfBirth', data.dateOfBirth)
    if (data.agencyName) formData.append('agencyName', data.agencyName)
    if (data.officeAddress) formData.append('officeAddress', data.officeAddress)
    if (data.city) formData.append('city', data.city)
    if (data.state) formData.append('state', data.state)
    if (data.zipCode) formData.append('zipCode', data.zipCode)
    formData.append('prcLicenseNumber', data.prcLicenseNumber)
    formData.append('licenseType', data.licenseType)
    formData.append('expirationDate', data.expirationDate)
    if (data.yearsOfExperience) formData.append('yearsOfExperience', data.yearsOfExperience)
    formData.append('agreeToTerms', data.agreeToTerms.toString())
    
    // Append file if provided
    if (file) {
      formData.append('licenseDocument', file)
    }

    try {
      const response = await apiClient.post<AgentRegistrationResponse>('/agents/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error: any) {
      console.error('API call error:', error)
      throw error
    }
  },
}

