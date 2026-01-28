import VerticalPropertyCard from './VerticalPropertyCard'
import './PropertiesForRent.css'

function PropertiesForRent() {
  // Sample properties data matching Figma design
  const properties = [
    {
      id: 1,
      propertyType: 'Condominium',
      date: 'Jan 15, 2026',
      price: '₱35,000/Month',
      title: 'Azure Urban Residences - 2BR Fully Furnished',
      image: '/assets/property-main.png',
      rentManagerName: 'Rental.Ph Official',
      rentManagerRole: 'Rent Manager',
      bedrooms: 2,
      bathrooms: 2,
      parking: 1,
    },
    {
      id: 2,
      propertyType: 'Apartment',
      date: 'Jan 18, 2026',
      price: '₱18,000/Month',
      title: 'Cozy 1BR Apartment Near BGC',
      image: '/assets/property-main.png',
      rentManagerName: 'Rental.Ph Official',
      rentManagerRole: 'Rent Manager',
      bedrooms: 1,
      bathrooms: 1,
      parking: 0,
    },
    {
      id: 3,
      propertyType: 'Condominium',
      date: 'Jan 20, 2026',
      price: '₱52,000/Month',
      title: 'Luxury Penthouse with City View',
      image: '/assets/property-main.png',
      rentManagerName: 'Rental.Ph Official',
      rentManagerRole: 'Rent Manager',
      bedrooms: 3,
      bathrooms: 3,
      parking: 2,
    },
    {
      id: 4,
      propertyType: 'House',
      date: 'Jan 22, 2026',
      price: '₱45,000/Month',
      title: 'Modern 3BR House in Exclusive Village',
      image: '/assets/property-main.png',
      rentManagerName: 'Rental.Ph Official',
      rentManagerRole: 'Rent Manager',
      bedrooms: 3,
      bathrooms: 2,
      parking: 2,
    },
    {
      id: 5,
      propertyType: 'Bed Space',
      date: 'Jan 24, 2026',
      price: '₱6,500/Month',
      title: 'Clean Bed Space for Students/Professionals',
      image: '/assets/property-main.png',
      rentManagerName: 'Rental.Ph Official',
      rentManagerRole: 'Rent Manager',
      bedrooms: 1,
      bathrooms: 1,
      parking: 0,
    },
    {
      id: 6,
      propertyType: 'Commercial Spaces',
      date: 'Jan 25, 2026',
      price: '₱75,000/Month',
      title: 'Prime Commercial Space in Makati CBD',
      image: '/assets/property-main.png',
      rentManagerName: 'Rental.Ph Official',
      rentManagerRole: 'Rent Manager',
      bedrooms: 0,
      bathrooms: 2,
      parking: 3,
    },
  ]

  return (
    <section id="properties-for-rent" className="properties-for-rent-section">
      <div className="properties-for-rent-container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Properties for Rent</h2>
            <p className="section-subtitle">
              Explore our wide selection of rental properties
            </p>
          </div>
        </div>

        <div className="property-cards-grid">
          {properties.map((property) => (
            <VerticalPropertyCard
              key={property.id}
              propertyType={property.propertyType}
              date={property.date}
              price={property.price}
              title={property.title}
              image={property.image}
              rentManagerName={property.rentManagerName}
              rentManagerRole={property.rentManagerRole}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              parking={property.parking}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default PropertiesForRent

