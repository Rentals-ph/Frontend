'use client'

import { useState, useEffect, Suspense, useMemo, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import VerticalPropertyCard from '../../components/common/VerticalPropertyCard'
import HorizontalPropertyCard from '../../components/common/HorizontalPropertyCard'
import './page.css'
import PageHeader from '../../components/layout/PageHeader'
import { propertiesApi } from '../../api/endpoints/properties'
import type { Property } from '../../types'
import { ASSETS } from '@/utils/assets'

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
  const [sortByPrice, setSortByPrice] = useState('')
  const [subCategory, setSubCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'horizontal' | 'vertical'>('vertical')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProperties, setTotalProperties] = useState(0)
  const [allPropertiesForCount, setAllPropertiesForCount] = useState<Property[]>([])
  const [appliedFilters, setAppliedFilters] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [showStickySearch, setShowStickySearch] = useState(false)
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
      // Determine if we're loading more (page > 1 for both modes)
      const isAppending = currentPage > 1
      
      if (!isAppending) {
        setLoading(true)
      } else {
        setIsLoadingMore(true)
      }
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
          const newProperties = paginatedResponse.data || []
          
          if (isAppending) {
            setProperties(prev => [...prev, ...newProperties])
          } else {
            setProperties(newProperties)
          }
          
          setTotalPages(paginatedResponse.last_page || 1)
          setTotalProperties(paginatedResponse.total || 0)
          setHasMore(currentPage < (paginatedResponse.last_page || 1))
        } else {
          // Handle array response
          const newProperties = Array.isArray(response) ? response : []
          if (isAppending) {
            setProperties(prev => [...prev, ...newProperties])
          } else {
            setProperties(newProperties)
          }
          setTotalPages(1)
          setTotalProperties(newProperties.length)
          setHasMore(false)
        }
      } catch (err: any) {
        console.error('Error fetching properties:', err)
        setError(err.message || 'Failed to load properties. Please try again later.')
        if (!isAppending) {
          setProperties([])
        }
      } finally {
        setLoading(false)
        setIsLoadingMore(false)
      }
    }

    fetchProperties()
  }, [selectedLocation, selectedType, searchQuery, currentPage, viewMode])

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

  // Filter by subcategory first
  const subCategoryFiltered = filteredProperties.filter(property => {
    if (subCategory === 'all') return true
    if (subCategory === 'featured') {
      // Featured: properties published in the last 7 days with verified agents
      const isRecent = property.published_at ? 
        (Date.now() - new Date(property.published_at).getTime()) <= 7 * 24 * 60 * 60 * 1000 : false
      const isVerified = property.agent?.verified || property.rent_manager?.is_official
      return isRecent && isVerified
    }
    if (subCategory === 'top') {
      // Top rated - for future use, currently show all
      return true
    }
    if (subCategory === 'most-viewed') {
      // Most viewed - for future use, currently show all
      return true
    }
    return true
  })

  // Client-side sorting
  const sortedProperties = [...subCategoryFiltered].sort((a, b) => {
    // Price sorting takes priority if selected
    if (sortByPrice === 'price-low') {
      return a.price - b.price
    } else if (sortByPrice === 'price-high') {
      return b.price - a.price
    }
    
    // Relevance/Date sorting
    if (sortBy === 'newest') {
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

  // Properties ready for display (infinite scroll loads more as user scrolls)
  const paginatedProperties = sortedProperties

  // Reset to page 1 when filters change (that trigger API calls)
  useEffect(() => {
    setCurrentPage(1)
    setHasMore(true)
    setProperties([])
  }, [selectedLocation, selectedType, searchQuery])

  // Reset when switching view modes (to start infinite scroll from beginning)
  const prevViewMode = useRef(viewMode)
  useEffect(() => {
    if (prevViewMode.current !== viewMode) {
      setCurrentPage(1)
      setHasMore(true)
      setProperties([])
    }
    prevViewMode.current = viewMode
  }, [viewMode])

  // Infinite scroll for both horizontal and vertical modes
  useEffect(() => {
    if (!hasMore || isLoadingMore || loading) return

    let timeoutId: NodeJS.Timeout
    const handleScroll = () => {
      // Debounce scroll events
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const windowHeight = window.innerHeight
        const documentHeight = document.documentElement.scrollHeight

        // Load more when user is 300px from bottom
        if (scrollTop + windowHeight >= documentHeight - 300) {
          if (currentPage < totalPages && hasMore) {
            setCurrentPage(prev => prev + 1)
          }
        }
      }, 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timeoutId)
    }
  }, [hasMore, isLoadingMore, loading, currentPage, totalPages])

  // Sticky search bar visibility and close filter dropdown when scrolling to top
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    const handleScroll = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        const sidebar = document.querySelector('.properties-sidebar')
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        
        // Close filter dropdown when scrolling back to top
        if (scrollTop <= 300 && isSidebarOpen) {
          setIsSidebarOpen(false)
        }
        
        // On mobile, sidebar might not exist, so show sticky bar after scrolling past top search bar
        if (!sidebar) {
          // Show sticky bar after scrolling past 200px on mobile
          setShowStickySearch(scrollTop > 200)
          return
        }

        const sidebarRect = sidebar.getBoundingClientRect()
        
        // Show sticky bar when sidebar is out of view (scrolled past)
        // Hide when scrolling back to top (within 300px of top)
        if (sidebarRect.bottom < 0 && scrollTop > 300) {
          setShowStickySearch(true)
        } else if (scrollTop <= 300) {
          setShowStickySearch(false)
        } else if (sidebarRect.bottom >= 0) {
          setShowStickySearch(false)
        }
      }, 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // Check on mount
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timeoutId)
    }
  }, [isSidebarOpen])

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (selectedLocation) count++
    if (selectedType && selectedType !== 'All Types') count++
    if (minBaths) count++
    if (minBeds) count++
    if (priceMin) count++
    if (priceMax) count++
    return count
  }, [selectedLocation, selectedType, minBaths, minBeds, priceMin, priceMax])

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedLocation('')
    setSelectedType('All Types')
    setMinBaths('')
    setMinBeds('')
    setPriceMin('')
    setPriceMax('')
    setSearchQuery('')
    setAppliedFilters(false)
    setCurrentPage(1)
  }

  // Apply filters (for desktop sidebar)
  const applyFilters = () => {
    setAppliedFilters(true)
    setCurrentPage(1)
  }

  // Remove individual filter
  const removeFilter = (filterType: string) => {
    switch (filterType) {
      case 'location':
        setSelectedLocation('')
        break
      case 'type':
        setSelectedType('All Types')
        break
      case 'minBaths':
        setMinBaths('')
        break
      case 'minBeds':
        setMinBeds('')
        break
      case 'priceMin':
        setPriceMin('')
        break
      case 'priceMax':
        setPriceMax('')
        break
      case 'search':
        setSearchQuery('')
        break
    }
    setCurrentPage(1)
  }

  // Calculate results range
  const resultsStart = (currentPage - 1) * itemsPerPage + 1
  const resultsEnd = Math.min(currentPage * itemsPerPage, paginatedProperties.length)
  const totalFiltered = paginatedProperties.length

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
                  className="sort-dropdown-btn sort-by-relevance"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
                <select
                  className="sort-dropdown-btn sort-by-price"
                  value={sortByPrice}
                  onChange={(e) => setSortByPrice(e.target.value)}
                >
                  <option value="">Sort by Price</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
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

      {/* Sticky Search Bar */}
      <div className={`sticky-search-bar-container ${showStickySearch ? 'visible' : ''}`}>
        <div className="sticky-search-bar-wrapper">
          {/* Logo on the left */}
          <div className="sticky-search-logo">
            <img
              src={ASSETS.LOGO_HERO_MAIN}
              alt="Rentals.ph logo"
              className="sticky-logo-img"
            />
          </div>
          
          {/* Search and filters content on the right */}
          <div className="sticky-search-content">
            <div className="sticky-search-bar">
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
                  className="sort-dropdown-btn sort-by-relevance"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
                <select
                  className="sort-dropdown-btn sort-by-price"
                  value={sortByPrice}
                  onChange={(e) => setSortByPrice(e.target.value)}
                >
                  <option value="">Sort by Price</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
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
            
            {/* Advance Search Filters - Displayed below search bar */}
            <div className="sticky-filters-section">
              <div className="sticky-filters-grid">
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
                  <div className="price-range-inputs-container">
                    <div className="price-range-inputs">
                      <input
                        type="number"
                        className="price-input"
                        placeholder="Min Price"
                        value={priceMin}
                        onChange={(e) => setPriceMin(e.target.value)}
                        min="0"
                      />
                      <div className="price-range-separator">
                        <span>To</span>
                      </div>
                      <input
                        type="number"
                        className="price-input"
                        placeholder="Max Price"
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <button
                  className="sticky-clear-filters-btn"
                  onClick={clearAllFilters}
                  aria-label="Clear all filters"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <main className="properties-main-layout">
        {/* Dropdown Filter Menu - Mobile */}
        {isSidebarOpen && (
          <>
            <div 
              className="filter-dropdown-overlay mobile-only"
              onClick={() => setIsSidebarOpen(false)}
            />
            <div className={`filter-dropdown mobile-only ${isSidebarOpen ? 'open' : ''}`}>
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
                          type="number"
                          className="price-input"
                          placeholder="Min"
                          value={priceMin}
                          onChange={(e) => setPriceMin(e.target.value)}
                          min="0"
                        />
                        <div className="price-range-separator">
                          <span>To</span>
                        </div>
                        <input
                          type="number"
                          className="price-input"
                          placeholder="Max"
                          value={priceMax}
                          onChange={(e) => setPriceMax(e.target.value)}
                          min="0"
                        />
                      </div>
                      <div className="price-range-sliders">
                        <input
                          type="range"
                          min="0"
                          max="200000"
                          step="1000"
                          value={priceMin || 0}
                          onChange={(e) => setPriceMin(e.target.value)}
                          className="price-range-slider"
                          aria-label="Minimum price"
                        />
                        <input
                          type="range"
                          min="0"
                          max="200000"
                          step="1000"
                          value={priceMax || 200000}
                          onChange={(e) => setPriceMax(e.target.value)}
                          className="price-range-slider"
                          aria-label="Maximum price"
                        />
                      </div>
                    </div>
                  </div>

                  
                </div>
              </div>
            </div>
          </>
        )}

        {/* Desktop Floating Filter Panel - Appears from sticky search bar */}
        {isSidebarOpen && (
          <div className={`desktop-filter-panel ${showStickySearch ? 'visible' : ''}`}>
            <div className="desktop-filter-panel-content">
              <div className="desktop-filter-panel-header">
                <button 
                  className="desktop-filter-close-btn"
                  onClick={() => setIsSidebarOpen(false)}
                  aria-label="Close filters"
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </button>
                <h2 className="desktop-filter-panel-title">Advance Search</h2>
              </div>
              
              <div className="desktop-filter-panel-body">
                <div className="advance-search-section">
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
                          type="number"
                          className="price-input"
                          placeholder="Min"
                          value={priceMin}
                          onChange={(e) => setPriceMin(e.target.value)}
                          min="0"
                        />
                        <div className="price-range-separator">
                          <span>To</span>
                        </div>
                        <input
                          type="number"
                          className="price-input"
                          placeholder="Max"
                          value={priceMax}
                          onChange={(e) => setPriceMax(e.target.value)}
                          min="0"
                        />
                      </div>
                      <div className="price-range-sliders">
                        <input
                          type="range"
                          min="0"
                          max="200000"
                          step="1000"
                          value={priceMin || 0}
                          onChange={(e) => setPriceMin(e.target.value)}
                          className="price-range-slider"
                          aria-label="Minimum price"
                        />
                        <input
                          type="range"
                          min="0"
                          max="200000"
                          step="1000"
                          value={priceMax || 200000}
                          onChange={(e) => setPriceMax(e.target.value)}
                          className="price-range-slider"
                          aria-label="Maximum price"
                        />
                      </div>
                    </div>
                  </div>

                  

                  {activeFilterCount > 0 && (
                    <button
                      className="clear-filters-btn"
                      onClick={() => {
                        clearAllFilters()
                        setIsSidebarOpen(false)
                      }}
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
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
                    type="number"
                    className="price-input"
                    placeholder="Min"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    min="0"
                  />
                  <div className="price-range-separator">
                    <span>To</span>
                  </div>
                  <input
                    type="number"
                    className="price-input"
                    placeholder="Max"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="price-range-sliders">
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="1000"
                    value={priceMin || 0}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="price-range-slider"
                    aria-label="Minimum price"
                  />
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="1000"
                    value={priceMax || 200000}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="price-range-slider"
                    aria-label="Maximum price"
                  />
                </div>
              </div>
            </div>

           

            {activeFilterCount > 0 && (
              <button
                className="clear-filters-btn"
                onClick={clearAllFilters}
              >
                Clear All Filters
              </button>
            )}
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
            {activeFilterCount > 0 && (
              <span className="filter-count-badge">{activeFilterCount}</span>
            )}
          </button>

          {/* Results Count, Categories, and Active Filters */}
          {!loading && paginatedProperties.length > 0 && (
            <div className="results-header">
              <div className="results-header-top">
                <div className="results-count">
                  <strong>{totalProperties}</strong> properties available
                </div>
                <div className="subcategory-row">
                  <button
                    className={`subcategory-chip ${subCategory === 'all' ? 'active' : ''}`}
                    onClick={() => {
                      setSubCategory('all')
                      setCurrentPage(1)
                    }}
                  >
                    All
                  </button>
                  <button
                    className={`subcategory-chip ${subCategory === 'featured' ? 'active' : ''}`}
                    onClick={() => {
                      setSubCategory('featured')
                      setCurrentPage(1)
                    }}
                  >
                    Featured
                  </button>
                  <button
                    className={`subcategory-chip ${subCategory === 'top' ? 'active' : ''}`}
                    onClick={() => {
                      setSubCategory('top')
                      setCurrentPage(1)
                    }}
                  >
                    Top
                  </button>
                  <button
                    className={`subcategory-chip ${subCategory === 'most-viewed' ? 'active' : ''}`}
                    onClick={() => {
                      setSubCategory('most-viewed')
                      setCurrentPage(1)
                    }}
                  >
                    Most Viewed
                  </button>
                </div>
                {activeFilterCount > 0 && (
                  <div className="active-filters">
                    {selectedLocation && (
                      <span className="filter-chip">
                        Location: {selectedLocation}
                        <button onClick={() => removeFilter('location')} aria-label="Remove location filter">×</button>
                      </span>
                    )}
                    {selectedType && selectedType !== 'All Types' && (
                      <span className="filter-chip">
                        Type: {selectedType}
                        <button onClick={() => removeFilter('type')} aria-label="Remove type filter">×</button>
                      </span>
                    )}
                    {minBaths && (
                      <span className="filter-chip">
                        Min Baths: {minBaths}+
                        <button onClick={() => removeFilter('minBaths')} aria-label="Remove baths filter">×</button>
                      </span>
                    )}
                    {minBeds && (
                      <span className="filter-chip">
                        Min Beds: {minBeds}+
                        <button onClick={() => removeFilter('minBeds')} aria-label="Remove beds filter">×</button>
                      </span>
                    )}
                    {priceMin && (
                      <span className="filter-chip">
                        Min Price: ₱{parseInt(priceMin).toLocaleString()}
                        <button onClick={() => removeFilter('priceMin')} aria-label="Remove min price filter">×</button>
                      </span>
                    )}
                    {priceMax && (
                      <span className="filter-chip">
                        Max Price: ₱{parseInt(priceMax).toLocaleString()}
                        <button onClick={() => removeFilter('priceMax')} aria-label="Remove max price filter">×</button>
                      </span>
                    )}
                    {searchQuery && (
                      <span className="filter-chip">
                        Search: {searchQuery}
                        <button onClick={() => removeFilter('search')} aria-label="Remove search filter">×</button>
                      </span>
                    )}
                    <button className="clear-filters-link" onClick={clearAllFilters}>
                      Clear All
                    </button>
                  </div>
                )}
              </div>
              <div className="categories-row">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    className={`category-chip ${selectedType === category.name ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedType(category.name)
                      setCurrentPage(1)
                    }}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>
          )}

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
                      image: property.image || ASSETS.PLACEHOLDER_PROPERTY_MAIN,
                      rentManagerName: property.agent?.first_name && property.agent?.last_name
                        ? `${property.agent.first_name} ${property.agent.last_name}`
                        : property.agent?.full_name
                        || property.rent_manager?.name
                        || 'Rental.Ph Official',
                      rentManagerRole: property.agent
                        ? getRentManagerRole(property.agent.verified)
                        : getRentManagerRole(property.rent_manager?.is_official),
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
                
                {/* Loading indicator for infinite scroll - both modes */}
                {isLoadingMore && (
                  <div className="loading-more-indicator">
                    <p>Loading more properties...</p>
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

