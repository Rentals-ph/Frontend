"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { agentsApi } from '../../api'
import { getApiBaseUrl } from '../../config/api'
import { ASSETS } from '@/utils/assets'

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
    { id: 1, icon: '/assets/icons/secure.svg', alt: 'secure', title: 'Property Management', description: 'Expert handling of property listings, maintenance coordination, and tenant relations.' },
    { id: 2, icon: '/assets/icons/support.svg', alt: 'support', title: 'Tenant Screening', description: 'Thorough background checks and verification to ensure reliable tenants.' },
    { id: 3, icon: '/assets/icons/listing.svg', alt: 'listing', title: 'Professional Service', description: 'Licensed and verified managers committed to quality service.' },
    { id: 4, icon: '/assets/icons/insight.svg', alt: 'insight', title: 'Legal Compliance', description: 'Ensuring all rental agreements meet legal requirements and standards.' },
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
    <div className="min-h-screen overflow-x-hidden overflow-y-visible" style={{ backgroundColor: '#F9FAFB' }}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative mt-20 pt-16 pb-16 px-6 md:px-10 lg:px-[150px] overflow-x-visible min-h-[550px]" style={{ background: 'linear-gradient(to top,rgb(24, 24, 24) 0%, #1A3DBF 40%,rgb(36, 71, 196) 100%)', overflowY: 'visible' }}>
  <div className="mx-auto relative flex items-center max-w-full overflow-visible" style={{ minHeight: '430px', overflow: 'visible' }}>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch w-full overflow-visible">

      {/* Left Column - Description */}
      <div className="order-2 lg:order-1 text-2xl max-w-[650px]">
        <h1 className="font-bold text-white mb-6 leading-tight text-left">
          What are Rent Managers?
        </h1>
        <p className="text-white leading-relaxed text-1xl font-light text-justify">
          Rent Managers are trusted professionals who help property owners manage their
          rental properties and assist tenants in finding their perfect home. They handle
          everything from property listings to tenant screening, making the rental process
          smooth and stress-free for everyone involved.
        </p>
      </div>

      {/* Right Column - Person Image */}
      <div className="relative order-1 lg:order-2 lg:col-span-2 flex justify-center lg:justify-end" style={{ overflow: 'visible', minHeight: '0', position: 'relative' }}>
        <img
          className="h-[610px] w-auto object-contain object-bottom absolute z-[5]"
          src="/assets/images/agents/hero-person.png"
          alt="Rent Manager"
          style={{ 
            maxWidth: 'clamp(300px, 40vw, 500px)',
            right: '200px',
            top: '-500px',
            position: 'absolute'
          }}
        />
      </div>

    </div>
  </div>
</section>

      {/* Feature Cards Row - Overlapping hero */}
      <div className=" mx-auto px-6 md:px-10 lg:px-[150px] relative" style={{ marginTop: '-100px', zIndex: 10, paddingTop: '20px' }}>
        <div className="grid grid-cols-4 gap-6 lg:grid-cols-4 md:grid-cols-1">
          {features.map((feature) => (
            <div 
              key={feature.id} 
              className="bg-white p-6"
              style={{
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center">
                  <img 
                    src={feature.icon} 
                    alt={feature.alt} 
                    className="w-12 h-12" 
                    style={{ filter: 'brightness(0) saturate(100%) invert(27%) sepia(95%) saturate(2598%) hue-rotate(210deg) brightness(95%) contrast(92%)' }} 
                  />
                </div>
                <div 
                  className="font-bold"
                  style={{ 
                    fontSize: '22px',
                    color: '#2563EB'
                  }}
                >
                  {feature.title}
                </div>
                <div 
                  className="text-center"
                  style={{ 
                    fontSize: '18px',
                    color: '#374151',
                    lineHeight: '1.5'
                  }}
                >
                  {feature.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filter Row - Full Width */}
      <div className="top-search-bar-container sticky top-0 z-30 bg-white mt-10 border-b border-gray-200 py-5  lg:px-[150px] mb-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="top-search-bar flex items-center gap-4 flex-wrap lg:flex-nowrap w-full">
              <div className="search-input-container flex-1 min-w-[280px] relative">
                <svg 
                  className="search-icon absolute left-4 top-3 w-5 h-5 text-gray-500 pointer-events-none" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                  <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  className="main-search-input w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search here..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="top-search-bar-controls flex items-center gap-3 flex-wrap lg:flex-nowrap">
                <select
                  className="sort-dropdown-btn px-6 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                >
                  <option value="">Province</option>
                  {uniqueLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                <select
                  className="sort-dropdown-btn px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option value="">City</option>
                  {uniqueLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                <button
                  className={`hamburger-menu-btn px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                  aria-label="List View"
                  onClick={() => setViewMode('list')}
                >
                  List view
                </button>
                <button
                  className={`grid-view-btn px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                  aria-label="Grid View"
                  onClick={() => setViewMode('grid')}
                >
                  Grid view
                </button>
              </div>
            </div>
          </div>
        </div>

      {/* Find a Rent Manager Section */}
      <main className=" lg:px-[150px]" style={{ paddingTop: '0px', paddingBottom: '60px' }}>
        <section className="mx-auto">
          <h2 
            className="font-bold mb-8"
            style={{ 
              fontSize: '22px',
              color: '#1A3DBF',
              textTransform: 'uppercase',
              textAlign: 'left',
              letterSpacing: '0.05em'
            }}
          >
            FIND A RENT MANAGERS
          </h2>

          {/* Sticky Search Bar */}
          <div className={`fixed top-0 left-0 right-0 z-40 bg-white shadow-md transition-transform duration-300 ${showStickySearch ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-[150px] py-4 flex items-center gap-4 flex-wrap">
              <Link href="/" className="flex-shrink-0">
                <img src={ASSETS.LOGO_HERO_MAIN} alt="Rentals.ph logo" className="h-10" />
              </Link>
              <div className="relative flex-1 min-w-[280px]">
                <svg className="absolute left-4 top-3 pointer-events-none" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 19L14.65 14.65" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input 
                  type="text" 
                  placeholder="Search here..." 
                  className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select 
                className="px-4 py-2.5 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
              >
                <option value="">Province</option>
                {uniqueLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              <select 
                className="px-4 py-2.5 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

          {/* Manager Cards Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>Loading rent managers...</p>
            </div>
          ) : filteredManagers.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-6 md:grid-cols-1 lg:grid-cols-3' : 'flex flex-col gap-4'}>
              {filteredManagers.map((manager) => (
                <div
                  key={manager.id}
                  className="bg-white overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200"
                  style={{
                    borderRadius: '16px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
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
                  {viewMode === 'grid' ? (
                    <>
                      {/* Circular Headshot */}
                      <div className="w-full flex justify-center pt-6 pb-4">
                        <div 
                          className="relative rounded-full overflow-hidden flex-shrink-0"
                          style={{
                            width: '96px',
                            height: '96px',
                            backgroundColor: '#2563EB'
                          }}
                        >
                          {manager.image ? (
                            <img 
                              src={getAgentImageUrl(manager.image) || ''} 
                              alt={manager.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                                const fallback = target.nextElementSibling as HTMLElement
                                if (fallback) fallback.style.display = 'flex'
                              }}
                            />
                          ) : null}
                          <div 
                            className="absolute inset-0 flex items-center justify-center text-white font-bold"
                            style={{ 
                              display: manager.image ? 'none' : 'flex',
                              fontSize: '24px'
                            }}
                          >
                            <span>{getInitials(manager.name)}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Card Body */}
                      <div className="px-4 pb-4">
                        {/* Name Row with Listing Count */}
                        <div className="flex items-center justify-between mb-1">
                          <h3 
                            className="font-bold truncate flex-1"
                            style={{ 
                              fontSize: '18px',
                              color: '#374151'
                            }}
                          >
                            {manager.name}
                          </h3>
                          <span 
                            className="font-medium flex-shrink-0 ml-2"
                            style={{ 
                              fontSize: '14px',
                              color: '#2563EB'
                            }}
                          >
                            {manager.listings} Listings
                          </span>
                        </div>
                        
                        {/* Rent Manager Label */}
                        <p 
                          className="mb-4"
                          style={{ 
                            fontSize: '13px',
                            color: '#2563EB'
                          }}
                        >
                          {manager.role}
                        </p>
                        
                        {/* Divider */}
                        <div className="border-t mb-4" style={{ borderColor: '#E5E7EB' }} />
                        
                        {/* Contact Info */}
                        <div className="flex flex-col gap-2 mb-4">
                          <div className="flex items-center gap-2">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2 3C2 2.45 2.45 2 3 2H13C13.55 2 14 2.45 14 3V13C14 13.55 13.55 14 13 14H3C2.45 14 2 13.55 2 13V3ZM3 3V13H13V3H3Z" stroke="#2563EB" strokeWidth="1.5" fill="none"/>
                              <path d="M3 4L8 8L13 4" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span 
                              className="truncate"
                              style={{ 
                                fontSize: '14px',
                                color: '#374151'
                              }}
                            >
                              {manager.email}
                            </span>
                          </div>
                          {manager.phone && (
                            <div className="flex items-center gap-2">
                              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.5 2C2.67 2 2 2.67 2 3.5V12.5C2 13.33 2.67 14 3.5 14H12.5C13.33 14 14 13.33 14 12.5V3.5C14 2.67 13.33 2 12.5 2H3.5ZM3.5 3H12.5C12.78 3 13 3.22 13 3.5V12.5C13 12.78 12.78 13 12.5 13H3.5C3.22 13 3 12.78 3 12.5V3.5C3 3.22 3.22 3 3.5 3Z" stroke="#2563EB" strokeWidth="1.5" fill="none"/>
                                <path d="M6 5H10" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M6 7H12" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round"/>
                              </svg>
                              <span 
                                className="truncate"
                                style={{ 
                                  fontSize: '14px',
                                  color: '#374151'
                                }}
                              >
                                {manager.phone}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* CTA Button */}
                        <button
                          className="w-full text-white font-bold flex items-center justify-center gap-2 transition-colors duration-200"
                          style={{
                            backgroundColor: '#1D4ED8',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            fontSize: '14px'
                          }}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/rent-managers/${manager.id}`)
                          }}
                        >
                          View My Listing
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-row">
                        <div className="w-48 flex-shrink-0">
                          <div className="relative w-full aspect-square overflow-hidden">
                            {manager.image ? (
                              <img 
                                src={getAgentImageUrl(manager.image) || ''} 
                                alt={manager.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.style.display = 'none'
                                  const fallback = target.nextElementSibling as HTMLElement
                                  if (fallback) fallback.style.display = 'flex'
                                }}
                              />
                            ) : null}
                            <div 
                              className="absolute inset-0 flex items-center justify-center bg-blue-600 text-white text-4xl font-bold"
                              style={{ display: manager.image ? 'none' : 'flex' }}
                            >
                              <span>{getInitials(manager.name)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1 min-w-0">
                              <h3 
                                className="font-bold truncate mb-1"
                                style={{ 
                                  fontSize: '18px',
                                  color: '#374151'
                                }}
                              >
                                {manager.name}
                              </h3>
                              <p 
                                style={{ 
                                  fontSize: '13px',
                                  color: '#2563EB'
                                }}
                              >
                                {manager.role}
                              </p>
                            </div>
                            <span 
                              className="font-medium flex-shrink-0 ml-2"
                              style={{ 
                                fontSize: '14px',
                                color: '#2563EB'
                              }}
                            >
                              {manager.listings} Listings
                            </span>
                          </div>
                          <div className="border-t mb-4" style={{ borderColor: '#E5E7EB' }} />
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 3C2 2.45 2.45 2 3 2H13C13.55 2 14 2.45 14 3V13C14 13.55 13.55 14 13 14H3C2.45 14 2 13.55 2 13V3ZM3 3V13H13V3H3Z" stroke="#2563EB" strokeWidth="1.5" fill="none"/>
                                <path d="M3 4L8 8L13 4" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              <span 
                                className="truncate"
                                style={{ 
                                  fontSize: '14px',
                                  color: '#374151'
                                }}
                              >
                                {manager.email}
                              </span>
                            </div>
                            {manager.phone && (
                              <div className="flex items-center gap-2">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M3.5 2C2.67 2 2 2.67 2 3.5V12.5C2 13.33 2.67 14 3.5 14H12.5C13.33 14 14 13.33 14 12.5V3.5C14 2.67 13.33 2 12.5 2H3.5ZM3.5 3H12.5C12.78 3 13 3.22 13 3.5V12.5C13 12.78 12.78 13 12.5 13H3.5C3.22 13 3 12.78 3 12.5V3.5C3 3.22 3.22 3 3.5 3Z" stroke="#2563EB" strokeWidth="1.5" fill="none"/>
                                  <path d="M6 5H10" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round"/>
                                  <path d="M6 7H12" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                                <span 
                                  className="truncate"
                                  style={{ 
                                    fontSize: '14px',
                                    color: '#374151'
                                  }}
                                >
                                  {manager.phone}
                                </span>
                              </div>
                            )}
                            <div className="mt-2">
                              <Link
                                href={`/rent-managers/${manager.id}`}
                                className="inline-flex items-center gap-2 font-medium transition-colors duration-200"
                                style={{
                                  color: '#2563EB',
                                  fontSize: '14px'
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                View My Listing
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>No rent managers found matching your criteria.</p>
            </div>
          )}
        </section>
      </main>

      {/* CTA Section */}
      <section className="relative py-16 px-6 md:px-10 lg:px-[150px] overflow-hidden" style={{ minHeight: '400px' }}>
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img 
            src="/assets/backgrounds/rent-managers-bg.png" 
            alt="Buildings" 
            className="w-full h-full object-cover object-center"
            style={{ objectPosition: 'center bottom' }}
          />
        </div>
        
        {/* Dark Blue Overlay */}
        <div 
          className="absolute inset-0 w-full h-full z-[1]"
          style={{ 
            background: 'rgba(0, 0, 0, 0.55)'
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center justify-center" style={{ minHeight: '400px' }}>
          <h2 className="text-white text-4xl md:text-5xl font-bold mb-5 leading-tight">
            Become a Rental Manager here!
          </h2>
          <p className="text-white text-lg md:text-xl mb-8 max-w-2xl">
            Join us together with the most trusted managers to help people find their perfect home.
          </p>
          <button className="bg-white text-blue-600 font-semibold text-lg px-8 py-4 rounded-full hover:bg-gray-50 transition-all duration-200 flex items-center gap-3 group">
            <span>Join now!</span>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center group-hover:bg-blue-700 transition-colors duration-200">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 12L10 8L6 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
