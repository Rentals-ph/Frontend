'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FiLogOut, FiChevronDown, FiUser, FiBell } from 'react-icons/fi'
import { ASSETS } from '@/utils/assets'

interface DashboardHeaderProps {
  title?: string
  subtitle?: string
  userName?: string
  userRole?: string
  accountRoute?: string
  showNotifications?: boolean
  avatarFallback?: string
  avatarImage?: string
}

function DashboardHeader({ 
  title = 'Dashboard', 
  subtitle = 'Welcome back',
  userName = 'User',
  userRole,
  accountRoute,
  showNotifications = false,
  avatarFallback,
  avatarImage
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
    localStorage.removeItem('agent_id')
    localStorage.removeItem('agent_role')
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
    <header className="mb-8 md:mb-6">
      <div className="flex justify-between items-start flex-col gap-4 md:flex-row">
        <div>
          <h1 className="m-0 mb-2 text-[28px] md:text-[22px] sm:text-lg font-bold text-gray-900">{title}</h1>
          <p className="m-0 text-sm md:text-xs text-gray-500">{subtitle}</p>
        </div>
        <div className="flex items-center gap-5 md:w-full md:justify-between">
          {showNotifications && (
            <FiBell className="text-2xl text-gray-500 cursor-pointer transition-colors hover:text-gray-900" />
          )}
          <div className="relative" ref={userMenuRef}>
            <button 
              className="bg-transparent border-none p-0 cursor-pointer transition-all group"
              onClick={() => setShowUserMenu(!showUserMenu)}
              aria-label="User menu"
            >
              <div className="flex items-center gap-3 sm:gap-0 px-2 py-1 transition-colors group-hover:bg-gray-100 group-hover:rounded-lg">
                <div className="w-12 h-12 md:w-10 md:h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img 
                    src={avatarImage || ASSETS.PLACEHOLDER_PROFILE} 
                    alt={userName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.nextElementSibling?.classList.remove('hidden')
                    }} 
                  />
                  <div className="w-full h-full hidden flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">{getAvatarFallback()}</div>
                </div>
                <div className="flex flex-col gap-0.5 sm:hidden">
                  <span className="text-sm md:text-xs font-semibold text-gray-900">{userName}</span>
                  {userRole && <span className="text-xs md:text-[10px] text-gray-500">{userRole}</span>}
                </div>
                <FiChevronDown className={`text-base text-gray-500 transition-all group-hover:text-gray-900 sm:hidden ${showUserMenu ? 'rotate-180' : ''}`} />
              </div>
            </button>
            
            {showUserMenu && (
              <div className="absolute top-[calc(100%+8px)] right-0 min-w-[180px] bg-white border border-gray-200 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.1)] z-[1000] overflow-hidden md:left-auto">
                {accountRoute && (
                  <button 
                    className="w-full flex items-center gap-3 px-4 py-3 bg-transparent border-none text-left cursor-pointer transition-colors text-sm text-gray-900 hover:bg-gray-50" 
                    onClick={() => {
                      router.push(accountRoute)
                      setShowUserMenu(false)
                    }}
                  >
                    <FiUser className="text-lg flex-shrink-0" />
                    <span>Account</span>
                  </button>
                )}
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-transparent border-none text-left cursor-pointer transition-colors text-sm text-red-600 hover:bg-red-50" onClick={handleLogout}>
                  <FiLogOut className="text-lg flex-shrink-0" />
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

