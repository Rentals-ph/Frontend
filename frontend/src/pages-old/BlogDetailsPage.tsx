import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import PageHeader from '../components/layout/PageHeader'
import './BlogDetailsPage.css'

function BlogDetailsPage() {
  const { id } = useParams()

  // Sample blog data - in a real app, this would come from an API
  const blogPost = {
    id: id || '1',
    title: '10 Essential Tips for First-Time Property Managers in the Philippines',
    author: 'Maria Santos',
    date: 'January 15, 2026',
    image: '/assets/blog-image.png',
    likes: 342,
    comments: 24,
    category: 'Property Management',
    readTime: '7 min read',
    content: `Solinea is Alveo's First Multi-Tower Development In Cebu City. This master-planned development offers a resort-inspired environment perfect for modern living. With a 2.6-hectare land area, Solinea provides residents with central amenities including landscaped parks, kid's play areas, a multi-experiential pool, and a clubhouse with gym, function room, and game room. The development also features upscale retail shops and restaurants along Cardinal Rosales Ave, making it a complete lifestyle destination.

The property management landscape in the Philippines has evolved significantly over the years. As a first-time property manager, understanding the local market dynamics, legal requirements, and tenant expectations is crucial for success. This comprehensive guide will walk you through the essential aspects of property management in the Philippines.

One of the most important aspects of property management is tenant screening. Proper screening helps you find reliable tenants who will pay rent on time and take care of your property. Always conduct background checks, verify employment, and check references from previous landlords.

Maintenance and upkeep are also critical. Regular property inspections and prompt response to maintenance requests help maintain property value and tenant satisfaction. Building good relationships with reliable contractors and service providers is essential.

Understanding the legal framework is another key component. Familiarize yourself with the Rent Control Act, local ordinances, and tenant rights. Having proper documentation, including lease agreements and property condition reports, protects both you and your tenants.

Financial management is equally important. Keep detailed records of income and expenses, set aside funds for maintenance and emergencies, and ensure timely rent collection. Consider using property management software to streamline these processes.

Marketing your property effectively is crucial for attracting quality tenants. High-quality photos, detailed descriptions, and strategic listing placement can significantly impact your vacancy rates. Social media and online platforms are powerful tools for reaching potential tenants.

Communication skills cannot be overstated. Being responsive, professional, and clear in your communications builds trust with tenants and helps prevent misunderstandings. Regular updates about property maintenance, policy changes, or community events keep tenants informed and engaged.

Finally, continuous learning and staying updated with market trends, legal changes, and best practices will help you grow as a property manager. Join local property management associations, attend workshops, and network with other professionals in the field.`
  }

  const relatedArticles = [
    {
      id: 1,
      title: 'Understanding Your Rental Contract: A Complete Guide',
      category: 'Legal',
      readTime: '7 min read',
      image: '/assets/property-main.png'
    },
    {
      id: 2,
      title: 'Understanding Your Rental Contract: A Complete Guide',
      category: 'Legal',
      readTime: '7 min read',
      image: '/assets/property-main.png'
    },
    {
      id: 3,
      title: 'Understanding Your Rental Contract: A Complete Guide',
      category: 'Legal',
      readTime: '7 min read',
      image: '/assets/property-main.png'
    }
  ]

  const comments = [
    {
      id: 1,
      author: 'Pat M.',
      avatar: '/assets/property-main.png',
      text: 'Great article! The tip about screening tenants is especially important. I learned this the hard way in my first year of property management.'
    },
    {
      id: 2,
      author: 'Pat M.',
      avatar: '/assets/property-main.png',
      text: 'Great article! The tip about screening tenants is especially important. I learned this the hard way in my first year of property management.'
    }
  ]

  return (
    <div className="blog-details-page">
      <Navbar />

      {/* Page Header */}
      <PageHeader title="BLOG" />

      {/* Main Content */}
      <main className="blog-details-main-content">
        <div className="blog-details-layout">
          {/* Main Article Column */}
          <div className="blog-details-article-column">
            {/* Article Header */}
            <div className="blog-details-header">
              <h1 className="blog-details-title">{blogPost.title}</h1>
              <div className="blog-details-meta">
                <div className="blog-details-author">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{blogPost.author}</span>
                </div>
                <div className="blog-details-date">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 2V6M14 2V6M3 10H17M5 4H15C16.1046 4 17 4.89543 17 6V16C17 17.1046 16.1046 18 15 18H5C3.89543 18 3 17.1046 3 16V6C3 4.89543 3.89543 4 5 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{blogPost.date}</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="blog-details-featured-image">
              <img src={blogPost.image} alt={blogPost.title} />
            </div>

            {/* Social Engagement */}
            <div className="blog-details-social">
              <div className="blog-details-social-left">
                <button className="social-btn social-like">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7564 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.0621 22.0329 6.39464C21.7564 5.72718 21.351 5.12075 20.84 4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{blogPost.likes}</span>
                </button>
                <button className="social-btn social-comment">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{blogPost.comments}</span>
                </button>
              </div>
              <div className="blog-details-social-right">
                <button className="social-btn social-share">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 5.12549 15.0077 5.24919 15.0227 5.37063L8.08261 9.79866C7.54305 9.29212 6.80891 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15C6.80891 15 7.54305 14.7079 8.08261 14.2013L15.0227 18.6294C15.0077 18.7508 15 18.8745 15 19C15 20.6569 16.3431 22 18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C17.1911 16 16.457 16.2921 15.9174 16.7987L8.97727 12.3706C8.99231 12.2492 9 12.1255 9 12C9 11.8745 8.99231 11.7508 8.97727 11.6294L15.9174 7.20134C16.457 7.70788 17.1911 8 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className="social-btn social-email">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="L22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className="social-btn social-whatsapp">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382C17.292 14.208 15.168 12.458 14.668 12.208C14.168 11.958 13.918 11.958 13.668 12.208C13.418 12.458 12.418 13.458 12.168 13.708C11.918 13.958 11.668 13.958 11.418 13.708C11.168 13.458 9.41797 11.708 8.91797 11.208C8.41797 10.708 8.16797 10.458 8.41797 10.208C8.66797 9.958 9.16797 9.458 9.41797 9.208C9.66797 8.958 9.66797 8.708 9.41797 8.458C9.16797 8.208 8.66797 7.458 8.41797 7.208C8.16797 6.958 7.91797 6.958 7.66797 7.208C7.41797 7.458 6.41797 8.458 6.16797 8.708C5.91797 8.958 5.66797 9.208 5.91797 9.458C6.16797 9.708 7.16797 10.958 8.16797 12.208C9.16797 13.458 10.168 14.458 10.418 14.708C10.668 14.958 10.918 15.208 11.168 15.208C11.418 15.208 11.668 15.208 11.918 15.208C12.168 15.208 12.418 15.208 12.668 15.208C12.918 15.208 13.168 15.208 13.418 15.208C13.668 15.208 13.918 15.208 14.168 15.208C14.418 15.208 14.668 15.208 14.918 15.208C15.168 15.208 15.418 15.208 15.668 15.208C15.918 15.208 16.168 15.208 16.418 15.208C16.668 15.208 16.918 15.208 17.168 15.208C17.418 15.208 17.668 15.208 17.918 15.208C18.168 15.208 18.418 15.208 18.668 15.208C18.918 15.208 19.168 15.208 19.418 15.208C19.668 15.208 19.918 15.208 20.168 15.208C20.418 15.208 20.668 15.208 20.918 15.208" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Article Content */}
            <div className="blog-details-content">
              {blogPost.content.split('\n\n').map((paragraph, index) => (
                <div key={index}>
                  <p className="blog-details-paragraph">
                    {paragraph}
                  </p>
                  {index === 0 && (
                    <div className="blog-details-ad-image">
                      <img src="/assets/blog-image2.png" alt="House-Hunting Before the New Year Rush" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Comments Section */}
            <div className="blog-details-comments">
              <h2 className="blog-details-comments-title">Comments</h2>
              <div className="blog-details-comments-list">
                {comments.map((comment) => (
                  <div key={comment.id} className="blog-details-comment">
                    <div className="comment-avatar">
                      <img src={comment.avatar} alt={comment.author} />
                    </div>
                    <div className="comment-content">
                      <div className="comment-author">{comment.author}</div>
                      <div className="comment-text">{comment.text}</div>
                      <a href="#" className="comment-reply">Reply</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Articles */}
            <div className="blog-details-related">
              <h2 className="blog-details-related-title">Related Articles</h2>
              <div className="blog-details-related-grid">
                {relatedArticles.map((article) => (
                  <Link key={article.id} to={`/blog/${article.id}`} className="blog-details-related-card">
                    <div className="related-card-image">
                      <img src={article.image} alt={article.title} />
                    </div>
                    <div className="related-card-content">
                      <div className="related-card-meta">
                        <span className="related-card-category">{article.category}</span>
                        <span className="related-card-read-time">{article.readTime}</span>
                      </div>
                      <h3 className="related-card-title">{article.title}</h3>
                      <span className="related-card-link">Read More →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default BlogDetailsPage

