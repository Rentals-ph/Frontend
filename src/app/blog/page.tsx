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
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading blogs...</p>
          </div>
        ) : (
          <>

            {/* Custom 3-card layout: small - large - small */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'stretch', gap: 24, marginBottom: 40 }}>
              {/* Always render 3 cards, fallback to first/empty if not enough blogs */}
              <BlogCard
                image={getImageUrl(blogs[1]?.image || blogs[0]?.image || ASSETS.PLACEHOLDER_PROPERTY_MAIN)}
                category={blogs[1]?.category || blogs[0]?.category || ''}
                title={blogs[1]?.title || blogs[0]?.title || ''}
                excerpt={blogs[1]?.excerpt || blogs[0]?.excerpt || ''}
                author={<><HiUser style={{verticalAlign:'middle',marginRight:6}}/>{blogs[1]?.author || blogs[0]?.author || ''}</>}
                date={<><HiCalendar style={{verticalAlign:'middle',marginRight:6}}/>{formatDate(blogs[1]?.published_at || blogs[0]?.published_at || null)}</>}
                readTime={formatReadTime(blogs[1]?.read_time || blogs[0]?.read_time || 1)}
                link={blogs[1] ? `/blog/${blogs[1].id}` : blogs[0] ? `/blog/${blogs[0].id}` : '#'}
                size="small"
              />
              <BlogCard
                image={getImageUrl(blogs[0]?.image || ASSETS.PLACEHOLDER_PROPERTY_MAIN)}
                category={blogs[0]?.category || ''}
                title={blogs[0]?.title || ''}
                excerpt={blogs[0]?.excerpt || ''}
                author={<><HiUser style={{verticalAlign:'middle',marginRight:6}}/>{blogs[0]?.author || ''}</>}
                date={<><HiCalendar style={{verticalAlign:'middle',marginRight:6}}/>{formatDate(blogs[0]?.published_at || null)}</>}
                readTime={formatReadTime(blogs[0]?.read_time || 1)}
                link={blogs[0] ? `/blog/${blogs[0].id}` : '#'}
                size="large"
              />
              <BlogCard
                image={getImageUrl(blogs[2]?.image || blogs[0]?.image || ASSETS.PLACEHOLDER_PROPERTY_MAIN)}
                category={blogs[2]?.category || blogs[0]?.category || ''}
                title={blogs[2]?.title || blogs[0]?.title || ''}
                excerpt={blogs[2]?.excerpt || blogs[0]?.excerpt || ''}
                author={<><HiUser style={{verticalAlign:'middle',marginRight:6}}/>{blogs[2]?.author || blogs[0]?.author || ''}</>}
                date={<><HiCalendar style={{verticalAlign:'middle',marginRight:6}}/>{formatDate(blogs[2]?.published_at || blogs[0]?.published_at || null)}</>}
                readTime={formatReadTime(blogs[2]?.read_time || blogs[0]?.read_time || 1)}
                link={blogs[2] ? `/blog/${blogs[2].id}` : blogs[0] ? `/blog/${blogs[0].id}` : '#'}
                size="small"
              />
            </div>

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
