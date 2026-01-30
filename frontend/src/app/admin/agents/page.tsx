'use client'

import { useState, useEffect } from 'react'
import AppSidebar from '../../../components/common/AppSidebar'
import DashboardHeader from '../../../components/common/DashboardHeader'
import { FiRefreshCw } from 'react-icons/fi'
import '../../../pages-old/admin/AdminDashboard.css'

interface Agent {
  id: string
  name: string
  agentId: string
  status: 'active' | 'inactive'
  totalListings: number
  lastActive: string
  dateJoined: string
}

export default function AgentsPage() {
  const [filter, setFilter] = useState('all')
  const [userName, setUserName] = useState('John Admin')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserName(localStorage.getItem('admin_name') || 'John Admin')
    }
  }, [])

  const agents: Agent[] = [
    {
      id: '1',
      name: 'Henry Santos',
      agentId: 'RPH-2024-001',
      status: 'active',
      totalListings: 34,
      lastActive: 'Today',
      dateJoined: '12-8-2025'
    },
    {
      id: '2',
      name: 'Isaac Madrigal',
      agentId: 'RPH-2024-002',
      status: 'active',
      totalListings: 12,
      lastActive: '1 Minute Ago',
      dateJoined: '11-4-2025'
    },
    {
      id: '3',
      name: 'Janine Sagabal',
      agentId: 'RPH-2024-003',
      status: 'active',
      totalListings: 27,
      lastActive: '2 Days Ago',
      dateJoined: '10-27-2025'
    },
    {
      id: '4',
      name: 'Mary Johanes',
      agentId: 'RPH-2024-004',
      status: 'inactive',
      totalListings: 6,
      lastActive: '12 Days Ago',
      dateJoined: '8-19-2025'
    }
  ]

  const filteredAgents = agents

  return (
    <div className="admin-dashboard">
      <AppSidebar/>

      <main className="admin-main">
        <DashboardHeader
          title="Dashboard Overview"
          subtitle="Welcome back, Admin"
          userName={userName}
          userRole="Administrator"
          showNotifications={true}
          avatarFallback="JD"
        />

        <div className="agents-section">
          <div className="agents-header">
            <h2 className="agents-title">Agents</h2>
            <div className="agents-controls">
              <div className="filter-options">
                <label className="filter-option">
                  <input 
                    type="radio" 
                    name="filter" 
                    value="all" 
                    checked={filter === 'all'}
                    onChange={(e) => setFilter(e.target.value)}
                  />
                  <span>All(23)</span>
                </label>
                <label className="filter-option">
                  <input 
                    type="radio" 
                    name="filter" 
                    value="newest" 
                    checked={filter === 'newest'}
                    onChange={(e) => setFilter(e.target.value)}
                  />
                  <span>Newest(7)</span>
                </label>
                <label className="filter-option">
                  <input 
                    type="radio" 
                    name="filter" 
                    value="oldest" 
                    checked={filter === 'oldest'}
                    onChange={(e) => setFilter(e.target.value)}
                  />
                  <span>Oldest(32)</span>
                </label>
              </div>
              <button className="refresh-button" title="Refresh">
                <FiRefreshCw className="refresh-icon" />
              </button>
            </div>
          </div>

          <div className="agents-table-container">
            <table className="agents-table">
              <thead>
                <tr>
                  <th>Agent Name</th>
                  <th>Agent ID</th>
                  <th>Status</th>
                  <th>Total Listings</th>
                  <th>Last Active</th>
                  <th>Date Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredAgents.map((agent) => (
                  <tr key={agent.id}>
                    <td className="agent-name" data-label="Agent Name">{agent.name}</td>
                    <td className="agent-id" data-label="Agent ID">{agent.agentId}</td>
                    <td data-label="Status">
                      <span className={`status-indicator ${agent.status}`}>
                        <span className="status-dot"></span>
                        <span className="status-text">
                          {agent.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </span>
                    </td>
                    <td className="total-listings" data-label="Total Listings">{agent.totalListings} Listings</td>
                    <td className="last-active" data-label="Last Active">{agent.lastActive}</td>
                    <td className="date-joined" data-label="Date Joined">{agent.dateJoined}</td>
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

