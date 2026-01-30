'use client'

import AppSidebar from '../../../components/common/AppSidebar'
import AgentHeader from '../../../components/agent/AgentHeader'
import { 
  FiMail,
  FiPhone
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import '../../../pages-old/agent/AgentDigitalCard.css'

export default function AgentDigitalCard() {
  return (
    <div className="agent-dashboard">
      <AppSidebar/>

      <main className="agent-main">
        <AgentHeader 
          title="Digital Business Card" 
          subtitle="Share your digital business card." 
        />

        <div className="digital-card-section">
          <h2 className="section-title">Digital Business Card</h2>
          
          <div className="business-card-container">
            <div className="business-card">
              <div className="card-profile-image">
                <img 
                  src="/assets/profile-placeholder.png" 
                  alt="John Anderson"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const nextSibling = target.nextElementSibling as HTMLElement;
                    if (nextSibling) {
                      nextSibling.classList.remove('hidden');
                    }
                  }}
                />
                <div className="card-avatar-fallback hidden">JA</div>
              </div>

              <h3 className="card-name">John Anderson</h3>

              <p className="card-title">Rent Manager</p>

              <p className="card-tenure">Since 2014</p>

              <div className="card-contact-info">
                <div className="contact-item">
                  <FiPhone className="contact-icon phone-icon" />
                  <span className="contact-text">+63 9876543210</span>
                </div>
                <div className="contact-item">
                  <FaWhatsapp className="contact-icon whatsapp-icon" />
                  <span className="contact-text">+63 9876543210</span>
                </div>
                <div className="contact-item">
                  <FiMail className="contact-icon email-icon" />
                  <span className="contact-text">johnanderson@gmail.com</span>
                </div>
              </div>

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
