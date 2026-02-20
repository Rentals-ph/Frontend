'use client'

import { useState, useEffect } from 'react'
import DashboardHeader from '../common/DashboardHeader'

interface BrokerHeaderProps {
  title?: string
  subtitle?: string
  showNotifications?: boolean
}

function BrokerHeader({ title = 'Dashboard', subtitle = 'Welcome back, manage your team and properties.', showNotifications = false }: BrokerHeaderProps) {
  const [userName, setUserName] = useState<string>('Broker')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get user name from localStorage
    const storedName = localStorage.getItem('user_name') || localStorage.getItem('broker_name') || 'Broker'
    setUserName(storedName)
    setLoading(false)
  }, [])

  // Get avatar fallback initials
  const getInitials = (name: string): string => {
    if (!name || name === 'Broker') {
      return 'B'
    }
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'B'
  }
  
  const avatarFallback = getInitials(userName)
  
  // Get user role
  const userRole = 'Broker'
  
  // Get avatar image from localStorage if available
  const avatarImage = undefined // Could be stored in localStorage if needed
  
  return (
    <DashboardHeader
      title={title}
      subtitle={subtitle}
      userName={userName}
      userRole={userRole}
      accountRoute="/broker/account"
      showNotifications={showNotifications}
      avatarFallback={avatarFallback}
      avatarImage={avatarImage}
    />
  )
}

export default BrokerHeader

