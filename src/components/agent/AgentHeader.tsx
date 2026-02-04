'use client'

import { useState, useEffect } from 'react'
import DashboardHeader from '../common/DashboardHeader'
import { agentsApi } from '../../api'
import type { Agent } from '../../api/endpoints/agents'

interface AgentHeaderProps {
  title?: string
  subtitle?: string
}

function AgentHeader({ title = 'Dashboard', subtitle = 'Welcome back, manage your rental properties.' }: AgentHeaderProps) {
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        // Try to get current authenticated agent first
        const agentData = await agentsApi.getCurrent()
        setAgent(agentData)
        
        // Update localStorage with agent info for Navbar
        if (agentData.first_name && agentData.last_name) {
          const fullName = `${agentData.first_name} ${agentData.last_name}`
          localStorage.setItem('agent_name', fullName)
          localStorage.setItem('user_name', fullName)
        }
        if (agentData.id) {
          localStorage.setItem('agent_id', agentData.id.toString())
        }
      } catch (error) {
        console.error('Error fetching agent data:', error)
        // Fallback to using agent_id if getCurrent fails
        try {
          const agentId = localStorage.getItem('agent_id')
          if (agentId) {
            const agentData = await agentsApi.getById(parseInt(agentId))
            setAgent(agentData)
            
            // Update localStorage with agent info
            if (agentData.first_name && agentData.last_name) {
              const fullName = `${agentData.first_name} ${agentData.last_name}`
              localStorage.setItem('agent_name', fullName)
              localStorage.setItem('user_name', fullName)
            }
          }
        } catch (fallbackError) {
          console.error('Error fetching agent by ID:', fallbackError)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAgentData()
  }, [])

  // Get user name from agent data or localStorage
  const userName = agent?.full_name || 
    (agent?.first_name && agent?.last_name 
      ? `${agent.first_name} ${agent.last_name}` 
      : null) ||
    localStorage.getItem('agent_name') ||
    localStorage.getItem('user_name') ||
    'Agent'
  
  // Get avatar fallback initials
  const getInitials = (name: string): string => {
    if (!name || name === 'Agent') {
      const storedName = localStorage.getItem('user_name') || localStorage.getItem('agent_name')
      if (storedName && storedName !== 'Agent') {
        return storedName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'A'
      }
      return 'A'
    }
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'A'
  }
  
  const avatarFallback = getInitials(userName)

  // Get user role
  const userRole = agent?.verified ? 'Rent Manager' : 'Property Agent'
  
  // Get avatar image
  const avatarImage = agent?.image || agent?.avatar || agent?.profile_image || undefined
  
  return (
    <DashboardHeader
      title={title}
      subtitle={subtitle}
      userName={userName}
      userRole={userRole}
      accountRoute="/agent/account"
      avatarFallback={avatarFallback}
      avatarImage={avatarImage}
    />
  )
}

export default AgentHeader

