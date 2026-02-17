'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import HorizontalPropertyCard from '../common/VerticalPropertyCard'
import { propertiesApi } from '../../api'
import type { Property } from '../../types'
import type { PaginatedResponse } from '../../api/types'
import { ASSETS } from '@/utils/assets'

const FeaturedProperties = () => {
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
    <section id="properties" className="bg-gradient-to-b from-[#e8f0ff] to-white border-t-0 overflow-hidden relative min-h-[60vh] flex px-6 md:px-10 lg:px-[150px] flex-col justify-center py-12 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-gray-200 before:to-transparent after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-gray-200 after:to-transparent">
      <div className="w-full">
        <div className="flex justify-between items-end mb-4 relative">
          <div>
            <h2 className="font-outfit text-3xl font-bold text-gray-900 m-0 leading-tight tracking-tight">
              Featured Properties
            </h2>
            <p className="text-gray-600 font-outfit text-base font-light mt-2">
              Handpicked properties from our verified agents
            </p>
          </div>

          <Link href="/properties" className="text-rental-blue-600 font-outfit text-base font-medium no-underline flex items-center gap-2 hover:text-rental-orange-500 transition-colors">
            View All Properties <span>→</span>
          </Link>
        </div>
      </div>

      <div className="relative w-full overflow-hidden mt-6">
        <div 
          className="flex gap-7 overflow-x-auto scrollbar-hide scroll-smooth"
          ref={propertyCarouselRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {loading ? (
            <div className="p-8 text-center w-full">Loading properties...</div>
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
                    image={property.image_url || property.image || ASSETS.PLACEHOLDER_PROPERTY_MAIN}
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
            <div className="p-8 text-center w-full">No featured properties available</div>
          )}
        </div>
      </div>

      {/* Browse Properties by Location Section */}
      
    </section>
  )
}

export default FeaturedProperties
