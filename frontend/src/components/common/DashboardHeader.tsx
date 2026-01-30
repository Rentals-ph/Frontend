'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FiLogOut, FiChevronDown, FiUser, FiBell } from 'react-icons/fi'
import './DashboardHeader.css'

interface DashboardHeaderProps {
  title?: string
  subtitle?: string
  userName?: string
  userRole?: string
  accountRoute?: string
  showNotifications?: boolean
  avatarFallback?: string
}

function DashboardHeader({ 
  title = 'Dashboard', 
  subtitle = 'Welcome back',
  userName = 'User',
  userRole,
  accountRoute,
  showNotifications = false,
  avatarFallback
}: DashboardHeaderProps) {
  const router = useRouter()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Close user menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  const handleLogout = () => {
    // Clear all localStorage items (works for all roles)
    localStorage.removeItem('agent_registration_status')
    localStorage.removeItem('agent_registered_email')
    localStorage.removeItem('agent_status')
    localStorage.removeItem('auth_token')
    localStorage.removeItem('agent_name')
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_name')
    localStorage.removeItem('user_token')
    localStorage.removeItem('user_name')
    localStorage.removeItem('user_role')
    
    // Navigate to home page
    router.push('/')
    // Small delay to ensure navigation happens before reload
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  // Generate avatar fallback from user name if not provided
  const getAvatarFallback = () => {
    if (avatarFallback) return avatarFallback
    if (userName) {
      const names = userName.split(' ')
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase()
      }
      return userName.substring(0, 2).toUpperCase()
    }
    return 'U'
  }

  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div>
          <h1>{title}</h1>
          <p className="welcome-text">{subtitle}</p>
        </div>
        <div className="header-right">
          {showNotifications && (
            <FiBell className="notification-icon" />
          )}
          <div className="user-profile-wrapper" ref={userMenuRef}>
            <button 
              className="user-profile-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
              aria-label="User menu"
            >
              <div className="user-profile">
                <div className="profile-avatar">
                  <img 
                    src="/assets/profile-placeholder.png" 
                    alt={userName} 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.nextElementSibling?.classList.remove('hidden')
                    }} 
                  />
                  <div className="avatar-fallback hidden">{getAvatarFallback()}</div>
                </div>
                <div className="user-info">
                  <span className="user-name">{userName}</span>
                  {userRole && <span className="user-role">{userRole}</span>}
                </div>
                <FiChevronDown className={`user-menu-chevron ${showUserMenu ? 'open' : ''}`} />
              </div>
            </button>
            
            {showUserMenu && (
              <div className="user-menu-dropdown">
                {accountRoute && (
                  <button 
                    className="user-menu-item" 
                    onClick={() => {
                      router.push(accountRoute)
                      setShowUserMenu(false)
                    }}
                  >
                    <FiUser className="user-menu-icon" />
                    <span>Account</span>
                  </button>
                )}
                <button className="user-menu-item logout" onClick={handleLogout}>
                  <FiLogOut className="user-menu-icon" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader

