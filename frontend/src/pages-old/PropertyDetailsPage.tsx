import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import PageHeader from '../components/layout/PageHeader'
import VerticalPropertyCard from '../components/common/VerticalPropertyCard'
import './PropertyDetailsPage.css'

function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: 'PH+63',
    email: '',
    message: "I'm Interested In This Property STUDIO UNIT WITH PARKING IN SOLINEA TOWER 2 CONDO FOR RENT And I'd Like To Know More Details."
  })

  // Sample property data - in a real app, this would come from an API based on the id
  const property = {
    id: id || '1',
    title: 'Azure Residences - 2BR Corner Suite',
    propertyType: 'Commercial Spaces',
    price: '$1200/Month',
    propertySize: '24 sqft',
    propertyTypeDetail: 'Condominium',
    garage: 1,
    bedrooms: 4,
    bathrooms: 2,
    amenities: ['Air Conditioning', 'Kitchen', 'Parking', 'Wi-Fi Internet'],
    description: `Solinea is an Alveo multi-tower development in Cebu City that offers a master-planned city resort living environment. The development features landscaped parks, kid's play areas, a multi-experiential pool, a clubhouse with a gym, function room, and game room. It also includes upscale retail shops and restaurants.`,
    fullDescription: `Solinea is an Alveo multi-tower development in Cebu City that offers a master-planned city resort living environment. The development features landscaped parks, kid's play areas, a multi-experiential pool, a clubhouse with a gym, function room, and game room. It also includes upscale retail shops and restaurants. The property is strategically located near major business districts and offers easy access to transportation hubs.`,
    images: [
      '/assets/property-main.png',
      '/assets/property-main.png',
      '/assets/property-main.png'
    ],
    rentManager: {
      name: 'Jonathan And...',
      role: 'Rent Manager',
      avatar: '/assets/rental-ph-logo.svg',
      phone: '+63 123 456 7890',
      email: 'jonathan@rentals.ph'
    },
    location: 'Cebu City',
    nearbyLandmarks: [
      'Ayala Center Cebu',
      'House of Lechon',
      'Makerlab Cebu',
      'I Thai Goong'
    ]
  }

  // Sample similar properties
  const similarProperties = [
    {
      id: 2,
      propertyType: 'Commercial Spaces',
      date: 'Sat 05, 2024',
      price: '$1200/Month',
      title: 'Azure Residences - 2BR Corner Suite',
      image: '/assets/property-main.png',
      rentManagerName: 'RentalPh Official Rent Manager',
      rentManagerRole: 'Rent Manager',
      bedrooms: 4,
      bathrooms: 2,
      parking: 2,
      propertySize: '24 sqft'
    },
    {
      id: 3,
      propertyType: 'Condominium',
      date: 'Jan 15, 2026',
      price: '₱35,000/Month',
      title: 'Azure Urban Residences - 2BR Fully Furnished',
      image: '/assets/property-1.jpg',
      rentManagerName: 'Maria Santos',
      rentManagerRole: 'Senior Rent Manager',
      bedrooms: 2,
      bathrooms: 2,
      parking: 1,
      propertySize: '45 sqft'
    },
    {
      id: 4,
      propertyType: 'Apartment',
      date: 'Jan 18, 2026',
      price: '₱18,000/Month',
      title: 'Cozy 1BR Apartment Near BGC',
      image: '/assets/property-2.jpg',
      rentManagerName: 'John Reyes',
      rentManagerRole: 'Property Specialist',
      bedrooms: 1,
      bathrooms: 1,
      parking: 0,
      propertySize: '28 sqft'
    }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    alert('Inquiry submitted successfully!')
  }

  return (
    <div className="property-details-page">
      <Navbar />

      {/* Page Header */}
      <PageHeader title="Property Details" />

      {/* Breadcrumbs */}
      <div className="property-details-breadcrumbs">
        <Link to="/properties" className="breadcrumb-link">Properties</Link>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-current">{property.title}</span>
      </div>

      {/* Main Content */}
      <main className="property-details-main">
        <div className="property-details-container">
          {/* Left Column */}
          <div className="property-details-left">
            {/* Property Images */}
            <div className="property-images-grid">
              <div className="property-main-image">
                <img src={property.images[0]} alt={property.title} />
              </div>
              <div className="property-thumbnail-images">
                <div className="property-thumbnail">
                  <img src={property.images[1] || property.images[0]} alt="Property view 1" />
                </div>
                <div className="property-thumbnail">
                  <img src={property.images[2] || property.images[0]} alt="Property view 2" />
                </div>
              </div>
            </div>

            {/* Property Overview */}
            <div className="property-overview-section">
              <h2 className="property-section-title">Property Overview</h2>
              <p className="property-description">
                {showFullDescription ? property.fullDescription : property.description}
                {!showFullDescription && (
                  <button
                    className="show-more-btn"
                    onClick={() => setShowFullDescription(true)}
                  >
                    ...Show More
                  </button>
                )}
              </p>
            </div>

            {/* Nearby Landmarks */}
            <div className="nearby-landmarks-section">
              <h2 className="property-section-title">Nearby Landmarks</h2>
              <div className="map-container">
                <div className="map-placeholder">
                  <div className="map-markers">
                    {property.nearbyLandmarks.map((landmark, index) => (
                      <div key={index} className="map-marker" style={{
                        position: 'absolute',
                        left: `${20 + index * 25}%`,
                        top: `${30 + (index % 2) * 20}%`
                      }}>
                        <div className="marker-dot"></div>
                        <div className="marker-label">{landmark}</div>
                      </div>
                    ))}
                  </div>
                  <button className="show-on-map-btn">Show On Map</button>
                  <div className="map-controls">
                    <button className="map-zoom-in">+</button>
                    <button className="map-zoom-out">−</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="property-details-right">
            {/* Contact Info Card */}
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
                <img src={property.rentManager.avatar} alt={property.rentManager.name} className="rent-manager-avatar" />
                <div>
                  <p className="rent-manager-name">{property.rentManager.name}</p>
                  <p className="rent-manager-role">{property.rentManager.role}</p>
                </div>
              </div>
            </div>

            {/* Property Title & Price */}
            <div className="property-title-card">
              <div className="property-title-header">
                <p className="property-price">{property.price}</p>

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
              <p className="property-type-label">{property.propertyType}</p>
              <h1 className="property-title">{property.title}</h1>
            </div>

            {/* Property Details */}
            <div className="property-details-card">
              <div className="property-detail-item">
                <span className="property-detail-label">Property type:</span>
                <span className="property-detail-value">{property.propertyTypeDetail}</span>
              </div>
              <div className="property-detail-item">
                <span className="property-detail-label">Property Size:</span>
                <span className="property-detail-value">{property.propertySize}</span>
              </div>
              <div className="property-detail-item">
                <span className="property-detail-label">Garage:</span>
                <span className="property-detail-value">{property.garage}</span>
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

            {/* Amenities */}
            <div className="property-amenities-card">
              <h3 className="amenities-title">Amenities</h3>
              <ul className="amenities-list">
                {property.amenities.map((amenity, index) => (
                  <li key={index} className="amenity-item">{amenity}</li>
                ))}
              </ul>
            </div>

            {/* Inquiry Form */}
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

      {/* Similar Properties Section */}
      <section className="similar-properties-section">
        <div className="similar-properties-container">
          <h2 className="similar-properties-title">Similar Properties</h2>
          <div className="similar-properties-carousel">
            {similarProperties.map(prop => (
              <div
                key={prop.id}
                className="similar-property-card"
              >
                <VerticalPropertyCard
                  id={prop.id}
                  propertyType={prop.propertyType}
                  date={prop.date}
                  price={prop.price}
                  title={prop.title}
                  image={prop.image}
                  rentManagerName={prop.rentManagerName}
                  rentManagerRole={prop.rentManagerRole}
                  bedrooms={prop.bedrooms}
                  bathrooms={prop.bathrooms}
                  parking={prop.parking}
                  propertySize={prop.propertySize}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default PropertyDetailsPage

