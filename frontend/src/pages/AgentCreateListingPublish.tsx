import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FiBarChart2,
  FiBell,
  FiBookOpen,
  FiCreditCard,
  FiDownload,
  FiEdit3,
  FiFileText,
  FiList,
  FiLock,
  FiLogOut,
  FiMail,
  FiPlus,
  FiUser,
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
            <Link to="/agent/create-listing" className="nav-item active">
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
            <Link to="/agent/rent-estimate" className="nav-item">
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

      <main className="agent-main">
        <header className="agent-header">
          <div className="header-content">
            <div>
              <h1>Dashboard</h1>
              <p className="welcome-text">Welcome back, manage your rental properties</p>
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

