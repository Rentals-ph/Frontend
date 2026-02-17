'use client'

import { useState, useRef, useEffect } from 'react'
import AppSidebar from '../../../components/common/AppSidebar'
import AgentHeader from '../../../components/agent/AgentHeader'
import { ASSETS } from '@/utils/assets'
import { pageBuilderApi, propertiesApi, testimonialsApi } from '@/api'
import type { Property, Testimonial } from '@/types'
import { 
  FiSettings,
  FiUpload,
  FiMail,
  FiPhone,
  FiMessageCircle,
  FiGlobe,
  FiPlus,
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
  FiX,
  FiExternalLink
} from 'react-icons/fi'
// import './page.css' // Removed - converted to Tailwind

export default function PageBuilder() {
  const [selectedTheme, setSelectedTheme] = useState('white')
  const [showBio, setShowBio] = useState(true)
  const [showContactNumber, setShowContactNumber] = useState(true)
  const [showExperienceStats, setShowExperienceStats] = useState(false)
  const [showFeaturedListings, setShowFeaturedListings] = useState(true)
  const [showTestimonials, setShowTestimonials] = useState(true)
  const [bio, setBio] = useState('')
  const [activeTab, setActiveTab] = useState('profile')
  const [leftSidebarTab, setLeftSidebarTab] = useState('content')
  const [showFullPreview, setShowFullPreview] = useState(false)
  
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
  const [experienceStats, setExperienceStats] = useState<Array<{ label: string; value: string }>>([])
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
  const [heroImage, setHeroImage] = useState('')
  const [mainHeading, setMainHeading] = useState('')
  const [tagline, setTagline] = useState('')
  const [overallDarkness, setOverallDarkness] = useState(30)
  const [propertyDescription, setPropertyDescription] = useState('')
  const [propertyImages, setPropertyImages] = useState<string[]>([])
  const [profileCardName, setProfileCardName] = useState('')
  const [profileCardRole, setProfileCardRole] = useState('')
  const [profileCardBio, setProfileCardBio] = useState('')
  const [profileCardImage, setProfileCardImage] = useState('')
  
  // Additional property preview states
  const [propertyPrice, setPropertyPrice] = useState('')
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
  
  // Page builder data state
  const [pageBuilderId, setPageBuilderId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [pageUrl, setPageUrl] = useState<string | null>(null)
  const [pageSlug, setPageSlug] = useState<string | null>(null)
  const [showPageUrlModal, setShowPageUrlModal] = useState(false)
  
  // Featured listings and testimonials state
  const [featuredListings, setFeaturedListings] = useState<Property[]>([])
  const [availableProperties, setAvailableProperties] = useState<Property[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [availableTestimonials, setAvailableTestimonials] = useState<Testimonial[]>([])
  const [loadingProperties, setLoadingProperties] = useState(false)
  const [loadingTestimonials, setLoadingTestimonials] = useState(false)
  
  // Load available properties and testimonials
  useEffect(() => {
    const loadAvailableData = async () => {
      try {
        setLoadingProperties(true)
        setLoadingTestimonials(true)
        
        // Get current user ID from auth (you may need to adjust this based on your auth setup)
        // For now, we'll get all properties and filter client-side
        const properties = await propertiesApi.getAll()
        const propertiesArray = Array.isArray(properties) ? properties : (properties as any).data || []
        setAvailableProperties(propertiesArray)
        
        const testimonialsData = await testimonialsApi.getAll()
        setAvailableTestimonials(testimonialsData)
      } catch (error) {
        console.error('Error loading available data:', error)
      } finally {
        setLoadingProperties(false)
        setLoadingTestimonials(false)
      }
    }
    
    loadAvailableData()
  }, [])
  
  // Load page builder data on mount
  useEffect(() => {
    const loadPageBuilder = async () => {
      try {
        setIsLoading(true)
        const pageBuilders = await pageBuilderApi.getAll('agent', activeTab as 'profile' | 'property')
        
        // Also load profile page builder data to sync with property page
        const profilePageBuilders = await pageBuilderApi.getAll('agent', 'profile')
        const profilePageData = profilePageBuilders.length > 0 ? profilePageBuilders[0] : null
        
        if (pageBuilders.length > 0) {
          const pageData = pageBuilders[0]
          setPageBuilderId(pageData.id || null)
          setIsPublished(pageData.is_published || false)
          setPageUrl(pageData.page_url || null)
          setPageSlug(pageData.page_slug || null)
          
          // Load profile data
          if (activeTab === 'profile' && pageData.page_type === 'profile') {
            if (pageData.selected_theme) setSelectedTheme(pageData.selected_theme)
            if (pageData.bio !== undefined) setBio(pageData.bio)
            if (pageData.show_bio !== undefined) setShowBio(pageData.show_bio)
            if (pageData.show_contact_number !== undefined) setShowContactNumber(pageData.show_contact_number)
            if (pageData.show_experience_stats !== undefined) setShowExperienceStats(pageData.show_experience_stats)
            if (pageData.show_featured_listings !== undefined) setShowFeaturedListings(pageData.show_featured_listings)
            if (pageData.show_testimonials !== undefined) setShowTestimonials(pageData.show_testimonials)
            if (pageData.profile_image) setProfileImage(pageData.profile_image)
            if (pageData.contact_info) {
              setContactInfo({
                email: pageData.contact_info.email || '',
                phone: pageData.contact_info.phone || '',
                message: pageData.contact_info.message || '',
                website: pageData.contact_info.website || ''
              })
            }
            if (pageData.experience_stats) setExperienceStats(pageData.experience_stats)
            if (pageData.featured_listings) setFeaturedListings(pageData.featured_listings as Property[])
            if (pageData.testimonials) setTestimonials(pageData.testimonials as Testimonial[])
            // Load profile card fields - always load if they exist, even if empty
            if (pageData.profile_card_name !== undefined) setProfileCardName(pageData.profile_card_name || '')
            if (pageData.profile_card_role !== undefined) setProfileCardRole(pageData.profile_card_role || '')
            if (pageData.profile_card_bio !== undefined) setProfileCardBio(pageData.profile_card_bio || '')
            if (pageData.profile_card_image !== undefined) setProfileCardImage(pageData.profile_card_image || '')
          }
          
          // Load property data
          if (activeTab === 'property' && pageData.page_type === 'property') {
            if (pageData.hero_image) setHeroImage(pageData.hero_image)
            if (pageData.main_heading) setMainHeading(pageData.main_heading)
            if (pageData.tagline) setTagline(pageData.tagline)
            if (pageData.overall_darkness !== undefined) setOverallDarkness(pageData.overall_darkness)
            if (pageData.property_description) setPropertyDescription(pageData.property_description)
            if (pageData.property_images) setPropertyImages(pageData.property_images)
            if (pageData.property_price) setPropertyPrice(pageData.property_price)
            // Contact info is loaded from contact_info object above
            if (pageData.section_visibility) {
              setSectionVisibility({
                hero: pageData.section_visibility.hero ?? false,
                propertyDescription: pageData.section_visibility.propertyDescription ?? true,
                propertyImages: pageData.section_visibility.propertyImages ?? true,
                profileCard: pageData.section_visibility.profileCard ?? true
              })
            }
            if (pageData.layout_sections) setLayoutSections(pageData.layout_sections)
            if (pageData.selected_brand_color) setSelectedBrandColor(pageData.selected_brand_color)
            if (pageData.selected_corner_radius) setSelectedCornerRadius(pageData.selected_corner_radius)
            
            // Sync profile card with profile page builder data
            if (profilePageData) {
              // Use profile image for profile card image
              if (profilePageData.profile_image) {
                setProfileCardImage(profilePageData.profile_image)
              }
              // Use bio for profile card bio
              if (profilePageData.bio) {
                setProfileCardBio(profilePageData.bio)
              }
              // Use contact info for profile card
              if (profilePageData.contact_info) {
                const contactInfo = profilePageData.contact_info
                setContactInfo(prev => ({ 
                  ...prev, 
                  email: contactInfo.email || prev.email,
                  phone: contactInfo.phone || prev.phone
                }))
              }
            } else {
              // Fallback to property page data if profile page doesn't exist
              if (pageData.profile_card_name !== undefined) setProfileCardName(pageData.profile_card_name || '')
              if (pageData.profile_card_role !== undefined) setProfileCardRole(pageData.profile_card_role || '')
              if (pageData.profile_card_bio !== undefined) setProfileCardBio(pageData.profile_card_bio || '')
              if (pageData.profile_card_image !== undefined) setProfileCardImage(pageData.profile_card_image || '')
            }
          }
        } else {
          // If no property page exists, still load profile data for profile card
          if (activeTab === 'property' && profilePageData) {
            if (profilePageData.profile_image) {
              setProfileCardImage(profilePageData.profile_image)
            }
            if (profilePageData.bio) {
              setProfileCardBio(profilePageData.bio)
            }
            if (profilePageData.contact_info) {
              const contactInfo = profilePageData.contact_info
              setContactInfo(prev => ({ 
                ...prev, 
                email: contactInfo.email || prev.email,
                phone: contactInfo.phone || prev.phone
              }))
            }
          }
        }
      } catch (error) {
        console.error('Error loading page builder:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadPageBuilder()
  }, [activeTab])
  
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
  const handleAddFeaturedListing = () => {
    setEditingListingIndex(null)
    setShowFeaturedListingsModal(true)
  }
  
  const handleEditFeaturedListing = (index: number) => {
    setEditingListingIndex(index)
    setShowFeaturedListingsModal(true)
  }
  
  const handleSelectFeaturedListing = (property: Property) => {
    if (editingListingIndex !== null) {
      const updated = [...featuredListings]
      updated[editingListingIndex] = property
      setFeaturedListings(updated)
    } else {
      setFeaturedListings([...featuredListings, property])
    }
    setShowFeaturedListingsModal(false)
    setEditingListingIndex(null)
  }
  
  const handleRemoveFeaturedListing = (index: number) => {
    setFeaturedListings(prev => prev.filter((_, i) => i !== index))
  }
  
  // Testimonials management
  const handleAddTestimonial = () => {
    setEditingTestimonialIndex(null)
    setShowTestimonialsModal(true)
  }
  
  const handleEditTestimonial = (index: number) => {
    setEditingTestimonialIndex(index)
    setShowTestimonialsModal(true)
  }
  
  const handleSaveTestimonial = (testimonial: Testimonial) => {
    if (editingTestimonialIndex !== null) {
      const updated = [...testimonials]
      updated[editingTestimonialIndex] = testimonial
      setTestimonials(updated)
    } else {
      setTestimonials([...testimonials, testimonial])
    }
    setShowTestimonialsModal(false)
    setEditingTestimonialIndex(null)
  }
  
  const handleDeleteTestimonial = (index: number) => {
    setTestimonials(prev => prev.filter((_, i) => i !== index))
  }
  
  // Contact form submission
  const handleContactFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // In a real app, this would send to a contact/inquiry API
      // For now, we'll just show an alert
      if (!contactFormName || !contactFormEmail || !contactFormMessage) {
        alert('Please fill in all fields')
        return
      }
      
      // TODO: Implement actual API call to submit inquiry
      console.log('Contact form submission:', {
        name: contactFormName,
        email: contactFormEmail,
        message: contactFormMessage,
        pageId: pageBuilderId,
        pageType: activeTab
      })
      
      alert('Thank you for your inquiry! We will get back to you soon.')
      setContactFormName('')
      setContactFormEmail('')
      setContactFormMessage('')
    } catch (error) {
      console.error('Error submitting contact form:', error)
      alert('Failed to send inquiry. Please try again.')
    }
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
  
  // Save changes handler - sends all page customization as a single page_data object
  const handleSaveChanges = async () => {
    try {
      setIsSaving(true)
      
      // Collect all page customization data into a single object
      const pageData = {
        // Profile mode fields
        selected_theme: selectedTheme,
        bio: bio,
        show_bio: showBio,
        show_contact_number: showContactNumber,
        show_experience_stats: showExperienceStats,
        show_featured_listings: showFeaturedListings,
        show_testimonials: showTestimonials,
        profile_image: profileImage,
        contact_info: contactInfo,
        experience_stats: experienceStats,
        featured_listings: featuredListings,
        testimonials: testimonials,
        
        // Property mode fields
        hero_image: heroImage,
        main_heading: mainHeading,
        tagline: tagline,
        overall_darkness: overallDarkness,
        property_description: propertyDescription,
        property_images: propertyImages,
        property_price: propertyPrice,
        contact_phone: contactInfo.phone,
        contact_email: contactInfo.email,
        
        // Profile card fields - always save the actual values from state
        profile_card_name: profileCardName,
        profile_card_role: profileCardRole,
        profile_card_bio: profileCardBio,
        profile_card_image: profileCardImage,
        
        // Layout and design fields
        section_visibility: sectionVisibility,
        layout_sections: layoutSections,
        selected_brand_color: selectedBrandColor,
        selected_corner_radius: selectedCornerRadius,
      }
      
      // Send to backend with page_data structure
      const savePayload = {
        user_type: 'agent' as const,
        page_type: activeTab as 'profile' | 'property',
        page_data: pageData,
      }
      
      let savedData
      if (pageBuilderId) {
        savedData = await pageBuilderApi.update(pageBuilderId, savePayload)
      } else {
        savedData = await pageBuilderApi.save(savePayload)
        setPageBuilderId(savedData.id || null)
      }
      
      // Update page URL and slug if available
      if (savedData.page_url) {
        setPageUrl(savedData.page_url)
      }
      if (savedData.page_slug) {
        setPageSlug(savedData.page_slug)
      }
      setIsPublished(savedData.is_published || false)
      
      alert('Changes saved successfully!')
    } catch (error: any) {
      console.error('Error saving page builder:', error)
      alert('Failed to save changes: ' + (error.response?.data?.message || error.message))
    } finally {
      setIsSaving(false)
    }
  }
  
  // Publish handler
  const handlePublish = async () => {
    if (!pageBuilderId) {
      alert('Please save your page first before publishing.')
      return
    }
    
    try {
      setIsPublishing(true)
      const publishedData = await pageBuilderApi.publish(pageBuilderId, !isPublished)
      
      setIsPublished(publishedData.is_published || false)
      if (publishedData.page_url) {
        setPageUrl(publishedData.page_url)
      }
      if (publishedData.page_slug) {
        setPageSlug(publishedData.page_slug)
      }
      
      if (publishedData.is_published) {
        setShowPageUrlModal(true)
        alert('Page published successfully! Your page is now live and shareable.')
      } else {
        alert('Page unpublished successfully.')
      }
    } catch (error: any) {
      console.error('Error publishing page:', error)
      alert('Failed to publish page: ' + (error.response?.data?.message || error.message))
    } finally {
      setIsPublishing(false)
    }
  }
  
  // Copy page URL to clipboard
  const handleCopyUrl = () => {
    if (pageUrl) {
      navigator.clipboard.writeText(pageUrl)
      alert('Page URL copied to clipboard!')
    }
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

  // Helper function to format property price
  const formatPropertyPrice = (property: Property) => {
    return `₱${property.price.toLocaleString()}${property.price_type ? `/${property.price_type}` : '/mo'}`
  }
  
  // Helper function to format property date
  const formatPropertyDate = (property: Property) => {
    if (property.published_at) {
      const date = new Date(property.published_at)
      return date.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
    }
    return 'Recently'
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-outfit"> {/* agent-dashboard */}
      <AppSidebar/>

      <main className="ml-[280px] flex-1 w-[calc(100%-280px)] p-8 min-h-screen lg:ml-[240px] lg:w-[calc(100%-240px)] lg:p-6 md:ml-[200px] md:w-[calc(100%-200px)] md:p-4"> {/* agent-main */}
        <AgentHeader 
          title={activeTab === 'profile' ? "Page Builder > Profile" : "Page Builder > Property"} 
          subtitle={activeTab === 'profile' ? "Customize your public profile page" : "Customize your property page"} 
        />
        
        {/* Preview Button */}
        <div className="flex justify-end mb-6"> {/* preview-button-container */}
          <button 
            className="inline-flex items-center gap-2 py-2.5 px-5 bg-blue-600 text-white text-sm font-semibold rounded-xl border-0 cursor-pointer transition-all duration-200 shadow-sm hover:bg-blue-700" /* full-preview-button */
            onClick={() => setShowFullPreview(true)}
          >
            <FiExternalLink className="text-base" /> {/* preview-icon */}
            <span>Preview Full Page</span>
          </button>
        </div>

        <div className="grid grid-cols-[1fr_2fr] gap-6 lg:grid-cols-1"> {/* page-builder-container */}
          {/* Left Column - Customization */}
          <div className="flex flex-col gap-6"> {/* page-builder-left */}
            {activeTab === 'profile' ? (
              <>
                <div className="bg-white rounded-2xl p-6 shadow-sm"> {/* customize-section */}
                  <div className="flex items-start gap-4"> {/* customize-header */}
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0"> {/* customize-icon-wrapper */}
                      <FiLayout className="text-xl" /> {/* customize-icon */}
                    </div>
                    <div className="flex-1"> {/* customize-content */}
                      <h2 className="text-lg font-bold text-gray-900 mb-1">Customize your very own public page</h2> {/* customize-title */}
                      <p className="text-sm text-gray-600">Showcase your public page to anyone.</p> {/* customize-subtitle */}
                    </div>
                  </div>
                </div>

                {/* Themes Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm"> {/* builder-section */}
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Themes</h3> {/* section-label */}
                  <div className="grid grid-cols-4 gap-4"> {/* themes-grid */}
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

                {/* Profile Card Section */}
                <div className="builder-section">
                  <h3 className="section-label">Profile Card</h3>
                  <div style={{ 
                    padding: '12px', 
                    background: '#F0F9FF', 
                    borderRadius: '8px', 
                    marginBottom: '16px',
                    fontSize: '14px',
                    color: '#0369A1'
                  }}>
                    <strong>ℹ️ Note:</strong> Profile card uses the same image and bio from Profile section above. 
                    You can customize the name and role separately.
                  </div>
                  <div className="profile-card-edit">
                    <div className="profile-card-image-wrapper">
                      <img 
                        src={profileCardImage || profileImage || ASSETS.PLACEHOLDER_PROFILE} 
                        alt="Profile Card" 
                        className="profile-card-image"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                      <div className="profile-card-upload-overlay">
                        <input
                          type="file"
                          ref={profileCardImageInputRef}
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => handleImageInputChange(e, 'profileCard')}
                        />
                        <button 
                          className="profile-card-upload-btn"
                          onClick={() => profileCardImageInputRef.current?.click()}
                        >
                          <FiUpload />
                        </button>
                      </div>
                    </div>
                    <div className="profile-card-info">
                      <input
                        type="text"
                        className="profile-card-name-input"
                        placeholder="Your name"
                        value={profileCardName}
                        onChange={(e) => setProfileCardName(e.target.value)}
                      />
                      <input
                        type="text"
                        className="profile-card-role-input"
                        placeholder="Property Agent"
                        value={profileCardRole}
                        onChange={(e) => setProfileCardRole(e.target.value)}
                        style={{ marginTop: '8px' }}
                      />
                    </div>
                    <textarea
                      className="profile-card-bio-textarea"
                      placeholder="Your bio (uses Profile bio if empty)..."
                      value={profileCardBio}
                      onChange={(e) => setProfileCardBio(e.target.value)}
                      style={{ marginTop: '8px', minHeight: '80px' }}
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
                            onClick={handleAddFeaturedListing}
                            style={{ cursor: 'pointer' }}
                          >
                            {featuredListings.length > 0 ? 'Edit' : 'Add'}
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
                        {featuredListings.length > 0 && (
                          <div style={{ marginTop: '8px', fontSize: '12px', color: '#6B7280' }}>
                            {featuredListings.length} listing{featuredListings.length !== 1 ? 's' : ''} selected
                          </div>
                        )}
                      </div>

                      <div className="toggle-item">
                        <div className="toggle-label-group">
                          <span className="toggle-label">Client Testimonials</span>
                          <span 
                            className="toggle-action"
                            onClick={handleAddTestimonial}
                            style={{ cursor: 'pointer' }}
                          >
                            {testimonials.length > 0 ? 'Edit' : 'Add'}
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
                        {testimonials.length > 0 && (
                          <div style={{ marginTop: '8px', fontSize: '12px', color: '#6B7280' }}>
                            {testimonials.length} testimonial{testimonials.length !== 1 ? 's' : ''} added
                          </div>
                        )}
                      </div>
                  </div>
                </div>
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
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div className="hero-input-group" style={{ marginBottom: 0 }}>
                          <label className="hero-input-label">Main Heading</label>
                          <input
                            type="text"
                            className="hero-input"
                            placeholder="Azure Residences"
                            value={mainHeading}
                            onChange={(e) => setMainHeading(e.target.value)}
                          />
                        </div>
                        <div className="hero-input-group" style={{ marginBottom: 0 }}>
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
                      <div className="hero-input-group" style={{ marginBottom: '16px' }}>
                        <label className="hero-input-label">Tagline</label>
                        <input
                          type="text"
                          className="hero-input"
                          placeholder="Luxury Living redefined with..."
                          value={tagline}
                          onChange={(e) => setTagline(e.target.value)}
                        />
                      </div>
                      <div className="hero-input-group" style={{ marginBottom: 0 }}>
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
                      <div style={{ 
                        padding: '12px', 
                        background: '#F0F9FF', 
                        borderRadius: '8px', 
                        marginBottom: '16px',
                        fontSize: '14px',
                        color: '#0369A1'
                      }}>
                        <strong>ℹ️ Note:</strong> Contact information is synced with your Profile page builder. 
                        Update your contact details in the Profile tab.
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="hero-input-group" style={{ marginBottom: 0 }}>
                          <label className="hero-input-label">Phone Number</label>
                          <div style={{ 
                            padding: '10px 12px', 
                            border: '1px solid #E5E7EB', 
                            borderRadius: '8px',
                            background: '#F9FAFB',
                            color: '#6B7280',
                            fontSize: '14px'
                          }}>
                            {contactInfo.phone || 'Not set - Edit in Profile tab'}
                          </div>
                        </div>
                        <div className="hero-input-group" style={{ marginBottom: 0 }}>
                          <label className="hero-input-label">Email Address</label>
                          <div style={{ 
                            padding: '10px 12px', 
                            border: '1px solid #E5E7EB', 
                            borderRadius: '8px',
                            background: '#F9FAFB',
                            color: '#6B7280',
                            fontSize: '14px'
                          }}>
                            {contactInfo.email || 'Not set - Edit in Profile tab'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Profile Card - Synced with Profile Page Builder */}
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
                      <div style={{ 
                        padding: '12px', 
                        background: '#F0F9FF', 
                        borderRadius: '8px', 
                        marginBottom: '16px',
                        fontSize: '14px',
                        color: '#0369A1'
                      }}>
                        <strong>ℹ️ Note:</strong> Profile card automatically syncs with your Profile page builder. 
                        Update your profile image, bio, and contact info in the Profile tab to see changes here.
                      </div>
                      <div className="profile-card-edit">
                        <div className="profile-card-image-wrapper">
                          <img src={profileImage || profileCardImage} alt="Profile" className="profile-card-image" />
                        </div>
                        <div className="profile-card-info">
                          <div className="profile-card-name-input" style={{ 
                            padding: '12px', 
                            border: '1px solid #E5E7EB', 
                            borderRadius: '6px',
                            background: '#F9FAFB',
                            color: '#6B7280',
                            cursor: 'not-allowed'
                          }}>
                            {profileCardName || 'Your name from Profile page'}
                          </div>
                          <div className="profile-card-role-input" style={{ 
                            padding: '12px', 
                            border: '1px solid #E5E7EB', 
                            borderRadius: '6px',
                            background: '#F9FAFB',
                            color: '#6B7280',
                            cursor: 'not-allowed',
                            marginTop: '8px'
                          }}>
                            {profileCardRole || 'Property Agent'}
                          </div>
                        </div>
                        <div className="profile-card-bio-textarea" style={{ 
                          padding: '12px', 
                          border: '1px solid #E5E7EB', 
                          borderRadius: '6px',
                          background: '#F9FAFB',
                          color: '#6B7280',
                          cursor: 'not-allowed',
                          marginTop: '8px',
                          minHeight: '80px'
                        }}>
                          {bio || profileCardBio || 'Your bio from Profile page'}
                        </div>
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
                
                {/* Save and Publish Buttons for Property Mode */}
                <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px', borderTop: '1px solid #E5E7EB' }}>
                  <button 
                    className="save-changes-button" 
                    onClick={handleSaveChanges}
                    disabled={isSaving || isLoading}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  
                  {pageBuilderId && (
                    <>
                      <button 
                        className="save-changes-button" 
                        onClick={handlePublish}
                        disabled={isPublishing || isLoading}
                        style={{ 
                          background: isPublished ? '#10B981' : '#3B82F6',
                          opacity: (isPublishing || isLoading) ? 0.6 : 1
                        }}
                      >
                        {isPublishing ? 'Publishing...' : isPublished ? 'Unpublish Page' : 'Publish Page'}
                      </button>
                      
                      {isPublished && pageUrl && (
                        <div style={{ 
                          padding: '12px', 
                          background: '#F3F4F6', 
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}>
                          <div style={{ marginBottom: '8px', fontWeight: '600', color: '#111827' }}>
                            Your Page URL:
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            gap: '8px', 
                            alignItems: 'center',
                            wordBreak: 'break-all'
                          }}>
                            <a 
                              href={pageUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={{ 
                                color: '#3B82F6', 
                                textDecoration: 'none',
                                flex: 1
                              }}
                            >
                              {pageUrl}
                            </a>
                            <button
                              onClick={handleCopyUrl}
                              style={{
                                padding: '6px 12px',
                                background: '#3B82F6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
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
                            alt={profileCardName || 'Profile'}
                            className="preview-profile-image"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                          <div className="preview-profile-fallback">JA</div>
                        </div>
                        <div className="preview-profile-info">
                          <h2 className="preview-name">{profileCardName || 'Your Name'}</h2>
                          {showBio && <p className="preview-tagline">{bio || 'Your bio will appear here...'}</p>}
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

                    {showFeaturedListings && featuredListings.length > 0 && (
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
                                <img src={listing.image || ASSETS.PLACEHOLDER_PROPERTY} alt={listing.title} />
                              </div>
                              <div className="listing-info">
                                <div className="listing-info-header">
                                  <div className="listing-price">{formatPropertyPrice(listing)}</div>
                                  <button className="listing-heart" aria-label="Favorite">
                                    <FiHeart />
                                  </button>
                                </div>
                                <div className="listing-title">{listing.title}</div>
                                <div className="listing-category">{listing.type}</div>
                                <div className="listing-info-footer">
                                  <div className="listing-date">{formatPropertyDate(listing)}</div>
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

                    {showTestimonials && testimonials.length > 0 && (
                      <div className="preview-testimonials-section">
                        <h3 className="preview-section-title">Client Testimonials</h3>
                        <div className="testimonials-grid">
                          {testimonials.map((testimonial) => (
                            <div key={testimonial.id} className="testimonial-card">
                              <div className="testimonial-header">
                                <img 
                                  src={testimonial.avatar || ASSETS.PLACEHOLDER_PROFILE} 
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
                              <p className="testimonial-quote">"{testimonial.content}"</p>
                              {testimonial.role && (
                                <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '8px' }}>
                                  {testimonial.role}
                                </div>
                              )}
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
                                  backgroundImage: heroImage ? `url(${heroImage})` : 'none',
                                  backgroundColor: heroImage ? 'transparent' : '#E5E7EB',
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                  position: 'relative',
                                  filter: `brightness(${100 - overallDarkness}%)`
                                }}
                              >
                                <div className="property-hero-overlay">
                                  <h1 className="property-hero-title">{mainHeading || 'Property Title'}</h1>
                                  <p className="property-hero-tagline">{tagline || 'Property tagline will appear here...'}</p>
                                  <button className="property-hero-price-btn">
                                    Starts at {propertyPrice || 'Price'} /mo
                                  </button>
                                </div>
                              </div>
                            </div>
                          )
                        
                        case 'propertyDescription':
                          return (
                            <div key={section.id} className="property-about-section">
                              <h2 className="property-section-heading">About</h2>
                              <p className="property-about-text">{propertyDescription || 'Property description will appear here...'}</p>
                            </div>
                          )
                        
                        case 'propertyImages':
                          return (
                            <div key={section.id} className="property-inside-section">
                              <h2 className="property-section-heading">What's Inside?</h2>
                              <div className="property-inside-images">
                                {propertyImages.length > 0 ? (
                                  propertyImages.map((image, index) => (
                                    <div 
                                      key={index} 
                                      className="property-inside-image-item"
                                      style={{ borderRadius: getCornerRadiusClass() }}
                                    >
                                      <img src={image} alt={`Interior ${index + 1}`} />
                                    </div>
                                  ))
                                ) : (
                                  <p style={{ color: '#6B7280', fontStyle: 'italic' }}>Property images will appear here...</p>
                                )}
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
                                  <img src={profileImage || profileCardImage} alt={profileCardName || 'Agent'} className="property-agent-image" />
                                </div>
                                <div className="property-agent-info">
                                  <h3 className="property-agent-name">{profileCardName || 'Your Name'}</h3>
                                  <p className="property-agent-role">{profileCardRole || 'Property Agent'}</p>
                                  <p className="property-agent-quote">{bio || profileCardBio || 'Your bio from Profile page'}</p>
                                  <div className="property-agent-icons">
                                    {contactInfo.email && (
                                      <a href={`mailto:${contactInfo.email}`} className="property-agent-icon">
                                        <FiMail />
                                      </a>
                                    )}
                                    {contactInfo.phone && (
                                      <a href={`tel:${contactInfo.phone}`} className="property-agent-icon">
                                        <FiPhone />
                                      </a>
                                    )}
                                    {contactInfo.message && (
                                      <a href={contactInfo.message} className="property-agent-icon" target="_blank" rel="noopener noreferrer">
                                        <FiMessageCircle />
                                      </a>
                                    )}
                                    {contactInfo.website && (
                                      <a href={contactInfo.website} className="property-agent-icon" target="_blank" rel="noopener noreferrer">
                                        <FiGlobe />
                                      </a>
                                    )}
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
                            <span>{contactInfo.phone || 'Phone number'}</span>
                          </div>
                          <div className="property-contact-item">
                            <FiMail className="property-contact-icon" />
                            <span>{contactInfo.email || 'Email address'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="property-contact-form">
                        <h3 className="property-form-title">Contact {profileCardName || 'Agent'}</h3>
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
                        <button 
                          className="property-form-submit-btn"
                          onClick={handleContactFormSubmit}
                          type="submit"
                        >
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', maxHeight: '80vh', overflow: 'auto' }}>
            <div className="modal-header">
              <h3>{editingListingIndex !== null ? 'Edit' : 'Add'} Featured Listing</h3>
              <button className="modal-close" onClick={() => setShowFeaturedListingsModal(false)}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              {loadingProperties ? (
                <p style={{ color: '#6B7280', textAlign: 'center', padding: '20px' }}>Loading properties...</p>
              ) : availableProperties.length === 0 ? (
                <p style={{ color: '#6B7280', textAlign: 'center', padding: '20px' }}>No properties available. Please create properties first.</p>
              ) : (
                <>
                  <p style={{ color: '#6B7280', marginBottom: '16px' }}>
                    Select a property to feature on your page:
                  </p>
                  <div style={{ display: 'grid', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
                    {availableProperties.map((property) => (
                      <div
                        key={property.id}
                        onClick={() => handleSelectFeaturedListing(property)}
                        style={{
                          padding: '12px',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          gap: '12px',
                          alignItems: 'center',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#3B82F6'
                          e.currentTarget.style.background = '#F3F4F6'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#E5E7EB'
                          e.currentTarget.style.background = 'white'
                        }}
                      >
                        <img 
                          src={property.image || ASSETS.PLACEHOLDER_PROPERTY} 
                          alt={property.title}
                          style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', marginBottom: '4px' }}>{property.title}</div>
                          <div style={{ fontSize: '14px', color: '#6B7280' }}>{property.location}</div>
                          <div style={{ fontSize: '14px', color: '#3B82F6', marginTop: '4px' }}>
                            ₱{property.price.toLocaleString()}{property.price_type ? `/${property.price_type}` : '/mo'}
                          </div>
                        </div>
                        {featuredListings.some(l => l.id === property.id) && (
                          <FiCheck style={{ color: '#10B981', fontSize: '20px' }} />
                        )}
                      </div>
                    ))}
                  </div>
                  {featuredListings.length > 0 && (
                    <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #E5E7EB' }}>
                      <h4 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Selected Listings:</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {featuredListings.map((listing, index) => (
                          <div
                            key={listing.id}
                            style={{
                              padding: '10px',
                              background: '#F3F4F6',
                              borderRadius: '6px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <span style={{ fontSize: '14px' }}>{listing.title}</span>
                            <button
                              onClick={() => handleRemoveFeaturedListing(index)}
                              style={{
                                padding: '4px 8px',
                                background: '#EF4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                    <button 
                      className="save-changes-button"
                      onClick={() => setShowFeaturedListingsModal(false)}
                      style={{ flex: 1 }}
                    >
                      Done
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Testimonials Modal */}
      {showTestimonialsModal && (
        <div className="modal-overlay" onClick={() => setShowTestimonialsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h3>{editingTestimonialIndex !== null ? 'Edit' : 'Add'} Testimonial</h3>
              <button className="modal-close" onClick={() => setShowTestimonialsModal(false)}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              {testimonials.length > 0 && (
                <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #E5E7EB' }}>
                  <h4 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Current Testimonials:</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {testimonials.map((testimonial, index) => (
                      <div
                        key={testimonial.id}
                        style={{
                          padding: '12px',
                          background: '#F3F4F6',
                          borderRadius: '6px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', marginBottom: '4px' }}>{testimonial.name}</div>
                          <div style={{ fontSize: '12px', color: '#6B7280' }}>{testimonial.role}</div>
                          <div style={{ fontSize: '12px', fontStyle: 'italic', marginTop: '4px' }}>
                            "{testimonial.content.substring(0, 50)}..."
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => {
                              setEditingTestimonialIndex(index)
                            }}
                            style={{
                              padding: '6px 12px',
                              background: '#3B82F6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTestimonial(index)}
                            style={{
                              padding: '6px 12px',
                              background: '#EF4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <TestimonialForm
                testimonial={editingTestimonialIndex !== null ? testimonials[editingTestimonialIndex] : null}
                availableTestimonials={availableTestimonials}
                onSave={handleSaveTestimonial}
                onCancel={() => {
                  setShowTestimonialsModal(false)
                  setEditingTestimonialIndex(null)
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Page URL Modal */}
      {showPageUrlModal && pageUrl && (
        <div className="modal-overlay" onClick={() => setShowPageUrlModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3>Your Page is Live! 🎉</h3>
              <button className="modal-close" onClick={() => setShowPageUrlModal(false)}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: '#6B7280', marginBottom: '16px' }}>
                Your page has been published and is now accessible via the link below. Share it across multiple platforms!
              </p>
              <div style={{ 
                padding: '16px', 
                background: '#F3F4F6', 
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <div style={{ marginBottom: '8px', fontWeight: '600', color: '#111827', fontSize: '14px' }}>
                  Page URL:
                </div>
                <div style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  alignItems: 'center',
                  wordBreak: 'break-all'
                }}>
                  <a 
                    href={pageUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      color: '#3B82F6', 
                      textDecoration: 'none',
                      flex: 1,
                      fontSize: '14px'
                    }}
                  >
                    {pageUrl}
                  </a>
                  <button
                    onClick={handleCopyUrl}
                    style={{
                      padding: '8px 16px',
                      background: '#3B82F6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Copy Link
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className="save-changes-button"
                  onClick={() => {
                    setShowPageUrlModal(false)
                    window.open(pageUrl, '_blank')
                  }}
                  style={{ flex: 1 }}
                >
                  <FiExternalLink style={{ marginRight: '8px' }} />
                  Open Page
                </button>
                <button 
                  className="save-changes-button"
                  onClick={() => setShowPageUrlModal(false)}
                  style={{ flex: 1, background: '#F3F4F6', color: '#111827' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Page Preview Modal */}
      {showFullPreview && (
        <div className="full-preview-overlay" onClick={() => setShowFullPreview(false)}>
          <div className="full-preview-container" onClick={(e) => e.stopPropagation()}>
            <div className="full-preview-header">
              <h2 className="full-preview-title">
                {activeTab === 'profile' ? 'Profile Page Preview' : 'Property Page Preview'}
              </h2>
              <button 
                className="full-preview-close"
                onClick={() => setShowFullPreview(false)}
                aria-label="Close preview"
              >
                <FiX />
              </button>
            </div>
            <div className="full-preview-content">
              {activeTab === 'profile' ? (
                <div className="full-preview-page">
                  {/* Profile Preview */}
                  <div className="full-preview-profile-section">
                    <div className="full-preview-profile-header">
                      <div className="full-preview-profile-image-wrapper">
                        <img 
                          src={profileImage || ASSETS.PLACEHOLDER_PROFILE} 
                          alt="Profile"
                          className="full-preview-profile-image"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                        <div className="full-preview-profile-fallback">JA</div>
                      </div>
                      <div className="full-preview-profile-info">
                        <h2 className="full-preview-name">{profileCardName || 'Your Name'}</h2>
                        {showBio && <p className="full-preview-tagline">{bio || 'Your bio will appear here...'}</p>}
                        {showContactNumber && (
                          <div className="full-preview-contact-icons">
                            {contactInfo.email && (
                              <button className="full-preview-contact-icon" title={contactInfo.email}>
                                <FiMail />
                              </button>
                            )}
                            {contactInfo.phone && (
                              <button className="full-preview-contact-icon" title={contactInfo.phone}>
                                <FiPhone />
                              </button>
                            )}
                            {contactInfo.message && (
                              <button className="full-preview-contact-icon" title={contactInfo.message}>
                                <FiMessageCircle />
                              </button>
                            )}
                            {contactInfo.website && (
                              <button className="full-preview-contact-icon" title={contactInfo.website}>
                                <FiGlobe />
                              </button>
                            )}
                          </div>
                        )}
                        {showExperienceStats && experienceStats.length > 0 && (
                          <div className="full-preview-experience-stats">
                            {experienceStats.map((stat, index) => (
                              <div key={index} className="full-preview-stat-item">
                                <div className="full-preview-stat-value">{stat.value}</div>
                                <div className="full-preview-stat-label">{stat.label}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {showFeaturedListings && featuredListings.length > 0 && (
                    <div className="full-preview-featured-section">
                      <h3 className="full-preview-section-title">Featured Listings</h3>
                      <div className="full-preview-listings-grid">
                        {featuredListings.map((listing) => (
                          <div key={listing.id} className="full-preview-listing-card">
                            <div className="full-preview-listing-badge">
                              <FiStar className="full-preview-star-icon" />
                              <span>Featured</span>
                            </div>
                            <div className="full-preview-listing-image-wrapper">
                              <img src={listing.image || ASSETS.PLACEHOLDER_PROPERTY} alt={listing.title} />
                            </div>
                            <div className="full-preview-listing-info">
                              <div className="full-preview-listing-info-header">
                                <div className="full-preview-listing-price">{formatPropertyPrice(listing)}</div>
                                <button className="full-preview-listing-heart" aria-label="Favorite">
                                  <FiHeart />
                                </button>
                              </div>
                              <div className="full-preview-listing-title">{listing.title}</div>
                              <div className="full-preview-listing-category">{listing.type}</div>
                              <div className="full-preview-listing-info-footer">
                                <div className="full-preview-listing-date">{formatPropertyDate(listing)}</div>
                                <div className="full-preview-listing-view-count">
                                  <span>1</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {showTestimonials && testimonials.length > 0 && (
                    <div className="full-preview-testimonials-section">
                      <h3 className="full-preview-section-title">Client Testimonials</h3>
                      <div className="full-preview-testimonials-grid">
                        {testimonials.map((testimonial) => (
                          <div key={testimonial.id} className="full-preview-testimonial-card">
                            <div className="full-preview-testimonial-header">
                              <img 
                                src={testimonial.avatar || ASSETS.PLACEHOLDER_PROFILE} 
                                alt={testimonial.name}
                                className="full-preview-testimonial-avatar"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                              <div className="full-preview-testimonial-avatar-fallback">
                                {testimonial.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className="full-preview-testimonial-name">{testimonial.name}</div>
                            </div>
                            <p className="full-preview-testimonial-quote">"{testimonial.content}"</p>
                            {testimonial.role && (
                              <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '8px' }}>
                                {testimonial.role}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="full-preview-property-page">
                  {/* Property Preview */}
                  {layoutSections.map((section) => {
                    if (!section.visible) return null
                    
                    switch (section.id) {
                      case 'hero':
                        return (
                          <div key={section.id} className="full-preview-property-hero-section">
                            <div 
                              className="full-preview-property-hero-image"
                              style={{
                                backgroundImage: heroImage ? `url(${heroImage})` : 'none',
                                backgroundColor: heroImage ? 'transparent' : '#E5E7EB',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                position: 'relative',
                                filter: `brightness(${100 - overallDarkness}%)`
                              }}
                            >
                              <div className="full-preview-property-hero-overlay">
                                <h1 className="full-preview-property-hero-title">{mainHeading || 'Property Title'}</h1>
                                <p className="full-preview-property-hero-tagline">{tagline || 'Property tagline will appear here...'}</p>
                                <button className="full-preview-property-hero-price-btn">
                                  Starts at {propertyPrice || 'Price'} /mo
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      
                      case 'propertyDescription':
                        return (
                          <div key={section.id} className="full-preview-property-about-section">
                            <h2 className="full-preview-property-section-heading">About</h2>
                            <p className="full-preview-property-about-text">{propertyDescription || 'Property description will appear here...'}</p>
                          </div>
                        )
                      
                      case 'propertyImages':
                        return (
                          <div key={section.id} className="full-preview-property-inside-section">
                            <h2 className="full-preview-property-section-heading">What's Inside?</h2>
                            <div className="full-preview-property-inside-images">
                              {propertyImages.length > 0 ? (
                                propertyImages.map((image, index) => (
                                  <div 
                                    key={index} 
                                    className="full-preview-property-inside-image-item"
                                    style={{ borderRadius: getCornerRadiusClass() }}
                                  >
                                    <img src={image} alt={`Interior ${index + 1}`} />
                                  </div>
                                ))
                              ) : (
                                <p style={{ color: '#6B7280', fontStyle: 'italic' }}>Property images will appear here...</p>
                              )}
                            </div>
                          </div>
                        )
                      
                      case 'profileCard':
                        return (
                          <div 
                            key={section.id}
                            className="full-preview-property-agent-card"
                            style={{
                              backgroundColor: selectedBrandColor === 'white' ? '#3B82F6' : 
                                             selectedBrandColor === 'dark' ? '#1F2937' :
                                             selectedBrandColor === 'orange' ? '#F97316' :
                                             selectedBrandColor === 'blue' ? '#3B82F6' : '#3B82F6',
                              borderRadius: getCornerRadiusClass()
                            }}
                          >
                            <div className="full-preview-property-agent-content">
                              <div className="full-preview-property-agent-image-wrapper">
                                <img src={profileImage || profileCardImage} alt={profileCardName || 'Agent'} className="full-preview-property-agent-image" />
                              </div>
                              <div className="full-preview-property-agent-info">
                                <h3 className="full-preview-property-agent-name">{profileCardName || 'Your Name'}</h3>
                                <p className="full-preview-property-agent-role">{profileCardRole || 'Property Agent'}</p>
                                <p className="full-preview-property-agent-quote">{bio || profileCardBio || 'Your bio from Profile page'}</p>
                                <div className="full-preview-property-agent-icons">
                                  {contactInfo.email && (
                                    <a href={`mailto:${contactInfo.email}`} className="full-preview-property-agent-icon">
                                      <FiMail />
                                    </a>
                                  )}
                                  {contactInfo.phone && (
                                    <a href={`tel:${contactInfo.phone}`} className="full-preview-property-agent-icon">
                                      <FiPhone />
                                    </a>
                                  )}
                                  {contactInfo.message && (
                                    <a href={contactInfo.message} className="full-preview-property-agent-icon" target="_blank" rel="noopener noreferrer">
                                      <FiMessageCircle />
                                    </a>
                                  )}
                                  {contactInfo.website && (
                                    <a href={contactInfo.website} className="full-preview-property-agent-icon" target="_blank" rel="noopener noreferrer">
                                      <FiGlobe />
                                    </a>
                                  )}
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
                  <div className="full-preview-property-contact-section">
                    <div className="full-preview-property-contact-left">
                      <h2 className="full-preview-property-section-heading">Ready To View?</h2>
                      <p className="full-preview-property-contact-text">Schedule a tour or ask any questions about the property.</p>
                      <div className="full-preview-property-contact-info">
                        <div className="full-preview-property-contact-item">
                          <FiPhone className="full-preview-property-contact-icon" />
                          <span>{contactInfo.phone || 'Phone number'}</span>
                        </div>
                        <div className="full-preview-property-contact-item">
                          <FiMail className="full-preview-property-contact-icon" />
                          <span>{contactInfo.email || 'Email address'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="full-preview-property-contact-form">
                      <h3 className="full-preview-property-form-title">Contact {profileCardName || 'Agent'}</h3>
                      <input
                        type="text"
                        className="full-preview-property-form-input"
                        placeholder="Your name"
                        value={contactFormName}
                        onChange={(e) => setContactFormName(e.target.value)}
                      />
                      <input
                        type="email"
                        className="full-preview-property-form-input"
                        placeholder="Your email"
                        value={contactFormEmail}
                        onChange={(e) => setContactFormEmail(e.target.value)}
                      />
                      <textarea
                        className="full-preview-property-form-textarea"
                        placeholder="Your message"
                        value={contactFormMessage}
                        onChange={(e) => setContactFormMessage(e.target.value)}
                        rows={4}
                      />
                      <button 
                        className="full-preview-property-form-submit-btn"
                        onClick={handleContactFormSubmit}
                        type="submit"
                      >
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
      )}
    </div>
  )
}

// Testimonial Form Component
function TestimonialForm({ 
  testimonial, 
  availableTestimonials,
  onSave, 
  onCancel 
}: { 
  testimonial: Testimonial | null
  availableTestimonials: Testimonial[]
  onSave: (testimonial: Testimonial) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(testimonial?.name || '')
  const [role, setRole] = useState(testimonial?.role || '')
  const [content, setContent] = useState(testimonial?.content || '')
  const [avatar, setAvatar] = useState(testimonial?.avatar || '')
  const [useExisting, setUseExisting] = useState(false)
  const [selectedTestimonialId, setSelectedTestimonialId] = useState<number | null>(null)
  
  const handleUseExisting = () => {
    if (selectedTestimonialId) {
      const selected = availableTestimonials.find(t => t.id === selectedTestimonialId)
      if (selected) {
        onSave(selected)
      }
    }
  }
  
  const handleSaveCustom = () => {
    if (!name || !content) {
      alert('Please fill in name and content')
      return
    }
    
    const newTestimonial: Testimonial = {
      id: testimonial?.id || Date.now(),
      name,
      role: role || '',
      content,
      avatar: avatar || null
    }
    onSave(newTestimonial)
  }
  
  return (
    <>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <input
            type="checkbox"
            checked={useExisting}
            onChange={(e) => setUseExisting(e.target.checked)}
          />
          <span>Use existing testimonial</span>
        </label>
      </div>
      
      {useExisting ? (
        <>
          <select
            value={selectedTestimonialId || ''}
            onChange={(e) => setSelectedTestimonialId(Number(e.target.value))}
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #E5E7EB', 
              borderRadius: '8px', 
              marginBottom: '16px' 
            }}
          >
            <option value="">Select a testimonial</option>
            {availableTestimonials.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} - {t.role}
              </option>
            ))}
          </select>
          {selectedTestimonialId && (
            <div style={{ 
              padding: '12px', 
              background: '#F3F4F6', 
              borderRadius: '8px', 
              marginBottom: '16px' 
            }}>
              {(() => {
                const selected = availableTestimonials.find(t => t.id === selectedTestimonialId)
                return selected ? (
                  <>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>{selected.name}</div>
                    <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>{selected.role}</div>
                    <div style={{ fontSize: '14px', fontStyle: 'italic' }}>"{selected.content}"</div>
                  </>
                ) : null
              })()}
            </div>
          )}
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Client Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '8px', marginBottom: '12px' }}
          />
          <input
            type="text"
            placeholder="Client Role (e.g., Lessee, Property Owner)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '8px', marginBottom: '12px' }}
          />
          <textarea
            placeholder="Testimonial content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '8px', marginBottom: '12px' }}
          />
          <input
            type="text"
            placeholder="Avatar URL (optional)"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '8px', marginBottom: '16px' }}
          />
        </>
      )}
      
      <div style={{ display: 'flex', gap: '12px' }}>
        <button 
          className="save-changes-button"
          onClick={useExisting ? handleUseExisting : handleSaveCustom}
          style={{ flex: 1 }}
          disabled={useExisting ? !selectedTestimonialId : (!name || !content)}
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

