'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { blogsApi } from '../../api'
import type { Blog } from '../../types'
import './Blogs.css'

function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await blogsApi.getAll()
        console.log('Fetched blogs:', data)
        console.log('Number of blogs:', data.length)
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
    if (!image) return '/assets/blog-main.png'
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image
    }
    if (image.startsWith('storage/') || image.startsWith('/storage/')) {
      return `/api/${image.startsWith('/') ? image.slice(1) : image}`
    }
    return image
  }

  // Use first blog for small card, second blog for large card
  const smallBlog = blogs.length > 0 ? blogs[0] : null
  const largeBlog = blogs.length > 1 ? blogs[1] : blogs.length > 0 ? blogs[0] : null
  const smallBlogImage = smallBlog ? getImageUrl(smallBlog.image) : '/assets/blog-main.png'
  const largeBlogImage = largeBlog ? getImageUrl(largeBlog.image) : '/assets/blog-main.png'

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
        ) : smallBlog ? (
          <div className="blogs-grid">
            {smallBlog && (
              <div className="blog-card-wrapper blog-card-small-wrapper">
                <Link href={`/blog/${smallBlog.id}`} className="blog-card-link">
                  <article className="blog-card blog-card-small">
                    <img
                      src={smallBlogImage}
                      alt={smallBlog.title}
                      className="blog-image"
                    />
                    <div className="blog-card-content">
                      <div className="blog-category-row">
                        <span className="blog-category">{smallBlog.category}</span>
                        <span className="blog-read-time">{formatReadTime(smallBlog.read_time)}</span>
                      </div>
                      <h3 className="blog-title">{smallBlog.title}</h3>
                      <p className="blog-excerpt">{smallBlog.excerpt}</p>
                      <div className="blog-meta-row">
                        <div className="blog-author">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>{smallBlog.author}</span>
                        </div>
                        <div className="blog-date">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.5 8.33333L8.68629 5.24019C9.43121 4.86774 10.3021 4.86774 11.047 5.24019L17.5 8.33333M5 13.3333L9.5 15.6033M11 15.6033L15 13.3333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2.5 11.6667V8.33333L9.5 4.66667L17.5 8.33333V11.6667L10 15.3333L2.5 11.6667Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                          </svg>
                          <span>{formatDate(smallBlog.published_at)}</span>
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
            )}
            {largeBlog && (
              <div className="blog-card-wrapper blog-card-large-wrapper">
                <Link href={`/blog/${largeBlog.id}`} className="blog-card-link">
                  <article className="blog-card blog-card-large">
                    <img
                      src={largeBlogImage}
                      alt={largeBlog.title}
                      className="blog-image blog-image-large"
                    />
                    <div className="blog-overlay">
                      <div className="blog-category-row">
                        <span className="blog-category">{largeBlog.category}</span>
                        <span className="blog-read-time">{formatReadTime(largeBlog.read_time)}</span>
                      </div>
                      <h3 className="blog-title">{largeBlog.title}</h3>
                      <p className="blog-excerpt">{largeBlog.excerpt}</p>
                      <div className="blog-meta-row">
                        <div className="blog-author">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>{largeBlog.author}</span>
                        </div>
                        <div className="blog-date">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.5 8.33333L8.68629 5.24019C9.43121 4.86774 10.3021 4.86774 11.047 5.24019L17.5 8.33333M5 13.3333L9.5 15.6033M11 15.6033L15 13.3333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2.5 11.6667V8.33333L9.5 4.66667L17.5 8.33333V11.6667L10 15.3333L2.5 11.6667Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                          </svg>
                          <span>{formatDate(largeBlog.published_at)}</span>
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
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>No blogs available at the moment.</p>
          </div>
        )}
        
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
