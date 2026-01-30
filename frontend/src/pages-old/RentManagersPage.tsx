import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import PageHeader from '../components/layout/PageHeader'
import { rentManagers } from '../data/rentManagers'
import './RentManagersPage.css'

function RentManagersPage() {
  const navigate = useNavigate()
  const managers = rentManagers.map(m => ({
    id: m.id,
    name: m.name,
    role: m.role,
    location: m.location,
    listings: m.listingsCount,
    email: m.email,
    phone: m.phone,
  }))

  const recentlyVisited = [
    {
      id: 1,
      name: 'Miguel Abella',
      role: 'Rent Manager Pro',
      email: 'maria.santos@rental.ph',
    },
    {
      id: 2,
      name: 'Miguel Abella',
      role: 'Rent Manager Pro',
      email: 'maria.santos@rental.ph',
    },
    {
      id: 3,
      name: 'Miguel Abella',
      role: 'Rent Manager Pro',
      email: 'maria.santos@rental.ph',
    },
  ]

  const features = [
    {
      id: 1,
      title: 'Property Management',
      description: 'Expert handling of property listings, maintenance coordination, and tenant relations.',
      icon: '🏠',
    },
    {
      id: 2,
      title: 'Tenant Screening',
      description: 'Thorough background checks and verification to ensure reliable tenants.',
      icon: '🔍',
    },
    {
      id: 3,
      title: 'Professional Service',
      description: 'Licensed and verified managers committed to quality service.',
      icon: '💼',
    },
    {
      id: 4,
      title: 'Legal Compliance',
      description: 'Ensuring all rental agreements meet legal requirements and standards.',
      icon: '📄',
    },
  ]

  return (
    <div className="rent-managers-page">
      <Navbar />

      {/* Page Header */}
      <PageHeader title="RENT MANAGERS" />

      {/* Breadcrumb */}
      

      {/* Main Content */}
      <main className="managers-main-content">
        {/* What are Rent Managers Section */}
        <section className="what-are-rm-section">
          <h2 className="what-are-rm-title">What are Rent Managers?</h2>
          <p className="what-are-rm-text">
            Rent Managers are trusted professionals who help property owners manage their rental properties and assist tenants in finding their perfect home. They handle everything from property listings to tenant screening, making the rental process smooth and stress-free for everyone involved.
          </p>
          
          <div className="features-grid">
            {features.map((feature) => (
              <div key={feature.id} className="feature-card">
                <div className="feature-pin-icon">📍</div>
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Find a Rent Managers Section */}
        <section className="find-rm-section">
          <h2 className="find-rm-title">FIND A RENT MANAGERS</h2>
          
          {/* Search Filters */}
          <div className="search-filters">
            <div className="search-input-wrapper">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 19L14.65 14.65" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input type="text" placeholder="Search here..." className="search-input" />
            </div>
            <select className="filter-select">
              <option>Province</option>
            </select>
            <select className="filter-select">
              <option>City</option>
            </select>
          </div>

          {/* Managers Grid with Sidebar */}
          <div className="managers-layout">
            <div className="managers-grid">
              {managers.map((manager) => (
                <div
                  key={manager.id}
                  className="manager-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/rent-managers/${manager.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      navigate(`/rent-managers/${manager.id}`)
                    }
                  }}
                >
                  {/* Profile Picture at Top */}
                  <div className="manager-profile-picture-container">
                    <div className="manager-profile-picture">
                      <svg width="100%" height="100%" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="400" height="300" fill="#f0f0f0"/>
                        <circle cx="200" cy="120" r="50" fill="#205ED7"/>
                        <circle cx="200" cy="100" r="20" fill="white"/>
                        <path d="M150 200C150 180 170 160 200 160C230 160 250 180 250 200V220H150V200Z" fill="white"/>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Name, Role, and Listings Button */}
                  <div className="manager-card-header">
                    <div className="manager-header-info">
                      <h3 className="manager-name">{manager.name}</h3>
                      <p className="manager-role">{manager.role}</p>
                    </div>
                    <button
                      className="listings-button"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/rent-managers/${manager.id}`)
                      }}
                    >
                      {manager.listings} Listings
                    </button>
                  </div>
                  
                  {/* Separator */}
                  <div className="manager-separator"></div>
                  
                  {/* Contact Information */}
                  <div className="manager-card-body">
                    <div className="manager-contact-row">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.5 2C2.67 2 2 2.67 2 3.5V12.5C2 13.33 2.67 14 3.5 14H12.5C13.33 14 14 13.33 14 12.5V3.5C14 2.67 13.33 2 12.5 2H3.5ZM3.5 3H12.5C12.78 3 13 3.22 13 3.5V12.5C13 12.78 12.78 13 12.5 13H3.5C3.22 13 3 12.78 3 12.5V3.5C3 3.22 3.22 3 3.5 3Z" stroke="#000" strokeWidth="1.5" fill="none"/>
                        <path d="M6 5H10" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M6 7H12" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      <span className="contact-text">{manager.phone}</span>
                      <svg className="whatsapp-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="#25D366"/>
                      </svg>
                    </div>
                    <div className="manager-contact-row">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 3C2 2.45 2.45 2 3 2H13C13.55 2 14 2.45 14 3V13C14 13.55 13.55 14 13 14H3C2.45 14 2 13.55 2 13V3ZM3 3V13H13V3H3Z" stroke="#000" strokeWidth="1.5" fill="none"/>
                        <path d="M3 4L8 8L13 4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="contact-text">{manager.email}</span>
                    </div>
                    <div className="manager-contact-row">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 1C5.13 1 2 4.13 2 8C2 11.87 5.13 15 9 15C12.87 15 16 11.87 16 8C16 4.13 12.87 1 9 1ZM9 13C6.24 13 4 10.76 4 8C4 5.24 6.24 3 9 3C11.76 3 14 5.24 14 8C14 10.76 11.76 13 9 13Z" stroke="#000" strokeWidth="1.5" fill="none"/>
                        <path d="M9 4C7.34 4 6 5.34 6 7C6 8.66 7.34 10 9 10C10.66 10 12 8.66 12 7C12 5.34 10.66 4 9 4Z" stroke="#000" strokeWidth="1.5" fill="none"/>
                      </svg>
                      <span className="contact-text">{manager.location}</span>
                    </div>
                    <div className="view-listing-container">
                      <Link
                        to={`/rent-managers/${manager.id}`}
                        className="view-listing-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View My Listing
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 12L10 8L6 4" stroke="#205ED7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recently Visited Managers Sidebar */}
            <div className="recently-visited-sidebar">
              <h3 className="sidebar-title">Recently Visited Managers</h3>
              {recentlyVisited.map((manager) => (
                <div key={manager.id} className="recent-manager-item">
                  <div className="recent-manager-avatar">
                    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="25" cy="25" r="25" fill="#205ED7"/>
                      <circle cx="25" cy="20" r="8" fill="white"/>
                      <path d="M12 35C12 30 18 25 25 25C32 25 38 30 38 35V40H12V35Z" fill="white"/>
                    </svg>
                  </div>
                  <div className="recent-manager-info">
                    <h4 className="recent-manager-name">{manager.name}</h4>
                    <p className="recent-manager-role">{manager.role}</p>
                    <p className="recent-manager-email">{manager.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button className="pagination-arrow">←</button>
            <button className="pagination-number active">1</button>
            <button className="pagination-number">2</button>
            <button className="pagination-number">3</button>
            <span className="pagination-ellipsis">...</span>
            <button className="pagination-number">50</button>
            <button className="pagination-arrow">→</button>
          </div>
        </section>

      </main>

      {/* Become a Rental Manager CTA Section */}
      <section className="become-rm-section">
        <div className="become-rm-container">
          <h2 className="become-rm-title">Become a Rental Manager here!</h2>
          <p className="become-rm-text">
            Join us together with the most trusted managers to help people find their perfect home.
          </p>
          <button className="become-rm-button">Join now!</button>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default RentManagersPage
