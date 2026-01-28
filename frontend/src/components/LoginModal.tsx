import { useState } from 'react'
import './LoginModal.css'

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

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log('Login:', { email, password, rememberMe })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="login-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>
        
        <div className="login-modal-content">
          {/* Left Side - Branding */}
          <div className="login-modal-left">
            <div className="login-branding">
              <img
                src="/assets/rentals-logo-hero-13c7b5.png"
                alt="Rentals.ph - Philippines #1 Property Rental Website"
                className="login-logo"
              />
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="login-modal-right">
            <h2 className="login-title">LOGIN</h2>
            
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-with-icon">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.6667 5.83333V14.1667C16.6667 15.0871 15.9205 15.8333 15 15.8333H5C4.07953 15.8333 3.33333 15.0871 3.33333 14.1667V5.83333M16.6667 5.83333C16.6667 4.91286 15.9205 4.16667 15 4.16667H5C4.07953 4.16667 3.33333 4.91286 3.33333 5.83333M16.6667 5.83333L10 10.8333L3.33333 5.83333" stroke="#FE8E0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-with-icon">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5.83333 9.16667V5.83333C5.83333 3.53215 7.69881 1.66667 10 1.66667C12.3012 1.66667 14.1667 3.53215 14.1667 5.83333V9.16667M10 12.5V14.1667M6.66667 18.3333H13.3333C14.2538 18.3333 15 17.5871 15 16.6667V10.8333C15 9.91286 14.2538 9.16667 13.3333 9.16667H6.66667C5.74619 9.16667 5 9.91286 5 10.8333V16.6667C5 17.5871 5.74619 18.3333 6.66667 18.3333Z" stroke="#FE8E0A" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M3 3L21 21M10.5 10.5C10.1872 10.8128 10 11.2403 10 11.7C10 12.7046 10.7954 13.5 11.8 13.5C12.2597 13.5 12.6872 13.3128 13 13M6.6 6.6C4.6146 8.0732 3 10.2727 3 12C3 15.314 6.9 19 12 19C13.7273 19 15.9268 18.3854 17.4 16.4M9 5.2C9.9585 4.9 11.0015 4.8 12 4.8C17.1 4.8 21 8.486 21 11.8C21 12.7985 20.1 14.841 19.2 16" stroke="#FE8E0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5Z" stroke="#FE8E0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="#FE8E0A" strokeWidth="2"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="form-checkbox">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember">Remember me</label>
              </div>

              <button type="submit" className="login-submit-btn">
                Login
              </button>
            </form>

            <div className="login-footer">
              <p>Don't have an account?</p>
              <button className="register-link" onClick={onRegisterClick}>
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

