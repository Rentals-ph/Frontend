'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ASSETS } from '@/utils/assets'
import './AppSidebar.css'
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
      <Link
        href="/"
        className={`nav-item ${isActive('/') && !pathname?.includes('//') ? 'active' : ''}`}
      >
        <FiLayout className="nav-icon" />
        <span>Home</span>
      </Link>
      <Link
        href="/agent"
        className={`nav-item ${isActive('/agent') && !pathname?.includes('/agent/') ? 'active' : ''}`}
      >
        <FiHome className="nav-icon" />
        <span>Dashboard</span>
      </Link>
      <Link
        href="/agent/inbox"
        className={`nav-item ${isActive('/agent/inbox') ? 'active' : ''}`}
      >
        <div className="nav-icon-wrapper">
          <FiMail className="nav-icon" />
          {hasUnreadMessages && <span className="inbox-indicator"></span>}
        </div>
        <span>Inbox</span>
      </Link>
      <Link
        href="/agent/downloadables"
        className={`nav-item ${isActive('/agent/downloadables') ? 'active' : ''}`}
      >
        <FiDownload className="nav-icon" />
        <span>Downloadables</span>
      </Link>
      <Link
        href="/agent/digital-card"
        className={`nav-item ${isActive('/agent/digital-card') ? 'active' : ''}`}
      >
        <FiCreditCard className="nav-icon" />
        <span>Digital Business Card</span>
      </Link>
      <Link
        href="/agent/page-builder"
        className={`nav-item ${isActive('/agent/page-builder') ? 'active' : ''}`}
      >
        <FiSettings className="nav-icon" />
        <span>Page Builder</span>
      </Link>

      <Link
          href="/agent/listings"
          className={`nav-item ${isActive('/agent/listings') ? 'active' : ''}`}
        >
          <FiList className="nav-icon" />
          <span>My Listings</span>
        </Link>
        <Link
          href="/agent/tracker"
          className={`nav-item ${isActive('/agent/tracker') ? 'active' : ''}`}
        >
          <FiBarChart2 className="nav-icon" />
          <span>Rental Tracker</span>
        </Link>
        <Link
          href="/agent/rent-estimate"
          className={`nav-item ${isActive('/agent/rent-estimate') ? 'active' : ''}`}
        >
          <FiFileText className="nav-icon" />
          <span>Rent Estimate</span>
        </Link>
        <Link
          href="/agent/blogs"
          className={`nav-item ${isActive('/agent/blogs') ? 'active' : ''}`}
        >
          <FiBookOpen className="nav-icon" />
          <span>Share Blogs</span>
        </Link>
    </>
  )

  // Broker sidebar content
  const renderBrokerSidebar = () => (
    <>
      <Link
        href="/broker"
        className={`nav-item ${isActive('/broker') ? 'active' : ''}`}
      >
        <FiGrid className="nav-icon" />
        <span>Dashboard</span>
      </Link>
      <Link
        href="/broker/company-profile"
        className={`nav-item ${isActive('/broker/company-profile') ? 'active' : ''}`}
      >
        <FiLayout className="nav-icon" />
        <span>Company Profile</span>
      </Link>
      <Link
        href="/broker/team"
        className={`nav-item ${isActive('/broker/team') ? 'active' : ''}`}
      >
        <FiUsers className="nav-icon" />
        <span>Team Management</span>
      </Link>
      <Link
        href="/broker/listings"
        className={`nav-item ${isActive('/broker/listings') ? 'active' : ''}`}
      >
        <FiHome className="nav-icon" />
        <span>Listings</span>
      </Link>
      <Link
        href="/broker/approvals"
        className={`nav-item ${isActive('/broker/approvals') ? 'active' : ''}`}
      >
        <FiCheckSquare className="nav-icon" />
        <span>Agent Approvals</span>
      </Link>
      <Link
        href="/broker/page-builder"
        className={`nav-item ${isActive('/broker/page-builder') ? 'active' : ''}`}
      >
        <FiFileText className="nav-icon" />
        <span>Page Builder</span>
      </Link>
      <Link
        href="/broker/reports"
        className={`nav-item ${isActive('/broker/reports') ? 'active' : ''}`}
      >
        <FiBarChart2 className="nav-icon" />
        <span>Reports</span>
      </Link>
      <Link
        href="/broker/inbox"
        className={`nav-item ${isActive('/broker/inbox') ? 'active' : ''}`}
      >
        <div className="nav-icon-wrapper">
          <FiMail className="nav-icon" />
          {hasUnreadMessages && <span className="inbox-indicator"></span>}
        </div>
        <span>Inbox</span>
      </Link>
      <Link
        href="/broker/downloadables"
        className={`nav-item ${isActive('/broker/downloadables') ? 'active' : ''}`}
      >
        <FiDownload className="nav-icon" />
        <span>Downloadables</span>
      </Link>
      <Link
        href="/broker/digital-card"
        className={`nav-item ${isActive('/broker/digital-card') ? 'active' : ''}`}
      >
        <FiCreditCard className="nav-icon" />
        <span>Digital Business Card</span>
      </Link>
      <Link
        href="/broker/settings"
        className={`nav-item ${isActive('/broker/settings') ? 'active' : ''}`}
      >
        <FiSettings className="nav-icon" />
        <span>Settings</span>
      </Link>
    </>
  )

  // Admin sidebar content
  const renderAdminSidebar = () => (
    <>
      <Link
        href="/"
        className={`nav-item ${isActive('/') && !pathname?.includes('//') ? 'active' : ''}`}
      >
        <FiLayout className="nav-icon" />
        <span>Home</span>
      </Link>
      <Link
        href="/admin"
        className={`nav-item ${isActive('/admin') ? 'active' : ''}`}
      >
        <FiHome className="nav-icon" />
        <span>Dashboard</span>
      </Link>
      <Link
        href="/admin/agents"
        className={`nav-item ${isActive('/admin/agents') ? 'active' : ''}`}
      >
        <FiUsers className="nav-icon" />
        <span>Agents</span>
      </Link>
      <Link
        href="/admin/properties"
        className={`nav-item ${isActive('/admin/properties') ? 'active' : ''}`}
      >
        <FiLayers className="nav-icon" />
        <span>Properties</span>
      </Link>
      <Link
        href="/admin/revenue"
        className={`nav-item ${isActive('/admin/revenue') ? 'active' : ''}`}
      >
        <FiDollarSign className="nav-icon" />
        <span>Revenue</span>
      </Link>
      <Link
        href="/admin/users"
        className={`nav-item ${isActive('/admin/users') ? 'active' : ''}`}
      >
        <FiUsers className="nav-icon" />
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
        className="mobile-menu-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-sidebar-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        className={`app-sidebar ${isAdminRoute ? 'admin-sidebar' : isBrokerRoute ? 'broker-sidebar' : 'agent-sidebar'} ${isMobileMenuOpen ? 'mobile-open' : ''}`}
      >
        <div className="sidebar-logo">
          <div className="logo-container">
            <Link href="/">
              <img
                src={ASSETS.LOGO_HERO_MAIN}
                alt="Rentals.ph logo"
                className="logo-image"
              />
            </Link>
          </div>
        </div>

        <nav className="sidebar-nav" onClick={handleNavClick}>
          {isAdminRoute ? renderAdminSidebar() : isBrokerRoute ? renderBrokerSidebar() : renderAgentSidebar()}
        </nav>

        {isBrokerRoute && (
          <div className="sidebar-user-profile-wrapper" ref={logoutRef}>
            {showLogoutDropdown && (
              <div className="sidebar-logout-dropdown">
                <button className="sidebar-logout-btn" onClick={handleLogout}>
                  <FiLogOut className="logout-icon" />
                  <span>Logout</span>
                </button>
              </div>
            )}
            <div 
              className="sidebar-user-profile" 
              onClick={() => setShowLogoutDropdown(!showLogoutDropdown)}
              style={{ cursor: 'pointer' }}
            >
              <div className="sidebar-user-avatar">
                <img
                  src={ASSETS.PLACEHOLDER_PROFILE}
                  alt="User"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    if (target.nextElementSibling) {
                      (target.nextElementSibling as HTMLElement).style.display = 'flex'
                    }
                  }}
                />
                <div className="sidebar-user-fallback" style={{ display: 'none' }}>JA</div>
              </div>
              <div className="sidebar-user-details">
                <span className="sidebar-user-name">John Anderson</span>
                <span className="sidebar-user-role">Broker</span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}

export default AppSidebar

