'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AppSidebar from '../../components/common/AppSidebar'
import AgentHeader from '../../components/agent/AgentHeader'
import { propertiesApi, agentsApi } from '../../api'
import type { Property } from '../../types'
import { ASSETS } from '@/utils/assets'

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
  FiBookOpen,
  FiX
} from 'react-icons/fi'
import './page.css'

interface ListingData {
  id?: number
  title: string
  image: string
  details: string
  price: string
  status: 'active' | 'pending'
}

export default function AgentDashboard() {
  const [previewListing, setPreviewListing] = useState<ListingData | null>(null)
  const [listings, setListings] = useState<ListingData[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    totalRevenue: 0,
    unreadMessages: 0
  })
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        // Get current agent
        const agent = await agentsApi.getCurrent()
        
        if (!agent) {
          console.error('No agent found. Please ensure you are logged in.')
          setLoading(false)
          return
        }
        
        if (!agent.id) {
          console.error('Agent ID is missing')
          setLoading(false)
          return
        }
        
        // Fetch properties for this agent
        const properties = await propertiesApi.getByAgentId(agent.id)
        
        if (!properties || !Array.isArray(properties)) {
          console.error('Invalid properties response:', properties)
          setLoading(false)
          return
        }
        
        // Transform properties to ListingData format
        const transformedListings: ListingData[] = properties.slice(0, 3).map((property: Property) => {
          const area = property.area ? `${property.area}${property.floor_area_unit || ' sqm'}` : 'N/A'
          const price = property.price_type 
            ? `₱${property.price.toLocaleString()}/${property.price_type}`
            : `₱${property.price.toLocaleString()}/month`
          
          return {
            id: property.id,
            title: property.title,
            image: property.image || ASSETS.PLACEHOLDER_PROPERTY_MAIN,
            details: `${property.bedrooms} Bedrooms • ${property.bathrooms} Bathroom${property.bathrooms > 1 ? 's' : ''} • ${area}`,
            price: price,
            status: property.published_at ? 'active' : 'pending'
          }
        })
        
        setListings(transformedListings)
      } catch (error: any) {
        console.error('Error fetching agent listings:', error)
        if (error.response?.status === 401) {
          console.error('Unauthorized. Please log in again.')
        } else if (error.response?.status === 404) {
          console.error('Agent not found.')
        } else {
          console.error('Failed to fetch properties:', error.message || error)
        }
      } finally {
        setLoading(false)
      }
    }

    const fetchDashboardStats = async () => {
      try {
        const dashboardStats = await agentsApi.getDashboardStats()
        setStats({
          totalListings: dashboardStats.total_listings,
          activeListings: dashboardStats.active_listings,
          totalRevenue: dashboardStats.total_revenue,
          unreadMessages: dashboardStats.unread_messages
        })
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setStatsLoading(false)
      }
    }

    fetchAgentData()
    fetchDashboardStats()
  }, [])

  const handleViewClick = (listing: ListingData) => {
    setPreviewListing(listing)
  }

  const handleClosePreview = () => {
    setPreviewListing(null)
  }
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
              <p className="metric-value">{statsLoading ? '...' : stats.totalListings}</p>
              <p className="metric-change positive">+12%</p>
            </div>
          </div>

          <div className="metric-card blue">
            <div className="metric-icon">
              <FiCheckCircle />
            </div>
            <div className="metric-content">
              <h3>Active Properties</h3>
              <p className="metric-value">{statsLoading ? '...' : stats.activeListings}</p>
              <p className="metric-status active">Active</p>
            </div>
          </div>

          <div className="metric-card green">
            <div className="metric-icon">
              <FiDollarSign />
            </div>
            <div className="metric-content">
              <h3>Total Revenue</h3>
              <p className="metric-value">
                {statsLoading ? '...' : stats.totalRevenue >= 1000 
                  ? `₱${(stats.totalRevenue / 1000).toFixed(0)}K`
                  : `₱${stats.totalRevenue.toLocaleString()}`}
              </p>
              <p className="metric-frequency">Monthly</p>
            </div>
          </div>

          <div className="metric-card purple">
            <div className="metric-icon">
              <FiMail />
            </div>
            <div className="metric-content">
              <h3>Unread Messages</h3>
              <p className="metric-value">{statsLoading ? '...' : stats.unreadMessages}</p>
              <p className="metric-status new">{stats.unreadMessages > 0 ? 'New' : 'None'}</p>
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
                {loading ? (
                  <div style={{ padding: '2rem', textAlign: 'center' }}>Loading listings...</div>
                ) : listings.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center' }}>No listings yet. Create your first listing!</div>
                ) : (
                  listings.map((listing) => (
                    <div key={listing.id || listing.title} className="listing-item">
                      <div className="listing-image">
                        <img src={listing.image} alt={listing.title} onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = ASSETS.PLACEHOLDER_PROPERTY_MAIN
                        }} />
                      </div>
                      <div className="listing-info">
                        <h4>{listing.title}</h4>
                        <p className="listing-details">{listing.details}</p>
                        <p className="listing-price">{listing.price}</p>
                      </div>
                      <div className="listing-right">
                        <span className={`status-badge ${listing.status}`}>
                          {listing.status === 'active' ? 'Active' : 'Pending'}
                        </span>
                        <div className="listing-actions">
                          <button className="action-btn" title="Edit">
                            <FiEdit3 />
                          </button>
                          <button 
                            className="action-btn" 
                            title="View"
                            onClick={() => handleViewClick(listing)}
                          >
                            <FiEye />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
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
                  <div className="action-icon-wrapper blue">
                    <FiHome className="action-icon" />
                    <FiDollarSign className="action-icon-overlay" />
                  </div>
                  <span>Rent Estimate</span>
                  <FiArrowRight className="arrow-icon" />
                </Link>
                <Link href="/agent/downloadables" className="quick-action-item">
                  <div className="action-icon-wrapper orange">
                    <FiDownload className="action-icon" />
                  </div>
                  <span>Downloadables</span>
                  <FiArrowRight className="arrow-icon" />
                </Link>
                <Link href="/agent/digital-card" className="quick-action-item">
                  <div className="action-icon-wrapper green">
                    <FiCreditCard className="action-icon" />
                  </div>
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
                {stats.unreadMessages === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                    No new messages
                  </div>
                ) : (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                    {stats.unreadMessages} unread message{stats.unreadMessages !== 1 ? 's' : ''}
                  </div>
                )}
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

      {/* Preview Modal */}
      {previewListing && (
        <div className="preview-modal-overlay" onClick={handleClosePreview}>
          <div className="preview-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="preview-modal-close" onClick={handleClosePreview}>
              <FiX />
            </button>
            <div className="preview-modal-image">
              <img src={previewListing.image} alt={previewListing.title} />
            </div>
            <div className="preview-modal-info">
              <h3>{previewListing.title}</h3>
              <p className="preview-details">{previewListing.details}</p>
              <p className="preview-price">
                {previewListing.price}
                <span className="price-period">/month</span>
              </p>
              <span className={`status-badge ${previewListing.status}`}>
                {previewListing.status === 'active' ? 'Active' : 'Pending'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

