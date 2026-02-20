'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ASSETS } from '@/utils/assets'
import {
  FiMail,
  FiDownload,
  FiCreditCard,
  FiHome,
  FiList,
  FiBarChart2,
  FiFileText,
  FiBookOpen,
  FiLayout,
  FiUsers,
  FiDollarSign,
  FiLayers,
  FiMessageCircle,
  FiMenu,
  FiX,
  FiSettings,
  FiCheckSquare,
  FiGrid,
  FiLogOut,
  FiUser,
} from 'react-icons/fi'


function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showLogoutDropdown, setShowLogoutDropdown] = useState(false)
  const sidebarRef = useRef<HTMLElement>(null)
  const logoutRef = useRef<HTMLDivElement>(null)
  
  // Determine if we're on admin or agent routes
  const isAdminRoute = pathname?.startsWith('/admin')
  const isAgentRoute = pathname?.startsWith('/agent')
  const isBrokerRoute = pathname?.startsWith('/broker')

  useEffect(() => {
    // Only check unread messages for agent routes
    if (!isAgentRoute) return

    const checkUnreadMessages = () => {
      // Check if account is processing (this would show as a notification in inbox)
      const registrationStatus = localStorage.getItem('agent_registration_status')
      const agentStatus = localStorage.getItem('agent_status')
      
      let hasUnread = false
      
      if (registrationStatus === 'processing' || 
          agentStatus === 'processing' || 
          agentStatus === 'pending' || 
          agentStatus === 'under_review') {
        hasUnread = true
      }

      // Check for unread messages count
      const unreadCount = localStorage.getItem('unread_messages_count')
      if (unreadCount && parseInt(unreadCount) > 0) {
        hasUnread = true
      }

      setHasUnreadMessages(hasUnread)
    }

    // Check initially
    checkUnreadMessages()

    // Listen for storage changes (when inbox updates unread count)
    window.addEventListener('storage', checkUnreadMessages)
    
    // Also check periodically in case localStorage is updated in the same window
    const interval = setInterval(checkUnreadMessages, 1000)

    return () => {
      window.removeEventListener('storage', checkUnreadMessages)
      clearInterval(interval)
    }
  }, [isAgentRoute])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        // Check if click is on the mobile menu button (which is outside sidebar)
        const target = event.target as HTMLElement
        if (!target.closest('.mobile-menu-toggle')) {
          setIsMobileMenuOpen(false)
        }
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  // Close logout dropdown when clicking outside
  useEffect(() => {
    const handleClickOutsideLogout = (event: MouseEvent) => {
      if (logoutRef.current && !logoutRef.current.contains(event.target as Node)) {
        setShowLogoutDropdown(false)
      }
    }

    if (showLogoutDropdown) {
      document.addEventListener('mousedown', handleClickOutsideLogout)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideLogout)
    }
  }, [showLogoutDropdown])

  const handleLogout = () => {
    // Clear all auth data from localStorage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_token')
    localStorage.removeItem('user_name')
    localStorage.removeItem('user_email')
    localStorage.removeItem('user_phone')
    localStorage.removeItem('user_avatar')
    localStorage.removeItem('user_role')
    localStorage.removeItem('agent_id')
    localStorage.removeItem('agent_name')
    localStorage.removeItem('agent_status')
    localStorage.removeItem('agent_registration_status')
    localStorage.removeItem('broker_status')
    localStorage.removeItem('broker_registration_status')
    localStorage.removeItem('unread_messages_count')
    setShowLogoutDropdown(false)
    router.push('/')
  }

  const isActive = (path: string) => {
    if (!pathname) return false
    if (path === '/agent') {
      // For create listing pages, check if we're on any create-listing route
      return pathname === '/agent' ||
        pathname === '/agent/' ||
        pathname.startsWith('/agent/create-listing')
    }
    if (path === '/admin') {
      return pathname === '/admin' || pathname === '/admin/'
    }
    if (path === '/broker') {
      return pathname === '/broker' || pathname === '/broker/'
    }
    return pathname === path || pathname.startsWith(path + '/')
  }

  // Agent sidebar content
  const renderAgentSidebar = () => (
    <>
      {/*<Link
        href="/"
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg no-underline text-gray-500 text-[13px] font-medium transition-all ${isActive('/') && !pathname?.includes('//') ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-50 hover:text-gray-900'}`}
      >
        <FiLayout className="text-lg" />
        <span>Home</span>
      </Link>*/}
      <Link
        href="/agent"
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg no-underline text-gray-500 text-[13px] font-medium transition-all ${isActive('/agent') && !pathname?.includes('/agent/') ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-50 hover:text-gray-900'}`}
      >
        <FiHome className="text-lg" />
        <span>Dashboard</span>
      </Link>
      <Link
        href="/agent/inbox"
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg no-underline text-gray-500 text-[13px] font-medium transition-all ${isActive('/agent/inbox') ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-50 hover:text-gray-900'}`}
      >
        <div className="relative inline-flex items-center justify-center">
          <FiMail className="text-lg" />
          {hasUnreadMessages && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.1)]"></span>}
        </div>
        <span>Inbox</span>
      </Link>
      {/* <Link
        href="/agent/downloadables"
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg no-underline text-gray-500 text-[13px] font-medium transition-all ${isActive('/agent/downloadables') ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-50 hover:text-gray-900'}`}
      >
        <FiDownload className="text-lg" />
        <span>Downloadables</span>
      </Link> 
      <Link
        href="/agent/digital-card"
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg no-underline text-gray-500 text-[13px] font-medium transition-all ${isActive('/agent/digital-card') ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-50 hover:text-gray-900'}`}
      >
        <FiCreditCard className="text-lg" />
        <span>Digital Business Card</span>
      </Link>*/}
      <Link
        href="/agent/page-builder"
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg no-underline text-gray-500 text-[13px] font-medium transition-all ${isActive('/agent/page-builder') ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-50 hover:text-gray-900'}`}
      >
        <FiSettings className="text-lg" />
        <span>Page Builder</span>
      </Link> 

      <Link
          href="/agent/listings"
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg no-underline text-gray-500 text-[13px] font-medium transition-all ${isActive('/agent/listings') ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-50 hover:text-gray-900'}`}
        >
          <FiList className="text-lg" />
          <span>My Listings</span>
        </Link>
        {/* <Link
          href="/agent/tracker"
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg no-underline text-gray-500 text-[13px] font-medium transition-all ${isActive('/agent/tracker') ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-50 hover:text-gray-900'}`}
        >
          <FiBarChart2 className="text-lg" />
          <span>Rental Tracker</span>
        </Link>
        <Link
          href="/agent/rent-estimate"
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg no-underline text-gray-500 text-[13px] font-medium transition-all ${isActive('/agent/rent-estimate') ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-50 hover:text-gray-900'}`}
        >
          <FiFileText className="text-lg" />
          <span>Rent Estimate</span>
        </Link>
        <Link
          href="/agent/blogs"
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg no-underline text-gray-500 text-[13px] font-medium transition-all ${isActive('/agent/blogs') ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-50 hover:text-gray-900'}`}
        >
          <FiBookOpen className="text-lg" />
          <span>Share Blogs</span>
        </Link>*/}
    </>
  )

  // Broker sidebar content
  const renderBrokerSidebar = () => (
    <>
      <Link
        href="/broker"
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg no-underline text-gray-500 text-[13px] font-medium transition-all ${isActive('/broker') ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-50 hover:text-gray-900'}`}
      >
        <FiGrid className="text-lg" />
        <span>Dashboard</span>
      </Link>
      <Link
        href="/broker/company-profile"
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg no-underline text-gray-500 text-[13px] font-medium transition-all ${isActive('/broker/company-profile') ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-50 hover:text-gray-900'}`}
      >
        <FiLayout className="text-lg" />
        <span>Company Profile</span>
      </Link>
      <Link
        href="/broker/team"
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg no-underline text-gray-500 text-[13px] font-medium transition-all ${isActive('/broker/team') ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-50 hover:text-gray-900'}`}
      >
        <FiUsers className="text-lg" />
        <span>Team Management</span>
      </Link>
      <Link
        href="/broker/listings"
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg no-underline text-gray-500 text-[13px] font-medium transition-all ${isActive('/broker/listings') ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-50 hover:text-gray-900'}`}
      >
        <FiHome className="text-lg" />
        <span>Listings</span>
      </Link>
      <Link
        href="/broker/approvals"
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg no-underline text-gray-500 text-[13px] font-medium transition-all ${isActive('/broker/approvals') ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-50 hover:text-gray-900'}`}
      >
        <FiCheckSquare className="text-lg" />
        <span>Agent Approvals</span>
      </Link>
      <Link
        href="/broker/page-builder"
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg no-underline text-gray-500 text-[13px] font-medium transition-all ${isActive('/broker/page-builder') ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-50 hover:text-gray-900'}`}
      >
        <FiFileText className="text-lg" />
        <span>Page Builder</span>
      </Link>
      <Link
        href="/broker/reports"
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg no-underline text-gray-500 text-[13px] font-medium transition-all ${isActive('/broker/reports') ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-50 hover:text-gray-900'}`}
      >
        <FiBarChart2 className="text-lg" />
        <span>Reports</span>
      </Link>
      <Link
        href="/broker/inbox"
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg no-underline text-gray-500 text-[13px] font-medium transition-all ${isActive('/broker/inbox') ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-50 hover:text-gray-900'}`}
      >
        <div className="relative inline-flex items-center justify-center">
          <FiMail className="text-lg" />
          {hasUnreadMessages && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.1)]"></span>}
        </div>
        <span>Inbox</span>
      </Link>
      <Link
        href="/broker/downloadables"
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg no-underline text-gray-500 text-[13px] font-medium transition-all ${isActive('/broker/downloadables') ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-50 hover:text-gray-900'}`}
      >
        <FiDownload className="text-lg" />
        <span>Downloadables</span>
      </Link>
      <Link
        href="/broker/digital-card"
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg no-underline text-gray-500 text-[13px] font-medium transition-all ${isActive('/broker/digital-card') ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-50 hover:text-gray-900'}`}
      >
        <FiCreditCard className="text-lg" />
        <span>Digital Business Card</span>
      </Link>
    </>
  )

  // Admin sidebar content
  const renderAdminSidebar = () => (
    <>
      <Link
        href="/"
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg no-underline text-gray-500 text-[13px] font-medium transition-all ${isActive('/') && !pathname?.includes('//') ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-50 hover:text-gray-900'}`}
      >
        <FiLayout className="text-lg" />
        <span>Home</span>
      </Link>
      <Link
        href="/admin"
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg no-underline text-gray-500 text-[13px] font-medium transition-all ${isActive('/admin') ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-50 hover:text-gray-900'}`}
      >
        <FiHome className="text-lg" />
        <span>Dashboard</span>
      </Link>
      <Link
        href="/admin/agents"
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg no-underline text-gray-500 text-[13px] font-medium transition-all ${isActive('/admin/agents') ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-50 hover:text-gray-900'}`}
      >
        <FiUsers className="text-lg" />
        <span>Agents</span>
      </Link>
      <Link
        href="/admin/properties"
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg no-underline text-gray-500 text-[13px] font-medium transition-all ${isActive('/admin/properties') ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-50 hover:text-gray-900'}`}
      >
        <FiLayers className="text-lg" />
        <span>Properties</span>
      </Link>
      <Link
        href="/admin/revenue"
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg no-underline text-gray-500 text-[13px] font-medium transition-all ${isActive('/admin/revenue') ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-50 hover:text-gray-900'}`}
      >
        <FiDollarSign className="text-lg" />
        <span>Revenue</span>
      </Link>
      <Link
        href="/admin/users"
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg no-underline text-gray-500 text-[13px] font-medium transition-all ${isActive('/admin/users') ? 'bg-blue-50 text-blue-500' : 'hover:bg-gray-50 hover:text-gray-900'}`}
      >
        <FiUsers className="text-lg" />
        <span>Users</span>
      </Link>
    </>
  )

  const handleNavClick = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button 
        className="hidden fixed top-4 left-4 z-[1001] bg-white border border-gray-200 rounded-lg p-2.5 cursor-pointer text-gray-900 shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-all md:flex md:items-center md:justify-center hover:bg-gray-50 hover:shadow-[0_4px_6px_rgba(0,0,0,0.15)] max-[480px]:top-3 max-[480px]:left-3 max-[480px]:p-2"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="hidden fixed inset-0 bg-black/50 z-[999] md:block"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        className={`w-[280px] lg:w-60 bg-white border-r border-gray-200 flex flex-col fixed h-screen overflow-hidden z-[1000] md:-translate-x-full md:transition-transform md:duration-300 md:ease-in-out max-[480px]:w-[260px] ${isMobileMenuOpen ? 'md:translate-x-0' : ''}`}
      >
        <div className="p-2.5 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-center w-full mb-1">
            <Link href="/">
              <img
                src={ASSETS.LOGO_HERO_MAIN}
                alt="Rentals.ph logo"
                className="w-auto h-[60px] md:h-[50px] max-w-full object-contain"
              />
            </Link>
          </div>
        </div>

        <nav className="p-3 lg:py-2.5 lg:px-2 md:p-3 flex flex-col gap-4 lg:gap-3 md:gap-4 flex-1 overflow-y-auto overflow-x-hidden min-h-0 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb:hover]:bg-gray-400" onClick={handleNavClick}>
          {isAdminRoute ? renderAdminSidebar() : isBrokerRoute ? renderBrokerSidebar() : renderAgentSidebar()}
        </nav>

        {isBrokerRoute && (
          <div className="relative flex-shrink-0" ref={logoutRef}>
            {showLogoutDropdown && (
              <div className="absolute bottom-full left-3 right-3 bg-white border border-gray-200 rounded-[10px] shadow-[0_-4px_16px_rgba(0,0,0,0.12)] p-1.5 mb-1.5 z-[100] animate-[slideUpFade_0.15s_ease-out]">
                <button 
                  className="flex items-center gap-2.5 w-full px-3.5 py-2.5 bg-transparent border-none rounded-lg text-sm font-medium text-gray-900 cursor-pointer transition-colors hover:bg-gray-50" 
                  onClick={() => {
                    router.push('/broker/account')
                    setShowLogoutDropdown(false)
                  }}
                >
                  <FiUser className="text-lg flex-shrink-0" />
                  <span>Account</span>
                </button>
                <button className="flex items-center gap-2.5 w-full px-3.5 py-2.5 bg-transparent border-none rounded-lg text-sm font-medium text-red-500 cursor-pointer transition-colors hover:bg-red-50" onClick={handleLogout}>
                  <FiLogOut className="text-lg flex-shrink-0" />
                  <span>Logout</span>
                </button>
              </div>
            )}
            <div 
              className="flex items-center gap-2.5 px-5 py-4 border-t border-gray-200 flex-shrink-0 transition-colors cursor-pointer hover:bg-gray-100" 
              onClick={() => setShowLogoutDropdown(!showLogoutDropdown)}
            >
              <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                <img
                  src={ASSETS.PLACEHOLDER_PROFILE}
                  alt="User"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    if (target.nextElementSibling) {
                      (target.nextElementSibling as HTMLElement).style.display = 'flex'
                    }
                  }}
                />
                <div className="w-full h-full hidden items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-[13px]">JA</div>
              </div>
              <div className="flex flex-col gap-px flex-1 min-w-0">
                <span className="text-[13px] font-semibold text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">John Anderson</span>
                <span className="text-[11px] text-gray-400">Broker</span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}

export default AppSidebar

