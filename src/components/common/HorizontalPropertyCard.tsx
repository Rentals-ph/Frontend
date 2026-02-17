'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ASSETS } from '@/utils/assets'
import SharePopup, { type SharePlatform } from './SharePopup'

interface HorizontalPropertyCardProps {
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

function HorizontalPropertyCard({
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
}: HorizontalPropertyCardProps) {
  const router = useRouter()
  const [showSharePopup, setShowSharePopup] = useState(false)

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on buttons or links
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('svg')) {
      return
    }
    if (id) {
      router.push(`/property/${id}`)
    }
  }

  const handleShare = (platform: SharePlatform) => {
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
  }

  return (
    <article
      className="bg-white rounded-xl border border-gray-200 overflow-visible relative flex flex-row shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_rgba(0,0,0,0.06)] transition-all duration-200 ease-in-out flex-shrink-0 w-full min-h-[280px] hover:-translate-y-1 hover:shadow-[0px_10px_20px_rgba(0,0,0,0.1),0px_4px_8px_rgba(0,0,0,0.08)] hover:[&>img]:scale-105 md:flex-col md:min-h-0 md:rounded-xl md:shadow-[0px_2px_8px_rgba(0,0,0,0.06),0px_1px_3px_rgba(0,0,0,0.04)] md:mb-0 md:hover:translate-y-0 md:hover:shadow-[0px_4px_12px_rgba(0,0,0,0.08),0px_2px_4px_rgba(0,0,0,0.04)] md:active:scale-[0.98] sm:rounded-[10px] sm:mb-0"
      onClick={handleCardClick}
      style={{ cursor: id ? 'pointer' : 'default' }}
    >
      <img
        src={image}
        alt={title}
        className="w-[400px] min-w-[300px] h-full min-h-[280px] object-cover object-center flex-shrink-0 block bg-gray-100 transition-transform duration-300 ease-in-out rounded-l-xl overflow-hidden md:w-full md:min-w-full md:h-[140px] md:min-h-[140px] md:rounded-t-xl md:rounded-bl-none md:overflow-hidden md:hover:transform-none sm:h-[120px] sm:min-h-[120px] sm:rounded-t-[10px]"
        onError={(e) => {
          // Fallback to default image if the provided image fails to load
          e.currentTarget.src = ASSETS.PLACEHOLDER_PROPERTY_MAIN
        }}
      />
      <div className="flex-1 flex flex-col p-[18px] gap-2 min-w-0 overflow-visible md:p-2.5 md:gap-1.5 sm:p-2 sm:gap-[5px]">
        <div className="flex justify-between items-center gap-2 md:flex-wrap md:gap-1 md:mb-0.5">
          <p className="text-[#205ed7] font-outfit text-[13px] font-semibold uppercase tracking-wide whitespace-nowrap overflow-hidden text-ellipsis m-0 md:text-[9px] md:px-1.5 md:py-0.5 md:bg-blue-50 md:rounded md:inline-block md:font-medium sm:text-[8px] sm:px-1 sm:py-0.5">{propertyType}</p>
          <p className="text-gray-400 font-outfit text-xs font-medium whitespace-nowrap m-0 md:text-[9px] md:ml-auto md:text-gray-500 sm:text-[8px]">{date}</p>
        </div>
        <div className="flex justify-between items-center gap-2 min-w-0 overflow-visible md:flex-row md:items-center md:justify-between md:gap-1 md:mt-1">
          <p className="text-[#205ED7] font-outfit text-2xl font-bold tracking-tight whitespace-nowrap flex-shrink-0 min-w-fit m-0 md:text-base md:font-bold md:leading-tight sm:text-sm">{price}</p>
          <div className="relative flex items-center justify-end overflow-visible z-10">
            <button
              className="w-8 h-8 border-none bg-transparent cursor-pointer flex items-center justify-center p-1.5 rounded-lg transition-all duration-200 ease-in-out hover:bg-gray-100 hover:-translate-y-0.5 md:w-7 md:h-7 md:p-1 sm:w-6 sm:h-6 sm:p-0.5"
              onClick={(e) => {
                e.stopPropagation()
                setShowSharePopup(!showSharePopup)
              }}
              aria-label="Share property"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <circle cx="18" cy="5" r="3" stroke="#205ED7" strokeWidth="2" fill="none" />
                <circle cx="6" cy="12" r="3" stroke="#205ED7" strokeWidth="2" fill="none" />
                <circle cx="18" cy="19" r="3" stroke="#205ED7" strokeWidth="2" fill="none" />
                <path d="M8.59 13.51L15.42 17.49M15.41 6.51L8.59 10.49" stroke="#205ED7" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <SharePopup
              isOpen={showSharePopup}
              onClose={() => setShowSharePopup(false)}
              onShare={handleShare}
              position="top"
              align="right"
            />
          </div>
        </div>
        <h3 className="text-gray-900 font-outfit text-base font-semibold leading-relaxed m-0 line-clamp-2 overflow-hidden max-h-11 md:text-xs md:font-semibold md:leading-snug md:max-h-8 md:overflow-hidden md:text-ellipsis sm:text-[11px] sm:max-h-7">
          {title}{location ? `, ${location}` : ''}
        </h3>
        <div className="flex gap-2 p-2.5 bg-blue-50 rounded-lg flex-shrink-0 md:hidden">
          <img
            src={ASSETS.LOGO_ICON}
            alt="Rentals.ph Official"
            className="w-9 h-9 rounded-full border-2 border-[#205ed7] object-cover bg-white flex-shrink-0 md:w-10 md:h-10 sm:w-9 sm:h-9"
          />
          <div className="flex flex-col gap-0.5 min-w-0">
            <p className="text-[#205ed7] font-outfit text-[13px] font-semibold leading-tight overflow-hidden text-ellipsis whitespace-nowrap m-0 md:text-sm sm:text-[13px]">{rentManagerName}</p>
            <p className="text-blue-400 font-outfit text-[11px] font-normal leading-tight uppercase tracking-wide m-0 md:text-xs sm:text-[11px]">{rentManagerRole}</p>
          </div>
        </div>
        <div className="flex items-center gap-0 mt-auto pt-3 border-t border-gray-200 flex-shrink-0 md:gap-0 md:pt-2 md:border-t md:border-gray-200 md:bg-[#FAFAFA] md:mt-1 md:px-1.5 md:py-2 md:rounded-b-xl md:justify-around sm:px-1 sm:py-1.5">
          <div className="flex-1 flex items-center justify-center gap-[5px] border-r border-gray-200 px-1 py-1.5 w-full min-w-0 relative cursor-help box-border last:border-r-0 group md:flex-[0_0_auto] md:min-w-0 md:px-1 md:py-0.5 md:flex-row md:gap-0.5 md:border-r-0 md:border-b-0 md:bg-transparent md:rounded md:transition-all md:active:bg-gray-100 sm:px-1 sm:py-0.5 sm:gap-0.5" title="Bedrooms">
            <div className="relative flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0 transition-transform duration-200 ease-in-out group-hover:scale-110 md:w-3 md:h-3 md:flex-shrink-0 sm:w-3 sm:h-3">
                <path d="M3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 9H21" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
                <path d="M7 13H7.01" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M11 13H11.01" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 13H15.01" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M19 13H19.01" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-2 bg-gray-900 text-white px-3 py-1.5 rounded-md font-outfit text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none transition-all duration-200 ease-in-out z-[1000] mb-1 group-hover:opacity-100 group-hover:translate-y-0 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-[5px] after:border-transparent after:border-t-gray-900 md:hidden">Bedrooms</span>
            </div>
            <span className="text-gray-700 font-outfit text-[13px] font-semibold md:text-[9px] md:font-semibold md:text-gray-900 md:whitespace-nowrap sm:text-[9px]">{bedrooms}</span>
          </div>
          <div className="flex-1 flex items-center justify-center gap-[5px] border-r border-gray-200 px-1 py-1.5 w-full min-w-0 relative cursor-help box-border last:border-r-0 group md:flex-[0_0_auto] md:min-w-0 md:px-1 md:py-0.5 md:flex-row md:gap-0.5 md:border-r-0 md:border-b-0 md:bg-transparent md:rounded md:transition-all md:active:bg-gray-100 sm:px-1 sm:py-0.5 sm:gap-0.5" title="Bathrooms">
            <div className="relative flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0 transition-transform duration-200 ease-in-out group-hover:scale-110 md:w-3 md:h-3 md:flex-shrink-0 sm:w-3 sm:h-3">
                <path d="M8 2V6M16 2V6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
                <path d="M3 6H21C22.1046 6 23 6.89543 23 8V20C23 21.1046 22.1046 22 21 22H3C1.89543 22 1 21.1046 1 20V8C1 6.89543 1.89543 6 3 6Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 12H6.01" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18 12H18.01" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 16H6.01" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18 16H18.01" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-2 bg-gray-900 text-white px-3 py-1.5 rounded-md font-outfit text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none transition-all duration-200 ease-in-out z-[1000] mb-1 group-hover:opacity-100 group-hover:translate-y-0 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-[5px] after:border-transparent after:border-t-gray-900 md:hidden">Bathrooms</span>
            </div>
            <span className="text-gray-700 font-outfit text-[13px] font-semibold md:text-[9px] md:font-semibold md:text-gray-900 md:whitespace-nowrap sm:text-[9px]">{bathrooms}</span>
          </div>
          <div className="flex-1 flex items-center justify-center gap-[5px] border-r border-gray-200 px-1 py-1.5 w-full min-w-0 relative cursor-help box-border last:border-r-0 group md:flex-[0_0_auto] md:min-w-0 md:px-1 md:py-0.5 md:flex-row md:gap-0.5 md:border-r-0 md:border-b-0 md:bg-transparent md:rounded md:transition-all md:active:bg-gray-100 sm:px-1 sm:py-0.5 sm:gap-0.5" title="Property Size">
            <div className="relative flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0 transition-transform duration-200 ease-in-out group-hover:scale-110 md:w-3 md:h-3 md:flex-shrink-0 sm:w-3 sm:h-3">
                <path d="M3 3H21V21H3V3Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 9H21" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
                <path d="M9 3V21" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 9H12.01" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 15H12.01" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-2 bg-gray-900 text-white px-3 py-1.5 rounded-md font-outfit text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none transition-all duration-200 ease-in-out z-[1000] mb-1 group-hover:opacity-100 group-hover:translate-y-0 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-[5px] after:border-transparent after:border-t-gray-900 md:hidden">Property Size</span>
            </div>
            <span className="text-gray-700 font-outfit text-[13px] font-semibold md:text-[9px] md:font-semibold md:text-gray-900 md:whitespace-nowrap sm:text-[9px]">{propertySize}</span>
          </div>
        </div>
      </div>
    </article>
  )
}

export default HorizontalPropertyCard
