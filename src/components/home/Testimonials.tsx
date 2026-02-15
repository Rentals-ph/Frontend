'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import TestimonialCard from '../common/TestimonialCard'
import { testimonialsApi } from '../../api'
import type { Testimonial } from '../../types'
import { ASSETS } from '@/utils/assets'
import './Testimonials.css'

function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

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
                <svg className="testimonial-quote-icon-svg" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 7.5V14H7.5C7.5 15.3807 8.61929 16.5 10 16.5V18.5C7.51472 18.5 5.5 16.4853 5.5 14V7.5H11ZM18.5 7.5V14H15C15 15.3807 16.1193 16.5 17.5 16.5V18.5C15.0147 18.5 13 16.4853 13 14V7.5H18.5Z" />
                </svg>
              </div>
            </div>
            <div className="testimonials-text-content">
              <h1 className="testimonials-main-heading">Testimonials</h1>
              <h2 className="testimonials-left-heading">Trusted By The Industry's Best</h2>
              <p className="testimonials-left-text">
                Discover Why The Most Successful Property Managers In The Philippines Rely On Rentals.Ph To Streamline Their Operations, Verify Quality Tenants, And Maximize Their Portfolio's Reach.
              </p>
              <Link href="/contact" className="testimonials-connect-link">
                <span>Connect Now</span>
                <span className="testimonials-connect-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </Link>
            </div>
          </div>

          {/* Right Section - Testimonials Cards (Horizontal Scroll) */}
          <div className="testimonials-right">
            {loading ? (
              <div className="testimonials-loading">
                <p>Loading testimonials...</p>
              </div>
            ) : testimonials.length > 0 ? (
              <div className="testimonials-cards-scroll" ref={scrollRef}>
                {testimonials.map((testimonial) => (
                  <TestimonialCard
                    key={testimonial.id}
                    avatar={getAvatarUrl(testimonial.avatar)}
                    text={testimonial.content}
                    name={testimonial.name}
                    role={testimonial.role}
                  />
                ))}
              </div>
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

