import { useState } from 'react'
import { FiSend } from 'react-icons/fi'
import AgentLayout from '../components/AgentLayout'
import './AgentEditProfile.css'

function AgentEditProfile() {
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Anderson',
    email: 'johnanderson@gmail.com',
    countryCode: 'PH+63',
    contactNumber: '9298765432',
    aboutYourself: '',
    addressLine1: '',
    country: 'Philippines',
    region: 'Region VII - Central Visayas',
    province: 'Cebu',
    city: 'Cebu City'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  return (
    <AgentLayout>
      <div className="edit-profile-content">
          <div className="edit-profile-header">
            <h2>Edit Profile</h2>
          </div>

          <div className="profile-section-top">
            <div className="profile-image-section">
              <div className="profile-image-large">
                <img src="/assets/profile-placeholder.png" alt="John Anderson" onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }} />
                <div className="avatar-fallback-large hidden">JA</div>
              </div>
              <div className="profile-name-section">
                <h3>John Anderson</h3>
                <p>Property Agent</p>
              </div>
            </div>
            <button type="submit" form="edit-profile-form" className="save-changes-btn">
              Save Changes
            </button>
          </div>

          <form id="edit-profile-form" onSubmit={handleSubmit} className="edit-profile-form">
            {/* Personal Information Section */}
            <div className="form-section">
              <h3 className="form-section-title">PERSONAL INFORMATION</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="firstName">
                    Firstname <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">
                    Lastname <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group contact-group">
                  <label htmlFor="contactNumber">
                    Contact Number <span className="required">*</span>
                  </label>
                  <div className="contact-input-group">
                    <input
                      type="text"
                      id="countryCode"
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                      className="form-input country-code-input"
                      readOnly
                    />
                    <input
                      type="text"
                      id="contactNumber"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      className="form-input contact-number-input"
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="aboutYourself">About Yourself</label>
                  <textarea
                    id="aboutYourself"
                    name="aboutYourself"
                    value={formData.aboutYourself}
                    onChange={handleChange}
                    className="form-textarea"
                    placeholder="About yourself..."
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {/* Local Information Section */}
            <div className="form-section">
              <h3 className="form-section-title">LOCAL INFORMATION</h3>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="addressLine1">
                    Address Line 1 <span className="required">*</span>
                  </label>
                  <div className="input-with-icon">
                    <FiSend className="input-icon" />
                    <input
                      type="text"
                      id="addressLine1"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Sample Address Street (Near Somwhere on Earth)."
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="country">
                    Country <span className="required">*</span>
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="Philippines">Philippines</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="region">
                    Regions <span className="required">*</span>
                  </label>
                  <select
                    id="region"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="Region VII - Central Visayas">Region VII - Central Visayas</option>
                    <option value="Region I - Ilocos Region">Region I - Ilocos Region</option>
                    <option value="Region II - Cagayan Valley">Region II - Cagayan Valley</option>
                    <option value="Region III - Central Luzon">Region III - Central Luzon</option>
                    <option value="Region IV-A - CALABARZON">Region IV-A - CALABARZON</option>
                    <option value="NCR - National Capital Region">NCR - National Capital Region</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="province">
                    Provinces <span className="required">*</span>
                  </label>
                  <select
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="Cebu">Cebu</option>
                    <option value="Bohol">Bohol</option>
                    <option value="Negros Oriental">Negros Oriental</option>
                    <option value="Siquijor">Siquijor</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="city">
                    Cities <span className="required">*</span>
                  </label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="Cebu City">Cebu City</option>
                    <option value="Lapu-Lapu City">Lapu-Lapu City</option>
                    <option value="Mandaue City">Mandaue City</option>
                    <option value="Talisay City">Talisay City</option>
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>
    </AgentLayout>
  )
}

export default AgentEditProfile

