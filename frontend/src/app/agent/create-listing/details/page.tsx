'use client'

import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppSidebar from '../../../../components/common/AppSidebar'
import AgentHeader from '../../../../components/agent/AgentHeader'
import { useCreateListing } from '../../../../contexts/CreateListingContext'
import {
  FiChevronDown,
  FiArrowLeft,
  FiArrowRight,
  FiCheck
} from 'react-icons/fi'
import '../../../../pages-old/agent/AgentCreateListingCategory.css'
import '../../../../pages-old/agent/AgentCreateListingDetails.css'

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

export default function AgentCreateListingDetails() {
  const router = useRouter()
  const { data, updateData } = useCreateListing()

  const stepLabels = ['Category', 'Details', 'Location', 'Property Images', 'Pricing', 'Attributes', 'Owner Info', 'Publish']

  const [title, setTitle] = useState(data.title)
  const [description, setDescription] = useState(data.description)
  const [bedrooms, setBedrooms] = useState<number>(data.bedrooms)
  const [bathrooms, setBathrooms] = useState<number>(data.bathrooms)
  const [garage, setGarage] = useState<number>(data.garage)
  const [floorArea, setFloorArea] = useState<number>(data.floorArea)
  const [floorUnit, setFloorUnit] = useState<'Square Meters' | 'Square Feet'>(data.floorUnit)
  const [lotArea, setLotArea] = useState<number>(data.lotArea)

  useEffect(() => {
    setTitle(data.title)
    setDescription(data.description)
    setBedrooms(data.bedrooms)
    setBathrooms(data.bathrooms)
    setGarage(data.garage)
    setFloorArea(data.floorArea)
    setFloorUnit(data.floorUnit)
    setLotArea(data.lotArea)
  }, [data])

  return (
    <div className="agent-dashboard">
      <AppSidebar/>
     

      <main className="agent-main">
        <AgentHeader 
          title="Create Listing" 
          subtitle="Add property details." 
        />

        <div className="aclc-breadcrumb">
          <span className="aclc-breadcrumb-strong">Create Listing</span>
          <span className="aclc-breadcrumb-sep">&gt;</span>
          <span className="aclc-breadcrumb-muted">Details</span>
        </div>

        <div className="section-card aclc-stepper-card">
          <div className="aclc-stepper-left">
            <ProgressRing percent={20} />
            <div className="aclc-stepper-left-text">
              <div className="aclc-stepper-left-title">Completion Status</div>
            </div>
          </div>

          <div className="aclc-steps">
            {stepLabels.map((label, idx) => {
              const step = idx + 1
              const isActive = step === 2
              const isDone = step < 2
              return (
                <div className="aclc-step" key={label}>
                  <div className="aclc-step-top">
                    <div className={`aclc-step-circle ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                      {isDone ? <FiCheck /> : step}
                    </div>
                    {step !== stepLabels.length && (
                      <div className={`aclc-step-line ${step < 2 ? 'done' : ''}`} />
                    )}
                  </div>
                  <div className={`aclc-step-label ${isActive ? 'active' : ''}`}>{label}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="section-card aclc-form-card">
          <h2 className="aclc-form-title">Property Details</h2>

          <label className="aclc-label" htmlFor="propertyTitle">
            Property Title
          </label>
          <input
            id="propertyTitle"
            className="acld-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your property"
          />

          <label className="aclc-label" htmlFor="propertyDescription">
            Property Description
          </label>
          <div className="acld-editor">
            <div className="acld-editor-toolbar" aria-hidden="true">
              <button className="acld-tool-btn" type="button">
                B
              </button>
              <button className="acld-tool-btn" type="button">
                I
              </button>
              <button className="acld-tool-btn" type="button">
                U
              </button>
              <button className="acld-tool-btn" type="button">
                S
              </button>
              <button className="acld-tool-btn" type="button">
                •
              </button>
              <button className="acld-tool-btn" type="button">
                1.
              </button>
              <button className="acld-tool-btn" type="button">
                ↺
              </button>
              <button className="acld-tool-btn" type="button">
                ↻
              </button>
              <button className="acld-tool-btn" type="button">
                ⤢
              </button>
            </div>
            <textarea
              id="propertyDescription"
              className="acld-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your property in detail..."
              rows={7}
            />
          </div>

          <div className="acld-grid-3">
            <div>
              <label className="aclc-label" htmlFor="bedrooms">
                Bedrooms
              </label>
              <input
                id="bedrooms"
                className="acld-input"
                type="number"
                min={0}
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="aclc-label" htmlFor="bathrooms">
                Bathrooms
              </label>
              <input
                id="bathrooms"
                className="acld-input"
                type="number"
                min={0}
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="aclc-label" htmlFor="garage">
                Garage
              </label>
              <input
                id="garage"
                className="acld-input"
                type="number"
                min={0}
                value={garage}
                onChange={(e) => setGarage(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="acld-grid-2">
            <div>
              <label className="aclc-label" htmlFor="floorArea">
                Floor Area
              </label>
              <div className="acld-split">
                <input
                  id="floorArea"
                  className="acld-input acld-split-left"
                  type="number"
                  min={0}
                  value={floorArea}
                  onChange={(e) => setFloorArea(Number(e.target.value))}
                />
                <div className="aclc-select-wrap acld-split-right">
                  <select
                    className="aclc-select acld-select-tight"
                    value={floorUnit}
                    onChange={(e) => setFloorUnit(e.target.value as 'Square Meters' | 'Square Feet')}
                  >
                    <option value="Square Meters">Square Meters</option>
                    <option value="Square Feet">Square Feet</option>
                  </select>
                  <FiChevronDown className="aclc-select-caret" />
                </div>
              </div>
            </div>
            <div>
              <label className="aclc-label" htmlFor="lotArea">
                Lot Area
              </label>
              <input
                id="lotArea"
                className="acld-input"
                type="number"
                min={0}
                value={lotArea}
                onChange={(e) => setLotArea(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="acld-footer-actions">
            <button className="acld-prev-btn" onClick={() => router.push('/agent/create-listing/category')} type="button">
              <FiArrowLeft />
              <span>Previous</span>
            </button>

            <button
              className="aclc-next-btn"
              onClick={() => {
                updateData({
                  title,
                  description,
                  bedrooms,
                  bathrooms,
                  garage,
                  floorArea,
                  floorUnit,
                  lotArea,
                })
                router.push('/agent/create-listing/location')
              }}
              type="button"
            >
              <span>Next</span>
              <FiArrowRight />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

