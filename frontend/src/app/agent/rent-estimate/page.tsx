'use client'

import { useMemo, useState } from 'react'
import AppSidebar from '../../../components/common/AppSidebar'
import AgentHeader from '../../../components/agent/AgentHeader'
import {
  FiMapPin,
  FiChevronDown
} from 'react-icons/fi'
import '../../../pages-old/agent/AgentDashboard.css'
import '../../../pages-old/agent/AgentRentEstimate.css'

export default function AgentRentEstimate() {
  const [propertyType, setPropertyType] = useState('')
  const [location, setLocation] = useState('')
  const [keyword, setKeyword] = useState('')
  const [estimate, setEstimate] = useState<string | null>(null)

  const propertyTypeOptions = useMemo(
    () => [
      { value: '', label: 'Select Property Type' },
      { value: 'condo', label: 'Condominium' },
      { value: 'apartment', label: 'Apartment' },
      { value: 'house', label: 'House' },
      { value: 'townhouse', label: 'Townhouse' },
      { value: 'commercial', label: 'Commercial Space' }
    ],
    []
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const base = propertyType ? 28000 : 0
    const bonus = location.trim() ? 4000 : 0
    const kw = keyword.trim() ? 2000 : 0
    const computed = base + bonus + kw
    setEstimate(computed ? `P${computed.toLocaleString()} /month` : null)
  }

  return (
    <div className="agent-dashboard agent-rent-estimate-page">
      <AppSidebar/>

      <main className="agent-main">
        <AgentHeader 
          title="Rent Estimate" 
          subtitle="Calculate estimated rental value for your properties." 
        />

        <section className="agent-rent-estimate-section">
          <div className="agent-rent-estimate-heading">
            <h2>Rent Estimate</h2>
            <p>Get an instant rental price estimate for your property.</p>
          </div>

          <div className="agent-rent-estimate-card">
            <div className="agent-rent-estimate-card-header">
              <h3>Get Rental Price Estimates Instantly</h3>
            </div>

            <form className="agent-rent-estimate-form" onSubmit={handleSubmit}>
              <div className="agent-re-field">
                <label htmlFor="propertyType">Select Property Type</label>
                <div className="agent-re-select-wrap">
                  <select
                    id="propertyType"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="agent-re-select"
                  >
                    {propertyTypeOptions.map((opt) => (
                      <option key={opt.value || 'empty'} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="agent-re-select-icon" />
                </div>
              </div>

              <div className="agent-re-field">
                <label htmlFor="location">Search Location</label>
                <div className="agent-re-input-wrap">
                  <FiMapPin className="agent-re-input-icon" />
                  <input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="agent-re-input"
                    placeholder="Select Property Type"
                  />
                </div>
              </div>

              <div className="agent-re-field">
                <label htmlFor="keyword">Custom Keyword (Optional)</label>
                <input
                  id="keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="agent-re-input"
                  placeholder="e.g., Property Name, near IT Park, with sea view"
                />
              </div>

              <button type="submit" className="agent-re-submit">
                Get Estimate
              </button>

              {estimate && (
                <div className="agent-re-result" role="status" aria-live="polite">
                  <span className="agent-re-result-label">Estimated Rent</span>
                  <span className="agent-re-result-value">{estimate}</span>
                </div>
              )}

              <div className="agent-re-note">
                <p>
                  <strong>Please take note:</strong> The estimated price should still be aligned with the
                  prices of neighboring properties.
                </p>
                <p>Kindly consider and listen to the current market trends when setting your price.</p>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}
