'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppSidebar from '../../../components/common/AppSidebar'
import { ASSETS } from '@/utils/assets'
import { 
  FiBell,
  FiPlus,
  FiSend,
  FiUser,
  FiLock,
  FiEdit3
} from 'react-icons/fi'
import '../../agent/account/page.css'
import '../broker-shared.css'

export default function BrokerSettings() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'profile' | 'edit' | 'password'>('profile')
  const [loading, setLoading] = useState(true)
  
  // Profile data
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Property Broker',
    avatar: ASSETS.PLACEHOLDER_PROFILE
  })

  // Edit profile form data
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: 'PH+63',
    contactNumber: '',
    aboutYourself: '',
    addressLine1: '',
    country: 'Philippines',
    region: 'Region VII - Central Visayas',
    province: 'Cebu',
    city: 'Cebu City'
  })

  // Change password form data
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    const loadBrokerData = () => {
      try {
        const userName = localStorage.getItem('user_name') || 
                         localStorage.getItem('agent_name') || 
                         'John Anderson'
        const userEmail = localStorage.getItem('user_email') || 'john.anderson@skylinerealty.ph'
        const userPhone = localStorage.getItem('user_phone') || '+63 917 123 4567'
        const userAvatar = localStorage.getItem('user_avatar') || ASSETS.PLACEHOLDER_PROFILE

        setProfileData({
          name: userName,
          email: userEmail,
          phone: userPhone,
          role: 'Property Broker',
          avatar: userAvatar
        })

        const nameParts = userName.split(' ')
        setEditFormData(prev => ({
          ...prev,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: userEmail,
          contactNumber: userPhone.replace(/^\+?63\s?/, '')
        }))
      } catch (error) {
        console.error('Error loading broker data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBrokerData()
  }, [])

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Edit profile submitted:', editFormData)
    // Update localStorage
    const fullName = `${editFormData.firstName} ${editFormData.lastName}`.trim()
    localStorage.setItem('user_name', fullName)
    localStorage.setItem('user_email', editFormData.email)
    localStorage.setItem('user_phone', `+63 ${editFormData.contactNumber}`)
    
    setProfileData(prev => ({
      ...prev,
      name: fullName,
      email: editFormData.email,
      phone: `+63 ${editFormData.contactNumber}`
    }))
    
    alert('Profile updated successfully!')
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      alert('New password and confirm password do not match')
      return
    }
    console.log('Password change submitted:', passwordFormData)
    alert('Password changed successfully!')
    setPasswordFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  return (
    <div className="broker-dashboard">
      <AppSidebar />

      <main className="broker-main">
        {/* Broker Header */}
        <header className="broker-header">
          <div className="broker-header-left">
            <h1>Settings</h1>
            <p>Manage your account information and preferences.</p>
          </div>
          <div className="broker-header-right">
            <button className="broker-notification-btn">
              <FiBell />
            </button>
            <a href="/broker/create-listing" className="broker-add-listing-btn">
              <FiPlus />
              Add Listing
            </a>
          </div>
        </header>

        <div className="account-content">
          {/* Tabs */}
          <div className="account-tabs">
            <button 
              className={`account-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <FiUser className="tab-icon" />
              <span>Profile</span>
            </button>
            <button 
              className={`account-tab ${activeTab === 'edit' ? 'active' : ''}`}
              onClick={() => setActiveTab('edit')}
            >
              <FiEdit3 className="tab-icon" />
              <span>Edit Profile</span>
            </button>
            <button 
              className={`account-tab ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => setActiveTab('password')}
            >
              <FiLock className="tab-icon" />
              <span>Change Password</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="account-tab-content">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="profile-view">
                <div className="profile-header-section">
                  <div className="profile-avatar-large">
                    <img 
                      src={profileData.avatar} 
                      alt={profileData.name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="avatar-fallback-large hidden">
                      {profileData.name && profileData.name !== 'Broker'
                        ? profileData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'B'
                        : 'B'}
                    </div>
                  </div>
                  <div className="profile-info">
                    <h2>{profileData.name}</h2>
                    <p className="profile-role">{profileData.role}</p>
                  </div>
                </div>

                <div className="profile-details">
                  <div className="detail-item">
                    <label>Email</label>
                    <p>{profileData.email}</p>
                  </div>
                  <div className="detail-item">
                    <label>Phone</label>
                    <p>{profileData.phone}</p>
                  </div>
                </div>

                <div className="profile-actions">
                  <button 
                    className="btn-primary"
                    onClick={() => setActiveTab('edit')}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}

            {/* Edit Profile Tab */}
            {activeTab === 'edit' && (
              <div className="edit-profile-view">
                <div className="edit-profile-header">
                  <div className="profile-image-section">
                    <div className="profile-image-large">
                      <img 
                        src={profileData.avatar} 
                        alt={profileData.name} 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }} 
                      />
                      <div className="avatar-fallback-large hidden">
                        {profileData.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'B'}
                      </div>
                    </div>
                    <div className="profile-name-section">
                      <h3>{profileData.name}</h3>
                      <p>{profileData.role}</p>
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    form="edit-profile-form" 
                    className="save-changes-btn"
                  >
                    Save Changes
                  </button>
                </div>

                <form id="edit-profile-form" onSubmit={handleEditSubmit} className="edit-profile-form">
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
                          value={editFormData.firstName}
                          onChange={handleEditChange}
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
                          value={editFormData.lastName}
                          onChange={handleEditChange}
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
                          value={editFormData.email}
                          onChange={handleEditChange}
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
                            value={editFormData.countryCode}
                            onChange={handleEditChange}
                            className="form-input country-code-input"
                            readOnly
                          />
                          <input
                            type="text"
                            id="contactNumber"
                            name="contactNumber"
                            value={editFormData.contactNumber}
                            onChange={handleEditChange}
                            className="form-input contact-number-input"
                          />
                        </div>
                      </div>

                      <div className="form-group full-width">
                        <label htmlFor="aboutYourself">About Yourself</label>
                        <textarea
                          id="aboutYourself"
                          name="aboutYourself"
                          value={editFormData.aboutYourself}
                          onChange={handleEditChange}
                          className="form-textarea"
                          placeholder="About yourself..."
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>

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
                            value={editFormData.addressLine1}
                            onChange={handleEditChange}
                            className="form-input"
                            placeholder="Sample Address Street (Near Somewhere on Earth)."
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
                          value={editFormData.country}
                          onChange={handleEditChange}
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
                          value={editFormData.region}
                          onChange={handleEditChange}
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
                          value={editFormData.province}
                          onChange={handleEditChange}
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
                          value={editFormData.city}
                          onChange={handleEditChange}
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
            )}

            {/* Change Password Tab */}
            {activeTab === 'password' && (
              <div className="change-password-view">
                <div className="change-password-header">
                  <h2>Change Password</h2>
                  <p>Update your account password to keep your account secure.</p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="change-password-form">
                  <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordFormData.currentPassword}
                      onChange={handlePasswordChange}
                      className="form-input"
                      placeholder="Current password"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordFormData.newPassword}
                      onChange={handlePasswordChange}
                      className="form-input"
                      placeholder="New password"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordFormData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="form-input"
                      placeholder="Confirm new password"
                      required
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-primary">
                      Change Password
                    </button>
                    <button 
                      type="button" 
                      onClick={() => router.push('/broker')} 
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
