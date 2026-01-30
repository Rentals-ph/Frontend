'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FiUser, FiLogOut, FiChevronDown, FiHome, FiMenu, FiX } from 'react-icons/fi'
import './Navbar.css'
import LoginModal from '../common/LoginModal'
import RegisterModal from '../common/RegisterModal'

function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
  const [userName, setUserName] = useState('User')
  const [userRole, setUserRole] = useState<'agent' | 'admin'>('agent')
  const pathname = usePathname()
  const router = useRouter()
  const userMenuRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const checkAuthStatus = () => {
    // Check if user is logged in (agent or admin)
    const authToken = localStorage.getItem('auth_token')
    const role = localStorage.getItem('user_role') || localStorage.getItem('agent_role')
    const agentStatus = localStorage.getItem('agent_status')
    
    // For agents, check if they have agent_status
    // For admins, just check if they have auth_token and role is admin
    if (authToken && (role === 'admin' || (role === 'agent' && agentStatus))) {
      setIsUserLoggedIn(true)
      // Try to get user name from localStorage or use default
      const storedName = localStorage.getItem('user_name') || localStorage.getItem('agent_name') || 
        (role === 'admin' ? 'Admin' : 'Agent')
      setUserName(storedName)
      setUserRole(role === 'admin' ? 'admin' : 'agent')
    } else {
      setIsUserLoggedIn(false)
      setUserName('User')
      setUserRole('agent')
    }
  }

  useEffect(() => {
    checkAuthStatus()
    
    // Listen for storage changes (in case logout happens in another tab/window)
    const handleStorageChange = () => {
      checkAuthStatus()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])
  
  // Also check on location change (in case navigating from agent pages)
  useEffect(() => {
    checkAuthStatus()
  }, [pathname])

  useEffect(() => {
    // Close user menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    if (showUserMenu || isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu, isMobileMenuOpen])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const handleLoginClick = () => {
    setIsLoginOpen(true)
  }

  const handleRegisterClick = () => {
    setIsLoginOpen(false)
    setIsRegisterOpen(true)
  }

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('agent_registration_status')
    localStorage.removeItem('agent_registered_email')
    localStorage.removeItem('agent_status')
    localStorage.removeItem('auth_token')
    localStorage.removeItem('agent_name')
    localStorage.removeItem('agent_role')
    localStorage.removeItem('user_name')
    localStorage.removeItem('user_role')
    
    // Update state immediately
    setIsUserLoggedIn(false)
    setUserName('User')
    setUserRole('agent')
    setShowUserMenu(false)
    
    // If currently on agent or admin pages, redirect to home and reload
    if (pathname?.startsWith('/agent') || pathname?.startsWith('/admin')) {
      router.push('/')
      // Small delay to ensure navigation happens before reload
      setTimeout(() => {
        window.location.reload()
      }, 100)
    }
    // On public pages, the state update will automatically trigger a re-render
    // showing the login button instead of the profile
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <header className="navbar-container">
        <div className="navbar-wrapper">
          <div className="navbar-logo-section">
            <img
              src="/assets/rentals-logo-hero-13c7b5.png"
              alt="Rentals.ph logo"
              className="navbar-logo"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="navbar-desktop">
            <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
              HOME
            </Link>
            <Link href="/about" className={`nav-link ${pathname === '/about' ? 'active' : ''}`}>
              ABOUT US
            </Link>
            <Link href="/properties" className={`nav-link ${pathname === '/properties' ? 'active' : ''}`}>
              PROPERTIES
            </Link>
            <Link href="/rent-managers" className={`nav-link ${pathname === '/rent-managers' ? 'active' : ''}`}>
              RENT MANAGERS
            </Link>
            <Link href="/blog" className={`nav-link ${pathname === '/blog' ? 'active' : ''}`}>
              BLOG
            </Link>
            <Link href="/contact" className={`nav-link ${pathname === '/contact' ? 'active' : ''}`}>
              CONTACT US
            </Link>
            {isUserLoggedIn ? (
              <div className="navbar-user-profile-wrapper" ref={userMenuRef}>
                <button 
                  className="navbar-user-profile-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  aria-label="User menu"
                >
                  <div className="navbar-user-profile">
                    <div className="navbar-profile-avatar">
                      <img 
                        src="/assets/profile-placeholder.png" 
                        alt={userName}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          target.nextElementSibling?.classList.remove('hidden')
                        }} 
                      />
                      <div className="navbar-avatar-fallback hidden">
                        {getInitials(userName)}
                      </div>
                    </div>
                    <div className="navbar-user-info">
                      <span className="navbar-user-name">{userName}</span>
                      <span className="navbar-user-role">
                        {userRole === 'admin' ? 'Admin' : 'Agent'}
                      </span>
                    </div>
                    <FiChevronDown className={`navbar-user-menu-chevron ${showUserMenu ? 'open' : ''}`} />
                  </div>
                </button>
                
                {showUserMenu && (
                  <div className="navbar-user-menu-dropdown">
                    <button 
                      className="navbar-user-menu-item" 
                      onClick={() => {
                        router.push(userRole === 'admin' ? '/admin' : '/agent')
                        setShowUserMenu(false)
                      }}
                    >
                      <FiHome className="navbar-user-menu-icon" />
                      <span>Dashboard</span>
                    </button>
                    {userRole === 'agent' && (
                      <button 
                        className="navbar-user-menu-item" 
                        onClick={() => {
                          router.push('/agent/account')
                          setShowUserMenu(false)
                        }}
                      >
                        <FiUser className="navbar-user-menu-icon" />
                        <span>Account</span>
                      </button>
                    )}
                    <button 
                      className="navbar-user-menu-item logout" 
                      onClick={handleLogout}
                    >
                      <FiLogOut className="navbar-user-menu-icon" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="login-button" onClick={handleLoginClick}>
                Login/Register
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="navbar-mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className={`navbar-mobile ${isMobileMenuOpen ? 'open' : ''}`} ref={mobileMenuRef}>
          <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            HOME
          </Link>
          <Link href="/about" className={`nav-link ${pathname === '/about' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            ABOUT US
          </Link>
          <Link href="/properties" className={`nav-link ${pathname === '/properties' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            PROPERTIES
          </Link>
          <Link href="/rent-managers" className={`nav-link ${pathname === '/rent-managers' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            RENT MANAGERS
          </Link>
          <Link href="/blog" className={`nav-link ${pathname === '/blog' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            BLOG
          </Link>
          <Link href="/contact" className={`nav-link ${pathname === '/contact' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            CONTACT US
          </Link>
          {isUserLoggedIn ? (
            <div className="navbar-mobile-user-section">
              <div className="navbar-mobile-user-profile">
                <div className="navbar-profile-avatar">
                  <img 
                    src="/assets/profile-placeholder.png" 
                    alt={userName}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.nextElementSibling?.classList.remove('hidden')
                    }} 
                  />
                  <div className="navbar-avatar-fallback hidden">
                    {getInitials(userName)}
                  </div>
                </div>
                <div className="navbar-user-info">
                  <span className="navbar-user-name">{userName}</span>
                  <span className="navbar-user-role">
                    {userRole === 'admin' ? 'Admin' : 'Agent'}
                  </span>
                </div>
              </div>
              <button 
                className="navbar-mobile-menu-item" 
                onClick={() => {
                  router.push(userRole === 'admin' ? '/admin' : '/agent')
                  setIsMobileMenuOpen(false)
                }}
              >
                <FiHome className="navbar-user-menu-icon" />
                <span>Dashboard</span>
              </button>
              {userRole === 'agent' && (
                <button 
                  className="navbar-mobile-menu-item" 
                  onClick={() => {
                    router.push('/agent/account')
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <FiUser className="navbar-user-menu-icon" />
                  <span>Account</span>
                </button>
              )}
              <button 
                className="navbar-mobile-menu-item logout" 
                onClick={() => {
                  handleLogout()
                  setIsMobileMenuOpen(false)
                }}
              >
                <FiLogOut className="navbar-user-menu-icon" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button className="login-button mobile-login-button" onClick={() => {
              handleLoginClick()
              setIsMobileMenuOpen(false)
            }}>
              Login/Register
            </button>
          )}
        </nav>
      </header>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onRegisterClick={handleRegisterClick}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </>
  )
}

export default Navbar

