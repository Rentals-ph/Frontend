import { Link } from 'react-router-dom'
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
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiHelpCircle,
} from 'react-icons/fi'
import './AgentRentalTracker.css'

function AgentRentalTracker() {
  return (
    <div className="agent-rental-tracker agent-dashboard">
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
            <Link to="/agent/tracker" className="nav-item active">
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

        {/* Page content */}
        <div className="art-page">
          <h2 className="art-title">Rental Tracker</h2>

          {/* Rental Due Calendar card */}
          <section className="art-card">
            <div className="art-card-topbar">
              <div className="art-card-topbar-left">
                <span className="art-card-topbar-title">Rental Due Calendar</span>
              </div>
              <button className="art-primary-btn" type="button">
                Add Rental Dues
              </button>
            </div>

            <div className="art-calendar">
              <div className="art-calendar-header">
                <div className="art-calendar-month">January 2026</div>
                <div className="art-calendar-actions">
                  <button className="art-today-btn" type="button">
                    Today
                  </button>
                  <button className="art-icon-btn muted" type="button" aria-label="Previous month">
                    <FiChevronLeft />
                  </button>
                  <button className="art-icon-btn primary" type="button" aria-label="Next month">
                    <FiChevronRight />
                  </button>
                </div>
              </div>

              <div className="art-calendar-body" aria-label="Calendar placeholder" />
            </div>
          </section>

          {/* Add/Edit Rental Due */}
          <section className="art-card art-form-card">
            <h3 className="art-section-title">Add/Edit Rental Due</h3>

            <div className="art-form">
              <div className="art-form-row">
                <label className="art-field art-field-full">
                  <span className="art-label">Select Property By Title</span>
                  <div className="art-select">
                    <select defaultValue="">
                      <option value="" disabled>
                        Select...
                      </option>
                      <option value="azure">Azure Residences - 2BR Corner Suite</option>
                      <option value="bgc">BGC Studio - High Floor</option>
                    </select>
                  </div>
                </label>
              </div>

              <div className="art-form-row art-form-row-3">
                <label className="art-field">
                  <span className="art-label">Firstname</span>
                  <input className="art-input" placeholder="" />
                </label>
                <label className="art-field">
                  <span className="art-label">Lastname</span>
                  <input className="art-input" placeholder="" />
                </label>
                <label className="art-field">
                  <span className="art-label">Tenant Email</span>
                  <input className="art-input" placeholder="" />
                </label>
              </div>

              <div className="art-form-row art-form-row-3">
                <label className="art-field">
                  <span className="art-label art-label-inline">
                    Rent Amount
                    <span className="art-help" title="Enter monthly rent amount">
                      <FiHelpCircle />
                    </span>
                  </span>
                  <input className="art-input" placeholder="" />
                </label>
                <label className="art-field">
                  <span className="art-label">Due Date</span>
                  <div className="art-date">
                    <input className="art-input" placeholder="mm/dd/yyyy" />
                  </div>
                </label>
                <label className="art-field">
                  <span className="art-label">Duration (Months)</span>
                  <div className="art-select">
                    <select defaultValue="1">
                      <option value="1">1 month</option>
                      <option value="2">2 months</option>
                      <option value="3">3 months</option>
                      <option value="6">6 months</option>
                      <option value="12">12 months</option>
                    </select>
                  </div>
                </label>
              </div>

              <div className="art-form-row">
                <label className="art-field art-field-full">
                  <span className="art-label">Notes</span>
                  <textarea className="art-textarea" placeholder="Your message here..." rows={5} />
                </label>
              </div>

              <div className="art-actions">
                <button className="art-save-btn" type="button">
                  Save
                </button>
              </div>
            </div>
          </section>

          {/* Rental Payment History */}
          <section className="art-card">
            <div className="art-history-header">
              <h3 className="art-section-title">Rental Payment History</h3>
              <div className="art-search">
                <FiSearch className="art-search-icon" />
                <input
                  className="art-search-input"
                  placeholder="Search by tenant, unit, method, or reference..."
                />
              </div>
            </div>

            <div className="art-table">
              <div className="art-table-head">
                <div>Tenant</div>
                <div>Propery Name</div>
                <div>Payment Paid</div>
                <div className="right">Actions</div>
              </div>
              <div className="art-table-empty">No Payment History Found.</div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default AgentRentalTracker


