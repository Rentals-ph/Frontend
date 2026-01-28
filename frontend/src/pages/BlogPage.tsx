import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageHeader from '../components/PageHeader'
import './BlogPage.css'

function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1)

  const blogPosts = [
    {
      id: 1,
      title: 'Top 10 Tips for the First-Time Renters in Manila',
      category: 'Legal',
      excerpt: 'Moving to Manila for the first time? Here are essential tips to help you navigate the rental market and find your perfect home.',
      date: 'January 15, 2026',
      author: 'Maria Santos',
      readTime: '7 min read',
      image: '/assets/property-main.png',
      featured: true
    },
    {
      id: 2,
      title: 'Top 10 Tips for the First-Time Renters in Manila',
      category: 'Legal',
      excerpt: 'Moving to Manila for the first time? Here are essential tips to help you navigate the rental market and find your perfect home.',
      date: 'January 15, 2026',
      author: 'Maria Santos',
      readTime: '7 min read',
      image: '/assets/property-main.png',
      featured: false,
      trending: true
    },
    {
      id: 3,
      title: 'Top 10 Tips for the First-Time Renters in Manila',
      category: 'Legal',
      excerpt: 'Moving to Manila for the first time? Here are essential tips to help you navigate the rental market and find your perfect home.',
      date: 'January 15, 2026',
      author: 'Maria Santos',
      readTime: '7 min read',
      image: '/assets/property-main.png',
      featured: false,
      trending: true
    },
    {
      id: 4,
      title: 'Top 10 Tips for the First-Time Renters in Manila',
      category: 'Legal',
      excerpt: 'Moving to Manila for the first time? Here are essential tips to help you navigate the rental market and find your perfect home.',
      date: 'January 15, 2026',
      author: 'Maria Santos',
      readTime: '7 min read',
      image: '/assets/property-main.png',
      featured: false,
      trending: true
    },
    {
      id: 5,
      title: 'Understanding Your Rental Contract: A Complete Guide',
      category: 'Legal',
      excerpt: 'A comprehensive guide to understanding rental contracts and what to look for before signing.',
      date: 'January 12, 2026',
      author: 'John Reyes',
      readTime: '7 min read',
      image: '/assets/property-main.png',
      featured: false,
      trending: false
    },
    {
      id: 6,
      title: 'Understanding Your Rental Contract: A Complete Guide',
      category: 'Legal',
      excerpt: 'A comprehensive guide to understanding rental contracts and what to look for before signing.',
      date: 'January 12, 2026',
      author: 'John Reyes',
      readTime: '7 min read',
      image: '/assets/property-main.png',
      featured: false,
      trending: false
    },
    {
      id: 7,
      title: 'Understanding Your Rental Contract: A Complete Guide',
      category: 'Legal',
      excerpt: 'A comprehensive guide to understanding rental contracts and what to look for before signing.',
      date: 'January 12, 2026',
      author: 'John Reyes',
      readTime: '7 min read',
      image: '/assets/property-main.png',
      featured: false,
      trending: false
    }
  ]

  const featuredPost = blogPosts.find(post => post.featured)
  const trendingPosts = blogPosts.filter(post => post.trending)
  const regularPosts = blogPosts.filter(post => !post.featured && !post.trending)

  return (
    <div className="blog-page">
      <Navbar />

      {/* Page Header */}
      

      {/* Main Content */}
      <main className="blog-main-content">
        <div className="blog-content-layout">
          {/* Left Column - Featured Article */}
          <div className="blog-featured-column">
            {featuredPost && (
              <Link to={`/blog/${featuredPost.id}`} style={{ textDecoration: 'none' }}>
                <article className="featured-article-card">
                  <div className="featured-article-image">
                    <img src={featuredPost.image} alt={featuredPost.title} />
                  </div>
                  <div className="featured-article-content">
                    <h2 className="featured-article-title">{featuredPost.title}</h2>
                    <p className="featured-article-excerpt">{featuredPost.excerpt}</p>
                    <div className="featured-article-meta">
                      <div className="article-author">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="article-date">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 2V6M14 2V6M3 10H17M5 4H15C16.1046 4 17 4.89543 17 6V16C17 17.1046 16.1046 18 15 18H5C3.89543 18 3 17.1046 3 16V6C3 4.89543 3.89543 4 5 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{featuredPost.date}</span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            )}
          </div>

          {/* Right Column - Trending Articles */}
          <div className="blog-trending-column">
            <div className="trending-header">
              <h3 className="trending-title">TRENDINGS</h3>
            </div>
            <div className="trending-articles">
              {trendingPosts.map((post) => (
                <Link key={post.id} to={`/blog/${post.id}`} style={{ textDecoration: 'none' }}>
                  <article className="trending-article-card">
                    <div className="trending-article-image">
                      <img src={post.image} alt={post.title} />
                    </div>
                    <div className="trending-article-content">
                      <h4 className="trending-article-title">{post.title}</h4>
                      <div className="trending-article-meta">
                        <div className="article-author">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>{post.author}</span>
                        </div>
                        <div className="article-date">
                          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 2V6M14 2V6M3 10H17M5 4H15C16.1046 4 17 4.89543 17 6V16C17 17.1046 16.1046 18 15 18H5C3.89543 18 3 17.1046 3 16V6C3 4.89543 3.89543 4 5 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>{post.date}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Regular Articles Grid */}
        <div className="blog-articles-grid">
          {regularPosts.map((post) => (
            <Link key={post.id} to={`/blog/${post.id}`} style={{ textDecoration: 'none' }}>
              <article className="blog-article-card">
                <div className="blog-article-image">
                  <img src={post.image} alt={post.title} />
                </div>
                <div className="blog-article-content">
                  <div className="article-tags">
                    <span className="article-category-tag">{post.category}</span>
                    <span className="article-read-time">{post.readTime}</span>
                  </div>
                  <h3 className="blog-article-title">{post.title}</h3>
                  <span className="read-more-link">Read More →</span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="blog-pagination">
          <button className="pagination-btn pagination-prev" aria-label="Previous page">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="pagination-numbers">
            <button className={`pagination-number ${currentPage === 1 ? 'active' : ''}`} onClick={() => setCurrentPage(1)}>1</button>
            <button className={`pagination-number ${currentPage === 2 ? 'active' : ''}`} onClick={() => setCurrentPage(2)}>2</button>
            <button className={`pagination-number ${currentPage === 3 ? 'active' : ''}`} onClick={() => setCurrentPage(3)}>3</button>
            <span className="pagination-ellipsis">...</span>
            <button className={`pagination-number ${currentPage === 50 ? 'active' : ''}`} onClick={() => setCurrentPage(50)}>50</button>
          </div>
          <button className="pagination-btn pagination-next" aria-label="Next page">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </main>

      {/* Newsletter Section - Full Width at Bottom */}
      <div className="blog-newsletter-section">
        <div className="newsletter-container">
          <h2 className="newsletter-title">Subscribe to Our Newsletter</h2>
          <p className="newsletter-text">
            Get the latest rental tips, market insights, and property updates delivered to your inbox.
          </p>
          <form className="newsletter-form">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="newsletter-input"
              required
            />
            <button type="submit" className="newsletter-btn">Subscribe</button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default BlogPage

