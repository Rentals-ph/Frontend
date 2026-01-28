export interface Property {
  id: number
  title: string
  description: string
  type: string
  location: string
  price: number
  bedrooms: number
  bathrooms: number
  area: number | null
  image: string | null
  is_featured: boolean
  rent_manager?: RentManager
  published_at: string | null
}

export interface RentManager {
  id: number
  name: string
  email: string
  is_official: boolean
}

export interface Testimonial {
  id: number
  name: string
  role: string
  content: string
  avatar: string | null
}

export interface Blog {
  id: number
  title: string
  content: string
  excerpt: string
  category: string
  read_time: number
  author: string
  image: string | null
  published_at: string | null
}

