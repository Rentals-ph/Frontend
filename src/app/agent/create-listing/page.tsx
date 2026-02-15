'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppSidebar from '../../../components/common/AppSidebar'
import AgentHeader from '../../../components/agent/AgentHeader'
import './AgentCreateListingCategory.css'

export default function AgentCreateListing() {
  const router = useRouter()
  const [hoveredOption, setHoveredOption] = useState<'manual' | 'ai' | null>(null)

  const handleManualCreate = () => {
    router.push('/agent/create-listing/basic-info')
  }

  const handleAIAssistant = () => {
    router.push('/agent/listing-assistant')
  }

  return (
    <div className="agent-dashboard">
      <AppSidebar />
      <main className="agent-main">
        <AgentHeader 
          title="Create New Listing" 
          subtitle="Choose how you'd like to create your property listing" 
        />

        <div className="create-listing-options">
          {/* Manual Input Option */}
          <div 
            className={`listing-option-card ${hoveredOption === 'manual' ? 'hovered' : ''}`}
            onClick={handleManualCreate}
            onMouseEnter={() => setHoveredOption('manual')}
            onMouseLeave={() => setHoveredOption(null)}
          >
            <div className="option-icon manual-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M9 16H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="option-content">
              <h3>Manual Input</h3>
              <p>Fill out the listing form step by step with full control over every detail.</p>
              <ul className="option-features">
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Complete control over all fields
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Step-by-step guided process
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Upload images at each step
                </li>
              </ul>
            </div>
            <div className="option-action">
              <span className="option-button">
                Start Manual Entry
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
          </div>

          {/* AI Assistant Option */}
          <div 
            className={`listing-option-card ai-option ${hoveredOption === 'ai' ? 'hovered' : ''}`}
            onClick={handleAIAssistant}
            onMouseEnter={() => setHoveredOption('ai')}
            onMouseLeave={() => setHoveredOption(null)}
          >
            <div className="ai-badge">
              <span className="sparkle">✨</span> AI-Powered
            </div>
            <div className="option-icon ai-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="option-content">
              <h3>AI Assistant</h3>
              <p>Describe your property naturally and let AI extract all the details for you.</p>
              <ul className="option-features">
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Just describe your property
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  AI fills out the form automatically
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Generate professional descriptions
                </li>
              </ul>
              <div className="ai-example">
                <span className="example-label">Example:</span>
                <span className="example-text">"3BR house in QC, 7.5M, with parking and garden"</span>
              </div>
            </div>
            <div className="option-action">
              <span className="option-button ai-button">
                Try AI Assistant
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
          </div>
        </div>

        {/* Comparison section */}
        <div className="options-comparison">
          <h4>Not sure which to choose?</h4>
          <p>
            <strong>Manual input</strong> is great when you have specific details ready and want complete control.
            <br />
            <strong>AI Assistant</strong> is perfect when you want to describe the property naturally and save time.
          </p>
        </div>
      </main>
    </div>
  )
}

