import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AgentSidebar from '../../components/agent/AgentSidebar'
import AgentHeader from '../../components/agent/AgentHeader'
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck
} from 'react-icons/fi'
import './AgentDashboard.css'
import './AgentCreateListingCategory.css'
import './AgentCreateListingAttributes.css'

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

export default function AgentCreateListingAttributes() {
  const navigate = useNavigate()
  const [amenities, setAmenities] = useState<string[]>([])
  const [furnishing, setFurnishing] = useState<string>('')

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

  const amenitiesList = [
    'Air Conditioning',
    'Breakfast',
    'Kitchen',
    'Parking',
    'Pool',
    'Wi-Fi Internet',
    'Pet-Friendly'
  ]

  const furnishingOptions = ['Fully Furnished', 'Semi Furnished', 'Unfurnished']

  const handleAmenityChange = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    )
  }

  return (
    <div className="agent-dashboard">
      <AgentSidebar/>

      <main className="agent-main">
        <AgentHeader 
          title="Create Listing" 
          subtitle="Add property attributes and amenities." 
        />

        <div className="aclc-breadcrumb">
          <span className="aclc-breadcrumb-strong">Create Listing</span>
          <span className="aclc-breadcrumb-sep">&gt;</span>
          <span className="aclc-breadcrumb-muted">Attributes</span>
        </div>

        <div className="section-card aclc-stepper-card">
          <div className="aclc-stepper-left">
            <ProgressRing percent={70} />
            <div className="aclc-stepper-left-text">
              <div className="aclc-stepper-left-title">Completion Status</div>
            </div>
          </div>

          <div className="aclc-steps">
            {stepLabels.map((label, idx) => {
              const step = idx + 1
              const isActive = step === 6
              const isDone = step < 6
              return (
                <div className="aclc-step" key={label}>
                  <div className="aclc-step-top">
                    <div className={`aclc-step-circle ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                      {isDone ? <FiCheck /> : step}
                    </div>
                    {step !== stepLabels.length && (
                      <div className={`aclc-step-line ${step < 6 ? 'done' : ''}`} />
                    )}
                  </div>
                  <div className={`aclc-step-label ${isActive ? 'active' : ''}`}>{label}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="section-card acat-form-card">
          <h2 className="aclc-form-title">Attributes</h2>

          <div className="acat-section">
            <h3 className="acat-section-title">Amenities</h3>
            <div className="acat-checkbox-grid">
              {amenitiesList.map((amenity) => (
                <label key={amenity} className="acat-checkbox-label">
                  <input
                    type="checkbox"
                    className="acat-checkbox"
                    checked={amenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                  />
                  <span className="acat-checkbox-text">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="acat-section">
            <h3 className="acat-section-title">Furnishing</h3>
            <div className="acat-checkbox-row">
              {furnishingOptions.map((option) => (
                <label key={option} className="acat-checkbox-label">
                  <input
                    type="radio"
                    name="furnishing"
                    className="acat-radio"
                    value={option}
                    checked={furnishing === option}
                    onChange={(e) => setFurnishing(e.target.value)}
                  />
                  <span className="acat-checkbox-text">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="acat-footer-actions">
            <button
              className="acld-prev-btn"
              onClick={() => navigate('/agent/create-listing/pricing')}
              type="button"
            >
              <FiArrowLeft />
              <span>Previous</span>
            </button>
            <button
              className="aclc-next-btn"
              onClick={() => navigate('/agent/create-listing/owner-info')}
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

