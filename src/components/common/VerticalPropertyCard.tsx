'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ASSETS } from '@/utils/assets'

interface VerticalPropertyCardProps {
  id?: number | string
  propertyType?: string
  date?: string
  price?: string
  title?: string
  image?: string
  rentManagerName?: string
  rentManagerRole?: string
  bedrooms?: number
  bathrooms?: number
  parking?: number
  propertySize?: string
  location?: string
}

function VerticalPropertyCard({
  id,
  propertyType = 'Commercial Spaces',
  date = 'Sat 05, 2024',
  price = '$1200/Month',
  title = 'Azure Residences - 2BR Corner Suite',
  image = ASSETS.PLACEHOLDER_PROPERTY_MAIN,
  rentManagerName = 'Rental.Ph Official',
  rentManagerRole = 'Rent Manager',
  bedrooms = 4,
  bathrooms = 2,
  parking: _parking = 2,
  propertySize = '24 sqft',
  location,
}: VerticalPropertyCardProps) {
  const router = useRouter()
  const [showSharePopup, setShowSharePopup] = useState(false)
  const sharePopupRef = useRef<HTMLDivElement>(null)

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on buttons or links
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('svg')) {
      return
    }
    if (id) {
      router.push(`/property/${id}`)
    }
  }

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sharePopupRef.current && !sharePopupRef.current.contains(event.target as Node)) {
        setShowSharePopup(false)
      }
    }

    if (showSharePopup) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSharePopup])

  const handleShare = (platform: 'facebook' | 'whatsapp' | 'gmail') => {
    const propertyUrl = id ? `${window.location.origin}/property/${id}` : window.location.href
    const shareText = `${title}${location ? `, ${location}` : ''} - ${price}`

    switch (platform) {
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(propertyUrl)}`,
          '_blank'
        )
        break
      case 'whatsapp':
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${shareText} ${propertyUrl}`)}`,
          '_blank'
        )
        break
      case 'gmail':
        window.open(
          `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(propertyUrl)}`,
          '_blank'
        )
        break
    }
    setShowSharePopup(false)
  }

  return (
    <article
      className="vertical-property-card bg-white rounded-xl border border-gray-200 overflow-visible relative flex flex-col flex-shrink-0 w-[400px] min-w-[400px] max-w-[400px] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_rgba(0,0,0,0.06)] transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0px_10px_20px_rgba(0,0,0,0.1),0px_4px_8px_rgba(0,0,0,0.08)] md:rounded-xl md:shadow-[0px_2px_8px_rgba(0,0,0,0.06),0px_1px_3px_rgba(0,0,0,0.04)] md:border md:border-gray-200 md:overflow-hidden md:mb-0 md:active:scale-[0.98] md:active:transition-transform md:active:duration-100"
      onClick={handleCardClick}
      style={{ cursor: id ? 'pointer' : 'default' }}
    >
      <div className="relative w-full flex-shrink-0 overflow-hidden rounded-t-xl">
        <img
          src={image}
          alt={title}
          className="w-full h-[300px] object-cover object-center block bg-gray-100 transition-transform duration-300 ease-out rounded-t-xl overflow-hidden group-hover:scale-105"
          onError={(e) => {
            // Fallback to default image if the provided image fails to load
            e.currentTarget.src = ASSETS.PLACEHOLDER_PROPERTY_MAIN
          }}
        />
          <div className="flex flex-row items-center absolute bottom-2 right-2 gap-1.5 overflow-visible flex-shrink-0 z-10 bg-white/95 backdrop-blur-sm p-1 rounded-lg shadow-[0px_2px_8px_rgba(0,0,0,0.15)] transition-all duration-200">
            <button className="w-7 h-7 rounded-[20%] bg-white border border-gray-200 flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-red-50 hover:border-red-300 hover:scale-105" aria-label="Add to favorites">
              <svg viewBox="0 0 24 24" fill="#ef4444" className="w-[18px] h-[18px]" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
            <div className="relative flex items-center justify-end" ref={sharePopupRef}>
              <button
                className="w-7 h-7 border-none bg-transparent cursor-pointer flex items-center justify-center p-1 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:-translate-y-0.5"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowSharePopup(!showSharePopup)
                }}
                aria-label="Share property"
              >
                <svg viewBox="0 0 24 24" fill="#205ED7" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <path d="M8.59 13.51L15.42 17.49" stroke="#205ED7" strokeWidth="2" strokeLinecap="round" />
                  <path d="M15.41 6.51L8.59 10.49" stroke="#205ED7" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              {showSharePopup && (
                <div className="absolute top-[calc(100%+8px)] right-0 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15),0_2px_8px_rgba(0,0,0,0.1)] p-1.5 z-[1000] min-w-[140px] flex flex-col gap-0.5 border border-gray-200 before:content-[''] before:absolute before:-top-1.5 before:right-3 before:w-3 before:h-3 before:bg-white before:border-l before:border-l-gray-200 before:border-b-0 before:border-t before:border-t-gray-200 before:rotate-45">
                  <button
                    className="flex items-center gap-2.5 px-2.5 py-2 border-none bg-transparent cursor-pointer rounded-lg transition-all duration-200 font-outfit text-[13px] font-medium text-gray-700 text-left w-full hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleShare('facebook')
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="#1877F2" className="w-[18px] h-[18px] flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                    <span className="flex-1">Facebook</span>
                  </button>
                  <button
                    className="flex items-center gap-2.5 px-2.5 py-2 border-none bg-transparent cursor-pointer rounded-lg transition-all duration-200 font-outfit text-[13px] font-medium text-gray-700 text-left w-full hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleShare('whatsapp')
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="#25D366" className="w-[18px] h-[18px] flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 20.2c-.151.504.335.99.839.839l3.032-.892A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                      <path d="M9.5 8.5c-.15-.35-.3-.36-.45-.36h-.4c-.15 0-.4.05-.6.3-.2.25-.75.75-.75 1.8s.75 2.1.85 2.25c.1.15 1.5 2.3 3.65 3.2.5.2.9.35 1.2.45.5.15.95.15 1.3.1.4-.05 1.25-.5 1.4-1s.15-1 .1-1.05c-.05-.1-.2-.15-.4-.25l-1.2-.6c-.2-.1-.35-.15-.5.15-.15.3-.6.75-.75.9-.15.15-.25.15-.45.05-.2-.1-.85-.3-1.6-1-.6-.55-1-1.2-1.1-1.4-.1-.2 0-.3.1-.4.1-.1.2-.25.3-.35.1-.1.15-.2.2-.3.05-.1.05-.2 0-.3-.05-.1-.5-1.2-.7-1.65z" fill="#FFFFFF" />
                    </svg>
                    <span className="flex-1">WhatsApp</span>
                  </button>
                  <button
                    className="flex items-center gap-2.5 px-2.5 py-2 border-none bg-transparent cursor-pointer rounded-lg transition-all duration-200 font-outfit text-[13px] font-medium text-gray-700 text-left w-full hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleShare('gmail')
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="#EA4335" className="w-[18px] h-[18px] flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <polygon points="2,6 12,13 22,6" fill="#FFFFFF" />
                    </svg>
                    <span className="flex-1">Gmail</span>
                  </button>
                </div>
              )}
            </div>
          </div>
      </div>
      <div className="flex-[0_0_auto] flex flex-col px-3 py-2.5 gap-1.5 overflow-visible">
        <div className="flex justify-between items-center gap-2">
          <p className="text-[#205ed7] font-outfit text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap overflow-hidden text-ellipsis px-1.5 py-0.5 bg-blue-50 rounded">{propertyType}</p>
          <p className="text-gray-400 font-outfit text-[11px] font-medium whitespace-nowrap">{date}</p>
        </div>
        <div className="flex justify-between items-center gap-2 min-w-0">
          <p className="text-[#205ED7] font-outfit text-3xl font-bold whitespace-nowrap flex-shrink-0">{price}</p>
        </div>
        <h3 className="text-gray-900 font-outfit text-base font-semibold leading-tight m-0 overflow-hidden max-h-10 line-clamp-2 [-webkit-line-clamp:2] [-webkit-box-orient:vertical] [display:-webkit-box]">
          {title}{location ? `, ${location}` : ''}
        </h3>

        <div className="flex gap-2 px-2 py-1.5 bg-blue-50 rounded-lg mt-auto flex-shrink-0">
          <img
            src={ASSETS.LOGO_ICON}
            alt="Rentals.ph Official"
            className="w-7 h-7 rounded-full border-2 border-[#205ed7] object-cover bg-white flex-shrink-0"
          />
          <div className="flex flex-col gap-0.5 min-w-0">
            <p className="text-[#205ed7] font-outfit text-[11px] font-semibold leading-tight overflow-hidden text-ellipsis whitespace-nowrap">{rentManagerName}</p>
            <p className="text-blue-400 font-outfit text-[9px] font-normal leading-tight uppercase tracking-wide">{rentManagerRole}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center h-10 border-t border-gray-200 bg-gray-50 flex-shrink-0 mt-auto gap-0 rounded-b-lg">
        <div className="flex-1 flex items-center justify-center gap-1 border-r border-gray-200 px-1 py-1.5" title="Bedrooms">
          <svg viewBox="0 0 24 24" fill="#6b7280" className="w-3.5 h-3.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="10" width="18" height="7" rx="2" />
            <rect x="7" y="7" width="4" height="3" rx="1" />
            <rect x="13" y="7" width="4" height="3" rx="1" />
            <path d="M3 17v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" />
          </svg>
          <span className="text-gray-700 font-outfit text-[11px] font-semibold">{bedrooms}</span>
        </div>
        <div className="flex-1 flex items-center justify-center gap-1 border-r border-gray-200 px-1 py-1.5" title="Bathrooms">
          <svg viewBox="0 0 24 24" fill="#6b7280" className="w-3.5 h-3.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="10" width="18" height="8" rx="2" />
            <rect x="5" y="18" width="2" height="2" rx="1" />
            <rect x="17" y="18" width="2" height="2" rx="1" />
            <path d="M3 18h18" />
          </svg>
          <span className="text-gray-700 font-outfit text-[11px] font-semibold">{bathrooms}</span>
        </div>
        <div className="flex-1 flex items-center justify-center gap-1 px-1 py-1.5" title="Property Size">
          <svg viewBox="0 0 24 24" fill="#6b7280" className="w-3.5 h-3.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="17" width="20" height="4" rx="1" />
            <rect x="2" y="3" width="20" height="4" rx="1" />
            <rect x="2" y="10" width="20" height="4" rx="1" />
            <rect x="5" y="6" width="2" height="12" rx="1" />
            <rect x="11" y="6" width="2" height="12" rx="1" />
            <rect x="17" y="6" width="2" height="12" rx="1" />
          </svg>
          <span className="text-gray-700 font-outfit text-[11px] font-semibold">{propertySize}</span>
        </div>
      </div>
    </article>
  )
}

export default VerticalPropertyCard