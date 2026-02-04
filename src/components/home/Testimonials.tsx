'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import TestimonialCard from '../common/TestimonialCard'
import { testimonialsApi } from '../../api'
import type { Testimonial } from '../../types'
import { ASSETS, getAsset } from '@/utils/assets'
import './Testimonials.css'

function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const testimonialsPerPage = 3

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await testimonialsApi.getAll()
        setTestimonials(data)
      } catch (error) {
        console.error('Error fetching testimonials:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  // Calculate pagination
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage)
  const startIndex = (currentPage - 1) * testimonialsPerPage
  const endIndex = startIndex + testimonialsPerPage
  const currentTestimonials = testimonials.slice(startIndex, endIndex)

  // Pagination handlers
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
  }

  const handlePageClick = (page: number) => {
    setCurrentPage(page)
  }

  // Helper function to get avatar URL
  const getAvatarUrl = (avatar: string | null): string => {
    if (!avatar) return ASSETS.PLACEHOLDER_TESTIMONIAL_PERSON
    if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
      return avatar
    }
    if (avatar.startsWith('storage/') || avatar.startsWith('/storage/')) {
      return `/api/${avatar.startsWith('/') ? avatar.slice(1) : avatar}`
    }
    return avatar
  }

  return (
    <section className="testimonials-section" id="testimonials">
      {/* Background image with overlay */}
      <div className="testimonials-background"></div>
      <div className="testimonials-overlay"></div>
      
      {/* Main content container */}
      <div className="testimonials-container">
        <div className="testimonials-content">
          {/* Left Section - Promotional Block */}
          <div className="testimonials-left">
            <div className="testimonials-quote-icon-large">
              <div className="testimonials-quote-circle">
                <img 
                  src={ASSETS.ICON_QUOTE_2} 
                  alt="Quote icon" 
                  className="testimonial-quote-icon-svg"
                />
              </div>
            </div>
            <div className="testimonials-text-content">
              <h1 className="testimonials-main-heading">Testimonials</h1>
              <h2 className="testimonials-left-heading">Trusted by the Industry's Best</h2>
              <p className="testimonials-left-text">
                Discover why the most successful property managers in the Philippines rely on Rentals.ph to streamline their operations, verify quality tenants, and maximize their portfolio's reach.
              </p>
              <Link href="/contact" className="testimonials-connect-link">
                Connect Now
              </Link>
            </div>
          </div>

          {/* Right Section - Testimonials Cards */}
          <div className="testimonials-right">
            {loading ? (
              <div className="testimonials-loading">
                <p>Loading testimonials...</p>
              </div>
            ) : testimonials.length > 0 ? (
              <>
                <div className="testimonials-cards-grid">
                  {currentTestimonials.map((testimonial) => (
                    <TestimonialCard
                      key={testimonial.id}
                      avatar={getAvatarUrl(testimonial.avatar)}
                      text={testimonial.content}
                      name={testimonial.name}
                      role={testimonial.role}
                    />
                  ))}
                </div>
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="testimonials-pagination">
                    <button
                      className="testimonials-pagination-button"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    
                    <div className="testimonials-pagination-pages">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          className={`testimonials-pagination-page ${currentPage === page ? 'active' : ''}`}
                          onClick={() => handlePageClick(page)}
                          aria-label={`Go to page ${page}`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      className="testimonials-pagination-button"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="testimonials-empty">
                <p>No testimonials available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials

