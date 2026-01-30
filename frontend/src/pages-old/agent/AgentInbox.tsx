import { useState, useEffect } from 'react'
import AgentSidebar from '../../components/agent/AgentSidebar'
import AgentHeader from '../../components/agent/AgentHeader'

import { 
  FiSearch,
  FiRefreshCw,
  FiCheckSquare,
  FiAlertCircle,
  FiX
} from 'react-icons/fi'
import './AgentInbox.css'

interface InboxItem {
  id: number
  sender: string
  senderInitials: string
  messageType: 'property' | 'message' | 'payment'
  messageTypeLabel: string
  snippet: string
  isNew: boolean
}

function AgentInbox() {
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showProcessingBanner, setShowProcessingBanner] = useState(true)
  const [inboxItems, setInboxItems] = useState<InboxItem[]>([
    {
      id: 1,
      sender: 'Marcel',
      senderInitials: 'M',
      messageType: 'property',
      messageTypeLabel: 'Property Update',
      snippet: 'Hello! I like your properties that were listed. I want to inquire those properties that are...',
      isNew: true
    },
    {
      id: 2,
      sender: 'Yerixy',
      senderInitials: 'Y',
      messageType: 'message',
      messageTypeLabel: 'Message',
      snippet: 'Hi, I want to ask about something about your apartment...',
      isNew: true
    },
    {
      id: 3,
      sender: 'Blake',
      senderInitials: 'B',
      messageType: 'payment',
      messageTypeLabel: 'Failed Payment',
      snippet: 'Sorry for the late payment! Been through a lot lately...',
      isNew: true
    },
    {
      id: 4,
      sender: 'Marcel',
      senderInitials: 'M',
      messageType: 'message',
      messageTypeLabel: 'Messages',
      snippet: 'I want to know more about your properties. Can I contact you now for more details?',
      isNew: true
    }
  ])

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

  useEffect(() => {
    // Update unread count in localStorage for sidebar indicator
    const unreadCount = inboxItems.filter(item => item.isNew).length
    localStorage.setItem('unread_messages_count', unreadCount.toString())
    
    // Trigger a custom event to notify sidebar of the change
    window.dispatchEvent(new Event('storage'))
  }, [inboxItems])

  const toggleReadStatus = (itemId: number) => {
    setInboxItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, isNew: !item.isNew } : item
      )
    )
  }

  const filteredItems = inboxItems.filter(item => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'properties' && item.messageType === 'property') return true
    if (activeFilter === 'messages' && item.messageType === 'message') return true
    if (activeFilter === 'payments' && item.messageType === 'payment') return true
    return false
  })

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'property':
        return '#F97316' // orange
      case 'message':
        return '#10B981' // green
      case 'payment':
        return '#EF4444' // red
      default:
        return '#6B7280'
    }
  }

  const getMessageTypeDotColor = (type: string) => {
    switch (type) {
      case 'property':
        return '#F97316' // orange
      case 'message':
        return '#10B981' // green
      case 'payment':
        return '#EF4444' // red
      default:
        return '#6B7280'
    }
  }

  return (
    <div className="agent-inbox">
      <AgentSidebar/>

      {/* Main Content */}
      <main className="agent-main">
        {/* Header */}
        <AgentHeader 
          title="Inbox" 
          subtitle="Manage your messages and inquiries." 
        />

        {/* Inbox Content */}
        <div className="inbox-container">
          <h2 className="inbox-title">Inbox</h2>

          {/* Account Processing Reminder Banner */}
          {isProcessing && showProcessingBanner && (
            <div className="processing-banner">
              <div className="processing-banner-content">
                <div className="processing-banner-icon">
                  <FiAlertCircle />
                </div>
                <div className="processing-banner-text">
                  <h3>Account Under Review</h3>
                  <p>Your account is currently being processed by our admin team. Your listings won't be visible to users until your account is approved.</p>
                </div>
              </div>
              <button 
                className="processing-banner-close"
                onClick={() => setShowProcessingBanner(false)}
                aria-label="Close banner"
              >
                <FiX />
              </button>
            </div>
          )}

          {/* Search Bar */}
          <div className="inbox-search">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Filter Tabs */}
          <div className="inbox-filters">
            <button
              className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              <FiCheckSquare className="filter-checkbox" />
              <span>All(23)</span>
            </button>
            <button
              className={`filter-tab ${activeFilter === 'properties' ? 'active' : ''}`}
              onClick={() => setActiveFilter('properties')}
            >
              <span className="filter-dot" style={{ backgroundColor: '#F97316' }}></span>
              <span>Properties(1)</span>
            </button>
            <button
              className={`filter-tab ${activeFilter === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveFilter('messages')}
            >
              <span className="filter-dot" style={{ backgroundColor: '#10B981' }}></span>
              <span>Messages(7)</span>
            </button>
            <button
              className={`filter-tab ${activeFilter === 'payments' ? 'active' : ''}`}
              onClick={() => setActiveFilter('payments')}
            >
              <span className="filter-dot" style={{ backgroundColor: '#EF4444' }}></span>
              <span>Failed Payments(3)</span>
            </button>
            <button className="refresh-button" title="Refresh">
              <FiRefreshCw className="refresh-icon" />
            </button>
          </div>

          {/* Inbox Items List */}
          <div className="inbox-items">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className={`inbox-item ${item.isNew ? 'unread' : 'read'}`}
                onClick={() => toggleReadStatus(item.id)}
              >
                <div className="inbox-item-avatar">
                  <div className="avatar-circle">
                    <div className="avatar-fallback">{item.senderInitials}</div>
                  </div>
                  <span
                    className="message-type-dot"
                    style={{ backgroundColor: getMessageTypeDotColor(item.messageType) }}
                  ></span>
                </div>
                <div className="inbox-item-content">
                  <div className="inbox-item-header">
                    <div className="inbox-item-left">
                      <span className="inbox-sender">{item.sender}</span>
                      {item.isNew && <span className="new-badge">New</span>}
                    </div>
                    <span
                      className="message-type-label"
                      style={{ color: getMessageTypeColor(item.messageType) }}
                    >
                      {item.messageTypeLabel}
                    </span>
                  </div>
                  <p className="inbox-snippet">{item.snippet}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default AgentInbox

