'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { propertiesApi } from '../../api'
import type { Property } from '../../types'
import { FiX, FiTrash2, FiSave, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import LocationMap from './LocationMap'
import './EditPropertyModal.css'

interface EditPropertyModalProps {
  property: Property | null
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
  onDelete: () => void
}

export default function EditPropertyModal({
  property,
  isOpen,
  onClose,
  onUpdate,
  onDelete
}: EditPropertyModalProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    price: '',
    price_type: 'Monthly',
    bedrooms: '',
    bathrooms: '',
    garage: '',
    area: '',
    lot_area: '',
    floor_area_unit: 'Square Meters',
    furnishing: '',
    city: '',
    state_province: '',
    street_address: '',
    country: 'Philippines',
    video_url: '',
    latitude: '',
    longitude: '',
  })
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([])

  useEffect(() => {
    if (property && isOpen) {
      setFormData({
        title: property.title || '',
        description: property.description || '',
        type: property.type || '',
        price: property.price?.toString() || '',
        price_type: property.price_type || 'Monthly',
        bedrooms: property.bedrooms?.toString() || '',
        bathrooms: property.bathrooms?.toString() || '',
        garage: property.garage?.toString() || '',
        area: property.area?.toString() || '',
        lot_area: property.lot_area?.toString() || '',
        floor_area_unit: property.floor_area_unit || 'Square Meters',
        furnishing: property.furnishing || '',
        city: property.city || '',
        state_province: property.state_province || '',
        street_address: property.street_address || '',
        country: property.country || 'Philippines',
        video_url: property.video_url || '',
        latitude: property.latitude || '',
        longitude: property.longitude || '',
      })
      // Load existing images
      const existing = property.images && Array.isArray(property.images) 
        ? property.images 
        : (property.image_url || property.image ? [property.image_url || property.image] : [])
      setExistingImages(existing.filter(Boolean))
      setImagePreviews([])
      setImageFiles([])
      setImagesToDelete([])
      setCurrentPage(1) // Reset to first page when opening
    }
  }, [property, isOpen])

  // Memoize location change handlers to prevent infinite loops
  const handleLocationChange = useCallback((lat: string, lng: string) => {
    setFormData(prev => {
      // Only update if coordinates actually changed
      if (prev.latitude === lat && prev.longitude === lng) {
        return prev
      }
      return {
        ...prev,
        latitude: lat,
        longitude: lng,
      }
    })
  }, [])

  const handleAddressChange = useCallback((address: { country?: string; state?: string; city?: string; street?: string }) => {
    setFormData(prev => ({
      ...prev,
      country: address.country || prev.country || 'Philippines',
      state_province: address.state || prev.state_province || '',
      city: address.city || prev.city || '',
      street_address: address.street || prev.street_address || '',
    }))
  }, [])

  const totalPages = 2

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const maxSize = 2 * 1024 * 1024 // 2MB
    
    const validFiles: File[] = []
    const newPreviews: string[] = []
    
    files.forEach((file) => {
      // Validate file type
      if (!validTypes.includes(file.type)) {
        alert(`Invalid file type: ${file.name}. Please upload a JPEG, JPG, PNG, GIF, or WEBP image.`)
        return
      }
      
      // Validate file size
      if (file.size > maxSize) {
        alert(`Image file ${file.name} is too large. Maximum size is 2MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
        return
      }
      
      validFiles.push(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        newPreviews.push(reader.result as string)
        if (newPreviews.length === validFiles.length) {
          setImagePreviews(prev => [...prev, ...newPreviews])
        }
      }
      reader.readAsDataURL(file)
    })
    
    if (validFiles.length > 0) {
      setImageFiles(prev => [...prev, ...validFiles])
    }
    
    e.target.value = '' // Clear the input
  }
  
  const handleRemoveNewImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }
  
  const handleRemoveExistingImage = (imageUrl: string) => {
    setExistingImages(prev => prev.filter(img => img !== imageUrl))
    // Track which images to delete from server
    if (property?.images && property.images.includes(imageUrl)) {
      setImagesToDelete(prev => [...prev, imageUrl])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!property) return

    setLoading(true)
    try {
      const formDataToSend = new FormData()
      
      // Add all form fields to FormData
      // Send all fields that have values (including empty strings for optional fields)
      Object.entries(formData).forEach(([key, value]) => {
        // Convert value to string and append
        formDataToSend.append(key, value.toString())
      })

      // Add new images if any
      if (imageFiles.length > 0) {
        imageFiles.forEach((imageFile, index) => {
          // Verify file type before sending
          const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
          if (!validTypes.includes(imageFile.type)) {
            throw new Error(`Invalid image type: ${imageFile.type}. Please upload a JPEG, JPG, PNG, GIF, or WEBP image.`)
          }
          
          // Verify file size (max 2MB = 2048KB)
          const maxSize = 2 * 1024 * 1024 // 2MB in bytes
          if (imageFile.size > maxSize) {
            throw new Error(`Image file ${imageFile.name} is too large. Maximum size is 2MB. Current size: ${(imageFile.size / 1024 / 1024).toFixed(2)}MB`)
          }
          
          // Append each image file
          formDataToSend.append('images[]', imageFile, imageFile.name || `image-${index}.jpg`)
        })
        
        // Also set first image as main image for backward compatibility
        if (imageFiles.length > 0) {
          formDataToSend.append('image', imageFiles[0], imageFiles[0].name || 'image.jpg')
        }
      }

      // Log final FormData before sending
      console.log('Final FormData before sending:', {
        hasImage: formDataToSend.has('image'),
        allKeys: Array.from(formDataToSend.keys()),
      })

      const response = await propertiesApi.update(property.id, formDataToSend)
      
      // Log response to verify image was processed
      if (imageFile && response.data) {
        console.log('Update response - image_path:', response.data.image_path)
        console.log('Update response - image:', response.data.image)
      }
      
      if (response.success) {
        onUpdate()
        onClose()
      } else {
        throw new Error(response.message || 'Failed to update property')
      }
    } catch (error: any) {
      console.error('Error updating property:', error)
      
      // Show error message
      let errorMessage = 'Failed to update property. Please try again.'
      
      if (error.response?.data) {
        if (error.response.data.errors) {
          // Validation errors
          const validationErrors = Object.entries(error.response.data.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('\n')
          errorMessage = `Validation errors:\n${validationErrors}`
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message
        }
      } else if (error.message) {
        errorMessage = error.message
      }
      
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!property) return
    
    if (!confirm(`Are you sure you want to delete "${property.title}"? This action cannot be undone.`)) {
      return
    }

    setDeleteLoading(true)
    try {
      await propertiesApi.delete(property.id)
      onDelete()
      onClose()
    } catch (error: any) {
      console.error('Error deleting property:', error)
      alert(error.response?.data?.message || 'Failed to delete property. Please try again.')
    } finally {
      setDeleteLoading(false)
    }
  }

  if (!isOpen || !property) return null

  return (
    <div className="edit-property-modal-overlay" onClick={onClose}>
      <div className="edit-property-modal" onClick={(e) => e.stopPropagation()}>
        <div className="edit-property-modal-header">
          <h2>Edit Property</h2>
          <button className="edit-property-modal-close" onClick={onClose} type="button">
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-property-modal-form">
          {/* Page Indicator */}
          <div className="edit-property-page-indicator">
            <div className="edit-property-page-tabs">
              <button
                type="button"
                className={`edit-property-page-tab ${currentPage === 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(1)}
              >
                <span className="edit-property-page-number">1</span>
                <span className="edit-property-page-label">Basic Info</span>
              </button>
              <div className="edit-property-page-connector"></div>
              <button
                type="button"
                className={`edit-property-page-tab ${currentPage === 2 ? 'active' : ''}`}
                onClick={() => setCurrentPage(2)}
              >
                <span className="edit-property-page-number">2</span>
                <span className="edit-property-page-label">Location & Media</span>
              </button>
            </div>
          </div>

          <div className="edit-property-modal-content">
            {/* Page 1: Basic Information & Property Details */}
            {currentPage === 1 && (
              <div className="edit-property-page">
                {/* Basic Information */}
                <div className="edit-property-section">
                  <h3>Basic Information</h3>
                  <div className="edit-property-form-grid-2">
                    <div className="edit-property-form-group">
                      <label>Property Type *</label>
                      <div className="edit-property-select-wrap">
                        <select
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select type</option>
                          <option value="Apartment / Condo">Apartment / Condo</option>
                          <option value="House">House</option>
                          <option value="Townhouse">Townhouse</option>
                          <option value="Studio">Studio</option>
                          <option value="Bedspace">Bedspace</option>
                          <option value="Commercial">Commercial</option>
                          <option value="Office">Office</option>
                          <option value="Warehouse">Warehouse</option>
                        </select>
                        <span className="edit-property-select-caret">▼</span>
                      </div>
                    </div>

                    <div className="edit-property-form-group">
                      <label>Furnishing</label>
                      <div className="edit-property-select-wrap">
                        <select
                          name="furnishing"
                          value={formData.furnishing}
                          onChange={handleInputChange}
                        >
                          <option value="">Select</option>
                          <option value="Fully Furnished">Fully Furnished</option>
                          <option value="Semi Furnished">Semi Furnished</option>
                          <option value="Unfurnished">Unfurnished</option>
                        </select>
                        <span className="edit-property-select-caret">▼</span>
                      </div>
                    </div>
                  </div>

                  <div className="edit-property-form-group full-width" style={{ marginTop: '16px' }}>
                    <label>Property Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="edit-property-form-group full-width" style={{ marginTop: '16px' }}>
                    <label>Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={6}
                      required
                    />
                  </div>
                </div>

                {/* Pricing */}
                <div className="edit-property-section">
                  <h3>Pricing</h3>
                  <div className="edit-property-form-grid-2">
                    <div className="edit-property-form-group">
                      <label>Price *</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>

                    <div className="edit-property-form-group">
                      <label>Price Type</label>
                      <div className="edit-property-select-wrap">
                        <select
                          name="price_type"
                          value={formData.price_type}
                          onChange={handleInputChange}
                        >
                          <option value="Monthly">Monthly</option>
                          <option value="Weekly">Weekly</option>
                          <option value="Daily">Daily</option>
                          <option value="Yearly">Yearly</option>
                        </select>
                        <span className="edit-property-select-caret">▼</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Property Specifications */}
                <div className="edit-property-section">
                  <h3>Property Specifications</h3>
                  <div className="edit-property-form-grid-compact">
                    <div className="edit-property-form-group">
                      <label>Bedrooms *</label>
                      <input
                        type="number"
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleInputChange}
                        min="0"
                        className="compact"
                        required
                      />
                    </div>

                    <div className="edit-property-form-group">
                      <label>Bathrooms *</label>
                      <input
                        type="number"
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleInputChange}
                        min="0"
                        className="compact"
                        required
                      />
                    </div>

                    <div className="edit-property-form-group">
                      <label>Garage</label>
                      <input
                        type="number"
                        name="garage"
                        value={formData.garage}
                        onChange={handleInputChange}
                        min="0"
                        className="compact"
                      />
                    </div>
                  </div>

                  <div className="edit-property-form-grid-compact" style={{ marginTop: '16px' }}>
                    <div className="edit-property-form-group">
                      <label>Floor Area</label>
                      <input
                        type="number"
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        min="0"
                        className="compact"
                      />
                    </div>

                    <div className="edit-property-form-group">
                      <label>Unit</label>
                      <div className="edit-property-select-wrap">
                        <select
                          name="floor_area_unit"
                          value={formData.floor_area_unit}
                          onChange={handleInputChange}
                        >
                          <option value="Square Meters">Square Meters</option>
                          <option value="Square Feet">Square Feet</option>
                        </select>
                        <span className="edit-property-select-caret">▼</span>
                      </div>
                    </div>

                    <div className="edit-property-form-group">
                      <label>Lot Area</label>
                      <input
                        type="number"
                        name="lot_area"
                        value={formData.lot_area}
                        onChange={handleInputChange}
                        min="0"
                        className="compact"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Page 2: Location & Media */}
            {currentPage === 2 && (
              <div className="edit-property-page">
                {/* Location */}
                <div className="edit-property-section">
                  <h3>Location</h3>
                  
                  {/* Location Map - Show first for better UX */}
                  <div className="edit-property-form-group full-width" style={{ marginBottom: '20px' }}>
                    <LocationMap
                      latitude={formData.latitude || null}
                      longitude={formData.longitude || null}
                      onLocationChange={handleLocationChange}
                      onAddressChange={handleAddressChange}
                    />
                  </div>

                  {/* Address Fields */}
                  <div className="edit-property-form-grid-2">
                    <div className="edit-property-form-group">
                      <label>Country</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="edit-property-form-group">
                      <label>State/Province</label>
                      <input
                        type="text"
                        name="state_province"
                        value={formData.state_province}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="edit-property-form-grid-2" style={{ marginTop: '16px' }}>
                    <div className="edit-property-form-group">
                      <label>City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="edit-property-form-group">
                      <label>Street Address</label>
                      <input
                        type="text"
                        name="street_address"
                        value={formData.street_address}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Media */}
                <div className="edit-property-section">
                  <h3>Media</h3>
                  <div className="edit-property-form-group full-width">
                    <label>Property Images</label>
                    
                    {/* Existing Images */}
                    {existingImages.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                        {existingImages.map((imageUrl, index) => (
                          <div key={index} style={{ position: 'relative', width: '120px', height: '120px' }}>
                            <img 
                              src={imageUrl} 
                              alt={`Property image ${index + 1}`}
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover', 
                                borderRadius: '8px',
                                border: '2px solid #e5e7eb'
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveExistingImage(imageUrl)}
                              style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '16px',
                                lineHeight: '1',
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* New Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                        {imagePreviews.map((preview, index) => (
                          <div key={index} style={{ position: 'relative', width: '120px', height: '120px' }}>
                            <img 
                              src={preview} 
                              alt={`New image ${index + 1}`}
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover', 
                                borderRadius: '8px',
                                border: '2px solid #3b82f6'
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveNewImage(index)}
                              style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '16px',
                                lineHeight: '1',
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleImageChange}
                      multiple
                      style={{ marginTop: (existingImages.length > 0 || imagePreviews.length > 0) ? '12px' : '0' }}
                    />
                    <small>You can upload multiple images. The first image will be used as the main thumbnail.</small>
                  </div>

                  <div className="edit-property-form-group full-width" style={{ marginTop: '16px' }}>
                    <label>Video URL</label>
                    <input
                      type="url"
                      name="video_url"
                      value={formData.video_url}
                      onChange={handleInputChange}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="edit-property-modal-footer">
            <button
              type="button"
              className="edit-property-delete-btn"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              <FiTrash2 />
              {deleteLoading ? 'Deleting...' : 'Delete Property'}
            </button>
            <div className="edit-property-modal-actions">
              {currentPage > 1 && (
                <button
                  type="button"
                  className="edit-property-nav-btn"
                  onClick={prevPage}
                >
                  <FiChevronLeft />
                  Previous
                </button>
              )}
              {currentPage < totalPages ? (
                <button
                  type="button"
                  className="edit-property-nav-btn"
                  onClick={nextPage}
                >
                  Next
                  <FiChevronRight />
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="edit-property-cancel-btn"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="edit-property-save-btn"
                    disabled={loading}
                  >
                    <FiSave />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

