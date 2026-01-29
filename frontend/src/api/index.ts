/**
 * API Module Index
 * Central export point for all API endpoints
 */

export { default as apiClient } from './client'
export * from './types'

// Export all API endpoints
export { propertiesApi } from './endpoints/properties'
export { blogsApi } from './endpoints/blogs'
export { testimonialsApi } from './endpoints/testimonials'
export { agentsApi } from './endpoints/agents'
export { authApi } from './endpoints/auth'

// Export types from endpoints
export type { GetPropertiesParams } from './endpoints/properties'
export type { GetBlogsParams } from './endpoints/blogs'
export type { AgentRegistrationData, AgentRegistrationResponse } from './endpoints/agents'
export type { LoginCredentials, LoginResponse } from './endpoints/auth'

