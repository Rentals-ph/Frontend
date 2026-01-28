import { useNavigate } from 'react-router-dom'
import './VerticalPropertyCard.css'

interface VerticalPropertyCardProps {
  id?: number | string
  propertyType?: string
  date?: string
  price?: string
  title?: string
  image?: string
  rentManagerName?: string
  rentManagerRole?: string
  bedrooms?: number
  bathrooms?: number
  parking?: number
  propertySize?: string
}

function VerticalPropertyCard({
  id,
  propertyType = 'Commercial Spaces',
  date = 'Sat 05, 2024',
  price = '$1200/Month',
  title = 'Azure Residences - 2BR Corner Suite',
  image = '/assets/property-main.png',
  rentManagerName = 'Rental.Ph Official',
  rentManagerRole = 'Rent Manager',
  bedrooms = 4,
  bathrooms = 2,
  parking = 2,
  propertySize = '24 sqft',
}: VerticalPropertyCardProps) {
  const navigate = useNavigate()

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on buttons or links
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('svg')) {
      return
    }
    if (id) {
      navigate(`/property/${id}`)
    }
  }

  return (
    <article 
      className="vertical-property-card" 
      onClick={handleCardClick}
      style={{ cursor: id ? 'pointer' : 'default' }}
    >
      <img
        src={image}
        alt={title}
        className="vertical-property-image"
        onError={(e) => {
          // Fallback to default image if the provided image fails to load
          e.currentTarget.src = '/assets/property-main.png'
        }}
      />
      <div className="vertical-property-content">
        <div className="vertical-property-header-row">
          <p className="vertical-property-type">{propertyType}</p>
          <p className="vertical-property-date">{date}</p>
        </div>
        <div className="vertical-property-price-row">
          <p className="vertical-property-price">{price}</p>
          
          <div className="vertical-property-contact-icons">
          <button className="vertical-property-like" aria-label="Add to favorites">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </button>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="#205ED7" strokeWidth="2"/>
            <path d="M3 7L12 13L21 7" stroke="#205ED7" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 2H7C5.89543 2 5 2.89543 5 4V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V4C19 2.89543 18.1046 2 17 2Z" stroke="#25D366" strokeWidth="2"/>
            <path d="M12 18H12.01" stroke="#25D366" strokeWidth="2" strokeLinecap="round"/>
            <path d="M9 7H15" stroke="#25D366" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="5" r="3" fill="#205ED7"/>
            <circle cx="6" cy="12" r="3" fill="#205ED7"/>
            <circle cx="18" cy="19" r="3" fill="#205ED7"/>
            <path d="M8.59 13.51L15.42 17.49M15.41 6.51L8.59 10.49" stroke="#205ED7" strokeWidth="2"/>
          </svg>
        </div>
        </div>
        <h3 className="vertical-property-title">{title}</h3>
        
        <div className="vertical-rent-manager-badge">
          <img
            src="/assets/rental-ph-logo.svg"
            alt="Rentals.ph Official"
            className="vertical-rent-manager-avatar"
          />
          <div className="vertical-rent-manager-info">
            <p className="vertical-rent-manager-name">{rentManagerName}</p>
            <p className="vertical-rent-manager-role">{rentManagerRole}</p>
          </div>
        </div>
      </div>
      <div className="vertical-property-features">
        <div className="vertical-property-feature-item" title="Bedrooms">
          <div className="feature-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 9H21" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
              <path d="M7 13H7.01" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 13H11.01" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 13H15.01" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 13H19.01" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="feature-tooltip">Bedrooms</span>
          </div>
          <span>{bedrooms}</span>
        </div>
        <div className="vertical-property-feature-item" title="Bathrooms">
          <div className="feature-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2V6M16 2V6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
              <path d="M3 6H21C22.1046 6 23 6.89543 23 8V20C23 21.1046 22.1046 22 21 22H3C1.89543 22 1 21.1046 1 20V8C1 6.89543 1.89543 6 3 6Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 12H6.01" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18 12H18.01" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 16H6.01" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18 16H18.01" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="feature-tooltip">Bathrooms</span>
          </div>
          <span>{bathrooms}</span>
        </div>
        <div className="vertical-property-feature-item" title="Property Size">
          <div className="feature-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3H21V21H3V3Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 9H21" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
              <path d="M9 3V21" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 9H12.01" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 15H12.01" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="feature-tooltip">Property Size</span>
          </div>
          <span>{propertySize}</span>
        </div>
      </div>
    </article>
  )
}

export default VerticalPropertyCard