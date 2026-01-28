import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'

function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const location = useLocation()

  const handleLoginClick = () => {
    setIsLoginOpen(true)
  }

  const handleRegisterClick = () => {
    setIsLoginOpen(false)
    setIsRegisterOpen(true)
  }

  return (
    <>
      <header className="navbar-container flex items-center justify-between">
        <div className="flex items-center gap-4 ">
          <img
            src="/assets/rentals-logo-hero-13c7b5.png"
            alt="Rentals.ph logo"
            className="h-[60px] w-auto mr-10"
          />
        </div>

        <nav className="flex items-center gap-2">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            HOME
          </Link>
          <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>
            ABOUT US
          </Link>
          <Link to="/properties" className={`nav-link ${location.pathname === '/properties' ? 'active' : ''}`}>
            PROPERTIES
          </Link>
          <Link to="/rent-managers" className={`nav-link ${location.pathname === '/rent-managers' ? 'active' : ''}`}>
            RENT MANAGERS
          </Link>
          <Link to="/blog" className={`nav-link ${location.pathname === '/blog' ? 'active' : ''}`}>
            BLOG
          </Link>
          <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>
            CONTACT US
          </Link>
          <button className="login-button" onClick={handleLoginClick}>
            Login/Register
          </button>
        </nav>
      </header>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onRegisterClick={handleRegisterClick}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </>
  )
}

export default Navbar

