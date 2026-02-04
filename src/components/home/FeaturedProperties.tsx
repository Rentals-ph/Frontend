'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import HorizontalPropertyCard from '../common/VerticalPropertyCard'
import { propertiesApi } from '../../api'
import type { Property } from '../../types'
import type { PaginatedResponse } from '../../api/types'
import { ASSETS } from '@/utils/assets'
import './FeaturedProperties.css'

function FeaturedProperties() {
  const [selectedLocation, setSelectedLocation] = useState('All Locations')
  const propertyCarouselRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([])
  const [browseProperties, setBrowseProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  const locations = [
    'All Locations',
    'Makati City',
    'BGC',
    'Quezon City',
    'Manila',
    'Cebu City',
    'Davao City',
  ]

  // Fetch featured properties
  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const data = await propertiesApi.getFeatured()
        setFeaturedProperties(data)
      } catch (error) {
        console.error('Error fetching featured properties:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProperties()
  }, [])

  // Fetch properties for browse section based on location
  useEffect(() => {
    const fetchBrowseProperties = async () => {
      try {
        const params: { location?: string } = {}
        if (selectedLocation !== 'All Locations') {
          params.location = selectedLocation
        }
        const dataResponse = await propertiesApi.getAll(params)
        // Handle both array response and paginated response
        const data: Property[] = Array.isArray(dataResponse)
          ? dataResponse
          : (dataResponse as PaginatedResponse<Property>).data || []
        setBrowseProperties(data.slice(0, 8)) // Limit to 8 for carousel
      } catch (error) {
        console.error('Error fetching browse properties:', error)
      }
    }

    fetchBrowseProperties()
  }, [selectedLocation])

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

  // Auto-scroll property-carousel with seamless infinite loop
  useEffect(() => {
    const carousel = propertyCarouselRef.current
    if (!carousel) return

    const scrollSpeed = 0.5 // pixels per frame
    let animationFrameId: number | null = null
    let isRunning = true

    const scroll = () => {
      if (!isRunning || !carousel) {
        return
      }

      // Only scroll if not paused
      if (!isPaused) {
        // Get the width of one card (including gap)
        const firstCard = carousel.querySelector('.vertical-property-card') as HTMLElement
        if (firstCard) {
          const cardWidth = firstCard.offsetWidth
          const gap = 28 // gap between cards (matches CSS)
          const itemWidth = cardWidth + gap
          const totalItems = 6 // original items count
          const halfPoint = (itemWidth * totalItems) / 2

          // Check if carousel is scrollable (has overflow)
          const maxScroll = carousel.scrollWidth - carousel.clientWidth
          
          // Only animate if there's content to scroll
          if (maxScroll >= 0) {
            // Increment scroll position
            carousel.scrollLeft += scrollSpeed

            // When we've scrolled past half the original items, reset seamlessly
            if (carousel.scrollLeft >= halfPoint) {
              carousel.scrollLeft = carousel.scrollLeft - halfPoint
            }
          }
        }
      }
      
      // Always continue the animation loop (even when paused)
      animationFrameId = requestAnimationFrame(scroll)
    }

    // Start the animation after a delay to ensure DOM is ready
    // Use a longer delay to ensure all items are rendered
    const timeoutId = setTimeout(() => {
      if (carousel) {
        // Force a reflow to ensure scrollWidth is calculated correctly
        carousel.offsetHeight
        animationFrameId = requestAnimationFrame(scroll)
      }
    }, 500)

    return () => {
      isRunning = false
      clearTimeout(timeoutId)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isPaused])

  return (
    <section id="properties" className="featured-section">
      <div className="featured-container">
        <div className="section-header">
          <div className="section-subheader">
            <h2 className="section-title">Featured Properties</h2>
            <p className="section-subtitle">
              Handpicked properties from our verified agents
            </p>
          </div>

          <Link href="/properties" className="section-link">
            View All Properties <span>→</span>
          </Link>
        </div>
      </div>

      <div className="carousel-wrapper">
        <div 
          className="property-carousel"
          ref={propertyCarouselRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Loading properties...</div>
          ) : featuredProperties.length > 0 ? (
            // Render items multiple times for seamless infinite loop
            Array.from({ length: 4 }).map((_, setIndex) => (
              featuredProperties.slice(0, 6).map((property, index) => {
                const propertySize = property.area 
                  ? `${property.area} sqft` 
                  : `${(property.bedrooms * 15 + property.bathrooms * 5)} sqft`
                
                return (
                  <HorizontalPropertyCard 
                    key={`property-${setIndex}-${property.id}`}
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
              })
            ))
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center' }}>No featured properties available</div>
          )}
        </div>
      </div>

      {/* Browse Properties by Location Section */}
      
    </section>
  )
}

export default FeaturedProperties
