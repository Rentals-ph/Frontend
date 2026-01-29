import { Link } from 'react-router-dom'
import { 
  FiBell,
  FiUser,
  FiMail,
  FiPhone,
  FiLogOut,
  FiEdit3,
  FiDownload,
  FiCreditCard,
  FiLock,
  FiList,
  FiBarChart2,
  FiFileText,
  FiBookOpen,
  FiPlus
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import './AgentDigitalCard.css'

function AgentDigitalCard() {
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
            <Link to="/agent/downloadables" className="nav-item">
              <FiDownload className="nav-icon" />
              <span>Downloadables</span>
            </Link>
            <Link to="/agent/digital-card" className="nav-item active">
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
              <p className="welcome-text">Welcome back, manage your rental properties.</p>
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

        {/* Digital Business Card Section */}
        <div className="digital-card-section">
          <h2 className="section-title">Digital Business Card</h2>
          
          <div className="business-card-container">
            <div className="business-card">
              {/* Profile Image */}
              <div className="card-profile-image">
                <img 
                  src="/assets/profile-placeholder.png" 
                  alt="John Anderson"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="card-avatar-fallback hidden">JA</div>
              </div>

              {/* Name */}
              <h3 className="card-name">John Anderson</h3>

              {/* Title */}
              <p className="card-title">Rent Manager</p>

              {/* Tenure */}
              <p className="card-tenure">Since 2014</p>

              {/* Contact Information */}
              <div className="card-contact-info">
                <div className="contact-item">
                  <FiPhone className="contact-icon phone-icon" />
                  <span className="contact-text">+63 9876543210</span>
                </div>
                <div className="contact-item">
                  <FaWhatsapp className="contact-icon whatsapp-icon" />
                  <span className="contact-text">+63 9876543210</span>
                </div>
                <div className="contact-item">
                  <FiMail className="contact-icon email-icon" />
                  <span className="contact-text">johnanderson@gmail.com</span>
                </div>
              </div>

              {/* QR Code */}
              <div className="card-qr-container">
                <div className="card-qr-code"></div>
                <p className="qr-instruction">Scan to view my profile</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AgentDigitalCard

