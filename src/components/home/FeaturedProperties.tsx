'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import HorizontalPropertyCard from '../common/VerticalPropertyCard'
import './FeaturedProperties.css'

function FeaturedProperties() {
  const [selectedLocation, setSelectedLocation] = useState('All Locations')
  const propertyCarouselRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  const locations = [
    'All Locations',
    'Makati City',
    'BGC',
    'Quezon City',
    'Manila',
    'Cebu City',
    'Davao City',
  ]

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
          {/* Render items multiple times for seamless infinite loop */}
          {Array.from({ length: 4 }).map((_, setIndex) => (
            Array.from({ length: 6 }).map((_, index) => (
              <HorizontalPropertyCard 
                key={`property-${setIndex}-${index}`} 
                location="Makati City" 
              />
            ))
          ))}
        </div>
      </div>

      {/* Browse Properties by Location Section */}
      <div className="featured-container">
        <div className="browse-properties-section">          
          {/* Location Filter Tabs */}
          <div className="location-filter-tabs">
            {locations.map((location) => (
              <button
                key={location}
                className={`location-tab ${selectedLocation === location ? 'active' : ''}`}
                onClick={() => setSelectedLocation(location)}
              >
                {location}
              </button>
            ))}
          </div>

          {/* Properties Carousel */}
          <div className="browse-carousel-wrapper">
            <button className="carousel-nav-arrow carousel-prev" aria-label="Previous">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="browse-property-carousel">
              {Array.from({ length: 8 }).map((_, index) => (
                <HorizontalPropertyCard 
                  key={`browse-${index}`} 
                  location={selectedLocation === 'All Locations' ? 'Makati City' : selectedLocation}
                />
              ))}
            </div>
            <button className="carousel-nav-arrow carousel-next" aria-label="Next">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* View All Button */}
          <div className="view-all-container">
            <Link href={`/properties${selectedLocation !== 'All Locations' ? `?location=${encodeURIComponent(selectedLocation)}` : ''}`} className="view-all-button">
              View all properties {selectedLocation !== 'All Locations' ? `in ${selectedLocation}` : ''}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProperties
