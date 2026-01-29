import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AgentSidebar from '../../components/agent/AgentSidebar'
import AgentHeader from '../../components/agent/AgentHeader'

import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiUpload
} from 'react-icons/fi'
import './AgentDashboard.css'
import './AgentCreateListingCategory.css'
import './AgentCreateListingDetails.css'
import './AgentCreateListingOwnerInfo.css'

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

export default function AgentCreateListingOwnerInfo() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
    country: 'Philippines',
    state: '',
    city: '',
    streetAddress: ''
  })
  const [countryCode, setCountryCode] = useState('+63')
  const [rapaFile, setRapaFile] = useState<File | null>(null)

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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRapaFile(e.target.files[0])
    }
  }

  return (
    <div className="agent-dashboard">
      <AgentSidebar/>

      <main className="agent-main">
        <AgentHeader 
          title="Create Listing" 
          subtitle="Add owner information." 
        />

        <div className="aclc-breadcrumb">
          <span className="aclc-breadcrumb-strong">Create Listing</span>
          <span className="aclc-breadcrumb-sep">&gt;</span>
          <span className="aclc-breadcrumb-muted">Owner Info</span>
        </div>

        <div className="section-card aclc-stepper-card">
          <div className="aclc-stepper-left">
            <ProgressRing percent={80} />
            <div className="aclc-stepper-left-text">
              <div className="aclc-stepper-left-title">Completion Status</div>
            </div>
          </div>

          <div className="aclc-steps">
            {stepLabels.map((label, idx) => {
              const step = idx + 1
              const isActive = step === 7
              const isDone = step < 7
              return (
                <div className="aclc-step" key={label}>
                  <div className="aclc-step-top">
                    <div className={`aclc-step-circle ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                      {isDone ? <FiCheck /> : step}
                    </div>
                    {step !== stepLabels.length && (
                      <div className={`aclc-step-line ${step < 7 ? 'done' : ''}`} />
                    )}
                  </div>
                  <div className={`aclc-step-label ${isActive ? 'active' : ''}`}>{label}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="section-card acoi-form-card">
          <h2 className="aclc-form-title">Property Owner Information</h2>

          <div className="acoi-section">
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
                <label className="aclc-label" htmlFor="firstname">
                  Firstname
                </label>
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
                <label className="aclc-label" htmlFor="lastname">
                  Lastname
                </label>
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
                <label className="aclc-label" htmlFor="phone">
                  Phone
                </label>
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
                <label className="aclc-label" htmlFor="email">
                  Email
                </label>
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
                <label className="aclc-label" htmlFor="country">
                  Country
                </label>
                <div className="aclc-select-wrap">
                  <select
                    id="country"
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
                <label className="aclc-label" htmlFor="state">
                  State/Province
                </label>
                <div className="aclc-select-wrap">
                  <select
                    id="state"
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
                <label className="aclc-label" htmlFor="city">
                  City
                </label>
                <div className="aclc-select-wrap">
                  <select
                    id="city"
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
                <label className="aclc-label" htmlFor="streetAddress">
                  Street Address
                </label>
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

          <div className="acoi-footer-actions">
            <button
              className="acld-prev-btn"
              onClick={() => navigate('/agent/create-listing/attributes')}
              type="button"
            >
              <FiArrowLeft />
              <span>Previous</span>
            </button>
            <button
              className="aclc-next-btn"
              onClick={() => navigate('/agent/create-listing/publish')}
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

