'use client'

import { useState, useRef, useEffect } from 'react'
import AppSidebar from '../../../components/common/AppSidebar'
import {
  FiBell,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiRefreshCw,
  FiMoreVertical,
  FiUser,
  FiAlertCircle,
} from 'react-icons/fi'
import './page.css'

interface TeamMember {
  id: number
  name: string
  role: 'Unit Manager' | 'Agent'
  reportsTo: string | null
  listings: number
  inquiryChannels: string[]
  status: 'Active' | 'Inactive' | 'Pending'
  joinDate: string
}

const teamData: TeamMember[] = [
  {
    id: 1,
    name: 'Gabo Dela Cruz',
    role: 'Unit Manager',
    reportsTo: null,
    listings: 42,
    inquiryChannels: ['WhatsApp', 'Email'],
    status: 'Active',
    joinDate: '2-2-2026',
  },
  {
    id: 2,
    name: 'Camille Santos',
    role: 'Unit Manager',
    reportsTo: null,
    listings: 38,
    inquiryChannels: ['WhatsApp', 'Email'],
    status: 'Active',
    joinDate: '1-28-2026',
  },
  {
    id: 3,
    name: 'Angelo Reyes',
    role: 'Agent',
    reportsTo: 'Gabo Dela Cruz',
    listings: 12,
    inquiryChannels: ['WhatsApp', 'SMS'],
    status: 'Active',
    joinDate: '1-17-2026',
  },
  {
    id: 4,
    name: 'Sofia Mendoza',
    role: 'Agent',
    reportsTo: 'Gabo Dela Cruz',
    listings: 9,
    inquiryChannels: ['WhatsApp'],
    status: 'Active',
    joinDate: '1-9-2026',
  },
  {
    id: 5,
    name: 'Marco Valdez',
    role: 'Agent',
    reportsTo: 'Camille Santos',
    listings: 15,
    inquiryChannels: ['Email', 'SMS'],
    status: 'Active',
    joinDate: '1-2-2026',
  },
]

function ActionMenu({ memberId, onClose }: { memberId: number; onClose: () => void }) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  return (
    <div className="tm-action-menu" ref={menuRef}>
      <button className="tm-action-menu-item" onClick={onClose}>
        <FiEdit className="tm-action-menu-icon edit" />
        <span>Edit Profile</span>
      </button>
      <button className="tm-action-menu-item" onClick={onClose}>
        <FiRefreshCw className="tm-action-menu-icon reassign" />
        <span>Reassign</span>
      </button>
      <button className="tm-action-menu-item danger" onClick={onClose}>
        <FiAlertCircle className="tm-action-menu-icon deactivate" />
        <span>Deactivate</span>
      </button>
    </div>
  )
}

export default function TeamManagementPage() {
  const [selectedMembers, setSelectedMembers] = useState<number[]>([])
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)

  const allSelected = selectedMembers.length === teamData.length && teamData.length > 0

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedMembers([])
    } else {
      setSelectedMembers(teamData.map((m) => m.id))
    }
  }

  const toggleSelect = (id: number) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const formatChannels = (channels: string[]) => {
    return channels.map((ch) => `[${ch}]`).join(' ')
  }

  return (
    <div className="broker-dashboard">
      <AppSidebar />
      <main className="broker-main">
        {/* Header */}
        <header className="broker-header">
          <div className="broker-header-left">
            <h1>Team Management</h1>
            <p>Manage your team members and their account permissions here.</p>
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

        {/* Team Table */}
        <div className="tm-table-card">
          <div className="tm-table-header">
            <div className="tm-header-content">
              <h3 className="tm-table-title">All users</h3>
              <div className="tm-mobile-select-all">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="tm-mobile-card-checkbox"
                  id="mobile-select-all"
                />
                <label htmlFor="mobile-select-all" className="tm-mobile-select-all-label">
                  Select all
                </label>
              </div>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="tm-table-wrapper">
            <table className="tm-table">
              <thead>
                <tr>
                  <th className="tm-th-check">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="tm-checkbox"
                    />
                  </th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Reports to</th>
                  <th>Listings</th>
                  <th>Inquiry Channels</th>
                  <th>Status</th>
                  <th>Join Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teamData.map((member) => (
                  <tr key={member.id}>
                    <td className="tm-td-check">
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(member.id)}
                        onChange={() => toggleSelect(member.id)}
                        className="tm-checkbox"
                      />
                    </td>
                    <td className="tm-td-name">{member.name}</td>
                    <td className="tm-td-role">{member.role}</td>
                    <td className="tm-td-reports">
                      {member.reportsTo || <span className="tm-dash">&mdash;</span>}
                    </td>
                    <td className="tm-td-listings">{member.listings}</td>
                    <td className="tm-td-channels">{formatChannels(member.inquiryChannels)}</td>
                    <td className="tm-td-status">
                      <span className={`tm-status-badge ${member.status.toLowerCase()}`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="tm-td-date">{member.joinDate}</td>
                    <td className="tm-td-actions">
                      <div className="tm-actions-row">
                        <button className="tm-action-btn edit" title="Edit">
                          <FiEdit />
                        </button>
                        <button className="tm-action-btn delete" title="Delete">
                          <FiTrash2 />
                        </button>
                        <button className="tm-action-btn reassign" title="Reassign">
                          <FiRefreshCw />
                        </button>
                        <div className="tm-more-wrapper">
                          <button
                            className="tm-action-btn more"
                            title="More"
                            onClick={() =>
                              setOpenMenuId(openMenuId === member.id ? null : member.id)
                            }
                          >
                            <FiMoreVertical />
                          </button>
                          {openMenuId === member.id && (
                            <ActionMenu
                              memberId={member.id}
                              onClose={() => setOpenMenuId(null)}
                            />
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="tm-mobile-card">
            {teamData.map((member) => (
              <div key={member.id} className="tm-mobile-card-item">
                <div className="tm-mobile-card-header">
                  <h3 className="tm-mobile-card-name">{member.name}</h3>
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member.id)}
                    onChange={() => toggleSelect(member.id)}
                    className="tm-mobile-card-checkbox"
                  />
                </div>
                <div className="tm-mobile-card-body">
                  <div className="tm-mobile-card-row">
                    <span className="tm-mobile-card-label">Role:</span>
                    <span className="tm-mobile-card-value">{member.role}</span>
                  </div>
                  <div className="tm-mobile-card-row">
                    <span className="tm-mobile-card-label">Reports to:</span>
                    <span className="tm-mobile-card-value">
                      {member.reportsTo || <span className="tm-dash">&mdash;</span>}
                    </span>
                  </div>
                  <div className="tm-mobile-card-row">
                    <span className="tm-mobile-card-label">Listings:</span>
                    <span className="tm-mobile-card-value">{member.listings}</span>
                  </div>
                  <div className="tm-mobile-card-row">
                    <span className="tm-mobile-card-label">Channels:</span>
                    <span className="tm-mobile-card-value tm-mobile-card-channels">
                      {formatChannels(member.inquiryChannels)}
                    </span>
                  </div>
                  <div className="tm-mobile-card-row">
                    <span className="tm-mobile-card-label">Status:</span>
                    <span className="tm-mobile-card-value">
                      <span className={`tm-status-badge ${member.status.toLowerCase()}`}>
                        {member.status}
                      </span>
                    </span>
                  </div>
                  <div className="tm-mobile-card-row">
                    <span className="tm-mobile-card-label">Join Date:</span>
                    <span className="tm-mobile-card-value">{member.joinDate}</span>
                  </div>
                </div>
                <div className="tm-mobile-card-actions">
                  <button className="tm-mobile-action-btn edit" title="Edit">
                    <FiEdit />
                  </button>
                  <button className="tm-mobile-action-btn delete" title="Delete">
                    <FiTrash2 />
                  </button>
                  <button className="tm-mobile-action-btn reassign" title="Reassign">
                    <FiRefreshCw />
                  </button>
                  <div className="tm-mobile-more-wrapper">
                    <button
                      className="tm-mobile-action-btn more"
                      title="More"
                      onClick={() =>
                        setOpenMenuId(openMenuId === member.id ? null : member.id)
                      }
                    >
                      <FiMoreVertical />
                    </button>
                    {openMenuId === member.id && (
                      <ActionMenu
                        memberId={member.id}
                        onClose={() => setOpenMenuId(null)}
                      />
                    )}
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
