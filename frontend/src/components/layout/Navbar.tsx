import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiUser, FiLogOut, FiChevronDown, FiHome } from 'react-icons/fi'
import './Navbar.css'
import LoginModal from '../common/LoginModal'
import RegisterModal from '../common/RegisterModal'

function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isAgentLoggedIn, setIsAgentLoggedIn] = useState(false)
  const [agentName, setAgentName] = useState('Agent')
  const location = useLocation()
  const navigate = useNavigate()
  const userMenuRef = useRef<HTMLDivElement>(null)

  const checkAuthStatus = () => {
    // Check if agent is logged in
    const authToken = localStorage.getItem('auth_token')
    const agentStatus = localStorage.getItem('agent_status')
    
    if (authToken && agentStatus) {
      setIsAgentLoggedIn(true)
      // Try to get agent name from localStorage or use default
      const storedName = localStorage.getItem('agent_name') || 'Agent'
      setAgentName(storedName)
    } else {
      setIsAgentLoggedIn(false)
      setAgentName('Agent')
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
  }, [location.pathname])

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
    
    // Update state immediately
    setIsAgentLoggedIn(false)
    setAgentName('Agent')
    setShowUserMenu(false)
    
    // If currently on agent pages, redirect to home and reload
    if (location.pathname.startsWith('/agent')) {
      navigate('/')
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
      <header className="navbar-container flex items-center justify-between">
        <div className="flex items-center gap-4 ">
          <img
            src="/assets/rentals-logo-hero-13c7b5.png"
            alt="Rentals.ph logo"
            className="h-[60px] w-auto mr-10"
          />
        </div>

        <nav className="flex items-center gap-2">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            HOME
          </Link>
          <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>
            ABOUT US
          </Link>
          <Link to="/properties" className={`nav-link ${location.pathname === '/properties' ? 'active' : ''}`}>
            PROPERTIES
          </Link>
          <Link to="/rent-managers" className={`nav-link ${location.pathname === '/rent-managers' ? 'active' : ''}`}>
            RENT MANAGERS
          </Link>
          <Link to="/blog" className={`nav-link ${location.pathname === '/blog' ? 'active' : ''}`}>
            BLOG
          </Link>
          <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>
            CONTACT US
          </Link>
          {isAgentLoggedIn ? (
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
                      alt={agentName}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        target.nextElementSibling?.classList.remove('hidden')
                      }} 
                    />
                    <div className="navbar-avatar-fallback hidden">
                      {getInitials(agentName)}
                    </div>
                  </div>
                  <div className="navbar-user-info">
                    <span className="navbar-user-name">{agentName}</span>
                    <span className="navbar-user-role">Agent</span>
                  </div>
                  <FiChevronDown className={`navbar-user-menu-chevron ${showUserMenu ? 'open' : ''}`} />
                </div>
              </button>
              
              {showUserMenu && (
                <div className="navbar-user-menu-dropdown">
                  <button 
                    className="navbar-user-menu-item" 
                    onClick={() => {
                      navigate('/agent')
                      setShowUserMenu(false)
                    }}
                  >
                    <FiHome className="navbar-user-menu-icon" />
                    <span>Dashboard</span>
                  </button>
                  <button 
                    className="navbar-user-menu-item" 
                    onClick={() => {
                      navigate('/agent/account')
                      setShowUserMenu(false)
                    }}
                  >
                    <FiUser className="navbar-user-menu-icon" />
                    <span>Account</span>
                  </button>
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

