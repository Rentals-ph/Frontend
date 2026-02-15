import Link from 'next/link'
import './BlogCard.css'

import { ReactNode } from 'react'

interface BlogCardProps {
  image: string
  category: string
  title: string
  excerpt: string
  author: string | ReactNode
  date: string | ReactNode
  readTime: string
  link?: string
  size?: 'small' | 'large'
}

function BlogCard({
  image,
  category,
  title,
  excerpt,
  author,
  date,
  readTime,
  link = '#read-more',
  size = 'small',
}: BlogCardProps) {
  return (
    <Link href={link} style={{ textDecoration: 'none', display: 'block' }}>
      <article className={`blog-card blog-card-${size}`}>
        {size === 'large' ? (
          <>
            <img
              src={image}
              alt={title}
              className="blog-image blog-image-large"
            />
            <div className="blog-overlay">
              <div className="blog-category-row">
                <span className="blog-category">{category}</span>
                <span className="blog-read-time">{readTime}</span>
              </div>
              <h3 className="blog-title">{title}</h3>
              <p className="blog-excerpt">{excerpt}</p>
              <div className="blog-meta-row">
                <div className="blog-author">
                  {/* Solid user icon */}
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 10c3.314 0 6 1.343 6 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-1c0-1.657 2.686-3 6-3Z" />
                  </svg>
                  <span>{author}</span>
                </div>
                <div className="blog-date">
                  {/* Solid calendar icon */}
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 2a1 1 0 1 1 2 0v1h4V2a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h1V2a1 1 0 1 1 2 0v1Zm10 3H4v11h12V5Zm-2 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
                  </svg>
                  <span>{date}</span>
                </div>
              </div>
              <div className="blog-read-more-wrapper">
                <span className={`read-more-link read-more-${size}`}>
                  Read More
                  <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 1L19 8.5L12 16M19 8.5H1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <img
              src={image}
              alt={title}
              className="blog-image"
            />
            <div className="blog-card-content">
              <div className="blog-category-row">
                <span className="blog-category">{category}</span>
                <span className="blog-read-time">{readTime}</span>
              </div>
              <h3 className="blog-title">{title}</h3>
              <p className="blog-excerpt">{excerpt}</p>
              <div className="blog-meta-row">
                <div className="blog-author">
                  {/* Solid user icon */}
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 10c3.314 0 6 1.343 6 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-1c0-1.657 2.686-3 6-3Z" />
                  </svg>
                  <span>{author}</span>
                </div>
                <div className="blog-date">
                  {/* Solid calendar icon */}
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 2a1 1 0 1 1 2 0v1h4V2a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h1V2a1 1 0 1 1 2 0v1Zm10 3H4v11h12V5Zm-2 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
                  </svg>
                  <span>{date}</span>
                </div>
              </div>
              <div className="blog-read-more-wrapper">
                <span className={`read-more-link read-more-${size}`}>
                  Read More
                  <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 1L19 8.5L12 16M19 8.5H1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            </div>
          </>
        )}
      </article>
    </Link>
  )
}

export default BlogCard

