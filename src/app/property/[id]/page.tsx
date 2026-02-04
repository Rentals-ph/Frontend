'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../../components/layout/Navbar'
import Footer from '../../../components/layout/Footer'
import PageHeader from '../../../components/layout/PageHeader'
import VerticalPropertyCard from '../../../components/common/VerticalPropertyCard'
import { propertiesApi } from '../../../api'
import type { Property } from '../../../types'
import { ASSETS } from '@/utils/assets'
import './page.css'

export default function PropertyDetailsPage() {
  const params = useParams()
  const id = params?.id as string
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [property, setProperty] = useState<Property | null>(null)
  const [similarProperties, setSimilarProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: 'PH+63',
    email: '',
    message: ''
  })

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return
      
      try {
        const propertyId = parseInt(id)
        if (isNaN(propertyId)) {
          console.error('Invalid property ID')
          return
        }
        
        const data = await propertiesApi.getById(propertyId)
        setProperty(data)
        setSelectedImageIndex(0) // Reset to first image when property changes
        setFormData(prev => ({
          ...prev,
          message: `I'm Interested In This Property ${data.title} And I'd Like To Know More Details.`
        }))
        
        // Fetch similar properties (same type or location)
        const allPropertiesResponse = await propertiesApi.getAll()
        // Handle both array and paginated response
        const allProperties = Array.isArray(allPropertiesResponse) 
          ? allPropertiesResponse 
          : allPropertiesResponse.data || []
        const similar = allProperties
          .filter((p: Property) => p.id !== propertyId && (p.type === data.type || p.location === data.location))
          .slice(0, 6)
        setSimilarProperties(similar)
      } catch (error) {
        console.error('Error fetching property:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [id])

  const formatPrice = (price: number): string => {
    return `₱${price.toLocaleString('en-US')}/Month`
  }

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Date not available'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getRentManagerRole = (isOfficial: boolean | undefined): string => {
    return isOfficial ? 'Rent Manager' : 'Property Specialist'
  }

  const getImageUrl = (image: string | null): string => {
    if (!image) return ASSETS.PLACEHOLDER_PROPERTY_MAIN
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image
    }
    if (image.startsWith('storage/') || image.startsWith('/storage/')) {
      return `/api/${image.startsWith('/') ? image.slice(1) : image}`
    }
    return image
  }

  // Generate property images array (in a real app, this would come from the API)
  const getPropertyImages = (property: Property): string[] => {
    const mainImage = getImageUrl(property.image)
    // For demo purposes, we'll use the main image and create variations
    // In production, the API should provide multiple images
    return [
      mainImage,
      mainImage, // Kitchen view (using same image for now)
      mainImage, // Bedroom view (using same image for now)
    ]
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert('Inquiry submitted successfully!')
  }

  const getShareUrl = (): string => {
    if (typeof window !== 'undefined') {
      return window.location.href
    }
    return ''
  }

  const getShareText = (): string => {
    if (!property) return ''
    return `Check out this ${property.type}: ${property.title} - ${formatPrice(property.price)}`
  }

  const handleShare = (platform: string) => {
    const url = getShareUrl()
    const text = getShareText()
    const encodedUrl = encodeURIComponent(url)
    const encodedText = encodeURIComponent(text)

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank', 'width=600,height=400')
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`, '_blank', 'width=600,height=400')
        break
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodedText}%20${encodedUrl}`, '_blank')
        break
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(property?.title || 'Property Listing')}&body=${encodedText}%20${encodedUrl}`
        break
      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          alert('Link copied to clipboard!')
        }).catch(() => {
          alert('Failed to copy link')
        })
        break
      case 'print':
        window.print()
        break
    }
    setShowShareMenu(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.share-menu-container')) {
        setShowShareMenu(false)
      }
    }

    if (showShareMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [showShareMenu])

  return (
    <div className="property-details-page">
      <Navbar />

      <PageHeader title="Property Details" />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading property details...</p>
        </div>
      ) : !property ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Property not found</p>
        </div>
      ) : (
        <>
          <div className="property-details-breadcrumbs">
            <Link href="/properties" className="breadcrumb-link">Properties</Link>
            <span className="breadcrumb-separator">&gt;</span>
            <span className="breadcrumb-current">{property.title}</span>
          </div>

          <main className="property-details-main">
            <div className="property-details-container">
              <div className="property-details-left">
                <div className="property-images-grid">
                  <div className="property-main-image">
                    {property && (
                      <img 
                        src={getPropertyImages(property)[selectedImageIndex]} 
                        alt={property.title}
                        key={selectedImageIndex}
                      />
                    )}
                  </div>
                  <div className="property-thumbnail-images">
                    {property && getPropertyImages(property)
                      .map((image, index) => ({ image, index }))
                      .filter(({ index }) => index !== selectedImageIndex)
                      .slice(0, 2)
                      .map(({ image, index }) => (
                        <div 
                          key={index}
                          className="property-thumbnail"
                          onClick={() => setSelectedImageIndex(index)}
                        >
                          <img src={image} alt={`Property view ${index + 1}`} />
                        </div>
                      ))}
                  </div>
                </div>

                <div className="property-overview-section">
                  <h2 className="property-section-title">Property Overview</h2>
                  <p className="property-description">
                    {showFullDescription ? property.description : property.description.substring(0, 200)}
                    {!showFullDescription && property.description.length > 200 && (
                      <button
                        className="show-more-btn"
                        onClick={() => setShowFullDescription(true)}
                      >
                        ...Show More
                      </button>
                    )}
                  </p>
                </div>

                <div className="nearby-landmarks-section">
                  <h2 className="property-section-title">Location</h2>
                  <div className="map-container">
                    <div className="map-placeholder">
                      <p style={{ padding: '2rem', textAlign: 'center' }}>Map view for {property.location}</p>
                      <button className="show-on-map-btn">Show On Map</button>
                      <div className="map-controls">
                        <button className="map-zoom-in">+</button>
                        <button className="map-zoom-out">−</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="property-details-right">
                <div className="contact-info-card">
                  <div className="contact-icon phone-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" fill="#205ED7" />
                    </svg>
                  </div>
                  <div className="contact-icon email-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="5" width="18" height="14" rx="2" stroke="#205ED7" strokeWidth="2" />
                      <path d="M3 7L12 13L21 7" stroke="#205ED7" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="rent-manager-info">
                    <div className="rent-manager-avatar" style={{ 
                      width: '50px', 
                      height: '50px', 
                      borderRadius: '50%', 
                      backgroundColor: '#205ED7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: 'bold'
                    }}>
                      {(property.agent?.first_name?.charAt(0) || property.rent_manager?.name?.charAt(0) || 'R')}
                    </div>
                    <div>
                      <p className="rent-manager-name">
                        {property.agent?.first_name && property.agent?.last_name 
                          ? `${property.agent.first_name} ${property.agent.last_name}`
                          : property.agent?.full_name 
                          || property.rent_manager?.name 
                          || 'Rental.Ph Official'}
                      </p>
                      <p className="rent-manager-role">
                        {property.agent 
                          ? getRentManagerRole(property.agent.verified) 
                          : getRentManagerRole(property.rent_manager?.is_official)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="property-title-card">
                  <div className="property-title-header">
                    <p className="property-price">{formatPrice(property.price)}</p>
                    <div className="property-action-buttons">
                      <div className="share-menu-container">
                        <button 
                          className="property-share-btn" 
                          aria-label="Share property"
                          onClick={() => setShowShareMenu(!showShareMenu)}
                        >
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"
                              fill="#205ED7"
                            />
                          </svg>
                        </button>
                        {showShareMenu && (
                          <div className="share-menu-dropdown">
                            <button 
                              className="share-menu-item" 
                              onClick={() => handleShare('facebook')}
                            >
                              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                              </svg>
                              <span>Facebook</span>
                            </button>
                            <button 
                              className="share-menu-item" 
                              onClick={() => handleShare('twitter')}
                            >
                              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                              </svg>
                              <span>Twitter</span>
                            </button>
                            <button 
                              className="share-menu-item" 
                              onClick={() => handleShare('whatsapp')}
                            >
                              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                              </svg>
                              <span>WhatsApp</span>
                            </button>
                            <button 
                              className="share-menu-item" 
                              onClick={() => handleShare('email')}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
                                <rect x="3" y="5" width="18" height="14" rx="2"/>
                                <path d="M3 7l9 6 9-6"/>
                              </svg>
                              <span>Email</span>
                            </button>
                            <button 
                              className="share-menu-item" 
                              onClick={() => handleShare('copy')}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                              </svg>
                              <span>Copy Link</span>
                            </button>
                            <button 
                              className="share-menu-item" 
                              onClick={() => handleShare('print')}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="6 9 6 2 18 2 18 9"/>
                                <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
                                <rect x="6" y="14" width="12" height="8"/>
                              </svg>
                              <span>Print</span>
                            </button>
                          </div>
                        )}
                      </div>
                      <button className="property-favorite-btn" aria-label="Add to favorites">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                            fill="#ef4444"
                            stroke="#ef4444"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="property-type-label">{property.type}</p>
                  <h1 className="property-title">{property.title}</h1>
                </div>

                <div className="property-details-card">
                  <div className="property-detail-item">
                    <span className="property-detail-label">Property type:</span>
                    <span className="property-detail-value">{property.type}</span>
                  </div>
                  <div className="property-detail-item">
                    <span className="property-detail-label">Property Size:</span>
                    <span className="property-detail-value">{property.area ? `${property.area} sqft` : 'N/A'}</span>
                  </div>
                  <div className="property-detail-item">
                    <span className="property-detail-label">Bedrooms:</span>
                    <span className="property-detail-value">{property.bedrooms}</span>
                  </div>
                  <div className="property-detail-item">
                    <span className="property-detail-label">Bathrooms:</span>
                    <span className="property-detail-value">{property.bathrooms}</span>
                  </div>
                </div>

                <div className="property-amenities-card">
                  <h3 className="amenities-title">Description</h3>
                  <p className="amenities-description">{property.description || 'No description available'}</p>
                </div>

            <div className="property-inquiry-form-card">
              <h3 className="inquiry-form-title">PROPERTY LISTING INQUIRY</h3>
              <form onSubmit={handleSubmit} className="inquiry-form">
                <input
                  type="text"
                  name="firstName"
                  placeholder="Firstname"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="inquiry-input"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Lastname"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="inquiry-input"
                  required
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="PH+63"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="inquiry-input"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="inquiry-input"
                  required
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="inquiry-textarea"
                  rows={4}
                  required
                />
                <button type="submit" className="inquiry-submit-btn">Send</button>
              </form>
            </div>
          </div>
        </div>
      </main>

          <section className="similar-properties-section">
            <div className="similar-properties-container">
              <h2 className="similar-properties-title">Similar Properties</h2>
              <div className="similar-properties-carousel">
                {similarProperties.length > 0 ? (
                  similarProperties.map(prop => {
                    const propertySize = prop.area 
                      ? `${prop.area} sqft` 
                      : `${(prop.bedrooms * 15 + prop.bathrooms * 5)} sqft`
                    
                    return (
                      <div key={prop.id} className="similar-property-card">
                        <VerticalPropertyCard
                          id={prop.id}
                          propertyType={prop.type}
                          date={formatDate(prop.published_at)}
                          price={formatPrice(prop.price)}
                          title={prop.title}
                          image={getImageUrl(prop.image)}
                          rentManagerName={
                            prop.agent?.first_name && prop.agent?.last_name
                              ? `${prop.agent.first_name} ${prop.agent.last_name}`
                              : prop.agent?.full_name
                              || prop.rent_manager?.name
                              || 'Rental.Ph Official'
                          }
                          rentManagerRole={
                            prop.agent
                              ? getRentManagerRole(prop.agent.verified)
                              : getRentManagerRole(prop.rent_manager?.is_official)
                          }
                          bedrooms={prop.bedrooms}
                          bathrooms={prop.bathrooms}
                          parking={0}
                          propertySize={propertySize}
                          location={prop.location}
                        />
                      </div>
                    )
                  })
                ) : (
                  <p style={{ padding: '2rem', textAlign: 'center' }}>No similar properties found</p>
                )}
              </div>
            </div>
          </section>
        </>
      )}

      <Footer />
    </div>
  )
}

