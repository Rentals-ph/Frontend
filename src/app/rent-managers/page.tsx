"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { agentsApi } from '../../api'
import { getApiBaseUrl } from '../../config/api'
import { ASSETS } from '@/utils/assets'
// import './page.css' // Removed - converted to Tailwind

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="relative bg-gradient-to-br from-blue-600 to-purple-700 pt-20 pb-32 lg:pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 gap-12 items-center lg:grid-cols-1">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">What are Rent Managers?</h2>
              <p className="text-lg text-blue-100 leading-relaxed">
                Rent Managers are trusted professionals who help property owners manage  their rental properties and assist tenants in finding their perfect  home. They handle everything from property listings to tenant screening, making the rental process smooth and stress-free for everyone involved.
              </p>
            </div>
            <div className="flex justify-center lg:order-first">
              <img className="w-full max-w-md" src="/assets/images/agents/hero-person.png" alt="Rent Manager" />
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative -mb-16 mt-12">
          <div className="grid grid-cols-4 gap-6 lg:grid-cols-2 md:grid-cols-1">
            {features.map((feature) => (
              <div key={feature.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="flex flex-col items-center text-center gap-4">
                  <img src={feature.icon} alt={feature.alt} className="w-12 h-12" />
                  <div className="text-lg font-bold text-gray-900">{feature.title}</div>
                  <div className="text-sm text-gray-600">{feature.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-12 pt-24">
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">FIND A RENT MANAGERS</h2>

          <div className="flex items-center gap-4 mb-6 flex-wrap lg:flex-col">
            <div className="relative flex-1 min-w-[280px]">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 19L14.65 14.65" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input 
                type="text" 
                placeholder="Search here..." 
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select 
              className="px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[150px]"
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
            >
              <option value="">Province</option>
              {uniqueLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>

            <select 
              className="px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[150px]"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">City</option>
              {uniqueLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>

            <div className="flex gap-2">
              <button
                className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-200 border border-gray-300"
                aria-label="List View"
                onClick={() => setViewMode('list')}
                style={{ backgroundColor: viewMode === 'list' ? '#FE8E0A' : '#ffffff' }}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                  <path d="M3 12H21M3 6H21M3 18H21" stroke={viewMode === 'list' ? "#ffffff" : "#333"} strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <button
                className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-200 border border-gray-300"
                aria-label="Grid View"
                onClick={() => setViewMode('grid')}
                style={{ backgroundColor: viewMode === 'grid' ? '#FE8E0A' : '#ffffff' }}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                  <rect x="3" y="3" width="7" height="7" stroke={viewMode === 'grid' ? "#ffffff" : "#333"} strokeWidth="2" fill="none" />
                  <rect x="14" y="3" width="7" height="7" stroke={viewMode === 'grid' ? "#ffffff" : "#333"} strokeWidth="2" fill="none" />
                  <rect x="3" y="14" width="7" height="7" stroke={viewMode === 'grid' ? "#ffffff" : "#333"} strokeWidth="2" fill="none" />
                  <rect x="14" y="14" width="7" height="7" stroke={viewMode === 'grid' ? "#ffffff" : "#333"} strokeWidth="2" fill="none" />
                </svg>
              </button>
            </div>
          </div>

          <div className={`fixed top-0 left-0 right-0 z-40 bg-white shadow-md transition-transform duration-300 ${showStickySearch ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4 flex-wrap">
              <Link href="/" className="flex-shrink-0">
                <img src={ASSETS.LOGO_HERO_MAIN} alt="Rentals.ph logo" className="h-10" />
              </Link>
              <div className="relative flex-1 min-w-[280px]">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
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

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>Loading rent managers...</p>
            </div>
          ) : filteredManagers.length > 0 ? (
            <div className="grid grid-cols-[1fr_300px] gap-8 lg:grid-cols-1">
              <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-6 md:grid-cols-1' : 'flex flex-col gap-4'}>
                {filteredManagers.map((manager) => (
                  <div
                    key={manager.id}
                    className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer ${viewMode === 'list' ? 'flex flex-row' : 'flex flex-col'}`}
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
                    <div className={viewMode === 'list' ? 'w-48 flex-shrink-0' : 'w-full'}>
                      <div className="relative w-full aspect-square overflow-hidden">
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
                          <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">{manager.name}</h3>
                          <p className="text-sm text-gray-600">{manager.role}</p>
                        </div>
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 flex-shrink-0"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/rent-managers/${manager.id}`)
                          }}
                        >
                          {manager.listings} Listings
                        </button>
                      </div>
                      <div className="border-t border-gray-200 my-4"></div>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 3C2 2.45 2.45 2 3 2H13C13.55 2 14 2.45 14 3V13C14 13.55 13.55 14 13 14H3C2.45 14 2 13.55 2 13V3ZM3 3V13H13V3H3Z" stroke="#000" strokeWidth="1.5" fill="none"/>
                            <path d="M3 4L8 8L13 4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="truncate">{manager.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 1C5.13 1 2 4.13 2 8C2 11.87 5.13 15 9 15C12.87 15 16 11.87 16 8C16 4.13 12.87 1 9 1ZM9 13C6.24 13 4 10.76 4 8C4 5.24 6.24 3 9 3C11.76 3 14 5.24 14 8C14 10.76 11.76 13 9 13Z" stroke="#000" strokeWidth="1.5" fill="none"/>
                            <path d="M9 4C7.34 4 6 5.34 6 7C6 8.66 7.34 10 9 10C10.66 10 12 8.66 12 7C12 5.34 10.66 4 9 4Z" stroke="#000" strokeWidth="1.5" fill="none"/>
                          </svg>
                          <span className="truncate">{manager.location}</span>
                        </div>
                        {manager.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3.5 2C2.67 2 2 2.67 2 3.5V12.5C2 13.33 2.67 14 3.5 14H12.5C13.33 14 14 13.33 14 12.5V3.5C14 2.67 13.33 2 12.5 2H3.5ZM3.5 3H12.5C12.78 3 13 3.22 13 3.5V12.5C13 12.78 12.78 13 12.5 13H3.5C3.22 13 3 12.78 3 12.5V3.5C3 3.22 3.22 3 3.5 3Z" stroke="#000" strokeWidth="1.5" fill="none"/>
                              <path d="M6 5H10" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
                              <path d="M6 7H12" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            <span className="truncate">{manager.phone}</span>
                          </div>
                        )}
                        <div className="mt-2">
                          <Link
                            href={`/rent-managers/${manager.id}`}
                            className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200"
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
                ))}
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm self-start">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Recently Visited Managers</h3>
                {filteredManagers.slice(0, 3).map((manager) => (
                  <div key={manager.id} className="flex gap-3 mb-5 last:mb-0">
                    <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 relative bg-blue-600">
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
                        className="absolute inset-0 flex items-center justify-center text-white text-sm font-semibold"
                        style={{ display: manager.image ? 'none' : 'flex' }}
                      >
                        <span>{getInitials(manager.name)}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 mb-1 truncate">{manager.name}</h4>
                      <p className="text-xs text-gray-600 mb-0.5 truncate">{manager.role}</p>
                      <p className="text-xs text-gray-500 truncate">{manager.email}</p>
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

          <div className="flex items-center justify-center gap-2 mt-12">
            <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200">←</button>
            <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-600 text-white font-semibold">1</button>
            <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200">2</button>
            <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200">3</button>
            <span className="px-2 text-gray-500">...</span>
            <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200">50</button>
            <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200">→</button>
          </div>
        </section>
      </main>

      <section className="relative bg-blue-600 py-16">
        <img src="/assets/backgrounds/building-bg.jpg" alt="Buildings" className="absolute inset-0 w-full h-full object-cover opacity-[0.18] z-0" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-white text-4xl font-bold mb-5">Become a Rental Manager here!</h2>
          <p className="text-white text-lg mb-8">
            Join us together with the most trusted managers to help people find their perfect home.
          </p>
          <button className="bg-white text-blue-600 font-semibold text-lg px-12 py-3.5 rounded-lg hover:bg-gray-50 transition-colors duration-200">Join now!</button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
