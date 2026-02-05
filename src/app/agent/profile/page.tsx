'use client'

import { useState, useEffect } from 'react'
import AppSidebar from '../../../components/common/AppSidebar'
import AgentHeader from '../../../components/agent/AgentHeader'
import { agentsApi, propertiesApi } from '../../../api'
import type { Agent } from '../../../api/endpoints/agents'
import type { Property } from '../../../types'
import { ASSETS } from '@/utils/assets'
import { resolveAgentAvatar, resolvePropertyImage } from '@/utils/imageResolver'
import {
  FiMail,
  FiPhone,
  FiHeart,
  FiShare2,
  FiStar
} from 'react-icons/fi'
import './page.css'

export default function AgentMyProfile() {
  const [activeTab, setActiveTab] = useState('reviews')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [loading, setLoading] = useState(true)
  const [agent, setAgent] = useState<Agent | null>(null)
  const [reviewForm, setReviewForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    review: ''
  })

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        // Try to get current authenticated agent first
        const agentData = await agentsApi.getCurrent()
        setAgent(agentData)
        
        // Update localStorage with agent info
        if (agentData.first_name && agentData.last_name) {
          const fullName = `${agentData.first_name} ${agentData.last_name}`
          localStorage.setItem('agent_name', fullName)
          localStorage.setItem('user_name', fullName)
        }
        if (agentData.id) {
          localStorage.setItem('agent_id', agentData.id.toString())
        }
      } catch (error) {
        console.error('Error fetching agent data:', error)
        // Fallback to using agent_id if getCurrent fails
        try {
          const agentId = localStorage.getItem('agent_id')
          if (agentId) {
            const agentData = await agentsApi.getById(parseInt(agentId))
            setAgent(agentData)
            
            // Update localStorage with agent info
            if (agentData.first_name && agentData.last_name) {
              const fullName = `${agentData.first_name} ${agentData.last_name}`
              localStorage.setItem('agent_name', fullName)
              localStorage.setItem('user_name', fullName)
            }
          }
        } catch (fallbackError) {
          console.error('Error fetching agent by ID:', fallbackError)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAgentData()
  }, [])

  const agentName = agent?.full_name || 
    (agent?.first_name && agent?.last_name 
      ? `${agent.first_name} ${agent.last_name}` 
      : agent?.first_name || agent?.last_name ||
      localStorage.getItem('user_name') || 
      localStorage.getItem('agent_name') ||
      (agent?.email ? agent.email.split('@')[0] : 'Agent'))
  const agentEmail = agent?.email || ''
  const agentPhone = agent?.phone ? `+63 ${agent.phone}` : '+63 987654321'
  const agentImage = resolveAgentAvatar(agent?.image || agent?.avatar || agent?.profile_image, agent?.id)
  const agentInitials = agentName.split(' ').map(n => n[0]).join('').toUpperCase() || 'A'

  const [listings, setListings] = useState<Array<{
    id: number
    type: string
    date: string
    price: string
    title: string
    image: string
    bedrooms: number
    bathrooms: number
    area: number | string
  }>>([])
  const [listingsLoading, setListingsLoading] = useState(true)

  useEffect(() => {
    const fetchAgentListings = async () => {
      if (!agent?.id) return
      
      try {
        // Fetch properties for this agent
        const properties = await propertiesApi.getByAgentId(agent.id)
        
        // Transform properties to listings format
        const transformedListings = properties.map((property: Property) => {
          const date = property.published_at 
            ? new Date(property.published_at).toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
            : 'Not published'
          
          const price = property.price_type 
            ? `₱${property.price.toLocaleString()}/${property.price_type}`
            : `₱${property.price.toLocaleString()}/Month`
          
          const area = property.area ? property.area : 0
          
          return {
            id: property.id,
            type: property.type || 'Property',
            date: date,
            price: price,
            title: property.title,
            image: resolvePropertyImage(property.image, property.id),
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            area: area
          }
        })
        
        setListings(transformedListings)
      } catch (error) {
        console.error('Error fetching agent listings:', error)
      } finally {
        setListingsLoading(false)
      }
    }

    if (agent?.id) {
      fetchAgentListings()
    }
  }, [agent?.id])

  return (
    <div className="agent-profile-page">
      <div className="agent-sidebar">
        <AppSidebar />
      </div>

      {/* Main Content */}
      <main className="agent-main">
        {/* Header */}
        <AgentHeader 
          title="My Profile" 
          subtitle="View and manage your profile information." 
        />

        {/* Profile Section */}
        <div className="profile-section">
          <h2 className="page-title">My Profile</h2>

          {/* Profile Card */}
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Loading profile...</div>
          ) : (
            <div className="profile-card">
              <div className="profile-card-left">
                <div className="profile-avatar-large">
                  <img src={agentImage} alt={agentName} onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.classList.remove('hidden');
                  }} />
                  <div className="avatar-fallback-large hidden">{agentInitials}</div>
                </div>
                <div className="profile-info">
                  <h3 className="profile-name">{agentName}</h3>
                  <p className="profile-role">{agent?.verified ? 'Rent Manager' : 'Property Agent'}</p>
                  <div className="profile-contact">
                    <div className="contact-item">
                      <FiPhone className="contact-icon" />
                      <span>{agentPhone}</span>
                    </div>
                    <div className="contact-item">
                      <FiMail className="contact-icon" />
                      <span>{agentEmail}</span>
                    </div>
                  </div>
                </div>
              </div>
            <div className="profile-card-right">
              <div className="qr-code-container">
                <div className="qr-code-box" />
              </div>
            </div>
            </div>
          )}

          {/* Tabs */}
          <div className="profile-tabs">
            <button
              className={`tab-button ${activeTab === 'listings' ? 'active' : ''}`}
              onClick={() => setActiveTab('listings')}
            >
              Listings
            </button>
            <button
              className={`tab-button ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              About Me
            </button>
            <button
              className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'listings' && (
              <div className="listings-grid">
                {listingsLoading ? (
                  <div style={{ padding: '2rem', textAlign: 'center', gridColumn: '1 / -1' }}>Loading listings...</div>
                ) : listings.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', gridColumn: '1 / -1' }}>No listings yet. Create your first listing!</div>
                ) : (
                  listings.map((listing) => (
                  <div key={listing.id} className="property-card">
                    <div className="property-card-header">
                      <span className="property-type">{listing.type}</span>
                      <span className="property-date">{listing.date}</span>
                    </div>
                    <div className="property-image">
                      <img src={listing.image} alt={listing.title} onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }} />
                    </div>
                    <div className="property-card-body">
                      <div className="property-price-row">
                        <span className="property-price">{listing.price}</span>
                        <FiHeart className="heart-icon" />
                      </div>
                      <h4 className="property-title">{listing.title}</h4>
                      <div className="property-actions">
                        <button className="action-icon-btn" title="Email">
                          <FiMail />
                        </button>
                        <button className="action-icon-btn whatsapp-btn" title="WhatsApp">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                          </svg>
                        </button>
                        <button className="action-icon-btn" title="Share">
                          <FiShare2 />
                        </button>
                      </div>
                      <div className="rental-manager-badge">
                        <img src={ASSETS.LOGO_HERO_MAIN} alt="Rentals.ph" className="badge-logo" />
                        <span>Rental.Ph Official Rent Manager</span>
                      </div>
                      <div className="property-features">
                        <div className="feature-item">
                          <svg className="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <path d="M9 22V12h6v10" />
                            <path d="M9 12h6" />
                          </svg>
                          <span>{listing.bedrooms}</span>
                        </div>
                        <div className="feature-item">
                          <svg className="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 2v6M15 2v6M3 10h18M5 10v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10" />
                            <path d="M9 16h6" />
                          </svg>
                          <span>{listing.bathrooms}</span>
                        </div>
                        <div className="feature-item">
                          <svg className="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <line x1="3" y1="9" x2="21" y2="9" />
                            <line x1="3" y1="15" x2="21" y2="15" />
                          </svg>
                          <span>{listing.area}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'about' && (
              <div className="about-content">
                <p className="about-text">
                  I&apos;m a firm believer that real estate is about more than just closing deals; it&apos;s about navigating life&apos;s biggest transitions with confidence and clarity. By combining hyper-local market data with a straight-shooting, &quot;no-fluff&quot; approach, I help my clients cut through the noise to find properties that align with both their financial goals and their lifestyle. Whether you&apos;re hunting for a hidden gem in an up-and-coming neighborhood or selling a long-time family home, I prioritize transparent communication and relentless advocacy to ensure you never feel like just another transaction. My goal is to handle the complexities of the contracts and the chaos of the search so that you can focus on the excitement of your next chapter.
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="reviews-content">
                <h3 className="reviews-heading">1 Review</h3>

                <div className="write-review-section">
                  <h4 className="write-review-title">Write a review</h4>

                  <form className="review-form" onSubmit={(e) => {
                    e.preventDefault()
                    // Handle form submission here
                    console.log('Review submitted:', { ...reviewForm, rating })
                  }}>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="firstname">Firstname</label>
                        <input
                          type="text"
                          id="firstname"
                          placeholder="Enter your first name"
                          value={reviewForm.firstname}
                          onChange={(e) => setReviewForm({ ...reviewForm, firstname: e.target.value })}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="lastname">Lastname</label>
                        <input
                          type="text"
                          id="lastname"
                          placeholder="Enter your last name"
                          value={reviewForm.lastname}
                          onChange={(e) => setReviewForm({ ...reviewForm, lastname: e.target.value })}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={reviewForm.email}
                        onChange={(e) => setReviewForm({ ...reviewForm, email: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    <div className="rating-section">
                      <div className="stars-container">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const displayRating = hoverRating || rating
                          return (
                            <button
                              key={star}
                              type="button"
                              className={`star-button ${star <= displayRating ? 'filled' : ''}`}
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                            >
                              <FiStar />
                            </button>
                          )
                        })}
                      </div>
                      <span className="rating-label">Your rating & review</span>
                    </div>

                    <div className="form-group">
                      <label htmlFor="review">Your Review</label>
                      <textarea
                        id="review"
                        placeholder="Your Review"
                        value={reviewForm.review}
                        onChange={(e) => setReviewForm({ ...reviewForm, review: e.target.value })}
                        className="form-textarea"
                        rows={6}
                      />
                    </div>

                    <button type="submit" className="submit-review-btn">
                      Submit Review
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

