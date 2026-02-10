'use client'

import { useRouter } from 'next/navigation'
import { ASSETS } from '@/utils/assets'
import './SimplePropertyCard.css'

interface SimplePropertyCardProps {
  id?: number | string
  title?: string
  location?: string
  price?: string
  image?: string
}

function SimplePropertyCard({
  id,
  title = 'Property Title',
  location,
  price = '₱0',
  image = ASSETS.PLACEHOLDER_PROPERTY_MAIN,
}: SimplePropertyCardProps) {
  const router = useRouter()

  const handleCardClick = () => {
    if (id) {
      router.push(`/property/${id}`)
    }
  }

  return (
    <div className="simple-property-card" onClick={handleCardClick}>
      <div className="simple-property-image-wrapper">
        <img 
          src={image} 
          alt={title}
          className="simple-property-image"
        />
        <div className="simple-property-overlay">
          <div className="simple-property-content">
            <h3 className="simple-property-title">{title}</h3>
            {location && (
              <p className="simple-property-location">{location}</p>
            )}
            <p className="simple-property-price">{price}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimplePropertyCard

