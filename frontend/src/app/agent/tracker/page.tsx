'use client'

import AppSidebar from '../../../components/common/AppSidebar'
import AgentHeader from '../../../components/agent/AgentHeader'
import {
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiHelpCircle
} from 'react-icons/fi'
import '../../../pages-old/agent/AgentRentalTracker.css'

export default function AgentRentalTracker() {
  return (
    <div className="agent-rental-tracker agent-dashboard">
      <AppSidebar/>

      <main className="agent-main">
        <AgentHeader 
          title="Rental Tracker" 
          subtitle="Track and analyze your rental property performance." 
        />

        <div className="art-page">
          <h2 className="art-title">Rental Tracker</h2>

          <section className="art-card">
            <div className="art-card-topbar">
              <div className="art-card-topbar-left">
                <span className="art-card-topbar-title">Rental Due Calendar</span>
              </div>
              <button className="art-primary-btn" type="button">
                Add Rental Dues
              </button>
            </div>

            <div className="art-calendar">
              <div className="art-calendar-header">
                <div className="art-calendar-month">January 2026</div>
                <div className="art-calendar-actions">
                  <button className="art-today-btn" type="button">
                    Today
                  </button>
                  <button className="art-icon-btn muted" type="button" aria-label="Previous month">
                    <FiChevronLeft />
                  </button>
                  <button className="art-icon-btn primary" type="button" aria-label="Next month">
                    <FiChevronRight />
                  </button>
                </div>
              </div>

              <div className="art-calendar-body" aria-label="Calendar placeholder" />
            </div>
          </section>

          <section className="art-card art-form-card">
            <h3 className="art-section-title">Add/Edit Rental Due</h3>

            <div className="art-form">
              <div className="art-form-row">
                <label className="art-field art-field-full">
                  <span className="art-label">Select Property By Title</span>
                  <div className="art-select">
                    <select defaultValue="">
                      <option value="" disabled>
                        Select...
                      </option>
                      <option value="azure">Azure Residences - 2BR Corner Suite</option>
                      <option value="bgc">BGC Studio - High Floor</option>
                    </select>
                  </div>
                </label>
              </div>

              <div className="art-form-row art-form-row-3">
                <label className="art-field">
                  <span className="art-label">Firstname</span>
                  <input className="art-input" placeholder="" />
                </label>
                <label className="art-field">
                  <span className="art-label">Lastname</span>
                  <input className="art-input" placeholder="" />
                </label>
                <label className="art-field">
                  <span className="art-label">Tenant Email</span>
                  <input className="art-input" placeholder="" />
                </label>
              </div>

              <div className="art-form-row art-form-row-3">
                <label className="art-field">
                  <span className="art-label art-label-inline">
                    Rent Amount
                    <span className="art-help" title="Enter monthly rent amount">
                      <FiHelpCircle />
                    </span>
                  </span>
                  <input className="art-input" placeholder="" />
                </label>
                <label className="art-field">
                  <span className="art-label">Due Date</span>
                  <div className="art-date">
                    <input className="art-input" placeholder="mm/dd/yyyy" />
                  </div>
                </label>
                <label className="art-field">
                  <span className="art-label">Duration (Months)</span>
                  <div className="art-select">
                    <select defaultValue="1">
                      <option value="1">1 month</option>
                      <option value="2">2 months</option>
                      <option value="3">3 months</option>
                      <option value="6">6 months</option>
                      <option value="12">12 months</option>
                    </select>
                  </div>
                </label>
              </div>

              <div className="art-form-row">
                <label className="art-field art-field-full">
                  <span className="art-label">Notes</span>
                  <textarea className="art-textarea" placeholder="Your message here..." rows={5} />
                </label>
              </div>

              <div className="art-actions">
                <button className="art-save-btn" type="button">
                  Save
                </button>
              </div>
            </div>
          </section>

          <section className="art-card">
            <div className="art-history-header">
              <h3 className="art-section-title">Rental Payment History</h3>
              <div className="art-search">
                <FiSearch className="art-search-icon" />
                <input
                  className="art-search-input"
                  placeholder="Search by tenant, unit, method, or reference..."
                />
              </div>
            </div>

            <div className="art-table">
              <div className="art-table-head">
                <div>Tenant</div>
                <div>Propery Name</div>
                <div>Payment Paid</div>
                <div className="right">Actions</div>
              </div>
              <div className="art-table-empty">No Payment History Found.</div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
