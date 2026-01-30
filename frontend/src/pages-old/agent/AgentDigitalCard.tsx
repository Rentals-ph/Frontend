import AgentSidebar from '../../components/agent/AgentSidebar'
import AgentHeader from '../../components/agent/AgentHeader'

import { 
  FiMail,
  FiPhone
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import './AgentDigitalCard.css'

function AgentDigitalCard() {
  return (
    <div className="agent-dashboard">
      <AgentSidebar/>

      {/* Main Content */}
      <main className="agent-main">
        {/* Header */}
        <AgentHeader 
          title="Digital Business Card" 
          subtitle="Share your digital business card." 
        />

        {/* Digital Business Card Section */}
        <div className="digital-card-section">
          <h2 className="section-title">Digital Business Card</h2>
          
          <div className="business-card-container">
            <div className="business-card">
              {/* Profile Image */}
              <div className="card-profile-image">
                <img 
                  src="/assets/profile-placeholder.png" 
                  alt="John Anderson"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="card-avatar-fallback hidden">JA</div>
              </div>

              {/* Name */}
              <h3 className="card-name">John Anderson</h3>

              {/* Title */}
              <p className="card-title">Rent Manager</p>

              {/* Tenure */}
              <p className="card-tenure">Since 2014</p>

              {/* Contact Information */}
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

              {/* QR Code */}
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

export default AgentDigitalCard

