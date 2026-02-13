'use client'

import Navbar from '../../components/layout/Navbar'
import Testimonials from '../../components/home/Testimonials'
import Footer from '../../components/layout/Footer'
import Partners from '../../components/home/Partners'
import { ASSETS } from '@/utils/assets'
import './page.css'

export default function AboutPage() {
  return (
    <div className="about-page">
      <Navbar />

      
      {/* Hero Section */}
      <section className="about-hero-section">
        <div className="about-hero-background-wrapper">
          <img
            src={ASSETS.ABOUT_BACKGROUND}
            alt="About Us background"
            className="about-hero-background-image"
          />
          <div className="about-hero-overlay"></div>
        </div>
        <div className="about-hero-container">
          <div className="about-hero-content">
            <h1 className="about-hero-title">About Rentals.ph</h1>
            <p className="about-hero-subtitle">We provide full service at every step.</p>
          </div>
        </div>
        <div className="about-hero-orange-bar"></div>
      </section>

      {/* Main Content Section */}
      <section className="about-main-section">
        <div className="about-main-container">
          <div className="about-main-content">
            <div className="about-main-text">
              <h2 className="about-main-title">OUR STORY</h2>
              
              <p className="about-main-paragraph">
                Established in 2014 under Philippine Real Estate Management Solutions Inc., Rentals.ph was organized with one clear goal: to serve as the vehicle in translating real estate investments into productive assets. Today, we stand as the only rental portal backed by realtors, rent managers, and licensed real estate professionals.
              </p>

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
                        src={ASSETS.ABOUT_RENTPH_CARES} 
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
                        src={ASSETS.ABOUT_TRUSTED_PARTNER} 
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
                        src={ASSETS.ABOUT_TRANSFORMING} 
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
                        src={ASSETS.ABOUT_COMPREHENSIVE} 
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

      

      {/* Social Proof Section */}
      <section className="about-social-proof-section">
        <Testimonials />
        <div className="about-social-proof-container">
          <div className="about-partners-compact">
            <Partners />
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}

