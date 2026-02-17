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
  onClick={handleCardClick}
  style={{ cursor: id ? 'pointer' : 'default' }}
  className="w-full bg-white border border-gray-200 rounded-2xl overflow-hidden flex items-stretch shadow-sm hover:shadow-md transition"
>
  {/* LEFT IMAGE */}
  <div className="w-[420px] flex-shrink-0 self-stretch">
    <img
      src={image}
      alt={title}
      className="w-full h-full object-cover"
      onError={(e) => {
        e.currentTarget.src = ASSETS.PLACEHOLDER_PROPERTY_MAIN
      }}
    />
  </div>

  {/* RIGHT CONTENT */}
  <div className="flex flex-col flex-1 p-6 gap-4">
    {/* TOP ROW */}
    <div className="flex justify-between items-start">
      <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
        {propertyType}
      </span>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">{date}</span>

        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowSharePopup(!showSharePopup)
          }}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5"
            fill="none"
            stroke="#2563eb"
            strokeWidth="2"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="M8.59 13.51L15.42 17.49M15.41 6.51L8.59 10.49" />
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

    {/* PRICE */}
    <h2 className="text-2xl font-bold text-blue-600">
      {price}
    </h2>

    {/* TITLE */}
    <h3 className="text-lg font-semibold text-gray-900 leading-snug">
      {title}{location ? `, ${location}` : ''}
    </h3>

    {/* RENT MANAGER STRIP */}
    <div className="bg-gray-100 rounded-lg px-4 py-3 flex items-center gap-3">
      <img
        src={ASSETS.LOGO_ICON}
        alt="Rent Manager"
        className="w-10 h-10 rounded-full border border-blue-600 object-cover bg-white"
      />
      <div>
        <p className="text-sm font-semibold text-blue-600">
          {rentManagerName}
        </p>
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          {rentManagerRole}
        </p>
      </div>
    </div>

    {/* BOTTOM SPECS */}
    <div className="flex items-center justify-between border-t pt-4 text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-800">{bedrooms}</span>
        <span>Beds</span>
      </div>

      <div className="h-5 w-px bg-gray-300" />

      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-800">{bathrooms}</span>
        <span>Baths</span>
      </div>

      <div className="h-5 w-px bg-gray-300" />

      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-800">{propertySize}</span>
      </div>
    </div>
  </div>
</article>

  )
}

export default HorizontalPropertyCard
