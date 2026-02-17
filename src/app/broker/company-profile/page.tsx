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
// import './page.css' // Removed - converted to Tailwind

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
    <div className="flex min-h-screen bg-gray-100 font-outfit"> {/* broker-dashboard */}
      <AppSidebar />
      <main className="ml-[280px] flex-1 w-[calc(100%-280px)] p-8 min-h-screen lg:ml-[240px] lg:w-[calc(100%-240px)] lg:p-6 md:ml-0 md:w-full md:p-4 md:pt-15"> {/* broker-main */}
        {/* Header */}
        <header className="flex items-center justify-between mb-7 md:flex-col md:items-start md:gap-3.5"> {/* broker-header */}
          <div className="flex flex-col gap-1"> {/* broker-header-left */}
            <h1 className="text-2xl font-bold text-gray-900 m-0 mb-1 md:text-xl">Company Profile</h1>
            <p className="text-sm text-gray-400 m-0">Create and edit your company profile here.</p>
          </div>
          <div className="flex items-center gap-3.5 md:w-full md:justify-between md:gap-2.5"> {/* broker-header-right */}
            <button className="w-11 h-11 rounded-xl border-0 bg-white flex items-center justify-center text-gray-600 text-xl cursor-pointer transition-all duration-200 shadow-sm hover:bg-gray-50 hover:text-blue-600"> {/* broker-notification-btn */}
              <FiBell />
            </button>
            <a href="/broker/create-listing" className="inline-flex items-center gap-2 py-2.5 px-5 bg-blue-600 text-white text-sm font-semibold rounded-xl border-0 no-underline cursor-pointer transition-all duration-200 shadow-sm hover:bg-blue-700 active:scale-[0.98]"> {/* broker-add-listing-btn */}
              <FiPlus />
              Add Listing
            </a>
          </div>
        </header>

        <div className="p-6"> {/* cp-content */}
          {/* ===== Hero Section ===== */}
          <div className="relative rounded-2xl overflow-hidden min-h-90 flex items-center justify-center"> {/* cp-hero */}
            <img
              className="absolute inset-0 w-full h-full object-cover z-0" /* cp-hero-bg */
              src={companyData.heroImage}
              alt="Company background"
            />
            <div className="absolute inset-0 bg-slate-900/55 z-[1]" /> {/* cp-hero-overlay */}
            <div className="relative z-[2] flex flex-col items-center text-center w-full py-10 px-6 pt-10 pb-8"> {/* cp-hero-content */}
              <div className="flex items-center gap-3 mb-1.5"> {/* cp-brand */}
                <div className="w-10 h-10 bg-white/15 border-2 border-white/30 rounded-[10px] flex items-center justify-center text-white"> {/* cp-logo-icon */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                  </svg>
                </div>
                <h2 className="text-[30px] font-bold text-white tracking-tight">{companyData.name}</h2> {/* cp-company-name */}
              </div>
              <p className="text-sm text-white/80 mb-5">{companyData.tagline}</p> {/* cp-tagline */}

              <div className="flex flex-col items-center gap-2 mb-7"> {/* cp-connect */}
                <span className="text-xs text-white/70 font-medium">Connect with us</span> {/* cp-connect-label */}
                <div className="flex items-center gap-3"> {/* cp-connect-icons */}
                  <a href={`mailto:${companyData.contact.email}`} className="w-8 h-8 rounded-full flex items-center justify-center text-white text-base bg-white/12 border border-white/20 transition-all duration-200 no-underline hover:bg-white/25 hover:-translate-y-0.5" title="Email"> {/* cp-connect-icon */}
                    <FiMail />
                  </a>
                  <a href={`tel:${companyData.contact.phone}`} className="w-8 h-8 rounded-full flex items-center justify-center text-white text-base bg-white/12 border border-white/20 transition-all duration-200 no-underline hover:bg-white/25 hover:-translate-y-0.5" title="Phone"> {/* cp-connect-icon */}
                    <FiPhone />
                  </a>
                  <a href={`https://wa.me/${companyData.contact.whatsapp}`} className="w-8 h-8 rounded-full flex items-center justify-center text-white text-base bg-white/12 border border-white/20 transition-all duration-200 no-underline hover:bg-white/25 hover:-translate-y-0.5" title="WhatsApp"> {/* cp-connect-icon */}
                    <FaWhatsapp />
                  </a>
                  <a href={`https://${companyData.contact.website}`} className="w-8 h-8 rounded-full flex items-center justify-center text-white text-base bg-white/12 border border-white/20 transition-all duration-200 no-underline hover:bg-white/25 hover:-translate-y-0.5" title="Website"> {/* cp-connect-icon */}
                    <FiGlobe />
                  </a>
                </div>
              </div>

              <div className="flex gap-4 w-full max-w-[660px]"> {/* cp-stats-row */}
                {companyData.stats.map((stat, index) => (
                  <div className="flex-1 bg-white/12 backdrop-blur-xl border border-white/20 rounded-[14px] py-4.5 px-3.5 flex flex-col items-center gap-1.5 text-center" key={index}> {/* cp-stat-card */}
                    <span className="text-[11px] text-white/75 font-medium">{stat.label}</span> {/* cp-stat-label */}
                    <span className="text-xl font-bold text-white">{stat.value}</span> {/* cp-stat-value */}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== Our Team Section ===== */}
          <div className="py-10"> {/* cp-team-section */}
            <h3 className="text-2xl font-bold text-[#1a1a2e] text-center mb-6">Our Team</h3> {/* cp-team-title */}
            <div className="grid grid-cols-3 gap-5 max-w-[700px] mx-auto lg:grid-cols-2 md:grid-cols-1"> {/* cp-team-grid */}
              {teamMembers.map((member, index) => (
                <div className="relative rounded-xl overflow-hidden aspect-[3/4] cursor-pointer shadow-md group" key={index}> {/* cp-team-card */}
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover block transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-[1]" /> {/* cp-team-card-overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-[2] flex flex-col gap-0.5"> {/* cp-team-info */}
                    <span className="text-lg font-bold text-white">{member.name}</span> {/* cp-team-name */}
                    <span className="text-sm text-white/90">{member.role}</span> {/* cp-team-role */}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== Broker's Picks Section ===== */}
          <div className="relative rounded-2xl overflow-hidden min-h-[500px] my-10"> {/* cp-picks-section */}
            <img
              className="absolute inset-0 w-full h-full object-cover z-0" /* cp-picks-bg */
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=600&fit=crop"
              alt="Broker picks background"
            />
            <div className="absolute inset-0 bg-black/60 z-[1]" /> {/* cp-picks-overlay */}
            <div className="relative z-[2] p-10 flex flex-col items-center md:p-6"> {/* cp-picks-content */}
              <div className="flex flex-col items-center text-center mb-10 max-w-2xl"> {/* cp-picks-header */}
                <div className="flex items-center gap-4 mb-4"> {/* cp-picks-title-group */}
                  <span className="w-12 h-0.5 bg-white/40" /> {/* cp-picks-line */}
                  <div>
                    <h3 className="text-4xl font-bold text-white leading-tight md:text-3xl"> {/* cp-picks-title */}
                      Broker&apos;s <span className="text-white/60">——</span> {/* cp-picks-line-inline */}
                      <br />
                      <span className="text-white/60">—</span> Picks {/* cp-picks-dash */}
                    </h3>
                  </div>
                </div>
                <p className="text-xl font-semibold text-white mb-3 md:text-lg">The Crown Jewels: This Week&apos;s Premier Listings</p> {/* cp-picks-subtitle */}
                <p className="text-sm text-white/80 leading-relaxed"> {/* cp-picks-desc */}
                  From Architectural Marvels To Historic Restorations, These Homes Offer More Than
                  Just A Floor Plan—They Offer A Lifestyle Upgrade.
                </p>
              </div>

              <div className="flex gap-5 w-full max-w-4xl lg:flex-wrap lg:justify-center"> {/* cp-picks-carousel */}
                {brokerPicks.map((pick, index) => (
                  <div className={`relative flex-1 rounded-xl overflow-hidden aspect-[4/5] cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${index === 1 ? 'min-w-[280px] lg:min-w-0 lg:flex-[1.2]' : 'lg:flex-1'}`} key={index}> {/* cp-pick-card cp-pick-featured */}
                    <img src={pick.image} alt={pick.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3"> {/* cp-pick-badge-wrap */}
                      <span className={`inline-flex items-center gap-1 py-1 px-2.5 rounded-md text-xs font-semibold ${
                        pick.badgeColor === 'blue' ? 'bg-blue-600 text-white' :
                        pick.badgeColor === 'gold' ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-white' :
                        'bg-gray-600 text-white'
                      }`}> {/* cp-pick-badge */}
                        {pick.badgeColor === 'gold' && <FiStar size={10} />}
                        {pick.badge}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col gap-1"> {/* cp-pick-info */}
                      <span className="text-base font-bold text-white leading-tight">{pick.title}</span> {/* cp-pick-title */}
                      {pick.subtitle && <span className="text-sm text-white/90">{pick.subtitle}</span>} {/* cp-pick-subtitle */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== Company Awards Section ===== */}
          <div className="py-12 bg-gray-50 rounded-2xl my-10"> {/* cp-awards-section */}
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Company Awards</h3> {/* cp-awards-title */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto lg:grid-cols-2 md:grid-cols-1"> {/* cp-awards-grid */}
              {[1, 2, 3].map((_, index) => (
                <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-xl shadow-sm" key={index}> {/* cp-award-card */}
                  <div className="flex items-center justify-center"> {/* cp-award-badge */}
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
                  <div className="flex flex-col items-center gap-1 text-center"> {/* cp-award-text */}
                    <span className="text-xl font-bold text-[#c8a84e]">GLOBEE</span> {/* cp-award-name */}
                    <span className="text-sm text-gray-600 font-medium">AWARDS<sup>®</sup></span> {/* cp-award-label */}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== Join / Contact Section ===== */}
          <div className="grid grid-cols-[1.2fr_1fr] gap-10 bg-white rounded-2xl p-10 shadow-sm lg:grid-cols-1 md:p-6"> {/* cp-join-section */}
            <div className="flex flex-col justify-center gap-4"> {/* cp-join-left */}
              <h3 className="text-3xl font-bold text-gray-900 leading-tight md:text-2xl"> {/* cp-join-title */}
                Join the Future of {companyData.name}!
              </h3>
              <p className="text-base text-gray-600 leading-relaxed"> {/* cp-join-desc */}
                We aren&apos;t just listing properties; we&apos;re building brands. Join a team of elite real estate
                professionals and leverage our high-performance lead-generation engine to scale your career.
                Submit your credentials below to start your journey with us.
              </p>
            </div>
            <div className="flex items-center"> {/* cp-join-right */}
              <form className="w-full bg-gray-50 rounded-xl p-6 flex flex-col gap-5" onSubmit={handleInquiry}> {/* cp-contact-form */}
                <h4 className="text-lg font-bold text-gray-900 m-0">Send us a message</h4> {/* cp-form-title */}
                <div className="flex flex-col gap-2"> {/* cp-form-group */}
                  <label className="text-sm font-medium text-gray-700">Fullname</label> {/* cp-form-label */}
                  <input
                    type="text"
                    className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-base text-gray-900 outline-none transition-all duration-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /* cp-form-input */
                    value={formData.fullname}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullname: e.target.value }))}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2"> {/* cp-form-group */}
                  <label className="text-sm font-medium text-gray-700">Email</label> {/* cp-form-label */}
                  <input
                    type="email"
                    className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-base text-gray-900 outline-none transition-all duration-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /* cp-form-input */
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <button type="submit" className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 text-white text-base font-semibold rounded-lg border-0 cursor-pointer transition-all duration-200 hover:bg-blue-700 active:scale-[0.98]"> {/* cp-form-submit */}
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
