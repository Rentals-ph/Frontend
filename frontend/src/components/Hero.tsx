import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Hero.css'

function Hero() {
  const [searchQuery, setSearchQuery] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [location, setLocation] = useState('')
  const navigate = useNavigate()

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
    
    // Navigate to properties page with query parameters
    const queryString = params.toString()
    navigate(`/properties${queryString ? `?${queryString}` : ''}`)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <section id="home" style={{ position: 'relative', height: '550px', overflow: 'hidden', }}>
      {/* Background image that matches Figma hero */}
      <img
        src="/assets/landing-hero-bg-784ecf.png"
        alt="Skyline and buildings background"
        className="hero-background"
      />

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <h2 className="hero-title">
          FIND YOUR HOME IN THE <br></br> PHILIPPINES
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
        </div>
      </div>
    </section>
  )
}

export default Hero