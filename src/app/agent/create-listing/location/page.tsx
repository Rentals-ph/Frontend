'use client'

import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppSidebar from '../../../../components/common/AppSidebar'
import AgentHeader from '../../../../components/agent/AgentHeader'
import { useCreateListing } from '../../../../contexts/CreateListingContext'
import {
  FiChevronDown,
  FiArrowLeft,
  FiArrowRight,
  FiCheck
} from 'react-icons/fi'
import { philippinesProvinces, getCitiesByProvince } from '../../../../data/philippinesLocations'
import '../AgentCreateListingCategory.css'
import './page.css'

function ProgressRing({ percent }: { percent: number }) {
  const { radius, stroke, normalizedRadius, circumference, strokeDashoffset } = useMemo(() => {
    const r = 26
    const s = 6
    const nr = r - s / 2
    const c = nr * 2 * Math.PI
    const offset = c - (percent / 100) * c
    return {
      radius: r,
      stroke: s,
      normalizedRadius: nr,
      circumference: c,
      strokeDashoffset: offset
    }
  }, [percent])

  return (
    <div className="aclc-progress">
      <svg height={radius * 2} width={radius * 2} className="aclc-progress-svg">
        <circle
          stroke="#E5E7EB"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#2563EB"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="aclc-progress-ring"
        />
      </svg>
      <div className="aclc-progress-text">{percent}%</div>
    </div>
  )
}

export default function AgentCreateListingLocation() {
  const router = useRouter()
  const { data, updateData } = useCreateListing()

  const stepLabels = [
    'Category',
    'Details',
    'Location',
    'Property Images',
    'Pricing',
    'Attributes',
    'Owner Info',
    'Publish'
  ]

  const [country, setCountry] = useState(data.country || 'Philippines')
  const [state, setState] = useState(data.state || '')
  const [city, setCity] = useState(data.city || '')
  const [street, setStreet] = useState(data.street || '')
  const [latitude, setLatitude] = useState(data.latitude || '')
  const [longitude, setLongitude] = useState(data.longitude || '')
  const [availableCities, setAvailableCities] = useState<string[]>([])
  const [isGeocoding, setIsGeocoding] = useState(false)

  useEffect(() => {
    setCountry(data.country || 'Philippines')
    setState(data.state || '')
    setCity(data.city || '')
    setStreet(data.street || '')
    setLatitude(data.latitude || '')
    setLongitude(data.longitude || '')
  }, [data])

  // Update available cities when state changes
  useEffect(() => {
    if (state) {
      const cities = getCitiesByProvince(state)
      setAvailableCities(cities)
      // Reset city if it's not in the new list
      if (city && !cities.includes(city)) {
        setCity('')
      }
    } else {
      setAvailableCities([])
      setCity('')
    }
  }, [state, city])

  // Auto-geocode when street address is entered
  const handleStreetChange = async (value: string) => {
    setStreet(value)
    
    if (value.trim().length > 10) {
      setIsGeocoding(true)
      try {
        // Use OpenStreetMap Nominatim API for geocoding (free, no API key needed)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value + ', Philippines')}&limit=1`,
          {
            headers: {
              'User-Agent': 'Rental.ph Property Listing'
            }
          }
        )
        const data = await response.json()
        
        if (data && data.length > 0) {
          const result = data[0]
          const lat = parseFloat(result.lat)
          const lon = parseFloat(result.lon)
          
          setLatitude(lat.toString())
          setLongitude(lon.toString())
          
          // Try to extract state and city from address components
          const address = result.display_name || ''
          
          // Auto-populate country
          setCountry('Philippines')
          
          // Try to match province from the address
          const provinceMatch = philippinesProvinces.find(p => 
            address.includes(p.name)
          )
          if (provinceMatch) {
            setState(provinceMatch.name)
            // Try to match city
            const cityMatch = provinceMatch.cities.find(c => 
              address.includes(c)
            )
            if (cityMatch) {
              setCity(cityMatch)
            }
          }
        }
      } catch (error) {
        console.error('Geocoding error:', error)
        // Silently fail - user can still manually enter location
      } finally {
        setIsGeocoding(false)
      }
    }
  }

  return (
    <div className="agent-dashboard">
      <AppSidebar/>

      <main className="agent-main">
        <AgentHeader 
          title="Create Listing" 
          subtitle="Add property location." 
        />

        <div className="aclc-breadcrumb">
          <span className="aclc-breadcrumb-strong">Create Listing</span>
          <span className="aclc-breadcrumb-sep">&gt;</span>
          <span className="aclc-breadcrumb-muted">Location</span>
        </div>

        <div className="section-card aclc-stepper-card">
          <div className="aclc-stepper-left">
            <ProgressRing percent={30} />
            <div className="aclc-stepper-left-text">
              <div className="aclc-stepper-left-title">Completion Status</div>
            </div>
          </div>

          <div className="aclc-steps">
            {stepLabels.map((label, idx) => {
              const step = idx + 1
              const isActive = step === 3
              const isDone = step < 3
              return (
                <div className="aclc-step" key={label}>
                  <div className="aclc-step-top">
                    <div className={`aclc-step-circle ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                      {isDone ? <FiCheck /> : step}
                    </div>
                    {step !== stepLabels.length && (
                      <div className={`aclc-step-line ${step < 3 ? 'done' : ''}`} />
                    )}
                  </div>
                  <div className={`aclc-step-label ${isActive ? 'active' : ''}`}>{label}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="section-card aclc-form-card">
          <h2 className="aclc-form-title">Property Location</h2>

          <div className="acll-grid-3">
            <div>
              <label className="aclc-label" htmlFor="country">
                Country
              </label>
              <div className="aclc-select-wrap">
                <select
                  id="country"
                  className="aclc-select"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option value="Philippines">Philippines</option>
                </select>
                <FiChevronDown className="aclc-select-caret" />
              </div>
            </div>

            <div>
              <label className="aclc-label" htmlFor="state">
                State/Province
              </label>
              <div className="aclc-select-wrap">
                <select
                  id="state"
                  className="aclc-select"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="">--Select State/Province--</option>
                  {philippinesProvinces.map((province) => (
                    <option key={province.name} value={province.name}>
                      {province.name}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="aclc-select-caret" />
              </div>
            </div>

            <div>
              <label className="aclc-label" htmlFor="city">
                City
              </label>
              <div className="aclc-select-wrap">
                <select
                  id="city"
                  className="aclc-select"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={!state}
                >
                  <option value="">--Select City--</option>
                  {availableCities.map((cityName) => (
                    <option key={cityName} value={cityName}>
                      {cityName}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="aclc-select-caret" />
              </div>
            </div>
          </div>

          <div className="acll-street-section">
            <label className="aclc-label" htmlFor="street">
              Street Address
            </label>
            <input
              id="street"
              className="acld-input"
              placeholder="Enter street address, building name, etc. (Location will be auto-detected)"
              value={street}
              onChange={(e) => handleStreetChange(e.target.value)}
            />
            {isGeocoding && (
              <div className="acll-geocoding-indicator">
                <span>Detecting location...</span>
              </div>
            )}
            <div className="acll-info-banner">
              <span className="acll-info-icon">i</span>
              <p className="acll-info-text">
                If you don&apos;t want to pinpoint the exact location of the property, you may leave the
                street address blank and just select the country, state/province, and city to indicate
                the general area.
              </p>
            </div>
          </div>

          <div className="acll-map-section">
            <div className="acll-map-header">
              <span className="acll-map-title">Map Location</span>
              <div className="acll-map-tabs">
                <button className="acll-map-tab active" type="button">
                  Map
                </button>
                <button className="acll-map-tab" type="button">
                  Satellite
                </button>
              </div>
            </div>

            <div className="acll-map-container">
              <div className="acll-map-placeholder">
                <span className="acll-map-placeholder-text">
                  {latitude && longitude 
                    ? `Map location: ${latitude}, ${longitude}` 
                    : 'Map preview will appear here based on the selected location.'}
                </span>
              </div>
              <button className="acll-map-fullscreen-btn" type="button" aria-label="Full screen map">
                ⛶
              </button>
              <button className="acll-map-zoom-btn" type="button" aria-label="Map controls">
                +
              </button>
            </div>
          </div>
          
          {/* Hidden inputs for coordinates (auto-assigned via geocoding) */}
          <input type="hidden" name="latitude" value={latitude} />
          <input type="hidden" name="longitude" value={longitude} />

          <div className="acld-footer-actions acll-footer-actions">
            <button
              className="acld-prev-btn"
              onClick={() => router.push('/agent/create-listing/details')}
              type="button"
            >
              <FiArrowLeft />
              <span>Previous</span>
            </button>

            <button
              className="aclc-next-btn"
              onClick={() => {
                updateData({
                  country: country || 'Philippines',
                  state,
                  city,
                  street,
                  latitude: latitude || '',
                  longitude: longitude || '',
                })
                router.push('/agent/create-listing/property-images')
              }}
              type="button"
            >
              <span>Next</span>
              <FiArrowRight />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

