'use client'

import AppSidebar from '../../../components/common/AppSidebar'
import AgentHeader from '../../../components/agent/AgentHeader'
import { ASSETS } from '@/utils/assets'
import { 
  FiMail,
  FiPhone
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import './page.css'

export default function AgentDigitalCard() {
  // Get user data - you can replace this with actual data fetching
  const firstName = "Isaac"
  const lastName = "Locaylocay"
  const fullName = `${firstName} ${lastName}`
  const title = "Rent Manager"
  const sinceYear = "2014"
  const phone = "+63 9914099656"
  const email = "danielleisaaclocaylocay@gmail.com"

  return (
    <div className="agent-dashboard">
      <AppSidebar/>

      <main className="agent-main">
        <AgentHeader 
          title="Dashboard" 
          subtitle="Welcome back, manage your rental properties." 
        />

        <div className="digital-card-section">
          <h2 className="section-title">Digital Business Card</h2>
          
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
                    src={ASSETS.PLACEHOLDER_PROFILE} 
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
                  <div className="card-avatar-fallback hidden">IL</div>
                </div>

                {/* Name and Title Section */}
                <div className="card-name-section">
                  <h3 className="card-name">
                    <span className="name-first">{firstName}</span>
                    <span className="name-last">{lastName}</span>
                  </h3>
                  <p className="card-title">{title}</p>
                  <p className="card-tenure">Since {sinceYear}</p>
                </div>

                {/* Contact Information */}
                <div className="card-contact-info">
                  <div className="contact-item">
                    <FiPhone className="contact-icon phone-icon" />
                    <span className="contact-text">{phone}</span>
                  </div>
                  <div className="contact-item">
                    <FaWhatsapp className="contact-icon whatsapp-icon" />
                    <span className="contact-text">{phone}</span>
                  </div>
                  <div className="contact-item">
                    <FiMail className="contact-icon email-icon" />
                    <span className="contact-text">{email}</span>
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="card-qr-container">
                <div className="card-qr-code"></div>
                <p className="qr-instruction">Scan to view my profile</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
