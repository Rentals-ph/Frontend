import { Link } from 'react-router-dom'
import BlogCard from './BlogCard'
import './Blogs.css'

function Blogs() {
  return (
    <section id="blog" className="blogs-section">
      <div className="blogs-container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Blogs</h2>
            <p className="section-subtitle">We Share Our Knowledge</p>
          </div>
          <Link to="/blog" className="section-link">
            Visit Blogs
            <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 1L13 8L7 15M13 8H1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        <div className="blogs-grid">
          <div className="blog-card-wrapper blog-card-small-wrapper">
            <BlogCard
              image="/assets/blog-main.png"
              category="Legal"
              title="Understanding Your Rental Contract: A Complete Guide"
              excerpt="Moving to Manila for the first time? Here are essential tips to help you navigate the rental market and find your perfect home."
              author="Maria Santos"
              date="January 15, 2026"
              readTime="7 min read"
              link="/blog/1"
              size="small"
            />
          </div>
          <div className="blog-card-wrapper blog-card-large-wrapper">
            <BlogCard
              image="/assets/blog-main.png"
              category="Legal"
              title="Understanding Your Rental Contract: A Complete Guide"
              excerpt="Moving to Manila for the first time? Here are essential tips to help you navigate the rental market and find your perfect home."
              author="Maria Santos"
              date="January 15, 2026"
              readTime="7 min read"
              link="/blog/1"
              size="large"
            />
          </div>
        </div>
        
        <div className="blogs-pagination">
          <span className="pagination-dot pagination-dot-active"></span>
          <span className="pagination-dot"></span>
          <span className="pagination-dot"></span>
          <span className="pagination-dot"></span>
          <span className="pagination-dot"></span>
        </div>
      </div>
    </section>
  )
}

export default Blogs

