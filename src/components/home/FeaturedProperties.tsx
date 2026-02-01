import Link from 'next/link'
import HorizontalPropertyCard from '../common/VerticalPropertyCard'
import ModernPropertyCard from '../common/ModernPropertyCard'
import './FeaturedProperties.css'

function FeaturedProperties() {
  const propertyCategories = [
    { name: 'Condominium', href: '/properties?type=Condominium' },
    { name: 'Apartment', href: '/properties?type=Apartment' },
    { name: 'House & Lot', href: '/properties?type=House%20%26%20Lot' },
    { name: 'Commercial Spaces', href: '/properties?type=Commercial%20Spaces' },
    { name: 'Office Spaces', href: '/properties?type=Office%20Spaces' },
    { name: 'Bed Space', href: '/properties?type=Bed%20Space' },
  ]

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
        <div className="property-carousel">
          {Array.from({ length: 6 }).map((_, index) => (
            <HorizontalPropertyCard key={index} location="Makati City" />
          ))}
        </div>
      </div>

      {/* Modern Property Cards Grid Section */}
      <div className="featured-container">
        <div className="modern-properties-section">
          <h3 className="modern-section-title">Explore More Properties</h3>
          <div className="modern-properties-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <ModernPropertyCard 
                key={`modern-${index}`} 
                location="Makati City"
                propertyType={index % 2 === 0 ? 'Condominium' : 'Apartment'}
              />
            ))}
          </div>
        </div>

        {/* Property Categories Section */}
        <div className="property-categories-section">
          <h3 className="categories-title">Browse by Property Type</h3>
          <div className="property-categories-grid">
            {propertyCategories.map((category, index) => (
              <Link
                key={index}
                href={category.href}
                className="property-category-link"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProperties
