'use client'

import { useState, useEffect } from 'react'
import AppSidebar from '../../../components/common/AppSidebar'
import AgentHeader from '../../../components/agent/AgentHeader'
import { messagesApi } from '../../../api'
import type { Message } from '../../../api/endpoints/messages'
import { 
  FiSearch,
  FiRefreshCw,
  FiCheckSquare,
  FiAlertCircle,
  FiX,
  FiTrash2,
  FiEye,
  FiMail,
  FiHome
} from 'react-icons/fi'
import './page.css'

type MessageTypeFilter = 'all' | 'contact' | 'property_inquiry' | 'general'

export default function AgentInbox() {
  const [activeFilter, setActiveFilter] = useState<MessageTypeFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showProcessingBanner, setShowProcessingBanner] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [showMessageModal, setShowMessageModal] = useState(false)

  useEffect(() => {
    fetchMessages()
    
    if (typeof window !== 'undefined') {
      const registrationStatus = localStorage.getItem('agent_registration_status')
      const agentStatus = localStorage.getItem('agent_status')
      
      if (registrationStatus === 'processing' || 
          agentStatus === 'processing' || 
          agentStatus === 'pending' || 
          agentStatus === 'under_review') {
        setIsProcessing(true)
      }
    }
  }, [activeFilter])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('unread_messages_count', unreadCount.toString())
      window.dispatchEvent(new Event('storage'))
    }
  }, [unreadCount])

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (activeFilter !== 'all') {
        params.type = activeFilter
      }
      
      const response = await messagesApi.getAll(params)
      setMessages(response.data)
      setUnreadCount(response.unread_count)
    } catch (error: any) {
      console.error('Error fetching messages:', error)
      if (error.response?.status === 401) {
        console.error('Unauthorized. Please log in again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (messageId: number) => {
    try {
      await messagesApi.markAsRead(messageId)
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, is_read: true, read_at: new Date().toISOString() } : msg
      ))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error: any) {
      console.error('Error marking message as read:', error)
      alert('Failed to mark message as read')
    }
  }

  const handleDelete = async (messageId: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return
    
    try {
      await messagesApi.delete(messageId)
      const message = messages.find(m => m.id === messageId)
      if (message && !message.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
      setMessages(prev => prev.filter(msg => msg.id !== messageId))
    } catch (error: any) {
      console.error('Error deleting message:', error)
      alert('Failed to delete message')
    }
  }

  const handleViewMessage = async (message: Message) => {
    setSelectedMessage(message)
    setShowMessageModal(true)
    if (!message.is_read) {
      await handleMarkAsRead(message.id)
    }
  }

  const getInitials = (name: string): string => {
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const getMessageTypeLabel = (type: string): string => {
    switch (type) {
      case 'property_inquiry': return 'Property Inquiry'
      case 'contact': return 'Contact'
      case 'general': return 'General'
      default: return type
    }
  }

  const getMessageTypeColor = (type: string): string => {
    switch (type) {
      case 'property_inquiry': return '#F97316'
      case 'contact': return '#10B981'
      case 'general': return '#6B7280'
      default: return '#6B7280'
    }
  }

  const filteredMessages = messages.filter(msg => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        msg.sender_name.toLowerCase().includes(query) ||
        msg.sender_email.toLowerCase().includes(query) ||
        msg.message.toLowerCase().includes(query) ||
        msg.subject?.toLowerCase().includes(query) ||
        msg.property?.title.toLowerCase().includes(query)
      )
    }
    return true
  })


  return (
    <div className="agent-inbox">
      <AppSidebar/>

      <main className="agent-main">
        <AgentHeader 
          title="Inbox" 
          subtitle="Manage your messages and inquiries." 
        />

        <div className="inbox-container">
          <h2 className="inbox-title">Inbox</h2>

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

          <div className="inbox-filters">
            <button
              className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              <FiCheckSquare className="filter-checkbox" />
              <span>All({messages.length})</span>
            </button>
            <button
              className={`filter-tab ${activeFilter === 'property_inquiry' ? 'active' : ''}`}
              onClick={() => setActiveFilter('property_inquiry')}
            >
              <span className="filter-dot" style={{ backgroundColor: '#F97316' }}></span>
              <span>Property Inquiries({messages.filter(m => m.type === 'property_inquiry').length})</span>
            </button>
            <button
              className={`filter-tab ${activeFilter === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveFilter('contact')}
            >
              <span className="filter-dot" style={{ backgroundColor: '#10B981' }}></span>
              <span>Contacts({messages.filter(m => m.type === 'contact').length})</span>
            </button>
            <button
              className={`filter-tab ${activeFilter === 'general' ? 'active' : ''}`}
              onClick={() => setActiveFilter('general')}
            >
              <span className="filter-dot" style={{ backgroundColor: '#6B7280' }}></span>
              <span>General({messages.filter(m => m.type === 'general').length})</span>
            </button>
            <button className="refresh-button" onClick={fetchMessages} title="Refresh">
              <FiRefreshCw className="refresh-icon" />
            </button>
          </div>

          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Loading messages...</div>
          ) : filteredMessages.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>No messages found.</div>
          ) : (
            <div className="inbox-table-container">
              <table className="inbox-table">
                <thead>
                  <tr>
                    <th>Sender</th>
                    <th>Type</th>
                    <th>Property</th>
                    <th>Message</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMessages.map((msg) => (
                    <tr 
                      key={msg.id} 
                      className={msg.is_read ? 'read' : 'unread'}
                      onClick={() => handleViewMessage(msg)}
                    >
                      <td>
                        <div className="table-sender">
                          <div className="table-avatar">
                            {getInitials(msg.sender_name)}
                          </div>
                          <div className="table-sender-info">
                            <div className="table-sender-name">{msg.sender_name}</div>
                            <div className="table-sender-email">{msg.sender_email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span 
                          className="table-type-badge"
                          style={{ backgroundColor: getMessageTypeColor(msg.type) }}
                        >
                          {getMessageTypeLabel(msg.type)}
                        </span>
                      </td>
                      <td>
                        {msg.property ? (
                          <div className="table-property">
                            <FiHome className="table-property-icon" />
                            <span className="table-property-title">{msg.property.title}</span>
                          </div>
                        ) : (
                          <span className="table-no-property">—</span>
                        )}
                      </td>
                      <td>
                        <div className="table-message">
                          {msg.subject && (
                            <div className="table-message-subject">{msg.subject}</div>
                          )}
                          <div className="table-message-text">
                            {msg.message.length > 100 ? `${msg.message.substring(0, 100)}...` : msg.message}
                          </div>
                        </div>
                      </td>
                      <td className="table-date">{formatDate(msg.created_at)}</td>
                      <td>
                        {msg.is_read ? (
                          <span className="table-status read">Read</span>
                        ) : (
                          <span className="table-status unread">New</span>
                        )}
                      </td>
                      <td className="table-actions" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="table-action-btn view"
                          onClick={() => handleViewMessage(msg)}
                          title="View"
                        >
                          <FiEye />
                        </button>
                        {!msg.is_read && (
                          <button
                            className="table-action-btn mark-read"
                            onClick={() => handleMarkAsRead(msg.id)}
                            title="Mark as read"
                          >
                            <FiMail />
                          </button>
                        )}
                        <button
                          className="table-action-btn delete"
                          onClick={() => handleDelete(msg.id)}
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Message Detail Modal */}
          {showMessageModal && selectedMessage && (
            <div className="message-modal-overlay" onClick={() => setShowMessageModal(false)}>
              <div className="message-modal" onClick={(e) => e.stopPropagation()}>
                <div className="message-modal-header">
                  <h2>Message Details</h2>
                  <button className="message-modal-close" onClick={() => setShowMessageModal(false)}>
                    <FiX />
                  </button>
                </div>
                <div className="message-modal-content">
                  <div className="message-detail-row">
                    <strong>From:</strong>
                    <span>{selectedMessage.sender_name} ({selectedMessage.sender_email})</span>
                  </div>
                  {selectedMessage.sender_phone && (
                    <div className="message-detail-row">
                      <strong>Phone:</strong>
                      <span>{selectedMessage.sender_phone}</span>
                    </div>
                  )}
                  {selectedMessage.property && (
                    <div className="message-detail-row">
                      <strong>Property:</strong>
                      <span>{selectedMessage.property.title}</span>
                    </div>
                  )}
                  {selectedMessage.subject && (
                    <div className="message-detail-row">
                      <strong>Subject:</strong>
                      <span>{selectedMessage.subject}</span>
                    </div>
                  )}
                  <div className="message-detail-row">
                    <strong>Type:</strong>
                    <span 
                      className="message-type-badge"
                      style={{ backgroundColor: getMessageTypeColor(selectedMessage.type) }}
                    >
                      {getMessageTypeLabel(selectedMessage.type)}
                    </span>
                  </div>
                  <div className="message-detail-row">
                    <strong>Date:</strong>
                    <span>{new Date(selectedMessage.created_at).toLocaleString()}</span>
                  </div>
                  <div className="message-detail-message">
                    <strong>Message:</strong>
                    <p>{selectedMessage.message}</p>
                  </div>
                </div>
                <div className="message-modal-footer">
                  <button
                    className="message-modal-btn close"
                    onClick={() => setShowMessageModal(false)}
                  >
                    Close
                  </button>
                  {!selectedMessage.is_read && (
                    <button
                      className="message-modal-btn mark-read"
                      onClick={() => {
                        handleMarkAsRead(selectedMessage.id)
                        setShowMessageModal(false)
                      }}
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    className="message-modal-btn delete"
                    onClick={() => {
                      handleDelete(selectedMessage.id)
                      setShowMessageModal(false)
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

