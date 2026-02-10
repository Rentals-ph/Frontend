'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiChevronDown } from 'react-icons/fi'
import './PopularSearches.css'

// Data for popular searches
const propertyTypeSearches = {
  'Apartment / Condo': [
    { label: 'Apartments for rent in Metro Manila', type: 'Apartment', location: 'Metro Manila' },
    { label: 'Apartments for rent in Makati', type: 'Apartment', location: 'Makati City' },
    { label: 'Apartments for rent in BGC', type: 'Apartment', location: 'BGC' },
    { label: 'Condominiums for rent in Quezon City', type: 'Condominium', location: 'Quezon City' },
    { label: 'Condominiums for rent in Cebu City', type: 'Condominium', location: 'Cebu City' },
  ],
  'House': [
    { label: 'Houses for rent in Metro Manila', type: 'House', location: 'Metro Manila' },
    { label: 'Houses for rent in Quezon City', type: 'House', location: 'Quezon City' },
    { label: 'Houses for rent in Davao City', type: 'House', location: 'Davao City' },
    { label: 'Houses for rent in Cebu City', type: 'House', location: 'Cebu City' },
    { label: 'Houses for rent in Makati', type: 'House', location: 'Makati City' },
  ],
  'Studio': [
    { label: 'Studios for rent in Makati', type: 'Studio', location: 'Makati City' },
    { label: 'Studios for rent in BGC', type: 'Studio', location: 'BGC' },
    { label: 'Studios for rent in Quezon City', type: 'Studio', location: 'Quezon City' },
    { label: 'Studios for rent in Mandaluyong', type: 'Studio', location: 'Mandaluyong' },
    { label: 'Studios for rent in Pasig', type: 'Studio', location: 'Pasig' },
  ],
  'Commercial / Office': [
    { label: 'Commercial spaces in Metro Manila', type: 'Commercial Spaces', location: 'Metro Manila' },
    { label: 'Office spaces in Makati', type: 'Office Spaces', location: 'Makati City' },
    { label: 'Office spaces in BGC', type: 'Office Spaces', location: 'BGC' },
    { label: 'Commercial spaces in Cebu City', type: 'Commercial Spaces', location: 'Cebu City' },
    { label: 'Warehouses in Metro Manila', type: 'WareHouse', location: 'Metro Manila' },
  ],
  'Others': [
    { label: 'Townhouses for rent in Metro Manila', type: 'TownHouse', location: 'Metro Manila' },
    { label: 'Bed spaces in Makati', type: 'Bed Space', location: 'Makati City' },
    { label: 'Dormitories in Quezon City', type: 'Dormitory', location: 'Quezon City' },
    { label: 'Bed spaces in Manila', type: 'Bed Space', location: 'Manila' },
    { label: 'Townhouses for rent in Quezon City', type: 'TownHouse', location: 'Quezon City' },
  ],
}

const locationSearches = {
  'Metro Manila': [
    { label: 'Apartments for rent in Metro Manila', type: 'Apartment', location: 'Metro Manila' },
    { label: 'Condominiums for rent in Metro Manila', type: 'Condominium', location: 'Metro Manila' },
    { label: 'Houses for rent in Metro Manila', type: 'House', location: 'Metro Manila' },
    { label: 'Studios for rent in Metro Manila', type: 'Studio', location: 'Metro Manila' },
    { label: 'Commercial spaces in Metro Manila', type: 'Commercial Spaces', location: 'Metro Manila' },
  ],
  'Makati City': [
    { label: 'Apartments for rent in Makati', type: 'Apartment', location: 'Makati City' },
    { label: 'Condominiums for rent in Makati', type: 'Condominium', location: 'Makati City' },
    { label: 'Studios for rent in Makati', type: 'Studio', location: 'Makati City' },
    { label: 'Office spaces in Makati', type: 'Office Spaces', location: 'Makati City' },
    { label: 'Bed spaces in Makati', type: 'Bed Space', location: 'Makati City' },
  ],
  'Quezon City': [
    { label: 'Apartments for rent in Quezon City', type: 'Apartment', location: 'Quezon City' },
    { label: 'Condominiums for rent in Quezon City', type: 'Condominium', location: 'Quezon City' },
    { label: 'Houses for rent in Quezon City', type: 'House', location: 'Quezon City' },
    { label: 'Studios for rent in Quezon City', type: 'Studio', location: 'Quezon City' },
    { label: 'Townhouses for rent in Quezon City', type: 'TownHouse', location: 'Quezon City' },
  ],
  'Cebu City': [
    { label: 'Apartments for rent in Cebu City', type: 'Apartment', location: 'Cebu City' },
    { label: 'Condominiums for rent in Cebu City', type: 'Condominium', location: 'Cebu City' },
    { label: 'Houses for rent in Cebu City', type: 'House', location: 'Cebu City' },
    { label: 'Studios for rent in Cebu City', type: 'Studio', location: 'Cebu City' },
    { label: 'Commercial spaces in Cebu City', type: 'Commercial Spaces', location: 'Cebu City' },
  ],
  'BGC': [
    { label: 'Apartments for rent in BGC', type: 'Apartment', location: 'BGC' },
    { label: 'Condominiums for rent in BGC', type: 'Condominium', location: 'BGC' },
    { label: 'Studios for rent in BGC', type: 'Studio', location: 'BGC' },
    { label: 'Office spaces in BGC', type: 'Office Spaces', location: 'BGC' },
    { label: 'Houses for rent in BGC', type: 'House', location: 'BGC' },
  ],
  'Davao City': [
    { label: 'Apartments for rent in Davao City', type: 'Apartment', location: 'Davao City' },
    { label: 'Condominiums for rent in Davao City', type: 'Condominium', location: 'Davao City' },
    { label: 'Houses for rent in Davao City', type: 'House', location: 'Davao City' },
    { label: 'Studios for rent in Davao City', type: 'Studio', location: 'Davao City' },
    { label: 'Commercial spaces in Davao City', type: 'Commercial Spaces', location: 'Davao City' },
  ],
}

type TabType = 'type' | 'location'

function buildSearchUrl(type: string, location: string) {
  const params = new URLSearchParams()
  params.set('type', type)
  params.set('location', location)
  return `/properties?${params.toString()}`
}

export default function PopularSearches() {
  const [activeTab, setActiveTab] = useState<TabType>('type')
  const [showMore, setShowMore] = useState<Record<string, boolean>>({})

  const data = activeTab === 'type' ? propertyTypeSearches : locationSearches
  const categories = Object.keys(data)

  const toggleShowMore = (category: string) => {
    setShowMore(prev => ({ ...prev, [category]: !prev[category] }))
  }

  // Show 5 items by default, all if expanded
  const INITIAL_VISIBLE = 5

  return (
    <section className="popular-searches-section">
      <div className="popular-searches-container">
        <h2 className="popular-searches-title">Popular Real Estate Searches</h2>

        {/* Tabs */}
        <div className="popular-searches-tabs">
          <button
            className={`popular-searches-tab ${activeTab === 'type' ? 'active' : ''}`}
            onClick={() => setActiveTab('type')}
          >
            By Property Type
          </button>
          <button
            className={`popular-searches-tab ${activeTab === 'location' ? 'active' : ''}`}
            onClick={() => setActiveTab('location')}
          >
            By Location
          </button>
        </div>

        {/* Grid of categories */}
        <div className="popular-searches-grid">
          {categories.map(category => {
            const items = (data as any)[category] as { label: string; type: string; location: string }[]
            const isExpanded = showMore[category]
            const visibleItems = isExpanded ? items : items.slice(0, INITIAL_VISIBLE)

            return (
              <div key={category} className="popular-searches-column">
                <h3 className="popular-searches-category">{category.toUpperCase()}</h3>
                <ul className="popular-searches-list">
                  {visibleItems.map((item, idx) => (
                    <li key={idx}>
                      <Link
                        href={buildSearchUrl(item.type, item.location)}
                        className="popular-searches-link"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                {items.length > INITIAL_VISIBLE && (
                  <button
                    className="popular-searches-view-more"
                    onClick={() => toggleShowMore(category)}
                  >
                    {isExpanded ? 'View Less' : 'View More'}
                    <FiChevronDown className={`view-more-chevron ${isExpanded ? 'expanded' : ''}`} />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
