'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ASSETS } from '@/utils/assets'
import { 
  FiSend,
  FiUser,
  FiLock,
  FiEdit3
} from 'react-icons/fi'
import './AccountSettings.css'

// Types
export interface ProfileData {
  name: string
  email: string
  phone: string
  role: string
  avatar: string
}

export interface EditFormData {
  firstName: string
  lastName: string
  email: string
  countryCode: string
  contactNumber: string
  aboutYourself: string
  addressLine1: string
  country: string
  region: string
  province: string
  city: string
}

export interface PasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface AccountSettingsProps {
  userType: 'agent' | 'broker'
  profileData: ProfileData
  editFormData: EditFormData
  loading?: boolean
  uploading?: boolean
  imagePreview?: string | null
  onEditFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onEditSubmit: (e: React.FormEvent) => void
  onPasswordSubmit: (passwordData: PasswordFormData) => void
  onImageChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  cancelRoute?: string
}

export default function AccountSettings({
  userType,
  profileData,
  editFormData,
  loading = false,
  uploading = false,
  imagePreview,
  onEditFormChange,
  onEditSubmit,
  onPasswordSubmit,
  onImageChange,
  cancelRoute
}: AccountSettingsProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'profile' | 'edit' | 'password'>('profile')
  
  // Change password form data (local state since it's not persisted)
  const [passwordFormData, setPasswordFormData] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      alert('New password and confirm password do not match')
      return
    }
    onPasswordSubmit(passwordFormData)
    setPasswordFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  const getInitials = (name: string, email?: string) => {
    if (name && name !== 'Agent' && name !== 'Broker' && name !== 'Unknown Agent') {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || userType[0].toUpperCase()
    }
    if (email) {
      return email.split('@')[0].slice(0, 2).toUpperCase()
    }
    return userType[0].toUpperCase()
  }

  const defaultCancelRoute = userType === 'agent' ? '/agent' : '/broker'

  if (loading) {
    return (
      <div className="account-settings-loading">
        <p>Loading account information...</p>
      </div>
    )
  }

  return (
    <div className="account-settings">
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
                  src={profileData.avatar || ASSETS.PLACEHOLDER_PROFILE} 
                  alt={profileData.name}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="avatar-fallback-large hidden">
                  {getInitials(profileData.name, profileData.email)}
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
                    src={imagePreview || profileData.avatar || ASSETS.PLACEHOLDER_PROFILE} 
                    alt={profileData.name} 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }} 
                  />
                  <div className="avatar-fallback-large hidden">
                    {getInitials(profileData.name)}
                  </div>
                  {onImageChange && (
                    <label htmlFor="profile-image-upload" className="profile-image-upload-label">
                      <input
                        type="file"
                        id="profile-image-upload"
                        accept="image/*"
                        onChange={onImageChange}
                        style={{ display: 'none' }}
                      />
                      <span className="change-photo-btn">
                        Change Photo
                      </span>
                    </label>
                  )}
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
                disabled={uploading}
              >
                {uploading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            <form id="edit-profile-form" onSubmit={onEditSubmit} className="edit-profile-form">
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
                      onChange={onEditFormChange}
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
                      onChange={onEditFormChange}
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
                      onChange={onEditFormChange}
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
                        onChange={onEditFormChange}
                        className="form-input country-code-input"
                        readOnly
                      />
                      <input
                        type="text"
                        id="contactNumber"
                        name="contactNumber"
                        value={editFormData.contactNumber}
                        onChange={onEditFormChange}
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
                      onChange={onEditFormChange}
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
                        onChange={onEditFormChange}
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
                      onChange={onEditFormChange}
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
                      onChange={onEditFormChange}
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
                      onChange={onEditFormChange}
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
                      onChange={onEditFormChange}
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
                  onClick={() => router.push(cancelRoute || defaultCancelRoute)} 
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
  )
}
