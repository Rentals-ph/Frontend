'use client'

import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppSidebar from '../../../../components/common/AppSidebar'
import AgentHeader from '../../../../components/agent/AgentHeader'
import { useCreateListing } from '../../../../contexts/CreateListingContext'

import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiUpload
} from 'react-icons/fi'
import { philippinesProvinces, getCitiesByProvince } from '../../../../data/philippinesLocations'
import '../AgentCreateListingCategory.css'
import '../details/page.css'
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

export default function AgentCreateListingOwnerInfo() {
  const router = useRouter()
  const { data, updateData } = useCreateListing()
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
  const [availableCities, setAvailableCities] = useState<string[]>([])

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
  }, [data])

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

  // Update available cities when state changes
  useEffect(() => {
    if (formData.state) {
      const cities = getCitiesByProvince(formData.state)
      setAvailableCities(cities)
      // Reset city if it's not in the new list
      if (formData.city && !cities.includes(formData.city)) {
        handleInputChange('city', '')
      }
    } else {
      setAvailableCities([])
      handleInputChange('city', '')
    }
  }, [formData.state])

  return (
    <div className="agent-dashboard">
      <AppSidebar/>

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

        <div className="section-card aclc-form-card">
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
                    <option value="Australia">Australia</option>
                    <option value="Canada">Canada</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Japan">Japan</option>
                    <option value="South Korea">South Korea</option>
                    <option value="China">China</option>
                    <option value="Hong Kong">Hong Kong</option>
                    <option value="Taiwan">Taiwan</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="India">India</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Bahrain">Bahrain</option>
                    <option value="Oman">Oman</option>
                    <option value="Other">Other</option>
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
                    {formData.country === 'Philippines' ? (
                      philippinesProvinces.map((province) => (
                        <option key={province.name} value={province.name}>
                          {province.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="California">California</option>
                        <option value="New York">New York</option>
                        <option value="Texas">Texas</option>
                        <option value="Florida">Florida</option>
                        <option value="Illinois">Illinois</option>
                        <option value="Other">Other</option>
                      </>
                    )}
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
                    disabled={!formData.state}
                  >
                    <option value="">--Select City--</option>
                    {formData.country === 'Philippines' && formData.state ? (
                      availableCities.map((cityName) => (
                        <option key={cityName} value={cityName}>
                          {cityName}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Los Angeles">Los Angeles</option>
                        <option value="New York">New York</option>
                        <option value="Chicago">Chicago</option>
                        <option value="Houston">Houston</option>
                        <option value="Miami">Miami</option>
                        <option value="Other">Other</option>
                      </>
                    )}
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
              onClick={() => router.push('/agent/create-listing/attributes')}
              type="button"
            >
              <FiArrowLeft />
              <span>Previous</span>
            </button>
            <button
              className="aclc-next-btn"
              onClick={() => {
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
                })
                router.push('/agent/create-listing/publish')
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

