import { useMemo, useState } from 'react'
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
  FiUser
} from 'react-icons/fi'
import Footer from '../components/Footer'
import './AgentDashboard.css'
import './AgentShareBlogs.css'

type AgentBlogCard = {
  id: number
  title: string
  image: string
}

function AgentShareBlogs() {
  const [currentPage, setCurrentPage] = useState(1)

  const blogs: AgentBlogCard[] = useMemo(
    () => [
      { id: 1, title: 'How Much Rent Can You Really Afford in 2026?', image: '/assets/blog-image.png' },
      { id: 2, title: 'Post-Holiday Budget Reset', image: '/assets/blog-image2.png' },
      { id: 3, title: 'Finding a Home Made Simple', image: '/assets/blog-main.png' },
      { id: 4, title: 'Back-to-School Smart Living', image: '/assets/blog-image2.png' },
      { id: 5, title: 'Why January is the Smartest Month', image: '/assets/blog-image.png' },
      { id: 6, title: 'Small Space, Big Holiday Glow', image: '/assets/blog-main.png' }
    ],
    []
  )

  return (
    <div className="agent-dashboard agent-share-blogs-page">
      {/* Sidebar */}
      <aside className="agent-sidebar">
        <div className="sidebar-logo">
          <div className="logo-container">
            <img src="/assets/rentals-logo-hero-13c7b5.png" alt="Rentals.ph logo" className="logo-image" />
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
            <Link to="/agent/rent-estimate" className="nav-item">
              <FiFileText className="nav-icon" />
              <span>Rent Estimate</span>
            </Link>
            <Link to="/agent/blogs" className="nav-item active">
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

        <section className="asb-content">
          <div className="asb-heading">
            <h2 className="asb-title">Share Blogs</h2>
            <p className="asb-subtitle">Share your knowledge today!</p>
          </div>

          <div className="asb-carousel">
            <button className="asb-arrow asb-arrow-left" type="button" aria-label="Previous">
              ‹
            </button>

            <div className="asb-grid" role="list">
              {blogs.map((b) => (
                <article key={b.id} className="asb-card" role="listitem">
                  <div className="asb-card-image">
                    <img src={b.image} alt={b.title} />
                  </div>
                </article>
              ))}
            </div>

            <button className="asb-arrow asb-arrow-right" type="button" aria-label="Next">
              ›
            </button>
          </div>

          <div className="asb-pagination" aria-label="Pagination">
            <button className="asb-page-btn asb-page-prev" type="button" aria-label="Previous page">
              ‹
            </button>
            <button
              className={`asb-page-number ${currentPage === 1 ? 'active' : ''}`}
              type="button"
              onClick={() => setCurrentPage(1)}
            >
              1
            </button>
            <button
              className={`asb-page-number ${currentPage === 2 ? 'active' : ''}`}
              type="button"
              onClick={() => setCurrentPage(2)}
            >
              2
            </button>
            <button
              className={`asb-page-number ${currentPage === 3 ? 'active' : ''}`}
              type="button"
              onClick={() => setCurrentPage(3)}
            >
              3
            </button>
            <span className="asb-page-ellipsis">…</span>
            <button
              className={`asb-page-number ${currentPage === 50 ? 'active' : ''}`}
              type="button"
              onClick={() => setCurrentPage(50)}
            >
              50
            </button>
            <button className="asb-page-btn asb-page-next" type="button" aria-label="Next page">
              ›
            </button>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  )
}

export default AgentShareBlogs


