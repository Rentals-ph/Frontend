'use client'

import { useState } from 'react'
import AppSidebar from '../../../components/common/AppSidebar'
import {
  FiBell,
  FiPlus,
  FiChevronDown,
  FiTrendingUp,
  FiMessageCircle,
} from 'react-icons/fi'
import './page.css'

// Stats data
const statsData = [
  {
    icon: 'inquiries',
    label: 'Total Team Inquiries',
    value: '1,842',
    change: '↑ 15% from last month',
    changeColor: 'green',
    iconBg: '#DBEAFE',
    iconColor: '#3B82F6',
  },
  {
    icon: 'conversion',
    label: 'Conversion Rate',
    value: '12.4%',
    change: '↑ 2% from last month',
    changeColor: 'green',
    iconBg: '#FEF3C7',
    iconColor: '#F59E0B',
  },
  {
    icon: 'response',
    label: 'Average Response Time',
    value: '14 mins',
    change: '↓ 5 mins (Faster)',
    changeColor: 'green',
    iconBg: '#D1FAE5',
    iconColor: '#10B981',
  },
  {
    icon: 'channel',
    label: 'Most Active Channel',
    value: 'WhatsApp',
    change: '68% of total leads',
    changeColor: 'green',
    iconBg: '#D1FAE5',
    iconColor: '#10B981',
  },
]

// Team productivity data
const productivityData = [
  {
    name: 'Gabo Dela Cruz',
    totalListings: 18,
    totalInquiries: 245,
    mostPopular: 'Studio Unit – Avida Towers',
    ratio: 13.6,
  },
  {
    name: 'Camille Santos',
    totalListings: 12,
    totalInquiries: 198,
    mostPopular: '2BR Condo – IT Park',
    ratio: 16.5,
  },
  {
    name: 'Angelo Reyes',
    totalListings: 25,
    totalInquiries: 110,
    mostPopular: '1BR Loft – Makati',
    ratio: 4.4,
  },
  {
    name: 'Sofia Mendoza',
    totalListings: 5,
    totalInquiries: 82,
    mostPopular: 'Pet-Friendly Studio – BGC',
    ratio: 16.4,
  },
  {
    name: 'Marco Valdez',
    totalListings: 14,
    totalInquiries: 30,
    mostPopular: 'Cheap Apartment – QC',
    ratio: 2.1,
  },
]

function StatIcon({ type }: { type: string }) {
  switch (type) {
    case 'inquiries':
      return <FiMessageCircle />
    case 'conversion':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18" />
          <path d="M8 6h10v10" />
        </svg>
      )
    case 'response':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
    case 'channel':
      return <FiMessageCircle />
    default:
      return <FiMessageCircle />
  }
}

export default function ReportsPage() {
  const [selectedRows, setSelectedRows] = useState<number[]>([])

  const allSelected = selectedRows.length === productivityData.length && productivityData.length > 0

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([])
    } else {
      setSelectedRows(productivityData.map((_, i) => i))
    }
  }

  const toggleSelect = (i: number) => {
    setSelectedRows((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    )
  }

  return (
    <div className="broker-dashboard">
      <AppSidebar />
      <main className="broker-main">
        {/* Header */}
        <header className="broker-header">
          <div className="broker-header-left">
            <h1>Reports</h1>
            <p>You can view your team&apos;s performance, lead conversion, and inventory health.</p>
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

        {/* Stats Row */}
        <div className="rp-stats-grid">
          {statsData.map((stat, index) => (
            <div className="rp-stat-card" key={index}>
              <div
                className="rp-stat-icon"
                style={{ background: stat.iconBg, color: stat.iconColor }}
              >
                <StatIcon type={stat.icon} />
              </div>
              <div className="rp-stat-info">
                <div className="rp-stat-top">
                  <span className="rp-stat-label">{stat.label}</span>
                  <span className="rp-stat-change">{stat.change}</span>
                </div>
                <div className="rp-stat-value">{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Team Productivity Report Table */}
        <div className="rp-table-card">
          <div className="rp-table-header">
            <h3 className="rp-table-title">Team Productivity Report</h3>
            <button className="rp-filter-btn">
              Filter <FiChevronDown />
            </button>
          </div>

          <div className="rp-table-wrapper">
            <table className="rp-table">
              <thead>
                <tr>
                  <th className="rp-th-check">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="rp-checkbox"
                    />
                  </th>
                  <th>Agent Name</th>
                  <th>Total Listings</th>
                  <th>Total Inquiries</th>
                  <th>Most Popular Listing</th>
                  <th>Inquiry-to-Listing Ratio</th>
                </tr>
              </thead>
              <tbody>
                {productivityData.map((row, index) => (
                  <tr key={index}>
                    <td className="rp-td-check">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(index)}
                        onChange={() => toggleSelect(index)}
                        className="rp-checkbox"
                      />
                    </td>
                    <td className="rp-td-name">{row.name}</td>
                    <td className="rp-td-num">{row.totalListings}</td>
                    <td className="rp-td-num">{row.totalInquiries}</td>
                    <td className="rp-td-popular">{row.mostPopular}</td>
                    <td className="rp-td-num">{row.ratio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory Insights */}
        <h3 className="rp-section-title">Inventory Insights</h3>
        <div className="rp-insights-grid">
          {/* Listing Distribution - Pie Chart */}
          <div className="rp-chart-card">
            <h4 className="rp-chart-title">Listing Distribution</h4>
            <div className="rp-pie-container">
              <svg viewBox="0 0 200 200" className="rp-pie-chart">
                {/* Condos - 50% - Blue */}
                <circle cx="100" cy="100" r="70" fill="none" stroke="#3B82F6" strokeWidth="35"
                  strokeDasharray={`${0.50 * 439.82} 439.82`}
                  transform="rotate(-90 100 100)" />
                {/* Houses - 22.4% - Green */}
                <circle cx="100" cy="100" r="70" fill="none" stroke="#10B981" strokeWidth="35"
                  strokeDasharray={`${0.224 * 439.82} 439.82`}
                  strokeDashoffset={`${-0.50 * 439.82}`}
                  transform="rotate(-90 100 100)" />
                {/* Studios - 18.8% - Orange */}
                <circle cx="100" cy="100" r="70" fill="none" stroke="#F59E0B" strokeWidth="35"
                  strokeDasharray={`${0.188 * 439.82} 439.82`}
                  strokeDashoffset={`${-(0.50 + 0.224) * 439.82}`}
                  transform="rotate(-90 100 100)" />
                {/* Apartments - 8.82% - Red */}
                <circle cx="100" cy="100" r="70" fill="none" stroke="#EF4444" strokeWidth="35"
                  strokeDasharray={`${0.0882 * 439.82} 439.82`}
                  strokeDashoffset={`${-(0.50 + 0.224 + 0.188) * 439.82}`}
                  transform="rotate(-90 100 100)" />
                {/* Labels */}
                <text x="125" y="70" fontSize="7" fontWeight="700" fill="#fff">Houses</text>
                <text x="128" y="80" fontSize="6" fill="#fff">22.4%</text>
                <text x="80" y="105" fontSize="8" fontWeight="700" fill="#fff">Condos</text>
                <text x="90" y="115" fontSize="7" fill="#fff">50%</text>
                <text x="50" y="145" fontSize="7" fontWeight="700" fill="#fff">Studios</text>
                <text x="55" y="155" fontSize="6" fill="#fff">18.8%</text>
                <text x="100" y="175" fontSize="6" fontWeight="700" fill="#fff">Apartments</text>
                <text x="110" y="183" fontSize="5" fill="#fff">8.82%</text>
              </svg>
            </div>
            <div className="rp-pie-legend">
              <div className="rp-legend-item">
                <span className="rp-legend-dot" style={{ background: '#3B82F6' }}></span>
                Condos
              </div>
              <div className="rp-legend-item">
                <span className="rp-legend-dot" style={{ background: '#10B981' }}></span>
                Houses
              </div>
              <div className="rp-legend-item">
                <span className="rp-legend-dot" style={{ background: '#F59E0B' }}></span>
                Studios
              </div>
              <div className="rp-legend-item">
                <span className="rp-legend-dot" style={{ background: '#EF4444' }}></span>
                Apartments
              </div>
            </div>
          </div>

          {/* Location Performance - Bar Chart */}
          <div className="rp-chart-card">
            <h4 className="rp-chart-title">Location Performance</h4>
            <div className="rp-bar-container">
              <svg viewBox="0 0 400 260" className="rp-bar-chart">
                {/* Y-axis labels */}
                <text x="35" y="30" fontSize="11" fill="#9CA3AF" textAnchor="end">4000</text>
                <text x="35" y="80" fontSize="11" fill="#9CA3AF" textAnchor="end">3000</text>
                <text x="35" y="130" fontSize="11" fill="#9CA3AF" textAnchor="end">2000</text>
                <text x="35" y="180" fontSize="11" fill="#9CA3AF" textAnchor="end">1000</text>
                <text x="35" y="225" fontSize="11" fill="#9CA3AF" textAnchor="end">0</text>

                {/* Grid lines */}
                <line x1="45" y1="27" x2="380" y2="27" stroke="#F3F4F6" strokeWidth="1" />
                <line x1="45" y1="77" x2="380" y2="77" stroke="#F3F4F6" strokeWidth="1" />
                <line x1="45" y1="127" x2="380" y2="127" stroke="#F3F4F6" strokeWidth="1" />
                <line x1="45" y1="177" x2="380" y2="177" stroke="#F3F4F6" strokeWidth="1" />
                <line x1="45" y1="222" x2="380" y2="222" stroke="#F3F4F6" strokeWidth="1" />

                {/* Cebu - ~3200 */}
                <rect x="60" y="62" width="40" height="160" rx="4" fill="#3B82F6" />
                {/* Makati - ~2600 */}
                <rect x="125" y="92" width="40" height="130" rx="4" fill="#10B981" />
                {/* BGC - ~2800 */}
                <rect x="190" y="82" width="40" height="140" rx="4" fill="#F59E0B" />
                {/* Davao - ~1800 */}
                <rect x="255" y="132" width="40" height="90" rx="4" fill="#8B5CF6" />
                {/* Manila - ~900 */}
                <rect x="320" y="177" width="40" height="45" rx="4" fill="#EF4444" />

                {/* X-axis labels */}
                <text x="80" y="245" fontSize="11" fill="#9CA3AF" textAnchor="middle">Cebu</text>
                <text x="145" y="245" fontSize="11" fill="#9CA3AF" textAnchor="middle">Makati</text>
                <text x="210" y="245" fontSize="11" fill="#9CA3AF" textAnchor="middle">BGC</text>
                <text x="275" y="245" fontSize="11" fill="#9CA3AF" textAnchor="middle">Davao</text>
                <text x="340" y="245" fontSize="11" fill="#9CA3AF" textAnchor="middle">Manila</text>
              </svg>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
