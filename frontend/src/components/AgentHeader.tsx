import { FiBell } from 'react-icons/fi'
import './AgentHeader.css'

interface AgentHeaderProps {
  title?: string
  subtitle?: string
}

function AgentHeader({ title = 'Dashboard', subtitle = 'Welcome back, manage your rental properties.' }: AgentHeaderProps) {
  return (
    <header className="agent-header">
      <div className="header-content">
        <div>
          <h1>{title}</h1>
          <p className="welcome-text">{subtitle}</p>
        </div>
        <div className="header-right">
          <FiBell className="notification-icon" />
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
          </div>
        </div>
      </div>
    </header>
  )
}

export default AgentHeader

