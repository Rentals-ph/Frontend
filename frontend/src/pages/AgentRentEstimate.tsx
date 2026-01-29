import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiBell,
  FiUser,
  FiMail,
  FiEdit3,
  FiDownload,
  FiCreditCard,
  FiLock,
  FiLogOut,
  FiPlus,
  FiList,
  FiBarChart2,
  FiFileText,
  FiBookOpen,
  FiMapPin,
  FiChevronDown
} from 'react-icons/fi'
import './AgentDashboard.css'
import './AgentRentEstimate.css'

function AgentRentEstimate() {
  const [propertyType, setPropertyType] = useState('')
  const [location, setLocation] = useState('')
  const [keyword, setKeyword] = useState('')
  const [estimate, setEstimate] = useState<string | null>(null)

  const propertyTypeOptions = useMemo(
    () => [
      { value: '', label: 'Select Property Type' },
      { value: 'condo', label: 'Condominium' },
      { value: 'apartment', label: 'Apartment' },
      { value: 'house', label: 'House' },
      { value: 'townhouse', label: 'Townhouse' },
      { value: 'commercial', label: 'Commercial Space' }
    ],
    []
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Placeholder estimate logic (UI-first page). Replace with API call later.
    const base = propertyType ? 28000 : 0
    const bonus = location.trim() ? 4000 : 0
    const kw = keyword.trim() ? 2000 : 0
    const computed = base + bonus + kw
    setEstimate(computed ? `P${computed.toLocaleString()} /month` : null)
  }

  return (
    <div className="agent-dashboard agent-rent-estimate-page">
      {/* Sidebar */}
      <aside className="agent-sidebar">
        <div className="sidebar-logo">
          <div className="logo-container">
            <img
              src="/assets/rentals-logo-hero-13c7b5.png"
              alt="Rentals.ph logo"
              className="logo-image"
            />
          </div>
          <p className="logo-tagline">PHILIPPINES #1 PROPERTY RENTAL WEBSITE</p>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <h3 className="nav-section-title">Profile</h3>
            <Link to="/agent/profile" className="nav-item">
              <FiUser className="nav-icon" />
              <span>My Profile</span>
            </Link>
            <Link to="/agent/inbox" className="nav-item">
              <FiMail className="nav-icon" />
              <span>Inbox</span>
            </Link>
            <Link to="/agent/edit-profile" className="nav-item">
              <FiEdit3 className="nav-icon" />
              <span>Edit Profile</span>
            </Link>
            <Link to="/agent/downloadables" className="nav-item">
              <FiDownload className="nav-icon" />
              <span>Downloadables</span>
            </Link>
            <Link to="/agent/digital-card" className="nav-item">
              <FiCreditCard className="nav-icon" />
              <span>Digital Business Card</span>
            </Link>
            <Link to="/agent/change-password" className="nav-item">
              <FiLock className="nav-icon" />
              <span>Change Password</span>
            </Link>
          </div>

          <div className="nav-section">
            <h3 className="nav-section-title">Rent Management</h3>
            <Link to="/agent" className="nav-item">
              <FiPlus className="nav-icon" />
              <span>Create Listing</span>
            </Link>
            <Link to="/agent/listings" className="nav-item">
              <FiList className="nav-icon" />
              <span>My Listings</span>
            </Link>
            <Link to="/agent/tracker" className="nav-item">
              <FiBarChart2 className="nav-icon" />
              <span>Rental Tracker</span>
            </Link>
            <Link to="/agent/rent-estimate" className="nav-item active">
              <FiFileText className="nav-icon" />
              <span>Rent Estimate</span>
            </Link>
            <Link to="/agent/blogs" className="nav-item">
              <FiBookOpen className="nav-icon" />
              <span>Share Blogs</span>
            </Link>
          </div>

          <div className="nav-section">
            <Link to="/logout" className="nav-item logout">
              <FiLogOut className="nav-icon" />
              <span>Logout</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="agent-main">
        {/* Header */}
        <header className="agent-header">
          <div className="header-content">
            <div>
              <h1>Dashboard</h1>
              <p className="welcome-text">Welcome back, manage your rental properties.</p>
            </div>
            <div className="header-right">
              <FiBell className="notification-icon" />
              <div className="user-profile">
                <div className="profile-avatar">
                  <img
                    src="/assets/profile-placeholder.png"
                    alt="John Anderson"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                  <div className="avatar-fallback hidden">JA</div>
                </div>
                <div className="user-info">
                  <span className="user-name">John Anderson</span>
                  <span className="user-role">Property Owner</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="agent-rent-estimate-section">
          <div className="agent-rent-estimate-heading">
            <h2>Rent Estimate</h2>
            <p>Get an instant rental price estimate for your property.</p>
          </div>

          <div className="agent-rent-estimate-card">
            <div className="agent-rent-estimate-card-header">
              <h3>Get Rental Price Estimates Instantly</h3>
            </div>

            <form className="agent-rent-estimate-form" onSubmit={handleSubmit}>
              <div className="agent-re-field">
                <label htmlFor="propertyType">Select Property Type</label>
                <div className="agent-re-select-wrap">
                  <select
                    id="propertyType"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="agent-re-select"
                  >
                    {propertyTypeOptions.map((opt) => (
                      <option key={opt.value || 'empty'} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="agent-re-select-icon" />
                </div>
              </div>

              <div className="agent-re-field">
                <label htmlFor="location">Search Location</label>
                <div className="agent-re-input-wrap">
                  <FiMapPin className="agent-re-input-icon" />
                  <input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="agent-re-input"
                    placeholder="Select Property Type"
                  />
                </div>
              </div>

              <div className="agent-re-field">
                <label htmlFor="keyword">Custom Keyword (Optional)</label>
                <input
                  id="keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="agent-re-input"
                  placeholder="e.g., Property Name, near IT Park, with sea view"
                />
              </div>

              <button type="submit" className="agent-re-submit">
                Get Estimate
              </button>

              {estimate && (
                <div className="agent-re-result" role="status" aria-live="polite">
                  <span className="agent-re-result-label">Estimated Rent</span>
                  <span className="agent-re-result-value">{estimate}</span>
                </div>
              )}

              <div className="agent-re-note">
                <p>
                  <strong>Please take note:</strong> The estimated price should still be aligned with the
                  prices of neighboring properties.
                </p>
                <p>Kindly consider and listen to the current market trends when setting your price.</p>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}

export default AgentRentEstimate


