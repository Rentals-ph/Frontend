'use client'

import './HeroBanner.css'

function HeroBanner() {
  return (
    <div className="hero-banner">
      {/* Left Section - Blue Panel */}
      <div className="hero-banner-left">
        <div className="hero-banner-left-content">
          <h3 className="hero-banner-left-text">Rent a property</h3>
          <svg 
            className="hero-banner-arrow" 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M5 12H19M19 12L12 5M19 12L12 19" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Right Section - Orange Panel */}
      <div className="hero-banner-right">
        <div className="hero-banner-right-content">
          <h3 className="hero-banner-right-heading">Find a property agent</h3>
          <svg 
            className="hero-banner-arrow-right" 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M5 12H19M19 12L12 5M19 12L12 19" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default HeroBanner

