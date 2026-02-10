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
import './page.css'

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
    <div className="broker-dashboard">
      <AppSidebar />
      <main className="broker-main">
        <header className="broker-header">
          <div className="broker-header-left">
            <h1>Dashboard Overview</h1>
            <p>Welcome back, {userName.split(' ')[0]}! Here&apos;s what&apos;s happening with your team.</p>
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

        {/* Stats Cards */}
        <div className="broker-stats-grid">
          <div className="broker-stat-card">
            <div className="broker-stat-icon blue">
              <FiUsers />
            </div>
            <div className="broker-stat-info">
              <div className="broker-stat-top">
                <span className="broker-stat-label">Total Agents</span>
                <span className="broker-stat-change">
                  <FiTrendingUp /> 12%
                </span>
              </div>
              <div className="broker-stat-value">24</div>
            </div>
          </div>

          <div className="broker-stat-card">
            <div className="broker-stat-icon green">
              <FiHome />
            </div>
            <div className="broker-stat-info">
              <div className="broker-stat-top">
                <span className="broker-stat-label">Active Listings</span>
                <span className="broker-stat-change">
                  <FiTrendingUp /> 8%
                </span>
              </div>
              <div className="broker-stat-value">142</div>
            </div>
          </div>

          <div className="broker-stat-card">
            <div className="broker-stat-icon orange">
              <FiTarget />
            </div>
            <div className="broker-stat-info">
              <div className="broker-stat-top">
                <span className="broker-stat-label">Deals Closed</span>
                <span className="broker-stat-change">
                  <FiTrendingUp /> 23%
                </span>
              </div>
              <div className="broker-stat-value">38</div>
            </div>
          </div>

          <div className="broker-stat-card">
            <div className="broker-stat-icon purple">
              <FiDollarSign />
            </div>
            <div className="broker-stat-info">
              <div className="broker-stat-top">
                <span className="broker-stat-label">Revenue</span>
                <span className="broker-stat-change">
                  <FiTrendingUp /> 18%
                </span>
              </div>
              <div className="broker-stat-value">$2.4M</div>
            </div>
          </div>
        </div>

        {/* Middle Section: Performance Chart + Pending Approvals */}
        <div className="broker-middle-section">
          <div className="broker-card broker-chart-card">
            <div className="broker-card-header">
              <h3 className="broker-card-title">Team Performance</h3>
              <div className="broker-toggle-group">
                <button
                  className={`broker-toggle-btn ${activeTab === 'month' ? 'active' : ''}`}
                  onClick={() => setActiveTab('month')}
                >
                  Month
                </button>
                <button
                  className={`broker-toggle-btn ${activeTab === 'quarter' ? 'active' : ''}`}
                  onClick={() => setActiveTab('quarter')}
                >
                  Quarter
                </button>
                <button
                  className={`broker-toggle-btn ${activeTab === 'year' ? 'active' : ''}`}
                  onClick={() => setActiveTab('year')}
                >
                  Year
                </button>
              </div>
            </div>
            <div className="broker-chart-legend">
              <div className="broker-legend-item">
                <div className="broker-legend-dot blue"></div>
                Deals Closed
              </div>
              <div className="broker-legend-item">
                <div className="broker-legend-dot green"></div>
                Revenue (M)
              </div>
            </div>
            <div className="broker-chart-container">
              <svg viewBox="0 0 500 220" preserveAspectRatio="none" className="broker-line-chart">
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

          <div className="broker-card broker-approvals-card">
            <div className="broker-card-header">
              <h3 className="broker-card-title">Pending Approvals</h3>
            </div>
            <div className="broker-approvals-list">
              {pendingApprovals.map((approval, index) => (
                <div className="broker-approval-item" key={index}>
                  <div
                    className="broker-approval-avatar"
                    style={{ background: approval.color }}
                  >
                    {getInitials(approval.name)}
                  </div>
                  <div className="broker-approval-info">
                    <div className="broker-approval-name">{approval.name}</div>
                    <div className="broker-approval-desc">{approval.description}</div>
                    <div className="broker-approval-actions">
                      <button className="broker-btn-approve">Approve</button>
                      <button className="broker-btn-reject">Reject</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <a href="/broker/approvals" className="broker-view-all-link">
              View All (5)
            </a>
          </div>
        </div>

        {/* Bottom Section: Top Performers, Listings by Status, Recent Activity */}
        <div className="broker-bottom-section">
          <div className="broker-card">
            <div className="broker-card-header">
              <h3 className="broker-card-title">Top Performers</h3>
            </div>
            <div className="broker-performers-list">
              {topPerformers.map((performer, index) => (
                <div className="broker-performer-item" key={index}>
                  <div
                    className="broker-performer-avatar"
                    style={{ background: performer.color }}
                  >
                    {getInitials(performer.name)}
                  </div>
                  <div className="broker-performer-info">
                    <div className="broker-performer-name">{performer.name}</div>
                    <div className="broker-performer-deals">
                      {performer.deals} deals closed
                    </div>
                  </div>
                  <div className="broker-performer-amount">{performer.amount}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="broker-card">
            <div className="broker-card-header">
              <h3 className="broker-card-title">Listings by Status</h3>
            </div>
            <div className="broker-doughnut-container">
              <svg viewBox="0 0 200 200" className="broker-doughnut-chart">
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

          <div className="broker-card">
            <div className="broker-card-header">
              <h3 className="broker-card-title">Recent Activity</h3>
            </div>
            <div className="broker-activity-list">
              {recentActivity.map((activity, index) => (
                <div className="broker-activity-item" key={index}>
                  <div className={`broker-activity-icon ${activity.color}`}>
                    <ActivityIcon type={activity.icon} />
                  </div>
                  <div className="broker-activity-content">
                    <div className="broker-activity-text">
                      <strong>{activity.name}</strong> {activity.action}
                    </div>
                    <div className="broker-activity-time">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Listings */}
        <div className="broker-listings-section">
          <div className="broker-listings-header">
            <h3>Recent Listings</h3>
            <a href="/broker/listings" className="broker-view-all-link">
              View All
            </a>
          </div>
          <div className="broker-listings-grid">
            {recentListings.map((listing, index) => (
              <div className="broker-listing-card" key={index}>
                <div className="broker-listing-image">
                  <img src={listing.image} alt="Property" />
                  <span className={`broker-listing-badge ${listing.badgeType}`}>
                    {listing.badge}
                  </span>
                </div>
                <div className="broker-listing-details">
                  <div className="broker-listing-price">{listing.price}</div>
                  <div className="broker-listing-specs">{listing.specs}</div>
                  <div className="broker-listing-address">{listing.address}</div>
                  <div className="broker-listing-agent">
                    <div
                      className="broker-listing-agent-avatar"
                      style={{ background: listing.agentColor }}
                    >
                      {getInitials(listing.agent)}
                    </div>
                    <span className="broker-listing-agent-name">{listing.agent}</span>
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
