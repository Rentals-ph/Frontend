'use client'

import { useState } from 'react'
import AppSidebar from '../../../components/common/AppSidebar'
import {
  FiBell,
  FiPlus,
  FiChevronDown,
} from 'react-icons/fi'
import './page.css'

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
    <div className="broker-dashboard">
      <AppSidebar />
      <main className="broker-main">
        {/* Header */}
        <header className="broker-header">
          <div className="broker-header-left">
            <h1>Listings</h1>
            <p>Manage your team members&apos; created listings.</p>
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

        {/* Listings Table */}
        <div className="bl-table-card">
          <div className="bl-table-header">
            <h3 className="bl-table-title">Listings</h3>
            <button
              className="bl-filter-btn"
              onClick={() => setShowFilter(!showFilter)}
            >
              Filter <FiChevronDown />
            </button>
          </div>

          <div className="bl-table-wrapper">
            <table className="bl-table">
              <thead>
                <tr>
                  <th className="bl-th-check">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="bl-checkbox"
                    />
                  </th>
                  <th>Property Title</th>
                  <th>Listed By</th>
                  <th>Role</th>
                  <th>Category</th>
                  <th>Price Range</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {listingsData.map((listing) => (
                  <tr key={listing.id}>
                    <td className="bl-td-check">
                      <input
                        type="checkbox"
                        checked={selectedListings.includes(listing.id)}
                        onChange={() => toggleSelect(listing.id)}
                        className="bl-checkbox"
                      />
                    </td>
                    <td className="bl-td-title">{listing.propertyTitle}</td>
                    <td className="bl-td-by">{listing.listedBy}</td>
                    <td className="bl-td-role">{listing.role}</td>
                    <td className="bl-td-category">{listing.category}</td>
                    <td className="bl-td-price">{listing.priceRange}</td>
                    <td className="bl-td-status">
                      <span className={`bl-status-badge ${getStatusClass(listing.status)}`}>
                        {listing.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
