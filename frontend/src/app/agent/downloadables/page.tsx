'use client'

import AppSidebar from '../../../components/common/AppSidebar'
import AgentHeader from '../../../components/agent/AgentHeader'
import { 
  FiDownload,
  FiFileText,
  FiBarChart2,
  FiImage
} from 'react-icons/fi'
import '../../../pages-old/agent/AgentDownloadables.css'

export default function AgentDownloadables() {
  const handleDownload = (type: string) => {
    console.log(`Downloading ${type}`)
  }

  return (
    <div className="agent-dashboard">
      <AppSidebar/>

      <main className="agent-main">
        <AgentHeader 
          title="Downloadables" 
          subtitle="Download resources and documents." 
        />

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
