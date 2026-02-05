'use client'

import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppSidebar from '../../../../components/common/AppSidebar'
import AgentHeader from '../../../../components/agent/AgentHeader'
import { useCreateListing } from '../../../../contexts/CreateListingContext'
import api from '../../../../lib/api'
import { compressImage } from '../../../../utils/imageCompression'
import { uploadWithProgress } from '../../../../utils/uploadProgress'
import { uploadPropertyMainImage } from '../../../../utils/imageUpload'
import { getApiBaseUrl } from '../../../../config/api'

import {
  FiCheck,
  FiEdit,
  FiArrowLeft
} from 'react-icons/fi'
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

export default function AgentCreateListingPublish() {
  const router = useRouter()
  const { data, resetData } = useCreateListing()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isCompressing, setIsCompressing] = useState(false)

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

        <div className="section-card aclc-form-card">
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

          {/* Upload Progress Bar */}
          {(isSubmitting || isCompressing) && (
            <div style={{
              marginBottom: '1rem',
              padding: '1rem',
              backgroundColor: '#F3F4F6',
              borderRadius: '8px',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                color: '#6B7280'
              }}>
                <span>{isCompressing ? 'Compressing images...' : 'Uploading listing...'}</span>
                <span>{uploadProgress}%</span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#E5E7EB',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${uploadProgress}%`,
                  height: '100%',
                  backgroundColor: '#2563EB',
                  transition: 'width 0.3s ease',
                }} />
              </div>
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
                setIsCompressing(true)
                setSubmitError(null)
                setUploadProgress(0)

                try {
                  // Step 1: Compress images before upload (reduces upload time significantly)
                  let compressedImage: File | null = null
                  if (data.images.length > 0) {
                    try {
                      compressedImage = await compressImage(data.images[0], {
                        maxWidth: 1920,
                        maxHeight: 1920,
                        quality: 0.85,
                        maxSizeMB: 2,
                      })
                    } catch (compressError) {
                      console.warn('Image compression failed, using original:', compressError)
                      compressedImage = data.images[0]
                    }
                  }
                  setIsCompressing(false)

                  // Step 2: Create FormData efficiently
                  const formData = new FormData()
                  
                  // Basic property info (batch append)
                  const propertyData = {
                    title: data.title,
                    description: data.description,
                    type: data.category,
                    location: data.street || data.city || data.state || data.country,
                    price: data.price,
                    price_type: data.priceType,
                    bedrooms: data.bedrooms.toString(),
                    bathrooms: data.bathrooms.toString(),
                    garage: data.garage.toString(),
                    area: data.floorArea.toString(),
                    lot_area: data.lotArea.toString(),
                    floor_area_unit: data.floorUnit,
                  }
                  
                  Object.entries(propertyData).forEach(([key, value]) => {
                    formData.append(key, value)
                  })
                  
                  // Amenities as JSON string
                  if (data.amenities.length > 0) {
                    formData.append('amenities', JSON.stringify(data.amenities))
                  }
                  
                  if (data.furnishing) {
                    formData.append('furnishing', data.furnishing)
                  }
                  
                  // Location details (batch append)
                  const locationData = {
                    latitude: data.latitude,
                    longitude: data.longitude,
                    zoom_level: data.zoom,
                    country: data.country,
                    state_province: data.state,
                    city: data.city,
                    street_address: data.street,
                  }
                  
                  Object.entries(locationData).forEach(([key, value]) => {
                    if (value) formData.append(key, value)
                  })
                  
                  // Video URL
                  if (data.videoUrl) {
                    formData.append('video_url', data.videoUrl)
                  }
                  
                  // Step 3: Create property first to get ID, then upload image
                  const API_BASE_URL = getApiBaseUrl()
                  const token = localStorage.getItem('auth_token')
                  
                  // Create property without image first
                  const createResponse = await uploadWithProgress(
                    `${API_BASE_URL}/properties`,
                    formData,
                    token,
                    (progress) => {
                      // Update progress for property creation (first 50%)
                      setUploadProgress(Math.min(progress.percent / 2, 50))
                    }
                  )
                  
                  const createResponseData = await createResponse.json()
                  
                  if (!createResponse.ok || !createResponseData.success) {
                    throw new Error(createResponseData.message || 'Failed to create property')
                  }
                  
                  // Get property ID from response
                  const propertyId = createResponseData.data?.id || createResponseData.property?.id || createResponseData.id
                  
                  if (!propertyId) {
                    throw new Error('Property created but no ID returned')
                  }
                  
                  // Step 4: Upload image with storage path structure
                  if (compressedImage && propertyId) {
                    try {
                      const imageResult = await uploadPropertyMainImage(
                        compressedImage,
                        propertyId,
                        `${API_BASE_URL}/properties/${propertyId}/image`,
                        token,
                        (progress) => {
                          // Update progress for image upload (last 50%)
                          setUploadProgress(50 + (progress.percent / 2))
                        }
                      )
                      
                      // Image uploaded successfully with storage path
                      console.log('Image uploaded to:', imageResult.path)
                    } catch (imageError) {
                      console.warn('Image upload failed, but property was created:', imageError)
                      // Property is created, image upload failure is not critical
                    }
                  }
                  
                  resetData()
                  setUploadProgress(100)
                  setTimeout(() => {
                    window.alert('Listing published successfully!')
                    router.push('/agent/listings')
                  }, 300)
                } catch (error) {
                  console.error('Error publishing listing:', error)
                  setSubmitError(error instanceof Error ? error.message : 'An error occurred while publishing. Please try again.')
                } finally {
                  setIsSubmitting(false)
                  setIsCompressing(false)
                }
              }}
              type="button"
              disabled={isSubmitting || isCompressing}
            >
              <span>
                {isCompressing 
                  ? 'Compressing images...' 
                  : isSubmitting 
                    ? `Publishing... ${uploadProgress > 0 ? `${uploadProgress}%` : ''}` 
                    : 'Publish Listing'}
              </span>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

