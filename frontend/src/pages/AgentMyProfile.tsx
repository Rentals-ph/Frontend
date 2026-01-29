import { useState } from 'react'
import { 
  FiMail,
  FiPhone,
  FiHeart,
  FiShare2,
  FiStar
} from 'react-icons/fi'
import AgentLayout from '../components/AgentLayout'
import './AgentMyProfile.css'

function AgentMyProfile() {
  const [activeTab, setActiveTab] = useState('reviews')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewForm, setReviewForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    review: ''
  })

  // Sample property listings data
  const listings = [
    {
      id: 1,
      type: 'Commercial Spaces',
      date: 'Sat 05, 2024',
      price: '$1200/Month',
      title: 'Azure Residences - 2BR Corner Suite',
      image: '/assets/property-placeholder.jpg',
      bedrooms: 4,
      bathrooms: 2,
      area: 2
    },
    {
      id: 2,
      type: 'Commercial Spaces',
      date: 'Sat 05, 2024',
      price: '$1200/Month',
      title: 'Azure Residences - 2BR Corner Suite',
      image: '/assets/property-placeholder.jpg',
      bedrooms: 4,
      bathrooms: 2,
      area: 2
    }
  ]

  return (
    <AgentLayout>
      <div className="profile-section">
          <h2 className="page-title">My Profile</h2>

          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-card-left">
              <div className="profile-avatar-large">
                <img src="/assets/profile-placeholder.png" alt="John Anderson" onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.classList.remove('hidden');
                }} />
                <div className="avatar-fallback-large hidden">JA</div>
              </div>
              <div className="profile-info">
                <h3 className="profile-name">John Anderson</h3>
                <p className="profile-role">Property Agent</p>
                <div className="profile-contact">
                  <div className="contact-item">
                    <FiPhone className="contact-icon" />
                    <span>+63 987654321</span>
                  </div>
                  <div className="contact-item">
                    <FiMail className="contact-icon" />
                    <span>john.anderson@gmail.com</span>
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
                {listings.map((listing) => (
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
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                          </svg>
                        </button>
                        <button className="action-icon-btn" title="Share">
                          <FiShare2 />
                        </button>
                      </div>
                      <div className="rental-manager-badge">
                        <img src="/assets/rentals-logo-hero-13c7b5.png" alt="Rentals.ph" className="badge-logo" />
                        <span>Rental.Ph Official Rent Manager</span>
                      </div>
                      <div className="property-features">
                        <div className="feature-item">
                          <svg className="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                            <path d="M9 22V12h6v10"/>
                            <path d="M9 12h6"/>
                          </svg>
                          <span>{listing.bedrooms}</span>
                        </div>
                        <div className="feature-item">
                          <svg className="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 2v6M15 2v6M3 10h18M5 10v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10"/>
                            <path d="M9 16h6"/>
                          </svg>
                          <span>{listing.bathrooms}</span>
                        </div>
                        <div className="feature-item">
                          <svg className="feature-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <line x1="3" y1="9" x2="21" y2="9"/>
                            <line x1="3" y1="15" x2="21" y2="15"/>
                          </svg>
                          <span>{listing.area}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'about' && (
              <div className="about-content">
                <p className="about-text">
                  I'm a firm believer that real estate is about more than just closing deals; it's about navigating life's biggest transitions with confidence and clarity. By combining hyper-local market data with a straight-shooting, "no-fluff" approach, I help my clients cut through the noise to find properties that align with both their financial goals and their lifestyle. Whether you're hunting for a hidden gem in an up-and-coming neighborhood or selling a long-time family home, I prioritize transparent communication and relentless advocacy to ensure you never feel like just another transaction. My goal is to handle the complexities of the contracts and the chaos of the search so that you can focus on the excitement of your next chapter.
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
    </AgentLayout>
  )
}

export default AgentMyProfile

