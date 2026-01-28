import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import VerticalPropertyCard from '../components/VerticalPropertyCard'
import HorizontalPropertyCard from '../components/HorizontalPropertyCard'
import './PropertiesForRentPage.css'
import PageHeader from '../components/PageHeader'

function PropertiesForRentPage() {
  const [searchParams] = useSearchParams()
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedType, setSelectedType] = useState('All Types')
  const [minBaths, setMinBaths] = useState('')
  const [minBeds, setMinBeds] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'horizontal' | 'vertical'>('vertical') // 'horizontal' for hamburger, 'vertical' for grid
  const itemsPerPage = 9 // 3 rows x 3 columns

  // Initialize state from URL query parameters
  useEffect(() => {
    const searchParam = searchParams.get('search')
    const typeParam = searchParams.get('type')
    const locationParam = searchParams.get('location')

    if (searchParam) {
      setSearchQuery(searchParam)
    }
    if (typeParam) {
      setSelectedType(typeParam)
    }
    if (locationParam) {
      setSelectedLocation(locationParam)
    }
  }, [searchParams])

  const propertyTypes = ['All Types', 'Condominium', 'Apartment', 'House', 'Bed Space', 'Commercial Spaces', 'Office Spaces', 'Studio', 'TownHouse', 'WareHouse', 'Dormitory', 'Farm Land']
  const locations = ['Metro Manila', 'Makati City', 'BGC', 'Quezon City', 'Mandaluyong', 'Pasig', 'Cebu City', 'Davao City', 'Lapulapu', 'Manila']
  const bathOptions = ['1', '2', '3', '4+']
  const bedOptions = ['1', '2', '3', '4+']
  
  // Category counts (matching the design)
  const categories = [
    { name: 'Apartments', count: 10 },
    { name: 'Farm Land', count: 1 },
    { name: 'Condominium', count: 1951 },
    { name: 'Studio', count: 720 },
    { name: 'TownHouse', count: 94 },
    { name: 'WareHouse', count: 225 },
    { name: 'Dormitory', count: 7 },
    { name: 'Commercial Spaces', count: 647 },
    { name: 'Apartments', count: 326 },
  ]

  const topSearches = [
    'Condominium For Rent In Cebu',
    'House & Lot For Rent In Lapulapu',
    'Studio For Rent In Makati',
    'Pet Friendly Unit In Manila'
  ]

  // Sample properties data
  const properties = [
    {
      id: 1,
      propertyType: 'Condominium',
      date: 'Jan 15, 2026',
      price: '₱35,000/Month',
      title: 'Azure Urban Residences - 2BR Fully Furnished',
      image: '/assets/property-1.jpg',
      rentManagerName: 'Maria Santos',
      rentManagerRole: 'Senior Rent Manager',
      bedrooms: 2,
      bathrooms: 2,
      parking: 1,
      location: 'Makati City'
    },
    {
      id: 2,
      propertyType: 'Apartment',
      date: 'Jan 18, 2026',
      price: '₱18,000/Month',
      title: 'Cozy 1BR Apartment Near BGC',
      image: '/assets/property-2.jpg',
      rentManagerName: 'John Reyes',
      rentManagerRole: 'Property Specialist',
      bedrooms: 1,
      bathrooms: 1,
      parking: 0,
      location: 'BGC'
    },
    {
      id: 3,
      propertyType: 'Condominium',
      date: 'Jan 20, 2026',
      price: '₱52,000/Month',
      title: 'Luxury Penthouse with City View',
      image: '/assets/property-3.jpg',
      rentManagerName: 'Sarah Dela Cruz',
      rentManagerRole: 'Rental Consultant',
      bedrooms: 3,
      bathrooms: 3,
      parking: 2,
      location: 'Makati City'
    },
    {
      id: 4,
      propertyType: 'House',
      date: 'Jan 22, 2026',
      price: '₱45,000/Month',
      title: 'Modern 3BR House in Exclusive Village',
      image: '/assets/property-4.jpg',
      rentManagerName: 'Miguel Torres',
      rentManagerRole: 'Senior Rent Manager',
      bedrooms: 3,
      bathrooms: 2,
      parking: 2,
      location: 'Quezon City'
    },
    {
      id: 5,
      propertyType: 'Bed Space',
      date: 'Jan 24, 2026',
      price: '₱6,500/Month',
      title: 'Clean Bed Space for Students/Professionals',
      image: '/assets/property-5.jpg',
      rentManagerName: 'Patricia Lim',
      rentManagerRole: 'Property Specialist',
      bedrooms: 1,
      bathrooms: 1,
      parking: 0,
      location: 'Mandaluyong'
    },
    {
      id: 6,
      propertyType: 'Commercial Spaces',
      date: 'Jan 25, 2026',
      price: '₱75,000/Month',
      title: 'Prime Commercial Space in Makati CBD',
      image: '/assets/property-6.jpg',
      rentManagerName: 'Robert Garcia',
      rentManagerRole: 'Rental Consultant',
      bedrooms: 0,
      bathrooms: 2,
      parking: 3,
      location: 'Makati City'
    },
    {
      id: 7,
      propertyType: 'Apartment',
      date: 'Jan 26, 2026',
      price: '₱22,000/Month',
      title: 'Spacious 2BR Apartment with Balcony',
      image: '/assets/property-7.jpg',
      rentManagerName: 'Maria Santos',
      rentManagerRole: 'Senior Rent Manager',
      bedrooms: 2,
      bathrooms: 1,
      parking: 1,
      location: 'Pasig'
    },
    {
      id: 8,
      propertyType: 'Condominium',
      date: 'Jan 27, 2026',
      price: '₱38,000/Month',
      title: 'Brand New Studio Condo in BGC',
      image: '/assets/property-8.jpg',
      rentManagerName: 'John Reyes',
      rentManagerRole: 'Property Specialist',
      bedrooms: 1,
      bathrooms: 1,
      parking: 1,
      location: 'BGC'
    },
    {
      id: 9,
      propertyType: 'Office Spaces',
      date: 'Jan 27, 2026',
      price: '₱95,000/Month',
      title: 'Premium Office Space with Skyline View',
      image: '/assets/property-9.jpg',
      rentManagerName: 'Sarah Dela Cruz',
      rentManagerRole: 'Rental Consultant',
      bedrooms: 0,
      bathrooms: 2,
      parking: 4,
      location: 'Makati City'
    },
    {
      id: 10,
      propertyType: 'Condominium',
      date: 'Jan 28, 2026',
      price: '₱28,000/Month',
      title: 'Affordable 1BR Condo Near MRT',
      image: '/assets/property-10.jpg',
      rentManagerName: 'Miguel Torres',
      rentManagerRole: 'Senior Rent Manager',
      bedrooms: 1,
      bathrooms: 1,
      parking: 0,
      location: 'Quezon City'
    },
    {
      id: 11,
      propertyType: 'House',
      date: 'Jan 28, 2026',
      price: '₱65,000/Month',
      title: 'Spacious 4BR House with Garden',
      image: '/assets/property-11.jpg',
      rentManagerName: 'Patricia Lim',
      rentManagerRole: 'Property Specialist',
      bedrooms: 4,
      bathrooms: 3,
      parking: 2,
      location: 'Quezon City'
    },
    {
      id: 12,
      propertyType: 'Apartment',
      date: 'Jan 29, 2026',
      price: '₱15,000/Month',
      title: 'Budget-Friendly Studio Apartment',
      image: '/assets/property-12.jpg',
      rentManagerName: 'Robert Garcia',
      rentManagerRole: 'Rental Consultant',
      bedrooms: 1,
      bathrooms: 1,
      parking: 0,
      location: 'Mandaluyong'
    },
  ]

  // Filter logic
  const filteredProperties = properties.filter(property => {
    const typeMatch = selectedType === 'All Types' || property.propertyType === selectedType
    const locationMatch = !selectedLocation || property.location === selectedLocation
    const bathMatch = !minBaths || property.bathrooms >= parseInt(minBaths)
    const bedMatch = !minBeds || property.bedrooms >= parseInt(minBeds)
    
    let priceMatch = true
    if (priceMin || priceMax) {
      const price = parseInt(property.price.replace(/[^0-9]/g, ''))
      if (priceMin) priceMatch = priceMatch && price >= parseInt(priceMin)
      if (priceMax) priceMatch = priceMatch && price <= parseInt(priceMax)
    }
    
    const searchMatch = !searchQuery || 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.propertyType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    return typeMatch && locationMatch && bathMatch && bedMatch && priceMatch && searchMatch
  })

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === 'price-low') {
      const priceA = parseInt(a.price.replace(/[^0-9]/g, ''))
      const priceB = parseInt(b.price.replace(/[^0-9]/g, ''))
      return priceA - priceB
    } else if (sortBy === 'price-high') {
      const priceA = parseInt(a.price.replace(/[^0-9]/g, ''))
      const priceB = parseInt(b.price.replace(/[^0-9]/g, ''))
      return priceB - priceA
    } else if (sortBy === 'newest') {
      // Newest to oldest (most recent first)
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    } else if (sortBy === 'oldest') {
      // Oldest to newest (oldest first)
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    }
    return 0
  })

  // Pagination calculations
  const totalPages = Math.ceil(sortedProperties.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProperties = sortedProperties.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedLocation, selectedType, minBaths, minBeds, priceMin, priceMax, searchQuery, sortBy])

  return (
    <div className="properties-for-rent-page">
      <Navbar />
      {/* Page Header */}
      <PageHeader title="Properties for Rent" />
      
      {/* Main Content Layout */}
      <main className="properties-main-layout">
        {/* Left Sidebar - Filters & Categories */}
        <div className="properties-sidebar">
          {/* Advance Search Section */}
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

          {/* List by Categories Section */}
          <div className="categories-section">
            <h2 className="section-title">List by Categories</h2>
            <ul className="categories-list">
              {categories.map((category, index) => (
                <li key={index} className="category-item">
                  <span className="category-name">{category.name}</span>
                  <span className="category-count">({category.count})</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Searches Section */}
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

        {/* Right Main Content */}
        <div className="properties-main-content">
          {/* Breadcrumbs */}
          

          {/* Top Search Bar */}
          <div className="top-search-bar-container">
            <div className="top-search-bar">
            <div className="search-input-container">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="8" stroke="#666" strokeWidth="2"/>
                <path d="m21 21-4.35-4.35" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input 
                type="text" 
                className="main-search-input"
                placeholder="Search here..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
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
              aria-label="Menu"
              onClick={() => setViewMode('horizontal')}
              style={{ backgroundColor: viewMode === 'horizontal' ? '#8B4513' : '#ffffff' }}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12H21M3 6H21M3 18H21" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <button 
              className="grid-view-btn" 
              aria-label="Grid View"
              onClick={() => setViewMode('vertical')}
              style={{ backgroundColor: viewMode === 'vertical' ? '#8B4513' : '#ffffff' }}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" stroke="#333" strokeWidth="2" fill="none"/>
                <rect x="14" y="3" width="7" height="7" stroke="#333" strokeWidth="2" fill="none"/>
                <rect x="3" y="14" width="7" height="7" stroke="#333" strokeWidth="2" fill="none"/>
                <rect x="14" y="14" width="7" height="7" stroke="#333" strokeWidth="2" fill="none"/>
              </svg>
            </button>
          </div>
          </div>

          {/* Properties Grid Container */}
          <div className="properties-content-wrapper">
            {paginatedProperties.length > 0 ? (
              <>
                <div className={viewMode === 'horizontal' ? 'properties-list' : 'properties-grid'}>
                  {paginatedProperties.map(property => 
                    viewMode === 'horizontal' ? (
                      <HorizontalPropertyCard
                        key={property.id}
                        id={property.id}
                        propertyType={property.propertyType}
                        date={property.date}
                        price={property.price}
                        title={property.title}
                        image={property.image}
                        rentManagerName={property.rentManagerName}
                        rentManagerRole={property.rentManagerRole}
                        bedrooms={property.bedrooms}
                        bathrooms={property.bathrooms}
                        parking={property.parking}
                        propertySize={`${(property.bedrooms * 15 + property.bathrooms * 5)} sqft`}
                      />
                    ) : (
                      <VerticalPropertyCard
                        key={property.id}
                        id={property.id}
                        propertyType={property.propertyType}
                        date={property.date}
                        price={property.price}
                        title={property.title}
                        image={property.image}
                        rentManagerName={property.rentManagerName}
                        rentManagerRole={property.rentManagerRole}
                        bedrooms={property.bedrooms}
                        bathrooms={property.bathrooms}
                        parking={property.parking}
                        propertySize={`${(property.bedrooms * 15 + property.bathrooms * 5)} sqft`}
                      />
                    )
                  )}
                </div>
                {totalPages > 1 && (
                  <div className="pagination">
                    <button 
                      className="pagination-arrow"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                    >
                      ←
                    </button>
                    {currentPage > 2 && (
                      <>
                        <button 
                          className="pagination-number"
                          onClick={() => setCurrentPage(1)}
                        >
                          1
                        </button>
                        {currentPage > 3 && <span className="pagination-ellipsis">...</span>}
                      </>
                    )}
                    {currentPage > 1 && (
                      <button 
                        className="pagination-number"
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        {currentPage - 1}
                      </button>
                    )}
                    <button 
                      className="pagination-number active"
                    >
                      {currentPage}
                    </button>
                    {currentPage < totalPages && (
                      <button 
                        className="pagination-number"
                        onClick={() => setCurrentPage(currentPage + 1)}
                      >
                        {currentPage + 1}
                      </button>
                    )}
                    {currentPage < totalPages - 1 && (
                      <>
                        {currentPage < totalPages - 2 && <span className="pagination-ellipsis">...</span>}
                        <button 
                          className="pagination-number"
                          onClick={() => setCurrentPage(totalPages)}
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                    <button 
                      className="pagination-arrow"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                    >
                      →
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

      {/* Featured Properties Section */}
      <section className="featured-properties-section">
        <div className="featured-properties-container">
          <div className="featured-properties-header">
            <div>
              <h2 className="featured-properties-title">Featured Properties</h2>
              <p className="featured-properties-subtitle">
                Handpicked properties from our verified agents
              </p>
            </div>
           
          </div>
        </div>
        <div className="featured-properties-carousel-wrapper">
          <div className="featured-properties-carousel">
            {properties.map(property => (
              <HorizontalPropertyCard
                key={property.id}
                id={property.id}
                propertyType={property.propertyType}
                date={property.date}
                price={property.price}
                title={property.title}
                image={property.image}
                rentManagerName={property.rentManagerName}
                rentManagerRole={property.rentManagerRole}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                parking={property.parking}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Properties for Short-Term Rent Section */}
      <section className="short-term-rent-section">
        <div className="short-term-rent-container">
          <h2 className="short-term-rent-title">Properties for Short-Term Rent</h2>
        </div>
        <div className="short-term-carousel-wrapper">
          <div className="short-term-carousel">
            {properties.map(property => (
              <HorizontalPropertyCard
                key={property.id}
                id={property.id}
                propertyType={property.propertyType}
                date={property.date}
                price={property.price}
                title={property.title}
                image={property.image}
                rentManagerName={property.rentManagerName}
                rentManagerRole={property.rentManagerRole}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                parking={property.parking}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default PropertiesForRentPage

