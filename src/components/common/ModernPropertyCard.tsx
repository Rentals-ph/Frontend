'use client'

import { useRouter } from 'next/navigation'
import { ASSETS } from '@/utils/assets'
import { resolvePropertyImage } from '@/utils/imageResolver'
import './ModernPropertyCard.css'

interface ModernPropertyCardProps {
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
  location?: string
}

function ModernPropertyCard({
  id,
  propertyType = 'Commercial Spaces',
  date = 'Sat 05, 2024',
  price = '$1200/Month',
  title = 'Azure Residences - 2BR Corner Suite',
  image = ASSETS.PLACEHOLDER_PROPERTY_MAIN,
  rentManagerName = 'Rental.Ph Official',
  rentManagerRole = 'Rent Manager',
  bedrooms = 4,
  bathrooms = 2,
  parking: _parking = 2,
  propertySize = '24 sqft',
  location,
}: ModernPropertyCardProps) {
  const router = useRouter()

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('svg')) {
      return
    }
    if (id) {
      router.push(`/property/${id}`)
    }
  }

  return (
    <article
      className="modern-property-card"
      onClick={handleCardClick}
      style={{ cursor: id ? 'pointer' : 'default' }}
    >
      <div className="modern-card-image-wrapper">
        <img
          src={resolvePropertyImage(image, id)}
          alt={title}
          className="modern-card-image"
          onError={(e) => {
            e.currentTarget.src = ASSETS.PLACEHOLDER_PROPERTY_MAIN
          }}
        />
        <div className="modern-card-overlay">
          <button className="modern-card-like-btn" aria-label="Add to favorites">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </button>
        </div>
        <div className="modern-card-type-badge">{propertyType}</div>
      </div>

      <div className="modern-card-content">
        <div className="modern-card-header">
          <div className="modern-card-price-section">
            <span className="modern-card-price">{price}</span>
            <span className="modern-card-date">{date}</span>
          </div>
        </div>

        <h3 className="modern-card-title">
          {title}{location ? `, ${location}` : ''}
        </h3>

        <div className="modern-card-features">
          <div className="modern-feature-item">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 9H21" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>{bedrooms}</span>
          </div>
          <div className="modern-feature-item">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2V6M16 2V6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
              <path d="M3 6H21C22.1046 6 23 6.89543 23 8V20C23 21.1046 22.1046 22 21 22H3C1.89543 22 1 21.1046 1 20V8C1 6.89543 1.89543 6 3 6Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{bathrooms}</span>
          </div>
          <div className="modern-feature-item">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3H21V21H3V3Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{propertySize}</span>
          </div>
        </div>

        <div className="modern-card-footer">
          <div className="modern-rent-manager">
            <img
              src={ASSETS.LOGO_ICON}
              alt="Rentals.ph Official"
              className="modern-manager-avatar"
            />
            <div className="modern-manager-info">
              <p className="modern-manager-name">{rentManagerName}</p>
              <p className="modern-manager-role">{rentManagerRole}</p>
            </div>
          </div>
          <div className="modern-card-actions">
            <button className="modern-action-btn" aria-label="Email">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="#205ED7" strokeWidth="2" />
                <path d="M3 7L12 13L21 7" stroke="#205ED7" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <button className="modern-action-btn" aria-label="Share">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="18" cy="5" r="3" fill="#205ED7" />
                <circle cx="6" cy="12" r="3" fill="#205ED7" />
                <circle cx="18" cy="19" r="3" fill="#205ED7" />
                <path d="M8.59 13.51L15.42 17.49M15.41 6.51L8.59 10.49" stroke="#205ED7" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ModernPropertyCard


