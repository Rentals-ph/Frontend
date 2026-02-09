'use client'

import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppSidebar from '../../../../components/common/AppSidebar'
import { useCreateListing } from '../../../../contexts/CreateListingContext'
import {
  FiBell,
  FiPlus,
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiDollarSign
} from 'react-icons/fi'
import '../../broker-shared.css'
import '../../../agent/create-listing/AgentCreateListingCategory.css'
import '../../../agent/create-listing/pricing/page.css'

function ProgressRing({ percent }: { percent: number }) {
  const { radius, stroke, normalizedRadius, circumference, strokeDashoffset } = useMemo(() => {
    const r = 26; const s = 6; const nr = r - s / 2; const c = nr * 2 * Math.PI; const offset = c - (percent / 100) * c
    return { radius: r, stroke: s, normalizedRadius: nr, circumference: c, strokeDashoffset: offset }
  }, [percent])
  return (
    <div className="aclc-progress">
      <svg height={radius * 2} width={radius * 2} className="aclc-progress-svg">
        <circle stroke="#E5E7EB" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
        <circle stroke="#2563EB" fill="transparent" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${circumference} ${circumference}`} style={{ strokeDashoffset }} r={normalizedRadius} cx={radius} cy={radius} className="aclc-progress-ring" />
      </svg>
      <div className="aclc-progress-text">{percent}%</div>
    </div>
  )
}

export default function BrokerCreateListingPricing() {
  const router = useRouter()
  const { data, updateData } = useCreateListing()
  const [price, setPrice] = useState(data.price)
  const [priceType, setPriceType] = useState<'Monthly' | 'Weekly' | 'Daily' | 'Yearly'>(data.priceType)

  useEffect(() => {
    setPrice(data.price)
    setPriceType(data.priceType)
  }, [data])

  const stepLabels = [
    'Basic Information',
    'Visuals & Features',
    'Pricing',
    'Owner Info & Review'
  ]

  return (
    <div className="broker-dashboard">
      <AppSidebar />
      <main className="broker-main">
        <header className="broker-header">
          <div className="broker-header-left">
            <h1>Create Listing</h1>
            <p>Set property pricing.</p>
          </div>
          <div className="broker-header-right">
            <button className="broker-notification-btn"><FiBell /></button>
            <a href="/broker/create-listing" className="broker-add-listing-btn"><FiPlus /> Add Listing</a>
          </div>
        </header>

        <div className="aclc-breadcrumb">
          <span className="aclc-breadcrumb-strong">Create Listing</span>
          <span className="aclc-breadcrumb-sep">&gt;</span>
          <span className="aclc-breadcrumb-muted">Pricing</span>
        </div>

        <div className="section-card aclc-stepper-card">
          <div className="aclc-stepper-left">
            <ProgressRing percent={75} />
            <div className="aclc-stepper-left-text"><div className="aclc-stepper-left-title">Completion Status</div></div>
          </div>
          <div className="aclc-steps">
            {stepLabels.map((label, idx) => {
              const step = idx + 1; const isActive = step === 3; const isDone = step < 3
              return (
                <div className="aclc-step" key={label}>
                  <div className="aclc-step-top">
                    <div className={`aclc-step-circle ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>{isDone ? <FiCheck /> : step}</div>
                    {step !== stepLabels.length && <div className={`aclc-step-line ${step < 3 ? 'done' : ''}`} />}
                  </div>
                  <div className={`aclc-step-label ${isActive ? 'active' : ''}`}>{label}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="section-card aclc-form-card">
          <h2 className="aclc-form-title">Pricing</h2>

          <div className="acpr-row">
            <div className="acpr-column">
              <div className="acpr-column-label">Price</div>
              <div className="acpr-form-group">
                <div className="acpr-price-input-wrapper">
                  <div className="acpr-price-icon"><FiDollarSign /></div>
                  <input id="price" type="text" className="acpr-price-input" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="acpr-column">
              <div className="acpr-column-label">Price Type</div>
              <div className="acpr-form-group">
                <div className="aclc-select-wrap">
                  <select id="price-type" className="aclc-select" value={priceType} onChange={(e) => setPriceType(e.target.value as 'Monthly' | 'Weekly' | 'Daily' | 'Yearly')}>
                    <option value="Monthly">Monthly</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Daily">Daily</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                  <div className="aclc-select-caret">▼</div>
                </div>
              </div>
            </div>
          </div>

          <div className="acpr-footer-actions">
            <button className="acld-prev-btn" onClick={() => router.push('/broker/create-listing/visuals-features')} type="button">
              <FiArrowLeft /><span>Previous</span>
            </button>
            <button className="aclc-next-btn" onClick={() => { updateData({ price, priceType }); router.push('/broker/create-listing/owner-review') }} type="button">
              <span>Next: Owner Info & Review</span><FiArrowRight />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
