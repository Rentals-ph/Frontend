'use client'

import AppSidebar from '../../../components/common/AppSidebar'
import AgentHeader from '../../../components/agent/AgentHeader'
import {
  FiCheckCircle,
  FiEye,
  FiHome,
  FiMapPin,
  FiSearch,
  FiSlash
} from 'react-icons/fi'
import '../../../pages-old/agent/AgentMyListings.css'

type ListingStatus = 'active' | 'rented' | 'hidden'

interface ListingCard {
  id: number
  title: string
  address: string
  rating: number
  views: number
  image: string
  status: ListingStatus
}

export default function AgentMyListings() {
  const listings: ListingCard[] = [
    {
      id: 1,
      title: 'Azure Residences - 2BR Corner Suite',
      address: 'Somewhere On Earth Street, Anywhere City',
      rating: 4,
      views: 23,
      image: '/assets/property-main.png',
      status: 'active'
    },
    {
      id: 2,
      title: 'Azure Residences - 2BR Corner Suite',
      address: 'Somewhere On Earth Street, Anywhere City',
      rating: 4,
      views: 23,
      image: '/assets/property-main-new.png',
      status: 'active'
    },
    {
      id: 3,
      title: 'Azure Residences - 2BR Corner Suite',
      address: 'Somewhere On Earth Street, Anywhere City',
      rating: 4,
      views: 23,
      image: '/assets/property-main.png',
      status: 'rented'
    },
    {
      id: 4,
      title: 'Azure Residences - 2BR Corner Suite',
      address: 'Somewhere On Earth Street, Anywhere City',
      rating: 4,
      views: 23,
      image: '/assets/property-main-new.png',
      status: 'hidden'
    }
  ]

  const renderStars = (rating: number) => {
    return (
      <div className="aml-rating">
        {Array.from({ length: 5 }).map((_, idx) => {
          const starNumber = idx + 1
          return (
            <span
              key={starNumber}
              className={`aml-star ${starNumber <= rating ? 'filled' : ''}`}
              aria-hidden="true"
            >
              ★
            </span>
          )
        })}
      </div>
    )
  }

  return (
    <div className="agent-my-listings agent-dashboard">
      <AppSidebar/>

      <main className="agent-main">
        <AgentHeader 
          title="My Listings" 
          subtitle="Manage and track all your property listings." 
        />

        <div className="aml-page">
          <h2 className="aml-title">My Listings</h2>

          <div className="aml-stats">
            <div className="metric-card orange">
              <div className="metric-icon">
                <FiHome />
              </div>
              <div className="metric-content">
                <div className="aml-stat-top">
                  <h3>Total Properties</h3>
                  <span className="aml-stat-delta positive">+12 this month</span>
                </div>
                <p className="metric-value">24</p>
              </div>
            </div>

            <div className="metric-card blue">
              <div className="metric-icon">
                <FiCheckCircle />
              </div>
              <div className="metric-content">
                <div className="aml-stat-top">
                  <h3>Total Active</h3>
                  <span className="aml-stat-delta positive">+7 this week</span>
                </div>
                <p className="metric-value">18</p>
              </div>
            </div>

            <div className="metric-card green">
              <div className="metric-icon">
                <FiCheckCircle />
              </div>
              <div className="metric-content">
                <div className="aml-stat-top">
                  <h3>Total Rented</h3>
                  <span className="aml-stat-delta muted">+11 this month</span>
                </div>
                <p className="metric-value">18</p>
              </div>
            </div>

            <div className="metric-card red">
              <div className="metric-icon">
                <FiSlash />
              </div>
              <div className="metric-content">
                <div className="aml-stat-top">
                  <h3>Total Hide</h3>
                  <span className="aml-stat-delta muted">&nbsp;</span>
                </div>
                <p className="metric-value">3</p>
              </div>
            </div>
          </div>

          <div className="aml-search-map">
            <div className="aml-search-row">
              <div className="aml-search">
                <FiSearch className="aml-search-icon" />
                <input className="aml-search-input" placeholder="Search Location..." />
              </div>
              <button className="aml-find-btn" type="button">
                <FiSearch />
                <span>Find</span>
              </button>
            </div>

            <div className="aml-map">
              <iframe
                title="Map"
                className="aml-map-iframe"
                src="https://www.openstreetmap.org/export/embed.html?bbox=123.85%2C10.26%2C123.93%2C10.33&layer=mapnik"
              />
            </div>
          </div>

          <div className="aml-filters">
            <label className="aml-filter">
              <input type="checkbox" />
              <span>All(23)</span>
            </label>
            <button type="button" className="aml-filter-pill">
              Condominium(4)
            </button>
            <button type="button" className="aml-filter-pill">
              Bed Space(8)
            </button>
            <button type="button" className="aml-filter-pill">
              Apartment(12)
            </button>
          </div>

          <div className="aml-grid">
            {listings.map((l) => (
              <div key={l.id} className="aml-card">
                <div className="aml-card-media">
                  <img
                    src={l.image}
                    alt={l.title}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                  <div className="aml-pin" title="Pinned">
                    <FiMapPin />
                  </div>
                  <button className="aml-edit-btn" type="button">
                    Edit
                  </button>
                </div>

                <div className="aml-card-body">
                  <div className="aml-card-title">{l.title}</div>
                  <div className="aml-card-address">
                    <FiMapPin className="aml-address-icon" />
                    <span>{l.address}</span>
                  </div>

                  <div className="aml-card-meta">
                    {renderStars(l.rating)}
                    <div className="aml-views">
                      <FiEye />
                      <span>Viewed({l.views})</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

