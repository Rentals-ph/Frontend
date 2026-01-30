'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
} from 'react-icons/fi'


function AppSidebar() {
  const pathname = usePathname()
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const sidebarRef = useRef<HTMLElement>(null)
  
  // Determine if we're on admin or agent routes
  const isAdminRoute = pathname?.startsWith('/admin')
  const isAgentRoute = pathname?.startsWith('/agent')

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

      <div className="nav-section">
        <h2 className="nav-section-title">Rent Management</h2>
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
      </div>
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
        className={`app-sidebar ${isAdminRoute ? 'admin-sidebar' : 'agent-sidebar'} ${isMobileMenuOpen ? 'mobile-open' : ''}`}
      >
        <div className="sidebar-logo">
          <div className="logo-container">
            <img
              src="/assets/rentals-logo-hero-13c7b5.png"
              alt="Rentals.ph logo"
              className="logo-image"
            />
          </div>
        </div>

        <nav className="sidebar-nav" onClick={handleNavClick}>
          {isAdminRoute ? renderAdminSidebar() : renderAgentSidebar()}
        </nav>
      </aside>
    </>
  )
}

export default AppSidebar

