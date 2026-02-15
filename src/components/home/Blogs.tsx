'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Pagination from '../common/Pagination'
import { blogsApi } from '../../api'
import type { Blog } from '../../types'
import { ASSETS } from '@/utils/assets'
import './Blogs.css'

function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(1) // Index of the large blog (start at 1)

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

  // Always show 3 cards: left (small), center (large), right (small)
  // If not enough blogs, reuse first or show placeholder
  const getThreeBlogs = (index: number) => {
    // index: center (large) blog index
    const count = blogs.length
    const placeholder = {
      id: 'placeholder',
      image: ASSETS.BLOG_IMAGE_MAIN,
      category: 'Blog',
      title: 'No Blog Available',
      excerpt: 'Stay tuned for more updates!',
      author: 'Rental.ph',
      published_at: '',
      read_time: 1,
    }
    if (count === 0) {
      return [placeholder, placeholder, placeholder]
    }
    // left: previous blog or first
    const left = blogs[(index - 1 + count) % count] || blogs[0] || placeholder
    // center: current
    const center = blogs[index % count] || blogs[0] || placeholder
    // right: next blog or first
    const right = blogs[(index + 1) % count] || blogs[0] || placeholder
    return [left, center, right]
  }

  // Pagination: each page is a center (large) blog
  const totalPages = blogs.length > 0 ? blogs.length : 1

  const handlePageChange = (newPage: number) => {
    if (blogs.length === 0) return
    const newIndex = (newPage - 1) % blogs.length
    if (newIndex === currentIndex) return
    setCurrentIndex(newIndex)
  }

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return ''
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
    if (!image) return ASSETS.BLOG_IMAGE_MAIN
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image
    }
    if (image.startsWith('storage/') || image.startsWith('/storage/')) {
      return `/api/${image.startsWith('/') ? image.slice(1) : image}`
    }
    return image
  }

  const [leftBlog, centerBlog, rightBlog] = getThreeBlogs(currentIndex)

  return (
    <section id="blog" className="blogs-section">
      <div className="blogs-container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Blogs</h2>
            <p className="section-subtitle">We Share Our Knowledge</p>
          </div>
          <Link href="/blog" className="section-link">
            Visit Blogs
            <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 1L13 8L7 15M13 8H1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading blogs...</p>
          </div>
        ) : (
          <div className="blogs-grid">
            {/* Left Small Blog Card */}
            <div 
              key={`left-${leftBlog.id}`}
              className="blog-card-wrapper blog-card-small-wrapper"
            >
              <Link href={leftBlog.id === 'placeholder' ? '#' : `/blog/${leftBlog.id}`} className="blog-card-link">
                <article className="blog-card blog-card-small">
                  <img
                    src={getImageUrl(leftBlog.image)}
                    alt={leftBlog.title}
                    className="blog-image"
                  />
                  <div className="blog-card-content">
                    <div className="blog-category-row">
                      <span className="blog-category">{leftBlog.category}</span>
                      <span className="blog-read-time">{formatReadTime(leftBlog.read_time)}</span>
                    </div>
                    <h3 className="blog-title">{leftBlog.title}</h3>
                    <p className="blog-excerpt">{leftBlog.excerpt}</p>
                    <div className="blog-meta-row">
                      <div className="blog-author">
                        {/* User solid icon */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.866 0-7 2.239-7 5v3h14v-3c0-2.761-3.134-5-7-5z"/>
                        </svg>
                        <span>{leftBlog.author}</span>
                      </div>
                      <div className="blog-date">
                        {/* Calendar solid icon */}
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 2a1 1 0 1 1 2 0v1h4V2a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h1V2a1 1 0 1 1 2 0v1zm10 3H4v11h12V5zm-1 2v2H5V7h10z"/>
                        </svg>
                        <span>{formatDate(leftBlog.published_at)}</span>
                      </div>
                    </div>
                    <div className="blog-read-more-wrapper">
                      <span className="read-more-link read-more-small">
                        Read More
                        <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 1L19 8.5L12 16M19 8.5H1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </div>

            {/* Center Large Blog Card */}
            <div 
              key={`center-${centerBlog.id}`}
              className="blog-card-wrapper blog-card-large-wrapper"
            >
              <Link href={centerBlog.id === 'placeholder' ? '#' : `/blog/${centerBlog.id}`} className="blog-card-link">
                <article className="blog-card blog-card-large">
                  <img
                    src={getImageUrl(centerBlog.image)}
                    alt={centerBlog.title}
                    className="blog-image blog-image-large"
                  />
                  <div className="blog-overlay">
                    <div className="blog-category-row">
                      <span className="blog-category">{centerBlog.category}</span>
                      <span className="blog-read-time">{formatReadTime(centerBlog.read_time)}</span>
                    </div>
                    <h3 className="blog-title">{centerBlog.title}</h3>
                    <p className="blog-excerpt">{centerBlog.excerpt}</p>
                    <div className="blog-meta-row">
                      <div className="blog-author">
                        {/* User solid icon */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.866 0-7 2.239-7 5v3h14v-3c0-2.761-3.134-5-7-5z"/>
                        </svg>
                        <span>{centerBlog.author}</span>
                      </div>
                      <div className="blog-date">
                        {/* Calendar solid icon */}
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 2a1 1 0 1 1 2 0v1h4V2a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h1V2a1 1 0 1 1 2 0v1zm10 3H4v11h12V5zm-1 2v2H5V7h10z"/>
                        </svg>
                        <span>{formatDate(centerBlog.published_at)}</span>
                      </div>
                    </div>
                    <div className="blog-read-more-wrapper">
                      <span className="read-more-link read-more-large">
                        Read More
                        <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 1L19 8.5L12 16M19 8.5H1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </div>

            {/* Right Small Blog Card */}
            <div 
              key={`right-${rightBlog.id}`}
              className="blog-card-wrapper blog-card-small-wrapper"
            >
              <Link href={rightBlog.id === 'placeholder' ? '#' : `/blog/${rightBlog.id}`} className="blog-card-link">
                <article className="blog-card blog-card-small">
                  <img
                    src={getImageUrl(rightBlog.image)}
                    alt={rightBlog.title}
                    className="blog-image"
                  />
                  <div className="blog-card-content">
                    <div className="blog-category-row">
                      <span className="blog-category">{rightBlog.category}</span>
                      <span className="blog-read-time">{formatReadTime(rightBlog.read_time)}</span>
                    </div>
                    <h3 className="blog-title">{rightBlog.title}</h3>
                    <p className="blog-excerpt">{rightBlog.excerpt}</p>
                    <div className="blog-meta-row">
                      <div className="blog-author">
                        {/* User solid icon */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.866 0-7 2.239-7 5v3h14v-3c0-2.761-3.134-5-7-5z"/>
                        </svg>
                        <span>{rightBlog.author}</span>
                      </div>
                      <div className="blog-date">
                        {/* Calendar solid icon */}
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 2a1 1 0 1 1 2 0v1h4V2a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h1V2a1 1 0 1 1 2 0v1zm10 3H4v11h12V5zm-1 2v2H5V7h10z"/>
                        </svg>
                        <span>{formatDate(rightBlog.published_at)}</span>
                      </div>
                    </div>
                    <div className="blog-read-more-wrapper">
                      <span className="read-more-link read-more-small">
                        Read More
                        <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 1L19 8.5L12 16M19 8.5H1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && blogs.length > 1 && (
          <div className="blogs-pagination-wrapper">
            <Pagination
              currentPage={currentIndex + 1}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              className="blogs-pagination"
            />
          </div>
        )}
      </div>
    </section>
  )
}

export default Blogs
