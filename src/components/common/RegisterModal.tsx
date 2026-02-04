import React, { useState } from 'react'
import { authApi } from '../../api'
import './RegisterModal.css'

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
}

function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      // Validate email format
      if (!email.trim()) {
        setSubmitError('Please enter your LR Email Account')
        setIsSubmitting(false)
        return
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setSubmitError('Please enter a valid email address')
        setIsSubmitting(false)
        return
      }

      if (!password || password.length < 8) {
        setSubmitError('Password must be at least 8 characters')
        setIsSubmitting(false)
        return
      }

      const response = await authApi.register({
        email: email.trim(),
        password,
      })

      if (response.success) {
        setSubmitSuccess(true)
        setTimeout(() => {
          onClose()
          // Optionally redirect to login or show success message
        }, 2000)
      } else {
        setSubmitError(response.message || 'Registration failed. Please try again.')
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const errors = error.response.data.errors
        const errorMessages = Object.values(errors).flat().join(', ')
        setSubmitError(errorMessages)
      } else if (error.response?.data?.message) {
        setSubmitError(error.response.data.message)
      } else if (error.message) {
        setSubmitError(error.message)
      } else {
        setSubmitError('Registration failed. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="register-modal-container simple-register" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>

        <div className="register-modal-content">
          <h2 className="register-title">Register</h2>
          <p className="register-subtitle">Please enter your LR Email Account to register</p>

          {/* Success Message */}
          {submitSuccess && (
            <div className="alert alert-success" style={{ 
              padding: '12px 16px', 
              marginBottom: '20px', 
              backgroundColor: '#d4edda', 
              color: '#155724', 
              borderRadius: '4px',
              border: '1px solid #c3e6cb'
            }}>
              Registration successful! You can now login.
            </div>
          )}

          {/* Error Message */}
          {submitError && (
            <div className="alert alert-error" style={{ 
              padding: '12px 16px', 
              marginBottom: '20px', 
              backgroundColor: '#f8d7da', 
              color: '#721c24', 
              borderRadius: '4px',
              border: '1px solid #f5c6cb'
            }}>
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form simple-form">
            <div className="form-group">
              <label htmlFor="email">LR Email Account *</label>
              <div className="input-with-icon">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16.6667 5.83333V14.1667C16.6667 15.0871 15.9205 15.8333 15 15.8333H5C4.07953 15.8333 3.33333 15.0871 3.33333 14.1667V5.83333M16.6667 5.83333C16.6667 4.91286 15.9205 4.16667 15 4.16667H5C4.07953 4.16667 3.33333 4.91286 3.33333 5.83333M16.6667 5.83333L10 10.8333L3.33333 5.83333" stroke="#FE8E0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your LR email account"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <div className="input-with-icon">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5.83333 9.16667V5.83333C5.83333 3.53215 7.69881 1.66667 10 1.66667C12.3012 1.66667 14.1667 3.53215 14.1667 5.83333V9.16667M10 12.5V14.1667M6.66667 18.3333H13.3333C14.2538 18.3333 15 17.5871 15 16.6667V10.8333C15 9.91286 14.2538 9.16667 13.3333 9.16667H6.66667C5.74619 9.16667 5 9.91286 5 10.8333V16.6667C5 17.5871 5.74619 18.3333 6.66667 18.3333Z" stroke="#FE8E0A" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                  minLength={8}
                />
              </div>
              <p className="form-hint">Password must be at least 8 characters</p>
            </div>

            <button 
              type="submit" 
              className="register-submit-btn" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterModal
