'use client'

import { useState } from 'react'
import AppSidebar from '../../../components/common/AppSidebar'
import {
  FiBell,
  FiPlus,
  FiChevronDown,
} from 'react-icons/fi'
// import './page.css' // Removed - converted to Tailwind

interface Listing {
  id: number
  propertyTitle: string
  listedBy: string
  role: 'Agent' | 'Unit Manager'
  category: string
  priceRange: string
  status: 'Active' | 'Pending' | 'Rented' | 'Featured'
}

const listingsData: Listing[] = [
  {
    id: 1,
    propertyTitle: 'Modern Studio in BGC',
    listedBy: 'Angelo Reyes',
    role: 'Agent',
    category: 'Studio',
    priceRange: '₱25k – ₱30k',
    status: 'Active',
  },
  {
    id: 2,
    propertyTitle: 'Luxury Loft Unit 4B',
    listedBy: 'Gabo Dela Cruz',
    role: 'Unit Manager',
    category: 'Condo',
    priceRange: '₱85k – ₱100k',
    status: 'Active',
  },
  {
    id: 3,
    propertyTitle: 'Pet-Friendly Villa',
    listedBy: 'Sofia Mendoza',
    role: 'Agent',
    category: 'House & Lot',
    priceRange: '₱120k – ₱150k',
    status: 'Pending',
  },
  {
    id: 4,
    propertyTitle: 'Cozy Apartment QC',
    listedBy: 'Marco Valdez',
    role: 'Agent',
    category: 'Apartment',
    priceRange: '₱15k – ₱20k',
    status: 'Rented',
  },
  {
    id: 5,
    propertyTitle: 'Skyline Penthouse',
    listedBy: 'Camille Santos',
    role: 'Unit Manager',
    category: 'Condo',
    priceRange: '₱200k+',
    status: 'Featured',
  },
]

export default function ListingsPage() {
  const [selectedListings, setSelectedListings] = useState<number[]>([])
  const [showFilter, setShowFilter] = useState(false)

  const allSelected = selectedListings.length === listingsData.length && listingsData.length > 0

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedListings([])
    } else {
      setSelectedListings(listingsData.map((l) => l.id))
    }
  }

  const toggleSelect = (id: number) => {
    setSelectedListings((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Active': return 'active'
      case 'Pending': return 'pending'
      case 'Rented': return 'rented'
      case 'Featured': return 'featured'
      default: return ''
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-outfit"> {/* broker-dashboard */}
      <AppSidebar />
      <main className="ml-[280px] flex-1 w-[calc(100%-280px)] p-8 min-h-screen lg:ml-[240px] lg:w-[calc(100%-240px)] lg:p-6 md:ml-0 md:w-full md:p-4 md:pt-15"> {/* broker-main */}
        {/* Header */}
        <header className="flex items-center justify-between mb-7 md:flex-col md:items-start md:gap-3.5"> {/* broker-header */}
          <div> {/* broker-header-left */}
            <h1 className="text-2xl font-bold text-gray-900 m-0 mb-1 md:text-xl">Listings</h1>
            <p className="text-sm text-gray-400 m-0">Manage your team members&apos; created listings.</p>
          </div>
          <div className="flex items-center gap-3.5 md:w-full md:justify-between md:gap-2.5"> {/* broker-header-right */}
            <button className="w-10.5 h-10.5 rounded-full border border-gray-200 bg-white flex items-center justify-center cursor-pointer text-gray-600 text-lg transition-all hover:bg-gray-50 hover:text-gray-900 md:w-9.5 md:h-9.5 md:text-base md:flex-shrink-0"> {/* broker-notification-btn */}
              <FiBell />
            </button>
            <a href="/broker/create-listing" className="bg-blue-600 text-white border-none py-2.5 px-5.5 rounded-lg text-sm font-semibold cursor-pointer flex items-center gap-2 transition-colors no-underline hover:bg-blue-700 md:py-2.25 md:px-4.5 md:text-xs md:flex-1 md:justify-center md:min-w-0"> {/* broker-add-listing-btn */}
              <FiPlus />
              Add Listing
            </a>
          </div>
        </header>

        {/* Listings Table */}
        <div className="bg-white rounded-2xl shadow-sm py-7 px-8 mt-2 md:py-5 md:px-3 md:rounded-xl sm:py-3 sm:px-2 sm:rounded-lg"> {/* bl-table-card */}
          <div className="flex items-center justify-between mb-5 md:flex-col md:items-start md:gap-3 md:mb-4 sm:mb-3"> {/* bl-table-header */}
            <h3 className="text-lg font-bold text-slate-800 md:text-base sm:text-base">Listings</h3> {/* bl-table-title */}
            <button
              className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg py-2 px-4.5 text-sm text-slate-600 cursor-pointer transition-colors hover:border-gray-300 md:w-full md:justify-center md:py-2.5 md:px-4.5 md:text-sm sm:py-2.25 sm:px-4 sm:text-xs" // bl-filter-btn
              onClick={() => setShowFilter(!showFilter)}
            >
              Filter <FiChevronDown />
            </button>
          </div>

          {/* Desktop Table View */}
          <div className="overflow-x-auto md:hidden"> {/* bl-table-wrapper */}
            <table className="w-full border-collapse min-w-[800px] lg:min-w-[700px]"> {/* bl-table */}
              <thead>
                <tr>
                  <th className="w-11 text-center text-left py-3 px-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b-[1.5px] border-slate-100 whitespace-nowrap"> {/* bl-th-check */}
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="w-4.5 h-4.5 accent-blue-600 cursor-pointer rounded" // bl-checkbox
                    />
                  </th>
                  <th className="text-left py-3 px-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b-[1.5px] border-slate-100 whitespace-nowrap">Property Title</th>
                  <th className="text-left py-3 px-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b-[1.5px] border-slate-100 whitespace-nowrap">Listed By</th>
                  <th className="text-left py-3 px-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b-[1.5px] border-slate-100 whitespace-nowrap">Role</th>
                  <th className="text-left py-3 px-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b-[1.5px] border-slate-100 whitespace-nowrap">Category</th>
                  <th className="text-left py-3 px-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b-[1.5px] border-slate-100 whitespace-nowrap">Price Range</th>
                  <th className="text-left py-3 px-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b-[1.5px] border-slate-100 whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody>
                {listingsData.map((listing) => (
                  <tr key={listing.id} className="hover:bg-slate-50">
                    <td className="w-11 text-center py-3.5 px-3.5 text-base text-slate-700 border-b border-slate-100 last:border-b-0 align-middle"> {/* bl-td-check */}
                      <input
                        type="checkbox"
                        checked={selectedListings.includes(listing.id)}
                        onChange={() => toggleSelect(listing.id)}
                        className="w-4.5 h-4.5 accent-blue-600 cursor-pointer rounded" // bl-checkbox
                      />
                    </td>
                    <td className="py-3.5 px-3.5 text-base text-slate-700 border-b border-slate-100 last:border-b-0 align-middle font-semibold text-slate-800">{listing.propertyTitle}</td> {/* bl-td-title */}
                    <td className="py-3.5 px-3.5 text-base text-slate-700 border-b border-slate-100 last:border-b-0 align-middle text-slate-600">{listing.listedBy}</td> {/* bl-td-by */}
                    <td className="py-3.5 px-3.5 text-base text-slate-700 border-b border-slate-100 last:border-b-0 align-middle text-slate-500">{listing.role}</td> {/* bl-td-role */}
                    <td className="py-3.5 px-3.5 text-base text-slate-700 border-b border-slate-100 last:border-b-0 align-middle text-slate-500">{listing.category}</td> {/* bl-td-category */}
                    <td className="py-3.5 px-3.5 text-base text-slate-700 border-b border-slate-100 last:border-b-0 align-middle font-medium text-slate-700">{listing.priceRange}</td> {/* bl-td-price */}
                    <td className="py-3.5 px-3.5 text-base text-slate-700 border-b border-slate-100 last:border-b-0 align-middle"> {/* bl-td-status */}
                      <span className={`inline-block py-1 px-3.5 rounded-full text-xs font-semibold text-center min-w-[72px] md:text-xs md:py-0.75 md:px-3 md:min-w-[65px] sm:text-[11px] sm:py-0.75 sm:px-2.5 sm:min-w-[60px] ${
                        listing.status === 'Active' ? 'bg-emerald-200 text-emerald-700' :
                        listing.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                        listing.status === 'Rented' ? 'bg-slate-100 text-slate-600' :
                        listing.status === 'Featured' ? 'bg-blue-100 text-blue-600' : ''
                      }`}> {/* bl-status-badge */}
                        {listing.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="hidden md:block"> {/* bl-mobile-cards */}
            <div className="flex items-center justify-end mb-4 pb-3 border-b border-slate-100 sm:mb-3 sm:pb-2.5"> {/* bl-mobile-header-actions */}
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer font-medium sm:text-xs"> {/* bl-mobile-select-all */}
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="w-4.5 h-4.5 accent-blue-600 cursor-pointer rounded" // bl-checkbox
                />
                <span>Select All</span>
              </label>
            </div>
            {listingsData.map((listing) => (
              <div key={listing.id} className="bg-slate-50 border border-gray-200 rounded-xl p-4 mb-3 transition-all hover:shadow-md hover:border-slate-300 md:p-3.5 sm:p-3 sm:mb-2.5 sm:rounded-lg"> {/* bl-mobile-card */}
                <div className="flex items-center justify-between mb-3"> {/* bl-mobile-card-header */}
                  <label className="flex items-center cursor-pointer"> {/* bl-mobile-checkbox-label */}
                    <input
                      type="checkbox"
                      checked={selectedListings.includes(listing.id)}
                      onChange={() => toggleSelect(listing.id)}
                      className="w-4.5 h-4.5 accent-blue-600 cursor-pointer rounded" // bl-checkbox
                    />
                  </label>
                  <span className={`inline-block py-1 px-3.5 rounded-full text-xs font-semibold text-center min-w-[72px] md:text-xs md:py-0.75 md:px-3 md:min-w-[65px] sm:text-[11px] sm:py-0.75 sm:px-2.5 sm:min-w-[60px] ${
                    listing.status === 'Active' ? 'bg-emerald-200 text-emerald-700' :
                    listing.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                    listing.status === 'Rented' ? 'bg-slate-100 text-slate-600' :
                    listing.status === 'Featured' ? 'bg-blue-100 text-blue-600' : ''
                  }`}> {/* bl-status-badge */}
                    {listing.status}
                  </span>
                </div>
                <div className="flex flex-col gap-2.5"> {/* bl-mobile-card-body */}
                  <h4 className="text-base font-semibold text-slate-800 m-0 mb-2 md:text-sm md:mb-2.5 sm:text-sm sm:mb-2.5">{listing.propertyTitle}</h4> {/* bl-mobile-title */}
                  <div className="flex flex-col gap-2 sm:gap-1.5"> {/* bl-mobile-details */}
                    <div className="flex items-center justify-between text-sm md:text-xs md:flex-wrap sm:text-xs sm:flex-wrap"> {/* bl-mobile-detail-row */}
                      <span className="text-slate-600 font-medium md:text-xs sm:text-xs">Listed By:</span> {/* bl-mobile-label */}
                      <span className="text-slate-700 font-medium text-right md:text-xs sm:text-xs">{listing.listedBy}</span> {/* bl-mobile-value */}
                    </div>
                    <div className="flex items-center justify-between text-sm md:text-xs md:flex-wrap sm:text-xs sm:flex-wrap"> {/* bl-mobile-detail-row */}
                      <span className="text-slate-600 font-medium md:text-xs sm:text-xs">Role:</span> {/* bl-mobile-label */}
                      <span className="text-slate-700 font-medium text-right md:text-xs sm:text-xs">{listing.role}</span> {/* bl-mobile-value */}
                    </div>
                    <div className="flex items-center justify-between text-sm md:text-xs md:flex-wrap sm:text-xs sm:flex-wrap"> {/* bl-mobile-detail-row */}
                      <span className="text-slate-600 font-medium md:text-xs sm:text-xs">Category:</span> {/* bl-mobile-label */}
                      <span className="text-slate-700 font-medium text-right md:text-xs sm:text-xs">{listing.category}</span> {/* bl-mobile-value */}
                    </div>
                    <div className="flex items-center justify-between text-sm md:text-xs md:flex-wrap sm:text-xs sm:flex-wrap"> {/* bl-mobile-detail-row */}
                      <span className="text-slate-600 font-medium md:text-xs sm:text-xs">Price Range:</span> {/* bl-mobile-label */}
                      <span className="text-slate-700 font-medium text-right font-semibold text-slate-800 md:text-xs sm:text-xs">{listing.priceRange}</span> {/* bl-mobile-value bl-mobile-price */}
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
