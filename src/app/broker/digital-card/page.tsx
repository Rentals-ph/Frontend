'use client'

import { useState, useEffect } from 'react'
import AppSidebar from '../../../components/common/AppSidebar'
import { agentsApi } from '../../../api'
import type { Agent } from '../../../api/endpoints/agents'
import { ASSETS } from '@/utils/assets'
import { 
  FiBell,
  FiPlus,
  FiMail,
  FiPhone
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import '../../agent/digital-card/page.css'
import '../broker-shared.css'

export default function BrokerDigitalCard() {
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBrokerData = async () => {
      try {
        // Try to get current authenticated agent/broker first
        const agentData = await agentsApi.getCurrent()
        setAgent(agentData)
        
        // Update localStorage with broker info
        if (agentData.first_name && agentData.last_name) {
          const fullName = `${agentData.first_name} ${agentData.last_name}`
          localStorage.setItem('agent_name', fullName)
          localStorage.setItem('user_name', fullName)
        }
        if (agentData.id) {
          localStorage.setItem('agent_id', agentData.id.toString())
        }
      } catch (error) {
        console.error('Error fetching broker data:', error)
        // Fallback to using agent_id if getCurrent fails
        try {
          const agentId = localStorage.getItem('agent_id')
          if (agentId) {
            const agentData = await agentsApi.getById(parseInt(agentId))
            setAgent(agentData)
            
            // Update localStorage with broker info
            if (agentData.first_name && agentData.last_name) {
              const fullName = `${agentData.first_name} ${agentData.last_name}`
              localStorage.setItem('agent_name', fullName)
              localStorage.setItem('user_name', fullName)
            }
          }
        } catch (fallbackError) {
          console.error('Error fetching broker by ID:', fallbackError)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchBrokerData()
  }, [])

  // Get user data from agent or use defaults
  const firstName = agent?.first_name || 'Broker'
  const lastName = agent?.last_name || ''
  const fullName = agent?.full_name || 
    (agent?.first_name && agent?.last_name 
      ? `${agent.first_name} ${agent.last_name}` 
      : 'Broker')
  const title = agent?.verified ? 'Rent Manager' : 'Property Broker'
  const sinceYear = agent?.created_at 
    ? new Date(agent.created_at).getFullYear().toString()
    : new Date().getFullYear().toString()
  const phone = agent?.phone ? `+63 ${agent.phone.replace(/^\+?63\s?/, '')}` : '+63'
  const email = agent?.email || ''
  const brokerImage = agent?.image || agent?.avatar || agent?.profile_image || ASSETS.PLACEHOLDER_PROFILE
  const brokerInitials = fullName.split(' ').map(n => n[0]).join('').toUpperCase() || 'B'

  return (
    <div className="broker-dashboard">
      <AppSidebar />

      <main className="broker-main">
        {/* Broker Header */}
        <header className="broker-header">
          <div className="broker-header-left">
            <h1>Digital Business Card</h1>
            <p>Share your professional contact information.</p>
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

        <div className="digital-card-section">
          <h2 className="section-title">Digital Business Card</h2>
          
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Loading card...</div>
          ) : (
            <div className="business-card-container">
              <div className="business-card">
                {/* Rentals.ph Logo in top-right */}
                <div className="card-logo">
                  <img 
                    src={ASSETS.LOGO_HERO_MAIN} 
                    alt="Rentals.ph"
                    className="rentals-logo"
                  />
                </div>

                {/* Left Decorative Strip */}
                <div className="card-decorative-strip">
                  <div className="strip-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#0073e6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#0073e6"/>
                      <path d="M9 22V12H15V22" fill="#ff8c00"/>
                    </svg>
                  </div>
                  <div className="strip-blue"></div>
                  <div className="strip-orange"></div>
                  <div className="strip-wave"></div>
                </div>

                {/* Main Content Area */}
                <div className="card-content">
                  {/* Profile Picture */}
                  <div className="card-profile-image">
                    <img 
                      src={brokerImage} 
                      alt={fullName}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const nextSibling = target.nextElementSibling as HTMLElement;
                        if (nextSibling) {
                          nextSibling.classList.remove('hidden');
                        }
                      }}
                    />
                    <div className="card-avatar-fallback hidden">{brokerInitials}</div>
                  </div>

                  {/* Name and Title Section */}
                  <div className="card-name-section">
                    <h3 className="card-name">
                      <span className="name-first">{firstName}</span>
                      {lastName && <span className="name-last">{lastName}</span>}
                    </h3>
                    <p className="card-title">{title}</p>
                    <p className="card-tenure">Since {sinceYear}</p>
                  </div>

                  {/* Contact Information */}
                  <div className="card-contact-info">
                    {phone && phone !== '+63' && (
                      <div className="contact-item">
                        <FiPhone className="contact-icon phone-icon" />
                        <span className="contact-text">{phone}</span>
                      </div>
                    )}
                    {phone && phone !== '+63' && (
                      <div className="contact-item">
                        <FaWhatsapp className="contact-icon whatsapp-icon" />
                        <span className="contact-text">{phone}</span>
                      </div>
                    )}
                    {email && (
                      <div className="contact-item">
                        <FiMail className="contact-icon email-icon" />
                        <span className="contact-text">{email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* QR Code Section */}
                <div className="card-qr-container">
                  <div className="card-qr-code"></div>
                  <p className="qr-instruction">Scan to view my profile</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
