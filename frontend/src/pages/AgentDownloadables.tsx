import { Link } from 'react-router-dom'
import { 
  FiBell,
  FiDownload,
  FiFileText,
  FiBarChart2,
  FiImage,
  FiUser,
  FiMail,
  FiEdit3,
  FiCreditCard,
  FiLock,
  FiLogOut,
  FiPlus,
  FiList,
  FiBookOpen
} from 'react-icons/fi'
import './AgentDownloadables.css'

function AgentDownloadables() {
  const handleDownload = (type: string) => {
    // Handle download logic here
    console.log(`Downloading ${type}`)
  }

  return (
    <div className="agent-dashboard">
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
            <Link to="/agent/downloadables" className="nav-item active">
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
              <p className="welcome-text">Welcome back, manage your rental properties</p>
            </div>
            <div className="header-right">
              <FiBell className="notification-icon" />
              <div className="user-profile">
                <div className="profile-avatar">
                  <img src="/assets/profile-placeholder.png" alt="John Anderson" onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }} />
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

        {/* Downloadables Section */}
        <div className="downloadables-section">
          <h2 className="downloadables-title">Downloadables</h2>
          
          <div className="downloadables-list">
            {/* Lease Agreements Card */}
            <div className="downloadable-card">
              <div className="downloadable-icon-container">
                <FiFileText className="downloadable-icon" />
              </div>
              <div className="downloadable-content">
                <h3 className="downloadable-name">Lease Agreements</h3>
              </div>
              <button 
                className="download-button"
                onClick={() => handleDownload('lease-agreements')}
                aria-label="Download Lease Agreements"
              >
                <FiDownload className="download-icon" />
              </button>
            </div>

            {/* Financial Report Card */}
            <div className="downloadable-card">
              <div className="downloadable-icon-container">
                <FiBarChart2 className="downloadable-icon" />
              </div>
              <div className="downloadable-content">
                <h3 className="downloadable-name">Financial Report</h3>
              </div>
              <button 
                className="download-button"
                onClick={() => handleDownload('financial-report')}
                aria-label="Download Financial Report"
              >
                <FiDownload className="download-icon" />
              </button>
            </div>

            {/* Property Photos Card */}
            <div className="downloadable-card">
              <div className="downloadable-icon-container">
                <FiImage className="downloadable-icon" />
              </div>
              <div className="downloadable-content">
                <h3 className="downloadable-name">Property Photos</h3>
              </div>
              <button 
                className="download-button"
                onClick={() => handleDownload('property-photos')}
                aria-label="Download Property Photos"
              >
                <FiDownload className="download-icon" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AgentDownloadables

