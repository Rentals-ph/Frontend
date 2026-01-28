import { Link } from 'react-router-dom'
import './BlogCard.css'

interface BlogCardProps {
  image: string
  category: string
  title: string
  excerpt: string
  author: string
  date: string
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
    <Link to={link} style={{ textDecoration: 'none', display: 'block' }}>
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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{author}</span>
              </div>
              <div className="blog-date">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 8.33333L8.68629 5.24019C9.43121 4.86774 10.3021 4.86774 11.047 5.24019L17.5 8.33333M5 13.3333L9.5 15.6033M11 15.6033L15 13.3333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2.5 11.6667V8.33333L9.5 4.66667L17.5 8.33333V11.6667L10 15.3333L2.5 11.6667Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{author}</span>
              </div>
              <div className="blog-date">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 8.33333L8.68629 5.24019C9.43121 4.86774 10.3021 4.86774 11.047 5.24019L17.5 8.33333M5 13.3333L9.5 15.6033M11 15.6033L15 13.3333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2.5 11.6667V8.33333L9.5 4.66667L17.5 8.33333V11.6667L10 15.3333L2.5 11.6667Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
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

