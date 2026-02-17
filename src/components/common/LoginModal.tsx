import { useState } from 'react'
import { authApi } from '../../api'
import { ASSETS } from '@/utils/assets'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onRegisterClick: () => void
}

function LoginModal({ isOpen, onClose, onRegisterClick }: LoginModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setLoginError(null)

    try {
      // Use unified login endpoint (handles both agents and admins)
      const response = await authApi.login({
        email,
        password,
        remember: rememberMe,
      })

      if (response.success && response.data?.token) {
        // Clear old localStorage data first to avoid stale data
        localStorage.removeItem('agent_name')
        localStorage.removeItem('user_name')
        localStorage.removeItem('agent_id')
        localStorage.removeItem('user_email')
        
        // Store token and proceed with login
        localStorage.setItem('auth_token', response.data.token)
        
        // Determine if user is admin or agent from response
        const isAdmin = !!response.data?.admin || response.data?.role === 'admin'
        const userData = isAdmin ? response.data?.admin : (response.data?.agent || response.data?.user)
        
        console.log('Login response userData:', userData) // Debug log
        
        // Store user name if available (construct from first_name and last_name)
        const userName = userData?.first_name && userData?.last_name 
          ? `${userData.first_name} ${userData.last_name}` 
          : (userData?.email ? userData.email.split('@')[0] : null)
        
        if (userName) {
          localStorage.setItem('agent_name', userName)
          localStorage.setItem('user_name', userName) // Also store as generic user_name
          console.log('Stored userName:', userName) // Debug log
        }
        
        // Store agent ID if available
        if (userData?.id && !isAdmin) {
          localStorage.setItem('agent_id', userData.id.toString())
          console.log('Stored agent_id:', userData.id) // Debug log
        }
        
        // Store email for reference
        if (userData?.email) {
          localStorage.setItem('user_email', userData.email)
          console.log('Stored user_email:', userData.email) // Debug log
        }
        
        // Store user role (admin or agent)
        const userRole = response.data?.role || (isAdmin ? 'admin' : 'agent')
        localStorage.setItem('agent_role', userRole)
        localStorage.setItem('user_role', userRole) // Also store as generic user_role
        
        // Check if account status is pending and store it (only for agents)
        if (userRole === 'agent' && !isAdmin) {
          // Access agent data directly since we know it's an agent
          const agentData = response.data?.agent
          const agentStatus = agentData?.status
          
          // Valid statuses are: 'pending' | 'approved' | 'rejected' | null
          if (agentStatus === 'pending') {
            localStorage.setItem('agent_registration_status', 'processing')
            localStorage.setItem('agent_registered_email', email)
            localStorage.setItem('agent_status', agentStatus)
          } else {
            // Clear processing status if account is approved or rejected
            localStorage.removeItem('agent_registration_status')
            localStorage.removeItem('agent_registered_email')
            localStorage.setItem('agent_status', agentStatus || 'active')
          }
        }
        
        onClose()
        // Redirect based on role
        if (userRole === 'admin') {
          window.location.href = '/admin'
        } else if (userRole === 'broker') {
          window.location.href = '/broker'
        } else {
          window.location.href = '/agent'
        }
      } else {
        setLoginError(response.message || 'Login failed. Please try again.')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      
      if (error.response?.data?.message) {
        setLoginError(error.response.data.message)
      } else if (error.message) {
        setLoginError(error.message)
      } else {
        setLoginError('Invalid email or password. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-[90%] max-w-[1000px] max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-[0px_10px_40px_rgba(0,0,0,0.2)]" onClick={(e) => e.stopPropagation()}>
        <button className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center border-0 bg-transparent text-3xl leading-none text-gray-400 transition-colors hover:text-gray-700" onClick={onClose}>
          ✕
        </button>
        <div className="flex min-h-[580px] md:flex-col">
          {/* Left Side - Background and Branding */}
          <div className="relative flex flex-1 items-center justify-center bg-gradient-to-b from-[#B8D4F1] to-[#89B5E3] p-10 px-7.5 md:p-10 md:px-5" style={{ padding: 0, position: 'relative' }}>
            <img
              src={ASSETS.BG_LOGIN}
              alt="Login Background"
              className="absolute inset-0 z-0 h-full w-full rounded-l-2xl object-cover"
            />
            <div className="relative z-10 max-w-[450px] text-center">
              <img
                src={ASSETS.LOGO_FOOTER_WHITE}
                alt="Rentals.ph Logo White"
                className="mx-auto mb-6 h-auto w-full max-w-[420px]"
                style={{ marginBottom: '24px', width: '320px', height: 'auto' }}
              />
            </div>
          </div>
          {/* Right Side - Form */}
          <div className="relative flex max-w-[500px] flex-1 flex-col justify-center rounded-r-2xl border-l-[1.5px] border-gray-200 bg-white/95 px-12 py-15 shadow-[0_4px_32px_rgba(32,94,215,0.08)] md:px-7.5 md:py-10">
            <h2 className="text-center font-outfit text-4xl font-bold text-rental-orange-500 [text-shadow:0_2px_8px_rgba(254,142,10,0.08)] md:text-4xl">
              LOGIN
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.75">
              {/* Error Message */}
              {loginError && (
                <div className="mb-5 rounded border border-red-300 bg-red-100 px-4 py-3 font-outfit text-sm text-red-900">
                  {loginError}
                </div>
              )}
              <div className="mb-2 flex flex-col gap-2.5 rounded-lg shadow-[0_1px_4px_rgba(32,94,215,0.04)]">
                <label htmlFor="email" className="font-outfit text-sm font-medium leading-snug text-gray-800">
                  Email
                </label>
                <div className="relative flex items-center">
                  <svg className="pointer-events-none absolute left-3.5 z-10 h-5 w-5" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.6667 5.83333V14.1667C16.6667 15.0871 15.9205 15.8333 15 15.8333H5C4.07953 15.8333 3.33333 15.0871 3.33333 14.1667V5.83333M16.6667 5.83333C16.6667 4.91286 15.9205 4.16667 15 4.16667H5C4.07953 4.16667 3.33333 4.91286 3.33333 5.83333M16.6667 5.83333L10 10.8333L3.33333 5.83333" stroke="#FE8E0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="w-full rounded-md border-[1.5px] border-gray-200 bg-white py-3 pl-14 pr-4 font-outfit text-sm leading-snug text-gray-700 shadow-[0_1px_4px_rgba(32,94,215,0.04)] transition-all placeholder:text-gray-400 focus:border-rental-blue-600 focus:bg-white focus:shadow-[0_0_0_3px_rgba(32,94,215,0.1)] focus:outline-none"
                  />
                </div>
              </div>
              <div className="mb-2 flex flex-col gap-2.5 rounded-lg shadow-[0_1px_4px_rgba(32,94,215,0.04)]">
                <label htmlFor="password" className="font-outfit text-sm font-medium leading-snug text-gray-800">
                  Password
                </label>
                <div className="relative flex items-center">
                  <svg className="pointer-events-none absolute left-3.5 z-10 h-5 w-5" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5.83333 9.16667V5.83333C5.83333 3.53215 7.69881 1.66667 10 1.66667C12.3012 1.66667 14.1667 3.53215 14.1667 5.83333V9.16667M10 12.5V14.1667M6.66667 18.3333H13.3333C14.2538 18.3333 15 17.5871 15 16.6667V10.8333C15 9.91286 14.2538 9.16667 13.3333 9.16667H6.66667C5.74619 9.16667 5 9.91286 5 10.8333V16.6667C5 17.5871 5.74619 18.3333 6.66667 18.3333Z" stroke="#FE8E0A" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="w-full rounded-md border-[1.5px] border-gray-200 bg-white py-3 pl-14 pr-4 font-outfit text-sm leading-snug text-gray-700 shadow-[0_1px_4px_rgba(32,94,215,0.04)] transition-all placeholder:text-gray-400 focus:border-rental-blue-600 focus:bg-white focus:shadow-[0_0_0_3px_rgba(32,94,215,0.1)] focus:outline-none"
                  />
                  <button
                    type="button"
                    className="absolute right-3 z-10 flex cursor-pointer items-center justify-center border-0 bg-transparent p-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                        <path d="M3 3L21 21M10.5 10.5C10.1872 10.8128 10 11.2403 10 11.7C10 12.7046 10.7954 13.5 11.8 13.5C12.2597 13.5 12.6872 13.3128 13 13M6.6 6.6C4.6146 8.0732 3 10.2727 3 12C3 15.314 6.9 19 12 19C13.7273 19 15.9268 18.3854 17.4 16.4M9 5.2C9.9585 4.9 11.0015 4.8 12 4.8C17.1 4.8 21 8.486 21 11.8C21 12.7985 20.1 14.841 19.2 16" stroke="#FE8E0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                        <path d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5Z" stroke="#FE8E0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="#FE8E0A" strokeWidth="2"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 cursor-pointer accent-rental-blue-600"
                />
                <label htmlFor="remember" className="cursor-pointer select-none font-outfit text-sm font-normal text-gray-600">
                  Remember me
                </label>
              </div>
              <button type="submit" className="mt-2 cursor-pointer rounded-md border-0 bg-rental-blue-600 px-4 py-3.5 font-outfit text-base font-semibold leading-snug text-white shadow-sm transition-all hover:bg-rental-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <div className="mt-10 pb-2 text-center text-base text-gray-700">
              <p className="m-0 mb-2.5 font-outfit text-sm leading-snug text-gray-500">
                Don't have an account?
              </p>
              <button className="cursor-pointer border-0 bg-transparent p-0 font-outfit text-sm font-semibold leading-snug text-rental-orange-500 underline hover:text-rental-orange-600" onClick={onRegisterClick}>
                Register as Agent
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginModal

