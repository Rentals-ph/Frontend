'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FiUser, FiLogOut, FiChevronDown, FiHome, FiMenu, FiX } from 'react-icons/fi'
import { ASSETS } from '@/utils/assets'
import { agentsApi } from '@/api'
import LoginModal from '../common/LoginModal'
import RegisterModal from '../common/RegisterModal'

const Navbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
  const [userName, setUserName] = useState('User')
  const [userRole, setUserRole] = useState<'agent' | 'admin' | 'broker'>('agent')
  const pathname = usePathname()
  const router = useRouter()
  const userMenuRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const checkAuthStatus = () => {
    // Check if user is logged in (agent or admin)
    const authToken = localStorage.getItem('auth_token')
    const role = localStorage.getItem('user_role') || localStorage.getItem('agent_role')
    const agentStatus = localStorage.getItem('agent_status')
    
    // For agents, check if they have agent_status
    // For admins, just check if they have auth_token and role is admin
    // For brokers, check if they have auth_token and role is broker
    if (authToken && (role === 'admin' || role === 'broker' || (role === 'agent' && agentStatus))) {
      setIsUserLoggedIn(true)
      // Try to get user name from localStorage - prioritize user_name, then agent_name
      const storedName = localStorage.getItem('user_name') || 
        localStorage.getItem('agent_name') || 
        (role === 'admin' ? 'Admin' : role === 'broker' ? 'Broker' : 'Agent')
      setUserName(storedName)
      setUserRole(role === 'admin' ? 'admin' : role === 'broker' ? 'broker' : 'agent')
    } else {
      setIsUserLoggedIn(false)
      setUserName('User')
      setUserRole('agent')
    }
  }

  useEffect(() => {
    checkAuthStatus()
    
    // If user is logged in as agent but name is missing, try to fetch it
    const authToken = localStorage.getItem('auth_token')
    const role = localStorage.getItem('user_role') || localStorage.getItem('agent_role')
    const storedName = localStorage.getItem('user_name') || localStorage.getItem('agent_name')
    
    if (authToken && role === 'agent' && !storedName) {
      // Fetch agent data to get the name
      agentsApi.getCurrent()
        .then((agent) => {
          if (agent.first_name && agent.last_name) {
            const fullName = `${agent.first_name} ${agent.last_name}`
            localStorage.setItem('agent_name', fullName)
            localStorage.setItem('user_name', fullName)
            setUserName(fullName)
          }
        })
        .catch((error) => {
          console.error('Error fetching agent data in Navbar:', error)
        })
    }
    
    // Listen for storage changes (in case logout happens in another tab/window)
    const handleStorageChange = () => {
      checkAuthStatus()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])
  
  // Also check on location change (in case navigating from agent pages)
  useEffect(() => {
    checkAuthStatus()
  }, [pathname])

  useEffect(() => {
    // Close user menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    if (showUserMenu || isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu, isMobileMenuOpen])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const handleLoginClick = () => {
    setIsLoginOpen(true)
  }

  const handleRegisterClick = () => {
    setIsLoginOpen(false)
    setIsRegisterOpen(true)
  }

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('agent_registration_status')
    localStorage.removeItem('agent_registered_email')
    localStorage.removeItem('agent_status')
    localStorage.removeItem('auth_token')
    localStorage.removeItem('agent_name')
    localStorage.removeItem('agent_role')
    localStorage.removeItem('user_name')
    localStorage.removeItem('user_role')
    
    // Update state immediately
    setIsUserLoggedIn(false)
    setUserName('User')
    setUserRole('agent')
    setShowUserMenu(false)
    
    // If currently on agent, admin, or broker pages, redirect to home and reload
    if (pathname?.startsWith('/agent') || pathname?.startsWith('/admin') || pathname?.startsWith('/broker')) {
      router.push('/')
      // Small delay to ensure navigation happens before reload
      setTimeout(() => {
        window.location.reload()
      }, 100)
    }
    // On public pages, the state update will automatically trigger a re-render
    // showing the login button instead of the profile
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <header className="relative z-[1000] bg-white shadow-md">
        <div className="flex items-center justify-between px-4 py-5 md:px-10 lg:px-20 max-w-full">
          <div className="flex items-center">
            <Link href="/">
              <img
                src={ASSETS.LOGO_HERO_MAIN}
                alt="Rentals.ph logo"
                className="h-12 md:h-[60px] w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation Centered */}
          <div className="hidden md:flex flex-1 justify-center items-center min-w-0">
            <nav className="flex items-center gap-0 lg:gap-8 justify-center w-full">
              <Link href="/" className={`text-rental-blue-600 font-outfit text-base px-2 lg:px-2.5 whitespace-nowrap transition-colors hover:text-rental-orange-500 ${pathname === '/' ? 'font-extrabold tracking-[0.15em]' : 'font-normal'}`}>
                HOME
              </Link>
              <Link href="/about" className={`text-rental-blue-600 font-outfit text-base px-2 lg:px-2.5 whitespace-nowrap transition-colors hover:text-rental-orange-500 ${pathname === '/about' ? 'font-extrabold tracking-[0.15em]' : 'font-normal'}`}>
                ABOUT US
              </Link>
              <Link href="/properties" className={`text-rental-blue-600 font-outfit text-base px-2 lg:px-2.5 whitespace-nowrap transition-colors hover:text-rental-orange-500 ${pathname === '/properties' ? 'font-extrabold tracking-[0.15em]' : 'font-normal'}`}>
                PROPERTIES
              </Link>
              <Link href="/rent-managers" className={`text-rental-blue-600 font-outfit text-base px-2 lg:px-2.5 whitespace-nowrap transition-colors hover:text-rental-orange-500 ${pathname === '/rent-managers' ? 'font-extrabold tracking-[0.15em]' : 'font-normal'}`}>
                RENT MANAGERS
              </Link>
              <Link href="/blog" className={`text-rental-blue-600 font-outfit text-base px-2 lg:px-2.5 whitespace-nowrap transition-colors hover:text-rental-orange-500 ${pathname === '/blog' ? 'font-extrabold tracking-[0.15em]' : 'font-normal'}`}>
                BLOG  
              </Link>
              <Link href="/news" className={`text-rental-blue-600 font-outfit text-base px-2 lg:px-2.5 whitespace-nowrap transition-colors hover:text-rental-orange-500 ${pathname === '/news' ? 'font-extrabold tracking-[0.15em]' : 'font-normal'}`}>
                NEWS
              </Link>
              <Link href="/contact" className={`text-rental-blue-600 font-outfit text-base px-2 lg:px-2.5 whitespace-nowrap transition-colors hover:text-rental-orange-500 ${pathname === '/contact' ? 'font-extrabold tracking-[0.15em]' : 'font-normal'}`}>
                CONTACT US
              </Link>
            </nav>
          </div>
          {/* User/Profile section remains right-aligned */}
          <div className="hidden md:flex items-center justify-end">
            {isUserLoggedIn ? (
              <div className="relative" ref={userMenuRef}>
                <button 
                  className="bg-transparent border-none p-0 cursor-pointer flex items-center"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  aria-label="User menu"
                >
                  <div className="flex items-center gap-2.5 px-2 py-1 rounded-lg transition-colors hover:bg-gray-100">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img 
                        src={ASSETS.PLACEHOLDER_PROFILE} 
                        alt={userName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          target.nextElementSibling?.classList.remove('hidden')
                        }} 
                      />
                      <div className="hidden w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-[15px]">
                        {getInitials(userName)}
                      </div>
                    </div>
                    <div className="flex flex-col gap-0.5 text-left">
                      <span className="text-[15px] font-semibold text-gray-900 font-outfit">{userName}</span>
                      <span className="text-[15px] text-gray-500 font-outfit">
                        {userRole === 'admin' ? 'Admin' : userRole === 'broker' ? 'Broker' : 'Agent'}
                      </span>
                    </div>
                    <FiChevronDown className={`text-base text-gray-500 transition-transform ml-1 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                
                {showUserMenu && (
                  <div className="absolute top-[calc(100%+8px)] right-0 min-w-[180px] bg-white border border-gray-200 rounded-lg shadow-lg z-[1000] overflow-hidden">
                    <button 
                      className="w-full flex items-center gap-3 px-4 py-3 bg-transparent border-none text-left cursor-pointer transition-colors text-[15px] text-gray-900 font-outfit hover:bg-gray-50" 
                      onClick={() => {
                        router.push(userRole === 'admin' ? '/admin' : userRole === 'broker' ? '/broker' : '/agent')
                        setShowUserMenu(false)
                      }}
                    >
                      <FiHome className="text-lg flex-shrink-0" />
                      <span>Dashboard</span>
                    </button>
                    {userRole === 'agent' && (
                      <button 
                        className="w-full flex items-center gap-3 px-4 py-3 bg-transparent border-none text-left cursor-pointer transition-colors text-[15px] text-gray-900 font-outfit hover:bg-gray-50" 
                        onClick={() => {
                          router.push('/agent/account')
                          setShowUserMenu(false)
                        }}
                      >
                        <FiUser className="text-lg flex-shrink-0" />
                        <span>Account</span>
                      </button>
                    )}
                    <button 
                      className="w-full flex items-center gap-3 px-4 py-3 bg-transparent border-none text-left cursor-pointer transition-colors text-[15px] text-red-600 font-outfit hover:bg-red-50" 
                      onClick={handleLogout}
                    >
                      <FiLogOut className="text-lg flex-shrink-0" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="rounded-full border border-rental-orange-500 text-rental-orange-500 px-5 h-12 font-outfit text-base font-medium cursor-pointer inline-flex items-center justify-center hover:bg-rental-orange-500 hover:text-white transition-colors" onClick={handleLoginClick}>
                Login / Register
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex items-center justify-center bg-transparent border-none cursor-pointer text-rental-blue-600 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className={`md:hidden flex flex-col bg-white border-t border-gray-200 max-h-0 overflow-hidden transition-all duration-300 ease-out ${isMobileMenuOpen ? 'max-h-[1000px]' : ''}`} ref={mobileMenuRef}>
          <Link href="/" className={`text-rental-blue-600 font-outfit text-[15px] px-6 py-4 border-b border-gray-100 block transition-colors hover:text-rental-orange-500 ${pathname === '/' ? 'font-extrabold tracking-[0.15em]' : 'font-normal'}`} onClick={() => setIsMobileMenuOpen(false)}>
            HOME
          </Link>
          <Link href="/about" className={`text-rental-blue-600 font-outfit text-[15px] px-6 py-4 border-b border-gray-100 block transition-colors hover:text-rental-orange-500 ${pathname === '/about' ? 'font-extrabold tracking-[0.15em]' : 'font-normal'}`} onClick={() => setIsMobileMenuOpen(false)}>
            ABOUT US
          </Link>
          <Link href="/properties" className={`text-rental-blue-600 font-outfit text-[15px] px-6 py-4 border-b border-gray-100 block transition-colors hover:text-rental-orange-500 ${pathname === '/properties' ? 'font-extrabold tracking-[0.15em]' : 'font-normal'}`} onClick={() => setIsMobileMenuOpen(false)}>
            PROPERTIES
          </Link>
          <Link href="/rent-managers" className={`text-rental-blue-600 font-outfit text-[15px] px-6 py-4 border-b border-gray-100 block transition-colors hover:text-rental-orange-500 ${pathname === '/rent-managers' ? 'font-extrabold tracking-[0.15em]' : 'font-normal'}`} onClick={() => setIsMobileMenuOpen(false)}>
            RENT MANAGERS
          </Link>
          <Link href={pathname === '/news' ? '/news' : '/blog'} className={`text-rental-blue-600 font-outfit text-[15px] px-6 py-4 border-b border-gray-100 block transition-colors hover:text-rental-orange-500 ${pathname === '/blog' || pathname === '/news' ? 'font-extrabold tracking-[0.15em]' : 'font-normal'}`} onClick={() => setIsMobileMenuOpen(false)}>
            {pathname === '/news' ? 'NEWS' : 'BLOG'}
          </Link>
          <Link href={pathname === '/news' ? '/blog' : '/news'} className={`text-rental-blue-600 font-outfit text-[15px] pl-[100px] px-6 py-4 border-b border-gray-100 block transition-colors hover:text-rental-orange-500`} onClick={() => setIsMobileMenuOpen(false)}>
            ↳ {pathname === '/news' ? 'BLOG' : 'NEWS'}
          </Link>
          <Link href="/contact" className={`text-rental-blue-600 font-outfit text-[15px] px-6 py-4 block transition-colors hover:text-rental-orange-500 ${pathname === '/contact' ? 'font-extrabold tracking-[0.15em]' : 'font-normal'}`} onClick={() => setIsMobileMenuOpen(false)}>
            CONTACT US
          </Link>
          {isUserLoggedIn ? (
            <div className="px-6 py-5 border-t border-gray-200 flex flex-col gap-3">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img 
                    src={ASSETS.PLACEHOLDER_PROFILE} 
                    alt={userName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.nextElementSibling?.classList.remove('hidden')
                    }} 
                  />
                  <div className="hidden w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-[15px]">
                    {getInitials(userName)}
                  </div>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13px] sm:text-[15px] font-semibold text-gray-900 font-outfit">{userName}</span>
                  <span className="text-[11px] sm:text-[15px] text-gray-500 font-outfit">
                    {userRole === 'admin' ? 'Admin' : userRole === 'broker' ? 'Broker' : 'Agent'}
                  </span>
                </div>
              </div>
              <button 
                className="flex items-center gap-3 py-3 bg-transparent border-none text-left cursor-pointer text-[13px] sm:text-[15px] text-gray-900 font-outfit transition-colors hover:text-rental-blue-600" 
                onClick={() => {
                  router.push(userRole === 'admin' ? '/admin' : userRole === 'broker' ? '/broker' : '/agent')
                  setIsMobileMenuOpen(false)
                }}
              >
                <FiHome className="text-lg flex-shrink-0" />
                <span>Dashboard</span>
              </button>
              {userRole === 'agent' && (
                <button 
                  className="flex items-center gap-3 py-3 bg-transparent border-none text-left cursor-pointer text-[13px] sm:text-[15px] text-gray-900 font-outfit transition-colors hover:text-rental-blue-600" 
                  onClick={() => {
                    router.push('/agent/account')
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <FiUser className="text-lg flex-shrink-0" />
                  <span>Account</span>
                </button>
              )}
              <button 
                className="flex items-center gap-3 py-3 bg-transparent border-none text-left cursor-pointer text-[13px] sm:text-[15px] text-red-600 font-outfit transition-colors hover:text-red-600" 
                onClick={() => {
                  handleLogout()
                  setIsMobileMenuOpen(false)
                }}
              >
                <FiLogOut className="text-lg flex-shrink-0" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button className="rounded-full border border-rental-orange-500 text-rental-orange-500 px-5 h-12 sm:h-11 font-outfit text-[13px] sm:text-[15px] font-medium cursor-pointer inline-flex items-center justify-center mx-6 my-5 hover:bg-rental-orange-500 hover:text-white transition-colors" onClick={() => {
              handleLoginClick()
              setIsMobileMenuOpen(false)
            }}>
              Login/Register
            </button>
          )}
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

