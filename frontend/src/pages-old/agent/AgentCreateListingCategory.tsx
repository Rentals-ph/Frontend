import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AgentSidebar from '../../components/agent/AgentSidebar'
import AgentHeader from '../../components/agent/AgentHeader'
import {
  FiChevronDown,
  FiArrowRight
} from 'react-icons/fi'
import './AgentDashboard.css'
import './AgentCreateListingCategory.css'

function ProgressRing({ percent }: { percent: number }) {
  const { radius, stroke, normalizedRadius, circumference, strokeDashoffset } = useMemo(() => {
    const r = 26
    const s = 6
    const nr = r - s / 2
    const c = nr * 2 * Math.PI
    const offset = c - (percent / 100) * c
    return {
      radius: r,
      stroke: s,
      normalizedRadius: nr,
      circumference: c,
      strokeDashoffset: offset
    }
  }, [percent])

  return (
    <div className="aclc-progress">
      <svg height={radius * 2} width={radius * 2} className="aclc-progress-svg">
        <circle
          stroke="#E5E7EB"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#2563EB"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="aclc-progress-ring"
        />
      </svg>
      <div className="aclc-progress-text">{percent}%</div>
    </div>
  )
}

export default function AgentCreateListingCategory() {
  const navigate = useNavigate()
  const [category, setCategory] = useState('')

  const categories = useMemo(
    () => [
      'Apartment / Condo',
      'House',
      'Townhouse',
      'Studio',
      'Bedspace',
      'Commercial',
      'Office',
      'Warehouse'
    ],
    []
  )

  const stepLabels = ['Category', 'Details', 'Location', 'Property Images', 'Pricing', 'Attributes', 'Owner Info', 'Publish']

  return (
    <div className="agent-dashboard">
      <AgentSidebar />

      <main className="agent-main">
        <AgentHeader 
          title="Create Listing" 
          subtitle="Add a new property to your portfolio." 
        />

        <div className="aclc-breadcrumb">
          <span className="aclc-breadcrumb-strong">Create Listing</span>
          <span className="aclc-breadcrumb-sep">&gt;</span>
          <span className="aclc-breadcrumb-muted">Category</span>
        </div>

        <div className="section-card aclc-stepper-card">
          <div className="aclc-stepper-left">
            <ProgressRing percent={10} />
            <div className="aclc-stepper-left-text">
              <div className="aclc-stepper-left-title">Completion Status</div>
            </div>
          </div>

          <div className="aclc-steps">
            {stepLabels.map((label, idx) => {
              const step = idx + 1
              const isActive = step === 1
              const isDone = step < 1
              return (
                <div className="aclc-step" key={label}>
                  <div className="aclc-step-top">
                    <div className={`aclc-step-circle ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                      {step}
                    </div>
                    {step !== stepLabels.length && <div className={`aclc-step-line ${step < 1 ? 'done' : ''}`} />}
                  </div>
                  <div className={`aclc-step-label ${isActive ? 'active' : ''}`}>{label}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="section-card aclc-form-card">
          <h2 className="aclc-form-title">Property Category</h2>

          <label className="aclc-label" htmlFor="propertyCategory">
            Property Category
          </label>

          <div className="aclc-select-wrap">
            <select
              id="propertyCategory"
              className="aclc-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" disabled>
                Select a property category
              </option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <FiChevronDown className="aclc-select-caret" />
          </div>

          <button
            className="aclc-next-btn"
            disabled={!category}
            onClick={() => navigate('/agent/create-listing/details')}
            type="button"
          >
            <span>Next</span>
            <FiArrowRight />
          </button>
        </div>
      </main>
    </div>
  )
}


