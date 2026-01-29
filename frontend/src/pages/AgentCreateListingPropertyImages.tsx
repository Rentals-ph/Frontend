import { useMemo, useState } from 'react'
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
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiUploadCloud,
  FiPlayCircle
} from 'react-icons/fi'
import './AgentDashboard.css'
import './AgentCreateListingCategory.css'
import './AgentCreateListingPropertyImages.css'

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

export default function AgentCreateListingPropertyImages() {
  const navigate = useNavigate()
  const [videoUrl, setVideoUrl] = useState('')

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

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    event.stopPropagation()
    // This is a static UI step for now – files are not yet uploaded.
  }

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    event.stopPropagation()
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
          <span className="aclc-breadcrumb-muted">Property Images</span>
        </div>

        <div className="section-card aclc-stepper-card">
          <div className="aclc-stepper-left">
            <ProgressRing percent={40} />
            <div className="aclc-stepper-left-text">
              <div className="aclc-stepper-left-title">Completion Status</div>
            </div>
          </div>

          <div className="aclc-steps">
            {stepLabels.map((label, idx) => {
              const step = idx + 1
              const isActive = step === 4
              const isDone = step < 4
              return (
                <div className="aclc-step" key={label}>
                  <div className="aclc-step-top">
                    <div className={`aclc-step-circle ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                      {isDone ? <FiCheck /> : step}
                    </div>
                    {step !== stepLabels.length && (
                      <div className={`aclc-step-line ${step < 4 ? 'done' : ''}`} />
                    )}
                  </div>
                  <div className={`aclc-step-label ${isActive ? 'active' : ''}`}>{label}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="section-card acpi-form-card">
          <h2 className="aclc-form-title">Property Gallery</h2>

          <div className="acpi-subtitle">Property Images</div>

          <div
            className="acpi-dropzone"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            role="button"
            tabIndex={0}
          >
            <FiUploadCloud className="acpi-dropzone-icon" />
            <p className="acpi-dropzone-title">Drop files here or click to upload</p>
            <p className="acpi-dropzone-text">
              Upload high-quality images of your property (max 10mb each)
            </p>
            <p className="acpi-dropzone-helper">
              You can drag and drop multiple files at once. The first image will be set as the default
              image. Drag images to reorder them.
            </p>
          </div>

          <div className="acpi-video-section">
            <div className="acpi-video-label-row">
              <span className="acpi-video-label">Video Link (Optional)</span>
            </div>
            <div className="acpi-video-input-row">
              <div className="acpi-video-icon-wrap">
                <FiPlayCircle className="acpi-video-icon" />
              </div>
              <input
                className="acpi-video-input"
                placeholder="Enter Youtube/video link"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              <button className="acpi-video-preview-btn" type="button">
                Preview
              </button>
            </div>
            <p className="acpi-video-helper">
              Paste a YouTube, YouTube Shorts, Vimeo, Facebook Reel, TikTok, or Google Drive link to your
              property video tour.
            </p>
          </div>

          <div className="acpi-footer-actions">
            <button
              className="acld-prev-btn"
              onClick={() => navigate('/agent/create-listing/location')}
              type="button"
            >
              <FiArrowLeft />
              <span>Previous</span>
            </button>
            <button
              className="aclc-next-btn"
              onClick={() => navigate('/agent/create-listing/pricing')}
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


