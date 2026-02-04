'use client'

import { useState, useEffect } from 'react'
import VerticalPropertyCard from '../common/VerticalPropertyCard'
import { propertiesApi } from '../../api'
import type { Property } from '../../types'
import type { PaginatedResponse } from '../../api/types'
import { ASSETS } from '@/utils/assets'
import './PropertiesForRent.css'

function PropertiesForRent() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const dataResponse = await propertiesApi.getAll({ per_page: 6 })
        // Handle both array response and paginated response
        const data: Property[] = Array.isArray(dataResponse)
          ? dataResponse
          : (dataResponse as PaginatedResponse<Property>).data || []
        setProperties(data)
      } catch (error) {
        console.error('Error fetching properties:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  // Helper function to format price
  const formatPrice = (price: number): string => {
    return `₱${price.toLocaleString('en-US')}/Month`
  }

  // Helper function to format date
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Date not available'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Helper function to get rent manager role
  const getRentManagerRole = (isOfficial: boolean | undefined): string => {
    return isOfficial ? 'Rent Manager' : 'Property Specialist'
  }

  // Helper function to get image URL
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

  return (
    <section id="properties-for-rent" className="properties-for-rent-section">
      <div className="properties-for-rent-container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Properties for Rent</h2>
            <p className="section-subtitle">
              Explore our wide selection of rental properties
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading properties...</p>
          </div>
        ) : properties.length > 0 ? (
          <div className="property-cards-grid">
            {properties.map((property) => {
              const propertySize = property.area 
                ? `${property.area} sqft` 
                : `${(property.bedrooms * 15 + property.bathrooms * 5)} sqft`
              
              return (
                <VerticalPropertyCard
                  key={property.id}
                  id={property.id}
                  propertyType={property.type}
                  date={formatDate(property.published_at)}
                  price={formatPrice(property.price)}
                  title={property.title}
                  image={getImageUrl(property.image)}
                  rentManagerName={property.rent_manager?.name || 'Rental.Ph Official'}
                  rentManagerRole={getRentManagerRole(property.rent_manager?.is_official)}
                  bedrooms={property.bedrooms}
                  bathrooms={property.bathrooms}
                  parking={0}
                  propertySize={propertySize}
                  location={property.location}
                />
              )
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>No properties available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default PropertiesForRent

