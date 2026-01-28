import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import FeaturedProperties from '../components/FeaturedProperties'
import Testimonials from '../components/Testimonials'
import Blogs from '../components/Blogs'
import Footer from '../components/Footer'
import '../styles/landing.css'

function HomePage() {
  return (
    <div className="landing-page">
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

