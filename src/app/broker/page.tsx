'use client'

import { useEffect, useState } from 'react'
import AppSidebar from '../../components/common/AppSidebar'
import DashboardHeader from '../../components/common/DashboardHeader'
import {
  FiUsers,
  FiHome,
  FiDollarSign,
  FiTrendingUp,
  FiCheck,
  FiPlus,
  FiEdit,
  FiUserPlus,
  FiX,
  FiTarget,
  FiBell,
} from 'react-icons/fi'
// import './page.css' // Removed - converted to Tailwind

// Mock data
const topPerformers = [
  { name: 'David Wilson', deals: 15, amount: '$890K', color: '#3B82F6' },
  { name: 'Lisa Johnson', deals: 12, amount: '$745K', color: '#10B981' },
  { name: 'Robert Taylor', deals: 11, amount: '$682K', color: '#F59E0B' },
  { name: 'Jennifer Lee', deals: 9, amount: '$567K', color: '#8B5CF6' },
  { name: 'James Brown', deals: 8, amount: '$523K', color: '#EC4899' },
]

const pendingApprovals = [
  { name: 'Sarah Miller', description: 'New agent registration', color: '#F59E0B' },
  { name: 'Michael Chen', description: 'Listing modification', color: '#8B5CF6' },
  { name: 'Emma Davis', description: 'New listing submission', color: '#EC4899' },
]

const recentActivity = [
  { name: 'David Wilson', action: 'closed a deal', time: '2 hours ago', icon: 'check', color: 'green' },
  { name: 'Lisa Johnson', action: 'added new listing', time: '4 hours ago', icon: 'home', color: 'blue' },
  { name: 'Sarah Miller', action: 'joined the team', time: '1 day ago', icon: 'user', color: 'purple' },
  { name: 'Michael Chen', action: 'updated listing', time: '1 day ago', icon: 'edit', color: 'orange' },
  { name: 'Emma Davis', action: 'listing expired', time: '2 days ago', icon: 'x', color: 'red' },
]

const recentListings = [
  {
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
    badge: 'For Sale',
    badgeType: 'sale',
    price: '$1,250,000',
    specs: '4 bd | 3 ba | 2,800 sqft',
    address: '123 Oak Street, Beverly Hills',
    agent: 'David Wilson',
    agentColor: '#3B82F6',
  },
  {
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    badge: 'For Rent',
    badgeType: 'rent',
    price: '$3,500/mo',
    specs: '2 bd | 2 ba | 1,400 sqft',
    address: '456 Pine Ave, Downtown',
    agent: 'Lisa Johnson',
    agentColor: '#10B981',
  },
  {
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
    badge: 'Sold',
    badgeType: 'sold',
    price: '$875,000',
    specs: '3 bd | 2.5 ba | 2,200 sqft',
    address: '789 Maple Dr, Westwood',
    agent: 'Robert Taylor',
    agentColor: '#F59E0B',
  },
  {
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
    badge: 'For Sale',
    badgeType: 'sale',
    price: '$2,100,000',
    specs: '3 bd | 3 ba | 2,500 sqft',
    address: '321 Beach Blvd, Santa Monica',
    agent: 'Jennifer Lee',
    agentColor: '#8B5CF6',
  },
]

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

function ActivityIcon({ type }: { type: string }) {
  switch (type) {
    case 'check':
      return <FiCheck />
    case 'home':
      return <FiHome />
    case 'user':
      return <FiUserPlus />
    case 'edit':
      return <FiEdit />
    case 'x':
      return <FiX />
    default:
      return <FiCheck />
  }
}

export default function BrokerDashboard() {
  const [userName, setUserName] = useState('John Anderson')
  const [activeTab, setActiveTab] = useState<'month' | 'quarter' | 'year'>('quarter')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserName(localStorage.getItem('agent_name') || localStorage.getItem('user_name') || 'John Anderson')
    }
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-100 font-outfit"> {/* broker-dashboard */}
      <AppSidebar />
      <main className="ml-[280px] flex-1 w-[calc(100%-280px)] p-8 min-h-screen lg:ml-[240px] lg:w-[calc(100%-240px)] lg:p-6 md:ml-0 md:w-full md:p-4 md:pt-15"> {/* broker-main */}
        <header className="flex items-center justify-between mb-7 md:flex-col md:items-start md:gap-3.5"> {/* broker-header */}
          <div className="flex flex-col gap-1"> {/* broker-header-left */}
            <h1 className="text-2xl font-bold text-gray-900 m-0 mb-1 md:text-xl">Dashboard Overview</h1>
            <p className="text-sm text-gray-400 m-0">Welcome back, {userName.split(' ')[0]}! Here&apos;s what&apos;s happening with your team.</p>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-5 mb-6 lg:grid-cols-2 md:grid-cols-1"> {/* broker-stats-grid */}
          <div className="bg-white rounded-[14px] py-5 px-6 flex items-center gap-4 shadow-sm transition-shadow duration-200 hover:shadow-md"> {/* broker-stat-card */}
            <div className="w-12.5 h-12.5 rounded-xl flex items-center justify-center text-[22px] flex-shrink-0 bg-blue-100 text-blue-600"> {/* broker-stat-icon blue */}
              <FiUsers />
            </div>
            <div className="flex-1"> {/* broker-stat-info */}
              <div className="flex items-center justify-between mb-1"> {/* broker-stat-top */}
                <span className="text-xs font-medium text-gray-400">Total Agents</span> {/* broker-stat-label */}
                <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600"> {/* broker-stat-change */}
                  <FiTrendingUp className="text-xs" /> 12%
                </span>
              </div>
              <div className="text-[28px] font-bold text-gray-900 leading-tight">24</div> {/* broker-stat-value */}
            </div>
          </div>

          <div className="bg-white rounded-[14px] py-5 px-6 flex items-center gap-4 shadow-sm transition-shadow duration-200 hover:shadow-md"> {/* broker-stat-card */}
            <div className="w-12.5 h-12.5 rounded-xl flex items-center justify-center text-[22px] flex-shrink-0 bg-emerald-100 text-emerald-600"> {/* broker-stat-icon green */}
              <FiHome />
            </div>
            <div className="flex-1"> {/* broker-stat-info */}
              <div className="flex items-center justify-between mb-1"> {/* broker-stat-top */}
                <span className="text-xs font-medium text-gray-400">Active Listings</span> {/* broker-stat-label */}
                <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600"> {/* broker-stat-change */}
                  <FiTrendingUp className="text-xs" /> 8%
                </span>
              </div>
              <div className="text-[28px] font-bold text-gray-900 leading-tight">142</div> {/* broker-stat-value */}
            </div>
          </div>

          <div className="bg-white rounded-[14px] py-5 px-6 flex items-center gap-4 shadow-sm transition-shadow duration-200 hover:shadow-md"> {/* broker-stat-card */}
            <div className="w-12.5 h-12.5 rounded-xl flex items-center justify-center text-[22px] flex-shrink-0 bg-amber-100 text-amber-600"> {/* broker-stat-icon orange */}
              <FiTarget />
            </div>
            <div className="flex-1"> {/* broker-stat-info */}
              <div className="flex items-center justify-between mb-1"> {/* broker-stat-top */}
                <span className="text-xs font-medium text-gray-400">Deals Closed</span> {/* broker-stat-label */}
                <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600"> {/* broker-stat-change */}
                  <FiTrendingUp className="text-xs" /> 23%
                </span>
              </div>
              <div className="text-[28px] font-bold text-gray-900 leading-tight">38</div> {/* broker-stat-value */}
            </div>
          </div>

          <div className="bg-white rounded-[14px] py-5 px-6 flex items-center gap-4 shadow-sm transition-shadow duration-200 hover:shadow-md"> {/* broker-stat-card */}
            <div className="w-12.5 h-12.5 rounded-xl flex items-center justify-center text-[22px] flex-shrink-0 bg-indigo-100 text-indigo-600"> {/* broker-stat-icon purple */}
              <FiDollarSign />
            </div>
            <div className="flex-1"> {/* broker-stat-info */}
              <div className="flex items-center justify-between mb-1"> {/* broker-stat-top */}
                <span className="text-xs font-medium text-gray-400">Revenue</span> {/* broker-stat-label */}
                <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600"> {/* broker-stat-change */}
                  <FiTrendingUp className="text-xs" /> 18%
                </span>
              </div>
              <div className="text-[28px] font-bold text-gray-900 leading-tight">$2.4M</div> {/* broker-stat-value */}
            </div>
          </div>
        </div>

        {/* Middle Section: Performance Chart + Pending Approvals */}
        <div className="grid grid-cols-[1fr_340px] gap-5 mb-6 lg:grid-cols-1"> {/* broker-middle-section */}
          <div className="bg-white rounded-[14px] p-6 shadow-sm"> {/* broker-card broker-chart-card */}
            <div className="flex items-center justify-between mb-5"> {/* broker-card-header */}
              <h3 className="text-base font-bold text-gray-900 m-0">Team Performance</h3> {/* broker-card-title */}
              <div className="flex bg-gray-100 rounded-lg p-0.5"> {/* broker-toggle-group */}
                <button
                  className={`py-1.5 px-3.5 border-0 bg-transparent rounded-md text-xs font-medium text-gray-500 cursor-pointer transition-all duration-200 ${activeTab === 'month' ? 'bg-blue-600 text-white' : 'hover:text-gray-900'}`} /* broker-toggle-btn */
                  onClick={() => setActiveTab('month')}
                >
                  Month
                </button>
                <button
                  className={`py-1.5 px-3.5 border-0 bg-transparent rounded-md text-xs font-medium text-gray-500 cursor-pointer transition-all duration-200 ${activeTab === 'quarter' ? 'bg-blue-600 text-white' : 'hover:text-gray-900'}`} /* broker-toggle-btn */
                  onClick={() => setActiveTab('quarter')}
                >
                  Quarter
                </button>
                <button
                  className={`py-1.5 px-3.5 border-0 bg-transparent rounded-md text-xs font-medium text-gray-500 cursor-pointer transition-all duration-200 ${activeTab === 'year' ? 'bg-blue-600 text-white' : 'hover:text-gray-900'}`} /* broker-toggle-btn */
                  onClick={() => setActiveTab('year')}
                >
                  Year
                </button>
              </div>
            </div>
            <div className="flex gap-5 mb-4"> {/* broker-chart-legend */}
              <div className="flex items-center gap-1.5 text-xs text-gray-500"> {/* broker-legend-item */}
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div> {/* broker-legend-dot blue */}
                Deals Closed
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500"> {/* broker-legend-item */}
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div> {/* broker-legend-dot green */}
                Revenue (M)
              </div>
            </div>
            <div className="h-55 relative"> {/* broker-chart-container */}
              <svg viewBox="0 0 500 220" preserveAspectRatio="none" className="w-full h-full"> {/* broker-line-chart */}
                <defs>
                  <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Grid lines */}
                <line x1="50" y1="30" x2="480" y2="30" stroke="#F3F4F6" strokeWidth="1" />
                <line x1="50" y1="65" x2="480" y2="65" stroke="#F3F4F6" strokeWidth="1" />
                <line x1="50" y1="100" x2="480" y2="100" stroke="#F3F4F6" strokeWidth="1" />
                <line x1="50" y1="135" x2="480" y2="135" stroke="#F3F4F6" strokeWidth="1" />
                <line x1="50" y1="170" x2="480" y2="170" stroke="#F3F4F6" strokeWidth="1" />

                {/* Y-axis labels left (Deals) */}
                <text x="40" y="34" fontSize="11" fill="#9CA3AF" textAnchor="end">45</text>
                <text x="40" y="69" fontSize="11" fill="#9CA3AF" textAnchor="end">40</text>
                <text x="40" y="104" fontSize="11" fill="#9CA3AF" textAnchor="end">35</text>
                <text x="40" y="139" fontSize="11" fill="#9CA3AF" textAnchor="end">30</text>
                <text x="40" y="174" fontSize="11" fill="#9CA3AF" textAnchor="end">25</text>

                {/* Y-axis labels right (Revenue) */}
                <text x="490" y="34" fontSize="11" fill="#9CA3AF" textAnchor="start">2.9</text>
                <text x="490" y="69" fontSize="11" fill="#9CA3AF" textAnchor="start">2.6</text>
                <text x="490" y="104" fontSize="11" fill="#9CA3AF" textAnchor="start">2.2</text>
                <text x="490" y="139" fontSize="11" fill="#9CA3AF" textAnchor="start">2.0</text>
                <text x="490" y="174" fontSize="11" fill="#9CA3AF" textAnchor="start">1.8</text>

                {/* X-axis labels */}
                <text x="90" y="200" fontSize="11" fill="#9CA3AF" textAnchor="middle">Jan</text>
                <text x="170" y="200" fontSize="11" fill="#9CA3AF" textAnchor="middle">Feb</text>
                <text x="250" y="200" fontSize="11" fill="#9CA3AF" textAnchor="middle">Mar</text>
                <text x="330" y="200" fontSize="11" fill="#9CA3AF" textAnchor="middle">Apr</text>
                <text x="410" y="200" fontSize="11" fill="#9CA3AF" textAnchor="middle">May</text>
                <text x="460" y="200" fontSize="11" fill="#9CA3AF" textAnchor="middle">Jun</text>

                {/* Blue line (Deals Closed) */}
                <path
                  d="M 90 145 C 120 150, 140 155, 170 160 C 200 165, 220 120, 250 100 C 280 80, 300 90, 330 70 C 360 50, 380 40, 410 35 C 430 32, 450 28, 460 25"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 90 145 C 120 150, 140 155, 170 160 C 200 165, 220 120, 250 100 C 280 80, 300 90, 330 70 C 360 50, 380 40, 410 35 C 430 32, 450 28, 460 25 L 460 185 L 90 185 Z"
                  fill="url(#blueGradient)"
                />
                {/* Blue dots */}
                <circle cx="90" cy="145" r="4" fill="#3B82F6" stroke="#fff" strokeWidth="2" />
                <circle cx="170" cy="160" r="4" fill="#3B82F6" stroke="#fff" strokeWidth="2" />
                <circle cx="250" cy="100" r="4" fill="#3B82F6" stroke="#fff" strokeWidth="2" />
                <circle cx="330" cy="70" r="4" fill="#3B82F6" stroke="#fff" strokeWidth="2" />
                <circle cx="410" cy="35" r="4" fill="#3B82F6" stroke="#fff" strokeWidth="2" />
                <circle cx="460" cy="25" r="4" fill="#3B82F6" stroke="#fff" strokeWidth="2" />

                {/* Green line (Revenue) */}
                <path
                  d="M 90 170 C 120 165, 140 160, 170 155 C 200 150, 220 140, 250 130 C 280 120, 300 110, 330 95 C 360 80, 380 65, 410 50 C 430 42, 450 35, 460 30"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 90 170 C 120 165, 140 160, 170 155 C 200 150, 220 140, 250 130 C 280 120, 300 110, 330 95 C 360 80, 380 65, 410 50 C 430 42, 450 35, 460 30 L 460 185 L 90 185 Z"
                  fill="url(#greenGradient)"
                />
                {/* Green dots */}
                <circle cx="90" cy="170" r="4" fill="#10B981" stroke="#fff" strokeWidth="2" />
                <circle cx="170" cy="155" r="4" fill="#10B981" stroke="#fff" strokeWidth="2" />
                <circle cx="250" cy="130" r="4" fill="#10B981" stroke="#fff" strokeWidth="2" />
                <circle cx="330" cy="95" r="4" fill="#10B981" stroke="#fff" strokeWidth="2" />
                <circle cx="410" cy="50" r="4" fill="#10B981" stroke="#fff" strokeWidth="2" />
                <circle cx="460" cy="30" r="4" fill="#10B981" stroke="#fff" strokeWidth="2" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-[14px] p-6 shadow-sm"> {/* broker-card broker-approvals-card */}
            <div className="flex items-center justify-between mb-5"> {/* broker-card-header */}
              <h3 className="text-base font-bold text-gray-900 m-0">Pending Approvals</h3> {/* broker-card-title */}
            </div>
            <div className="flex flex-col gap-4"> {/* broker-approvals-list */}
              {pendingApprovals.map((approval, index) => (
                <div className="flex gap-3" key={index}> {/* broker-approval-item */}
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0" /* broker-approval-avatar */
                    style={{ background: approval.color }}
                  >
                    {getInitials(approval.name)}
                  </div>
                  <div className="flex-1 flex flex-col gap-2"> {/* broker-approval-info */}
                    <div className="text-sm font-semibold text-gray-900">{approval.name}</div> {/* broker-approval-name */}
                    <div className="text-xs text-gray-500">{approval.description}</div> {/* broker-approval-desc */}
                    <div className="flex gap-2"> {/* broker-approval-actions */}
                      <button className="py-1 px-3 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-md border-0 cursor-pointer transition-all duration-200 hover:bg-emerald-100">Approve</button> {/* broker-btn-approve */}
                      <button className="py-1 px-3 bg-red-50 text-red-600 text-xs font-medium rounded-md border-0 cursor-pointer transition-all duration-200 hover:bg-red-100">Reject</button> {/* broker-btn-reject */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <a href="/broker/approvals" className="block text-center mt-5 pt-4 border-t border-gray-100 text-sm font-medium text-blue-600 no-underline transition-colors duration-200 hover:text-blue-700"> {/* broker-view-all-link */}
              View All (5)
            </a>
          </div>
        </div>

        {/* Bottom Section: Top Performers, Listings by Status, Recent Activity */}
        <div className="grid grid-cols-3 gap-5 mb-6 lg:grid-cols-1"> {/* broker-bottom-section */}
          <div className="bg-white rounded-[14px] p-6 shadow-sm"> {/* broker-card */}
            <div className="flex items-center justify-between mb-5"> {/* broker-card-header */}
              <h3 className="text-base font-bold text-gray-900 m-0">Top Performers</h3> {/* broker-card-title */}
            </div>
            <div className="flex flex-col gap-4"> {/* broker-performers-list */}
              {topPerformers.map((performer, index) => (
                <div className="flex items-center gap-3" key={index}> {/* broker-performer-item */}
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0" /* broker-performer-avatar */
                    style={{ background: performer.color }}
                  >
                    {getInitials(performer.name)}
                  </div>
                  <div className="flex-1"> {/* broker-performer-info */}
                    <div className="text-sm font-semibold text-gray-900">{performer.name}</div> {/* broker-performer-name */}
                    <div className="text-xs text-gray-500"> {/* broker-performer-deals */}
                      {performer.deals} deals closed
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gray-900">{performer.amount}</div> {/* broker-performer-amount */}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[14px] p-6 shadow-sm"> {/* broker-card */}
            <div className="flex items-center justify-between mb-5"> {/* broker-card-header */}
              <h3 className="text-base font-bold text-gray-900 m-0">Listings by Status</h3> {/* broker-card-title */}
            </div>
            <div className="h-50 flex items-center justify-center"> {/* broker-doughnut-container */}
              <svg viewBox="0 0 200 200" className="w-full h-full max-w-[200px]"> {/* broker-doughnut-chart */}
                {/* Active - 50% - Blue */}
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="35"
                  strokeDasharray={`${0.50 * 439.82} 439.82`}
                  transform="rotate(-90 100 100)"
                />
                {/* Sold - 22.4% - Green */}
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="35"
                  strokeDasharray={`${0.224 * 439.82} 439.82`}
                  strokeDashoffset={`${-0.50 * 439.82}`}
                  transform="rotate(-90 100 100)"
                />
                {/* Pending - 18.8% - Yellow */}
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="35"
                  strokeDasharray={`${0.188 * 439.82} 439.82`}
                  strokeDashoffset={`${-(0.50 + 0.224) * 439.82}`}
                  transform="rotate(-90 100 100)"
                />
                {/* Expired - 8.82% - Red */}
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="35"
                  strokeDasharray={`${0.0882 * 439.82} 439.82`}
                  strokeDashoffset={`${-(0.50 + 0.224 + 0.188) * 439.82}`}
                  transform="rotate(-90 100 100)"
                />
                {/* Center labels */}
                <text x="78" y="60" fontSize="8" fontWeight="700" fill="#fff">Active</text>
                <text x="82" y="72" fontSize="7" fill="#fff">50%</text>

                <text x="130" y="120" fontSize="7" fontWeight="700" fill="#fff">Sold</text>
                <text x="130" y="131" fontSize="6" fill="#fff">22.4%</text>

                <text x="55" y="135" fontSize="7" fontWeight="700" fill="#fff">Pending</text>
                <text x="60" y="146" fontSize="6" fill="#fff">18.8%</text>

                <text x="105" y="170" fontSize="6" fontWeight="700" fill="#fff">Expired</text>
                <text x="108" y="179" fontSize="5" fill="#fff">8.82%</text>
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-[14px] p-6 shadow-sm"> {/* broker-card */}
            <div className="flex items-center justify-between mb-5"> {/* broker-card-header */}
              <h3 className="text-base font-bold text-gray-900 m-0">Recent Activity</h3> {/* broker-card-title */}
            </div>
            <div className="flex flex-col gap-4"> {/* broker-activity-list */}
              {recentActivity.map((activity, index) => (
                <div className="flex gap-3" key={index}> {/* broker-activity-item */}
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white text-base flex-shrink-0 ${
                    activity.color === 'green' ? 'bg-emerald-100 text-emerald-600' :
                    activity.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    activity.color === 'purple' ? 'bg-indigo-100 text-indigo-600' :
                    activity.color === 'orange' ? 'bg-amber-100 text-amber-600' :
                    'bg-red-100 text-red-600'
                  }`}> {/* broker-activity-icon */}
                    <ActivityIcon type={activity.icon} />
                  </div>
                  <div className="flex-1"> {/* broker-activity-content */}
                    <div className="text-sm text-gray-900"> {/* broker-activity-text */}
                      <strong>{activity.name}</strong> {activity.action}
                    </div>
                    <div className="text-xs text-gray-500">{activity.time}</div> {/* broker-activity-time */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Listings */}
        <div className="bg-white rounded-[14px] p-6 shadow-sm"> {/* broker-listings-section */}
          <div className="flex items-center justify-between mb-5"> {/* broker-listings-header */}
            <h3 className="text-base font-bold text-gray-900 m-0">Recent Listings</h3>
            <a href="/broker/listings" className="text-sm font-medium text-blue-600 no-underline transition-colors duration-200 hover:text-blue-700"> {/* broker-view-all-link */}
              View All
            </a>
          </div>
          <div className="grid grid-cols-4 gap-5 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1"> {/* broker-listings-grid */}
            {recentListings.map((listing, index) => (
              <div className="bg-white rounded-xl overflow-hidden border border-gray-200 transition-all duration-200 hover:shadow-md" key={index}> {/* broker-listing-card */}
                <div className="relative h-48 overflow-hidden"> {/* broker-listing-image */}
                  <img src={listing.image} alt="Property" className="w-full h-full object-cover" />
                  <span className={`absolute top-3 left-3 py-1 px-2.5 rounded-md text-xs font-semibold ${
                    listing.badgeType === 'sale' ? 'bg-blue-600 text-white' :
                    listing.badgeType === 'rent' ? 'bg-emerald-600 text-white' :
                    'bg-gray-600 text-white'
                  }`}> {/* broker-listing-badge */}
                    {listing.badge}
                  </span>
                </div>
                <div className="p-4 flex flex-col gap-2"> {/* broker-listing-details */}
                  <div className="text-lg font-bold text-gray-900">{listing.price}</div> {/* broker-listing-price */}
                  <div className="text-xs text-gray-500">{listing.specs}</div> {/* broker-listing-specs */}
                  <div className="text-sm text-gray-700 line-clamp-2">{listing.address}</div> {/* broker-listing-address */}
                  <div className="flex items-center gap-2 pt-2 mt-auto border-t border-gray-100"> {/* broker-listing-agent */}
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0" /* broker-listing-agent-avatar */
                      style={{ background: listing.agentColor }}
                    >
                      {getInitials(listing.agent)}
                    </div>
                    <span className="text-xs font-medium text-gray-700">{listing.agent}</span> {/* broker-listing-agent-name */}
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
