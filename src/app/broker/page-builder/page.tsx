'use client'

import { useState, useRef } from 'react'
import AppSidebar from '../../../components/common/AppSidebar'
import { ASSETS } from '@/utils/assets'
import { 
  FiBell,
  FiPlus,
  FiSettings,
  FiUpload,
  FiMail,
  FiPhone,
  FiMessageCircle,
  FiGlobe,
  FiStar,
  FiHeart,
  FiLayout,
  FiEdit3,
  FiEye,
  FiEyeOff,
  FiChevronUp,
  FiChevronDown,
  FiTrash2,
  FiMove,
  FiCheck,
  FiX
} from 'react-icons/fi'
import '../../agent/page-builder/page.css'
import '../broker-shared.css'

export default function BrokerPageBuilder() {
  const [selectedTheme, setSelectedTheme] = useState('white')
  const [showBio, setShowBio] = useState(true)
  const [showContactNumber, setShowContactNumber] = useState(true)
  const [showExperienceStats, setShowExperienceStats] = useState(false)
  const [showFeaturedListings, setShowFeaturedListings] = useState(true)
  const [showTestimonials, setShowTestimonials] = useState(true)
  const [bio, setBio] = useState('This is my bio...')
  const [activeTab, setActiveTab] = useState('profile')
  const [leftSidebarTab, setLeftSidebarTab] = useState('content')
  
  // Profile image state
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const profileImageInputRef = useRef<HTMLInputElement>(null)
  
  // Contact information states
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    message: '',
    website: ''
  })
  const [showContactModal, setShowContactModal] = useState(false)
  const [editingContactType, setEditingContactType] = useState<string | null>(null)
  
  // Experience stats state
  const [experienceStats, setExperienceStats] = useState([
    { label: 'Years of Experience', value: '5' },
    { label: 'Properties Sold', value: '120' },
    { label: 'Happy Clients', value: '98' }
  ])
  const [showExperienceModal, setShowExperienceModal] = useState(false)
  const [editingStatIndex, setEditingStatIndex] = useState<number | null>(null)
  
  // Featured listings edit state
  const [showFeaturedListingsModal, setShowFeaturedListingsModal] = useState(false)
  const [editingListingIndex, setEditingListingIndex] = useState<number | null>(null)
  
  // Testimonials edit state
  const [showTestimonialsModal, setShowTestimonialsModal] = useState(false)
  const [editingTestimonialIndex, setEditingTestimonialIndex] = useState<number | null>(null)
  
  // File input refs
  const heroImageInputRef = useRef<HTMLInputElement>(null)
  const profileCardImageInputRef = useRef<HTMLInputElement>(null)
  const propertyImageInputRef = useRef<HTMLInputElement>(null)
  
  // Drag and drop state
  const [draggedSectionIndex, setDraggedSectionIndex] = useState<number | null>(null)
  
  // Property mode states
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop')
  const [mainHeading, setMainHeading] = useState('Azure Residences')
  const [tagline, setTagline] = useState('Luxury living redefined with stunning city views.')
  const [overallDarkness, setOverallDarkness] = useState(30)
  const [propertyDescription, setPropertyDescription] = useState('Experience luxury living in the heart of the city. This stunning loft features floor-to-ceiling windows, premium appliances, and breathtaking views.')
  const [propertyImages, setPropertyImages] = useState([
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop'
  ])
  const [profileCardName, setProfileCardName] = useState('John Anderson')
  const [profileCardRole, setProfileCardRole] = useState('Property Broker')
  const [profileCardBio, setProfileCardBio] = useState('Dedicated to bridging the gap between luxury and comfort, Angelo J. De Leon specializes in finding the perfect residential townhouses for families across Quezon City and Pasig.')
  const [profileCardImage, setProfileCardImage] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop')
  
  // Additional property preview states
  const [propertyPrice, setPropertyPrice] = useState('P1,200')
  const [contactPhone, setContactPhone] = useState('+63 9988776655')
  const [contactEmail, setContactEmail] = useState('john.anderson12@gmail.com')
  const [contactFormName, setContactFormName] = useState('')
  const [contactFormEmail, setContactFormEmail] = useState('')
  const [contactFormMessage, setContactFormMessage] = useState('')
  
  // Section visibility states
  const [sectionVisibility, setSectionVisibility] = useState({
    hero: false,
    propertyDescription: true,
    propertyImages: true,
    profileCard: true
  })
  
  // Layout sections order
  const [layoutSections, setLayoutSections] = useState([
    { id: 'hero', name: 'Hero', visible: false },
    { id: 'propertyDescription', name: 'Property Description', visible: true },
    { id: 'propertyImages', name: 'Property Images', visible: true },
    { id: 'profileCard', name: 'Profile Card', visible: true }
  ])
  
  // Design states
  const [selectedBrandColor, setSelectedBrandColor] = useState('white')
  const [selectedCornerRadius, setSelectedCornerRadius] = useState('soft')
  
  const brandColors = [
    { id: 'white', color: '#FFFFFF' },
    { id: 'dark', color: '#1F2937' },
    { id: 'orange', color: '#F97316' },
    { id: 'blue', color: '#3B82F6' }
  ]
  
  const cornerRadiusOptions = [
    { id: 'sharp', name: 'Sharp' },
    { id: 'regular', name: 'Regular' },
    { id: 'soft', name: 'Soft' }
  ]
  
  const toggleSectionVisibility = (sectionId: string) => {
    setSectionVisibility(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId as keyof typeof prev]
    }))
    setLayoutSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, visible: !section.visible }
        : section
    ))
  }
  
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...layoutSections]
    if (direction === 'up' && index > 0) {
      [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]]
      setLayoutSections(newSections)
    } else if (direction === 'down' && index < newSections.length - 1) {
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]]
      setLayoutSections(newSections)
    }
  }
  
  const deleteSection = (sectionId: string) => {
    setLayoutSections(prev => prev.filter(section => section.id !== sectionId))
    setSectionVisibility(prev => {
      const newVisibility = { ...prev }
      delete newVisibility[sectionId as keyof typeof prev]
      return newVisibility
    })
  }
  
  // File upload handlers
  const handleFileUpload = (file: File, type: 'profile' | 'hero' | 'profileCard' | 'property') => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      switch (type) {
        case 'profile':
          setProfileImage(result)
          break
        case 'hero':
          setHeroImage(result)
          break
        case 'profileCard':
          setProfileCardImage(result)
          break
        case 'property':
          setPropertyImages(prev => [...prev, result])
          break
      }
    }
    reader.readAsDataURL(file)
  }
  
  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'hero' | 'profileCard' | 'property') => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file, type)
    }
  }
  
  // Contact management
  const handleContactIconClick = (type: 'email' | 'phone' | 'message' | 'website') => {
    setEditingContactType(type)
    setShowContactModal(true)
  }
  
  const handleContactSave = () => {
    setShowContactModal(false)
    setEditingContactType(null)
  }
  
  // Experience stats management
  const handleAddExperienceStat = () => {
    setEditingStatIndex(null)
    setShowExperienceModal(true)
  }
  
  const handleSaveExperienceStat = (label: string, value: string) => {
    if (editingStatIndex !== null) {
      const updated = [...experienceStats]
      updated[editingStatIndex] = { label, value }
      setExperienceStats(updated)
    } else {
      setExperienceStats([...experienceStats, { label, value }])
    }
    setShowExperienceModal(false)
    setEditingStatIndex(null)
  }
  
  const handleDeleteExperienceStat = (index: number) => {
    setExperienceStats(prev => prev.filter((_, i) => i !== index))
  }
  
  // Featured listings management
  const handleEditFeaturedListing = (index: number) => {
    setEditingListingIndex(index)
    setShowFeaturedListingsModal(true)
  }
  
  const handleSaveFeaturedListing = (listing: typeof featuredListings[0]) => {
    setShowFeaturedListingsModal(false)
    setEditingListingIndex(null)
  }
  
  // Testimonials management
  const handleEditTestimonial = (index: number) => {
    setEditingTestimonialIndex(index)
    setShowTestimonialsModal(true)
  }
  
  const handleSaveTestimonial = (testimonial: typeof testimonials[0]) => {
    setShowTestimonialsModal(false)
    setEditingTestimonialIndex(null)
  }
  
  // Remove property image
  const handleRemovePropertyImage = (index: number) => {
    setPropertyImages(prev => prev.filter((_, i) => i !== index))
  }
  
  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedSectionIndex(index)
  }
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }
  
  const handleDrop = (targetIndex: number) => {
    if (draggedSectionIndex === null) return
    
    const newSections = [...layoutSections]
    const [draggedItem] = newSections.splice(draggedSectionIndex, 1)
    newSections.splice(targetIndex, 0, draggedItem)
    setLayoutSections(newSections)
    setDraggedSectionIndex(null)
  }
  
  // Save changes handler
  const handleSaveChanges = () => {
    console.log('Saving changes...', {
      selectedTheme,
      bio,
      showBio,
      showContactNumber,
      showExperienceStats,
      experienceStats,
      showFeaturedListings,
      showTestimonials,
      contactInfo,
      profileImage,
      heroImage,
      mainHeading,
      tagline,
      overallDarkness,
      propertyDescription,
      propertyImages,
      propertyPrice,
      contactPhone,
      contactEmail,
      profileCardName,
      profileCardRole,
      profileCardBio,
      profileCardImage,
      sectionVisibility,
      layoutSections,
      selectedBrandColor,
      selectedCornerRadius
    })
    alert('Changes saved successfully!')
  }
  
  // Apply design settings to preview
  const getCornerRadiusClass = () => {
    switch (selectedCornerRadius) {
      case 'sharp': return '0px'
      case 'regular': return '8px'
      case 'soft': return '16px'
      default: return '16px'
    }
  }
  
  const getBrandColorClass = () => {
    return selectedBrandColor
  }

  const themes = [
    { id: 'white', name: 'White', color: '#FFFFFF' },
    { id: 'dark', name: 'Dark', color: '#1F2937' },
    { id: 'orange', name: 'Orange', color: '#F97316' },
    { id: 'blue', name: 'Blue', color: '#3B82F6' }
  ]

  const featuredListings = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
      price: '$1200',
      title: 'Azure Residences - 2BR Corner S...',
      category: 'Commercial Spaces',
      date: 'Sat 05, 2024'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop',
      price: '$1500',
      title: 'Modern Condo in Makati CBD',
      category: 'Residential',
      date: 'Sat 12, 2024'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop',
      price: '$1800',
      title: 'Family House in Quezon City',
      category: 'Residential',
      date: 'Sat 19, 2024'
    }
  ]

  const testimonials = [
    {
      id: 1,
      name: 'Angelo J. De Leon',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      quote: 'Rental.ph is such a wonderful partner for helping me publish my properties online.',
      rating: 5
    },
    {
      id: 2,
      name: 'Maria Santos',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      quote: 'Excellent service and great support throughout the rental process.',
      rating: 5
    }
  ]

  return (
    <div className="broker-dashboard">
      <AppSidebar />

      <main className="broker-main">
        {/* Broker Header */}
        <header className="broker-header">
          <div className="broker-header-left">
            <h1>{activeTab === 'profile' ? 'Page Builder > Profile' : 'Page Builder > Property'}</h1>
            <p>{activeTab === 'profile' ? 'Customize your public profile page' : 'Customize your property page'}</p>
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

        <div className="page-builder-container">
          {/* Left Column - Customization */}
          <div className="page-builder-left">
            {activeTab === 'profile' ? (
              <>
                <div className="customize-section">
                  <div className="customize-header">
                    <div className="customize-icon-wrapper">
                      <FiLayout className="customize-icon" />
                    </div>
                    <div className="customize-content">
                      <h2 className="customize-title">Customize your very own public page</h2>
                      <p className="customize-subtitle">Showcase your public page to anyone.</p>
                    </div>
                  </div>
                </div>

                {/* Themes Section */}
                <div className="builder-section">
                  <h3 className="section-label">Themes</h3>
                  <div className="themes-grid">
                    {themes.map((theme) => (
                      <div key={theme.id} className="theme-item">
                        <button
                          className={`theme-circle ${selectedTheme === theme.id ? 'active' : ''} ${theme.id === 'white' ? 'theme-white' : ''}`}
                          style={{ backgroundColor: theme.color }}
                          onClick={() => setSelectedTheme(theme.id)}
                          aria-label={theme.name}
                        />
                        <span className="theme-name">{theme.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Profile Section */}
                <div className="builder-section">
                  <h3 className="section-label">Profile</h3>
                  <div className="profile-upload-section">
                    <div className="profile-image-preview">
                      <img 
                        src={profileImage || ASSETS.PLACEHOLDER_PROFILE} 
                        alt="Profile"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                      <div className="profile-avatar-fallback">JA</div>
                    </div>
                    <input
                      type="file"
                      ref={profileImageInputRef}
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleImageInputChange(e, 'profile')}
                    />
                    <button 
                      className="upload-button"
                      onClick={() => profileImageInputRef.current?.click()}
                    >
                      <FiUpload className="upload-icon" />
                      Upload Image
                    </button>
                    <textarea
                      className="bio-textarea"
                      placeholder="This is my bio..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>
                </div>

                {/* Information Section */}
                <div className="builder-section">
                  <h3 className="section-label">Information</h3>
                  <div className="toggle-list">
                    <div className="toggle-item">
                      <div className="toggle-label-group">
                        <span className="toggle-label">Show Bio</span>
                        <span 
                          className="toggle-action"
                          onClick={() => {
                            const newBio = prompt('Edit your bio:', bio)
                            if (newBio !== null) setBio(newBio)
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          Edit
                        </span>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={showBio}
                          onChange={(e) => setShowBio(e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="toggle-item">
                      <div className="toggle-label-group">
                        <span className="toggle-label">Contact Number</span>
                        <span 
                          className="toggle-action"
                          onClick={() => handleContactIconClick('phone')}
                          style={{ cursor: 'pointer' }}
                        >
                          Edit
                        </span>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={showContactNumber}
                          onChange={(e) => setShowContactNumber(e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="contact-icons-row">
                      <button 
                        className="contact-icon-btn"
                        onClick={() => handleContactIconClick('email')}
                        title={contactInfo.email || 'Add Email'}
                      >
                        <FiMail />
                        <FiPlus className="icon-plus" />
                      </button>
                      <button 
                        className="contact-icon-btn"
                        onClick={() => handleContactIconClick('phone')}
                        title={contactInfo.phone || 'Add Phone'}
                      >
                        <FiPhone />
                        <FiPlus className="icon-plus" />
                      </button>
                      <button 
                        className="contact-icon-btn"
                        onClick={() => handleContactIconClick('message')}
                        title={contactInfo.message || 'Add Message'}
                      >
                        <FiMessageCircle />
                        <FiPlus className="icon-plus" />
                      </button>
                      <button 
                        className="contact-icon-btn"
                        onClick={() => handleContactIconClick('website')}
                        title={contactInfo.website || 'Add Website'}
                      >
                        <FiGlobe />
                        <FiPlus className="icon-plus" />
                      </button>
                    </div>

                    <div className="toggle-item">
                      <div className="toggle-label-group">
                        <span className="toggle-label">Experience Stats</span>
                        <span 
                          className="toggle-action"
                          onClick={handleAddExperienceStat}
                          style={{ cursor: 'pointer' }}
                        >
                          Add
                        </span>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={showExperienceStats}
                          onChange={(e) => setShowExperienceStats(e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="toggle-item">
                      <div className="toggle-label-group">
                        <span className="toggle-label">Featured Listings</span>
                        <span 
                          className="toggle-action"
                          onClick={() => setShowFeaturedListingsModal(true)}
                          style={{ cursor: 'pointer' }}
                        >
                          Edit
                        </span>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={showFeaturedListings}
                          onChange={(e) => setShowFeaturedListings(e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="toggle-item">
                      <div className="toggle-label-group">
                        <span className="toggle-label">Client Testimonials</span>
                        <span 
                          className="toggle-action"
                          onClick={() => setShowTestimonialsModal(true)}
                          style={{ cursor: 'pointer' }}
                        >
                          Edit
                        </span>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={showTestimonials}
                          onChange={(e) => setShowTestimonials(e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <button className="save-changes-button" onClick={handleSaveChanges}>
                  Save Changes
                </button>
              </>
            ) : (
              <>
                {/* Property Mode Tabs */}
                <div className="property-mode-tabs">
                  <button
                    className={`property-tab ${leftSidebarTab === 'content' ? 'active' : ''}`}
                    onClick={() => setLeftSidebarTab('content')}
                  >
                    Content
                  </button>
                  <button
                    className={`property-tab ${leftSidebarTab === 'section' ? 'active' : ''}`}
                    onClick={() => setLeftSidebarTab('section')}
                  >
                    Section
                  </button>
                  <button
                    className={`property-tab ${leftSidebarTab === 'design' ? 'active' : ''}`}
                    onClick={() => setLeftSidebarTab('design')}
                  >
                    Design
                  </button>
                </div>

                {/* Content Tab */}
                {leftSidebarTab === 'content' && (
                  <div className="property-content-tab">
                    {/* Hero Settings */}
                    <div className="property-section">
                      <div className="property-section-header">
                        <h3 className="property-section-title">Hero Settings</h3>
                        <button 
                          className="visibility-toggle"
                          onClick={() => toggleSectionVisibility('hero')}
                          aria-label="Toggle visibility"
                        >
                          {sectionVisibility.hero ? (
                            <FiEye className="visible" />
                          ) : (
                            <FiEyeOff className="hidden" />
                          )}
                        </button>
                      </div>
                      <div className="hero-preview-container">
                        <img src={heroImage} alt="Hero" className="hero-preview-image" />
                        <input
                          type="file"
                          ref={heroImageInputRef}
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => handleImageInputChange(e, 'hero')}
                        />
                        <button 
                          className="upload-custom-photo-btn"
                          onClick={() => heroImageInputRef.current?.click()}
                        >
                          <FiUpload className="upload-icon" />
                          Upload Custom Photo
                        </button>
                      </div>
                      <div className="hero-input-group">
                        <label className="hero-input-label">Main Heading</label>
                        <input
                          type="text"
                          className="hero-input"
                          placeholder="Azure Residences"
                          value={mainHeading}
                          onChange={(e) => setMainHeading(e.target.value)}
                        />
                      </div>
                      <div className="hero-input-group">
                        <label className="hero-input-label">Tagline</label>
                        <input
                          type="text"
                          className="hero-input"
                          placeholder="Luxury Living redefined with..."
                          value={tagline}
                          onChange={(e) => setTagline(e.target.value)}
                        />
                      </div>
                      <div className="hero-input-group">
                        <label className="hero-input-label">Overall Darkness</label>
                        <div className="darkness-slider-container">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={overallDarkness}
                            onChange={(e) => setOverallDarkness(Number(e.target.value))}
                            className="darkness-slider"
                          />
                          <span className="darkness-value">{overallDarkness}%</span>
                        </div>
                      </div>
                      <div className="hero-input-group">
                        <label className="hero-input-label">Price</label>
                        <input
                          type="text"
                          className="hero-input"
                          placeholder="P1,200"
                          value={propertyPrice}
                          onChange={(e) => setPropertyPrice(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Property Description */}
                    <div className="property-section">
                      <div className="property-section-header">
                        <h3 className="property-section-title">Property Description</h3>
                        <button 
                          className="visibility-toggle"
                          onClick={() => toggleSectionVisibility('propertyDescription')}
                          aria-label="Toggle visibility"
                        >
                          {sectionVisibility.propertyDescription ? (
                            <FiEye className="visible" />
                          ) : (
                            <FiEyeOff className="hidden" />
                          )}
                        </button>
                      </div>
                      <textarea
                        className="property-description-textarea"
                        value={propertyDescription}
                        onChange={(e) => setPropertyDescription(e.target.value)}
                        rows={4}
                      />
                    </div>

                    {/* Property Images */}
                    <div className="property-section">
                      <div className="property-section-header">
                        <h3 className="property-section-title">Property Images</h3>
                        <button 
                          className="visibility-toggle"
                          onClick={() => toggleSectionVisibility('propertyImages')}
                          aria-label="Toggle visibility"
                        >
                          {sectionVisibility.propertyImages ? (
                            <FiEye className="visible" />
                          ) : (
                            <FiEyeOff className="hidden" />
                          )}
                        </button>
                      </div>
                      <div className="property-images-grid">
                        {propertyImages.map((image, index) => (
                          <div key={index} className="property-image-item" style={{ position: 'relative' }}>
                            <img src={image} alt={`Property ${index + 1}`} />
                            <button
                              className="property-image-remove"
                              onClick={() => handleRemovePropertyImage(index)}
                              style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                                background: 'rgba(239, 68, 68, 0.9)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px'
                              }}
                              aria-label="Remove image"
                            >
                              <FiX />
                            </button>
                          </div>
                        ))}
                        <input
                          type="file"
                          ref={propertyImageInputRef}
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => handleImageInputChange(e, 'property')}
                        />
                        <button 
                          className="add-image-button"
                          onClick={() => propertyImageInputRef.current?.click()}
                        >
                          <FiPlus className="add-icon" />
                          ADD
                        </button>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="property-section">
                      <div className="property-section-header">
                        <h3 className="property-section-title">Contact Information</h3>
                      </div>
                      <div className="hero-input-group">
                        <label className="hero-input-label">Phone Number</label>
                        <input
                          type="text"
                          className="hero-input"
                          placeholder="+63 9988776655"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                        />
                      </div>
                      <div className="hero-input-group">
                        <label className="hero-input-label">Email Address</label>
                        <input
                          type="email"
                          className="hero-input"
                          placeholder="john.anderson12@gmail.com"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Profile Card */}
                    <div className="property-section">
                      <div className="property-section-header">
                        <h3 className="property-section-title">Profile Card</h3>
                        <button 
                          className="visibility-toggle"
                          onClick={() => toggleSectionVisibility('profileCard')}
                          aria-label="Toggle visibility"
                        >
                          {sectionVisibility.profileCard ? (
                            <FiEye className="visible" />
                          ) : (
                            <FiEyeOff className="hidden" />
                          )}
                        </button>
                      </div>
                      <div className="profile-card-edit">
                        <div className="profile-card-image-wrapper">
                          <img src={profileCardImage} alt="Profile" className="profile-card-image" />
                          <input
                            type="file"
                            ref={profileCardImageInputRef}
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => handleImageInputChange(e, 'profileCard')}
                          />
                          <button 
                            className="profile-card-upload-overlay"
                            onClick={() => profileCardImageInputRef.current?.click()}
                          >
                            <FiUpload />
                          </button>
                        </div>
                        <div className="profile-card-info">
                          <input
                            type="text"
                            className="profile-card-name-input"
                            value={profileCardName}
                            onChange={(e) => setProfileCardName(e.target.value)}
                          />
                          <input
                            type="text"
                            className="profile-card-role-input"
                            value={profileCardRole}
                            onChange={(e) => setProfileCardRole(e.target.value)}
                          />
                        </div>
                        <textarea
                          className="profile-card-bio-textarea"
                          value={profileCardBio}
                          onChange={(e) => setProfileCardBio(e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Section Tab */}
                {leftSidebarTab === 'section' && (
                  <div className="property-section-tab">
                    <h2 className="layout-manager-title">Layout Manager</h2>
                    <div className="layout-sections-list">
                      {layoutSections.map((section, index) => (
                        <div 
                          key={section.id} 
                          className="layout-section-item"
                          draggable
                          onDragStart={() => handleDragStart(index)}
                          onDragOver={handleDragOver}
                          onDrop={() => handleDrop(index)}
                          style={{
                            cursor: 'move',
                            opacity: draggedSectionIndex === index ? 0.5 : 1
                          }}
                        >
                          <div className="layout-section-reorder">
                            <button
                              className="reorder-btn"
                              onClick={() => moveSection(index, 'up')}
                              disabled={index === 0}
                              aria-label="Move up"
                            >
                              <FiChevronUp />
                            </button>
                            <button
                              className="reorder-btn"
                              onClick={() => moveSection(index, 'down')}
                              disabled={index === layoutSections.length - 1}
                              aria-label="Move down"
                            >
                              <FiChevronDown />
                            </button>
                          </div>
                          <span className="layout-section-name">{section.name}</span>
                          <div className="layout-section-actions">
                            <button
                              className="layout-action-btn visibility-btn"
                              onClick={() => toggleSectionVisibility(section.id)}
                              aria-label="Toggle visibility"
                            >
                              {section.visible ? (
                                <FiEye className="visible" />
                              ) : (
                                <FiEyeOff className="hidden" />
                              )}
                            </button>
                            <button
                              className="layout-action-btn delete-btn"
                              onClick={() => deleteSection(section.id)}
                              aria-label="Delete section"
                            >
                              <FiTrash2 />
                            </button>
                            <button
                              className="layout-action-btn sort-btn"
                              aria-label="Drag to reorder"
                              title="Drag to reorder"
                            >
                              <FiMove />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Design Tab */}
                {leftSidebarTab === 'design' && (
                  <div className="property-design-tab">
                    {/* Brand Color */}
                    <div className="property-section">
                      <h3 className="property-section-title">Brand Color</h3>
                      <div className="brand-color-container">
                        {brandColors.map((color) => (
                          <button
                            key={color.id}
                            className={`brand-color-swatch ${selectedBrandColor === color.id ? 'active' : ''} ${color.id === 'white' ? 'color-white' : ''}`}
                            style={{ backgroundColor: color.color }}
                            onClick={() => setSelectedBrandColor(color.id)}
                            aria-label={color.id}
                          >
                            {selectedBrandColor === color.id && (
                              <FiCheck className="color-check-icon" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Corner Radius */}
                    <div className="property-section">
                      <h3 className="property-section-title">Corner Radius</h3>
                      <div className="corner-radius-container">
                        {cornerRadiusOptions.map((option) => (
                          <button
                            key={option.id}
                            className={`corner-radius-btn ${selectedCornerRadius === option.id ? 'active' : ''}`}
                            onClick={() => setSelectedCornerRadius(option.id)}
                          >
                            {option.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Column - Preview */}
          <div className="page-builder-right">
            <div className={`preview-card ${activeTab === 'property' ? 'property-mode' : ''}`}>
              <div className="preview-header">
                <div className="preview-tabs">
                  <button
                    className={`preview-tab ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    Profile
                  </button>
                  <button
                    className={`preview-tab ${activeTab === 'property' ? 'active' : ''}`}
                    onClick={() => setActiveTab('property')}
                  >
                    Property
                  </button>
                </div>
              </div>

              <div className={`preview-content ${activeTab === 'property' ? 'property-mode' : ''}`}>
                {activeTab === 'profile' && (
                  <>
                    <div className="preview-profile-section">
                      <div className="preview-profile-header">
                        <div className="preview-profile-image-wrapper">
                          <img 
                            src={profileImage || ASSETS.PLACEHOLDER_PROFILE} 
                            alt="John Anderson"
                            className="preview-profile-image"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                          <div className="preview-profile-fallback">JA</div>
                        </div>
                        <div className="preview-profile-info">
                          <h2 className="preview-name">John Anderson</h2>
                          {showBio && <p className="preview-tagline">{bio}</p>}
                          {showContactNumber && (
                            <div className="preview-contact-icons">
                              {contactInfo.email && (
                                <button className="preview-contact-icon" title={contactInfo.email}>
                                  <FiMail />
                                </button>
                              )}
                              {contactInfo.phone && (
                                <button className="preview-contact-icon" title={contactInfo.phone}>
                                  <FiPhone />
                                </button>
                              )}
                              {contactInfo.message && (
                                <button className="preview-contact-icon" title={contactInfo.message}>
                                  <FiMessageCircle />
                                </button>
                              )}
                              {contactInfo.website && (
                                <button className="preview-contact-icon" title={contactInfo.website}>
                                  <FiGlobe />
                                </button>
                              )}
                            </div>
                          )}
                          {showExperienceStats && experienceStats.length > 0 && (
                            <div className="preview-experience-stats" style={{ marginTop: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                              {experienceStats.map((stat, index) => (
                                <div key={index} style={{ textAlign: 'center' }}>
                                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#205ED7' }}>{stat.value}</div>
                                  <div style={{ fontSize: '12px', color: '#6B7280' }}>{stat.label}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {showFeaturedListings && (
                      <div className="preview-featured-section">
                        <h3 className="preview-section-title">Featured Listings</h3>
                        <div className="preview-listings-scroll">
                          {featuredListings.map((listing) => (
                            <div key={listing.id} className="preview-listing-card">
                              <div className="listing-badge">
                                <FiStar className="star-icon" />
                                <span>Featured</span>
                              </div>
                              <div className="listing-image-wrapper">
                                <img src={listing.image} alt={listing.title} />
                              </div>
                              <div className="listing-info">
                                <div className="listing-info-header">
                                  <div className="listing-price">{listing.price}/Month</div>
                                  <button className="listing-heart" aria-label="Favorite">
                                    <FiHeart />
                                  </button>
                                </div>
                                <div className="listing-title">{listing.title}</div>
                                <div className="listing-category">{listing.category}</div>
                                <div className="listing-info-footer">
                                  <div className="listing-date">{listing.date}</div>
                                  <div className="listing-view-count">
                                    <span>1</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {showTestimonials && (
                      <div className="preview-testimonials-section">
                        <h3 className="preview-section-title">Client Testimonials</h3>
                        <div className="testimonials-grid">
                          {testimonials.map((testimonial) => (
                            <div key={testimonial.id} className="testimonial-card">
                              <div className="testimonial-header">
                                <img 
                                  src={testimonial.avatar} 
                                  alt={testimonial.name}
                                  className="testimonial-avatar"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                  }}
                                />
                                <div className="testimonial-avatar-fallback">
                                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="testimonial-name">{testimonial.name}</div>
                              </div>
                              <p className="testimonial-quote">&ldquo;{testimonial.quote}&rdquo;</p>
                              <div className="testimonial-rating">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                  <FiStar key={i} className="rating-star" />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {activeTab === 'property' && (
                  <div className="property-preview">
                    {/* Render sections in the order specified by layoutSections */}
                    {layoutSections.map((section) => {
                      if (!section.visible) return null
                      
                      switch (section.id) {
                        case 'hero':
                          return (
                            <div key={section.id} className="property-hero-section">
                              <div 
                                className="property-hero-image"
                                style={{
                                  backgroundImage: `url(${heroImage})`,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                  position: 'relative',
                                  filter: `brightness(${100 - overallDarkness}%)`
                                }}
                              >
                                <div className="property-hero-overlay">
                                  <h1 className="property-hero-title">{mainHeading}</h1>
                                  <p className="property-hero-tagline">{tagline}</p>
                                  <button className="property-hero-price-btn">
                                    Starts at {propertyPrice} /mo
                                  </button>
                                </div>
                              </div>
                            </div>
                          )
                        
                        case 'propertyDescription':
                          return (
                            <div key={section.id} className="property-about-section">
                              <h2 className="property-section-heading">About</h2>
                              <p className="property-about-text">{propertyDescription}</p>
                            </div>
                          )
                        
                        case 'propertyImages':
                          return (
                            <div key={section.id} className="property-inside-section">
                              <h2 className="property-section-heading">What&apos;s Inside?</h2>
                              <div className="property-inside-images">
                                {propertyImages.map((image, index) => (
                                  <div 
                                    key={index} 
                                    className="property-inside-image-item"
                                    style={{ borderRadius: getCornerRadiusClass() }}
                                  >
                                    <img src={image} alt={`Interior ${index + 1}`} />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        
                        case 'profileCard':
                          return (
                            <div 
                              key={section.id}
                              className="property-agent-card"
                              style={{
                                backgroundColor: selectedBrandColor === 'white' ? '#3B82F6' : 
                                               selectedBrandColor === 'dark' ? '#1F2937' :
                                               selectedBrandColor === 'orange' ? '#F97316' :
                                               selectedBrandColor === 'blue' ? '#3B82F6' : '#3B82F6',
                                borderRadius: getCornerRadiusClass()
                              }}
                            >
                              <div className="property-agent-content">
                                <div className="property-agent-image-wrapper">
                                  <img src={profileCardImage} alt={profileCardName} className="property-agent-image" />
                                </div>
                                <div className="property-agent-info">
                                  <h3 className="property-agent-name">{profileCardName}</h3>
                                  <p className="property-agent-role">{profileCardRole}</p>
                                  <p className="property-agent-quote">{profileCardBio}</p>
                                  <div className="property-agent-icons">
                                    <button className="property-agent-icon">
                                      <FiMail />
                                    </button>
                                    <button className="property-agent-icon">
                                      <FiPhone />
                                    </button>
                                    <button className="property-agent-icon">
                                      <FiMessageCircle />
                                    </button>
                                    <button className="property-agent-icon">
                                      <FiGlobe />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        
                        default:
                          return null
                      }
                    })}

                    {/* Ready To View? Section */}
                    <div className="property-contact-section">
                      <div className="property-contact-left">
                        <h2 className="property-section-heading">Ready To View?</h2>
                        <p className="property-contact-text">Schedule a tour or ask any questions about the property.</p>
                        <div className="property-contact-info">
                          <div className="property-contact-item">
                            <FiPhone className="property-contact-icon" />
                            <span>{contactPhone}</span>
                          </div>
                          <div className="property-contact-item">
                            <FiMail className="property-contact-icon" />
                            <span>{contactEmail}</span>
                          </div>
                        </div>
                      </div>
                      <div className="property-contact-form">
                        <h3 className="property-form-title">Contact {profileCardName}</h3>
                        <input
                          type="text"
                          className="property-form-input"
                          placeholder="Your name"
                          value={contactFormName}
                          onChange={(e) => setContactFormName(e.target.value)}
                        />
                        <input
                          type="email"
                          className="property-form-input"
                          placeholder="Your email"
                          value={contactFormEmail}
                          onChange={(e) => setContactFormEmail(e.target.value)}
                        />
                        <textarea
                          className="property-form-textarea"
                          placeholder="Your message"
                          value={contactFormMessage}
                          onChange={(e) => setContactFormMessage(e.target.value)}
                          rows={4}
                        />
                        <button className="property-form-submit-btn">
                          <span>Send Inquiry</span>
                          <FiMessageCircle />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Contact Modal */}
      {showContactModal && (
        <div className="modal-overlay" onClick={() => setShowContactModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit {editingContactType === 'email' ? 'Email' : editingContactType === 'phone' ? 'Phone' : editingContactType === 'message' ? 'Message' : 'Website'}</h3>
              <button className="modal-close" onClick={() => setShowContactModal(false)}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <input
                type={editingContactType === 'email' ? 'email' : 'text'}
                placeholder={`Enter ${editingContactType === 'email' ? 'email address' : editingContactType === 'phone' ? 'phone number' : editingContactType === 'message' ? 'message' : 'website URL'}`}
                value={contactInfo[editingContactType as keyof typeof contactInfo] || ''}
                onChange={(e) => setContactInfo(prev => ({ ...prev, [editingContactType!]: e.target.value }))}
                style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '8px', marginBottom: '16px' }}
              />
              <button 
                className="save-changes-button"
                onClick={handleContactSave}
                style={{ width: '100%' }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Experience Stats Modal */}
      {showExperienceModal && (
        <div className="modal-overlay" onClick={() => setShowExperienceModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingStatIndex !== null ? 'Edit' : 'Add'} Experience Stat</h3>
              <button className="modal-close" onClick={() => setShowExperienceModal(false)}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <ExperienceStatForm
                stat={editingStatIndex !== null ? experienceStats[editingStatIndex] : null}
                onSave={handleSaveExperienceStat}
                onCancel={() => setShowExperienceModal(false)}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Featured Listings Modal */}
      {showFeaturedListingsModal && (
        <div className="modal-overlay" onClick={() => setShowFeaturedListingsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3>Edit Featured Listings</h3>
              <button className="modal-close" onClick={() => setShowFeaturedListingsModal(false)}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: '#6B7280', marginBottom: '16px' }}>
                Featured listings management will be available in the full version.
              </p>
              <button 
                className="save-changes-button"
                onClick={() => setShowFeaturedListingsModal(false)}
                style={{ width: '100%' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Testimonials Modal */}
      {showTestimonialsModal && (
        <div className="modal-overlay" onClick={() => setShowTestimonialsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3>Edit Testimonials</h3>
              <button className="modal-close" onClick={() => setShowTestimonialsModal(false)}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: '#6B7280', marginBottom: '16px' }}>
                Testimonials management will be available in the full version.
              </p>
              <button 
                className="save-changes-button"
                onClick={() => setShowTestimonialsModal(false)}
                style={{ width: '100%' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Experience Stat Form Component
function ExperienceStatForm({ 
  stat, 
  onSave, 
  onCancel 
}: { 
  stat: { label: string; value: string } | null
  onSave: (label: string, value: string) => void
  onCancel: () => void
}) {
  const [label, setLabel] = useState(stat?.label || '')
  const [value, setValue] = useState(stat?.value || '')
  
  return (
    <>
      <input
        type="text"
        placeholder="Label (e.g., Years of Experience)"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '8px', marginBottom: '12px' }}
      />
      <input
        type="text"
        placeholder="Value (e.g., 5)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '8px', marginBottom: '16px' }}
      />
      <div style={{ display: 'flex', gap: '12px' }}>
        <button 
          className="save-changes-button"
          onClick={() => onSave(label, value)}
          style={{ flex: 1 }}
          disabled={!label || !value}
        >
          Save
        </button>
        <button 
          onClick={onCancel}
          style={{ 
            flex: 1, 
            padding: '14px 32px', 
            background: '#F3F4F6', 
            color: '#111827', 
            border: 'none', 
            borderRadius: '8px', 
            fontSize: '15px', 
            fontWeight: '600', 
            cursor: 'pointer' 
          }}
        >
          Cancel
        </button>
      </div>
    </>
  )
}
