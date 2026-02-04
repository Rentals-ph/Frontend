import apiClient from '../client'
import type { Property } from '../../types'
import type { PaginatedResponse } from '../types'

/**
 * Properties API endpoints
 */

export interface GetPropertiesParams {
  type?: string
  location?: string
  search?: string
  page?: number
  per_page?: number
  agent_id?: number
}

export const propertiesApi = {
  /**
   * Get featured properties
   */
  getFeatured: async (): Promise<Property[]> => {
    const response = await apiClient.get<Property[]>('/properties/featured')
    return response.data
  },

  /**
   * Get all properties with optional filters
   */
  getAll: async (params?: GetPropertiesParams): Promise<Property[] | PaginatedResponse<Property>> => {
    const response = await apiClient.get<Property[] | PaginatedResponse<Property>>('/properties', { params })
    
    // Backend returns paginated response with data, current_page, per_page, total, last_page
    if (Array.isArray(response.data)) {
      return response.data
    }
    
    // Return paginated response if it exists
    return response.data
  },

  /**
   * Get property by ID
   */
  getById: async (id: number): Promise<Property> => {
    const response = await apiClient.get<Property>(`/properties/${id}`)
    return response.data
  },

  /**
   * Create a new property (requires authentication)
   */
  create: async (propertyData: FormData): Promise<{ success: boolean; message: string; data: Property }> => {
    const response = await apiClient.post<{ success: boolean; message: string; data: Property }>('/properties', propertyData)
    return response.data
  },

  /**
   * Create multiple properties at once (bulk create - requires authentication)
   */
  bulkCreate: async (properties: Partial<Property>[]): Promise<{ success: boolean; message: string; data: Property[]; created_count: number }> => {
    const response = await apiClient.post<{ success: boolean; message: string; data: Property[]; created_count: number }>('/properties/bulk', {
      properties,
    })
    return response.data
  },

  /**
   * Get properties by agent ID
   */
  getByAgentId: async (agentId: number): Promise<Property[]> => {
    const response = await apiClient.get<Property[] | PaginatedResponse<Property>>('/properties', { 
      params: { agent_id: agentId } 
    })
    
    // Backend returns paginated response with data, current_page, per_page, total, last_page
    if (Array.isArray(response.data)) {
      return response.data
    }
    
    // Return data array from paginated response
    return (response.data as PaginatedResponse<Property>).data || []
  },
}

