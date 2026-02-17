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
// import './page.css' // Removed - converted to Tailwind

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
          
          // Use image_url if available (from backend), otherwise fall back to image or placeholder
          const imageUrl = property.image_url || property.image || ASSETS.PLACEHOLDER_PROPERTY_MAIN
          
          return {
            id: property.id,
            title: property.title,
            image: imageUrl,
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
    <div className="flex min-h-screen bg-gray-100 font-outfit">
      <AppSidebar/>

      <main className="ml-[280px] flex-1 w-[calc(100%-280px)] p-8 min-h-screen lg:ml-[240px] lg:w-[calc(100%-240px)] lg:p-6 md:ml-0 md:w-full md:p-4 md:pt-15">
        <AgentHeader 
          title="Dashboard" 
          subtitle="Welcome back, manage your rental properties." 
        />

        <div className="grid grid-cols-4 gap-6 mb-8 lg:grid-cols-2 md:grid-cols-1">
          <div className="bg-white rounded-2xl p-6 flex items-start gap-4 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-orange-100 text-orange-600">
              <FiHome />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Listings</h3>
              <p className="text-3xl font-bold text-gray-900 mb-1">{statsLoading ? '...' : stats.totalListings}</p>
              <p className="text-xs font-medium text-emerald-600">+12%</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 flex items-start gap-4 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-blue-100 text-blue-600">
              <FiCheckCircle />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Active Properties</h3>
              <p className="text-3xl font-bold text-gray-900 mb-1">{statsLoading ? '...' : stats.activeListings}</p>
              <p className="text-xs font-medium text-emerald-600">Active</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 flex items-start gap-4 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-emerald-100 text-emerald-600">
              <FiDollarSign />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {statsLoading ? '...' : stats.totalRevenue >= 1000 
                  ? `₱${(stats.totalRevenue / 1000).toFixed(0)}K`
                  : `₱${stats.totalRevenue.toLocaleString()}`}
              </p>
              <p className="text-xs font-medium text-gray-500">Monthly</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 flex items-start gap-4 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-purple-100 text-purple-600">
              <FiMail />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Unread Messages</h3>
              <p className="text-3xl font-bold text-gray-900 mb-1">{statsLoading ? '...' : stats.unreadMessages}</p>
              <p className="text-xs font-medium text-blue-600">{stats.unreadMessages > 0 ? 'New' : 'None'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_400px] gap-6 lg:grid-cols-1">
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Listings</h2>
                <Link href="/agent/listings" className="text-sm text-blue-600 font-medium hover:underline">View All</Link>
              </div>
              <div className="flex flex-col gap-4">
                {loading ? (
                  <div style={{ padding: '2rem', textAlign: 'center' }}>Loading listings...</div>
                ) : listings.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center' }}>No listings yet. Create your first listing!</div>
                ) : (
                  listings.map((listing) => (
                    <div key={listing.id || listing.title} className="flex gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                      <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={listing.image} 
                          alt={listing.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = ASSETS.PLACEHOLDER_PROPERTY_MAIN
                          }} 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-semibold text-gray-900 mb-1">{listing.title}</h4>
                        <p className="text-sm text-gray-600 mb-1">{listing.details}</p>
                        <p className="text-base font-bold text-blue-600">{listing.price}</p>
                      </div>
                      <div className="flex flex-col items-end justify-between gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${listing.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {listing.status === 'active' ? 'Active' : 'Pending'}
                        </span>
                        <div className="flex gap-2">
                          <button className="w-8 h-8 rounded-lg bg-white hover:bg-blue-50 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors duration-200 border border-gray-200" title="Edit">
                            <FiEdit3 />
                          </button>
                          <button 
                            className="w-8 h-8 rounded-lg bg-white hover:bg-blue-50 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors duration-200 border border-gray-200" 
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

          <div>
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 shadow-lg text-white mb-6">
              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <FiPlus className="text-white text-3xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Create New Listing</h2>
                  <p className="text-blue-100">Add a new property to your portfolio and reach thousands of potential tenants.</p>
                </div>
                <Link href="/agent/create-listing" className="px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg">
                  Get Started
                  <FiArrowRight />
                </Link>
              </div>
            </div>

            {/*<div className="section-card">
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
            </div>*/}

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Messages</h2>
                <Link href="/agent/inbox" className="text-sm text-blue-600 font-medium hover:underline">View All Messages</Link>
              </div>
              <div>
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

            {/*<div className="section-card share-story">
              <div className="share-story-content">
                <FiBookOpen className="story-icon" />
                <h2>Share Your Story</h2>
                <p>Write and share blogs about your rental experience with the community.</p>
                <Link href="/agent/blogs" className="story-button">
                  Create Blog Post
                </Link>
              </div>
            </div>*/}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Rental Management Tools</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
            <Link href="/agent/create-listing" className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white hover:shadow-lg transition-all duration-200 flex flex-col items-center text-center gap-3">
              <FiPlus className="text-4xl" />
              <h3 className="text-lg font-bold">Create Listing</h3>
              <p className="text-orange-100 text-sm">Add new property</p>
            </Link>
            <Link href="/agent/listings" className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white hover:shadow-lg transition-all duration-200 flex flex-col items-center text-center gap-3">
              <FiList className="text-4xl" />
              <h3 className="text-lg font-bold">My Listings</h3>
              <p className="text-blue-100 text-sm">Manage properties</p>
            </Link>
            {/*<Link href="/agent/tracker" className="tool-card light-green">
              <FiBarChart2 className="tool-icon" />
              <h3>Rental Tracker</h3>
              <p>Track performance</p>
            </Link>
            <Link href="/agent/rent-estimate" className="tool-card light-purple">
              <FiFileText className="tool-icon" />
              <h3>Rent Estimate</h3>
              <p>Calculate value</p>
            </Link>*/}
          </div>
        </div>
      </main>

     
      {previewListing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={handleClosePreview}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors duration-200 shadow-lg" onClick={handleClosePreview}>
              <FiX className="text-xl text-gray-700" />
            </button>
            <div className="w-full h-64 rounded-t-2xl overflow-hidden">
              <img src={previewListing.image} alt={previewListing.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{previewListing.title}</h3>
              <p className="text-base text-gray-600 mb-4">{previewListing.details}</p>
              <p className="text-3xl font-bold text-blue-600 mb-4">
                {previewListing.price}
                <span className="text-lg text-gray-500 font-normal">/month</span>
              </p>
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${previewListing.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {previewListing.status === 'active' ? 'Active' : 'Pending'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

