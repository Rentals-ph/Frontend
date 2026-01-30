'use client'

import { useRouter } from 'next/navigation'
import AppSidebar from '../../../components/common/AppSidebar'
import AgentHeader from '../../../components/agent/AgentHeader'
import '../../../pages-old/agent/AgentCreateListingCategory.css'

export default function AgentCreateListing() {
  const router = useRouter()

  return (
    <div className="agent-dashboard">
      <AppSidebar/>
      <main className="agent-main">
        <AgentHeader 
          title="Create Listing" 
          subtitle="Add a new property listing." 
        />
        <div style={{ padding: '2rem' }}>
          <h2>Create Listing</h2>
          <p>Listing creation flow coming soon...</p>
          <button onClick={() => router.push('/agent/create-listing/category')}>
            Start Creating Listing
          </button>
        </div>
      </main>
    </div>
  )
}

