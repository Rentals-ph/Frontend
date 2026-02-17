'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import './page.css'
import PageHeader from '../../components/layout/PageHeader'
import { blogsApi } from '../../api'
import type { Blog } from '../../types'
import { ASSETS } from '@/utils/assets'
import { BlogCard } from '../../components/common'
import { HiUser, HiCalendar } from 'react-icons/hi'

export default function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await blogsApi.getAll()
        setBlogs(data)
      } catch (error) {
        console.error('Error fetching blogs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Date not available'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatReadTime = (minutes: number): string => {
    return `${minutes} min read`
  }

  const getImageUrl = (image: string | null): string => {
    if (!image) return ASSETS.PLACEHOLDER_PROPERTY_MAIN
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image
    }
    if (image.startsWith('storage/') || image.startsWith('/storage/')) {
      return `/api/${image.startsWith('/') ? image.slice(1) : image}`
    }
    return image
  }

  // Get featured post (first one) and trending posts (next 3)
  const featuredPost = blogs.length > 0 ? blogs[0] : null
  const trendingPosts = blogs.slice(1, 4)
  const regularPosts = blogs.slice(4)

  return (
    <div className="blog-page">
      <Navbar />
      <PageHeader title="BLOG" />
      <main className="blog-main-content">
        {loading ? (
          <div style={{ textAlign: 'center' }}>
            <p>Loading blogs...</p>
          </div>
        ) : (
          <>
            {/* Custom 3-card layout: small - large - small */}
            

            <div className="blog-articles-grid">
              {regularPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.id}`} style={{ textDecoration: 'none' }}>
                  <article className="blog-article-card">
                    <div className="blog-article-image">
                      <img src={getImageUrl(post.image)} alt={post.title} />
                    </div>
                    <div className="blog-article-content">
                      <div className="article-tags">
                        <span className="article-category-tag">{post.category}</span>
                        <span className="article-read-time">{formatReadTime(post.read_time)}</span>
                      </div>
                      <h3 className="blog-article-title">{post.title}</h3>
                      <span className="read-more-link">Read More →</span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </>
        )}

        <div className="blog-pagination">
          <button className="pagination-btn pagination-prev" aria-label="Previous page">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </main>

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
