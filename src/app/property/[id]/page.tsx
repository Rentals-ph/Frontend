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
import './page.css'

export default function PropertyDetailsPage() {
  const params = useParams()
  const id = params?.id as string
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [property, setProperty] = useState<Property | null>(null)
  const [similarProperties, setSimilarProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
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
        const allProperties = await propertiesApi.getAll()
        const similar = allProperties
          .filter(p => p.id !== propertyId && (p.type === data.type || p.location === data.location))
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
    if (!image) return '/assets/property-main.png'
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
                      {property.rent_manager?.name?.charAt(0) || 'R'}
                    </div>
                    <div>
                      <p className="rent-manager-name">{property.rent_manager?.name || 'Rental.Ph Official'}</p>
                      <p className="rent-manager-role">{getRentManagerRole(property.rent_manager?.is_official)}</p>
                    </div>
                  </div>
                </div>

                <div className="property-title-card">
                  <div className="property-title-header">
                    <p className="property-price">{formatPrice(property.price)}</p>
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
                          rentManagerName={prop.rent_manager?.name || 'Rental.Ph Official'}
                          rentManagerRole={getRentManagerRole(prop.rent_manager?.is_official)}
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

