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
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi'

const SIDEBAR_STORAGE_KEY = 'sidebar-collapsed'
const SIDEBAR_WIDTH_EXPANDED = 280
const SIDEBAR_WIDTH_COLLAPSED = 72

function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showLogoutDropdown, setShowLogoutDropdown] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true'
  })
  const sidebarRef = useRef<HTMLElement>(null)
  const logoutRef = useRef<HTMLDivElement>(null)

  // Sync collapsed state to CSS variable and localStorage (desktop only; mobile uses overlay)
  useEffect(() => {
    const width = isCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED
    document.documentElement.style.setProperty('--app-sidebar-width', `${width}px`)
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isCollapsed))
    } catch (_) {}
  }, [isCollapsed])
  
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
        const target = event.target as HTMLElement
        if (!target.closest('.mobile-menu-toggle')) setIsMobileMenuOpen(false)
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

  const navLinkClass = (active: boolean) =>
    `flex items-center gap-2.5 px-3 py-2.5 rounded-lg no-underline text-[13px] font-medium transition-all flex-shrink-0 ${active ? 'bg-blue-50 text-blue-500' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'} ${isCollapsed ? 'lg:justify-center lg:px-2' : ''}`

  const NavLink = ({
    href,
    icon: Icon,
    label,
    active,
    badge,
  }: {
    href: string
    icon: React.ElementType
    label: string
    active: boolean
    badge?: boolean
  }) => (
    <Link
      href={href}
      className={navLinkClass(active)}
      title={isCollapsed ? label : undefined}
    >
      <div className="relative inline-flex items-center justify-center flex-shrink-0">
        <Icon className="text-lg" />
        {badge && hasUnreadMessages && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.1)]" />
        )}
      </div>
      {!isCollapsed && <span className="truncate">{label}</span>}
    </Link>
  )

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
      <NavLink href="/agent" icon={FiHome} label="Dashboard" active={isActive('/agent') && !pathname?.includes('/agent/')} />
      <NavLink href="/agent/inbox" icon={FiMail} label="Inbox" active={isActive('/agent/inbox')} badge />
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
      <NavLink href="/agent/page-builder" icon={FiSettings} label="Page Builder" active={isActive('/agent/page-builder')} />
      <NavLink href="/agent/listings" icon={FiList} label="My Listings" active={isActive('/agent/listings')} />
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
      <NavLink href="/broker" icon={FiGrid} label="Dashboard" active={isActive('/broker')} />
      <NavLink href="/broker/company-profile" icon={FiLayout} label="Company Profile" active={isActive('/broker/company-profile')} />
      <NavLink href="/broker/team" icon={FiUsers} label="Team Management" active={isActive('/broker/team')} />
      <NavLink href="/broker/listings" icon={FiHome} label="Listings" active={isActive('/broker/listings')} />
      <NavLink href="/broker/approvals" icon={FiCheckSquare} label="Agent Approvals" active={isActive('/broker/approvals')} />
      <NavLink href="/broker/page-builder" icon={FiFileText} label="Page Builder" active={isActive('/broker/page-builder')} />
      <NavLink href="/broker/reports" icon={FiBarChart2} label="Reports" active={isActive('/broker/reports')} />
      <NavLink href="/broker/inbox" icon={FiMail} label="Inbox" active={isActive('/broker/inbox')} badge />
      <NavLink href="/broker/downloadables" icon={FiDownload} label="Downloadables" active={isActive('/broker/downloadables')} />
      <NavLink href="/broker/digital-card" icon={FiCreditCard} label="Digital Business Card" active={isActive('/broker/digital-card')} />
      <NavLink href="/broker/settings" icon={FiSettings} label="Settings" active={isActive('/broker/settings')} />
    </>
  )

  // Admin sidebar content
  const renderAdminSidebar = () => (
    <>
      <NavLink href="/" icon={FiLayout} label="Home" active={isActive('/') && !pathname?.includes('//')} />
      <NavLink href="/admin" icon={FiHome} label="Dashboard" active={isActive('/admin')} />
      <NavLink href="/admin/agents" icon={FiUsers} label="Agents" active={isActive('/admin/agents')} />
      <NavLink href="/admin/properties" icon={FiLayers} label="Properties" active={isActive('/admin/properties')} />
      <NavLink href="/admin/revenue" icon={FiDollarSign} label="Revenue" active={isActive('/admin/revenue')} />
      <NavLink href="/admin/users" icon={FiUsers} label="Users" active={isActive('/admin/users')} />
    </>
  )

  const handleNavClick = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Mobile menu toggle - only on tablet/mobile (below lg) */}
      <button
        type="button"
        className="mobile-menu-toggle fixed top-4 left-4 z-[1001] lg:hidden bg-white border border-gray-200 rounded-lg p-2.5 cursor-pointer text-gray-900 shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-all flex items-center justify-center hover:bg-gray-50 hover:shadow-[0_4px_6px_rgba(0,0,0,0.15)] max-[480px]:top-3 max-[480px]:left-3 max-[480px]:p-2 min-h-[44px] min-w-[44px]"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
      >
        {isMobileMenuOpen ? <FiX size={24} aria-hidden /> : <FiMenu size={24} aria-hidden />}
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
        className={`w-[280px] max-[480px]:w-[260px] bg-white border-r border-gray-200 flex flex-col fixed h-screen overflow-hidden z-[1000] md:-translate-x-full md:transition-transform md:duration-300 md:ease-in-out transition-[width] duration-200 ${isCollapsed ? 'lg:w-[72px]' : 'lg:w-60'} ${isMobileMenuOpen ? 'md:translate-x-0' : ''}`}
      >
        <div className={`p-2.5 border-b border-gray-200 flex-shrink-0 ${isCollapsed ? 'lg:px-2 lg:overflow-visible' : ''}`}>
          <div className={`flex items-center justify-center w-full mb-1 ${isCollapsed ? 'lg:mb-0' : ''}`}>
            <Link href="/" className={isCollapsed ? 'lg:flex lg:justify-center' : ''}>
              <img
                src={ASSETS.LOGO_HERO_MAIN}
                alt="Rentals.ph logo"
                className={`h-[60px] md:h-[50px] w-auto max-w-full object-contain ${isCollapsed ? 'lg:!h-[60px] lg:!w-[60px] lg:!min-w-[60px] lg:max-w-none' : ''}`}
              />
            </Link>
          </div>
          {/* Collapse toggle - desktop only */}
          <button
            type="button"
            onClick={() => setIsCollapsed((c) => !c)}
            className="hidden lg:flex items-center justify-center w-full mt-2 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <FiChevronRight className="text-lg" /> : <FiChevronLeft className="text-lg" />}
          </button>
        </div>

        <nav className="p-3 lg:py-2.5 lg:px-2 md:p-3 flex flex-col gap-4 lg:gap-3 md:gap-4 flex-1 overflow-y-auto overflow-x-hidden min-h-0 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb:hover]:bg-gray-400" onClick={handleNavClick}>
          {isAdminRoute ? renderAdminSidebar() : isBrokerRoute ? renderBrokerSidebar() : renderAgentSidebar()}
        </nav>

        {isBrokerRoute && (
          <div className="relative flex-shrink-0" ref={logoutRef}>
            {showLogoutDropdown && (
              <div className="absolute bottom-full left-3 right-3 bg-white border border-gray-200 rounded-[10px] shadow-[0_-4px_16px_rgba(0,0,0,0.12)] p-1.5 mb-1.5 z-[100] animate-[slideUpFade_0.15s_ease-out]">
                <button className="flex items-center gap-2.5 w-full px-3.5 py-2.5 bg-transparent border-none rounded-lg text-sm font-medium text-red-500 cursor-pointer transition-colors hover:bg-red-50" onClick={handleLogout}>
                  <FiLogOut className="text-lg flex-shrink-0" />
                  <span>Logout</span>
                </button>
              </div>
            )}
            <div 
              className={`flex items-center gap-2.5 px-5 py-4 border-t border-gray-200 flex-shrink-0 transition-colors cursor-pointer hover:bg-gray-100 ${isCollapsed ? 'lg:justify-center lg:px-2 lg:py-3' : ''}`}
              onClick={() => setShowLogoutDropdown(!showLogoutDropdown)}
              title={isCollapsed ? 'Account' : undefined}
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
              {!isCollapsed && (
                <div className="flex flex-col gap-px flex-1 min-w-0">
                  <span className="text-[13px] font-semibold text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">John Anderson</span>
                  <span className="text-[11px] text-gray-400">Broker</span>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  )
}

export default AppSidebar

