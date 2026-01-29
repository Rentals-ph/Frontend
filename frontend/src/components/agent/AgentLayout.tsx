import { ReactNode, useEffect, useState } from 'react'
import AgentSidebar from './AgentSidebar'
import AgentHeader from './AgentHeader'
import './AgentLayout.css'

interface AgentLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
}

function AgentLayout({ children, title, subtitle }: AgentLayoutProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    // Check if agent account is processing
    const registrationStatus = localStorage.getItem('agent_registration_status')
    const agentStatus = localStorage.getItem('agent_status')
    
    if (registrationStatus === 'processing' || 
        agentStatus === 'processing' || 
        agentStatus === 'pending' || 
        agentStatus === 'under_review') {
      setIsProcessing(true)
    }
  }, [])

  return (
    <div className="agent-dashboard">
      <AgentSidebar />
      <main className="agent-main">
        <AgentHeader title={title} subtitle={subtitle} />
        
        {/* Processing Account Banner */}
        {isProcessing && (
          <div className="processing-banner">
            <div className="processing-banner-content">
              <div className="processing-banner-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#FE8E0A" strokeWidth="2" strokeDasharray="4 4"/>
                  <path d="M12 6V12L16 14" stroke="#FE8E0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="processing-banner-text">
                <h3>Account Under Review</h3>
                <p>Your account is currently being processed by our admin team. You can create listings, but they won't be visible to users until your account is approved. This typically takes 1-3 business days.</p>
              </div>
            </div>
          </div>
        )}
        
        {children}
      </main>
    </div>
  )
}

export default AgentLayout

