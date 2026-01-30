import Navbar from '../components/layout/Navbar'
import Testimonials from '../components/home/Testimonials'
import Footer from '../components/layout/Footer'
import Partners from '../components/home/Partners'
import './AboutPage.css'

function AboutPage() {
  return (
    <div className="about-page">
      <Navbar />
      
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

      {/* Main Content - 4 Cards Grid with Images */}
      <section className="about-cards-section">
        <div className="about-cards-container">
          <div className="about-cards-grid">
            {/* Card 1 - Rent.ph Cares */}
            
            <div className="about-card">
                <img 
                  src="/assets/pin-orange.svg" 
                  alt="Pinned Icon" 
                  className="pinned-icon-image"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              <div className="about-card-icon-wrapper">
                
                <img 
                  src="/assets/rentph-cares.png" 
                  alt="Rent.ph Cares - Your Rental, Their Hope" 
                  className="about-card-icon-image"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              </div>
              <h3 className="about-card-title">Rent.ph Cares Your Rental, Their Hope</h3>
              <p className="about-card-text">
                Our tagline, 'Your Rentals, Their Hope,' reflects this commitment. It's a reminder that the simple act of renting a home can inspire meaningful, lasting change for those in need. With Rent.ph Cares, every successful rental transaction becomes an opportunity to give back. Whether it's supporting local families, empowering education, or funding community programs, your trust in us fuels hope and transforms lives.
              </p>
            </div>

            {/* Card 2 - Trusted Partner */}
            <div className="about-card">
              <img 
                  src="/assets/pin-orange.svg" 
                  alt="Pinned Icon" 
                  className="pinned-icon-image"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              <div className="about-card-icon-wrapper">
                <img 
                  src="/assets/your-trusted-rental-partner.png" 
                  alt="Your Trusted Rental Partner" 
                  className="about-card-icon-image"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              </div>
              <h3 className="about-card-title">Your Trusted Rental Partner</h3>
              <p className="about-card-text">
                To date, Rentals.ph is the only rental portal backed by realtors, rent managers and licensed real estate professionals to help property owners and assist clients personally making us the most trusted brand in rental marketing and servicing.
              </p>
            </div>

            {/* Card 3 - Transforming Investment */}
            <div className="about-card">
              <img 
                  src="/assets/pin-orange.svg" 
                  alt="Pinned Icon" 
                  className="pinned-icon-image"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              <div className="about-card-icon-wrapper">
                <img 
                  src="/assets/transforming-real-estate.png" 
                  alt="Transforming Real Estate Investment" 
                  className="about-card-icon-image"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              </div>
              <h3 className="about-card-title">Transforming Real Estate Investment Into Productive Assets</h3>
              <p className="about-card-text">
                Established in 2014, under Philippine Real Estate Management Solutions Inc., Rentals.ph was organized with one goal in mind - to serve as the vehicle in translating real estate investments into productive assets.
              </p>
            </div>

            {/* Card 4 - Comprehensive Solution */}
            <div className="about-card">
              <img 
                  src="/assets/pin-orange.svg" 
                  alt="Pinned Icon" 
                  className="pinned-icon-image"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              <div className="about-card-icon-wrapper">
                <img 
                  src="/assets/comprehensive-rental-solution.png" 
                  alt="Comprehensive Rental Solution Nationwide" 
                  className="about-card-icon-image"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              </div>
              <h3 className="about-card-title">Your Comprehensive Rental Solution Nationwide</h3>
              <p className="about-card-text">
                Together with its sister brand Filipino Homes, Rentals.ph has serviced owners and companies in marketing their lands, apartments, houses, condominiums, warehouses and commercial spaces across the country through our network of rent professionals in key cities and provinces in the Philippines.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      
      
        <Testimonials />
     
      
     
        <Partners />
        <p className="partners-subtitle-wrapper">Building Dreams, Together</p>
        
        {/* Partners Description */}
        <div className="partners-description-container">
          <p className="partners-description">
            We are proud to collaborate with industry-leading organizations and trusted partners who share our commitment to excellence in real estate and rental services. Our strategic partnerships enable us to deliver comprehensive solutions, innovative services, and exceptional value to property owners and tenants across the Philippines. Together, we build stronger communities and create lasting relationships that drive success in the rental market.
          </p>
        </div>
      
      
      <Footer />
    </div>
  )
}

export default AboutPage