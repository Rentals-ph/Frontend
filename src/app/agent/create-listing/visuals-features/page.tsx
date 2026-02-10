'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import AppSidebar from '../../../../components/common/AppSidebar'
import AgentHeader from '../../../../components/agent/AgentHeader'
import { useCreateListing } from '../../../../contexts/CreateListingContext'
import { createThumbnail } from '../../../../utils/imageCompression'

import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiUploadCloud,
  FiPlayCircle
} from 'react-icons/fi'
import '../AgentCreateListingCategory.css'
import '../property-images/page.css'
import '../attributes/page.css'

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

export default function AgentCreateListingVisualsFeatures() {
  const router = useRouter()
  const { data, updateData } = useCreateListing()
  
  // Streamlined 4-step flow
  const stepLabels = [
    'Basic Information',
    'Visuals & Features',
    'Owner Info & Review'
  ]

  // Images state
  const [images, setImages] = useState<File[]>(data.images)
  const [thumbnails, setThumbnails] = useState<string[]>([])
  const [videoUrl, setVideoUrl] = useState(data.videoUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Attributes state
  const [amenities, setAmenities] = useState<string[]>(data.amenities)

  const amenitiesList = [
    'Air Conditioning',
    'Breakfast',
    'Kitchen',
    'Parking',
    'Pool',
    'Wi-Fi Internet',
    'Pet-Friendly',
    'Gym / Fitness Center',
    'Security',
    'Elevator',
    'Balcony',
    'Garden',
    'Laundry',
    'Dishwasher',
    'Microwave',
    'Refrigerator',
    'TV / Cable',
    'Hot Water',
    'Furnished',
    'Near Public Transport',
    'Near Schools',
    'Near Shopping',
    'Near Hospitals',
    'Water Supply',
    'Electricity',
    'Internet Ready',
    '24/7 Security',
    'CCTV',
    'Fire Safety',
    'Generator'
  ]

  const furnishingOptions = ['Fully Furnished', 'Semi Furnished', 'Unfurnished']

  useEffect(() => {
    setImages(data.images)
    setVideoUrl(data.videoUrl)
    setAmenities(data.amenities)
    
    // Generate thumbnails
    const generateThumbnails = async () => {
      const thumbnailPromises = data.images.map(file => 
        createThumbnail(file, 200).catch(() => URL.createObjectURL(file))
      )
      const newThumbnails = await Promise.all(thumbnailPromises)
      setThumbnails(newThumbnails)
    }
    
    if (data.images.length > 0) {
      generateThumbnails()
    } else {
      setThumbnails([])
    }
  }, [data])
  
  // Cleanup object URLs
  useEffect(() => {
    return () => {
      thumbnails.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url)
        }
      })
    }
  }, [thumbnails])

  const handleDrop: React.DragEventHandler<HTMLDivElement> = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    const files = Array.from(event.dataTransfer.files)
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    setImages(prev => [...prev, ...imageFiles])
    
    const newThumbnails = await Promise.all(
      imageFiles.map(file => createThumbnail(file, 200).catch(() => URL.createObjectURL(file)))
    )
    setThumbnails(prev => [...prev, ...newThumbnails])
  }

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files)
      const imageFiles = files.filter(file => file.type.startsWith('image/'))
      setImages(prev => [...prev, ...imageFiles])
      
      const newThumbnails = await Promise.all(
        imageFiles.map(file => createThumbnail(file, 200).catch(() => URL.createObjectURL(file)))
      )
      setThumbnails(prev => [...prev, ...newThumbnails])
    }
  }

  const handleRemoveImage = (index: number) => {
    if (thumbnails[index] && thumbnails[index].startsWith('blob:')) {
      URL.revokeObjectURL(thumbnails[index])
    }
    setImages(prev => prev.filter((_, i) => i !== index))
    setThumbnails(prev => prev.filter((_, i) => i !== index))
  }

  const handleAmenityChange = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    )
  }

  return (
    <div className="agent-dashboard">
      <AppSidebar/>
      <main className="agent-main">
        <AgentHeader 
          title="Create Listing" 
          subtitle="Add visuals and features." 
        />

        <div className="aclc-breadcrumb">
          <span className="aclc-breadcrumb-strong">Create Listing</span>
          <span className="aclc-breadcrumb-sep">&gt;</span>
          <span className="aclc-breadcrumb-muted">Visuals & Features</span>
        </div>

        <div className="section-card aclc-stepper-card">
          <div className="aclc-stepper-left">
            <ProgressRing percent={50} />
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
          <h2 className="aclc-form-title">Property Visuals & Features</h2>

          {/* Images Section */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: '#111827' }}>Property Images</h3>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              multiple
              style={{ display: 'none' }}
            />
            <div
              className="acpi-dropzone"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
            >
              <FiUploadCloud className="acpi-dropzone-icon" />
              <p className="acpi-dropzone-title">Drop files here or click to upload</p>
              <p className="acpi-dropzone-text">
                Upload high-quality images of your property (max 10mb each)
              </p>
            </div>
            
            {images.length > 0 && (
              <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {images.map((image, index) => (
                  <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                    <img
                      src={thumbnails[index] || URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                      loading="lazy"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: 'red',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        lineHeight: '1',
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="acpi-video-section" style={{ marginTop: '1.5rem' }}>
              <div className="acpi-video-label-row">
                <span className="acpi-video-label">Video Link (Optional)</span>
              </div>
              <div className="acpi-video-input-row">
                <div className="acpi-video-icon-wrap">
                  <FiPlayCircle className="acpi-video-icon" />
                </div>
                <input
                  className="acpi-video-input"
                  placeholder="Enter Youtube/video link"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Attributes Section */}
          <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: '#111827' }}>Features & Amenities</h3>
            
            <div className="acat-section">
              <h3 className="acat-section-title">Amenities</h3>
              <div className="acat-checkbox-grid">
                {amenitiesList.map((amenity) => (
                  <label key={amenity} className="acat-checkbox-label">
                    <input
                      type="checkbox"
                      className="acat-checkbox"
                      checked={amenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                    />
                    <span className="acat-checkbox-text">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
            <button
              className="acld-prev-btn"
              onClick={() => router.push('/agent/create-listing/basic-info')}
              type="button"
            >
              <FiArrowLeft />
              <span>Previous</span>
            </button>
            <button
              className="aclc-next-btn"
              onClick={() => {
                updateData({ images, videoUrl, amenities })
                router.push('/agent/create-listing/owner-review')
              }}
              type="button"
            >
              <span>Next: Owner Info & Review</span>
              <FiArrowRight />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

