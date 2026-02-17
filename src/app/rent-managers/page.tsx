"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { agentsApi } from '../../api'
import { getApiBaseUrl } from '../../config/api'
import { ASSETS } from '@/utils/assets'
import './page.css'

// Helper function to get agent image URL
const getAgentImageUrl = (imagePath: string | null | undefined): string | null => {
  if (!imagePath) return null
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath
  if (imagePath.startsWith('/storage') || imagePath.startsWith('storage/')) {
    const baseUrl = getApiBaseUrl().replace('/api', '')
    return `${baseUrl}/${imagePath.startsWith('/') ? imagePath.slice(1) : imagePath}`
  }
  const baseUrl = getApiBaseUrl().replace('/api', '')
  return `${baseUrl}/storage/${imagePath}`
}

const getInitials = (name: string) => {
  const parts = name.trim().split(' ')
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  return name.substring(0, 2).toUpperCase()
}

interface RentManagerInfo {
  id: number
  name: string
  role: string
  location: string
  listings: number
  email: string
  phone?: string
  image?: string | null
}

export default function RentManagersPage() {
  const router = useRouter()
  const [managers, setManagers] = useState<RentManagerInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showStickySearch, setShowStickySearch] = useState(false)

  const features = [
    { id: 1, icon: '/assets/icons/secure.svg', alt: 'secure', title: 'Property Management', description: 'Expert handling of property listings, maintenance coordination, and tenant relations' },
    { id: 2, icon: '/assets/icons/support.svg', alt: 'support', title: 'Tenant Screening', description: 'Thorough background checks and verification to ensure reliable tenants' },
    { id: 3, icon: '/assets/icons/listing.svg', alt: 'listing', title: 'Professional Service', description: 'Licensed and verified managers committed to quality service' },
    { id: 4, icon: '/assets/icons/insight.svg', alt: 'insight', title: 'Legal Compliance', description: 'Ensuring all rental agreements meet legal requirements and standards' },
  ]

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        setLoading(true)
        const agents = await agentsApi.getAll()
        if (!mounted) return
        const mapped = agents.map((a) => {
          const name = a.full_name || `${a.first_name || ''} ${a.last_name || ''}`.trim() || a.email
          const location = [a.city, a.state].filter(Boolean).join(', ')
          return {
            id: a.id,
            name,
            role: a.license_type || a.agency_name || 'Rent Manager',
            location: location || 'Unknown',
            listings: a.properties_count || 0,
            email: a.email,
            phone: a.phone || undefined,
            image: a.profile_image || a.image || a.avatar || null,
          } as RentManagerInfo
        })
        setManagers(mapped)
      } catch (err) {
        console.error('Failed to load managers', err)
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    const onScroll = () => {
      if (typeof window === 'undefined') return
      setShowStickySearch(window.scrollY > 220)
    }
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const uniqueLocations = Array.from(new Set(managers.map((m) => m.location))).filter(Boolean)

  const filteredManagers = managers.filter((m) => {
    const q = searchQuery.trim().toLowerCase()
    if (q) {
      const inText = `${m.name} ${m.role} ${m.location} ${m.email}`.toLowerCase()
      if (!inText.includes(q)) return false
    }
    if (selectedProvince && !m.location.toLowerCase().includes(selectedProvince.toLowerCase())) return false
    if (selectedCity && !m.location.toLowerCase().includes(selectedCity.toLowerCase())) return false
    return true
  })

  return (
    <div className="rent-managers-page">
      <Navbar />

      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-left">
            <h2 className="what-are-rm-title">What are Rent Managers?</h2>
            <p className="what-are-rm-text">
              Rent Managers are trusted professionals who help property owners manage  their rental properties and assist tenants in finding their perfect  home. They handle everything from property listings to tenant screening, making the rental process smooth and stress-free for everyone involved.
            </p>
            {/* hero features are rendered below the hero as overlapping cards (see CSS) */}
          </div>
          <div className="hero-right">
            <img className="hero-person-img" src="/assets/images/agents/hero-person.png" alt="Rent Manager" />
          </div>
        </div>
        <div className="hero-features">
          <div className="hero-features-inner">
            {features.map((feature) => (
              <div key={feature.id} className="hf-card">
                <div className="hf-body">
                  <img src={feature.icon} alt={feature.alt} />
                  <div className="hf-title">{feature.title}</div>
                  <div className="hf-desc">{feature.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="managers-main-content">
        <section className="find-rm-section">
          <h2 className="find-rm-title">FIND A RENT MANAGERS</h2>

          <div className="search-filters">
            <div className="search-input-wrapper">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 19L14.65 14.65" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input 
                type="text" 
                placeholder="Search here..." 
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select 
              className="filter-select"
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
            >
              <option value="">Province</option>
              {uniqueLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>

            <select 
              className="filter-select"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">City</option>
              {uniqueLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>

            <div className="view-mode-controls">
              <button
                className="hamburger-menu-btn"
                aria-label="List View"
                onClick={() => setViewMode('list')}
                style={{ backgroundColor: viewMode === 'list' ? '#FE8E0A' : '#ffffff' }}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 12H21M3 6H21M3 18H21" stroke={viewMode === 'list' ? "#ffffff" : "#333"} strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <button
                className="grid-view-btn"
                aria-label="Grid View"
                onClick={() => setViewMode('grid')}
                style={{ backgroundColor: viewMode === 'grid' ? '#FE8E0A' : '#ffffff' }}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="7" height="7" stroke={viewMode === 'grid' ? "#ffffff" : "#333"} strokeWidth="2" fill="none" />
                  <rect x="14" y="3" width="7" height="7" stroke={viewMode === 'grid' ? "#ffffff" : "#333"} strokeWidth="2" fill="none" />
                  <rect x="3" y="14" width="7" height="7" stroke={viewMode === 'grid' ? "#ffffff" : "#333"} strokeWidth="2" fill="none" />
                  <rect x="14" y="14" width="7" height="7" stroke={viewMode === 'grid' ? "#ffffff" : "#333"} strokeWidth="2" fill="none" />
                </svg>
              </button>
            </div>
          </div>

          <div className={`sticky-search-filters-container ${showStickySearch ? 'visible' : ''}`}>
            <div className="sticky-search-filters">
              <Link href="/" className="sticky-logo-link">
                <img src={ASSETS.LOGO_HERO_MAIN} alt="Rentals.ph logo" className="sticky-logo" />
              </Link>
              <div className="search-input-wrapper">
                <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 19L14.65 14.65" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input 
                  type="text" 
                  placeholder="Search here..." 
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select 
                className="filter-select"
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
              >
                <option value="">Province</option>
                {uniqueLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>

              <select 
                className="filter-select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">City</option>
                {uniqueLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>

            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>Loading rent managers...</p>
            </div>
          ) : filteredManagers.length > 0 ? (
            <div className="managers-layout">
              <div className={viewMode === 'grid' ? 'managers-grid' : 'managers-list'}>
                {filteredManagers.map((manager) => (
                  <div
                    key={manager.id}
                    className={`manager-card ${viewMode === 'list' ? 'manager-card-list' : ''}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => router.push(`/rent-managers/${manager.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        router.push(`/rent-managers/${manager.id}`)
                      }
                    }}
                  >
                    <div className="manager-profile-picture-container">
                      <div className="manager-profile-picture">
                        {manager.image ? (
                          <img 
                            src={getAgentImageUrl(manager.image) || ''} 
                            alt={manager.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                              const fallback = target.nextElementSibling as HTMLElement
                              if (fallback) fallback.style.display = 'flex'
                            }}
                          />
                        ) : null}
                        <div 
                          className="manager-profile-picture-fallback"
                          style={{ display: manager.image ? 'none' : 'flex', background: '#205ED7', color: '#fff', fontSize: 48, fontWeight: 700, alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}
                        >
                          <span>{getInitials(manager.name)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="manager-card-content">
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
                            router.push(`/rent-managers/${manager.id}`)
                          }}
                        >
                          {manager.listings} Listings
                        </button>
                      </div>
                      <div className="manager-separator"></div>
                      <div className="manager-card-body">
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
                        {manager.phone && (
                          <div className="manager-contact-row">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3.5 2C2.67 2 2 2.67 2 3.5V12.5C2 13.33 2.67 14 3.5 14H12.5C13.33 14 14 13.33 14 12.5V3.5C14 2.67 13.33 2 12.5 2H3.5ZM3.5 3H12.5C12.78 3 13 3.22 13 3.5V12.5C13 12.78 12.78 13 12.5 13H3.5C3.22 13 3 12.78 3 12.5V3.5C3 3.22 3.22 3 3.5 3Z" stroke="#000" strokeWidth="1.5" fill="none"/>
                              <path d="M6 5H10" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
                              <path d="M6 7H12" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            <span className="contact-text">{manager.phone}</span>
                          </div>
                        )}
                        <div className="view-listing-container">
                          <Link
                            href={`/rent-managers/${manager.id}`}
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
                  </div>
                ))}
              </div>

              <div className="recently-visited-sidebar">
                <h3 className="sidebar-title">Recently Visited Managers</h3>
                {filteredManagers.slice(0, 3).map((manager) => (
                  <div key={manager.id} className="recent-manager-item">
                    <div className="recent-manager-avatar">
                      {manager.image ? (
                        <img 
                          src={getAgentImageUrl(manager.image) || ''} 
                          alt={manager.name}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            const fallback = target.nextElementSibling as HTMLElement
                            if (fallback) fallback.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      <div 
                        className="recent-manager-avatar-fallback"
                        style={{ display: manager.image ? 'none' : 'flex' }}
                      >
                        <span>{getInitials(manager.name)}</span>
                      </div>
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
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>No rent managers found matching your criteria.</p>
            </div>
          )}

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

      <section className="become-rm-section" style={{ background: '#205ED7', position: 'relative', padding: '60px 0' }}>
        <img src="/assets/backgrounds/building-bg.jpg" alt="Buildings" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.18, zIndex: 0 }} />
        <div className="become-rm-container" style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="become-rm-title" style={{ color: '#fff', fontSize: 36, fontWeight: 700, marginBottom: 20 }}>Become a Rental Manager here!</h2>
          <p className="become-rm-text" style={{ color: '#fff', fontSize: 18, marginBottom: 32 }}>
            Join us together with the most trusted managers to help people find their perfect home.
          </p>
          <button className="become-rm-button" style={{ background: '#fff', color: '#205ED7', fontWeight: 600, fontSize: 18, padding: '14px 48px', borderRadius: 8 }}>Join now!</button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
