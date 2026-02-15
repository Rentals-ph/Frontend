'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ASSETS, getAsset } from '@/utils/assets'
import { api, type PropertySearchResponse, type ConversationMessage } from '@/lib/api'
import { Property } from '@/types'
import { getImageUrl } from '@/utils/storage'
import SimplePropertyCard from '@/components/common/SimplePropertyCard'
import './Hero.css'
import HeroBanner from './HeroBanner'

const CONVERSATION_ID_KEY = 'rentals_ph_conversation_id'

// Function to format AI message with proper paragraph spacing
const formatAIMessage = (text: string): string => {
  if (!text) return ''
  
  // First, handle bold text (**text**)
  let formatted = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  
  // Split by double line breaks to identify paragraphs
  const paragraphs = formatted.split(/\n\s*\n/).filter(p => p.trim())
  
  return paragraphs.map(paragraph => {
    const trimmed = paragraph.trim()
    
    // Check if paragraph contains numbered list items (handle both single and multi-line)
    // Split by newlines first, then check for numbered items
    const lines = trimmed.split(/\n/).map(l => l.trim()).filter(l => l)
    const numberedLines = lines.filter(line => /^\d+\.\s/.test(line))
    
    if (numberedLines.length >= 2 || (numberedLines.length === 1 && lines.length === 1)) {
      // This appears to be a list section
      // Try to extract all numbered items, handling multi-line items
      const listItems: string[] = []
      let currentItem = ''
      
      for (const line of lines) {
        if (/^\d+\.\s/.test(line)) {
          // New list item
          if (currentItem) {
            listItems.push(currentItem)
          }
          currentItem = line.replace(/^\d+\.\s/, '')
        } else if (currentItem) {
          // Continuation of current item
          currentItem += ' ' + line
        } else {
          // Regular text before list, treat as paragraph
          if (listItems.length === 0) {
            return `<p>${trimmed}</p>`
          }
        }
      }
      
      if (currentItem) {
        listItems.push(currentItem)
      }
      
      if (listItems.length > 0) {
        return `<ul class="ai-message-list">${listItems.map(item => `<li>${item.trim()}</li>`).join('')}</ul>`
      }
    }
    
    // Regular paragraph
    return `<p>${trimmed}</p>`
  }).join('')
}

function Hero() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [propertyType, setPropertyType] = useState('')
  const [location, setLocation] = useState('')
  const [minBeds, setMinBeds] = useState('')
  const [minBaths, setMinBaths] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isChatMode, setIsChatMode] = useState(false)
  const [chatMessage, setChatMessage] = useState('')
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; message: string; properties?: Property[] }>>([
    {
      role: 'assistant',
      message: 'Hello! I\'m your RentalsGroq. How can I help you find the perfect rental property today?'
    }
  ])
  const [conversationId, setConversationId] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  // Automatically get latest properties from chat messages
  const latestProperties = useMemo(() => {
    // Find the latest message with properties (search from end)
    for (let i = chatMessages.length - 1; i >= 0; i--) {
      const msg = chatMessages[i]
      if (msg.properties && Array.isArray(msg.properties) && msg.properties.length > 0) {
        console.log('Found properties in message:', msg.properties)
        return {
          properties: msg.properties,
          title: `Found ${msg.properties.length} propert${msg.properties.length === 1 ? 'y' : 'ies'}`
        }
      }
    }
    console.log('No properties found in chat messages. Messages:', chatMessages)
    return null
  }, [chatMessages])
  const [showHistory, setShowHistory] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [conversations, setConversations] = useState<any[]>([])
  const [isLoadingConversations, setIsLoadingConversations] = useState(false)
  const router = useRouter()

  // Array of background images - all three backgrounds for rotation
  const backgroundImages = [
    ASSETS.BG_HERO_LANDING,
    getAsset('BG_HERO_LANDING_2') || ASSETS.BG_HERO_LANDING,
    getAsset('BG_HERO_LANDING_NEW') || ASSETS.BG_HERO_LANDING,
  ].filter(Boolean) // Remove any undefined values

  // Recommended searches
  const recommendedSearches = [
    'Condominium For Rent In Cebu',
    'House & Lot For Rent In Lapulapu',
    'Studio For Rent In Makati',
    'Pet Friendly Unit In Manila',
    '2 Bedroom Apartment In BGC',
    'Affordable Studio In Quezon City'
  ]

  // Map property types from Hero to PropertiesForRentPage format
  const propertyTypeMap: { [key: string]: string } = {
    'condominium': 'Condominium',
    'apartment': 'Apartment',
    'bedspace': 'Bed Space',
    'commercial': 'Commercial Spaces',
    'office': 'Office Spaces'
  }

  // Map locations from Hero to PropertiesForRentPage format
  const locationMap: { [key: string]: string } = {
    'manila': 'Manila',
    'makati': 'Makati City',
    'bgc': 'BGC',
    'quezon': 'Quezon City',
    'mandaluyong': 'Mandaluyong',
    'pasig': 'Pasig',
    'cebu': 'Cebu City',
    'davao': 'Davao City',
    'lapulapu': 'Lapulapu',
    'metro-manila': 'Metro Manila'
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim())
    }
    
    if (propertyType && propertyTypeMap[propertyType]) {
      params.set('type', propertyTypeMap[propertyType])
    }
    
    if (location && locationMap[location]) {
      params.set('location', locationMap[location])
    }

    // Add advanced filters
    if (minBeds) {
      params.set('minBeds', minBeds)
    }
    if (minBaths) {
      params.set('minBaths', minBaths)
    }
    if (priceMin) {
      params.set('priceMin', priceMin)
    }
    if (priceMax) {
      params.set('priceMax', priceMax)
    }
    
    // Navigate to properties page with query parameters
    const queryString = params.toString()
    router.push(`/properties${queryString ? `?${queryString}` : ''}`)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleRecommendedSearch = (search: string) => {
    const params = new URLSearchParams()
    params.set('search', search)
    router.push(`/properties?${params.toString()}`)
  }

  const handleNewConversation = () => {
    // Clear conversation ID and localStorage
    setConversationId(undefined)
    localStorage.removeItem(CONVERSATION_ID_KEY)
    
    // Reset messages to initial greeting
    setChatMessages([
      {
        role: 'assistant',
        message: 'Hello! I\'m your RentalsGroq. How can I help you find the perfect rental property today?'
      }
    ])
    setShowMenu(false)
  }

  const handleClearContext = async () => {
    if (!conversationId) return
    
    try {
      const response = await api.clearConversationContext(conversationId)
      if (response.success) {
        // Reload conversation to get updated state
        const convResponse = await api.getConversation(conversationId)
        if (convResponse.success && convResponse.data) {
          const conversation = convResponse.data
          const messages = conversation.messages.map((msg: any) => {
            const frontendMessage: { role: 'user' | 'assistant'; message: string; properties?: Property[] } = {
              role: msg.role,
              message: msg.content,
            }
            if (msg.metadata?.properties && Array.isArray(msg.metadata.properties)) {
              frontendMessage.properties = msg.metadata.properties
            }
            return frontendMessage
          })
          if (messages.length > 0) {
            setChatMessages(messages)
          }
        }
        setShowMenu(false)
      }
    } catch (error) {
      console.error('Failed to clear context:', error)
    }
  }

  const handleDeleteConversation = async (convId?: string) => {
    const idToDelete = convId || conversationId
    if (!idToDelete) return
    
    if (!confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      return
    }
    
    try {
      const response = await api.deleteConversation(idToDelete)
      if (response.success) {
        // If deleting current conversation, start new one
        if (idToDelete === conversationId) {
          handleNewConversation()
        }
        // Reload conversations list
        loadConversations()
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error)
    }
  }

  const loadConversations = async () => {
    setIsLoadingConversations(true)
    try {
      const response = await api.listConversations()
      if (response.success && response.data) {
        setConversations(response.data)
      }
    } catch (error) {
      console.error('Failed to load conversations:', error)
    } finally {
      setIsLoadingConversations(false)
    }
  }

  const handleLoadConversation = async (convId: string) => {
    setConversationId(convId)
    localStorage.setItem(CONVERSATION_ID_KEY, convId)
    setIsLoadingHistory(true)
    setShowHistory(false)
    
    try {
      const response = await api.getConversation(convId)
      if (response.success && response.data) {
        const conversation = response.data
        const messages = conversation.messages.map((msg: any) => {
          const frontendMessage: { role: 'user' | 'assistant'; message: string; properties?: Property[] } = {
            role: msg.role,
            message: msg.content,
          }
          if (msg.metadata?.properties && Array.isArray(msg.metadata.properties)) {
            frontendMessage.properties = msg.metadata.properties
          }
          return frontendMessage
        })
        if (messages.length > 0) {
          setChatMessages(messages)
        }
      }
    } catch (error) {
      console.error('Failed to load conversation:', error)
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatMessage.trim() || isLoading) return

    const userMessage = chatMessage.trim()
    
    // Add user message
    const newMessages = [...chatMessages, { role: 'user' as const, message: userMessage }]
    setChatMessages(newMessages)
    setChatMessage('')
    setIsLoading(true)

    try {
      // Call the search API
      const response = await api.searchProperties(userMessage, conversationId)
      
      if (response.success && response.data) {
        const searchData = response.data as PropertySearchResponse
        
        console.log('API Response:', searchData)
        console.log('Properties from API:', searchData.properties)
        
        // Update conversation ID if provided and save to localStorage
        if (searchData.conversation_id) {
          setConversationId(searchData.conversation_id)
          localStorage.setItem(CONVERSATION_ID_KEY, searchData.conversation_id)
        }
        
        // Add assistant message with properties
        const assistantMessage = {
          role: 'assistant' as const,
          message: searchData.ai_response,
          properties: searchData.properties || []
        }
        
        console.log('Assistant message with properties:', assistantMessage)
        
        setChatMessages([
          ...newMessages,
          assistantMessage
        ])
      } else {
        // Handle error - show user-friendly message
        const errorMessage = response.message || 'Sorry, I encountered an error while searching. Please try again.'
        setChatMessages([
          ...newMessages,
          {
            role: 'assistant' as const,
            message: errorMessage
          }
        ])
      }
    } catch (error) {
      console.error('Search error:', error)
      // This catch block should rarely be hit since apiRequest handles errors
      // But we'll keep it as a safety net
      const errorMessage = error instanceof Error && error.message.includes('Failed to fetch')
        ? 'Unable to connect to the server. Please make sure the backend server is running on http://localhost:8000'
        : 'Sorry, I encountered an unexpected error. Please try again.'
      
      setChatMessages([
        ...newMessages,
        {
          role: 'assistant' as const,
          message: errorMessage
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Load conversation ID from localStorage on mount
  useEffect(() => {
    const storedConversationId = localStorage.getItem(CONVERSATION_ID_KEY)
    if (storedConversationId) {
      setConversationId(storedConversationId)
    }
  }, [])

  // Save conversation ID to localStorage when it changes
  useEffect(() => {
    if (conversationId) {
      localStorage.setItem(CONVERSATION_ID_KEY, conversationId)
    }
  }, [conversationId])

  // Load conversation history when conversation ID exists and chat mode is opened
  useEffect(() => {
    const loadConversationHistory = async () => {
      if (!isChatMode || !conversationId || isLoadingHistory) return

      setIsLoadingHistory(true)
      try {
        const response = await api.getConversation(conversationId)
        
        if (response.success && response.data) {
          const conversation = response.data
          
          // Convert backend messages to frontend format
          const messages = conversation.messages.map((msg: ConversationMessage) => {
            const frontendMessage: { role: 'user' | 'assistant'; message: string; properties?: Property[] } = {
              role: msg.role,
              message: msg.content,
            }
            
            // Extract properties from metadata if available
            if (msg.metadata?.properties && Array.isArray(msg.metadata.properties)) {
              frontendMessage.properties = msg.metadata.properties
            }
            
            return frontendMessage
          })
          
          // If we have messages, replace the default greeting
          if (messages.length > 0) {
            setChatMessages(messages)
          }
        }
      } catch (error) {
        console.error('Failed to load conversation history:', error)
        // Don't show error to user, just continue with current messages
      } finally {
        setIsLoadingHistory(false)
      }
    }

    loadConversationHistory()
  }, [isChatMode, conversationId])

  // Load conversations list when history panel is opened
  useEffect(() => {
    if (showHistory) {
      loadConversations()
    }
  }, [showHistory])

  // Auto-rotate background images with smooth transitions
  useEffect(() => {
    if (backgroundImages.length <= 1) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      )
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [backgroundImages.length])

  // Close overlay on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showHistory) {
          setShowHistory(false)
        }
        if (showMenu) {
          setShowMenu(false)
        }
      }
    }

    if (showHistory || showMenu) {
      window.addEventListener('keydown', handleEscape)
      return () => window.removeEventListener('keydown', handleEscape)
    }
  }, [showHistory, showMenu])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (showMenu && !target.closest('.chat-menu-container')) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  return (
    <section id="home" className={`hero-section ${isChatMode ? 'chat-mode-active' : ''}`}>
      {/* Background images with smooth transitions */}
      <div className="hero-background-container">
        {backgroundImages.map((imageSrc, index) => (
          <img
            key={index}
            src={imageSrc}
            alt={`Hero background ${index + 1}`}
            className={`hero-background ${index === currentImageIndex ? 'active' : ''}`}
          />
        ))}
      </div>

      {/* Hero content */}
      <div className="hero-content-wrapper relative z-10 px-4">
        <h2 className="hero-title">
          FIND YOUR HOME IN THE PHILIPPINES
        </h2>
        <p className="hero-subtitle mt-3 max-w-3xl">
          <span className="hero-subtitle-text">Trusted Rentals, simplified. Start your journey with </span>
          <span className="hero-subtitle-brand">Rentals.ph.</span>
        </p>

        {/* AI Assistant Button */}
        <button 
          className="ai-assistant-button"
          onClick={() => setIsChatMode(!isChatMode)}
        >
          <svg className="ai-assistant-sparkle" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z" fill="currentColor"/>
          </svg>
          Try our A.I. assistant
        </button>

        {/* Search bar and filters or Chat container */}
        <div className={`search-container ${isChatMode ? 'chat-mode' : ''}`}>
          {isChatMode ? (
            <>
            {/* Chat Interface */}
            <div className="chat-container">
              <div className="chat-header">
                <div className="chat-header-info">
                  <div className="chat-avatar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="chat-title">RentalsGroq</h3>
                  </div>
                </div>
                <div className="chat-header-actions">
                  <div className="chat-menu-container">
                    <button 
                      className="chat-menu-button"
                      onClick={() => setShowMenu(!showMenu)}
                      aria-label="More options"
                      title="More options"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="1" fill="currentColor"/>
                        <circle cx="12" cy="5" r="1" fill="currentColor"/>
                        <circle cx="12" cy="19" r="1" fill="currentColor"/>
                      </svg>
                    </button>
                    {showMenu && (
                      <div className="chat-menu-dropdown">
                        <button 
                          className="chat-menu-item"
                          onClick={() => {
                            setShowHistory(true)
                            setShowMenu(false)
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          View History
                        </button>
                        {conversationId && (
                          <>
                            
                            <button 
                              className="chat-menu-item chat-menu-item-danger"
                              onClick={() => handleDeleteConversation()}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Delete Conversation
                            </button>
                          </>
                        )}
                        <button 
                          className="chat-menu-item"
                          onClick={handleNewConversation}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          New Conversation
                        </button>
                      </div>
                    )}
                  </div>
                  <button 
                    className="chat-close-button"
                    onClick={() => setIsChatMode(false)}
                    aria-label="Close chat"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="chat-messages">
                {isLoadingHistory ? (
                  <div className="chat-message assistant-message">
                    <div className="chat-message-content">
                      <span className="chat-loading">Loading conversation...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {chatMessages.map((msg, index) => (
                      <div key={index} className={`chat-message ${msg.role === 'user' ? 'user-message' : 'assistant-message'}`}>
                        <div 
                          className="chat-message-content"
                          dangerouslySetInnerHTML={{
                            __html: msg.role === 'assistant' 
                              ? formatAIMessage(msg.message)
                              : msg.message.replace(/\n/g, '<br />')
                          }}
                        />
                      </div>
                    ))}
                    {isLoading && (
                      <div className="chat-message assistant-message">
                        <div className="chat-message-content">
                          <span className="chat-loading">Thinking...</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              <form className="chat-input-form" onSubmit={handleChatSubmit}>
                <input
                  type="text"
                  className="chat-input"
                  placeholder={isLoading ? "Searching..." : "Type your message..."}
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  disabled={isLoading}
                />
                <button type="submit" className="chat-send-button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </form>
            </div>
            {/* Properties Panel - Right side when in chat mode - Only show when properties exist */}
            {latestProperties && (
              <div className="properties-panel">
                <div className="properties-panel-header">
                  <h3 className="properties-panel-title">{latestProperties.title}</h3>
                </div>
                <div className="properties-panel-list">
                  {latestProperties.properties.map((property) => (
                    <SimplePropertyCard
                      key={property.id}
                      id={property.id}
                      title={property.title}
                      location={property.location || property.city || property.street_address || undefined}
                      price={`₱${property.price.toLocaleString()}${property.price_type ? `/${property.price_type}` : ''}`}
                      image={property.image_url || (property.image ? getImageUrl(property.image) : ASSETS.PLACEHOLDER_PROPERTY_MAIN)}
                    />
                  ))}
                </div>
              </div>
            )}
            </>
          ) : (
            <>
              <div className="search-input-wrapper">
                  <input 
                    type="text" 
                    className="search-inputs" 
                    placeholder="What are you looking for?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />

                  <div className="search-divider" />

                  <select 
                    className="search-dropdown"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                  >
                    <option value="">Property Type</option>
                    <option value="condominium">Condominium</option>
                    <option value="apartment">Apartment</option>
                    <option value="bedspace">Bed Space</option>
                    <option value="commercial">Commercial Spaces</option>
                    <option value="office">Office Spaces</option>
                  </select>
                  
                  <div className="search-divider" />
                  
                  <select 
                    className="search-dropdown"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    <option value="">Location</option>
                    <option value="metro-manila">Metro Manila</option>
                    <option value="makati">Makati City</option>
                    <option value="bgc">BGC</option>
                    <option value="quezon">Quezon City</option>
                    <option value="mandaluyong">Mandaluyong</option>
                    <option value="pasig">Pasig</option>
                    <option value="cebu">Cebu City</option>
                    <option value="davao">Davao City</option>
                    <option value="lapulapu">Lapulapu</option>
                    <option value="manila">Manila</option>
                  </select>

                  <button 
                    className={`filter-button improved-filter-button${showAdvancedOptions ? ' active' : ''}`}
                    type="button"
                    onClick={() => setShowAdvancedOptions((prev) => !prev)}
                    aria-label="Show filters"
                    title="Show filters"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 6h16M6 12h12M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span className="filter-label">Filters</span>
                  </button>

                  <button 
                    className="search-button"
                    onClick={handleSearch}
                  >
                    <span className="sr-only">Search</span>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="11" cy="11" r="6" stroke="white" strokeWidth="2.5"/>
                      <line x1="15.5" y1="15.5" x2="20" y2="20" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>

                {/* Advanced Options - Inside search container, toggled by filter button */}
                {showAdvancedOptions && (
                  <div className="advanced-options-panel">
                    <div className="advanced-options-grid">
                      <div className="advanced-option-group">
                        <label className="advanced-option-label">Min. Bedrooms</label>
                        <select 
                          className="advanced-option-select"
                          value={minBeds}
                          onChange={(e) => setMinBeds(e.target.value)}
                        >
                          <option value="">Any</option>
                          <option value="1">1+</option>
                          <option value="2">2+</option>
                          <option value="3">3+</option>
                          <option value="4">4+</option>
                        </select>
                      </div>

                      <div className="advanced-option-group">
                        <label className="advanced-option-label">Min. Bathrooms</label>
                        <select 
                          className="advanced-option-select"
                          value={minBaths}
                          onChange={(e) => setMinBaths(e.target.value)}
                        >
                          <option value="">Any</option>
                          <option value="1">1+</option>
                          <option value="2">2+</option>
                          <option value="3">3+</option>
                          <option value="4">4+</option>
                        </select>
                      </div>

                      <div className="advanced-option-group price-range-group">
                        <label className="advanced-option-label">Price Range</label>
                        <div className="price-range-inputs-wrapper">
                          <input
                            type="number"
                            className="price-range-input"
                            placeholder="Min"
                            value={priceMin}
                            onChange={(e) => setPriceMin(e.target.value)}
                          />
                          <span className="price-range-separator">to</span>
                          <input
                            type="number"
                            className="price-range-input"
                            placeholder="Max"
                            value={priceMax}
                            onChange={(e) => setPriceMax(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </>
          )}
        </div>

        {/* Recommended Searches - Outside search container */}
        <div className="recommended-searches">
          <div className="recommended-searches-list">
            {recommendedSearches.map((search, index) => (
              <button
                key={index}
                className="recommended-search-chip"
                onClick={() => handleRecommendedSearch(search)}
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Banner - Positioned absolutely at bottom (hidden in chat mode) */}
      {!isChatMode && <HeroBanner />}

      {/* Conversation History Sidebar */}
      {showHistory && (
        <div className="conversation-history-overlay" onClick={() => setShowHistory(false)}>
          <div className="conversation-history-sidebar" onClick={(e) => e.stopPropagation()}>
            <div className="conversation-history-header">
              <h3 className="conversation-history-title">Conversation History</h3>
              <button
                className="conversation-history-close"
                onClick={() => setShowHistory(false)}
                aria-label="Close history"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div className="conversation-history-list">
              {isLoadingConversations ? (
                <div className="conversation-history-loading">Loading conversations...</div>
              ) : conversations.length === 0 ? (
                <div className="conversation-history-empty">No conversations yet</div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.conversation_id}
                    className={`conversation-history-item ${conversationId === conv.conversation_id ? 'active' : ''}`}
                  >
                    <button
                      className="conversation-history-item-button"
                      onClick={() => handleLoadConversation(conv.conversation_id)}
                    >
                      <div className="conversation-history-item-content">
                        <h4 className="conversation-history-item-title">{conv.title}</h4>
                        <p className="conversation-history-item-meta">
                          {conv.message_count} message{conv.message_count !== 1 ? 's' : ''} • {new Date(conv.last_message_at).toLocaleDateString()}
                        </p>
                      </div>
                    </button>
                    <button
                      className="conversation-history-item-delete"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteConversation(conv.conversation_id)
                      }}
                      aria-label="Delete conversation"
                      title="Delete conversation"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </section>
  )
}

export default Hero