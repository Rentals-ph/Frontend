'use client'

import AppSidebar from '../../../components/common/AppSidebar'
import { 
  FiBell,
  FiPlus,
  FiDownload,
  FiFileText,
  FiBarChart2,
  FiImage
} from 'react-icons/fi'
import '../../agent/downloadables/page.css'
import '../broker-shared.css'

export default function BrokerDownloadables() {
  const handleDownload = (type: string) => {
    console.log(`Downloading ${type}`)
  }

  return (
    <div className="broker-dashboard">
      <AppSidebar />

      <main className="broker-main">
        {/* Broker Header */}
        <header className="broker-header">
          <div className="broker-header-left">
            <h1>Downloadables</h1>
            <p>Download resources and documents.</p>
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

        <div className="downloadables-section">
          <h2 className="downloadables-title">Downloadables</h2>
          
          <div className="downloadables-list">
            <div className="downloadable-card">
              <div className="downloadable-icon-container">
                <FiFileText className="downloadable-icon" />
              </div>
              <div className="downloadable-content">
                <h3 className="downloadable-name">Lease Agreements</h3>
              </div>
              <button 
                className="download-button"
                onClick={() => handleDownload('lease-agreements')}
                aria-label="Download Lease Agreements"
              >
                <FiDownload className="download-icon" />
              </button>
            </div>

            <div className="downloadable-card">
              <div className="downloadable-icon-container">
                <FiBarChart2 className="downloadable-icon" />
              </div>
              <div className="downloadable-content">
                <h3 className="downloadable-name">Financial Report</h3>
              </div>
              <button 
                className="download-button"
                onClick={() => handleDownload('financial-report')}
                aria-label="Download Financial Report"
              >
                <FiDownload className="download-icon" />
              </button>
            </div>

            <div className="downloadable-card">
              <div className="downloadable-icon-container">
                <FiImage className="downloadable-icon" />
              </div>
              <div className="downloadable-content">
                <h3 className="downloadable-name">Property Photos</h3>
              </div>
              <button 
                className="download-button"
                onClick={() => handleDownload('property-photos')}
                aria-label="Download Property Photos"
              >
                <FiDownload className="download-icon" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
