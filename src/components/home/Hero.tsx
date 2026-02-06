'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ASSETS, getAsset } from '@/utils/assets'
import './Hero.css'
import HeroBanner from './HeroBanner'

function Hero() {
  const [searchQuery, setSearchQuery] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [location, setLocation] = useState('')
  const [minBeds, setMinBeds] = useState('')
  const [minBaths, setMinBaths] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const router = useRouter()

  // Array of background images - add your new image path here when ready
  const backgroundImages = [
    ASSETS.BG_HERO_LANDING,
    getAsset('BG_HERO_LANDING_NEW') || ASSETS.BG_HERO_LANDING,
    // Add your new minimalist living room image path here:
    // '/assets/backgrounds/your-new-image.png'
  ].filter(Boolean) // Remove any undefined values

  // Recommended searches
  const recommendedSearches = [
    'Condominium For Rent In Cebu',
    'House & Lot For Rent In Lapulapu',
    'Studio For Rent In Makati',
    'Pet Friendly Unit In Manila',
    '2 Bedroom Apartment In BGC',
    'Affordable Studio In Quezon City'
  ]

  // Map property types from Hero to PropertiesForRentPage format
  const propertyTypeMap: { [key: string]: string } = {
    'condominium': 'Condominium',
    'apartment': 'Apartment',
    'bedspace': 'Bed Space',
    'commercial': 'Commercial Spaces',
    'office': 'Office Spaces'
  }

  // Map locations from Hero to PropertiesForRentPage format
  const locationMap: { [key: string]: string } = {
    'manila': 'Manila',
    'makati': 'Makati City',
    'bgc': 'BGC',
    'quezon': 'Quezon City',
    'mandaluyong': 'Mandaluyong',
    'pasig': 'Pasig',
    'cebu': 'Cebu City',
    'davao': 'Davao City',
    'lapulapu': 'Lapulapu',
    'metro-manila': 'Metro Manila'
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim())
    }
    
    if (propertyType && propertyTypeMap[propertyType]) {
      params.set('type', propertyTypeMap[propertyType])
    }
    
    if (location && locationMap[location]) {
      params.set('location', locationMap[location])
    }

    // Add advanced filters
    if (minBeds) {
      params.set('minBeds', minBeds)
    }
    if (minBaths) {
      params.set('minBaths', minBaths)
    }
    if (priceMin) {
      params.set('priceMin', priceMin)
    }
    if (priceMax) {
      params.set('priceMax', priceMax)
    }
    
    // Navigate to properties page with query parameters
    const queryString = params.toString()
    router.push(`/properties${queryString ? `?${queryString}` : ''}`)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleRecommendedSearch = (search: string) => {
    const params = new URLSearchParams()
    params.set('search', search)
    router.push(`/properties?${params.toString()}`)
  }

  // Auto-rotate background images with smooth transitions
  useEffect(() => {
    if (backgroundImages.length <= 1) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      )
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [backgroundImages.length])

  return (
    <section id="home" className="hero-section">
      {/* Background images with smooth transitions */}
      <div className="hero-background-container">
        {backgroundImages.map((imageSrc, index) => (
          <img
            key={index}
            src={imageSrc}
            alt={`Hero background ${index + 1}`}
            className={`hero-background ${index === currentImageIndex ? 'active' : ''}`}
          />
        ))}
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <h2 className="hero-title">
          FIND YOUR HOME IN THE PHILIPPINES
        </h2>
        <p className="hero-subtitle mt-3 max-w-3xl">
          <span className="hero-subtitle-text">Trusted Rentals, simplified. Start your journey with </span>
          <span className="hero-subtitle-brand">Rentals.ph.</span>
        </p>

        {/* Search bar and filters */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <input 
              type="text" 
              className="search-inputs" 
              placeholder="What are you looking for?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />

            <div className="search-divider" />

            <select 
              className="search-dropdown"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              <option value="">Property Type</option>
              <option value="condominium">Condominium</option>
              <option value="apartment">Apartment</option>
              <option value="bedspace">Bed Space</option>
              <option value="commercial">Commercial Spaces</option>
              <option value="office">Office Spaces</option>
            </select>
              
            <div className="search-divider" />
              
            <select 
              className="search-dropdown"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">Location</option>
              <option value="metro-manila">Metro Manila</option>
              <option value="makati">Makati City</option>
              <option value="bgc">BGC</option>
              <option value="quezon">Quezon City</option>
              <option value="mandaluyong">Mandaluyong</option>
              <option value="pasig">Pasig</option>
              <option value="cebu">Cebu City</option>
              <option value="davao">Davao City</option>
              <option value="lapulapu">Lapulapu</option>
              <option value="manila">Manila</option>
            </select>

            <button 
              className="search-button"
              onClick={handleSearch}
            >
              <span className="sr-only">Search</span>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="6" stroke="white" strokeWidth="2.5"/>
                <line x1="15.5" y1="15.5" x2="20" y2="20" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Advanced Options - Inside search container */}
          <div className="advanced-options-panel">
            <div className="advanced-options-grid">
              <div className="advanced-option-group">
                <label className="advanced-option-label">Min. Bedrooms</label>
                <select 
                  className="advanced-option-select"
                  value={minBeds}
                  onChange={(e) => setMinBeds(e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>

              <div className="advanced-option-group">
                <label className="advanced-option-label">Min. Bathrooms</label>
                <select 
                  className="advanced-option-select"
                  value={minBaths}
                  onChange={(e) => setMinBaths(e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>

              <div className="advanced-option-group price-range-group">
                <label className="advanced-option-label">Price Range</label>
                <div className="price-range-inputs-wrapper">
                  <input
                    type="number"
                    className="price-range-input"
                    placeholder="Min"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                  />
                  <span className="price-range-separator">to</span>
                  <input
                    type="number"
                    className="price-range-input"
                    placeholder="Max"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Searches - Outside search container */}
        <div className="recommended-searches">
          <div className="recommended-searches-list">
            {recommendedSearches.map((search, index) => (
              <button
                key={index}
                className="recommended-search-chip"
                onClick={() => handleRecommendedSearch(search)}
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Banner - Positioned absolutely at bottom */}
      <HeroBanner />
    </section>
  )
}

export default Hero