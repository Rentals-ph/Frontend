'use client'

import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppSidebar from '../../../../components/common/AppSidebar'
import AgentHeader from '../../../../components/agent/AgentHeader'
import { useCreateListing } from '../../../../contexts/CreateListingContext'
import { compressImage } from '../../../../utils/imageCompression'
import { uploadWithProgress } from '../../../../utils/uploadProgress'
import { getApiBaseUrl } from '../../../../config/api'

import {
  FiCheck,
  FiEdit,
  FiArrowLeft,
  FiArrowRight,
  FiUpload,
  FiDollarSign
} from 'react-icons/fi'
// Converted to Tailwind CSS

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
    <div className="relative w-13 h-13 flex-shrink-0"> {/* aclc-progress */}
      <svg height={radius * 2} width={radius * 2} className="-rotate-90"> {/* aclc-progress-svg */}
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
          className="transition-all duration-250 ease-in" // aclc-progress-ring
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-900">{percent}%</div> {/* aclc-progress-text */}
    </div>
  )
}

export default function AgentCreateListingOwnerReview() {
  const router = useRouter()
  const { data, updateData, resetData } = useCreateListing()
  
  // Streamlined 3-step flow (pricing merged into this step)
  const stepLabels = [
    'Basic Information',
    'Visuals & Features',
    'Owner Info & Review'
  ]

  // Owner Info state
  const [formData, setFormData] = useState({
    firstname: data.ownerFirstname,
    lastname: data.ownerLastname,
    phone: data.ownerPhone,
    email: data.ownerEmail,
    country: data.ownerCountry,
    state: data.ownerState,
    city: data.ownerCity,
    streetAddress: data.ownerStreetAddress
  })
  const [countryCode, setCountryCode] = useState('+63')
  const [rapaFile, setRapaFile] = useState<File | null>(data.rapaFile)

  // Pricing state
  const [price, setPrice] = useState(data.price)
  const [priceType, setPriceType] = useState<'Monthly' | 'Weekly' | 'Daily' | 'Yearly'>(data.priceType)

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompressing, setIsCompressing] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    setFormData({
      firstname: data.ownerFirstname,
      lastname: data.ownerLastname,
      phone: data.ownerPhone,
      email: data.ownerEmail,
      country: data.ownerCountry,
      state: data.ownerState,
      city: data.ownerCity,
      streetAddress: data.ownerStreetAddress
    })
    setRapaFile(data.rapaFile)
    setPrice(data.price)
    setPriceType(data.priceType)
    
    // Check if agent account is processing
    const registrationStatus = localStorage.getItem('agent_registration_status')
    const agentStatus = localStorage.getItem('agent_status')
    
    if (registrationStatus === 'processing' || 
        agentStatus === 'processing' || 
        agentStatus === 'pending' || 
        agentStatus === 'under_review') {
      setIsProcessing(true)
    }
  }, [data])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRapaFile(e.target.files[0])
    }
  }

  const propertyData = {
    category: data.category || 'Not Set',
    title: data.title || 'Not Set',
    price: price ? `₱${price}` : 'Not Set',
    priceType: priceType || 'Monthly',
    location: data.street 
      ? `${data.street}, ${data.city || ''}, ${data.state || ''}`.trim()
      : data.city || data.state || 'Not Set',
    bedrooms: data.bedrooms?.toString() || '0',
    bathrooms: data.bathrooms?.toString() || '0',
    floorArea: data.floorArea ? `${data.floorArea} ${data.floorUnit}` : 'Not Set',
  }

  const handleEdit = (section: string) => {
    const stepMap: Record<string, string> = {
      category: '/agent/create-listing/basic-info',
      title: '/agent/create-listing/basic-info',
      price: '/agent/create-listing/owner-review',
      location: '/agent/create-listing/basic-info',
      bedrooms: '/agent/create-listing/basic-info',
      bathrooms: '/agent/create-listing/basic-info',
      floorArea: '/agent/create-listing/basic-info',
      video: '/agent/create-listing/visuals-features',
      amenities: '/agent/create-listing/visuals-features',
    }
    const route = stepMap[section] || '/agent/create-listing/basic-info'
    router.push(route)
  }

  const handlePublish = async () => {
    setIsSubmitting(true)
    setIsCompressing(true)
    setSubmitError(null)
    setUploadProgress(0)

    try {
      // Update owner info and pricing
      updateData({
        ownerFirstname: formData.firstname,
        ownerLastname: formData.lastname,
        ownerPhone: formData.phone,
        ownerEmail: formData.email,
        ownerCountry: formData.country,
        ownerState: formData.state,
        ownerCity: formData.city,
        ownerStreetAddress: formData.streetAddress,
        rapaFile,
        price,
        priceType,
      })

      // Compress images
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

      // Create FormData
      const formDataObj = new FormData()
      
      const propertyDataObj = {
        title: data.title,
        description: data.description,
        type: data.category,
        location: data.street || data.city || data.state || data.country,
        price: price,
        price_type: priceType,
        bedrooms: data.bedrooms.toString(),
        bathrooms: data.bathrooms.toString(),
        garage: data.garage.toString(),
        area: data.floorArea.toString(),
        lot_area: data.lotArea.toString(),
        floor_area_unit: data.floorUnit,
      }
      
      Object.entries(propertyDataObj).forEach(([key, value]) => {
        formDataObj.append(key, value)
      })
      
      if (data.amenities.length > 0) {
        formDataObj.append('amenities', JSON.stringify(data.amenities))
      }
      
      const locationData = {
        latitude: data.latitude,
        longitude: data.longitude,
        country: data.country,
        state_province: data.state,
        city: data.city,
        street_address: data.street,
      }
      
      Object.entries(locationData).forEach(([key, value]) => {
        if (value) formDataObj.append(key, value)
      })
      
      if (data.videoUrl) {
        formDataObj.append('video_url', data.videoUrl)
      }
      
      if (compressedImage) {
        formDataObj.append('image', compressedImage)
      }
      
      // Upload with progress
      const API_BASE_URL = getApiBaseUrl()
      const token = localStorage.getItem('auth_token')
      
      const response = await uploadWithProgress(
        `${API_BASE_URL}/properties`,
        formDataObj,
        token,
        (progress) => {
          setUploadProgress(progress.percent)
        }
      )
      
      const responseData = await response.json()
      
      if (response.ok && responseData.success) {
        resetData()
        setUploadProgress(100)
        setTimeout(() => {
          window.alert('Listing published successfully!')
          router.push('/agent/listings')
        }, 300)
      } else {
        setSubmitError(responseData.message || 'Failed to publish listing. Please try again.')
        setUploadProgress(0)
      }
    } catch (error) {
      console.error('Error publishing listing:', error)
      setSubmitError(error instanceof Error ? error.message : 'An error occurred while publishing. Please try again.')
    } finally {
      setIsSubmitting(false)
      setIsCompressing(false)
    }
  }


  return (
    <div className="agent-dashboard">
      <AppSidebar/>
      <main className="agent-main">
        <AgentHeader 
          title="Create Listing" 
          subtitle="Add owner information and review your listing." 
        />

        <div className="flex items-center gap-2 text-xl font-semibold text-gray-900 my-1.5 mx-0 mb-4"> {/* aclc-breadcrumb */}
          <span className="text-gray-900">Create Listing</span> {/* aclc-breadcrumb-strong */}
          <span className="text-gray-400 font-medium">&gt;</span> {/* aclc-breadcrumb-sep */}
          <span className="text-gray-400 font-semibold">Owner Info & Review</span> {/* aclc-breadcrumb-muted */}
        </div>

        <div className="flex items-center gap-4 p-5 mb-6 bg-white rounded-xl shadow-sm md:flex-col md:items-start"> {/* section-card aclc-stepper-card */}
          <div className="flex items-center gap-3 min-w-[220px]"> {/* aclc-stepper-left */}
            <ProgressRing percent={100} />
            <div className="text-sm font-semibold text-gray-600">Completion Status</div> {/* aclc-stepper-left-title */}
          </div>

          <div className="flex-1 grid grid-cols-4 items-start gap-0 md:w-full md:overflow-x-auto md:pb-1.5 md:justify-start"> {/* aclc-steps */}
            {stepLabels.map((label, idx) => {
              const step = idx + 1
              const isActive = step === 3
              const isDone = step < 3
              return (
                <div className="flex flex-col items-center min-w-0 flex-shrink-0" key={label}> {/* aclc-step */}
                  <div className="w-full flex items-center relative"> {/* aclc-step-top */}
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-base flex-shrink-0 relative z-10 ${isActive ? 'bg-blue-600 text-white' : isDone ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}> {/* aclc-step-circle */}
                      {isDone ? <FiCheck className="text-lg" /> : step}
                    </div>
                    {step !== stepLabels.length && (
                      <div className={`h-1.5 rounded-full flex-1 ml-2 mr-2 min-w-0 ${step < 3 ? 'bg-blue-600' : 'bg-gray-200'}`} /> // aclc-step-line
                    )}
                  </div>
                  <div className={`mt-2 text-xs font-semibold text-center leading-tight ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>{label}</div> {/* aclc-step-label */}
                </div>
              )
            })}
          </div>
        </div>

        <div className="section-card aclc-form-card">
          <h2 className="aclc-form-title">Owner Information & Review</h2>
          
          {isProcessing && (
            <div className="acpu-processing-notice">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="#FE8E0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 6V10M10 14H10.01" stroke="#FE8E0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <strong>Note:</strong> Your account is currently under review. Your listing will be saved but won't be visible to users until your account is approved.
              </div>
            </div>
          )}

          {/* Two Column Layout: Owner Info (Left) and Property Summary (Right) */}
          <div className="owner-review-two-column">
            {/* Left Column: Property Owner Information */}
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: '#111827' }}>Property Owner Information</h3>
              
              <div className="acoi-section" style={{ marginBottom: '1.5rem' }}>
                <h3 className="acoi-section-title">RAPA Upload</h3>
                <div className="acoi-file-upload">
                  <input
                    type="file"
                    id="rapa-upload"
                    className="acoi-file-input"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                  />
                  <label htmlFor="rapa-upload" className="acoi-file-label">
                    <FiUpload className="acoi-file-icon" />
                    <span>Choose File</span>
                  </label>
                  <span className="acoi-file-name">
                    {rapaFile ? rapaFile.name : 'No file chosen'}
                  </span>
                </div>
              </div>

              <div className="acoi-section">
                <h3 className="acoi-section-title">Lessor/Property Owner Info</h3>
                <div className="acoi-form-grid">
                  <div className="acoi-form-group">
                    <label className="aclc-label" htmlFor="firstname">Firstname</label>
                    <input
                      id="firstname"
                      type="text"
                      className="acld-input"
                      placeholder="Enter First Name"
                      value={formData.firstname}
                      onChange={(e) => handleInputChange('firstname', e.target.value)}
                    />
                  </div>
                  <div className="acoi-form-group">
                    <label className="aclc-label" htmlFor="lastname">Lastname</label>
                    <input
                      id="lastname"
                      type="text"
                      className="acld-input"
                      placeholder="Enter Last Name"
                      value={formData.lastname}
                      onChange={(e) => handleInputChange('lastname', e.target.value)}
                    />
                  </div>
                  <div className="acoi-form-group">
                    <label className="aclc-label" htmlFor="phone">Phone</label>
                    <div className="acoi-phone-input">
                      <div className="aclc-select-wrap acoi-country-code">
                        <select
                          className="aclc-select"
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                        >
                          <option value="+63">(+63) Philippines</option>
                          <option value="+1">(+1) United States</option>
                          <option value="+44">(+44) United Kingdom</option>
                        </select>
                        <div className="aclc-select-caret">▼</div>
                      </div>
                      <input
                        id="phone"
                        type="tel"
                        className="acld-input acoi-phone-number"
                        placeholder="Enter Phone Number"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="acoi-form-group">
                    <label className="aclc-label" htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      className="acld-input"
                      placeholder="Enter Email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                  <div className="acoi-form-group">
                    <label className="aclc-label" htmlFor="ownerCountry">Country</label>
                    <div className="aclc-select-wrap">
                      <select
                        id="ownerCountry"
                        className="aclc-select"
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                      >
                        <option value="Philippines">Philippines</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                      </select>
                      <div className="aclc-select-caret">▼</div>
                    </div>
                  </div>
                  <div className="acoi-form-group">
                    <label className="aclc-label" htmlFor="ownerState">State/Province</label>
                    <div className="aclc-select-wrap">
                      <select
                        id="ownerState"
                        className="aclc-select"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                      >
                        <option value="">--Select State/Province--</option>
                        <option value="Metro Manila">Metro Manila</option>
                        <option value="Calabarzon">Calabarzon</option>
                        <option value="Central Luzon">Central Luzon</option>
                      </select>
                      <div className="aclc-select-caret">▼</div>
                    </div>
                  </div>
                  <div className="acoi-form-group">
                    <label className="aclc-label" htmlFor="ownerCity">City</label>
                    <div className="aclc-select-wrap">
                      <select
                        id="ownerCity"
                        className="aclc-select"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                      >
                        <option value="">--Select City--</option>
                        <option value="Manila">Manila</option>
                        <option value="Makati">Makati</option>
                        <option value="Quezon City">Quezon City</option>
                      </select>
                      <div className="aclc-select-caret">▼</div>
                    </div>
                  </div>
                  <div className="acoi-form-group acoi-full-width">
                    <label className="aclc-label" htmlFor="streetAddress">Street Address</label>
                    <input
                      id="streetAddress"
                      type="text"
                      className="acld-input"
                      placeholder="Enter Street Address"
                      value={formData.streetAddress}
                      onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="acoi-section">
                <h3 className="acoi-section-title">Pricing</h3>
                <div className="acpr-row" style={{ marginTop: '12px' }}>
                  <div className="acpr-column">
                    <div className="acpr-column-label">Price *</div>
                    <div className="acpr-form-group">
                      <div className="acpr-price-input-wrapper">
                        <div className="acpr-price-icon">
                          <FiDollarSign />
                        </div>
                        <input
                          id="price"
                          type="text"
                          className="acpr-price-input"
                          placeholder="Price"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="acpr-column">
                    <div className="acpr-column-label">Price Type *</div>
                    <div className="acpr-form-group">
                      <div className="aclc-select-wrap">
                        <select
                          id="price-type"
                          className="aclc-select"
                          value={priceType}
                          onChange={(e) => setPriceType(e.target.value as 'Monthly' | 'Weekly' | 'Daily' | 'Yearly')}
                        >
                          <option value="Monthly">Monthly</option>
                          <option value="Weekly">Weekly</option>
                          <option value="Daily">Daily</option>
                          <option value="Yearly">Yearly</option>
                        </select>
                        <div className="aclc-select-caret">▼</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Property Summary */}
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: '#111827' }}>Property Summary</h3>
              
              <div className="acpu-summary-section" style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '1.5rem', backgroundColor: '#F9FAFB' }}>
                <div className="acpu-summary-content">
                  <div className="acpu-summary-row">
                    <div className="acpu-summary-label">Category</div>
                    <div className="acpu-summary-value-group">
                      <div className="acpu-summary-value">{propertyData.category}</div>
                      <button className="acpu-edit-btn" onClick={() => handleEdit('category')} type="button">
                        <FiEdit className="acpu-edit-icon" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                  <div className="acpu-summary-row">
                    <div className="acpu-summary-label">Title</div>
                    <div className="acpu-summary-value-group">
                      <div className="acpu-summary-value">{propertyData.title}</div>
                      <button className="acpu-edit-btn" onClick={() => handleEdit('title')} type="button">
                        <FiEdit className="acpu-edit-icon" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                  <div className="acpu-summary-row">
                    <div className="acpu-summary-label">Price</div>
                    <div className="acpu-summary-value-group">
                      <div className="acpu-summary-value">{propertyData.price} ({propertyData.priceType})</div>
                      <button className="acpu-edit-btn" onClick={() => handleEdit('price')} type="button">
                        <FiEdit className="acpu-edit-icon" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                  <div className="acpu-summary-row">
                    <div className="acpu-summary-label">Location</div>
                    <div className="acpu-summary-value-group">
                      <div className="acpu-summary-value">{propertyData.location}</div>
                      <button className="acpu-edit-btn" onClick={() => handleEdit('location')} type="button">
                        <FiEdit className="acpu-edit-icon" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                  <div className="acpu-summary-row">
                    <div className="acpu-summary-label">Bedrooms</div>
                    <div className="acpu-summary-value-group">
                      <div className="acpu-summary-value">{propertyData.bedrooms}</div>
                      <button className="acpu-edit-btn" onClick={() => handleEdit('bedrooms')} type="button">
                        <FiEdit className="acpu-edit-icon" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                  <div className="acpu-summary-row">
                    <div className="acpu-summary-label">Bathrooms</div>
                    <div className="acpu-summary-value-group">
                      <div className="acpu-summary-value">{propertyData.bathrooms}</div>
                      <button className="acpu-edit-btn" onClick={() => handleEdit('bathrooms')} type="button">
                        <FiEdit className="acpu-edit-icon" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                  <div className="acpu-summary-row">
                    <div className="acpu-summary-label">Floor Area</div>
                    <div className="acpu-summary-value-group">
                      <div className="acpu-summary-value">{propertyData.floorArea}</div>
                      <button className="acpu-edit-btn" onClick={() => handleEdit('floorArea')} type="button">
                        <FiEdit className="acpu-edit-icon" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="acpu-footer-actions" style={{ marginTop: '2rem' }}>
            <button
              className="acld-prev-btn"
              onClick={() => router.push('/agent/create-listing/visuals-features')}
              type="button"
            >
              <FiArrowLeft />
              <span>Previous</span>
            </button>
            <button
              className="aclc-next-btn"
              onClick={handlePublish}
              type="button"
              disabled={isSubmitting || isCompressing || !price}
            >
              <span>
                {isCompressing 
                  ? 'Compressing images...' 
                  : isSubmitting 
                    ? `Publishing... ${uploadProgress > 0 ? `${uploadProgress}%` : ''}` 
                    : 'Publish Listing'}
              </span>
              <FiArrowRight />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

