'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../../components/layout/Navbar'
import Footer from '../../../components/layout/Footer'
import PageHeader from '../../../components/layout/PageHeader'
import VerticalPropertyCard from '../../../components/common/VerticalPropertyCard'
import SharePopup, { type SharePlatform, type ShareOption } from '../../../components/common/SharePopup'
import PropertyLocationMap from '../../../components/common/PropertyLocationMap'
import { propertiesApi, messagesApi } from '../../../api'
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
  const [showImageModal, setShowImageModal] = useState(false)
  const [modalImageIndex, setModalImageIndex] = useState(0)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!property || !property.agent_id) {
      alert('Property agent information is missing. Please try again later.')
      return
    }

    try {
      await messagesApi.send({
        recipient_id: property.agent_id,
        property_id: property.id,
        sender_name: `${formData.firstName} ${formData.lastName}`,
        sender_email: formData.email,
        sender_phone: formData.phone.replace('PH+63', ''),
        message: formData.message,
        type: 'property_inquiry',
        subject: `Inquiry about ${property.title}`,
      })
      alert('Inquiry submitted successfully!')
      setFormData({ firstName: '', lastName: '', phone: 'PH+63', email: '', message: '' })
    } catch (error: any) {
      console.error('Error sending inquiry:', error)
      alert(error.response?.data?.message || 'Failed to send inquiry. Please try again.')
    }
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

  const handleShare = (platform: SharePlatform) => {
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
      case 'gmail':
        window.open(
          `mailto:?subject=${encodeURIComponent(property?.title || 'Property Listing')}&body=${encodedText}%20${encodedUrl}`,
          '_blank'
        )
        break
    }
  }

  const shareOptions: ShareOption[] = [
    {
      platform: 'facebook',
      label: 'Facebook',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="#1877F2" />
        </svg>
      ),
    },
    {
      platform: 'twitter',
      label: 'Twitter',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" fill="#1DA1F2"/>
        </svg>
      ),
    },
    {
      platform: 'whatsapp',
      label: 'WhatsApp',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 20.2c-.151.504.335.99.839.839l3.032-.892A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" fill="#25D366"/>
          <path d="M9.5 8.5c-.15-.35-.3-.36-.45-.36h-.4c-.15 0-.4.05-.6.3-.2.25-.75.75-.75 1.8s.75 2.1.85 2.25c.1.15 1.5 2.3 3.65 3.2.5.2.9.35 1.2.45.5.15.95.15 1.3.1.4-.05 1.25-.5 1.4-1s.15-1 .1-1.05c-.05-.1-.2-.15-.4-.25l-1.2-.6c-.2-.1-.35-.15-.5.15-.15.3-.6.75-.75.9-.15.15-.25.15-.45.05-.2-.1-.85-.3-1.6-1-.6-.55-1-1.2-1.1-1.4-.1-.2 0-.3.1-.4.1-.1.2-.25.3-.35.1-.1.15-.2.2-.3.05-.1.05-.2 0-.3-.05-.1-.5-1.2-.7-1.65z" fill="#FFFFFF"/>
        </svg>
      ),
    },
    {
      platform: 'email',
      label: 'Email',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" fill="#EA4335" />
          <path d="M22 6L12 13L2 6" fill="#FFFFFF" />
        </svg>
      ),
    },
    {
      platform: 'copy',
      label: 'Copy Link',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
        </svg>
      ),
    },
    {
      platform: 'print',
      label: 'Print',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
          <polyline points="6 9 6 2 18 2 18 9"/>
          <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
          <rect x="6" y="14" width="12" height="8"/>
        </svg>
      ),
    },
  ]

  // Keyboard navigation for image modal
  useEffect(() => {
    if (!showImageModal || !property) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const images = getPropertyImages(property)
      if (e.key === 'ArrowRight' && modalImageIndex < images.length - 1) {
        setModalImageIndex(prev => prev + 1)
      } else if (e.key === 'ArrowLeft' && modalImageIndex > 0) {
        setModalImageIndex(prev => prev - 1)
      } else if (e.key === 'Escape') {
        setShowImageModal(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showImageModal, modalImageIndex, property])

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
                  <div 
                    className="property-main-image"
                    onClick={() => {
                      setModalImageIndex(selectedImageIndex)
                      setShowImageModal(true)
                    }}
                    style={{ cursor: 'pointer' }}
                  >
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
                          onClick={() => {
                            setSelectedImageIndex(index)
                            setModalImageIndex(index)
                            setShowImageModal(true)
                          }}
                          style={{ cursor: 'pointer' }}
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
                  <p className="property-location-label">{property.location}</p>
                  <div className="map-container">
                    <PropertyLocationMap property={property} />
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
                        <SharePopup
                          isOpen={showShareMenu}
                          onClose={() => setShowShareMenu(false)}
                          onShare={handleShare}
                          options={shareOptions}
                          position="bottom"
                          align="right"
                        />
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
                          image={prop.image_url || prop.image || ASSETS.PLACEHOLDER_PROPERTY_MAIN}
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

      {/* Image Modal */}
      {showImageModal && property && (() => {
        const images = getPropertyImages(property)
        const currentIndex = modalImageIndex
        const hasNext = currentIndex < images.length - 1
        const hasPrev = currentIndex > 0

        const handleNext = (e: React.MouseEvent) => {
          e.stopPropagation()
          if (hasNext) {
            setModalImageIndex(currentIndex + 1)
          }
        }

        const handlePrev = (e: React.MouseEvent) => {
          e.stopPropagation()
          if (hasPrev) {
            setModalImageIndex(currentIndex - 1)
          }
        }

        return (
          <div 
            className="image-modal-overlay"
            onClick={() => setShowImageModal(false)}
          >
            <div 
              className="image-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="image-modal-close"
                onClick={() => setShowImageModal(false)}
                aria-label="Close image"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              
              {hasPrev && (
                <button 
                  className="image-modal-arrow image-modal-arrow-left"
                  onClick={handlePrev}
                  aria-label="Previous image"
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M15 18l-6-6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}

              <img 
                src={images[currentIndex]} 
                alt={`${property.title} - Image ${currentIndex + 1}`}
                className="image-modal-img"
              />

              {hasNext && (
                <button 
                  className="image-modal-arrow image-modal-arrow-right"
                  onClick={handleNext}
                  aria-label="Next image"
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M9 18l6-6-6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}

              <div className="image-modal-thumbnails">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`image-modal-thumbnail ${index === currentIndex ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setModalImageIndex(index)
                    }}
                  >
                    <img 
                      src={image} 
                      alt={`${property.title} - Thumbnail ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}

