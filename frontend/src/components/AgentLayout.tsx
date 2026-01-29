import { ReactNode } from 'react'
import AgentSidebar from './AgentSidebar'
import AgentHeader from './AgentHeader'
import './AgentLayout.css'

interface AgentLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
}

function AgentLayout({ children, title, subtitle }: AgentLayoutProps) {
  return (
    <div className="agent-dashboard">
      <AgentSidebar />
      <main className="agent-main">
        <AgentHeader title={title} subtitle={subtitle} />
        {children}
      </main>
    </div>
  )
}

export default AgentLayout

