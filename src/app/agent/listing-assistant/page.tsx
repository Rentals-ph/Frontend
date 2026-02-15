'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AppSidebar from '../../../components/common/AppSidebar'
import AgentHeader from '../../../components/agent/AgentHeader'
import { ListingAssistantChat } from '../../../components/listing-assistant'
import './page.css'

export default function ListingAssistantPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [conversationId, setConversationId] = useState<string | null>(null)

  useEffect(() => {
    const id = searchParams.get('conversation')
    if (id) {
      setConversationId(id)
    }
  }, [searchParams])

  const handleListingSubmitted = (propertyId: number) => {
    // Show success and redirect after a delay
    setTimeout(() => {
      router.push(`/agent/listings?highlight=${propertyId}`)
    }, 3000)
  }

  return (
    <div className="agent-dashboard">
      <AppSidebar />
      <main className="agent-main">
        <AgentHeader 
          title="AI Listing Assistant" 
          subtitle="Create property listings with the help of AI" 
        />


        <div className="listing-assistant-intro">
          <div className="intro-content">
            <div className="intro-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="intro-text">
              <h2>Create Your Listing Naturally</h2>
              <p>
                Just describe your property in natural language - the AI will extract all the details 
                and help you create a professional listing in minutes.
              </p>
            </div>
          </div>
          <div className="intro-examples">
            <span className="example-label">Try saying:</span>
            <div className="example-chips">
              <span className="example-chip">"3BR house in QC, 7.5M"</span>
              <span className="example-chip">"Condo in BGC with pool and gym"</span>
              <span className="example-chip">"120sqm apartment for rent, 50k monthly"</span>
            </div>
          </div>
        </div>

        <div className="listing-assistant-container">
          <ListingAssistantChat
            initialConversationId={conversationId || undefined}
            onListingSubmitted={handleListingSubmitted}
          />
        </div>
      </main>
    </div>
  )
}
