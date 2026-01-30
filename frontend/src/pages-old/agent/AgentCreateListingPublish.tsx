import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AgentSidebar from '../../components/agent/AgentSidebar'
import AgentHeader from '../../components/agent/AgentHeader'

import {
  FiCheck,
  FiEdit,
  FiArrowLeft
} from 'react-icons/fi'
import './AgentDashboard.css'
import './AgentCreateListingCategory.css'
import './AgentCreateListingPublish.css'

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
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)

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

  // Mock property data - in a real app, this would come from state management or context
  const propertyData = {
    category: 'Apartment',
    title: "Jian's Apartment",
    price: 'P2,000',
    priceType: 'Monthly',
    location: 'Mabolo Cebu City',
    bedrooms: '3',
    bathrooms: '2',
    floorArea: '25 sqm',
    video: 'Not Provided'
  }

  const handleEdit = (section: string) => {
    // Navigate to the appropriate step based on the section
    const stepMap: Record<string, string> = {
      category: '/agent/create-listing',
      title: '/agent/create-listing/details',
      price: '/agent/create-listing/pricing',
      location: '/agent/create-listing/location',
      bedrooms: '/agent/create-listing/details',
      bathrooms: '/agent/create-listing/details',
      floorArea: '/agent/create-listing/details',
      video: '/agent/create-listing/property-images'
    }
    const route = stepMap[section] || '/agent/create-listing'
    navigate(route)
  }

  return (
    <div className="agent-dashboard">
      <AgentSidebar/>

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
              onClick={() => navigate('/agent/create-listing/owner-info')}
              type="button"
            >
              <FiArrowLeft />
              <span>Previous</span>
            </button>
            <button
              className="acpu-publish-btn"
              onClick={() => {
                // Handle publish action
                window.alert('Listing published successfully!')
                navigate('/agent/listings')
              }}
              type="button"
            >
              <span>Publish Listing</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

