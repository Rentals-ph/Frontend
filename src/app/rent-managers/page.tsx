'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import PageHeader from '../../components/layout/PageHeader'
import { agentsApi, propertiesApi } from '../../api'
import { getApiBaseUrl } from '../../config/api'
import type { Property } from '../../types'
import type { Agent } from '../../api/endpoints/agents'
import type { PaginatedResponse } from '../../api/types'
import './page.css'

// Helper function to get agent image URL
const getAgentImageUrl = (imagePath: string | null | undefined): string | null => {
  if (!imagePath) return null
  
  // If it's already a full URL, return it
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  
  // If it starts with /storage, it's a Laravel storage path
  if (imagePath.startsWith('/storage') || imagePath.startsWith('storage/')) {
    const baseUrl = getApiBaseUrl().replace('/api', '')
    return `${baseUrl}/${imagePath.startsWith('/') ? imagePath.slice(1) : imagePath}`
  }
  
  // Otherwise, assume it's a relative path from storage
  const baseUrl = getApiBaseUrl().replace('/api', '')
  return `${baseUrl}/storage/${imagePath}`
}

// Helper function to get initials for fallback avatar
const getInitials = (name: string): string => {
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

interface RentManagerInfo {
  id: number
  name: string
  role: string
  location: string
  listings: number
  email: string
  phone?: string
  image?: string | null
}

export default function RentManagersPage() {
  const router = useRouter()
  const [managers, setManagers] = useState<RentManagerInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showStickySearch, setShowStickySearch] = useState(false)

  useEffect(() => {
    const fetchRentManagers = async () => {
      try {
        // Fetch agents from the backend
        const agents = await agentsApi.getAll()
        
        // Also fetch properties to get location information for agents without city/state
        const propertiesResponse = await propertiesApi.getAll()
        
        // Handle both array response and paginated response
        const properties: Property[] = Array.isArray(propertiesResponse)
          ? propertiesResponse
          : (propertiesResponse as PaginatedResponse<Property>).data || []
        
        // Create a map of agent IDs to their property locations
        const agentLocationsMap = new Map<number, string[]>()
        properties.forEach(property => {
          // Handle both agent (new) and rent_manager (legacy) formats
          const agentId = (property as any).agent_id || (property as any).agent?.id || property.rent_manager?.id
          if (agentId && property.location) {
            if (!agentLocationsMap.has(agentId)) {
              agentLocationsMap.set(agentId, [])
            }
            agentLocationsMap.get(agentId)!.push(property.location)
          }
        })

        // Convert agents to RentManagerInfo format
        const managersList: RentManagerInfo[] = agents.map(agent => {
          // Get location from agent's city/state or from their properties
          const propertyLocations = agentLocationsMap.get(agent.id) || []
          const uniqueLocations = Array.from(new Set(propertyLocations))
          const primaryLocation = agent.city || agent.state || uniqueLocations[0] || 'N/A'
          
          // Get image from agent (check multiple possible field names)
          const agentImage = agent.image || agent.avatar || agent.profile_image
          
          // Construct name from full_name, or first_name + last_name, or fallback
          const agentName = agent.full_name || 
            (agent.first_name || agent.last_name 
              ? `${agent.first_name || ''} ${agent.last_name || ''}`.trim()
              : 'Unknown Agent')
          
          return {
            id: agent.id,
            name: agentName,
            role: 'Rent Manager', // All agents from backend are approved, so they're rent managers
            location: primaryLocation,
            listings: agent.properties_count || 0,
            email: agent.email,
            phone: agent.phone ?? undefined,
            image: agentImage,
          }
        })

        setManagers(managersList)
      } catch (error) {
        console.error('Error fetching rent managers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRentManagers()
  }, [])

  // Filter managers based on search and location
  const filteredManagers = managers.filter(manager => {
    const matchesSearch = !searchQuery || 
      manager.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manager.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesProvince = !selectedProvince || 
      manager.location.toLowerCase().includes(selectedProvince.toLowerCase())
    
    const matchesCity = !selectedCity || 
      manager.location.toLowerCase().includes(selectedCity.toLowerCase())
    
    return matchesSearch && matchesProvince && matchesCity
  })

  // Get unique locations for filter dropdowns
  const uniqueLocations = Array.from(new Set(managers.map(m => m.location))).sort()

  // Sticky search bar visibility on scroll
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    const handleScroll = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        const searchFilters = document.querySelector('.search-filters')
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        
        if (searchFilters) {
          const searchFiltersRect = searchFilters.getBoundingClientRect()
          // Show sticky bar when search filters scroll out of view
          if (searchFiltersRect.bottom < 0 && scrollTop > 200) {
            setShowStickySearch(true)
          } else if (scrollTop <= 200) {
            setShowStickySearch(false)
          } else if (searchFiltersRect.bottom >= 0) {
            setShowStickySearch(false)
          }
        }
      }, 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timeoutId)
    }
  }, [])

  const features = [
    {
      id: 1,
      title: 'Property Management',
      description: 'Expert handling of property listings, maintenance coordination, and tenant relations.',
      icon: '🏠',
    },
    {
      id: 2,
      title: 'Tenant Screening',
      description: 'Thorough background checks and verification to ensure reliable tenants.',
      icon: '🔍',
    },
    {
      id: 3,
      title: 'Professional Service',
      description: 'Licensed and verified managers committed to quality service.',
      icon: '💼',
    },
    {
      id: 4,
      title: 'Legal Compliance',
      description: 'Ensuring all rental agreements meet legal requirements and standards.',
      icon: '📄',
    },
  ]

  return (
    <div className="rent-managers-page">
      <Navbar />

      <PageHeader title="RENT MANAGERS" />

      <main className="managers-main-content">
        <section className="what-are-rm-section">
          <h2 className="what-are-rm-title">What are Rent Managers?</h2>
          <p className="what-are-rm-text">
            Rent Managers are trusted professionals who help property owners manage their rental properties and assist tenants in finding their perfect home. They handle everything from property listings to tenant screening, making the rental process smooth and stress-free for everyone involved.
          </p>
          
          <div className="features-grid">
            {features.map((feature) => (
              <div key={feature.id} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="find-rm-section">
          <h2 className="find-rm-title">FIND A RENT MANAGERS</h2>
          
          <div className="search-filters">
            <div className="search-input-wrapper">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 19L14.65 14.65" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input 
                type="text" 
                placeholder="Search here..." 
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select 
              className="filter-select"
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
            >
              <option value="">Province</option>
              {uniqueLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
            <select 
              className="filter-select"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">City</option>
              {uniqueLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
            {/* View Mode Toggle */}
            <div className="view-mode-controls">
              <button
                className="hamburger-menu-btn"
                aria-label="List View"
                onClick={() => setViewMode('list')}
                style={{ backgroundColor: viewMode === 'list' ? '#FE8E0A' : '#ffffff' }}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 12H21M3 6H21M3 18H21" stroke={viewMode === 'list' ? "#ffffff" : "#333"} strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <button
                className="grid-view-btn"
                aria-label="Grid View"
                onClick={() => setViewMode('grid')}
                style={{ backgroundColor: viewMode === 'grid' ? '#FE8E0A' : '#ffffff' }}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="7" height="7" stroke={viewMode === 'grid' ? "#ffffff" : "#333"} strokeWidth="2" fill="none" />
                  <rect x="14" y="3" width="7" height="7" stroke={viewMode === 'grid' ? "#ffffff" : "#333"} strokeWidth="2" fill="none" />
                  <rect x="3" y="14" width="7" height="7" stroke={viewMode === 'grid' ? "#ffffff" : "#333"} strokeWidth="2" fill="none" />
                  <rect x="14" y="14" width="7" height="7" stroke={viewMode === 'grid' ? "#ffffff" : "#333"} strokeWidth="2" fill="none" />
                </svg>
              </button>
            </div>
          </div>

          {/* Sticky Search Bar */}
          <div className={`sticky-search-filters-container ${showStickySearch ? 'visible' : ''}`}>
            <div className="sticky-search-filters">
              <div className="search-input-wrapper">
                <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 19L14.65 14.65" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input 
                  type="text" 
                  placeholder="Search here..." 
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select 
                className="filter-select"
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
              >
                <option value="">Province</option>
                {uniqueLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              <select 
                className="filter-select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">City</option>
                {uniqueLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              {/* View Mode Toggle */}
              <div className="view-mode-controls">
                <button
                  className="hamburger-menu-btn"
                  aria-label="List View"
                  onClick={() => setViewMode('list')}
                  style={{ backgroundColor: viewMode === 'list' ? '#FE8E0A' : '#ffffff' }}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 12H21M3 6H21M3 18H21" stroke={viewMode === 'list' ? "#ffffff" : "#333"} strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
                <button
                  className="grid-view-btn"
                  aria-label="Grid View"
                  onClick={() => setViewMode('grid')}
                  style={{ backgroundColor: viewMode === 'grid' ? '#FE8E0A' : '#ffffff' }}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="7" height="7" stroke={viewMode === 'grid' ? "#ffffff" : "#333"} strokeWidth="2" fill="none" />
                    <rect x="14" y="3" width="7" height="7" stroke={viewMode === 'grid' ? "#ffffff" : "#333"} strokeWidth="2" fill="none" />
                    <rect x="3" y="14" width="7" height="7" stroke={viewMode === 'grid' ? "#ffffff" : "#333"} strokeWidth="2" fill="none" />
                    <rect x="14" y="14" width="7" height="7" stroke={viewMode === 'grid' ? "#ffffff" : "#333"} strokeWidth="2" fill="none" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>Loading rent managers...</p>
            </div>
          ) : filteredManagers.length > 0 ? (
            <div className="managers-layout">
              <div className={viewMode === 'grid' ? 'managers-grid' : 'managers-list'}>
                {filteredManagers.map((manager) => (
                <div
                  key={manager.id}
                  className={`manager-card ${viewMode === 'list' ? 'manager-card-list' : ''}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => router.push(`/rent-managers/${manager.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      router.push(`/rent-managers/${manager.id}`)
                    }
                  }}
                >
                  <div className="manager-profile-picture-container">
                    <div className="manager-profile-picture">
                      {manager.image ? (
                        <img 
                          src={getAgentImageUrl(manager.image) || ''} 
                          alt={manager.name}
                          onError={(e) => {
                            // Fallback to initials if image fails to load
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            const fallback = target.nextElementSibling as HTMLElement
                            if (fallback) fallback.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      <div 
                        className="manager-profile-picture-fallback"
                        style={{ display: manager.image ? 'none' : 'flex' }}
                      >
                        <span>{getInitials(manager.name)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="manager-card-content">
                    <div className="manager-card-header">
                      <div className="manager-header-info">
                        <h3 className="manager-name">{manager.name}</h3>
                        <p className="manager-role">{manager.role}</p>
                      </div>
                      <button
                        className="listings-button"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/rent-managers/${manager.id}`)
                        }}
                      >
                        {manager.listings} Listings
                      </button>
                    </div>
                    
                    <div className="manager-separator"></div>
                    
                    <div className="manager-card-body">
                      {manager.phone && (
                        <div className="manager-contact-row">
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.5 2C2.67 2 2 2.67 2 3.5V12.5C2 13.33 2.67 14 3.5 14H12.5C13.33 14 14 13.33 14 12.5V3.5C14 2.67 13.33 2 12.5 2H3.5ZM3.5 3H12.5C12.78 3 13 3.22 13 3.5V12.5C13 12.78 12.78 13 12.5 13H3.5C3.22 13 3 12.78 3 12.5V3.5C3 3.22 3.22 3 3.5 3Z" stroke="#000" strokeWidth="1.5" fill="none"/>
                            <path d="M6 5H10" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
                            <path d="M6 7H12" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                          <span className="contact-text">{manager.phone}</span>
                          <svg className="whatsapp-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="#25D366"/>
                          </svg>
                        </div>
                      )}
                      <div className="manager-contact-row">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 3C2 2.45 2.45 2 3 2H13C13.55 2 14 2.45 14 3V13C14 13.55 13.55 14 13 14H3C2.45 14 2 13.55 2 13V3ZM3 3V13H13V3H3Z" stroke="#000" strokeWidth="1.5" fill="none"/>
                          <path d="M3 4L8 8L13 4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="contact-text">{manager.email}</span>
                      </div>
                      <div className="manager-contact-row">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 1C5.13 1 2 4.13 2 8C2 11.87 5.13 15 9 15C12.87 15 16 11.87 16 8C16 4.13 12.87 1 9 1ZM9 13C6.24 13 4 10.76 4 8C4 5.24 6.24 3 9 3C11.76 3 14 5.24 14 8C14 10.76 11.76 13 9 13Z" stroke="#000" strokeWidth="1.5" fill="none"/>
                          <path d="M9 4C7.34 4 6 5.34 6 7C6 8.66 7.34 10 9 10C10.66 10 12 8.66 12 7C12 5.34 10.66 4 9 4Z" stroke="#000" strokeWidth="1.5" fill="none"/>
                        </svg>
                        <span className="contact-text">{manager.location}</span>
                      </div>
                      <div className="view-listing-container">
                        <Link
                          href={`/rent-managers/${manager.id}`}
                          className="view-listing-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View My Listing
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 12L10 8L6 4" stroke="#205ED7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                ))}
              </div>

              <div className="recently-visited-sidebar">
                <h3 className="sidebar-title">Recently Visited Managers</h3>
                {filteredManagers.slice(0, 3).map((manager) => (
                  <div key={manager.id} className="recent-manager-item">
                    <div className="recent-manager-avatar">
                      {manager.image ? (
                        <img 
                          src={getAgentImageUrl(manager.image) || ''} 
                          alt={manager.name}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            const fallback = target.nextElementSibling as HTMLElement
                            if (fallback) fallback.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      <div 
                        className="recent-manager-avatar-fallback"
                        style={{ display: manager.image ? 'none' : 'flex' }}
                      >
                        <span>{getInitials(manager.name)}</span>
                      </div>
                    </div>
                    <div className="recent-manager-info">
                      <h4 className="recent-manager-name">{manager.name}</h4>
                      <p className="recent-manager-role">{manager.role}</p>
                      <p className="recent-manager-email">{manager.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>No rent managers found matching your criteria.</p>
            </div>
          )}

          <div className="pagination">
            <button className="pagination-arrow">←</button>
            <button className="pagination-number active">1</button>
            <button className="pagination-number">2</button>
            <button className="pagination-number">3</button>
            <span className="pagination-ellipsis">...</span>
            <button className="pagination-number">50</button>
            <button className="pagination-arrow">→</button>
          </div>
        </section>

      </main>

      <section className="become-rm-section">
        <div className="become-rm-container">
          <h2 className="become-rm-title">Become a Rental Manager here!</h2>
          <p className="become-rm-text">
            Join us together with the most trusted managers to help people find their perfect home.
          </p>
          <button className="become-rm-button">Join now!</button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
