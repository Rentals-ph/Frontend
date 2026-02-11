'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { pageBuilderApi } from '@/api'
import type { PageBuilderData } from '@/api'
import { ASSETS } from '@/utils/assets'
import { 
  FiMail,
  FiPhone,
  FiMessageCircle,
  FiGlobe,
  FiStar,
  FiHeart
} from 'react-icons/fi'
import '../../agent/page-builder/page.css'

export default function PublicPageBuilderPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [pageData, setPageData] = useState<PageBuilderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [contactFormName, setContactFormName] = useState('')
  const [contactFormEmail, setContactFormEmail] = useState('')
  const [contactFormMessage, setContactFormMessage] = useState('')

  useEffect(() => {
    const fetchPage = async () => {
      if (!slug) return
      
      try {
        setLoading(true)
        setError(null)
        console.log('Fetching page with slug:', slug)
        const data = await pageBuilderApi.getBySlug(slug)
        console.log('Page data received:', data)
        setPageData(data)
      } catch (err: any) {
        console.error('Error fetching page:', err)
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          url: err.config?.url
        })
        setError(err.response?.data?.message || err.message || 'Page not found')
      } finally {
        setLoading(false)
      }
    }
    
    fetchPage()
  }, [slug])

  const handleContactFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!contactFormName || !contactFormEmail || !contactFormMessage) {
        alert('Please fill in all fields')
        return
      }
      
      // TODO: Implement actual API call to submit inquiry
      console.log('Contact form submission:', {
        name: contactFormName,
        email: contactFormEmail,
        message: contactFormMessage,
        pageId: pageData?.id,
        pageType: pageData?.page_type
      })
      
      alert('Thank you for your inquiry! We will get back to you soon.')
      setContactFormName('')
      setContactFormEmail('')
      setContactFormMessage('')
    } catch (error) {
      console.error('Error submitting contact form:', error)
      alert('Failed to send inquiry. Please try again.')
    }
  }

  const getCornerRadiusClass = (cornerRadius?: string) => {
    switch (cornerRadius) {
      case 'sharp': return '0px'
      case 'regular': return '8px'
      case 'soft': return '16px'
      default: return '16px'
    }
  }

  const formatPropertyPrice = (property: any) => {
    if (!property) return ''
    return `₱${property.price?.toLocaleString() || ''}${property.price_type ? `/${property.price_type}` : '/mo'}`
  }

  const formatPropertyDate = (property: any) => {
    if (property?.published_at) {
      const date = new Date(property.published_at)
      return date.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
    }
    return 'Recently'
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontSize: '18px',
        color: '#6B7280'
      }}>
        Loading page...
      </div>
    )
  }

  if (error || !pageData) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        padding: '20px'
      }}>
        <h1 style={{ fontSize: '24px', marginBottom: '12px', color: '#111827' }}>Page Not Found</h1>
        <p style={{ color: '#6B7280', textAlign: 'center' }}>
          {error || 'The page you are looking for does not exist or is not published.'}
        </p>
      </div>
    )
  }

  // Profile Page
  if (pageData.page_type === 'profile') {
    return (
      <div style={{ 
        minHeight: '100vh',
        backgroundColor: pageData.selected_theme === 'dark' ? '#1F2937' : 
                        pageData.selected_theme === 'orange' ? '#F97316' :
                        pageData.selected_theme === 'blue' ? '#3B82F6' : '#FFFFFF',
        padding: '40px 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          {/* Profile Section */}
          <div className="full-preview-profile-section" style={{ marginBottom: '40px' }}>
            <div className="full-preview-profile-header">
              <div className="full-preview-profile-image-wrapper">
                <img 
                  src={pageData.profile_image || ASSETS.PLACEHOLDER_PROFILE} 
                  alt="Profile"
                  className="full-preview-profile-image"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <div className="full-preview-profile-fallback">
                  {pageData.profile_card_name?.[0] || 'A'}{pageData.profile_card_name?.split(' ').pop()?.[0] || 'G'}
                </div>
              </div>
              <div className="full-preview-profile-info">
                <h2 className="full-preview-name">
                  {pageData.profile_card_name || 'Agent Name'}
                </h2>
                {pageData.show_bio && pageData.bio && (
                  <p className="full-preview-tagline">{pageData.bio}</p>
                )}
                {pageData.show_contact_number && pageData.contact_info && (
                  <div className="full-preview-contact-icons">
                    {pageData.contact_info.email && (
                      <a 
                        href={`mailto:${pageData.contact_info.email}`}
                        className="full-preview-contact-icon" 
                        title={pageData.contact_info.email}
                      >
                        <FiMail />
                      </a>
                    )}
                    {pageData.contact_info.phone && (
                      <a 
                        href={`tel:${pageData.contact_info.phone}`}
                        className="full-preview-contact-icon" 
                        title={pageData.contact_info.phone}
                      >
                        <FiPhone />
                      </a>
                    )}
                    {pageData.contact_info.message && (
                      <a 
                        href={pageData.contact_info.message}
                        className="full-preview-contact-icon" 
                        title={pageData.contact_info.message}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FiMessageCircle />
                      </a>
                    )}
                    {pageData.contact_info.website && (
                      <a 
                        href={pageData.contact_info.website}
                        className="full-preview-contact-icon" 
                        title={pageData.contact_info.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FiGlobe />
                      </a>
                    )}
                  </div>
                )}
                {pageData.show_experience_stats && pageData.experience_stats && pageData.experience_stats.length > 0 && (
                  <div className="full-preview-experience-stats">
                    {pageData.experience_stats.map((stat: any, index: number) => (
                      <div key={index} className="full-preview-stat-item">
                        <div className="full-preview-stat-value">{stat.value}</div>
                        <div className="full-preview-stat-label">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Featured Listings */}
          {pageData.show_featured_listings && pageData.featured_listings && pageData.featured_listings.length > 0 && (
            <div className="full-preview-featured-section" style={{ marginBottom: '40px' }}>
              <h3 className="full-preview-section-title">Featured Listings</h3>
              <div className="full-preview-listings-grid">
                {pageData.featured_listings.map((listing: any) => (
                  <div key={listing.id} className="full-preview-listing-card">
                    <div className="full-preview-listing-badge">
                      <FiStar className="full-preview-star-icon" />
                      <span>Featured</span>
                    </div>
                    <div className="full-preview-listing-image-wrapper">
                      <img src={listing.image || ASSETS.PLACEHOLDER_PROPERTY} alt={listing.title} />
                    </div>
                    <div className="full-preview-listing-info">
                      <div className="full-preview-listing-info-header">
                        <div className="full-preview-listing-price">{formatPropertyPrice(listing)}</div>
                        <button className="full-preview-listing-heart" aria-label="Favorite">
                          <FiHeart />
                        </button>
                      </div>
                      <div className="full-preview-listing-title">{listing.title}</div>
                      <div className="full-preview-listing-category">{listing.type || listing.category}</div>
                      <div className="full-preview-listing-info-footer">
                        <div className="full-preview-listing-date">{formatPropertyDate(listing)}</div>
                        <div className="full-preview-listing-view-count">
                          <span>1</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Testimonials */}
          {pageData.show_testimonials && pageData.testimonials && pageData.testimonials.length > 0 && (
            <div className="full-preview-testimonials-section">
              <h3 className="full-preview-section-title">Client Testimonials</h3>
              <div className="full-preview-testimonials-grid">
                {pageData.testimonials.map((testimonial: any) => (
                  <div key={testimonial.id} className="full-preview-testimonial-card">
                    <div className="full-preview-testimonial-header">
                      <img 
                        src={testimonial.avatar || ASSETS.PLACEHOLDER_PROFILE} 
                        alt={testimonial.name}
                        className="full-preview-testimonial-avatar"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                      <div className="full-preview-testimonial-avatar-fallback">
                        {testimonial.name?.split(' ').map((n: string) => n[0]).join('') || 'TC'}
                      </div>
                      <div className="full-preview-testimonial-name">{testimonial.name}</div>
                    </div>
                    <p className="full-preview-testimonial-quote">"{testimonial.content}"</p>
                    {testimonial.role && (
                      <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '8px' }}>
                        {testimonial.role}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Property Page
  if (pageData.page_type === 'property') {
    const layoutSections = pageData.layout_sections || []
    const sectionVisibility = pageData.section_visibility || {}

    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
        <div className="full-preview-property-page">
          {/* Render sections in the order specified by layoutSections */}
          {layoutSections.map((section: any) => {
            if (!section.visible || !sectionVisibility[section.id as keyof typeof sectionVisibility]) return null
            
            switch (section.id) {
              case 'hero':
                return (
                  <div key={section.id} className="full-preview-property-hero-section" style={{ width: '100%' }}>
                    <div 
                      className="full-preview-property-hero-image"
                      style={{
                        backgroundImage: `url(${pageData.hero_image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        filter: `brightness(${100 - (pageData.overall_darkness || 30)}%)`
                      }}
                    >
                      <div className="full-preview-property-hero-overlay">
                        <h1 className="full-preview-property-hero-title">{pageData.main_heading}</h1>
                        <p className="full-preview-property-hero-tagline">{pageData.tagline}</p>
                        {pageData.property_price && (
                          <button className="full-preview-property-hero-price-btn">
                            Starts at {pageData.property_price} /mo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              
              case 'propertyDescription':
                return (
                  <div key={section.id} className="full-preview-property-about-section" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
                    <h2 className="full-preview-property-section-heading">About</h2>
                    <p className="full-preview-property-about-text">{pageData.property_description}</p>
                  </div>
                )
              
              case 'propertyImages':
                return (
                  <div key={section.id} className="full-preview-property-inside-section" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
                    <h2 className="full-preview-property-section-heading">What's Inside?</h2>
                    <div className="full-preview-property-inside-images">
                      {(pageData.property_images || []).map((image: string, index: number) => (
                        <div 
                          key={index} 
                          className="full-preview-property-inside-image-item"
                          style={{ borderRadius: getCornerRadiusClass(pageData.selected_corner_radius) }}
                        >
                          <img src={image} alt={`Interior ${index + 1}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                )
              
              case 'profileCard':
                return (
                  <div 
                    key={section.id}
                    className="full-preview-property-agent-card"
                    style={{
                      maxWidth: '1200px',
                      margin: '0 auto',
                      padding: '0 24px 40px 24px',
                      backgroundColor: pageData.selected_brand_color === 'white' ? '#3B82F6' : 
                                     pageData.selected_brand_color === 'dark' ? '#1F2937' :
                                     pageData.selected_brand_color === 'orange' ? '#F97316' :
                                     pageData.selected_brand_color === 'blue' ? '#3B82F6' : '#3B82F6',
                      borderRadius: getCornerRadiusClass(pageData.selected_corner_radius)
                    }}
                  >
                    <div className="full-preview-property-agent-content">
                      <div className="full-preview-property-agent-image-wrapper">
                        <img 
                          src={pageData.profile_card_image || ASSETS.PLACEHOLDER_PROFILE} 
                          alt={pageData.profile_card_name || 'Agent'} 
                          className="full-preview-property-agent-image" 
                        />
                      </div>
                      <div className="full-preview-property-agent-info">
                        <h3 className="full-preview-property-agent-name">{pageData.profile_card_name}</h3>
                        <p className="full-preview-property-agent-role">{pageData.profile_card_role}</p>
                        <p className="full-preview-property-agent-quote">{pageData.profile_card_bio}</p>
                        <div className="full-preview-property-agent-icons">
                          {pageData.contact_email && (
                            <a 
                              href={`mailto:${pageData.contact_email}`}
                              className="full-preview-property-agent-icon"
                            >
                              <FiMail />
                            </a>
                          )}
                          {pageData.contact_phone && (
                            <a 
                              href={`tel:${pageData.contact_phone}`}
                              className="full-preview-property-agent-icon"
                            >
                              <FiPhone />
                            </a>
                          )}
                          <button className="full-preview-property-agent-icon">
                            <FiMessageCircle />
                          </button>
                          <button className="full-preview-property-agent-icon">
                            <FiGlobe />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              
              default:
                return null
            }
          })}

          {/* Ready To View? Section */}
          <div className="full-preview-property-contact-section" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
            <div className="full-preview-property-contact-left">
              <h2 className="full-preview-property-section-heading">Ready To View?</h2>
              <p className="full-preview-property-contact-text">Schedule a tour or ask any questions about the property.</p>
              <div className="full-preview-property-contact-info">
                {pageData.contact_phone && (
                  <div className="full-preview-property-contact-item">
                    <FiPhone className="full-preview-property-contact-icon" />
                    <span>{pageData.contact_phone}</span>
                  </div>
                )}
                {pageData.contact_email && (
                  <div className="full-preview-property-contact-item">
                    <FiMail className="full-preview-property-contact-icon" />
                    <span>{pageData.contact_email}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="full-preview-property-contact-form">
              <h3 className="full-preview-property-form-title">Contact {pageData.profile_card_name || 'Agent'}</h3>
              <form onSubmit={handleContactFormSubmit}>
                <input
                  type="text"
                  className="full-preview-property-form-input"
                  placeholder="Your name"
                  value={contactFormName}
                  onChange={(e) => setContactFormName(e.target.value)}
                  required
                />
                <input
                  type="email"
                  className="full-preview-property-form-input"
                  placeholder="Your email"
                  value={contactFormEmail}
                  onChange={(e) => setContactFormEmail(e.target.value)}
                  required
                />
                <textarea
                  className="full-preview-property-form-textarea"
                  placeholder="Your message"
                  value={contactFormMessage}
                  onChange={(e) => setContactFormMessage(e.target.value)}
                  rows={4}
                  required
                />
                <button 
                  className="full-preview-property-form-submit-btn"
                  type="submit"
                >
                  <span>Send Inquiry</span>
                  <FiMessageCircle />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

