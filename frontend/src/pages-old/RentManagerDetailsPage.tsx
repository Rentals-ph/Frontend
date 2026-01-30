import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import HorizontalPropertyCard from '../components/common/HorizontalPropertyCard'
import VerticalPropertyCard from '../components/common/VerticalPropertyCard'
import { getRentManagerById } from '../data/rentManagers'
import PageHeader from '../components/layout/PageHeader'
import './RentManagerDetailsPage.css'

function RentManagerDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const managerId = Number(id)
  const manager = useMemo(() => (Number.isFinite(managerId) ? getRentManagerById(managerId) : undefined), [managerId])

  const [activeTab, setActiveTab] = useState<'listing' | 'reviews'>('listing')
  const [viewMode, setViewMode] = useState<'horizontal' | 'vertical'>('horizontal')
  const [searchQuery, setSearchQuery] = useState('')
  const [priceFilter, setPriceFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const [moreFilters, setMoreFilters] = useState({
    propertyType: 'all',
    bedrooms: 'all',
    bathrooms: 'all',
    parking: 'all',
  })
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: '',
  })

  if (!manager) {
    return (
      <div className="rm-details-page">
        <Navbar />
        <PageHeader title="MY LISTING" />

        <div className="rm-details-breadcrumbs">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-separator">&gt;</span>
          <Link to="/rent-managers" className="breadcrumb-link">RM</Link>
          <span className="breadcrumb-separator">&gt;</span>
          <span className="breadcrumb-current">Not Found</span>
        </div>
        <main className="rm-details-main">
          <div className="rm-details-container">
            <div className="rm-not-found-card">
              <h2>Rent Manager not found</h2>
              <p>Please go back and select a valid rent manager.</p>
              <Link className="rm-back-link" to="/rent-managers">Back to Rent Managers</Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Rent manager contact submitted:', { managerId: manager.id, ...formData })
    alert('Message sent successfully!')
    setFormData({ firstName: '', lastName: '', phone: '', email: '', message: '' })
  }

  // Filter and sort properties
  const filteredAndSortedProperties = useMemo(() => {
    let filtered = [...manager.listings]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.propertyType.toLowerCase().includes(query)
      )
    }

    // Price filter
    if (priceFilter !== 'all') {
      filtered = filtered.filter(p => {
        const priceStr = p.price.replace(/[₱$,]/g, '').replace('/Month', '').trim()
        const price = parseFloat(priceStr) || 0

        switch (priceFilter) {
          case 'under-20k':
            return price < 20000
          case '20k-40k':
            return price >= 20000 && price < 40000
          case '40k-60k':
            return price >= 40000 && price < 60000
          case '60k-80k':
            return price >= 60000 && price < 80000
          case 'over-80k':
            return price >= 80000
          default:
            return true
        }
      })
    }

    // More filters
    if (moreFilters.propertyType !== 'all') {
      filtered = filtered.filter(p => p.propertyType === moreFilters.propertyType)
    }
    if (moreFilters.bedrooms !== 'all') {
      const beds = parseInt(moreFilters.bedrooms)
      filtered = filtered.filter(p => p.bedrooms === beds)
    }
    if (moreFilters.bathrooms !== 'all') {
      const baths = parseInt(moreFilters.bathrooms)
      filtered = filtered.filter(p => p.bathrooms === baths)
    }
    if (moreFilters.parking !== 'all') {
      const park = parseInt(moreFilters.parking)
      filtered = filtered.filter(p => p.parking === park)
    }

    // Sort by date
    filtered.sort((a, b) => {
      // Parse dates - format: "Sat 05, 2024" or "Jan 15, 2026"
      const parseDate = (dateStr: string) => {
        // Try to parse the date string
        const date = new Date(dateStr)
        // If invalid, try alternative parsing
        if (isNaN(date.getTime())) {
          // Handle format like "Sat 05, 2024" or "Jan 15, 2026"
          const parts = dateStr.split(', ')
          if (parts.length === 2) {
            const year = parseInt(parts[1])
            const monthDay = parts[0].split(' ')
            if (monthDay.length >= 2) {
              const day = parseInt(monthDay[monthDay.length - 1])
              const monthMap: { [key: string]: number } = {
                'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
                'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
              }
              const month = monthMap[monthDay[0]] ?? 0
              return new Date(year, month, day).getTime()
            }
          }
          return 0
        }
        return date.getTime()
      }

      const dateA = parseDate(a.date)
      const dateB = parseDate(b.date)
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
    })

    return filtered
  }, [manager.listings, searchQuery, priceFilter, sortOrder, moreFilters])

  return (
    <div className="rm-details-page">
      <Navbar />

      <PageHeader title="MY LISTING" />

      <div className="rm-details-breadcrumbs">
        <Link to="/" className="breadcrumb-link">Home</Link>
        <span className="breadcrumb-separator">&gt;</span>
        <Link to="/rent-managers" className="breadcrumb-link">RM</Link>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-current">{manager.name}</span>
      </div>

      <main className="rm-details-main">
        <div className="rm-details-container">
          <section className="rm-top-grid">
            <div className="rm-profile-card">
              <div className="rm-profile-top">
                <div className="rm-profile-photo" aria-hidden="true">
                  <div className="rm-photo-placeholder">
                    <svg width="100%" height="100%" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="400" height="300" fill="#f0f0f0" />
                      <circle cx="200" cy="120" r="50" fill="#205ED7" />
                      <circle cx="200" cy="100" r="20" fill="white" />
                      <path d="M150 200C150 180 170 160 200 160C230 160 250 180 250 200V220H150V200Z" fill="white" />
                    </svg>
                  </div>
                </div>

                <div className="rm-profile-header">
                  <div className="rm-profile-title">
                    <h2 className="rm-profile-name">{manager.name}</h2>
                    <div className="rm-profile-meta-row">
                      <span className="rm-badge">{manager.role}</span>
                      <span className="rm-listings-pill">{manager.listingsCount} Listings</span>
                    </div>
                  </div>

                  <div className="rm-profile-qr" aria-label="QR code placeholder">
                    <div className="rm-qr-box" />
                  </div>
                </div>

                <div className="rm-profile-awards" aria-hidden="true">
                  <div className="rm-award-badge" />
                  <div className="rm-award-badge" />
                  <div className="rm-award-badge" />
                </div>
              </div>

              <div className="rm-profile-body">
                <h3 className="rm-about-title">{manager.aboutTitle}</h3>
                {manager.aboutParagraphs.map((p, idx) => (
                  <p key={idx} className="rm-about-paragraph">{p}</p>
                ))}
                <ul className="rm-about-bullets">
                  {manager.bullets.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>

            <aside className="rm-contact-card">
              <h3 className="rm-contact-title">Contact {manager.name}</h3>
              <form className="rm-contact-form" onSubmit={handleSubmit}>
                <input
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="rm-input"
                  required
                />
                <input
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="rm-input"
                  required
                />
                <input
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="rm-input"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="rm-input"
                  required
                />
                <textarea
                  name="message"
                  placeholder="Your message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="rm-textarea"
                  rows={4}
                  required
                />
                <button className="rm-contact-submit" type="submit">Contact</button>
              </form>
            </aside>
          </section>

          <section className="rm-tabs-card">
            <div className="rm-tabs-header">
              <button
                className={`rm-tab ${activeTab === 'listing' ? 'active' : ''}`}
                onClick={() => setActiveTab('listing')}
                type="button"
              >
                Listing ({manager.listingsCount})
              </button>
              <button
                className={`rm-tab ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
                type="button"
              >
                Reviews
              </button>
            </div>

            {activeTab === 'listing' ? (
              <div className="rm-listing-panel">
                <div className="rm-listing-controls">
                  <div className="rm-search-wrap">
                    <span className="rm-search-icon" aria-hidden="true">🔍</span>
                    <input
                      className="rm-search"
                      placeholder="Search properties by name, location"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="rm-filters-row">
                    <select
                      className="rm-select"
                      value={priceFilter}
                      onChange={(e) => setPriceFilter(e.target.value)}
                    >
                      <option value="all">All Prices</option>
                      <option value="under-20k">Under ₱20,000</option>
                      <option value="20k-40k">₱20,000 - ₱40,000</option>
                      <option value="40k-60k">₱40,000 - ₱60,000</option>
                      <option value="60k-80k">₱60,000 - ₱80,000</option>
                      <option value="over-80k">Over ₱80,000</option>
                    </select>
                    <select
                      className="rm-select"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                    </select>
                    <button
                      className={`rm-more-filters ${showMoreFilters ? 'active' : ''}`}
                      type="button"
                      onClick={() => setShowMoreFilters(!showMoreFilters)}
                    >
                      More Filters
                    </button>
                    <div className="rm-view-toggle-container">
                      <button
                        className={`rm-view-btn ${viewMode === 'horizontal' ? 'active' : ''}`}
                        type="button"
                        aria-label="List View"
                        onClick={() => setViewMode('horizontal')}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </button>
                      <button
                        className={`rm-view-btn ${viewMode === 'vertical' ? 'active' : ''}`}
                        type="button"
                        aria-label="Grid View"
                        onClick={() => setViewMode('vertical')}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none" />
                          <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none" />
                          <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none" />
                          <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {showMoreFilters && (
                    <div className="rm-more-filters-panel">
                      <div className="rm-filter-group">
                        <label className="rm-filter-label">Property Type</label>
                        <select
                          className="rm-select"
                          value={moreFilters.propertyType}
                          onChange={(e) => setMoreFilters({ ...moreFilters, propertyType: e.target.value })}
                        >
                          <option value="all">All Types</option>
                          <option value="Condominium">Condominium</option>
                          <option value="Apartment">Apartment</option>
                          <option value="House">House</option>
                          <option value="Studio">Studio</option>
                          <option value="TownHouse">TownHouse</option>
                          <option value="Commercial Spaces">Commercial Spaces</option>
                          <option value="Bed Space">Bed Space</option>
                        </select>
                      </div>
                      <div className="rm-filter-group">
                        <label className="rm-filter-label">Bedrooms</label>
                        <select
                          className="rm-select"
                          value={moreFilters.bedrooms}
                          onChange={(e) => setMoreFilters({ ...moreFilters, bedrooms: e.target.value })}
                        >
                          <option value="all">All</option>
                          <option value="0">0</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4+</option>
                        </select>
                      </div>
                      <div className="rm-filter-group">
                        <label className="rm-filter-label">Bathrooms</label>
                        <select
                          className="rm-select"
                          value={moreFilters.bathrooms}
                          onChange={(e) => setMoreFilters({ ...moreFilters, bathrooms: e.target.value })}
                        >
                          <option value="all">All</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3+</option>
                        </select>
                      </div>
                      <div className="rm-filter-group">
                        <label className="rm-filter-label">Parking</label>
                        <select
                          className="rm-select"
                          value={moreFilters.parking}
                          onChange={(e) => setMoreFilters({ ...moreFilters, parking: e.target.value })}
                        >
                          <option value="all">All</option>
                          <option value="0">0</option>
                          <option value="1">1</option>
                          <option value="2">2+</option>
                        </select>
                      </div>
                      <button
                        className="rm-clear-filters"
                        type="button"
                        onClick={() => {
                          setMoreFilters({
                            propertyType: 'all',
                            bedrooms: 'all',
                            bathrooms: 'all',
                            parking: 'all',
                          })
                        }}
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </div>

                <div className={`rm-listings ${viewMode === 'vertical' ? 'rm-listings-grid' : ''}`}>
                  {filteredAndSortedProperties.length > 0 ? (
                    filteredAndSortedProperties.map((p) =>
                      viewMode === 'horizontal' ? (
                        <HorizontalPropertyCard
                          key={p.id}
                          id={p.id}
                          propertyType={p.propertyType}
                          date={p.date}
                          price={p.price}
                          title={p.title}
                          image={p.image}
                          rentManagerName={manager.name}
                          rentManagerRole={manager.role}
                          bedrooms={p.bedrooms}
                          bathrooms={p.bathrooms}
                          parking={p.parking}
                          propertySize={`${(p.bedrooms * 15 + p.bathrooms * 5)} sqft`}
                          location={p.location || manager.location}
                        />
                      ) : (
                        <VerticalPropertyCard
                          key={p.id}
                          id={p.id}
                          propertyType={p.propertyType}
                          date={p.date}
                          price={p.price}
                          title={p.title}
                          image={p.image}
                          rentManagerName={manager.name}
                          rentManagerRole={manager.role}
                          bedrooms={p.bedrooms}
                          bathrooms={p.bathrooms}
                          parking={p.parking}
                          propertySize={`${(p.bedrooms * 15 + p.bathrooms * 5)} sqft`}
                          location={p.location || manager.location}
                        />
                      )
                    )) : (
                    <div className="rm-empty-state">
                      <p>No properties found matching your filters.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="rm-reviews-panel">
                {(() => {
                  const reviews = [
                    {
                      id: 1,
                      reviewerName: 'Sarah Johnson',
                      rating: 5,
                      date: 'Jan 20, 2026',
                      comment: 'Excellent service! Glaiza and Jerome were very professional and responsive. They helped us find the perfect property quickly and handled all the paperwork smoothly.',
                    },
                    {
                      id: 2,
                      reviewerName: 'Michael Chen',
                      rating: 5,
                      date: 'Jan 15, 2026',
                      comment: 'Outstanding rent managers! They made the entire rental process stress-free. Highly recommend their services.',
                    },
                    {
                      id: 3,
                      reviewerName: 'Maria Garcia',
                      rating: 4,
                      date: 'Jan 10, 2026',
                      comment: 'Very good experience overall. The property was exactly as described and the communication was clear throughout.',
                    },
                    {
                      id: 4,
                      reviewerName: 'David Rodriguez',
                      rating: 5,
                      date: 'Jan 5, 2026',
                      comment: 'Professional, reliable, and efficient. They went above and beyond to help us find our ideal rental property.',
                    },
                    {
                      id: 5,
                      reviewerName: 'Jennifer Lee',
                      rating: 4,
                      date: 'Dec 28, 2025',
                      comment: 'Great service! The team was helpful and knowledgeable about the area. The property we rented is perfect for our needs.',
                    },
                  ]

                  const overallRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
                  const roundedRating = Math.round(overallRating * 10) / 10

                  return (
                    <>
                      <div className="rm-overall-rating">
                        <div className="rm-rating-display">
                          <div className="rm-rating-number">{roundedRating}</div>
                          <div className="rm-rating-out-of">out of 5</div>
                        </div>
                        <div className="rm-rating-stars">
                          {[...Array(5)].map((_, index) => {
                            const starValue = index + 1
                            let fillPercentage = 0
                            if (starValue <= Math.floor(overallRating)) {
                              fillPercentage = 100
                            } else if (starValue === Math.ceil(overallRating) && overallRating % 1 !== 0) {
                              fillPercentage = (overallRating % 1) * 100
                            }

                            return (
                              <div key={index} className="rm-star-wrapper">
                                <svg
                                  width="32"
                                  height="32"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  className="rm-star-outline"
                                >
                                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#D1D5DB" strokeWidth="1" />
                                </svg>
                                <div
                                  className="rm-star-fill"
                                  style={{ width: `${fillPercentage}%` }}
                                >
                                  <svg
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="#FBBF24"
                                  >
                                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                  </svg>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        <div className="rm-rating-count">{reviews.length} reviews</div>
                      </div>
                      <div className="rm-reviews-list">
                        {reviews.map((review) => (
                          <div key={review.id} className="rm-review-card">
                            <div className="rm-review-header">
                              <div className="rm-reviewer-info">
                                <div className="rm-reviewer-avatar">
                                  {review.reviewerName.charAt(0)}
                                </div>
                                <div className="rm-reviewer-details">
                                  <div className="rm-reviewer-name">{review.reviewerName}</div>
                                  <div className="rm-review-date">{review.date}</div>
                                </div>
                              </div>
                              <div className="rm-review-rating">
                                {[...Array(5)].map((_, index) => (
                                  <svg
                                    key={index}
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill={index < review.rating ? '#FBBF24' : '#E5E7EB'}
                                    stroke={index < review.rating ? '#FBBF24' : '#D1D5DB'}
                                    strokeWidth="1"
                                  >
                                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                            <div className="rm-review-comment">
                              {review.comment}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )
                })()}
              </div>
            )}

            <div className="rm-pagination">
              <button className="rm-page-arrow" type="button">←</button>
              <button className="rm-page-num active" type="button">1</button>
              <button className="rm-page-num" type="button">2</button>
              <button className="rm-page-num" type="button">3</button>
              <span className="rm-page-ellipsis">...</span>
              <button className="rm-page-num" type="button">50</button>
              <button className="rm-page-arrow" type="button">→</button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default RentManagerDetailsPage



