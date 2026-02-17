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
  FiHome,
  FiKey,
  FiGrid,
  FiStar,
  FiUser,
  FiAlertCircle,
} from 'react-icons/fi'
// import './page.css' // Removed - converted to Tailwind

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
    <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px] z-50" ref={menuRef}> {/* tm-action-menu */}
      <button className="w-full flex items-center gap-2.5 py-2.5 px-4 text-sm text-gray-700 bg-transparent border-0 cursor-pointer transition-colors duration-200 hover:bg-gray-100" onClick={onClose}> {/* tm-action-menu-item */}
        <FiEdit className="text-base text-blue-600" /> {/* tm-action-menu-icon edit */}
        <span>Edit Profile</span>
      </button>
      <button className="w-full flex items-center gap-2.5 py-2.5 px-4 text-sm text-gray-700 bg-transparent border-0 cursor-pointer transition-colors duration-200 hover:bg-gray-100" onClick={onClose}> {/* tm-action-menu-item */}
        <FiRefreshCw className="text-base text-amber-600" /> {/* tm-action-menu-icon reassign */}
        <span>Reassign</span>
      </button>
      <button className="w-full flex items-center gap-2.5 py-2.5 px-4 text-sm text-red-600 bg-transparent border-0 cursor-pointer transition-colors duration-200 hover:bg-red-50" onClick={onClose}> {/* tm-action-menu-item danger */}
        <FiAlertCircle className="text-base text-red-600" /> {/* tm-action-menu-icon deactivate */}
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
    <div className="flex min-h-screen bg-gray-100 font-outfit"> {/* broker-dashboard */}
      <AppSidebar />
      <main className="ml-[280px] flex-1 w-[calc(100%-280px)] p-8 min-h-screen lg:ml-[240px] lg:w-[calc(100%-240px)] lg:p-6 md:ml-0 md:w-full md:p-4 md:pt-15"> {/* broker-main */}
        {/* Header */}
        <header className="flex items-center justify-between mb-7 md:flex-col md:items-start md:gap-3.5"> {/* broker-header */}
          <div className="flex flex-col gap-1"> {/* broker-header-left */}
            <h1 className="text-2xl font-bold text-gray-900 m-0 mb-1 md:text-xl">Team Management</h1>
            <p className="text-sm text-gray-400 m-0">Manage your team members and their account permissions here.</p>
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

        {/* Team Table */}
        <div className="bg-white rounded-[14px] p-6 shadow-sm"> {/* tm-table-card */}
          <div className="flex items-center justify-between mb-5 md:flex-col md:items-start md:gap-4"> {/* tm-table-header */}
            <div className="flex items-center justify-between w-full"> {/* tm-header-content */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 m-0">All users</h3> {/* tm-table-title */}
              </div>
              <div className="flex items-center gap-3"> {/* tm-header-actions */}
                <button className="inline-flex items-center gap-2 py-2.5 px-5 bg-blue-600 text-white text-sm font-semibold rounded-xl border-0 cursor-pointer transition-all duration-200 shadow-sm hover:bg-blue-700 active:translate-y-px">+ Add User</button> {/* tm-add-user-btn */}
                <div className="hidden md:flex items-center gap-2"> {/* tm-mobile-select-all */}
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 cursor-pointer focus:ring-2 focus:ring-blue-500" /* tm-mobile-card-checkbox */
                    id="mobile-select-all"
                  />
                  <label htmlFor="mobile-select-all" className="text-sm font-medium text-gray-700 cursor-pointer"> {/* tm-mobile-select-all-label */}
                    Select all
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="overflow-x-auto md:hidden"> {/* tm-table-wrapper */}
            <table className="w-full border-collapse min-w-[1100px]"> {/* tm-table */}
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 w-12"> {/* tm-th-check */}
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer focus:ring-2 focus:ring-blue-500" /* tm-checkbox */
                    />
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Name</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Role</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Reports to</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Listings</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Inquiry Channels</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Status</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Join Date</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teamData.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b border-gray-100 w-12"> {/* tm-td-check */}
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(member.id)}
                        onChange={() => toggleSelect(member.id)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer focus:ring-2 focus:ring-blue-500" /* tm-checkbox */
                      />
                    </td>
                    <td className="py-3 px-4 border-b border-gray-100 font-semibold text-gray-900">{member.name}</td> {/* tm-td-name */}
                    <td className="py-3 px-4 border-b border-gray-100 text-gray-700">{member.role}</td> {/* tm-td-role */}
                    <td className="py-3 px-4 border-b border-gray-100 text-gray-600"> {/* tm-td-reports */}
                      {member.reportsTo || <span className="text-gray-400">&mdash;</span>} {/* tm-dash */}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-100 text-gray-700 text-center">{member.listings}</td> {/* tm-td-listings */}
                    <td className="py-3 px-4 border-b border-gray-100 text-gray-600 text-sm">{formatChannels(member.inquiryChannels)}</td> {/* tm-td-channels */}
                    <td className="py-3 px-4 border-b border-gray-100"> {/* tm-td-status */}
                      <span className={`inline-block py-1 px-2.5 rounded-md text-xs font-semibold ${
                        member.status.toLowerCase() === 'active' ? 'bg-emerald-100 text-emerald-700' :
                        member.status.toLowerCase() === 'inactive' ? 'bg-gray-100 text-gray-600' :
                        'bg-amber-100 text-amber-700'
                      }`}> {/* tm-status-badge */}
                        {member.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 border-b border-gray-100 text-gray-600 text-sm">{member.joinDate}</td> {/* tm-td-date */}
                    <td className="py-3 px-4 border-b border-gray-100"> {/* tm-td-actions */}
                      <div className="flex items-center gap-2"> {/* tm-actions-row */}
                        <button className="w-8 h-8 rounded-lg border-0 flex items-center justify-center text-blue-600 bg-blue-50 cursor-pointer transition-all duration-200 hover:bg-blue-100" title="Edit"> {/* tm-action-btn edit */}
                          <FiEdit />
                        </button>
                        <button className="w-8 h-8 rounded-lg border-0 flex items-center justify-center text-red-600 bg-red-50 cursor-pointer transition-all duration-200 hover:bg-red-100" title="Delete"> {/* tm-action-btn delete */}
                          <FiTrash2 />
                        </button>
                        <button className="w-8 h-8 rounded-lg border-0 flex items-center justify-center text-amber-600 bg-amber-50 cursor-pointer transition-all duration-200 hover:bg-amber-100" title="Reassign"> {/* tm-action-btn reassign */}
                          <FiRefreshCw />
                        </button>
                        <div className="relative"> {/* tm-more-wrapper */}
                          <button
                            className="w-8 h-8 rounded-lg border-0 flex items-center justify-center text-gray-600 bg-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-200" /* tm-action-btn more */
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
          <div className="hidden md:flex flex-col gap-3"> {/* tm-mobile-card */}
            {teamData.map((member) => (
              <div key={member.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200"> {/* tm-mobile-card-item */}
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200"> {/* tm-mobile-card-header */}
                  <h3 className="text-base font-bold text-gray-900 m-0">{member.name}</h3> {/* tm-mobile-card-name */}
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member.id)}
                    onChange={() => toggleSelect(member.id)}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 cursor-pointer focus:ring-2 focus:ring-blue-500" /* tm-mobile-card-checkbox */
                  />
                </div>
                <div className="flex flex-col gap-2.5 mb-3"> {/* tm-mobile-card-body */}
                  <div className="flex items-center justify-between"> {/* tm-mobile-card-row */}
                    <span className="text-xs font-medium text-gray-500 uppercase">Role:</span> {/* tm-mobile-card-label */}
                    <span className="text-sm font-semibold text-gray-900">{member.role}</span> {/* tm-mobile-card-value */}
                  </div>
                  <div className="flex items-center justify-between"> {/* tm-mobile-card-row */}
                    <span className="text-xs font-medium text-gray-500 uppercase">Reports to:</span> {/* tm-mobile-card-label */}
                    <span className="text-sm font-semibold text-gray-900"> {/* tm-mobile-card-value */}
                      {member.reportsTo || <span className="text-gray-400">&mdash;</span>} {/* tm-dash */}
                    </span>
                  </div>
                  <div className="flex items-center justify-between"> {/* tm-mobile-card-row */}
                    <span className="text-xs font-medium text-gray-500 uppercase">Listings:</span> {/* tm-mobile-card-label */}
                    <span className="text-sm font-semibold text-gray-900">{member.listings}</span> {/* tm-mobile-card-value */}
                  </div>
                  <div className="flex items-center justify-between"> {/* tm-mobile-card-row */}
                    <span className="text-xs font-medium text-gray-500 uppercase">Channels:</span> {/* tm-mobile-card-label */}
                    <span className="text-sm text-gray-600"> {/* tm-mobile-card-value tm-mobile-card-channels */}
                      {formatChannels(member.inquiryChannels)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between"> {/* tm-mobile-card-row */}
                    <span className="text-xs font-medium text-gray-500 uppercase">Status:</span> {/* tm-mobile-card-label */}
                    <span className="text-sm font-semibold text-gray-900"> {/* tm-mobile-card-value */}
                      <span className={`inline-block py-1 px-2.5 rounded-md text-xs font-semibold ${
                        member.status.toLowerCase() === 'active' ? 'bg-emerald-100 text-emerald-700' :
                        member.status.toLowerCase() === 'inactive' ? 'bg-gray-100 text-gray-600' :
                        'bg-amber-100 text-amber-700'
                      }`}> {/* tm-status-badge */}
                        {member.status}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between"> {/* tm-mobile-card-row */}
                    <span className="text-xs font-medium text-gray-500 uppercase">Join Date:</span> {/* tm-mobile-card-label */}
                    <span className="text-sm font-semibold text-gray-900">{member.joinDate}</span> {/* tm-mobile-card-value */}
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-gray-200"> {/* tm-mobile-card-actions */}
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border-0 text-sm font-medium text-blue-600 bg-blue-50 cursor-pointer transition-all duration-200 hover:bg-blue-100" title="Edit"> {/* tm-mobile-action-btn edit */}
                    <FiEdit />
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border-0 text-sm font-medium text-red-600 bg-red-50 cursor-pointer transition-all duration-200 hover:bg-red-100" title="Delete"> {/* tm-mobile-action-btn delete */}
                    <FiTrash2 />
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border-0 text-sm font-medium text-amber-600 bg-amber-50 cursor-pointer transition-all duration-200 hover:bg-amber-100" title="Reassign"> {/* tm-mobile-action-btn reassign */}
                    <FiRefreshCw />
                  </button>
                  <div className="relative"> {/* tm-mobile-more-wrapper */}
                    <button
                      className="flex items-center justify-center w-10 h-10 rounded-lg border-0 text-gray-600 bg-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-200" /* tm-mobile-action-btn more */
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

        {/* Create Team + Team List section */}
        <div className="tm-section">
          <div className="tm-create-team">
            <h4>My Teams</h4>
            <div className="tm-field">
              <label>Team Name</label>
              <input type="text" placeholder="Enter team name" />
            </div>
            <div className="tm-field">
              <label>Team Lead</label>
              <select>
                <option>Select team lead</option>
                {teamData.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="tm-field">
              <label>Team Members</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {teamData.map((m) => (
                  <label key={m.id} style={{ fontSize: 13, color: '#374151' }}>
                    <input type="checkbox" style={{ marginRight: 8 }} /> {m.name}
                  </label>
                ))}
              </div>
            </div>
            <div className="tm-field">
              <label>Focus Area</label>
              <input type="text" placeholder="e.g., Luxury Condos" />
            </div>
            <div className="tm-field">
              <label>Team Color</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ width: 28, height: 28, borderRadius: 6, background: '#2563EB', border: 'none' }} />
                <button style={{ width: 28, height: 28, borderRadius: 6, background: '#10B981', border: 'none' }} />
                <button style={{ width: 28, height: 28, borderRadius: 6, background: '#F97316', border: 'none' }} />
                <button style={{ width: 28, height: 28, borderRadius: 6, background: '#6EE7B7', border: 'none' }} />
              </div>
            </div>
            <div className="tm-field">
              <label>Team Icon</label>
              <div className="tm-icon-swatches">
                <button className="tm-icon-swatch"><FiHome /></button>
                <button className="tm-icon-swatch"><FiKey /></button>
                <button className="tm-icon-swatch"><FiGrid /></button>
                <button className="tm-icon-swatch"><FiStar /></button>
              </div>
            </div>
            <div>
              <button className="tm-create-btn">Create Team</button>
            </div>
          </div>

          <div className="tm-team-list">
            <div className="tm-team-card team-blue">
              <div className="tm-team-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="tm-team-icon-box"><FiHome /></div>
                  <div className="tm-team-title">
                    <div className="title">The High-Risers</div>
                    <div className="subtitle">Luxury Condos</div>
                  </div>
                </div>
                <div className="subtitle">Top Performing</div>
              </div>
              <div className="tm-team-card-body">
                <div className="tm-team-lead">
                  <div style={{ width: 44, height: 44, borderRadius: 22, background: '#ffffff22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>G</div>
                  <div className="lead-meta">
                    <div style={{ fontWeight: 700 }}>Gabo Dela Cruz</div>
                    <div style={{ fontSize: 13, color: '#E6F0FF' }}>Unit Manager</div>
                  </div>
                </div>
                <div className="tm-team-members">
                  <div className="tm-team-member">
                    <div style={{ width: 36, height: 36, borderRadius: 18, background: '#F3F4F6' }} />
                    <div>
                      <div style={{ fontWeight: 600 }}>Angelo Reyes</div>
                      <div style={{ fontSize: 12, color: '#6B7280' }}>Sales Agent</div>
                    </div>
                  </div>
                  <div className="tm-team-member">
                    <div style={{ width: 36, height: 36, borderRadius: 18, background: '#F3F4F6' }} />
                    <div>
                      <div style={{ fontWeight: 600 }}>Sofia Mendoza</div>
                      <div style={{ fontSize: 12, color: '#6B7280' }}>Sales Agent</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tm-team-stats">
                <div className="tm-team-stat">
                  <div className="value">47</div>
                  <div className="label">Active Listings</div>
                </div>
                <div className="tm-team-stat">
                  <div className="value">128</div>
                  <div className="label">Inquiries</div>
                </div>
                <div className="tm-team-stat">
                  <div className="value">92%</div>
                  <div className="label">Response Rate</div>
                </div>
              </div>
            </div>

            <div className="tm-team-card team-orange">
              <div className="tm-team-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="tm-team-icon-box"><FiGrid /></div>
                  <div className="tm-team-title">
                    <div className="title">Urban Specialists</div>
                    <div className="subtitle">Affordable Studios</div>
                  </div>
                </div>
                <div className="subtitle">Growing</div>
              </div>
              <div className="tm-team-card-body">
                <div className="tm-team-lead">
                  <div style={{ width: 44, height: 44, borderRadius: 22, background: '#ffffff22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>C</div>
                  <div className="lead-meta">
                    <div style={{ fontWeight: 700 }}>Camille Santos</div>
                    <div style={{ fontSize: 13, color: '#FFF3E6' }}>Unit Manager</div>
                  </div>
                </div>
                <div className="tm-team-members">
                  <div className="tm-team-member">
                    <div style={{ width: 36, height: 36, borderRadius: 18, background: '#F3F4F6' }} />
                    <div>
                      <div style={{ fontWeight: 600 }}>Marco Valdez</div>
                      <div style={{ fontSize: 12, color: '#6B7280' }}>Sales Agent</div>
                    </div>
                  </div>
                  <div className="tm-team-member">
                    <div style={{ width: 36, height: 36, borderRadius: 18, background: '#F3F4F6' }} />
                    <div>
                      <div style={{ fontWeight: 600 }}>Beatriz Luna</div>
                      <div style={{ fontSize: 12, color: '#6B7280' }}>Sales Agent</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tm-team-stats">
                <div className="tm-team-stat">
                  <div className="value">83</div>
                  <div className="label">Active Listings</div>
                </div>
                <div className="tm-team-stat">
                  <div className="value">96</div>
                  <div className="label">Inquiries</div>
                </div>
                <div className="tm-team-stat">
                  <div className="value">87%</div>
                  <div className="label">Response Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
