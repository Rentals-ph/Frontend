'use client'

import { useState, useEffect } from 'react'
import AppSidebar from '../../../components/common/AppSidebar'
import AgentHeader from '../../../components/agent/AgentHeader'
import EditPropertyModal from '../../../components/agent/EditPropertyModal'
import { propertiesApi, agentsApi } from '../../../api'
import type { Property } from '../../../types'
import {
  FiCheckCircle,
  FiEye,
  FiHome,
  FiMapPin,
  FiSearch,
  FiSlash
} from 'react-icons/fi'
import { ASSETS } from '@/utils/assets'
import { resolvePropertyImage } from '@/utils/imageResolver'
import PropertiesMap from '../../../components/agent/PropertiesMap'
import './page.css'

type ListingStatus = 'active' | 'rented' | 'hidden'

interface ListingCard {
  id: number
  title: string
  address: string
  rating: number
  views: number
  image: string
  status: ListingStatus
}

export default function AgentMyListings() {
  const [listings, setListings] = useState<ListingCard[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [totalProperties, setTotalProperties] = useState(0)
  const [activeProperties, setActiveProperties] = useState(0)
  const [rentedProperties, setRentedProperties] = useState(0)
  const [hiddenProperties, setHiddenProperties] = useState(0)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentAgentId, setCurrentAgentId] = useState<number | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<string>('all') // 'all' or property type

  useEffect(() => {
    const fetchAgentListings = async () => {
      try {
        // Get current agent
        const agent = await agentsApi.getCurrent()
        
        if (!agent) {
          console.error('No agent found. Please ensure you are logged in.')
          setLoading(false)
          return
        }
        
        if (!agent.id) {
          console.error('Agent ID is missing')
          setLoading(false)
          return
        }
        
        // Store current agent ID for filtering
        setCurrentAgentId(agent.id)
        
        // Fetch properties for this agent
        const properties = await propertiesApi.getByAgentId(agent.id)
        
        // Additional safety check: filter properties to ensure they belong to this agent
        const agentProperties = properties.filter((p: Property) => p.agent_id === agent.id)
        
        if (agentProperties.length !== properties.length) {
          console.warn(`Filtered out ${properties.length - agentProperties.length} properties that don't belong to agent ${agent.id}`)
        }
        
        if (!properties || !Array.isArray(properties)) {
          console.error('Invalid properties response:', properties)
          setLoading(false)
          return
        }
        
        // Store properties for editing (only agent's properties)
        setProperties(agentProperties)
        
        // Transform properties to ListingCard format (only agent's properties)
        const transformedListings: ListingCard[] = agentProperties.map((property: Property) => {
          const address = property.street_address 
            ? `${property.street_address}, ${property.city || property.location || 'N/A'}`
            : property.location || 'Address not available'
          
          // Determine status based on property data
          let status: ListingStatus = 'active'
          if (!property.published_at) {
            status = 'hidden'
          }
          // Note: 'rented' status would need additional property field
          
          // Use image_url if available (from backend), otherwise fall back to resolving image
          // Priority: image_url > image_path > image > placeholder
          let imageUrl = property.image_url
          if (!imageUrl && property.image_path) {
            imageUrl = resolvePropertyImage(property.image_path, property.id)
          }
          if (!imageUrl && property.image) {
            imageUrl = resolvePropertyImage(property.image, property.id)
          }
          if (!imageUrl) {
            imageUrl = resolvePropertyImage(null, property.id)
          }
          
          // Debug logging (remove in production)
          if (property.image_path && !property.image_url) {
            console.log(`Property ${property.id}: image_path=${property.image_path}, image_url=${property.image_url}, resolved=${imageUrl}`)
          }
          
          return {
            id: property.id,
            title: property.title,
            address: address,
            rating: 4, // Default rating, could be fetched from reviews API
            views: 0, // Could be tracked separately
            image: imageUrl,
            status: status
          }
        })
        
        setListings(transformedListings)
        
        // Calculate stats (only agent's properties)
        setTotalProperties(agentProperties.length)
        setActiveProperties(agentProperties.filter(p => p.published_at).length)
        setRentedProperties(0) // Would need additional data
        setHiddenProperties(agentProperties.filter(p => !p.published_at).length)
        
        // Set initial listings (will be filtered by selectedFilter if needed)
        setListings(transformedListings)
      } catch (error: any) {
        console.error('Error fetching agent listings:', error)
        if (error.response?.status === 401) {
          console.error('Unauthorized. Please log in again.')
        } else if (error.response?.status === 404) {
          console.error('Agent not found.')
        } else {
          console.error('Failed to fetch properties:', error.message || error)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAgentListings()
  }, [])

  const handleEditClick = async (listingId: number) => {
    try {
      // Fetch full property details
      const property = await propertiesApi.getById(listingId)
      setEditingProperty(property)
      setIsModalOpen(true)
    } catch (error: any) {
      console.error('Error fetching property details:', error)
      alert('Failed to load property details. Please try again.')
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingProperty(null)
  }

  const handlePropertyUpdate = () => {
    // Refresh the listings
    const fetchAgentListings = async () => {
      try {
        const agent = await agentsApi.getCurrent()
        if (agent?.id) {
          const updatedProperties = await propertiesApi.getByAgentId(agent.id)
          
          // Additional safety check: filter properties to ensure they belong to this agent
          const agentProperties = updatedProperties.filter((p: Property) => p.agent_id === agent.id)
          
          setProperties(agentProperties)
          
          const transformedListings: ListingCard[] = agentProperties.map((property: Property) => {
            const address = property.street_address 
              ? `${property.street_address}, ${property.city || property.location || 'N/A'}`
              : property.location || 'Address not available'
            
            let status: ListingStatus = 'active'
            if (!property.published_at) {
              status = 'hidden'
            }
            
            // Use image_url if available (from backend), otherwise fall back to resolving image
            // Priority: image_url > image_path > image > placeholder
            let imageUrl = property.image_url
            if (!imageUrl && property.image_path) {
              imageUrl = resolvePropertyImage(property.image_path, property.id)
            }
            if (!imageUrl && property.image) {
              imageUrl = resolvePropertyImage(property.image, property.id)
            }
            if (!imageUrl) {
              imageUrl = resolvePropertyImage(null, property.id)
            }
            
            return {
              id: property.id,
              title: property.title,
              address: address,
              rating: 4,
              views: 0,
              image: imageUrl,
              status: status
            }
          })
          
          setListings(transformedListings)
          setTotalProperties(agentProperties.length)
          setActiveProperties(agentProperties.filter(p => p.published_at).length)
          setHiddenProperties(agentProperties.filter(p => !p.published_at).length)
        }
      } catch (error) {
        console.error('Error refreshing listings:', error)
      }
    }
    fetchAgentListings()
  }

  const handlePropertyDelete = () => {
    // Refresh the listings
    handlePropertyUpdate()
  }

  const renderStars = (rating: number) => {
    return (
      <div className="aml-rating">
        {Array.from({ length: 5 }).map((_, idx) => {
          const starNumber = idx + 1
          return (
            <span
              key={starNumber}
              className={`aml-star ${starNumber <= rating ? 'filled' : ''}`}
              aria-hidden="true"
            >
              ★
            </span>
          )
        })}
      </div>
    )
  }

  return (
    <div className="agent-my-listings agent-dashboard">
      <AppSidebar/>

      <main className="agent-main">
        <AgentHeader 
          title="My Listings" 
          subtitle="Manage and track all your property listings." 
        />

        <div className="aml-page">
          

          <div className="aml-stats">
            <div className="metric-card orange">
              <div className="metric-icon">
                <FiHome />
              </div>
              <div className="metric-content">
                <div className="aml-stat-top">
                  <h3>Total Properties</h3>
                  <span className="aml-stat-delta positive">&nbsp;</span>
                </div>
                <p className="metric-value">{loading ? '...' : totalProperties}</p>
              </div>
            </div>

            <div className="metric-card blue">
              <div className="metric-icon">
                <FiCheckCircle />
              </div>
              <div className="metric-content">
                <div className="aml-stat-top">
                  <h3>Total Active</h3>
                  <span className="aml-stat-delta positive">&nbsp;</span>
                </div>
                <p className="metric-value">{loading ? '...' : activeProperties}</p>
              </div>
            </div>

            <div className="metric-card green">
              <div className="metric-icon">
                <FiCheckCircle />
              </div>
              <div className="metric-content">
                <div className="aml-stat-top">
                  <h3>Total Rented</h3>
                  <span className="aml-stat-delta muted">&nbsp;</span>
                </div>
                <p className="metric-value">{loading ? '...' : rentedProperties}</p>
              </div>
            </div>

            <div className="metric-card red">
              <div className="metric-icon">
                <FiSlash />
              </div>
              <div className="metric-content">
                <div className="aml-stat-top">
                  <h3>Total Hide</h3>
                  <span className="aml-stat-delta muted">&nbsp;</span>
                </div>
                <p className="metric-value">{loading ? '...' : hiddenProperties}</p>
              </div>
            </div>
          </div>

          <div className="aml-search-map">
            <div className="aml-search-row">
              <div className="aml-search">
                <FiSearch className="aml-search-icon" />
                <input className="aml-search-input" placeholder="Search Location..." />
              </div>
              <button className="aml-find-btn" type="button">
                <FiSearch />
                <span>Find</span>
              </button>
            </div>

            <div className="aml-map">
              <PropertiesMap 
                properties={properties}
                agentId={currentAgentId}
              />
            </div>
          </div>

          <div className="aml-filters">
            {(() => {
              // Calculate property type counts
              const typeCounts: Record<string, number> = {}
              properties.forEach((property) => {
                const type = property.type || 'Other'
                typeCounts[type] = (typeCounts[type] || 0) + 1
              })
              
              // Get unique property types sorted by count (descending)
              const propertyTypes = Object.keys(typeCounts).sort((a, b) => typeCounts[b] - typeCounts[a])
              
              return (
                <>
                  <label className="aml-filter">
                    <input 
                      type="checkbox" 
                      checked={selectedFilter === 'all'}
                      onChange={() => setSelectedFilter('all')}
                    />
                    <span>All({totalProperties})</span>
                  </label>
                  {propertyTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`aml-filter-pill ${selectedFilter === type ? 'active' : ''}`}
                      onClick={() => setSelectedFilter(type)}
                    >
                      {type}({typeCounts[type]})
                    </button>
                  ))}
                </>
              )
            })()}
          </div>

          <div className="aml-grid">
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', gridColumn: '1 / -1' }}>Loading listings...</div>
            ) : (() => {
              // Filter listings based on selected filter
              const filteredListings = selectedFilter === 'all' 
                ? listings 
                : listings.filter((l) => {
                    const property = properties.find(p => p.id === l.id)
                    return property?.type === selectedFilter
                  })
              
              return filteredListings.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', gridColumn: '1 / -1' }}>
                  {selectedFilter === 'all' 
                    ? 'No listings yet. Create your first listing!'
                    : `No ${selectedFilter} properties found.`
                  }
                </div>
              ) : (
                filteredListings.map((l) => (
                <div key={l.id} className="aml-card">
                <div className="aml-card-media">
                  <img
                    src={l.image}
                    alt={l.title}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = ASSETS.PLACEHOLDER_PROPERTY_MAIN
                    }}
                  />
                  <div className="aml-pin" title="Pinned">
                    <FiMapPin />
                  </div>
                  <button 
                    className="aml-edit-btn" 
                    type="button"
                    onClick={() => handleEditClick(l.id)}
                  >
                    Edit
                  </button>
                </div>

                <div className="aml-card-body">
                  <div className="aml-card-title">{l.title}</div>
                  <div className="aml-card-address">
                    <FiMapPin className="aml-address-icon" />
                    <span>{l.address}</span>
                  </div>

                  <div className="aml-card-meta">
                    {renderStars(l.rating)}
                    <div className="aml-views">
                      <FiEye />
                      <span>Viewed({l.views})</span>
                    </div>
                  </div>
                </div>
              </div>
                ))
              )
            })()}
          </div>
        </div>
      </main>

      <EditPropertyModal
        property={editingProperty}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onUpdate={handlePropertyUpdate}
        onDelete={handlePropertyDelete}
      />
    </div>
  )
}

