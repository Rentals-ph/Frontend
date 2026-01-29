import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AgentSidebar from '../../components/agent/AgentSidebar'
import AgentHeader from '../../components/agent/AgentHeader'
import './AgentChangePassword.css'

function AgentChangePassword() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New password and confirm password do not match')
      return
    }
    console.log('Password change submitted:', formData)
    // Add API call here
  }

  const handleCancel = () => {
    navigate('/agent')
  }

  return (
    <div className="agent-change-password">
      <AgentSidebar/>

      {/* Main Content */}
      <main className="agent-main">
        {/* Header */}
        <AgentHeader 
          title="Change Password" 
          subtitle="Update your account password." 
        />

        {/* Change Password Content */}
        <div className="change-password-content">
          <div className="change-password-header">
            <h2>Change Password</h2>
          </div>

          <form onSubmit={handleSubmit} className="change-password-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
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
                value={formData.newPassword}
                onChange={handleChange}
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
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input"
                placeholder="Confirm new password"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Change Password
              </button>
              <button type="button" onClick={handleCancel} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default AgentChangePassword

