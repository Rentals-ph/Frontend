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
      className="bg-white rounded-xl border border-gray-200 overflow-visible relative flex flex-col flex-shrink-0 w-[390px] max-w-[390px] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_rgba(0,0,0,0.06)] transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0px_10px_20px_rgba(0,0,0,0.1),0px_4px_8px_rgba(0,0,0,0.08)] md:max-w-full md:w-full md:min-h-0 md:rounded-xl md:shadow-[0px_2px_8px_rgba(0,0,0,0.06),0px_1px_3px_rgba(0,0,0,0.04)] md:border md:border-gray-200 md:overflow-hidden md:mb-0 md:hover:transform-none md:hover:shadow-[0px_4px_12px_rgba(0,0,0,0.08),0px_2px_4px_rgba(0,0,0,0.04)] md:active:scale-[0.98] md:active:transition-transform md:active:duration-100 max-[480px]:rounded-lg max-[480px]:mb-0 max-[480px]:max-w-full max-[480px]:w-full property-carousel:min-w-[280px] property-carousel:max-w-[280px] property-carousel:w-[280px] property-carousel:flex-shrink-0 property-carousel:rounded-xl browse-property-carousel:min-w-[260px] browse-property-carousel:max-w-[260px] browse-property-carousel:w-[260px]"
      onClick={handleCardClick}
      style={{ cursor: id ? 'pointer' : 'default' }}
    >
      <div className="relative w-full flex-shrink-0 overflow-hidden rounded-t-xl md:overflow-hidden md:rounded-t-xl max-[480px]:rounded-t-lg property-carousel:overflow-hidden browse-property-carousel:overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-[300px] object-cover object-center block bg-gray-100 transition-transform duration-300 ease-out rounded-t-xl overflow-hidden group-hover:scale-105 md:h-[140px] md:rounded-none md:object-cover property-carousel:h-[180px] browse-property-carousel:h-[180px] max-[480px]:h-[200px] max-[480px]:rounded-none"
          onError={(e) => {
            // Fallback to default image if the provided image fails to load
            e.currentTarget.src = ASSETS.PLACEHOLDER_PROPERTY_MAIN
          }}
        />
          <div className="flex flex-row items-center absolute bottom-3 right-3 gap-2 overflow-visible flex-shrink-0 z-10 bg-white/95 backdrop-blur-sm p-1.5 rounded-lg shadow-[0px_2px_8px_rgba(0,0,0,0.15)] transition-all duration-200 rounded-lg md:bottom-2 md:right-2 md:gap-1.5 md:p-1 max-[480px]:bottom-2 max-[480px]:right-2 max-[480px]:p-1 max-[480px]:gap-1.5 property-carousel:bottom-2 property-carousel:right-2 property-carousel:gap-1.5 property-carousel:p-1 browse-property-carousel:bottom-2 browse-property-carousel:right-2 browse-property-carousel:gap-1.5 browse-property-carousel:p-1">
            <button className="w-[31px] h-[31px] rounded-[20%] bg-white border border-gray-200 flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-red-50 hover:border-red-300 hover:scale-105 md:!static md:!w-7 md:!h-7 md:!bg-transparent md:!border-none md:!rounded-none md:!shadow-none md:!p-1 md:!m-0 md:flex md:items-center md:justify-center md:active:scale-95 max-[480px]:!w-6 max-[480px]:!h-6 max-[480px]:!p-0.5" aria-label="Add to favorites">
              <svg viewBox="0 0 24 24" fill="#ef4444" className="w-[18px] h-[18px] md:!w-5 md:!h-5 md:!p-0 property-carousel:!w-8 property-carousel:!h-8 property-carousel:p-1.5 browse-property-carousel:!w-7 browse-property-carousel:!h-7 browse-property-carousel:p-1.5 max-[480px]:!w-[18px] max-[480px]:!h-[18px] max-[480px]:!p-0" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
            <div className="relative flex items-center justify-end" ref={sharePopupRef}>
              <button
                className="w-8 h-8 border-none bg-transparent cursor-pointer flex items-center justify-center p-1.5 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:-translate-y-0.5 md:w-7 md:h-7 md:p-1 max-[480px]:w-6 max-[480px]:h-6 max-[480px]:p-0.5"
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
                <div className="absolute bottom-[calc(100%+8px)] right-0 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15),0_2px_8px_rgba(0,0,0,0.1)] p-2 z-[1000] min-w-[160px] flex flex-col gap-1 border border-gray-200 before:content-[''] before:absolute before:-bottom-1.5 before:right-3 before:w-3 before:h-3 before:bg-white before:border-l before:border-l-gray-200 before:border-t-0 before:border-b before:border-b-gray-200 before:rotate-45 md:bottom-auto md:top-[calc(100%+8px)] md:min-w-[140px] md:p-1.5 md:gap-0.5 md:before:bottom-auto md:before:-top-1.5 md:before:border-l md:before:border-l-gray-200 md:before:border-b-0 md:before:border-t md:before:border-t-gray-200 md:before:rotate-45 max-[480px]:bottom-auto max-[480px]:top-[calc(100%+8px)] max-[480px]:min-w-[130px] max-[480px]:p-[5px] max-[480px]:gap-0.5 max-[480px]:before:bottom-auto max-[480px]:before:-top-1.5 max-[480px]:before:border-l max-[480px]:before:border-l-gray-200 max-[480px]:before:border-b-0 max-[480px]:before:border-t max-[480px]:before:border-t-gray-200 max-[480px]:before:rotate-45">
                  <button
                    className="flex items-center gap-3 px-3 py-2.5 border-none bg-transparent cursor-pointer rounded-lg transition-all duration-200 font-outfit text-sm font-medium text-gray-700 text-left w-full hover:bg-gray-100 md:px-2.5 md:py-2 md:text-[13px] md:gap-2.5 max-[480px]:px-[9px] max-[480px]:py-[7px] max-[480px]:text-xs max-[480px]:gap-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleShare('facebook')
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="#1877F2" className="w-5 h-5 flex-shrink-0 md:w-[18px] md:h-[18px] max-[480px]:w-4 max-[480px]:h-4" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                    <span className="flex-1">Facebook</span>
                  </button>
                  <button
                    className="flex items-center gap-3 px-3 py-2.5 border-none bg-transparent cursor-pointer rounded-lg transition-all duration-200 font-outfit text-sm font-medium text-gray-700 text-left w-full hover:bg-gray-100 md:px-2.5 md:py-2 md:text-[13px] md:gap-2.5 max-[480px]:px-[9px] max-[480px]:py-[7px] max-[480px]:text-xs max-[480px]:gap-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleShare('whatsapp')
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="#25D366" className="w-5 h-5 flex-shrink-0 md:w-[18px] md:h-[18px] max-[480px]:w-4 max-[480px]:h-4" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 20.2c-.151.504.335.99.839.839l3.032-.892A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                      <path d="M9.5 8.5c-.15-.35-.3-.36-.45-.36h-.4c-.15 0-.4.05-.6.3-.2.25-.75.75-.75 1.8s.75 2.1.85 2.25c.1.15 1.5 2.3 3.65 3.2.5.2.9.35 1.2.45.5.15.95.15 1.3.1.4-.05 1.25-.5 1.4-1s.15-1 .1-1.05c-.05-.1-.2-.15-.4-.25l-1.2-.6c-.2-.1-.35-.15-.5.15-.15.3-.6.75-.75.9-.15.15-.25.15-.45.05-.2-.1-.85-.3-1.6-1-.6-.55-1-1.2-1.1-1.4-.1-.2 0-.3.1-.4.1-.1.2-.25.3-.35.1-.1.15-.2.2-.3.05-.1.05-.2 0-.3-.05-.1-.5-1.2-.7-1.65z" fill="#FFFFFF" />
                    </svg>
                    <span className="flex-1">WhatsApp</span>
                  </button>
                  <button
                    className="flex items-center gap-3 px-3 py-2.5 border-none bg-transparent cursor-pointer rounded-lg transition-all duration-200 font-outfit text-sm font-medium text-gray-700 text-left w-full hover:bg-gray-100 md:px-2.5 md:py-2 md:text-[13px] md:gap-2.5 max-[480px]:px-[9px] max-[480px]:py-[7px] max-[480px]:text-xs max-[480px]:gap-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleShare('gmail')
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="#EA4335" className="w-5 h-5 flex-shrink-0 md:w-[18px] md:h-[18px] max-[480px]:w-4 max-[480px]:h-4" xmlns="http://www.w3.org/2000/svg">
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
      <div className="flex-[0_0_auto] flex flex-col px-[18px] py-[11px] gap-1 overflow-visible md:p-2.5 md:gap-1.5 property-carousel:p-3 property-carousel:gap-2 browse-property-carousel:p-3 browse-property-carousel:gap-2 max-[480px]:p-3 max-[480px]:gap-2">
        <div className="flex justify-between items-center gap-2 md:flex-wrap md:gap-1 md:mb-0.5 property-carousel:gap-2 property-carousel:mb-1 browse-property-carousel:gap-0.5 browse-property-carousel:mb-px max-[480px]:gap-2 max-[480px]:mb-1 max-[480px]:items-center">
          <p className="text-[#205ed7] font-outfit text-[15px] font-semibold uppercase tracking-wide whitespace-nowrap overflow-hidden text-ellipsis md:text-[9px] md:px-1.5 md:py-0.5 md:bg-blue-50 md:rounded md:inline-block md:font-medium property-carousel:text-[9px] property-carousel:px-1.5 property-carousel:py-0.5 browse-property-carousel:text-[6px] browse-property-carousel:px-0.5 browse-property-carousel:py-px max-[480px]:text-[11px] max-[480px]:px-2 max-[480px]:py-1">{propertyType}</p>
          <p className="text-gray-400 font-outfit text-[15px] font-medium whitespace-nowrap md:text-[9px] md:ml-auto md:text-gray-500 property-carousel:text-[9px] browse-property-carousel:text-[6px] max-[480px]:text-[11px]">{date}</p>
        </div>
        <div className="flex justify-between items-center gap-2 min-w-0 relative overflow-visible md:flex-row md:items-center md:justify-between md:gap-1 property-carousel:gap-1 browse-property-carousel:gap-1 max-[480px]:gap-1">
          <p className="text-[#205ED7] font-outfit text-[32px] font-bold whitespace-nowrap flex-shrink-0 min-w-fit md:text-base md:font-bold md:text-[#205ED7] md:leading-tight property-carousel:text-lg browse-property-carousel:text-xs max-[480px]:text-lg">{price}</p>
        </div>
        <h3 className="text-gray-900 font-outfit text-base font-semibold leading-[1.4] m-0 -mt-2.5 mb-5 overflow-hidden max-h-11 line-clamp-2 [-webkit-line-clamp:2] [-webkit-box-orient:vertical] [display:-webkit-box] md:text-xs md:font-semibold md:leading-tight md:m-0 md:line-clamp-2 md:[-webkit-line-clamp:2] md:max-h-8 md:text-gray-900 md:overflow-hidden md:text-ellipsis property-carousel:text-[13px] property-carousel:max-h-9 browse-property-carousel:text-[8px] browse-property-carousel:max-h-5 browse-property-carousel:leading-tight max-[480px]:text-sm max-[480px]:max-h-10 max-[480px]:leading-tight">
          {title}{location ? `, ${location}` : ''}
        </h3>

        <div className="flex gap-2 px-2 py-2 bg-blue-50 rounded-lg mt-auto flex-shrink-0 md:hidden property-carousel:px-2 property-carousel:py-1.5 property-carousel:gap-1.5 browse-property-carousel:p-1 browse-property-carousel:gap-1 max-[480px]:px-2.5 max-[480px]:py-2 max-[480px]:mt-2 max-[480px]:gap-2 max-[480px]:flex">
          <img
            src={ASSETS.LOGO_ICON}
            alt="Rentals.ph Official"
            className="w-9 h-9 rounded-full border-2 border-[#205ed7] object-cover bg-white flex-shrink-0 property-carousel:w-7 property-carousel:h-7 browse-property-carousel:w-5 browse-property-carousel:h-5 max-[480px]:w-8 max-[480px]:h-8"
          />
          <div className="flex flex-col gap-0.5 min-w-0 property-carousel:gap-0.5 browse-property-carousel:gap-0.5 max-[480px]:gap-0.5">
            <p className="text-[#205ed7] font-outfit text-[13px] font-semibold leading-tight overflow-hidden text-ellipsis whitespace-nowrap property-carousel:text-[10px] browse-property-carousel:text-[7px] max-[480px]:text-xs">{rentManagerName}</p>
            <p className="text-blue-400 font-outfit text-[11px] font-normal leading-tight uppercase tracking-wide property-carousel:text-[8px] browse-property-carousel:text-[6px] max-[480px]:text-[10px]">{rentManagerRole}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center h-12 border-t border-gray-200 bg-gray-50 flex-shrink-0 mt-auto gap-0 rounded-b-lg md:h-auto md:min-h-0 md:border-t md:border-gray-200 md:bg-gray-50 md:p-2 md:px-1.5 md:gap-0 md:flex-wrap md:justify-around property-carousel:h-10 property-carousel:py-1.5 property-carousel:px-1 property-carousel:flex property-carousel:items-center property-carousel:justify-around browse-property-carousel:h-8 browse-property-carousel:py-0.5 browse-property-carousel:px-px browse-property-carousel:flex browse-property-carousel:items-center browse-property-carousel:justify-around max-[480px]:h-auto max-[480px]:min-h-11 max-[480px]:p-2 max-[480px]:px-1.5 max-[480px]:flex max-[480px]:items-center max-[480px]:justify-around max-[480px]:gap-0">
        <div className="flex-1 flex items-center justify-center gap-[5px] border-r border-gray-200 px-1 py-2 w-full min-w-0 box-border relative cursor-help md:flex-[1_1_calc(33.333%-8px)] md:min-w-[70px] md:px-1 md:py-1.5 md:flex-row md:gap-0.5 md:border-r md:border-gray-200 md:border-b-0 md:bg-transparent md:rounded-lg md:transition-colors md:duration-200 md:active:bg-gray-100 md:nth-[3n]:border-r-0 property-carousel:flex-1 property-carousel:flex property-carousel:items-center property-carousel:justify-center property-carousel:px-0.5 property-carousel:py-1 property-carousel:gap-0.5 property-carousel:border-r property-carousel:border-gray-200 browse-property-carousel:flex-1 browse-property-carousel:flex browse-property-carousel:items-center browse-property-carousel:justify-center browse-property-carousel:px-px browse-property-carousel:py-0.5 browse-property-carousel:gap-0.5 browse-property-carousel:border-r browse-property-carousel:border-gray-200 max-[480px]:flex-1 max-[480px]:flex max-[480px]:items-center max-[480px]:justify-center max-[480px]:px-1 max-[480px]:py-1.5 max-[480px]:gap-1 max-[480px]:border-r max-[480px]:border-gray-200 max-[480px]:min-w-0" title="Bedrooms">
          <div className="relative flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="#6b7280" className="w-5 h-5 flex-shrink-0 transition-transform duration-200 hover:scale-110 md:w-3 md:h-3 property-carousel:w-3 property-carousel:h-3 browse-property-carousel:w-2 browse-property-carousel:h-2 max-[480px]:w-3.5 max-[480px]:h-3.5" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="10" width="18" height="7" rx="2" />
              <rect x="7" y="7" width="4" height="3" rx="1" />
              <rect x="13" y="7" width="4" height="3" rx="1" />
              <path d="M3 17v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" />
            </svg>
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-2 bg-gray-900 text-white px-3 py-1.5 rounded-md font-outfit text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none transition-all duration-200 z-[1000] mb-1 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-[5px] after:border-transparent after:border-t-gray-900 group-hover:opacity-100 group-hover:-translate-y-0 md:hidden">Bedrooms</span>
          </div>
          <span className="text-gray-700 font-outfit text-[13px] font-semibold md:text-[9px] md:font-semibold md:text-gray-900 md:whitespace-nowrap property-carousel:text-[10px] browse-property-carousel:text-[7px] browse-property-carousel:whitespace-nowrap max-[480px]:text-[11px] max-[480px]:whitespace-nowrap">{bedrooms}</span>
        </div>
        <div className="flex-1 flex items-center justify-center gap-[5px] border-r border-gray-200 px-1 py-2 w-full min-w-0 box-border relative cursor-help md:flex-[1_1_calc(33.333%-8px)] md:min-w-[70px] md:px-1 md:py-1.5 md:flex-row md:gap-0.5 md:border-r md:border-gray-200 md:border-b-0 md:bg-transparent md:rounded-lg md:transition-colors md:duration-200 md:active:bg-gray-100 md:nth-[3n]:border-r-0 property-carousel:flex-1 property-carousel:flex property-carousel:items-center property-carousel:justify-center property-carousel:px-0.5 property-carousel:py-1 property-carousel:gap-0.5 property-carousel:border-r property-carousel:border-gray-200 browse-property-carousel:flex-1 browse-property-carousel:flex browse-property-carousel:items-center browse-property-carousel:justify-center browse-property-carousel:px-px browse-property-carousel:py-0.5 browse-property-carousel:gap-0.5 browse-property-carousel:border-r browse-property-carousel:border-gray-200 max-[480px]:flex-1 max-[480px]:flex max-[480px]:items-center max-[480px]:justify-center max-[480px]:px-1 max-[480px]:py-1.5 max-[480px]:gap-1 max-[480px]:border-r max-[480px]:border-gray-200 max-[480px]:min-w-0" title="Bathrooms">
          <div className="relative flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="#6b7280" className="w-5 h-5 flex-shrink-0 transition-transform duration-200 hover:scale-110 md:w-3 md:h-3 property-carousel:w-3 property-carousel:h-3 browse-property-carousel:w-2 browse-property-carousel:h-2 max-[480px]:w-3.5 max-[480px]:h-3.5" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="10" width="18" height="8" rx="2" />
              <rect x="5" y="18" width="2" height="2" rx="1" />
              <rect x="17" y="18" width="2" height="2" rx="1" />
              <path d="M3 18h18" />
            </svg>
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-2 bg-gray-900 text-white px-3 py-1.5 rounded-md font-outfit text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none transition-all duration-200 z-[1000] mb-1 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-[5px] after:border-transparent after:border-t-gray-900 group-hover:opacity-100 group-hover:-translate-y-0 md:hidden">Bathrooms</span>
          </div>
          <span className="text-gray-700 font-outfit text-[13px] font-semibold md:text-[9px] md:font-semibold md:text-gray-900 md:whitespace-nowrap property-carousel:text-[10px] browse-property-carousel:text-[7px] browse-property-carousel:whitespace-nowrap max-[480px]:text-[11px] max-[480px]:whitespace-nowrap">{bathrooms}</span>
        </div>
        <div className="flex-1 flex items-center justify-center gap-[5px] px-1 py-2 w-full min-w-0 box-border relative cursor-help md:flex-[1_1_calc(33.333%-8px)] md:min-w-[70px] md:px-1 md:py-1.5 md:flex-row md:gap-0.5 md:border-r md:border-gray-200 md:border-b-0 md:bg-transparent md:rounded-lg md:transition-colors md:duration-200 md:active:bg-gray-100 md:nth-[3n]:border-r-0 property-carousel:flex-1 property-carousel:flex property-carousel:items-center property-carousel:justify-center property-carousel:px-0.5 property-carousel:py-1 property-carousel:gap-0.5 property-carousel:last:border-r-0 browse-property-carousel:flex-1 browse-property-carousel:flex browse-property-carousel:items-center browse-property-carousel:justify-center browse-property-carousel:px-px browse-property-carousel:py-0.5 browse-property-carousel:gap-0.5 browse-property-carousel:last:border-r-0 max-[480px]:flex-1 max-[480px]:flex max-[480px]:items-center max-[480px]:justify-center max-[480px]:px-1 max-[480px]:py-1.5 max-[480px]:gap-1 max-[480px]:last:border-r-0 max-[480px]:min-w-0" title="Property Size">
          <div className="relative flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="#6b7280" className="w-5 h-5 flex-shrink-0 transition-transform duration-200 hover:scale-110 md:w-3 md:h-3 property-carousel:w-3 property-carousel:h-3 browse-property-carousel:w-2 browse-property-carousel:h-2 max-[480px]:w-3.5 max-[480px]:h-3.5" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="17" width="20" height="4" rx="1" />
              <rect x="2" y="3" width="20" height="4" rx="1" />
              <rect x="2" y="10" width="20" height="4" rx="1" />
              <rect x="5" y="6" width="2" height="12" rx="1" />
              <rect x="11" y="6" width="2" height="12" rx="1" />
              <rect x="17" y="6" width="2" height="12" rx="1" />
            </svg>
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-2 bg-gray-900 text-white px-3 py-1.5 rounded-md font-outfit text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none transition-all duration-200 z-[1000] mb-1 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-[5px] after:border-transparent after:border-t-gray-900 group-hover:opacity-100 group-hover:-translate-y-0 md:hidden">Property Size</span>
          </div>
          <span className="text-gray-700 font-outfit text-[13px] font-semibold md:text-[9px] md:font-semibold md:text-gray-900 md:whitespace-nowrap property-carousel:text-[10px] browse-property-carousel:text-[7px] browse-property-carousel:whitespace-nowrap max-[480px]:text-[11px] max-[480px]:whitespace-nowrap">{propertySize}</span>
        </div>
      </div>
    </article>
  )
}

export default VerticalPropertyCard