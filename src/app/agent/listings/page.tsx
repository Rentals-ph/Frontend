'use client'

import { useState, useEffect } from 'react'
import AppSidebar from '../../../components/common/AppSidebar'
import AgentHeader from '../../../components/agent/AgentHeader'
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
  const [loading, setLoading] = useState(true)
  const [totalProperties, setTotalProperties] = useState(0)
  const [activeProperties, setActiveProperties] = useState(0)
  const [rentedProperties, setRentedProperties] = useState(0)
  const [hiddenProperties, setHiddenProperties] = useState(0)

  useEffect(() => {
    const fetchAgentListings = async () => {
      try {
        // Get current agent
        const agent = await agentsApi.getCurrent()
        
        if (agent?.id) {
          // Fetch properties for this agent
          const properties = await propertiesApi.getByAgentId(agent.id)
          
          // Transform properties to ListingCard format
          const transformedListings: ListingCard[] = properties.map((property: Property) => {
            const address = property.street_address 
              ? `${property.street_address}, ${property.city || property.location || 'N/A'}`
              : property.location || 'Address not available'
            
            // Determine status based on property data
            let status: ListingStatus = 'active'
            if (!property.published_at) {
              status = 'hidden'
            }
            // Note: 'rented' status would need additional property field
            
            return {
              id: property.id,
              title: property.title,
              address: address,
              rating: 4, // Default rating, could be fetched from reviews API
              views: 0, // Could be tracked separately
              image: resolvePropertyImage(property.image, property.id),
              status: status
            }
          })
          
          setListings(transformedListings)
          
          // Calculate stats
          setTotalProperties(properties.length)
          setActiveProperties(properties.filter(p => p.published_at).length)
          setRentedProperties(0) // Would need additional data
          setHiddenProperties(properties.filter(p => !p.published_at).length)
        }
      } catch (error) {
        console.error('Error fetching agent listingss:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAgentListings()
  }, [])

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
              <iframe
                title="Map"
                className="aml-map-iframe"
                src="https://www.openstreetmap.org/export/embed.html?bbox=123.85%2C10.26%2C123.93%2C10.33&layer=mapnik"
              />
            </div>
          </div>

          <div className="aml-filters">
            <label className="aml-filter">
              <input type="checkbox" />
              <span>All(23)</span>
            </label>
            <button type="button" className="aml-filter-pill">
              Condominium(4)
            </button>
            <button type="button" className="aml-filter-pill">
              Bed Space(8)
            </button>
            <button type="button" className="aml-filter-pill">
              Apartment(12)
            </button>
          </div>

          <div className="aml-grid">
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', gridColumn: '1 / -1' }}>Loading listings...</div>
            ) : listings.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', gridColumn: '1 / -1' }}>No listings yet. Create your first listing!</div>
            ) : (
              listings.map((l) => (
                <div key={l.id} className="aml-card">
                <div className="aml-card-media">
                  <img
                    src={l.image}
                    alt={l.title}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                  <div className="aml-pin" title="Pinned">
                    <FiMapPin />
                  </div>
                  <button className="aml-edit-btn" type="button">
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
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

