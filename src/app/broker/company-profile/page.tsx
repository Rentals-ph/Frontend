'use client'

import { useEffect, useState } from 'react'
import AppSidebar from '../../../components/common/AppSidebar'
import {
  FiBell,
  FiPlus,
  FiMail,
  FiPhone,
  FiGlobe,
  FiSend,
  FiStar,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import './page.css'

// Mock data
const companyData = {
  name: 'Skyline Realty',
  tagline: 'Your Gateway to Premium Cebu Rentals.',
  heroImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&h=500&fit=crop',
  stats: [
    { label: 'Total Properties Managed', value: '250+ Listings' },
    { label: 'Years of Experience', value: '12 Years' },
    { label: 'Happy Clients', value: '1k+ Renters' },
  ],
  contact: {
    email: 'info@skylinerealty.ph',
    phone: '+63 917 123 4567',
    whatsapp: '+639171234567',
    website: 'www.skylinerealty.ph',
  },
}

const teamMembers = [
  {
    name: 'Silas Thorne',
    role: 'Broker',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
  },
  {
    name: 'Silas Thorne',
    role: 'Unit Manager',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop&crop=face',
  },
  {
    name: 'Silas Thorne',
    role: 'Agent',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face',
  },
]

const brokerPicks = [
  {
    title: 'Azure Residences',
    subtitle: 'Condo',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
    badge: 'For Sale',
    badgeColor: 'blue',
  },
  {
    title: 'Azure Residences – 2BR Corner...',
    subtitle: 'Condominium Spacious',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
    badge: 'Featured',
    badgeColor: 'gold',
  },
  {
    title: 'Azure Residences – 2BR Corner...',
    subtitle: 'Condo',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
    badge: 'For Sale',
    badgeColor: 'blue',
  },
]

const awards = [
  'https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?w=200&h=200&fit=crop',
]

export default function CompanyProfilePage() {
  const [userName, setUserName] = useState('John Anderson')
  const [formData, setFormData] = useState({ fullname: '', email: '' })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserName(
        localStorage.getItem('agent_name') ||
          localStorage.getItem('user_name') ||
          'John Anderson'
      )
    }
  }, [])

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Inquiry sent!\nName: ${formData.fullname}\nEmail: ${formData.email}`)
    setFormData({ fullname: '', email: '' })
  }

  return (
    <div className="broker-dashboard">
      <AppSidebar />
      <main className="broker-main">
        {/* Header */}
        <header className="broker-header">
          <div className="broker-header-left">
            <h1>Company Profile</h1>
            <p>Create and edit your company profile here.</p>
          </div>
          <div className="broker-header-right">
            <button className="broker-notification-btn">
              <FiBell />
            </button>
            <a href="/broker/create-listing" className="broker-add-listing-btn">
              <FiPlus />
              Add Listing
            </a>
          </div>
        </header>

        <div className="cp-content">
          {/* ===== Hero Section ===== */}
          <div className="cp-hero">
            <img
              className="cp-hero-bg"
              src={companyData.heroImage}
              alt="Company background"
            />
            <div className="cp-hero-overlay" />
            <div className="cp-hero-content">
              <div className="cp-brand">
                <div className="cp-logo-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                  </svg>
                </div>
                <h2 className="cp-company-name">{companyData.name}</h2>
              </div>
              <p className="cp-tagline">{companyData.tagline}</p>

              <div className="cp-connect">
                <span className="cp-connect-label">Connect with us</span>
                <div className="cp-connect-icons">
                  <a href={`mailto:${companyData.contact.email}`} className="cp-connect-icon" title="Email">
                    <FiMail />
                  </a>
                  <a href={`tel:${companyData.contact.phone}`} className="cp-connect-icon" title="Phone">
                    <FiPhone />
                  </a>
                  <a href={`https://wa.me/${companyData.contact.whatsapp}`} className="cp-connect-icon" title="WhatsApp">
                    <FaWhatsapp />
                  </a>
                  <a href={`https://${companyData.contact.website}`} className="cp-connect-icon" title="Website">
                    <FiGlobe />
                  </a>
                </div>
              </div>

              <div className="cp-stats-row">
                {companyData.stats.map((stat, index) => (
                  <div className="cp-stat-card" key={index}>
                    <span className="cp-stat-label">{stat.label}</span>
                    <span className="cp-stat-value">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== Our Team Section ===== */}
          <div className="cp-team-section">
            <h3 className="cp-team-title">Our Team</h3>
            <div className="cp-team-grid">
              {teamMembers.map((member, index) => (
                <div className="cp-team-card" key={index}>
                  <img src={member.image} alt={member.name} />
                  <div className="cp-team-card-overlay" />
                  <div className="cp-team-info">
                    <span className="cp-team-name">{member.name}</span>
                    <span className="cp-team-role">{member.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== Broker's Picks Section ===== */}
          <div className="cp-picks-section">
            <img
              className="cp-picks-bg"
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=600&fit=crop"
              alt="Broker picks background"
            />
            <div className="cp-picks-overlay" />
            <div className="cp-picks-content">
              <div className="cp-picks-header">
                <div className="cp-picks-title-group">
                  <span className="cp-picks-line" />
                  <div>
                    <h3 className="cp-picks-title">
                      Broker&apos;s <span className="cp-picks-line-inline">——</span>
                      <br />
                      <span className="cp-picks-dash">—</span> Picks
                    </h3>
                  </div>
                </div>
                <p className="cp-picks-subtitle">The Crown Jewels: This Week&apos;s Premier Listings</p>
                <p className="cp-picks-desc">
                  From Architectural Marvels To Historic Restorations, These Homes Offer More Than
                  Just A Floor Plan—They Offer A Lifestyle Upgrade.
                </p>
              </div>

              <div className="cp-picks-carousel">
                {brokerPicks.map((pick, index) => (
                  <div className={`cp-pick-card ${index === 1 ? 'cp-pick-featured' : ''}`} key={index}>
                    <img src={pick.image} alt={pick.title} />
                    <div className="cp-pick-badge-wrap">
                      <span className={`cp-pick-badge ${pick.badgeColor}`}>
                        {pick.badgeColor === 'gold' && <FiStar size={10} />}
                        {pick.badge}
                      </span>
                    </div>
                    <div className="cp-pick-info">
                      <span className="cp-pick-title">{pick.title}</span>
                      {pick.subtitle && <span className="cp-pick-subtitle">{pick.subtitle}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== Company Awards Section ===== */}
          <div className="cp-awards-section">
            <h3 className="cp-awards-title">Company Awards</h3>
            <div className="cp-awards-grid">
              {[1, 2, 3].map((_, index) => (
                <div className="cp-award-card" key={index}>
                  <div className="cp-award-badge">
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                      <circle cx="40" cy="40" r="38" stroke="#c8a84e" strokeWidth="3" />
                      <circle cx="40" cy="35" r="20" fill="none" stroke="#c8a84e" strokeWidth="2" />
                      <path d="M25 35 C25 25, 55 25, 55 35 C55 50, 40 55, 40 55 C40 55, 25 50, 25 35Z" fill="none" stroke="#c8a84e" strokeWidth="1.5" />
                      <circle cx="33" cy="32" r="3" fill="#c8a84e" opacity="0.6" />
                      <circle cx="47" cy="32" r="3" fill="#c8a84e" opacity="0.6" />
                      <circle cx="40" cy="38" r="3" fill="#c8a84e" opacity="0.6" />
                      <path d="M30 55 L35 70 L40 62 L45 70 L50 55" fill="none" stroke="#c8a84e" strokeWidth="2" />
                    </svg>
                  </div>
                  <div className="cp-award-text">
                    <span className="cp-award-name">GLOBEE</span>
                    <span className="cp-award-label">AWARDS<sup>®</sup></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== Join / Contact Section ===== */}
          <div className="cp-join-section">
            <div className="cp-join-left">
              <h3 className="cp-join-title">
                Join the Future of {companyData.name}!
              </h3>
              <p className="cp-join-desc">
                We aren&apos;t just listing properties; we&apos;re building brands. Join a team of elite real estate
                professionals and leverage our high-performance lead-generation engine to scale your career.
                Submit your credentials below to start your journey with us.
              </p>
            </div>
            <div className="cp-join-right">
              <form className="cp-contact-form" onSubmit={handleInquiry}>
                <h4 className="cp-form-title">Send us a message</h4>
                <div className="cp-form-group">
                  <label className="cp-form-label">Fullname</label>
                  <input
                    type="text"
                    className="cp-form-input"
                    value={formData.fullname}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullname: e.target.value }))}
                    required
                  />
                </div>
                <div className="cp-form-group">
                  <label className="cp-form-label">Email</label>
                  <input
                    type="email"
                    className="cp-form-input"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <button type="submit" className="cp-form-submit">
                  <FiSend />
                  Inquire now
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
