import { useState } from 'react'
import AppSidebar from '../../components/common/AppSidebar'
import DashboardHeader from '../../components/common/DashboardHeader'
import { 
  FiRefreshCw,
  FiUser,
  FiUserCheck,
  FiUserX
} from 'react-icons/fi'
import './AdminDashboard.css'

interface User {
  id: string
  userId: string
  name: string
  email: string
  role: 'renter' | 'agent' | 'admin'
  status: 'active' | 'inactive' | 'suspended'
  dateJoined: string
  lastActive: string
}

function UserManagementPage() {
  const [filter, setFilter] = useState('all')

  // User data
  const users: User[] = [
    {
      id: '1',
      userId: 'USR-001',
      name: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      role: 'renter',
      status: 'active',
      dateJoined: '12-8-2025',
      lastActive: 'Today'
    },
    {
      id: '2',
      userId: 'USR-002',
      name: 'John Dela Cruz',
      email: 'john.delacruz@email.com',
      role: 'agent',
      status: 'active',
      dateJoined: '11-4-2025',
      lastActive: '1 Hour Ago'
    },
    {
      id: '3',
      userId: 'USR-003',
      name: 'Sarah Lim',
      email: 'sarah.lim@email.com',
      role: 'renter',
      status: 'inactive',
      dateJoined: '10-27-2025',
      lastActive: '5 Days Ago'
    },
    {
      id: '4',
      userId: 'USR-004',
      name: 'Michael Tan',
      email: 'michael.tan@email.com',
      role: 'agent',
      status: 'suspended',
      dateJoined: '8-19-2025',
      lastActive: '2 Weeks Ago'
    },
    {
      id: '5',
      userId: 'USR-005',
      name: 'Anna Rodriguez',
      email: 'anna.rodriguez@email.com',
      role: 'renter',
      status: 'active',
      dateJoined: '9-15-2025',
      lastActive: 'Yesterday'
    }
  ]

  const filteredUsers = users // Filter logic can be added here

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active'
      case 'inactive':
        return 'Inactive'
      case 'suspended':
        return 'Suspended'
      default:
        return status
    }
  }

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'renter':
        return 'Renter'
      case 'agent':
        return 'Agent'
      case 'admin':
        return 'Admin'
      default:
        return role
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'renter':
        return <FiUser />
      case 'agent':
        return <FiUserCheck />
      case 'admin':
        return <FiUserX />
      default:
        return <FiUser />
    }
  }

  return (
    <div className="admin-dashboard">
      <AppSidebar />

      {/* Main Content */}
      <main className="admin-main">
        {/* Header */}
        <DashboardHeader
          title="Dashboard Overview"
          subtitle="Welcome back, Admin"
          userName={localStorage.getItem('admin_name') || 'John Admin'}
          userRole="Administrator"
          showNotifications={true}
          avatarFallback="JD"
        />

        {/* Users Section */}
        <div className="properties-section">
          <div className="agents-header">
            <h2 className="properties-title">User Management</h2>
            <div className="agents-controls">
              <div className="filter-options">
                <label className="filter-option">
                  <input 
                    type="radio" 
                    name="userFilter" 
                    value="all" 
                    checked={filter === 'all'}
                    onChange={(e) => setFilter(e.target.value)}
                  />
                  <span>All(45)</span>
                </label>
                <label className="filter-option">
                  <input 
                    type="radio" 
                    name="userFilter" 
                    value="active" 
                    checked={filter === 'active'}
                    onChange={(e) => setFilter(e.target.value)}
                  />
                  <span>Active(32)</span>
                </label>
                <label className="filter-option">
                  <input 
                    type="radio" 
                    name="userFilter" 
                    value="inactive" 
                    checked={filter === 'inactive'}
                    onChange={(e) => setFilter(e.target.value)}
                  />
                  <span>Inactive(10)</span>
                </label>
                <label className="filter-option">
                  <input 
                    type="radio" 
                    name="userFilter" 
                    value="suspended" 
                    checked={filter === 'suspended'}
                    onChange={(e) => setFilter(e.target.value)}
                  />
                  <span>Suspended(3)</span>
                </label>
              </div>
              <button className="refresh-button" title="Refresh">
                <FiRefreshCw className="refresh-icon" />
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="properties-table-container">
            <table className="properties-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Date Joined</th>
                  <th>Last Active</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="property-id" data-label="User ID">{user.userId}</td>
                    <td className="property-name" data-label="Name">{user.name}</td>
                    <td className="property-location" data-label="Email">{user.email}</td>
                    <td className="property-type" data-label="Role">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {getRoleIcon(user.role)}
                        <span>{getRoleDisplay(user.role)}</span>
                      </div>
                    </td>
                    <td data-label="Status">
                      <span className={`property-status-indicator ${user.status}`}>
                        <span className="property-status-dot"></span>
                        <span className="property-status-text">
                          {getStatusDisplay(user.status)}
                        </span>
                      </span>
                    </td>
                    <td className="property-date" data-label="Date Joined">{user.dateJoined}</td>
                    <td className="property-date" data-label="Last Active">{user.lastActive}</td>
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

export default UserManagementPage

