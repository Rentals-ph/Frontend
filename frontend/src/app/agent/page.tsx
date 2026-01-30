'use client'

import Link from 'next/link'
import AppSidebar from '../../components/common/AppSidebar'
import AgentHeader from '../../components/agent/AgentHeader'

import { 
  FiHome, 
  FiPlus,
  FiList,
  FiBarChart2,
  FiFileText,
  FiEdit3,
  FiEye,
  FiMail,
  FiDownload,
  FiCreditCard,
  FiArrowRight,
  FiCheckCircle,
  FiDollarSign,
  FiBookOpen
} from 'react-icons/fi'
import '../../pages-old/agent/AgentDashboard.css'

export default function AgentDashboard() {
  return (
    <div className="agent-dashboard">
      <AppSidebar/>

      <main className="agent-main">
        <AgentHeader 
          title="Dashboard" 
          subtitle="Welcome back, manage your rental properties." 
        />

        <div className="metrics-grid">
          <div className="metric-card orange">
            <div className="metric-icon">
              <FiHome />
            </div>
            <div className="metric-content">
              <h3>Total Listings</h3>
              <p className="metric-value">24</p>
              <p className="metric-change positive">+12%</p>
            </div>
          </div>

          <div className="metric-card blue">
            <div className="metric-icon">
              <FiCheckCircle />
            </div>
            <div className="metric-content">
              <h3>Rented Properties</h3>
              <p className="metric-value">18</p>
              <p className="metric-status active">Active</p>
            </div>
          </div>

          <div className="metric-card green">
            <div className="metric-icon">
              <FiDollarSign />
            </div>
            <div className="metric-content">
              <h3>Total Revenue</h3>
              <p className="metric-value">P145K</p>
              <p className="metric-frequency">Monthly</p>
            </div>
          </div>

          <div className="metric-card purple">
            <div className="metric-icon">
              <FiMail />
            </div>
            <div className="metric-content">
              <h3>Unread Messages</h3>
              <p className="metric-value">3</p>
              <p className="metric-status new">New</p>
            </div>
          </div>
        </div>

        <div className="content-grid">
          <div className="content-column left">
            <div className="section-card">
              <div className="section-header">
                <h2>Recent Listings</h2>
                <Link href="/agent/listings" className="view-all-link">View All</Link>
              </div>
              <div className="listings-list">
                <div className="listing-item">
                  <div className="listing-image">
                    <img src="/assets/property-placeholder.jpg" alt="Modern Condo" onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }} />
                  </div>
                  <div className="listing-info">
                    <h4>Modern Condo in Makati CBD</h4>
                    <p className="listing-details">2 Bedrooms • 1 Bathroom • 65 sqm</p>
                    <p className="listing-price">P35,000 /month</p>
                    <span className="status-badge active">Active</span>
                  </div>
                  <div className="listing-actions">
                    <button className="action-btn" title="Edit">
                      <FiEdit3 />
                    </button>
                    <button className="action-btn" title="View">
                      <FiEye />
                    </button>
                  </div>
                </div>

                <div className="listing-item">
                  <div className="listing-image">
                    <img src="/assets/property-placeholder.jpg" alt="Cozy Studio" onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }} />
                  </div>
                  <div className="listing-info">
                    <h4>Cozy Studio in BGC</h4>
                    <p className="listing-details">Studio • 1 Bathroom • 28 sqm</p>
                    <p className="listing-price">P22,000 /month</p>
                    <span className="status-badge pending">Pending</span>
                  </div>
                  <div className="listing-actions">
                    <button className="action-btn" title="Edit">
                      <FiEdit3 />
                    </button>
                    <button className="action-btn" title="View">
                      <FiEye />
                    </button>
                  </div>
                </div>

                <div className="listing-item">
                  <div className="listing-image">
                    <img src="/assets/property-placeholder.jpg" alt="Family House" onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }} />
                  </div>
                  <div className="listing-info">
                    <h4>Family House in Quezon City</h4>
                    <p className="listing-details">3 Bedrooms • 2 Bathrooms • 120 sqm</p>
                    <p className="listing-price">P45,000 /month</p>
                    <span className="status-badge active">Active</span>
                  </div>
                  <div className="listing-actions">
                    <button className="action-btn" title="Edit">
                      <FiEdit3 />
                    </button>
                    <button className="action-btn" title="View">
                      <FiEye />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="content-column right">
            <div className="section-card create-listing-card">
              <div className="create-listing-content">
                <div className="create-listing-icon-wrapper">
                  <FiPlus className="create-listing-icon" />
                </div>
                <div className="create-listing-text">
                  <h2>Create New Listing</h2>
                  <p>Add a new property to your portfolio and reach thousands of potential tenants.</p>
                </div>
                <Link href="/agent/create-listing" className="create-listing-button">
                  Get Started
                  <FiArrowRight />
                </Link>
              </div>
            </div>

            <div className="section-card">
              <h2>Quick Actions</h2>
              <div className="quick-actions-list">
                <Link href="/agent/rent-estimate" className="quick-action-item">
                  <FiFileText className="action-icon" />
                  <span>Rent Estimate</span>
                  <FiArrowRight className="arrow-icon" />
                </Link>
                <Link href="/agent/downloadables" className="quick-action-item">
                  <FiDownload className="action-icon" />
                  <span>Downloadables</span>
                  <FiArrowRight className="arrow-icon" />
                </Link>
                <Link href="/agent/digital-card" className="quick-action-item">
                  <FiCreditCard className="action-icon" />
                  <span>Digital Card</span>
                  <FiArrowRight className="arrow-icon" />
                </Link>
              </div>
            </div>

            <div className="section-card">
              <div className="section-header">
                <h2>Recent Messages</h2>
                <Link href="/agent/inbox" className="view-all-link">View All Messages</Link>
              </div>
              <div className="messages-list">
                <div className="message-item">
                  <div className="message-avatar">
                    <div className="avatar-fallback">MS</div>
                  </div>
                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-sender">Maria Santos</span>
                      <span className="message-time">2h ago</span>
                    </div>
                    <p className="message-text">Interested in the Makati condo...</p>
                  </div>
                </div>

                <div className="message-item">
                  <div className="message-avatar">
                    <div className="avatar-fallback">CR</div>
                  </div>
                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-sender">Carlos Rivera</span>
                      <span className="message-time">5h ago</span>
                    </div>
                    <p className="message-text">Can we schedule a viewing?</p>
                  </div>
                </div>

                <div className="message-item">
                  <div className="message-avatar">
                    <div className="avatar-fallback">AC</div>
                  </div>
                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-sender">Ana Cruz</span>
                      <span className="message-time">1d ago</span>
                    </div>
                    <p className="message-text">Thank you for the information!</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="section-card share-story">
              <div className="share-story-content">
                <FiBookOpen className="story-icon" />
                <h2>Share Your Story</h2>
                <p>Write and share blogs about your rental experience with the community.</p>
                <Link href="/agent/blogs" className="story-button">
                  Create Blog Post
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="tools-section">
          <h2 className="tools-title">Rental Management Tools</h2>
          <div className="tools-grid">
            <Link href="/agent/create-listing" className="tool-card orange">
              <FiPlus className="tool-icon" />
              <h3>Create Listing</h3>
              <p>Add new property</p>
            </Link>
            <Link href="/agent/listings" className="tool-card light-blue">
              <FiList className="tool-icon" />
              <h3>My Listings</h3>
              <p>Manage properties</p>
            </Link>
            <Link href="/agent/tracker" className="tool-card light-green">
              <FiBarChart2 className="tool-icon" />
              <h3>Rental Tracker</h3>
              <p>Track performance</p>
            </Link>
            <Link href="/agent/rent-estimate" className="tool-card light-purple">
              <FiFileText className="tool-icon" />
              <h3>Rent Estimate</h3>
              <p>Calculate value</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

