'use client'

import { useState, useRef, useEffect } from 'react'
import AppSidebar from '../../../components/common/AppSidebar'
import BrokerHeader from '../../../components/broker/BrokerHeader'
import { brokerApi } from '../../../api'
import type { Team, TeamMember } from '../../../api/endpoints/broker'
import {
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
  FiX,
  FiCheck,
} from 'react-icons/fi'

interface TeamMemberDisplay {
  id: number
  name: string
  role: 'Unit Manager' | 'Agent'
  reportsTo: string | null
  listings: number
  inquiryChannels: string[]
  status: 'Active' | 'Inactive' | 'Pending'
  joinDate: string
}

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
    <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px] z-50" ref={menuRef}>
      <button className="w-full flex items-center gap-2.5 py-2.5 px-4 text-sm text-gray-700 bg-transparent border-0 cursor-pointer transition-colors duration-200 hover:bg-gray-100" onClick={onClose}>
        <FiEdit className="text-base text-blue-600" />
        <span>Edit Profile</span>
      </button>
      <button className="w-full flex items-center gap-2.5 py-2.5 px-4 text-sm text-gray-700 bg-transparent border-0 cursor-pointer transition-colors duration-200 hover:bg-gray-100" onClick={onClose}>
        <FiRefreshCw className="text-base text-amber-600" />
        <span>Reassign</span>
      </button>
      <button className="w-full flex items-center gap-2.5 py-2.5 px-4 text-sm text-red-600 bg-transparent border-0 cursor-pointer transition-colors duration-200 hover:bg-red-50" onClick={onClose}>
        <FiAlertCircle className="text-base text-red-600" />
        <span>Deactivate</span>
      </button>
    </div>
  )
}

export default function TeamManagementPage() {
  const [selectedMembers, setSelectedMembers] = useState<number[]>([])
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [expandedMemberId, setExpandedMemberId] = useState<number | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMemberDisplay[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [agents, setAgents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateTeamForm, setShowCreateTeamForm] = useState(false)
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    company_id: null as number | null,
    teamLeadId: null as number | null,
    selectedMembers: [] as number[],
    focusArea: '',
    teamColor: '#2563EB',
    teamIcon: 'home' as 'home' | 'key' | 'grid' | 'star',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [teamsData, agentsData] = await Promise.all([
          brokerApi.getTeams(),
          brokerApi.getAgents(),
        ])
        
        setTeams(teamsData)
        setAgents(agentsData)
        
        // Transform agents to TeamMemberDisplay format
        const members: TeamMemberDisplay[] = agentsData.map((agent: any) => {
          // Find which team this agent belongs to
          const teamMembership = teamsData
            .flatMap(team => team.members || [])
            .find((member: TeamMember) => member.agent_id === agent.id)
          
          return {
            id: agent.id,
            name: `${agent.first_name || ''} ${agent.last_name || ''}`.trim() || 'Unknown',
            role: teamMembership?.role === 'Unit Manager' ? 'Unit Manager' : 'Agent',
            reportsTo: null, // Would need to determine from team structure
            listings: 0, // Would need to fetch from properties
            inquiryChannels: ['WhatsApp', 'Email'], // Default
            status: agent.status === 'approved' ? 'Active' : 'Pending',
            joinDate: teamMembership?.joined_at ? new Date(teamMembership.joined_at).toLocaleDateString() : 'N/A',
          }
        })
        
        setTeamMembers(members)
      } catch (error: any) {
        console.error('Error fetching team data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const allSelected = selectedMembers.length === teamMembers.length && teamMembers.length > 0

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedMembers([])
    } else {
      setSelectedMembers(teamMembers.map((m) => m.id))
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

  const handleCreateTeam = async () => {
    try {
      const teamData = {
        name: newTeam.name,
        description: newTeam.description,
        company_id: newTeam.company_id || undefined,
      }
      
      const result = await brokerApi.createTeam(teamData)
      
      // Assign team lead and members
      if (result.data.id) {
        if (newTeam.teamLeadId) {
          await brokerApi.assignAgentToTeam(result.data.id, newTeam.teamLeadId, 'Unit Manager')
        }
        
        for (const agentId of newTeam.selectedMembers) {
          if (agentId !== newTeam.teamLeadId) {
            await brokerApi.assignAgentToTeam(result.data.id, agentId, 'member')
          }
        }
      }
      
      alert('Team created successfully!')
      setShowCreateTeamForm(false)
      setNewTeam({
        name: '',
        description: '',
        company_id: null,
        teamLeadId: null,
        selectedMembers: [],
        focusArea: '',
        teamColor: '#2563EB',
        teamIcon: 'home',
      })
      
      // Refresh data
      const teamsData = await brokerApi.getTeams()
      setTeams(teamsData)
    } catch (error: any) {
      console.error('Error creating team:', error)
      alert('Failed to create team. Please try again.')
    }
  }

  const getTeamColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      '#2563EB': 'bg-blue-600',
      '#10B981': 'bg-emerald-600',
      '#F97316': 'bg-orange-600',
      '#6EE7B7': 'bg-emerald-300',
    }
    return colorMap[color] || 'bg-blue-600'
  }

  const getTeamIcon = (icon: string) => {
    const iconMap: Record<string, JSX.Element> = {
      home: <FiHome />,
      key: <FiKey />,
      grid: <FiGrid />,
      star: <FiStar />,
    }
    return iconMap[icon] || <FiHome />
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-outfit">
      <AppSidebar />
      <main className="ml-[280px] flex-1 w-[calc(100%-280px)] p-8 min-h-screen lg:ml-[240px] lg:w-[calc(100%-240px)] lg:p-6 md:ml-0 md:w-full md:p-4 md:pt-15">
        <BrokerHeader 
          title="Team Management" 
          subtitle="Manage your team members and their account permissions here." 
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-[1fr_400px] gap-6 lg:grid-cols-2">
          {/* All Users - Left Column */}
          <div className="bg-white rounded-[14px] p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6 md:flex-col md:items-start md:gap-4">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                    <FiUser className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 m-0">All Users</h3>
                    <p className="text-xs text-gray-500 m-0 mt-0.5">{teamMembers.length} team members</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer focus:ring-2 focus:ring-blue-500"
                      id="mobile-select-all"
                    />
                    <label htmlFor="mobile-select-all" className="text-sm font-medium text-gray-700 cursor-pointer">
                      Select all
                    </label>
                  </div>
                </div>
              </div>
            </div>

          {/* Desktop Table View */}
          <div className="overflow-x-auto md:hidden">
            <table className="w-full border-collapse min-w-[1100px]">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-blue-200 w-12">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer focus:ring-2 focus:ring-blue-500"
                    />
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-blue-200">
                    <div className="flex items-center gap-1.5">
                      <FiUser className="w-3.5 h-3.5 text-blue-600" />
                      <span>Name</span>
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-blue-200">
                    <div className="flex items-center gap-1.5">
                      <FiStar className="w-3.5 h-3.5 text-amber-500" />
                      <span>Role</span>
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-blue-200">
                    <div className="flex items-center gap-1.5">
                      <FiUser className="w-3.5 h-3.5 text-purple-500" />
                      <span>Reports to</span>
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-blue-200">
                    <div className="flex items-center gap-1.5">
                      <FiHome className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Listings</span>
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-blue-200">
                    <div className="flex items-center gap-1.5">
                      <FiGrid className="w-3.5 h-3.5 text-cyan-500" />
                      <span>Channels</span>
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-blue-200">
                    <div className="flex items-center gap-1.5">
                      <FiCheck className="w-3.5 h-3.5 text-green-500" />
                      <span>Status</span>
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-blue-200">
                    <div className="flex items-center gap-1.5">
                      <FiKey className="w-3.5 h-3.5 text-orange-500" />
                      <span>Join Date</span>
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-blue-200">
                    <div className="flex items-center gap-1.5">
                      <FiMoreVertical className="w-3.5 h-3.5 text-gray-500" />
                      <span>Actions</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-gray-500">Loading team members...</td>
                  </tr>
                ) : teamMembers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-gray-500">No team members yet. Create a team and add agents.</td>
                  </tr>
                ) : (
                  teamMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-blue-50/50 transition-colors duration-150 border-b border-gray-100">
                      <td className="py-3 px-4 w-12">
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(member.id)}
                          onChange={() => toggleSelect(member.id)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-900">{member.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FiStar className={`w-4 h-4 ${member.role === 'Unit Manager' ? 'text-amber-500' : 'text-gray-400'}`} />
                          <span className="text-gray-700">{member.role}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {member.reportsTo ? (
                            <>
                              <FiUser className="w-4 h-4 text-purple-500" />
                              <span className="text-gray-600">{member.reportsTo}</span>
                            </>
                          ) : (
                            <span className="text-gray-400">&mdash;</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <FiHome className="w-4 h-4 text-emerald-500" />
                          <span className="text-gray-700 font-medium">{member.listings}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <FiGrid className="w-4 h-4 text-cyan-500" />
                          <span className="text-gray-600 text-sm">{formatChannels(member.inquiryChannels)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FiCheck className={`w-4 h-4 ${
                            member.status.toLowerCase() === 'active' ? 'text-emerald-500' :
                            member.status.toLowerCase() === 'inactive' ? 'text-gray-400' :
                            'text-amber-500'
                          }`} />
                          <span className={`inline-block py-1 px-2.5 rounded-md text-xs font-semibold ${
                            member.status.toLowerCase() === 'active' ? 'bg-emerald-100 text-emerald-700' :
                            member.status.toLowerCase() === 'inactive' ? 'bg-gray-100 text-gray-600' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {member.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FiKey className="w-4 h-4 text-orange-500" />
                          <span className="text-gray-600 text-sm">{member.joinDate}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button className="w-8 h-8 rounded-lg border-0 flex items-center justify-center text-blue-600 bg-blue-50 cursor-pointer transition-all duration-200 hover:bg-blue-100 hover:shadow-sm" title="Edit">
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button className="w-8 h-8 rounded-lg border-0 flex items-center justify-center text-red-600 bg-red-50 cursor-pointer transition-all duration-200 hover:bg-red-100 hover:shadow-sm" title="Delete">
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                          <button className="w-8 h-8 rounded-lg border-0 flex items-center justify-center text-amber-600 bg-amber-50 cursor-pointer transition-all duration-200 hover:bg-amber-100 hover:shadow-sm" title="Reassign">
                            <FiRefreshCw className="w-4 h-4" />
                          </button>
                          <div className="relative">
                            <button
                              className="w-8 h-8 rounded-lg border-0 flex items-center justify-center text-gray-600 bg-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-200 hover:shadow-sm"
                              title="More"
                              onClick={() =>
                                setOpenMenuId(openMenuId === member.id ? null : member.id)
                              }
                            >
                              <FiMoreVertical className="w-4 h-4" />
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
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
            {loading ? (
              <div className="py-8 text-center text-gray-500">Loading team members...</div>
            ) : teamMembers.length === 0 ? (
              <div className="py-8 text-center text-gray-500">No team members yet. Create a team and add agents.</div>
            ) : (
              teamMembers.map((member) => {
                const isExpanded = expandedMemberId === member.id
                const statusColor = member.status.toLowerCase() === 'active' ? 'bg-emerald-500' :
                                  member.status.toLowerCase() === 'inactive' ? 'bg-gray-400' :
                                  'bg-amber-500'
                
                return (
                  <div 
                    key={member.id} 
                    className={`bg-gray-50 rounded-lg border border-gray-200 transition-all duration-200 cursor-pointer hover:shadow-sm ${
                      isExpanded ? 'p-2.5' : 'p-2'
                    }`}
                    onClick={() => setExpandedMemberId(isExpanded ? null : member.id)}
                  >
                    {/* Collapsed View - Name and Status Color */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className={`w-2 h-2 rounded-full ${statusColor} flex-shrink-0`}></div>
                        <h3 className="text-sm font-bold text-gray-900 m-0 truncate">{member.name}</h3>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(member.id)}
                          onChange={(e) => {
                            e.stopPropagation()
                            toggleSelect(member.id)
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="relative">
                          <button
                            className="flex items-center justify-center w-6 h-6 rounded border-0 text-gray-600 bg-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-200"
                            title="More"
                            onClick={(e) => {
                              e.stopPropagation()
                              setOpenMenuId(openMenuId === member.id ? null : member.id)
                            }}
                          >
                            <FiMoreVertical className="w-3.5 h-3.5" />
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

                    {/* Expanded View - All Details */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
                        {/* Role & Status Section */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[10px] font-medium text-gray-500 uppercase block mb-1">Role</span>
                            <span className="text-xs font-semibold text-gray-900">{member.role}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-medium text-gray-500 uppercase block mb-1">Status</span>
                            <span className={`inline-block py-0.5 px-1.5 rounded text-[10px] font-semibold ${
                              member.status.toLowerCase() === 'active' ? 'bg-emerald-100 text-emerald-700' :
                              member.status.toLowerCase() === 'inactive' ? 'bg-gray-100 text-gray-600' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {member.status}
                            </span>
                          </div>
                        </div>

                        {/* Reports To Section */}
                        <div>
                          <span className="text-[10px] font-medium text-gray-500 uppercase block mb-1">Reports To</span>
                          <span className="text-xs font-semibold text-gray-900">
                            {member.reportsTo || <span className="text-gray-400">&mdash;</span>}
                          </span>
                        </div>

                        {/* Performance Section */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[10px] font-medium text-gray-500 uppercase block mb-1">Listings</span>
                            <span className="text-xs font-semibold text-gray-900">{member.listings}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-medium text-gray-500 uppercase block mb-1">Join Date</span>
                            <span className="text-xs font-semibold text-gray-900">{member.joinDate}</span>
                          </div>
                        </div>

                        {/* Channels Section */}
                        <div>
                          <span className="text-[10px] font-medium text-gray-500 uppercase block mb-1">Inquiry Channels</span>
                          <span className="text-xs text-gray-600">
                            {formatChannels(member.inquiryChannels)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
          </div>

          {/* My Teams - Right Column */}
          <div className="flex flex-col gap-4 h-fit">
            {/* Create Team Form */}
            <div className="bg-white rounded-[14px] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-bold text-gray-900 m-0">My Teams</h4>
                {showCreateTeamForm && (
                  <button
                    onClick={() => setShowCreateTeamForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX />
                  </button>
                )}
              </div>
            
            {showCreateTeamForm ? (
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Team Name</label>
                  <input
                    type="text"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                    placeholder="Enter team name"
                    className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none transition-all duration-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={newTeam.description}
                    onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                    placeholder="Team description"
                    className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none transition-all duration-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    rows={3}
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Team Lead</label>
                  <select
                    value={newTeam.teamLeadId || ''}
                    onChange={(e) => setNewTeam({ ...newTeam, teamLeadId: e.target.value ? parseInt(e.target.value) : null })}
                    className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none transition-all duration-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Select team lead</option>
                    {agents.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.first_name} {agent.last_name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Team Members</label>
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {agents.map((agent) => {
                      const agentName = `${agent.first_name || ''} ${agent.last_name || ''}`.trim()
                      const isSelected = newTeam.selectedMembers.includes(agent.id) || newTeam.teamLeadId === agent.id
                      return (
                        <label key={agent.id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 p-2 rounded">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={newTeam.teamLeadId === agent.id}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewTeam({ ...newTeam, selectedMembers: [...newTeam.selectedMembers, agent.id] })
                              } else {
                                setNewTeam({ ...newTeam, selectedMembers: newTeam.selectedMembers.filter(id => id !== agent.id) })
                              }
                            }}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer focus:ring-2 focus:ring-blue-500"
                          />
                          <span className={newTeam.teamLeadId === agent.id ? 'font-semibold text-blue-600' : ''}>
                            {agentName} {newTeam.teamLeadId === agent.id && '(Lead)'}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Focus Area</label>
                  <input
                    type="text"
                    value={newTeam.focusArea}
                    onChange={(e) => setNewTeam({ ...newTeam, focusArea: e.target.value })}
                    placeholder="e.g., Luxury Condos"
                    className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none transition-all duration-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Team Color</label>
                  <div className="flex gap-2">
                    {['#2563EB', '#10B981', '#F97316', '#6EE7B7'].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewTeam({ ...newTeam, teamColor: color })}
                        className={`w-7 h-7 rounded-lg border-2 transition-all ${
                          newTeam.teamColor === color ? 'border-gray-900 scale-110' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Team Icon</label>
                  <div className="flex gap-2">
                    {[
                      { value: 'home', icon: <FiHome /> },
                      { value: 'key', icon: <FiKey /> },
                      { value: 'grid', icon: <FiGrid /> },
                      { value: 'star', icon: <FiStar /> },
                    ].map(({ value, icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setNewTeam({ ...newTeam, teamIcon: value as any })}
                        className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all ${
                          newTeam.teamIcon === value
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={handleCreateTeam}
                  disabled={!newTeam.name}
                  className="w-full py-3 px-6 bg-blue-600 text-white text-sm font-semibold rounded-lg border-0 cursor-pointer transition-all duration-200 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FiCheck />
                  Create Team
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowCreateTeamForm(true)}
                className="w-full py-3 px-6 bg-blue-600 text-white text-sm font-semibold rounded-lg border-0 cursor-pointer transition-all duration-200 hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <FiPlus />
                Create New Team
              </button>
            )}
            </div>

            {/* Team List */}
            {loading ? (
              <div className="py-8 text-center text-gray-500 bg-white rounded-[14px] p-6 shadow-sm">Loading teams...</div>
            ) : teams.length === 0 ? (
              <div className="py-8 text-center text-gray-500 bg-white rounded-[14px] p-6 shadow-sm">
                No teams yet. Create your first team to get started.
              </div>
            ) : (
              teams.map((team) => {
                const teamMembersList = team.members || []
                const teamLead = teamMembersList.find((m: TeamMember) => m.role === 'Unit Manager' || m.role === 'manager')
                const regularMembers = teamMembersList.filter((m: TeamMember) => m.role !== 'Unit Manager' && m.role !== 'manager')
                
                return (
                  <div
                    key={team.id}
                    className="bg-white rounded-[14px] p-6 shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl text-blue-600">
                          {getTeamIcon('home')}
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900">{team.name}</div>
                          <div className="text-sm text-gray-600">{team.description || 'No description'}</div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Active</span>
                    </div>
                    
                    <div className="mb-4">
                      {teamLead && teamLead.agent && (
                        <div className="flex items-center gap-3 mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="w-11 h-11 bg-blue-600 rounded-full flex items-center justify-center font-bold text-lg text-white">
                            {teamLead.agent.first_name?.[0] || 'L'}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-gray-900">
                              {teamLead.agent.first_name} {teamLead.agent.last_name}
                            </div>
                            <div className="text-xs text-gray-600">Unit Manager</div>
                          </div>
                        </div>
                      )}
                      
                      {regularMembers.length > 0 && (
                        <div className="space-y-2">
                          {regularMembers.slice(0, 2).map((member: TeamMember) => (
                            <div key={member.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-xs font-semibold text-white">
                                {member.agent?.first_name?.[0] || 'A'}
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-semibold text-gray-900">
                                  {member.agent?.first_name} {member.agent?.last_name}
                                </div>
                                <div className="text-xs text-gray-600">Sales Agent</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">{teamMembersList.length}</div>
                        <div className="text-xs text-gray-600">Members</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">0</div>
                        <div className="text-xs text-gray-600">Listings</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">0%</div>
                        <div className="text-xs text-gray-600">Response</div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
