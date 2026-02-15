'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ASSETS } from '@/utils/assets'
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
  location?: string
}

function VerticalPropertyCard({
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
}: VerticalPropertyCardProps) {
  const router = useRouter()
  const [showSharePopup, setShowSharePopup] = useState(false)
  const sharePopupRef = useRef<HTMLDivElement>(null)

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on buttons or links
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('svg')) {
      return
    }
    if (id) {
      router.push(`/property/${id}`)
    }
  }

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sharePopupRef.current && !sharePopupRef.current.contains(event.target as Node)) {
        setShowSharePopup(false)
      }
    }

    if (showSharePopup) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSharePopup])

  const handleShare = (platform: 'facebook' | 'whatsapp' | 'gmail') => {
    const propertyUrl = id ? `${window.location.origin}/property/${id}` : window.location.href
    const shareText = `${title}${location ? `, ${location}` : ''} - ${price}`

    switch (platform) {
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(propertyUrl)}`,
          '_blank'
        )
        break
      case 'whatsapp':
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${shareText} ${propertyUrl}`)}`,
          '_blank'
        )
        break
      case 'gmail':
        window.open(
          `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(propertyUrl)}`,
          '_blank'
        )
        break
    }
    setShowSharePopup(false)
  }

  return (
    <article
      className="vertical-property-card"
      onClick={handleCardClick}
      style={{ cursor: id ? 'pointer' : 'default' }}
    >
      <div className="vertical-property-image-wrapper">
        <img
          src={image}
          alt={title}
          className="vertical-property-image"
          onError={(e) => {
            // Fallback to default image if the provided image fails to load
            e.currentTarget.src = ASSETS.PLACEHOLDER_PROPERTY_MAIN
          }}
        />
          <div className="vertical-property-contact-icons">
            <button className="vertical-property-like" aria-label="Add to favorites">
              <svg viewBox="0 0 24 24" fill="#ef4444" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
            <div className="vertical-property-share-container" ref={sharePopupRef}>
              <button
                className="vertical-property-share-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowSharePopup(!showSharePopup)
                }}
                aria-label="Share property"
              >
                <svg viewBox="0 0 24 24" fill="#205ED7" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <path d="M8.59 13.51L15.42 17.49" stroke="#205ED7" strokeWidth="2" strokeLinecap="round" />
                  <path d="M15.41 6.51L8.59 10.49" stroke="#205ED7" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              {showSharePopup && (
                <div className="vertical-property-share-popup">
                  <button
                    className="share-option"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleShare('facebook')
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                    <span>Facebook</span>
                  </button>
                  <button
                    className="share-option"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleShare('whatsapp')
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="#25D366" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 20.2c-.151.504.335.99.839.839l3.032-.892A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                      <path d="M9.5 8.5c-.15-.35-.3-.36-.45-.36h-.4c-.15 0-.4.05-.6.3-.2.25-.75.75-.75 1.8s.75 2.1.85 2.25c.1.15 1.5 2.3 3.65 3.2.5.2.9.35 1.2.45.5.15.95.15 1.3.1.4-.05 1.25-.5 1.4-1s.15-1 .1-1.05c-.05-.1-.2-.15-.4-.25l-1.2-.6c-.2-.1-.35-.15-.5.15-.15.3-.6.75-.75.9-.15.15-.25.15-.45.05-.2-.1-.85-.3-1.6-1-.6-.55-1-1.2-1.1-1.4-.1-.2 0-.3.1-.4.1-.1.2-.25.3-.35.1-.1.15-.2.2-.3.05-.1.05-.2 0-.3-.05-.1-.5-1.2-.7-1.65z" fill="#FFFFFF" />
                    </svg>
                    <span>WhatsApp</span>
                  </button>
                  <button
                    className="share-option"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleShare('gmail')
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="#EA4335" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <polygon points="2,6 12,13 22,6" fill="#FFFFFF" />
                    </svg>
                    <span>Gmail</span>
                  </button>
                </div>
              )}
            </div>
          </div>
      </div>
      <div className="vertical-property-content">
        <div className="vertical-property-header-row">
          <p className="vertical-property-type">{propertyType}</p>
          <p className="vertical-property-date">{date}</p>
        </div>
        <div className="vertical-property-price-row">
          <p className="vertical-property-price">{price}</p>
        </div>
        <h3 className="vertical-property-title">
          {title}{location ? `, ${location}` : ''}
        </h3>

        <div className="vertical-rent-manager-badge">
          <img
            src={ASSETS.LOGO_ICON}
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
            <svg viewBox="0 0 24 24" fill="#6b7280" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="10" width="18" height="7" rx="2" />
              <rect x="7" y="7" width="4" height="3" rx="1" />
              <rect x="13" y="7" width="4" height="3" rx="1" />
              <path d="M3 17v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" />
            </svg>
            <span className="feature-tooltip">Bedrooms</span>
          </div>
          <span>{bedrooms}</span>
        </div>
        <div className="vertical-property-feature-item" title="Bathrooms">
          <div className="feature-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="#6b7280" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="10" width="18" height="8" rx="2" />
             
              <rect x="5" y="18" width="2" height="2" rx="1" />
              <rect x="17" y="18" width="2" height="2" rx="1" />
              <path d="M3 18h18" />
            </svg>
            <span className="feature-tooltip">Bathrooms</span>
          </div>
          <span>{bathrooms}</span>
        </div>
        <div className="vertical-property-feature-item" title="Property Size">
          <div className="feature-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="#6b7280" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="17" width="20" height="4" rx="1" />
              <rect x="2" y="3" width="20" height="4" rx="1" />
              <rect x="2" y="10" width="20" height="4" rx="1" />
              <rect x="5" y="6" width="2" height="12" rx="1" />
              <rect x="11" y="6" width="2" height="12" rx="1" />
              <rect x="17" y="6" width="2" height="12" rx="1" />
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