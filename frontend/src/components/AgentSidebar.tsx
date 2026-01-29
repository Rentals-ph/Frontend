import { Link, useLocation } from 'react-router-dom'
import {
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
  FiBookOpen
} from 'react-icons/fi'


function AgentSidebar() {
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/agent') {
      // For create listing pages, check if we're on any create-listing route
      return location.pathname === '/agent' || 
             location.pathname === '/agent/' ||
             location.pathname.startsWith('/agent/create-listing')
    }
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <aside className="agent-sidebar">
      <div className="sidebar-logo">
        <div className="logo-container">
          <img
            src="/assets/rentals-logo-hero-13c7b5.png"
            alt="Rentals.ph logo"
            className="logo-image"
          />
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="nav-section-title">Profile</h3>
          <Link 
            to="/agent/profile" 
            className={`nav-item ${isActive('/agent/profile') ? 'active' : ''}`}
          >
            <FiUser className="nav-icon" />
            <span>My Profile</span>
          </Link>
          <Link 
            to="/agent/inbox" 
            className={`nav-item ${isActive('/agent/inbox') ? 'active' : ''}`}
          >
            <FiMail className="nav-icon" />
            <span>Inbox</span>
          </Link>
          <Link 
            to="/agent/edit-profile" 
            className={`nav-item ${isActive('/agent/edit-profile') ? 'active' : ''}`}
          >
            <FiEdit3 className="nav-icon" />
            <span>Edit Profile</span>
          </Link>
          <Link 
            to="/agent/downloadables" 
            className={`nav-item ${isActive('/agent/downloadables') ? 'active' : ''}`}
          >
            <FiDownload className="nav-icon" />
            <span>Downloadables</span>
          </Link>
          <Link 
            to="/agent/digital-card" 
            className={`nav-item ${isActive('/agent/digital-card') ? 'active' : ''}`}
          >
            <FiCreditCard className="nav-icon" />
            <span>Digital Business Card</span>
          </Link>
          <Link 
            to="/agent/change-password" 
            className={`nav-item ${isActive('/agent/change-password') ? 'active' : ''}`}
          >
            <FiLock className="nav-icon" />
            <span>Change Password</span>
          </Link>
        </div>

        <div className="nav-section">
          <h3 className="nav-section-title">Rent Management</h3>
          <Link 
            to="/agent" 
            className={`nav-item ${isActive('/agent') && !location.pathname.includes('/agent/') ? 'active' : ''}`}
          >
            <FiPlus className="nav-icon" />
            <span>Create Listing</span>
          </Link>
          <Link 
            to="/agent/listings" 
            className={`nav-item ${isActive('/agent/listings') ? 'active' : ''}`}
          >
            <FiList className="nav-icon" />
            <span>My Listings</span>
          </Link>
          <Link 
            to="/agent/tracker" 
            className={`nav-item ${isActive('/agent/tracker') ? 'active' : ''}`}
          >
            <FiBarChart2 className="nav-icon" />
            <span>Rental Tracker</span>
          </Link>
          <Link 
            to="/agent/rent-estimate" 
            className={`nav-item ${isActive('/agent/rent-estimate') ? 'active' : ''}`}
          >
            <FiFileText className="nav-icon" />
            <span>Rent Estimate</span>
          </Link>
          <Link 
            to="/agent/blogs" 
            className={`nav-item ${isActive('/agent/blogs') ? 'active' : ''}`}
          >
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
  )
}

export default AgentSidebar

