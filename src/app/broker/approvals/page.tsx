'use client'

import { useState } from 'react'
import AppSidebar from '../../../components/common/AppSidebar'
import {
  FiBell,
  FiPlus,
  FiChevronDown,
  FiFile,
  FiCheck,
  FiAlertTriangle,
  FiSettings,
} from 'react-icons/fi'
import './page.css'

interface Applicant {
  id: number
  name: string
  requestedRole: 'Agent' | 'Unit Manager'
  assignedManager: string | null
  profileCompletion: string
  designTheme: string
}

const applicantsData: Applicant[] = [
  {
    id: 1,
    name: 'Beatriz Luna',
    requestedRole: 'Agent',
    assignedManager: 'Gabo Dela Cruz',
    profileCompletion: '85%',
    designTheme: 'Royal Blue',
  },
  {
    id: 2,
    name: 'Kevin Chua',
    requestedRole: 'Unit Manager',
    assignedManager: 'Camille Santos',
    profileCompletion: '100%',
    designTheme: 'Action Orange',
  },
  {
    id: 3,
    name: 'Rina Lopez',
    requestedRole: 'Agent',
    assignedManager: null,
    profileCompletion: '95%',
    designTheme: 'Dark Mode',
  },
  {
    id: 4,
    name: 'Sam Rivera',
    requestedRole: 'Agent',
    assignedManager: 'Gabo Dela Cruz',
    profileCompletion: '40%',
    designTheme: 'Light Mode',
  },
]

export default function AgentApprovalsPage() {
  const [selectedApplicants, setSelectedApplicants] = useState<number[]>([])

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
                        <button className="ba-action-btn preview" title="Preview Profile">
                          <FiFile />
                        </button>
                        <button className="ba-action-btn approve" title="Approve">
                          <FiCheck />
                        </button>
                        <button className="ba-action-btn warn" title="Request Changes">
                          <FiAlertTriangle />
                        </button>
                        <button className="ba-action-btn settings" title="Settings">
                          <FiSettings />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
