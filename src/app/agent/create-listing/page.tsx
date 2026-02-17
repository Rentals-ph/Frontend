'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppSidebar from '../../../components/common/AppSidebar'
import AgentHeader from '../../../components/agent/AgentHeader'

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
    <div className="flex min-h-screen bg-gray-100 font-outfit">
      <AppSidebar />
      <main className="ml-[280px] flex-1 w-[calc(100%-280px)] p-8 min-h-screen lg:ml-60 lg:w-[calc(100%-240px)] lg:p-6 md:ml-[200px] md:w-[calc(100%-200px)] md:p-4">
        <AgentHeader 
          title="Create New Listing" 
          subtitle="Choose how you'd like to create your property listing" 
        />

        <div className="grid grid-cols-2 gap-6 my-4 mb-8 max-[900px]:grid-cols-1">
          {/* Manual Input Option */}
          <div 
            className={`bg-white border-2 border-gray-200 rounded-2xl p-8 max-[640px]:p-6 cursor-pointer transition-all duration-[250ms] ease-out flex flex-col relative overflow-hidden ${
              hoveredOption === 'manual' ? 'border-blue-600 shadow-[0_10px_40px_-10px_rgba(37,99,235,0.2)] -translate-y-1' : ''
            }`}
            onClick={handleManualCreate}
            onMouseEnter={() => setHoveredOption('manual')}
            onMouseLeave={() => setHoveredOption(null)}
          >
            <div className="w-[72px] h-[72px] max-[640px]:w-14 max-[640px]:h-14 rounded-2xl flex items-center justify-center mb-5 bg-blue-50 text-blue-600">
              <svg width="48" height="48" className="max-[640px]:w-8 max-[640px]:h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M9 16H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <h3 className="text-[22px] max-[640px]:text-lg font-bold text-gray-900 m-0 mb-2">Manual Input</h3>
              <p className="text-[15px] text-gray-500 m-0 mb-5 leading-normal">Fill out the listing form step by step with full control over every detail.</p>
              <ul className="list-none p-0 m-0 mb-6">
                <li className="flex items-center gap-2 text-sm text-gray-700 py-1.5">
                  <svg width="16" height="16" className="text-emerald-500 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Complete control over all fields
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700 py-1.5">
                  <svg width="16" height="16" className="text-emerald-500 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Step-by-step guided process
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700 py-1.5">
                  <svg width="16" height="16" className="text-emerald-500 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Upload images at each step
                </li>
              </ul>
            </div>
            <div className="mt-auto">
              <span className="inline-flex items-center gap-2 text-[15px] font-semibold text-blue-600 transition-all duration-200">
                Start Manual Entry
                <svg width="20" height="20" className={`transition-transform duration-200 ${hoveredOption === 'manual' ? 'translate-x-1' : ''}`} viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
          </div>

          {/* AI Assistant Option */}
          <div 
            className={`bg-gradient-to-br from-[#FAFBFF] to-[#F0F4FF] border-2 border-[#C7D2FE] rounded-2xl p-8 max-[640px]:p-6 cursor-pointer transition-all duration-[250ms] ease-out flex flex-col relative overflow-hidden ${
              hoveredOption === 'ai' ? 'border-indigo-500 shadow-[0_10px_40px_-10px_rgba(99,102,241,0.25)] -translate-y-1' : ''
            }`}
            onClick={handleAIAssistant}
            onMouseEnter={() => setHoveredOption('ai')}
            onMouseLeave={() => setHoveredOption(null)}
          >
            <div className="absolute top-4 right-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
              <span className="text-sm">✨</span> AI-Powered
            </div>
            <div className="w-[72px] h-[72px] max-[640px]:w-14 max-[640px]:h-14 rounded-2xl flex items-center justify-center mb-5 bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-500">
              <svg width="48" height="48" className="max-[640px]:w-8 max-[640px]:h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <h3 className="text-[22px] max-[640px]:text-lg font-bold text-gray-900 m-0 mb-2">AI Assistant</h3>
              <p className="text-[15px] text-gray-500 m-0 mb-5 leading-normal">Describe your property naturally and let AI extract all the details for you.</p>
              <ul className="list-none p-0 m-0 mb-6">
                <li className="flex items-center gap-2 text-sm text-gray-700 py-1.5">
                  <svg width="16" height="16" className="text-emerald-500 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Just describe your property
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700 py-1.5">
                  <svg width="16" height="16" className="text-emerald-500 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  AI fills out the form automatically
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700 py-1.5">
                  <svg width="16" height="16" className="text-emerald-500 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Generate professional descriptions
                </li>
              </ul>
              <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-6">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide block mb-1">Example:</span>
                <span className="text-sm text-indigo-500 italic">"3BR house in QC, 7.5M, with parking and garden"</span>
              </div>
            </div>
            <div className="mt-auto">
              <span className="inline-flex items-center gap-2 text-[15px] font-semibold text-indigo-500 transition-all duration-200">
                Try AI Assistant
                <svg width="20" height="20" className={`transition-transform duration-200 ${hoveredOption === 'ai' ? 'translate-x-1' : ''}`} viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
          </div>
        </div>

        {/* Comparison section */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-6 py-5 text-center">
          <h4 className="text-[15px] font-semibold text-gray-700 m-0 mb-2">Not sure which to choose?</h4>
          <p className="text-sm text-gray-500 m-0 leading-relaxed">
            <strong>Manual input</strong> is great when you have specific details ready and want complete control.
            <br />
            <strong>AI Assistant</strong> is perfect when you want to describe the property naturally and save time.
          </p>
        </div>
      </main>
    </div>
  )
}

