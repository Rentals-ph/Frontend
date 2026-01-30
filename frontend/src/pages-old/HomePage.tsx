import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Hero from '../components/home/Hero'
import FeaturedProperties from '../components/home/FeaturedProperties'
import Testimonials from '../components/home/Testimonials'
import Blogs from '../components/home/Blogs'
import Footer from '../components/layout/Footer'
import '../styles/landing.css'

function HomePage() {
  return (
    <div className="landing-page">
      {/* Temporary testing links - floating overlay */}
      <div style={{ 
        position: 'fixed',
        top: '10px',
        right: '10px',
        padding: '10px 15px', 
        backgroundColor: 'rgba(240, 240, 240, 0.9)', 
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        zIndex: 9999,
        display: 'flex',
        gap: '15px'
      }}>
        <Link to="/admin" style={{ color: '#007bff', textDecoration: 'none', fontWeight: '500' }}>
          Admin
        </Link>
        <Link to="/agent" style={{ color: '#007bff', textDecoration: 'none', fontWeight: '500' }}>
          Agent
        </Link>
      </div>
      <Navbar />
      <Hero />
      <FeaturedProperties />
      <Testimonials />
      <Blogs />
      <Footer />
    </div>
  )
}

export default HomePage

