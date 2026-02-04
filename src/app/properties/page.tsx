'use client'

import { useState, useEffect, Suspense, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import VerticalPropertyCard from '../../components/common/VerticalPropertyCard'
import HorizontalPropertyCard from '../../components/common/HorizontalPropertyCard'
import './page.css'
import PageHeader from '../../components/layout/PageHeader'
import { propertiesApi } from '../../api/endpoints/properties'
import type { Property } from '../../types'

function PropertiesContent() {
  const searchParams = useSearchParams()
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedType, setSelectedType] = useState('All Types')
  const [minBaths, setMinBaths] = useState('')
  const [minBeds, setMinBeds] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'horizontal' | 'vertical'>('vertical')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProperties, setTotalProperties] = useState(0)
  const [allPropertiesForCount, setAllPropertiesForCount] = useState<Property[]>([])
  const itemsPerPage = 9

  // Initialize state from URL query parameters
  useEffect(() => {
    if (!searchParams) return
    
    const searchParam = searchParams.get('search')
    const typeParam = searchParams.get('type')
    const locationParam = searchParams.get('location')
    const minBedsParam = searchParams.get('minBeds')
    const minBathsParam = searchParams.get('minBaths')
    const priceMinParam = searchParams.get('priceMin')
    const priceMaxParam = searchParams.get('priceMax')

    if (searchParam) {
      setSearchQuery(searchParam)
    }
    if (typeParam) {
      setSelectedType(typeParam)
    }
    if (locationParam) {
      setSelectedLocation(locationParam)
    }
    if (minBedsParam) {
      setMinBeds(minBedsParam)
    }
    if (minBathsParam) {
      setMinBaths(minBathsParam)
    }
    if (priceMinParam) {
      setPriceMin(priceMinParam)
    }
    if (priceMaxParam) {
      setPriceMax(priceMaxParam)
    }
  }, [searchParams])

  const propertyTypes = ['All Types', 'Condominium', 'Apartment', 'House', 'Bed Space', 'Commercial Spaces', 'Office Spaces', 'Studio', 'TownHouse', 'WareHouse', 'Dormitory', 'Farm Land']
  const locations = ['Metro Manila', 'Makati City', 'BGC', 'Quezon City', 'Mandaluyong', 'Pasig', 'Cebu City', 'Davao City', 'Lapulapu', 'Manila']
  const bathOptions = ['1', '2', '3', '4+']
  const bedOptions = ['1', '2', '3', '4+']

  // Fetch all properties for accurate category counts
  useEffect(() => {
    const fetchAllPropertiesForCount = async () => {
      try {
        // Fetch a large number of properties for accurate counting
        // Using per_page to get as many as possible
        const response = await propertiesApi.getAll({ per_page: 1000 })
        
        // The API might return paginated response or array
        if (Array.isArray(response)) {
          setAllPropertiesForCount(response)
        } else {
          // If it's a paginated response, extract the data
          const paginatedResponse = response as any
          if (paginatedResponse && 'data' in paginatedResponse) {
            setAllPropertiesForCount(paginatedResponse.data || [])
          } else {
            setAllPropertiesForCount([])
          }
        }
      } catch (err) {
        console.error('Error fetching properties for count:', err)
        // Fallback to empty array
        setAllPropertiesForCount([])
      }
    }

    fetchAllPropertiesForCount()
  }, [])

  // Calculate categories dynamically from all properties
  const categories = useMemo(() => {
    // Get all property types except "All Types"
    const typesToCount = propertyTypes.filter(type => type !== 'All Types')
    
    return typesToCount.map(type => {
      const count = allPropertiesForCount.filter(property => property.type === type).length
      return { name: type, count }
    }).filter(category => category.count > 0) // Only show categories with properties
  }, [allPropertiesForCount, propertyTypes])

  const topSearches = [
    'Condominium For Rent In Cebu',
    'House & Lot For Rent In Lapulapu',
    'Studio For Rent In Makati',
    'Pet Friendly Unit In Manila'
  ]

  // Helper function to format price
  const formatPrice = (price: number): string => {
    return `₱${price.toLocaleString('en-US')}/Month`
  }

  // Helper function to format date
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Date not available'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Helper function to get rent manager role
  const getRentManagerRole = (isOfficial: boolean | undefined): string => {
    return isOfficial ? 'Rent Manager' : 'Property Specialist'
  }

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const params: {
          type?: string
          location?: string
          search?: string
          page?: number
        } = {
          page: currentPage,
        }

        // Add filters to API params
        if (selectedType && selectedType !== 'All Types') {
          params.type = selectedType
        }
        if (selectedLocation) {
          params.location = selectedLocation
        }
        if (searchQuery) {
          params.search = searchQuery
        }

        const response = await propertiesApi.getAll(params)
        
        // Handle paginated response
        if (response && typeof response === 'object' && 'data' in response) {
          const paginatedResponse = response as any
          setProperties(paginatedResponse.data || [])
          setTotalPages(paginatedResponse.last_page || 1)
          setTotalProperties(paginatedResponse.total || 0)
        } else {
          // Handle array response
          setProperties(Array.isArray(response) ? response : [])
          setTotalPages(1)
          setTotalProperties(Array.isArray(response) ? response.length : 0)
        }
      } catch (err: any) {
        console.error('Error fetching properties:', err)
        setError(err.message || 'Failed to load properties. Please try again later.')
        setProperties([])
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [selectedLocation, selectedType, searchQuery, currentPage])

  // Client-side filtering for additional filters (bathrooms, bedrooms, price range)
  // Note: These filters could also be moved to the backend API for better performance
  const filteredProperties = properties.filter(property => {
    const bathMatch = !minBaths || property.bathrooms >= parseInt(minBaths)
    const bedMatch = !minBeds || property.bedrooms >= parseInt(minBeds)

    let priceMatch = true
    if (priceMin || priceMax) {
      const price = property.price
      if (priceMin) priceMatch = priceMatch && price >= parseInt(priceMin)
      if (priceMax) priceMatch = priceMatch && price <= parseInt(priceMax)
    }

    return bathMatch && bedMatch && priceMatch
  })

  // Client-side sorting
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === 'price-low') {
      return a.price - b.price
    } else if (sortBy === 'price-high') {
      return b.price - a.price
    } else if (sortBy === 'newest') {
      const dateA = a.published_at ? new Date(a.published_at).getTime() : 0
      const dateB = b.published_at ? new Date(b.published_at).getTime() : 0
      return dateB - dateA
    } else if (sortBy === 'oldest') {
      const dateA = a.published_at ? new Date(a.published_at).getTime() : 0
      const dateB = b.published_at ? new Date(b.published_at).getTime() : 0
      return dateA - dateB
    }
    return 0
  })

  // Pagination - use API pagination if available, otherwise use client-side
  const paginatedProperties = sortedProperties

  // Reset to page 1 when filters change (that trigger API calls)
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedLocation, selectedType, searchQuery])

  return (
    <div className="properties-for-rent-page">
      <Navbar />
      <PageHeader title="Properties for Rent" />
      
      <div className="top-search-bar-container">
            <div className="top-search-bar">
              <div className="search-input-container">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="8" stroke="#666" strokeWidth="2" />
                  <path d="m21 21-4.35-4.35" stroke="#666" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  className="main-search-input"
                  placeholder="Search here..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="top-search-bar-controls">
                <select
                  className="sort-dropdown-btn"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="price-low">Price Low to High</option>
                  <option value="price-high">Price High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
                <button
                  className="hamburger-menu-btn"
                  aria-label="List View"
                  onClick={() => setViewMode('horizontal')}
                  style={{ backgroundColor: viewMode === 'horizontal' ? '#FE8E0A' : '#ffffff' }}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 12H21M3 6H21M3 18H21" stroke={viewMode === 'horizontal' ? "#ffffff" : "#333"} strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
                <button
                  className="grid-view-btn"
                  aria-label="Grid View"
                  onClick={() => setViewMode('vertical')}
                  style={{ backgroundColor: viewMode === 'vertical' ? '#FE8E0A' : '#ffffff' }}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="7" height="7" stroke={viewMode === 'vertical' ? "#ffffff" : "#333"} strokeWidth="2" fill="none" />
                    <rect x="14" y="3" width="7" height="7" stroke={viewMode === 'vertical' ? "#ffffff" : "#333"} strokeWidth="2" fill="none" />
                    <rect x="3" y="14" width="7" height="7" stroke={viewMode === 'vertical' ? "#ffffff" : "#333"} strokeWidth="2" fill="none" />
                    <rect x="14" y="14" width="7" height="7" stroke={viewMode === 'vertical' ? "#ffffff" : "#333"} strokeWidth="2" fill="none" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
      <main className="properties-main-layout">
        {/* Dropdown Filter Menu */}
        {isSidebarOpen && (
          <>
            <div 
              className="filter-dropdown-overlay"
              onClick={() => setIsSidebarOpen(false)}
            />
            <div className={`filter-dropdown ${isSidebarOpen ? 'open' : ''}`}>
              <div className="filter-dropdown-header">
                <h2 className="filter-dropdown-title">Advance Search</h2>
                <button 
                  className="filter-close-btn"
                  onClick={() => setIsSidebarOpen(false)}
                  aria-label="Close filters"
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              
              <div className="filter-dropdown-content">
                <div className="advance-search-section">
                  <h2 className="section-title">Advance Search</h2>
                  <div className="filter-group">
                    <select
                      className="filter-select"
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                    >
                      <option value="">Location</option>
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-group">
                    <select
                      className="filter-select"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      {propertyTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-group">
                    <select
                      className="filter-select"
                      value={minBaths}
                      onChange={(e) => setMinBaths(e.target.value)}
                    >
                      <option value="">Min. Baths</option>
                      {bathOptions.map(bath => (
                        <option key={bath} value={bath}>{bath}+</option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-group">
                    <select
                      className="filter-select"
                      value={minBeds}
                      onChange={(e) => setMinBeds(e.target.value)}
                    >
                      <option value="">Min. Beds</option>
                      {bedOptions.map(bed => (
                        <option key={bed} value={bed}>{bed}+</option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-group price-range-group">
                    <label className="price-range-label">Price Range</label>
                    <div className="price-range-inputs-container">
                      <div className="price-range-inputs">
                        <input
                          type="text"
                          className="price-input"
                          placeholder="T"
                          value={priceMin}
                          onChange={(e) => setPriceMin(e.target.value)}
                        />
                        <div className="price-range-separator">
                          <span>To</span>
                        </div>
                        <input
                          type="text"
                          className="price-input"
                          placeholder="O"
                          value={priceMax}
                          onChange={(e) => setPriceMax(e.target.value)}
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200000"
                        step="1000"
                        value={priceMin || 0}
                        onChange={(e) => setPriceMin(e.target.value)}
                        className="price-range-slider"
                      />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="properties-sidebar">
          <div className="advance-search-section">
            <h2 className="section-title">Advance Search</h2>
            <div className="filter-group">
              <select
                className="filter-select"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">Location</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <select
                className="filter-select"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <select
                className="filter-select"
                value={minBaths}
                onChange={(e) => setMinBaths(e.target.value)}
              >
                <option value="">Min. Baths</option>
                {bathOptions.map(bath => (
                  <option key={bath} value={bath}>{bath}+</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <select
                className="filter-select"
                value={minBeds}
                onChange={(e) => setMinBeds(e.target.value)}
              >
                <option value="">Min. Beds</option>
                {bedOptions.map(bed => (
                  <option key={bed} value={bed}>{bed}+</option>
                ))}
              </select>
            </div>

            <div className="filter-group price-range-group">
              <label className="price-range-label">Price Range</label>
              <div className="price-range-inputs-container">
                <div className="price-range-inputs">
                  <input
                    type="text"
                    className="price-input"
                    placeholder="T"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                  />
                  <div className="price-range-separator">
                    <span>To</span>
                  </div>
                  <input
                    type="text"
                    className="price-input"
                    placeholder="O"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="1000"
                  value={priceMin || 0}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="price-range-slider"
                />
              </div>
            </div>
            
          </div>

          <div className="categories-section">
            <h2 className="section-title">List by Categories</h2>
            <ul className="categories-list">
              {categories.map((category) => (
                <li 
                  key={category.name} 
                  className={`category-item ${selectedType === category.name ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedType(category.name)
                    setIsSidebarOpen(false) // Close mobile sidebar when category is clicked
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="category-name">{category.name}</span>
                  <span className="category-count">({category.count})</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="top-searches-section">
            <h2 className="section-title">Top Searches</h2>
            <ul className="top-searches-list">
              {topSearches.map((search, index) => (
                <li key={index} className="search-item">
                  {search}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="properties-main-content">
          <button
            className={`mobile-filter-btn ${isSidebarOpen ? 'active' : ''}`}
            aria-label="Toggle Filters Menu"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 6H2M22 12H2M22 18H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>Filters</span>
          </button>

          

          <div className="properties-content-wrapper">
            {loading ? (
              <div className="no-results">
                <h3 className="no-results-title">Loading Properties...</h3>
                <p className="no-results-text">Please wait while we fetch the latest properties</p>
              </div>
            ) : error ? (
              <div className="no-results">
                <h3 className="no-results-title">Error Loading Properties</h3>
                <p className="no-results-text">{error}</p>
              </div>
            ) : paginatedProperties.length > 0 ? (
              <>
                <div className={viewMode === 'horizontal' ? 'properties-list' : 'properties-grid'}>
                  {paginatedProperties.map(property => {
                    const propertySize = property.area 
                      ? `${property.area} sqft` 
                      : `${(property.bedrooms * 15 + property.bathrooms * 5)} sqft`
                    
                    const cardProps = {
                      id: property.id,
                      propertyType: property.type,
                      date: formatDate(property.published_at),
                      price: formatPrice(property.price),
                      title: property.title,
                      image: property.image || '/assets/property-main.png',
                      rentManagerName: property.rent_manager?.name || 'Rental.Ph Official',
                      rentManagerRole: getRentManagerRole(property.rent_manager?.is_official),
                      bedrooms: property.bedrooms,
                      bathrooms: property.bathrooms,
                      parking: 0, // Parking not in backend model, defaulting to 0
                      propertySize,
                      location: property.location,
                    }

                    return viewMode === 'horizontal' ? (
                      <HorizontalPropertyCard key={property.id} {...cardProps} />
                    ) : (
                      <VerticalPropertyCard key={property.id} {...cardProps} />
                    )
                  })}
                </div>
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: '1rem',
                    marginTop: '2rem',
                    padding: '1rem'
                  }}>
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: currentPage === 1 ? '#ccc' : '#FE8E0A',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Previous
                    </button>
                    <span style={{ fontSize: '1rem' }}>
                      Page {currentPage} of {totalPages} ({totalProperties} properties)
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: currentPage === totalPages ? '#ccc' : '#FE8E0A',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="no-results">
                <h3 className="no-results-title">No Properties Found</h3>
                <p className="no-results-text">
                  Try adjusting your filters to see more properties
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function PropertiesForRentPage() {
  return (
    <Suspense fallback={
      <div className="properties-for-rent-page">
        <Navbar />
        <PageHeader title="Properties for Rent" />
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
        <Footer />
      </div>
    }>
      <PropertiesContent />
    </Suspense>
  )
}

