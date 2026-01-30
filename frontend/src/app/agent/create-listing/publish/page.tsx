'use client'

import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppSidebar from '../../../../components/common/AppSidebar'
import AgentHeader from '../../../../components/agent/AgentHeader'
import { useCreateListing } from '../../../../contexts/CreateListingContext'
import api from '../../../../lib/api'

import {
  FiCheck,
  FiEdit,
  FiArrowLeft
} from 'react-icons/fi'
import '../../../../pages-old/agent/AgentCreateListingCategory.css'
import '../../../../pages-old/agent/AgentCreateListingPublish.css'

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

export default function AgentCreateListingPublish() {
  const router = useRouter()
  const { data, resetData } = useCreateListing()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    // Check if agent account is processing
    const registrationStatus = localStorage.getItem('agent_registration_status')
    const agentStatus = localStorage.getItem('agent_status')
    
    if (registrationStatus === 'processing' || 
        agentStatus === 'processing' || 
        agentStatus === 'pending' || 
        agentStatus === 'under_review') {
      setIsProcessing(true)
    }
  }, [])

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

  const propertyData = {
    category: data.category || 'Not Set',
    title: data.title || 'Not Set',
    price: data.price ? `₱${data.price}` : 'Not Set',
    priceType: data.priceType || 'Monthly',
    location: data.street 
      ? `${data.street}, ${data.city || ''}, ${data.state || ''}`.trim()
      : data.city || data.state || 'Not Set',
    bedrooms: data.bedrooms?.toString() || '0',
    bathrooms: data.bathrooms?.toString() || '0',
    floorArea: data.floorArea ? `${data.floorArea} ${data.floorUnit}` : 'Not Set',
    video: data.videoUrl || 'Not Provided'
  }

  const handleEdit = (section: string) => {
    // Navigate to the appropriate step based on the section
    const stepMap: Record<string, string> = {
      category: '/agent/create-listing/category',
      title: '/agent/create-listing/details',
      price: '/agent/create-listing/pricing',
      location: '/agent/create-listing/location',
      bedrooms: '/agent/create-listing/details',
      bathrooms: '/agent/create-listing/details',
      floorArea: '/agent/create-listing/details',
      video: '/agent/create-listing/property-images'
    }
    const route = stepMap[section] || '/agent/create-listing/category'
    router.push(route)
  }

  return (
    <div className="agent-dashboard">
      <AppSidebar/>

      <main className="agent-main">
        <AgentHeader 
          title="Create Listing" 
          subtitle="Review and publish your listing." 
        />

        <div className="aclc-breadcrumb">
          <span className="aclc-breadcrumb-strong">Create Listing</span>
          <span className="aclc-breadcrumb-sep">&gt;</span>
          <span className="aclc-breadcrumb-muted">Publish</span>
        </div>

        <div className="section-card aclc-stepper-card">
          <div className="aclc-stepper-left">
            <ProgressRing percent={90} />
            <div className="aclc-stepper-left-text">
              <div className="aclc-stepper-left-title">Completion Status</div>
            </div>
          </div>

          <div className="aclc-steps">
            {stepLabels.map((label, idx) => {
              const step = idx + 1
              const isActive = step === 8
              const isDone = step < 8
              return (
                <div className="aclc-step" key={label}>
                  <div className="aclc-step-top">
                    <div className={`aclc-step-circle ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                      {isDone ? <FiCheck /> : step}
                    </div>
                    {step !== stepLabels.length && (
                      <div className={`aclc-step-line ${step < 8 ? 'done' : ''}`} />
                    )}
                  </div>
                  <div className={`aclc-step-label ${isActive ? 'active' : ''}`}>{label}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="section-card acpu-form-card">
          <h2 className="aclc-form-title">Review and Publish</h2>
          
          {/* Error Message */}
          {submitError && (
            <div style={{
              padding: '1rem',
              marginBottom: '1rem',
              backgroundColor: '#FEE2E2',
              border: '1px solid #FCA5A5',
              borderRadius: '8px',
              color: '#991B1B'
            }}>
              {submitError}
            </div>
          )}
          
          {/* Processing Account Notice */}
          {isProcessing && (
            <div className="acpu-processing-notice">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="#FE8E0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 6V10M10 14H10.01" stroke="#FE8E0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <strong>Note:</strong> Your account is currently under review. Your listing will be saved but won't be visible to users until your account is approved by our admin team.
              </div>
            </div>
          )}

          <div className="acpu-summary-section">
            <div className="acpu-summary-header">
              <h3 className="acpu-summary-title">Property & Summary</h3>
            </div>

            <div className="acpu-summary-content">
              <div className="acpu-summary-row">
                <div className="acpu-summary-label">Category</div>
                <div className="acpu-summary-value-group">
                  <div className="acpu-summary-value">{propertyData.category}</div>
                  <button
                    className="acpu-edit-btn"
                    onClick={() => handleEdit('category')}
                    type="button"
                  >
                    <FiEdit className="acpu-edit-icon" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>

              <div className="acpu-summary-row">
                <div className="acpu-summary-label">Title</div>
                <div className="acpu-summary-value-group">
                  <div className="acpu-summary-value">{propertyData.title}</div>
                  <button
                    className="acpu-edit-btn"
                    onClick={() => handleEdit('title')}
                    type="button"
                  >
                    <FiEdit className="acpu-edit-icon" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>

              <div className="acpu-summary-row">
                <div className="acpu-summary-label">Price</div>
                <div className="acpu-summary-value-group">
                  <div className="acpu-summary-value">
                    {propertyData.price} ({propertyData.priceType})
                  </div>
                  <button
                    className="acpu-edit-btn"
                    onClick={() => handleEdit('price')}
                    type="button"
                  >
                    <FiEdit className="acpu-edit-icon" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>

              <div className="acpu-summary-row">
                <div className="acpu-summary-label">Location</div>
                <div className="acpu-summary-value-group">
                  <div className="acpu-summary-value">{propertyData.location}</div>
                  <button
                    className="acpu-edit-btn"
                    onClick={() => handleEdit('location')}
                    type="button"
                  >
                    <FiEdit className="acpu-edit-icon" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>

              <div className="acpu-summary-row">
                <div className="acpu-summary-label">Bedrooms</div>
                <div className="acpu-summary-value-group">
                  <div className="acpu-summary-value">{propertyData.bedrooms}</div>
                  <button
                    className="acpu-edit-btn"
                    onClick={() => handleEdit('bedrooms')}
                    type="button"
                  >
                    <FiEdit className="acpu-edit-icon" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>

              <div className="acpu-summary-row">
                <div className="acpu-summary-label">Bathrooms</div>
                <div className="acpu-summary-value-group">
                  <div className="acpu-summary-value">{propertyData.bathrooms}</div>
                  <button
                    className="acpu-edit-btn"
                    onClick={() => handleEdit('bathrooms')}
                    type="button"
                  >
                    <FiEdit className="acpu-edit-icon" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>

              <div className="acpu-summary-row">
                <div className="acpu-summary-label">Floor Area</div>
                <div className="acpu-summary-value-group">
                  <div className="acpu-summary-value">{propertyData.floorArea}</div>
                  <button
                    className="acpu-edit-btn"
                    onClick={() => handleEdit('floorArea')}
                    type="button"
                  >
                    <FiEdit className="acpu-edit-icon" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>

              <div className="acpu-summary-row">
                <div className="acpu-summary-label">Video</div>
                <div className="acpu-summary-value-group">
                  <div className="acpu-summary-value">{propertyData.video}</div>
                  <button
                    className="acpu-edit-btn"
                    onClick={() => handleEdit('video')}
                    type="button"
                  >
                    <FiEdit className="acpu-edit-icon" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="acpu-footer-actions">
            <button
              className="acld-prev-btn"
              onClick={() => router.push('/agent/create-listing/owner-info')}
              type="button"
            >
              <FiArrowLeft />
              <span>Previous</span>
            </button>
            <button
              className="acpu-publish-btn"
              onClick={async () => {
                setIsSubmitting(true)
                setSubmitError(null)

                try {
                  // Create FormData for file uploads
                  const formData = new FormData()
                  
                  // Basic property info
                  formData.append('title', data.title)
                  formData.append('description', data.description)
                  formData.append('type', data.category)
                  formData.append('location', data.street || data.city || data.state || data.country)
                  formData.append('price', data.price)
                  formData.append('price_type', data.priceType)
                  formData.append('bedrooms', data.bedrooms.toString())
                  formData.append('bathrooms', data.bathrooms.toString())
                  formData.append('garage', data.garage.toString())
                  formData.append('area', data.floorArea.toString())
                  formData.append('lot_area', data.lotArea.toString())
                  formData.append('floor_area_unit', data.floorUnit)
                  
                  // Amenities as JSON string
                  if (data.amenities.length > 0) {
                    formData.append('amenities', JSON.stringify(data.amenities))
                  }
                  
                  if (data.furnishing) {
                    formData.append('furnishing', data.furnishing)
                  }
                  
                  // Location details
                  if (data.latitude) formData.append('latitude', data.latitude)
                  if (data.longitude) formData.append('longitude', data.longitude)
                  if (data.zoom) formData.append('zoom_level', data.zoom)
                  if (data.country) formData.append('country', data.country)
                  if (data.state) formData.append('state_province', data.state)
                  if (data.city) formData.append('city', data.city)
                  if (data.street) formData.append('street_address', data.street)
                  
                  // Video URL
                  if (data.videoUrl) {
                    formData.append('video_url', data.videoUrl)
                  }
                  
                  // Owner information
                  if (data.ownerFirstname) formData.append('owner_firstname', data.ownerFirstname)
                  if (data.ownerLastname) formData.append('owner_lastname', data.ownerLastname)
                  if (data.ownerPhone) formData.append('owner_phone', data.ownerPhone)
                  if (data.ownerEmail) formData.append('owner_email', data.ownerEmail)
                  if (data.ownerCountry) formData.append('owner_country', data.ownerCountry)
                  if (data.ownerState) formData.append('owner_state', data.ownerState)
                  if (data.ownerCity) formData.append('owner_city', data.ownerCity)
                  if (data.ownerStreetAddress) formData.append('owner_street_address', data.ownerStreetAddress)
                  
                  // Image upload (first image as main image)
                  if (data.images.length > 0) {
                    formData.append('image', data.images[0])
                  }
                  
                  // RAPA document
                  if (data.rapaFile) {
                    formData.append('rapa_document', data.rapaFile)
                  }
                  
                  const response = await api.post('/properties', formData)
                  
                  if (response.success) {
                    resetData()
                    window.alert('Listing published successfully!')
                    router.push('/agent/listings')
                  } else {
                    setSubmitError(response.message || 'Failed to publish listing. Please try again.')
                  }
                } catch (error) {
                  console.error('Error publishing listing:', error)
                  setSubmitError('An error occurred while publishing. Please try again.')
                } finally {
                  setIsSubmitting(false)
                }
              }}
              type="button"
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? 'Publishing...' : 'Publish Listing'}</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

