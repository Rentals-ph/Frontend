'use client'

import AppSidebar from '../../../../components/common/AppSidebar'
import AgentHeader from '../../../../components/agent/AgentHeader'
import '../../../../pages-old/agent/AgentCreateListingCategory.css'

export default function AgentCreateListingCategory() {
  return (
    <div className="agent-dashboard">
      <AppSidebar/>
      <main className="agent-main">
        <AgentHeader 
          title="Create Listing - Category" 
          subtitle="Select property category." 
        />
        <div style={{ padding: '2rem' }}>
          <h2>Select Category</h2>
          <p>Category selection coming soon...</p>
        </div>
      </main>
    </div>
  )
}

