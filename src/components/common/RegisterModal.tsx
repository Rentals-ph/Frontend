import React, { useState } from 'react'
import { authApi } from '../../api'

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
        setSubmitError('Please enter your Email Account')
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
      <div className="relative w-[90%] max-w-[500px] max-h-[90vh] overflow-hidden rounded-2xl bg-white px-12 py-15 shadow-[0px_10px_40px_rgba(0,0,0,0.2)] md:px-7.5 md:py-10" onClick={(e) => e.stopPropagation()}>
        <button className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center border-0 bg-transparent text-3xl leading-none text-gray-400 transition-colors hover:text-gray-700" onClick={onClose}>
          ✕
        </button>

        <div className="p-0">
          <h2 className="m-0 mb-3 text-center font-outfit text-5xl font-bold leading-none tracking-[3px] text-rental-orange-500 md:text-4xl">
            Register
          </h2>
          <p className="m-0 mb-9 text-center font-outfit text-sm font-normal leading-snug text-gray-500">
            Please enter your Email Account to register
          </p>

          {/* Success Message */}
          {submitSuccess && (
            <div className="mb-5 rounded border border-green-300 bg-green-100 px-4 py-3 font-outfit text-sm leading-snug text-green-900">
              Registration successful! You can now login.
            </div>
          )}

          {/* Error Message */}
          {submitError && (
            <div className="mb-5 rounded border border-red-300 bg-red-100 px-4 py-3 font-outfit text-sm leading-snug text-red-900">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-0 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-outfit text-sm font-medium leading-snug text-gray-800">
                Email Account *
              </label>
              <div className="relative flex items-center">
                <svg className="pointer-events-none absolute left-3.5 z-10 h-5 w-5" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16.6667 5.83333V14.1667C16.6667 15.0871 15.9205 15.8333 15 15.8333H5C4.07953 15.8333 3.33333 15.0871 3.33333 14.1667V5.83333M16.6667 5.83333C16.6667 4.91286 15.9205 4.16667 15 4.16667H5C4.07953 4.16667 3.33333 4.91286 3.33333 5.83333M16.6667 5.83333L10 10.8333L3.33333 5.83333" stroke="#FE8E0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email account"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="w-full rounded-md border border-gray-200 bg-white py-3 pl-14 pr-4 font-outfit text-sm leading-snug text-gray-700 transition-all placeholder:italic placeholder:text-gray-400 focus:border-rental-blue-600 focus:bg-white focus:shadow-[0_0_0_3px_rgba(32,94,215,0.1)] focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="font-outfit text-sm font-medium leading-snug text-gray-800">
                Password *
              </label>
              <div className="relative flex items-center">
                <svg className="pointer-events-none absolute left-3.5 z-10 h-5 w-5" width="20" height="20" viewBox="0 0 20 20" fill="none">
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
                  className="w-full rounded-md border border-gray-200 bg-white py-3 pl-14 pr-4 font-outfit text-sm leading-snug text-gray-700 transition-all placeholder:italic placeholder:text-gray-400 focus:border-rental-blue-600 focus:bg-white focus:shadow-[0_0_0_3px_rgba(32,94,215,0.1)] focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
                />
              </div>
              <p className="m-0 mt-1 font-outfit text-xs font-normal text-gray-500">
                Password must be at least 8 characters
              </p>
            </div>

            <button 
              type="submit" 
              className="mt-2 cursor-pointer rounded-md border-0 bg-rental-blue-600 px-4 py-3.5 font-outfit text-base font-semibold leading-snug text-white shadow-sm transition-all hover:bg-rental-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60" 
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
