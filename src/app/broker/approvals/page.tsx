'use client'

import { useState } from 'react'
import AppSidebar from '../../../components/common/AppSidebar'
import {
  FiBell,
  FiPlus,
  FiChevronDown,
  FiCheck,
  FiSettings,
  FiX,
  FiEye,
  FiUser,
  FiPhone,
  FiGlobe,
  FiSend,
  FiAlertCircle,
  FiCreditCard,
} from 'react-icons/fi'
import './page.css'

interface Applicant {
  id: number
  name: string
  requestedRole: 'Agent' | 'Unit Manager'
  assignedManager: string | null
  profileCompletion: string
  designTheme: string
  photo?: string
}

const applicantsData: Applicant[] = [
  {
    id: 1,
    name: 'Beatriz Luna',
    requestedRole: 'Agent',
    assignedManager: 'Gabo Dela Cruz',
    profileCompletion: '85%',
    designTheme: 'Royal Blue',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: 2,
    name: 'Kevin Chua',
    requestedRole: 'Unit Manager',
    assignedManager: 'Camille Santos',
    profileCompletion: '100%',
    designTheme: 'Action Orange',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: 3,
    name: 'Rina Lopez',
    requestedRole: 'Agent',
    assignedManager: null,
    profileCompletion: '95%',
    designTheme: 'Dark Mode',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: 4,
    name: 'Sam Rivera',
    requestedRole: 'Agent',
    assignedManager: 'Gabo Dela Cruz',
    profileCompletion: '75%',
    designTheme: 'Light Mode',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
  },
]

export default function AgentApprovalsPage() {
  const [selectedApplicants, setSelectedApplicants] = useState<number[]>([])
  const [showModal, setShowModal] = useState(false)
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)
  const [message, setMessage] = useState('')

  const allSelected =
    selectedApplicants.length === applicantsData.length && applicantsData.length > 0

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedApplicants([])
    } else {
      setSelectedApplicants(applicantsData.map((a) => a.id))
    }
  }

  const toggleSelect = (id: number) => {
    setSelectedApplicants((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleSettingsClick = (applicant: Applicant) => {
    setSelectedApplicant(applicant)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedApplicant(null)
    setMessage('')
  }

  const handleSendMessage = () => {
    // Handle send message logic
    console.log('Sending message:', message)
    setMessage('')
  }

  const handleApprove = () => {
    // Handle approve logic
    console.log('Approving:', selectedApplicant?.name)
    handleCloseModal()
  }

  const handleReject = () => {
    // Handle reject logic
    console.log('Rejecting:', selectedApplicant?.name)
    handleCloseModal()
  }

  const handleRequestCompletion = () => {
    // Handle request completion logic
    console.log('Requesting completion for:', selectedApplicant?.name)
  }

  // Calculate verification percentage (remove % and convert to number)
  const getVerificationPercentage = (completion: string) => {
    return parseInt(completion.replace('%', ''))
  }

  const isVerified = (percentage: number) => percentage >= 100

  return (
    <div className="broker-dashboard">
      <AppSidebar />
      <main className="broker-main">
        {/* Header */}
        <header className="broker-header">
          <div className="broker-header-left">
            <h1>Agent Approvals</h1>
            <p>A dedicated space to review agent&apos;s professional profiles.</p>
          </div>
          <div className="broker-header-right">
            <button className="broker-notification-btn">
              <FiBell />
            </button>
            <a href="/broker/create-listing" className="broker-add-listing-btn">
              <FiPlus />
              Add Listing
            </a>
          </div>
        </header>

        {/* Approvals Table */}
        <div className="ba-table-card">
          <div className="ba-table-header">
            <h3 className="ba-table-title">Agent Approvals Table</h3>
            <button className="ba-filter-btn">
              Filter <FiChevronDown />
            </button>
          </div>

          {/* Desktop Table */}
          <div className="ba-table-wrapper">
            <table className="ba-table">
              <thead>
                <tr>
                  <th className="ba-th-check">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="ba-checkbox"
                    />
                  </th>
                  <th>Applicant Name</th>
                  <th>Requested Role</th>
                  <th>Assigned Manager</th>
                  <th>Profile Completion</th>
                  <th>Design Theme</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applicantsData.map((applicant) => (
                  <tr key={applicant.id}>
                    <td className="ba-td-check">
                      <input
                        type="checkbox"
                        checked={selectedApplicants.includes(applicant.id)}
                        onChange={() => toggleSelect(applicant.id)}
                        className="ba-checkbox"
                      />
                    </td>
                    <td className="ba-td-name">{applicant.name}</td>
                    <td className="ba-td-role">{applicant.requestedRole}</td>
                    <td className="ba-td-manager">
                      {applicant.assignedManager || (
                        <span className="ba-dash">&mdash;</span>
                      )}
                    </td>
                    <td className="ba-td-completion">{applicant.profileCompletion}</td>
                    <td className="ba-td-theme">{applicant.designTheme}</td>
                    <td className="ba-td-actions">
                      <div className="ba-actions-row">
                        <button className="ba-action-btn approve" title="Approve">
                          <FiCheck />
                        </button>
                        <button 
                          className="ba-action-btn settings" 
                          title="Settings"
                          onClick={() => handleSettingsClick(applicant)}
                        >
                          <FiSettings />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="ba-mobile-cards">
            {applicantsData.map((applicant) => (
              <div key={applicant.id} className="ba-mobile-card">
                <div className="ba-mobile-card-header">
                  <div className="ba-mobile-card-name">
                    <input
                      type="checkbox"
                      checked={selectedApplicants.includes(applicant.id)}
                      onChange={() => toggleSelect(applicant.id)}
                      className="ba-mobile-card-checkbox"
                    />
                    <span>{applicant.name}</span>
                  </div>
                </div>
                <div className="ba-mobile-card-row">
                  <span className="ba-mobile-card-label">Requested Role</span>
                  <span className="ba-mobile-card-value">{applicant.requestedRole}</span>
                </div>
                <div className="ba-mobile-card-row">
                  <span className="ba-mobile-card-label">Assigned Manager</span>
                  <span className="ba-mobile-card-value">
                    {applicant.assignedManager || <span className="ba-dash">&mdash;</span>}
                  </span>
                </div>
                <div className="ba-mobile-card-row">
                  <span className="ba-mobile-card-label">Profile Completion</span>
                  <span className="ba-mobile-card-value">{applicant.profileCompletion}</span>
                </div>
                <div className="ba-mobile-card-row">
                  <span className="ba-mobile-card-label">Design Theme</span>
                  <span className="ba-mobile-card-value">{applicant.designTheme}</span>
                </div>
                <div className="ba-mobile-card-actions">
                  <button 
                    className="ba-action-btn approve" 
                    title="Approve"
                    onClick={() => {
                      // Handle approve for mobile
                      console.log('Approve:', applicant.name)
                    }}
                  >
                    <FiCheck />
                  </button>
                  <button 
                    className="ba-action-btn settings" 
                    title="Settings"
                    onClick={() => handleSettingsClick(applicant)}
                  >
                    <FiSettings />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Agent Details Modal */}
      {showModal && selectedApplicant && (
        <div className="ba-modal-overlay" onClick={handleCloseModal}>
          <div className="ba-modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="ba-modal-header">
              <button className="ba-modal-close" onClick={handleCloseModal}>
                <FiX />
              </button>
            </div>

            {/* Modal Body */}
            <div className="ba-modal-body">
              {/* Profile Section */}
              <div className="ba-modal-profile">
                <div className="ba-profile-image">
                  <img 
                    src={selectedApplicant.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedApplicant.name)}&size=120&background=3b82f6&color=fff&bold=true`}
                    alt={selectedApplicant.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedApplicant.name)}&size=120&background=3b82f6&color=fff&bold=true`
                    }}
                  />
                </div>
                <h2 className="ba-profile-name">{selectedApplicant.name}</h2>
                <p className="ba-profile-role">{selectedApplicant.requestedRole}</p>

                {/* Verification Status */}
                <div className="ba-verification-status">
                  <div className="ba-verification-item verified">
                    <FiUser className="ba-verification-icon" />
                    <span>Profile Verification is at {selectedApplicant.profileCompletion}</span>
                  </div>
                  <div className={`ba-verification-item ${isVerified(getVerificationPercentage(selectedApplicant.profileCompletion)) ? 'verified' : 'not-verified'}`}>
                    {isVerified(getVerificationPercentage(selectedApplicant.profileCompletion)) ? (
                      <FiCheck className="ba-verification-icon" />
                    ) : (
                      <FiX className="ba-verification-icon" />
                    )}
                    <span>{isVerified(getVerificationPercentage(selectedApplicant.profileCompletion)) ? 'Verified' : 'Not Verified'}</span>
                  </div>
                </div>

                {/* Profile Details Links */}
                <div className="ba-profile-details">
                  <div className="ba-detail-item">
                    <div className="ba-detail-left">
                      <FiCreditCard className="ba-detail-icon" />
                      <span>PRC ID</span>
                    </div>
                    <button className="ba-view-btn">
                      <FiEye />
                      View
                    </button>
                  </div>
                  <div className="ba-detail-item">
                    <div className="ba-detail-left">
                      <FiPhone className="ba-detail-icon" />
                      <span>Contact</span>
                    </div>
                    <button className="ba-view-btn">
                      <FiEye />
                      View
                    </button>
                  </div>
                  <div className="ba-detail-item">
                    <div className="ba-detail-left">
                      <FiUser className="ba-detail-icon" />
                      <span>Profile Photo</span>
                    </div>
                    <button className="ba-view-btn">
                      <FiEye />
                      View
                    </button>
                  </div>
                  <div className="ba-detail-item">
                    <div className="ba-detail-left">
                      <FiGlobe className="ba-detail-icon" />
                      <span>View Page</span>
                    </div>
                    <button className="ba-view-btn">
                      <FiEye />
                      View
                    </button>
                  </div>
                </div>

                {/* Send Message Section */}
                <div className="ba-message-section">
                  <h3 className="ba-message-title">Send a message</h3>
                  <textarea
                    className="ba-message-textarea"
                    placeholder="Send a message to this agent..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                  <div className="ba-message-buttons">
                    <button className="ba-send-message-btn" onClick={handleSendMessage}>
                      <FiSend />
                      Send Message
                    </button>
                    <button className="ba-request-completion-btn" onClick={handleRequestCompletion}>
                      <FiAlertCircle />
                      Send request
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="ba-action-buttons">
                  <button className="ba-approve-btn" onClick={handleApprove}>
                    Approve
                  </button>
                  <button className="ba-reject-btn" onClick={handleReject}>
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
