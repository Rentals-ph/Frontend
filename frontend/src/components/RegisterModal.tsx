import { useState } from 'react'
import './RegisterModal.css'

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
}

function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1 - Personal Information
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    dateOfBirth: '',
    
    // Step 2 - Agency Information
    agencyName: '',
    officeAddress: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Step 3 - PRC Certification
    prcLicenseNumber: '',
    licenseType: '',
    expirationDate: '',
    yearsOfExperience: '',
    agreeToTerms: false,
  })

  if (!isOpen) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Handle submission logic here
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="register-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>

        {/* Progress Indicator */}
        <div className="progress-indicator">
          <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="step-circle">1</div>
          </div>
          <div className={`progress-line ${currentStep >= 2 ? 'active' : ''}`}></div>
          <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="step-circle">2</div>
          </div>
          <div className={`progress-line ${currentStep >= 3 ? 'active' : ''}`}></div>
          <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-circle">3</div>
          </div>
        </div>

        <div className="register-modal-content">
          <h2 className="register-title">Agent Registration</h2>
          <p className="register-subtitle">Join our network of certified real estate professionals</p>

          <form onSubmit={handleSubmit} className="register-form">
            {/* Step 1 - Personal Information */}
            {currentStep === 1 && (
              <div className="form-step">
                <div className="section-header">
                  <svg className="section-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#205ED7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <h3>Personal Information</h3>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="agent@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password *</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="dateOfBirth">Date of Birth *</label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      placeholder="mm/dd/yyyy"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 - Agency Information */}
            {currentStep === 2 && (
              <div className="form-step">
                <div className="section-header">
                  <svg className="section-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M3 21H21M3 7L12 3L21 7M5 21V10M19 21V10M9 21V14H15V21" stroke="#205ED7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <h3>Agency Information</h3>
                </div>

                <div className="form-group">
                  <label htmlFor="agencyName">Agency Name</label>
                  <input
                    type="text"
                    id="agencyName"
                    name="agencyName"
                    placeholder="Enter agency name (optional)"
                    value={formData.agencyName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="officeAddress">Office Address</label>
                  <input
                    type="text"
                    id="officeAddress"
                    name="officeAddress"
                    placeholder="Street address"
                    value={formData.officeAddress}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-row three-col">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="state">State/Province</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="zipCode">Zip Code</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      placeholder="Zip"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 - PRC Certification */}
            {currentStep === 3 && (
              <div className="form-step step-3">
                <div className="step-3-container">
                  <div className="step-3-main">
                    <div className="section-header">
                      <svg className="section-icon orange" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 12L11 14L15 10M20.618 5.984A11.955 11.955 0 0 1 21.944 12c-.209 1.025-.596 2.006-1.145 2.914m-1.857 2.698A11.955 11.955 0 0 1 12 21.944c-1.025-.209-2.006-.596-2.914-1.145m-2.698-1.857A11.955 11.955 0 0 1 2.056 12c.209-1.025.596-2.006 1.145-2.914m1.857-2.698A11.955 11.955 0 0 1 12 2.056c1.025.209 2.006.596 2.914 1.145" stroke="#FE8E0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <h3>PRC Certification Details</h3>
                    </div>

                    <div className="info-box">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="9" stroke="#205ED7" strokeWidth="2"/>
                        <path d="M10 6V10M10 14H10.01" stroke="#205ED7" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <div>
                        <strong>PRC License Required</strong>
                        <p>You must have a valid Professional Regulation Commission (PRC) Real Estate Broker or Salesperson license to register as an agent.</p>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="prcLicenseNumber">PRC License Number *</label>
                      <input
                        type="text"
                        id="prcLicenseNumber"
                        name="prcLicenseNumber"
                        placeholder="Enter your PRC license number"
                        value={formData.prcLicenseNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="licenseType">License Type *</label>
                        <select
                          id="licenseType"
                          name="licenseType"
                          value={formData.licenseType}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select license type</option>
                          <option value="broker">Real Estate Broker</option>
                          <option value="salesperson">Real Estate Salesperson</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="expirationDate">Expiration Date *</label>
                        <input
                          type="date"
                          id="expirationDate"
                          name="expirationDate"
                          placeholder="mm/dd/yyyy"
                          value={formData.expirationDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="upload">Upload PRC License Copy *</label>
                      <div className="file-upload">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                          <path d="M24 32V16M24 16L18 22M24 16L30 22M38 32V38C38 39.1046 37.1046 40 36 40H12C10.8954 40 10 39.1046 10 38V32" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <p className="upload-text">Click to upload or drag and drop</p>
                        <p className="upload-hint">PDF, JPG, PNG up to 10MB</p>
                      </div>
                    </div>
                  </div>

                  <div className="step-3-sidebar">
                    <div className="form-group">
                      <label htmlFor="yearsOfExperience">Years of Experience *</label>
                      <select
                        id="yearsOfExperience"
                        name="yearsOfExperience"
                        value={formData.yearsOfExperience}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select experience level</option>
                        <option value="0-1">0-1 years</option>
                        <option value="1-3">1-3 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="5-10">5-10 years</option>
                        <option value="10+">10+ years</option>
                      </select>
                    </div>

                    <div className="terms-checkbox">
                      <input
                        type="checkbox"
                        id="agreeToTerms"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="agreeToTerms">
                        I agree to the <a href="#terms">Terms and Conditions</a> and{' '}
                        <a href="#privacy">Privacy Policy</a>. I confirm that all information provided is accurate and I have a valid PRC license.
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className={`form-actions ${currentStep === 1 ? 'single-button' : currentStep === 2 ? 'two-buttons' : 'final-buttons'}`}>
              {currentStep === 1 && (
                <button type="button" className="btn-primary btn-next" onClick={handleNext}>
                  Next
                </button>
              )}
              {currentStep === 2 && (
                <>
                  <button type="button" className="btn-secondary" onClick={handlePrevious}>
                    Previous
                  </button>
                  <button type="button" className="btn-primary" onClick={handleNext}>
                    Next
                  </button>
                </>
              )}
              {currentStep === 3 && (
                <>
                  <button type="button" className="btn-secondary" onClick={onClose}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Submit Application
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterModal

