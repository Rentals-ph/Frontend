import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiLogOut, FiChevronDown, FiUser } from 'react-icons/fi'
import './AgentHeader.css'

interface AgentHeaderProps {
  title?: string
  subtitle?: string
}

function AgentHeader({ title = 'Dashboard', subtitle = 'Welcome back, manage your rental properties.' }: AgentHeaderProps) {
  const navigate = useNavigate()
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
    // Clear localStorage
    localStorage.removeItem('agent_registration_status')
    localStorage.removeItem('agent_registered_email')
    localStorage.removeItem('agent_status')
    localStorage.removeItem('auth_token')
    localStorage.removeItem('agent_name')
    
    // Navigate to home page
    navigate('/')
    // Small delay to ensure navigation happens before reload
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  return (
    <header className="agent-header">
      <div className="header-content">
        <div>
          <h1>{title}</h1>
          <p className="welcome-text">{subtitle}</p>
        </div>
        <div className="header-right">
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
                    alt="John Anderson" 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.nextElementSibling?.classList.remove('hidden')
                    }} 
                  />
                  <div className="avatar-fallback hidden">JA</div>
                </div>
                <div className="user-info">
                  <span className="user-name">John Anderson</span>
                  <span className="user-role">Property Owner</span>
                </div>
                <FiChevronDown className={`user-menu-chevron ${showUserMenu ? 'open' : ''}`} />
              </div>
            </button>
            
            {showUserMenu && (
              <div className="user-menu-dropdown">
                <button 
                  className="user-menu-item" 
                  onClick={() => {
                    navigate('/agent/account')
                    setShowUserMenu(false)
                  }}
                >
                  <FiUser className="user-menu-icon" />
                  <span>Account</span>
                </button>
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

export default AgentHeader

