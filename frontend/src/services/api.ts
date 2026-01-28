import axios from 'axios'
import type { Property, Testimonial, Blog } from '../types'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getFeaturedProperties = async (): Promise<Property[]> => {
  const response = await api.get('/properties/featured')
  return response.data
}

export const getProperties = async (params?: {
  type?: string
  location?: string
  search?: string
}): Promise<Property[]> => {
  const response = await api.get('/properties', { params })
  return response.data.data || response.data
}

export const getTestimonials = async (): Promise<Testimonial[]> => {
  const response = await api.get('/testimonials')
  return response.data
}

export const getBlogs = async (): Promise<Blog[]> => {
  const response = await api.get('/blogs')
  return response.data
}

export default api

