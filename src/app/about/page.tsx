'use client'

import Navbar from '../../components/layout/Navbar'
import Testimonials from '../../components/home/Testimonials'
import Footer from '../../components/layout/Footer'
import Partners from '../../components/home/Partners'
import './page.css'
import PageHeader from '../../components/layout/PageHeader'

export default function AboutPage() {
  return (
    <div className="about-page">
      <Navbar />
      <PageHeader title="ABOUT US" />
      {/* Page Header */}
      
      {/* Hero Section with Background Image */}
      <section className="about-hero-section">
        <div className="about-hero-container">
          <img
            src="/assets/tropical-travel-real-estate.png"
            alt="About Us background"
            className="about-hero-background"
            onError={(e) => {
              // Fallback to SVG if PNG doesn't load
              e.currentTarget.src = '/assets/aboutusbackgroundphoto.svg'
            }}
          />
          {/* Orange bar below background */}
          <div className="about-hero-orange-bar"></div>
          <div className="about-hero-content">
            <h1 className="about-hero-title text-center">About Rentals.ph</h1>
            <p className="about-hero-subtitle">We provide full service at every step.</p>
          </div>
        </div>
      </section>

      {/* Section 1: Our Story & Platform Introduction */}
      <section className="about-main-section">
        <div className="about-main-container">
          <div className="about-main-content">
            {/* Left - Image */}
            <div className="about-main-image-wrapper">
              <img
                src="/assets/tropical-travel-real-estate.png"
                alt="Rentals.ph Platform"
                className="about-main-image"
                onError={(e) => {
                  e.currentTarget.src = '/assets/aboutusbackgroundphoto.svg'
                }}
              />
            </div>
            
            {/* Right - Comprehensive Content */}
            <div className="about-main-text">
              <h2 className="about-main-title">OUR STORY</h2>
              
              <div className="about-main-intro">
                <p className="about-main-paragraph">
                  Established in 2014 under Philippine Real Estate Management Solutions Inc., Rentals.ph was organized with one clear goal: to serve as the vehicle in translating real estate investments into productive assets. What started as a vision to revolutionize the rental market has grown into the Philippines' most trusted rental platform.
                </p>
                <p className="about-main-paragraph">
                  Today, Rentals.ph stands as the only rental portal backed by realtors, rent managers, and licensed real estate professionals. We don't just list properties—we provide comprehensive support to property owners and personalized assistance to clients, making us the most trusted brand in rental marketing and servicing.
                </p>
              </div>

              <div className="about-main-grid">
                <div className="about-main-item">
                  <h3 className="about-main-item-title">OUR MISSION</h3>
                  <p className="about-main-item-text">
                    To transform real estate investments into productive assets while providing exceptional service to property owners and tenants across the Philippines.
                  </p>
                </div>
                <div className="about-main-item">
                  <h3 className="about-main-item-title">OUR VISION</h3>
                  <p className="about-main-item-text">
                    To be the leading rental platform that connects property owners with quality tenants through innovative technology and trusted professional networks.
                  </p>
                </div>
              </div>

              <div className="about-main-services">
                <h3 className="about-main-services-title">WHAT WE OFFER</h3>
                <div className="about-main-services-grid">
                  <div className="about-main-service-item">
                    <div className="about-main-service-icon">
                      <img 
                        src="/assets/rentph-cares.png" 
                        alt="Rent.ph Cares" 
                        className="about-main-service-icon-img"
                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                      />
                    </div>
                    <h4 className="about-main-service-name">Rent.ph Cares</h4>
                    <p className="about-main-service-desc">Your Rentals, Their Hope—every transaction becomes an opportunity to give back to communities in need.</p>
                  </div>
                  <div className="about-main-service-item">
                    <div className="about-main-service-icon">
                      <img 
                        src="/assets/your-trusted-rental-partner.png" 
                        alt="Trusted Partner" 
                        className="about-main-service-icon-img"
                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                      />
                    </div>
                    <h4 className="about-main-service-name">Trusted Partner</h4>
                    <p className="about-main-service-desc">Backed by certified real estate professionals ensuring expertise, integrity, and personalized service.</p>
                  </div>
                  <div className="about-main-service-item">
                    <div className="about-main-service-icon">
                      <img 
                        src="/assets/transforming-real-estate.png" 
                        alt="Transforming Investment" 
                        className="about-main-service-icon-img"
                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                      />
                    </div>
                    <h4 className="about-main-service-name">Productive Assets</h4>
                    <p className="about-main-service-desc">Transforming real estate investments into productive assets through comprehensive rental solutions.</p>
                  </div>
                  <div className="about-main-service-item">
                    <div className="about-main-service-icon">
                      <img 
                        src="/assets/comprehensive-rental-solution.png" 
                        alt="Nationwide Solution" 
                        className="about-main-service-icon-img"
                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                      />
                    </div>
                    <h4 className="about-main-service-name">Nationwide Coverage</h4>
                    <p className="about-main-service-desc">Comprehensive rental solutions across the Philippines through our network of rent professionals.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Recognition & Impact */}
      <section className="about-recognition-section">
        <div className="about-recognition-container">
          <h2 className="about-recognition-title">RECOGNITION & IMPACT</h2>
          <p className="about-recognition-subtitle">
            Our commitment to excellence has earned the trust of thousands across the Philippines
          </p>
          
          <div className="about-recognition-content">
            <div className="about-recognition-text">
              <p className="about-recognition-paragraph">
                Rentals.ph has established itself as the premier rental platform in the country, recognized for our industry-leading approach to real estate rental services. We take pride in being the only rental portal backed by certified real estate professionals, ensuring that every transaction is handled with expertise, integrity, and care.
              </p>
              <p className="about-recognition-paragraph">
                Together with our sister brand Filipino Homes, we have successfully serviced owners and companies in marketing their properties—from lands and apartments to houses, condominiums, warehouses, and commercial spaces—creating lasting value for all stakeholders across key cities and provinces nationwide.
              </p>
            </div>
            <div className="about-recognition-stats">
              <div className="about-recognition-stat">
                <div className="about-recognition-stat-number">2014</div>
                <div className="about-recognition-stat-label">Established</div>
              </div>
              <div className="about-recognition-stat">
                <div className="about-recognition-stat-number">#1</div>
                <div className="about-recognition-stat-label">Trusted Platform</div>
              </div>
              <div className="about-recognition-stat">
                <div className="about-recognition-stat-number">Nationwide</div>
                <div className="about-recognition-stat-label">Coverage</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Social Proof - Testimonials & Partners */}
      <section className="about-social-proof-section">
        <div className="about-social-proof-container">
          <Testimonials />
          
          <div className="about-partners-compact">
            <Partners />
            <div className="partners-subtitle-container">
              <p className="partners-subtitle-text">Building Dreams, Together</p>
            </div>
            <div className="partners-description-container">
              <p className="partners-description">
                We collaborate with industry-leading organizations and trusted partners who share our commitment to excellence in real estate and rental services, delivering comprehensive solutions and exceptional value across the Philippines.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}

