'use client'

import Navbar from '../components/layout/Navbar'
import Hero from '../components/home/Hero'
import FeaturedProperties from '../components/home/FeaturedProperties'
import Testimonials from '../components/home/Testimonials'
import Blogs from '../components/home/Blogs'
import PopularSearches from '../components/home/PopularSearches'
import Footer from '../components/layout/Footer'

export default function HomePage() {
  return (
    <div className="landing-page">
      <Navbar />
      <Hero />
      <FeaturedProperties />
      <Testimonials />
      <Blogs />
      <PopularSearches />
      <Footer />
    </div>
  )
}

