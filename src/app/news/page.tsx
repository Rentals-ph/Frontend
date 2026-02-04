'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import PageHeader from '../../components/layout/PageHeader'
import { newsApi } from '../../api'
import type { News } from '../../api/endpoints/news'
import { ASSETS } from '@/utils/assets'
import './page.css'

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await newsApi.getAll()
        setNews(data)
      } catch (error) {
        console.error('Error fetching news:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  // Category colors mapping
  const categoryColors: { [key: string]: string } = {
    'Business': '#4A90E2',
    'Economy': '#50C878',
    'Technology': '#9B59B6',
    'Politics': '#E74C3C',
    'Health': '#F39C12',
    'Sports': '#3498DB',
    'Entertainment': '#E91E63',
    'Science': '#00BCD4',
    'Legal': '#E74C3C',
    'Property Management': '#4A90E2'
  }

  const getCategoryColor = (category: string) => {
    return categoryColors[category] || '#999999'
  }

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Date not available'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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

  // Organize news into sections
  const featuredNews = news.slice(0, 5)
  const column2Data = {
    largeCard: news[5] || null,
    mediumCards: news.slice(6, 8),
    smallerArticles: news.slice(8, 13)
  }
  const column3Data = {
    mediumCard: news[13] || null,
    smallerArticles: news.slice(14, 19)
  }

  return (
    <div className="news-page">
      <Navbar />

      {/* Page Header */}
      <PageHeader title="NEWS" />

      {/* Main Content */}
      <main className="news-main-content">
        <div className="news-content-layout">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>Loading news...</p>
            </div>
          ) : (
            <>
              {/* Left Column - Featured News */}
              <div className="news-featured-column">
                <h2 className="news-section-title">Featured News</h2>
                <div className="featured-news-list">
                  {featuredNews.slice(0, 3).map((article) => (
                    <article key={article.id} className="featured-news-item">
                      <div className="featured-news-image">
                        <img src={getImageUrl(article.image)} alt={article.title} />
                      </div>
                      <div className="featured-news-content">
                        <h3 className="featured-news-title">{article.title}</h3>
                        <div className="featured-news-meta">
                          <span className="news-author">{article.author}</span>
                          <span className="news-date">{formatDate(article.published_at)}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                  <Link href="/news" className="news-see-more-link">
                    View More News →
                  </Link>
                </div>
                
                <div className="news-advertisement">
                  <span className="ad-text">ADVERTISEMENT</span>
                </div>
              </div>

              {/* Second Column - Large Card, Two Medium Cards, Smaller Articles */}
              <div className="news-column-2">
                <h2 className="news-section-title">Editors Choice</h2>
                
                {/* Large Featured Card */}
                {column2Data.largeCard && (
                  <article className="column2-large-card">
                    <div className="column2-large-image">
                      <img src={getImageUrl(column2Data.largeCard.image)} alt={column2Data.largeCard.title} />
                      <div className="column2-large-overlay">
                        <span className="column2-category" style={{ color: getCategoryColor(column2Data.largeCard.category) }}>• {column2Data.largeCard.category}</span>
                        <h3 className="column2-large-title">{column2Data.largeCard.title}</h3>
                        <div className="column2-large-meta">
                          <span className="news-author">{column2Data.largeCard.author}</span>
                          <span className="news-date">{formatDate(column2Data.largeCard.published_at)}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                )}

                {/* Two Medium Cards Side by Side */}
                <div className="column2-medium-cards">
                  {column2Data.mediumCards.map((article) => (
                    <article key={article.id} className="column2-medium-card">
                      <div className="column2-medium-image">
                        <img src={getImageUrl(article.image)} alt={article.title} />
                      </div>
                      <div className="column2-medium-content">
                        <h4 className="column2-medium-title">{article.title}</h4>
                        <div className="column2-medium-meta">
                          <span className="news-author">{article.author}</span>
                          <span className="news-date">{formatDate(article.published_at)}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Smaller Articles */}
                <div className="column2-small-articles">
                  {column2Data.smallerArticles.slice(0, 3).map((article) => (
                    <article key={article.id} className="column2-small-article">
                      <div className="column2-small-content">
                        <span className="column2-small-category" style={{ color: getCategoryColor(article.category) }}>• {article.category}</span>
                        <h5 className="column2-small-title">{article.title}</h5>
                        <div className="column2-small-meta">
                          <span className="news-author">{article.author}</span>
                          <span className="news-date">{formatDate(article.published_at)}</span>
                        </div>
                      </div>
                      <div className="column2-small-image">
                        <img src={getImageUrl(article.image)} alt={article.title} />
                      </div>
                    </article>
                  ))}
                </div>
                <Link href="/blog" className="news-see-more-link">
                  View More News →
                </Link>
              </div>

              {/* Third Column - Medium Card and Smaller Articles */}
              <div className="news-column-3">
                <h2 className="news-section-title">Trending</h2>
                
                {/* Medium Card */}
                {column3Data.mediumCard && (
                  <article className="column3-medium-card">
                    <div className="column3-medium-image">
                      <img src={getImageUrl(column3Data.mediumCard.image)} alt={column3Data.mediumCard.title} />
                    </div>
                    <div className="column3-medium-content">
                      <h4 className="column3-medium-title">{column3Data.mediumCard.title}</h4>
                      <div className="column3-medium-meta">
                        <span className="news-author">{column3Data.mediumCard.author}</span>
                        <span className="news-date">{formatDate(column3Data.mediumCard.published_at)}</span>
                      </div>
                    </div>
                  </article>
                )}

                {/* Smaller Articles */}
                <div className="column3-small-articles">
                  {column3Data.smallerArticles.slice(0, 3).map((article) => (
                    <article key={article.id} className="column3-small-article">
                      <div className="column3-small-content">
                        <span className="column3-small-category" style={{ color: getCategoryColor(article.category) }}>• {article.category}</span>
                        <h5 className="column3-small-title">{article.title}</h5>
                        <div className="column3-small-meta">
                          <span className="news-author">{article.author}</span>
                          <span className="news-date">{formatDate(article.published_at)}</span>
                        </div>
                      </div>
                      <div className="column3-small-image">
                        <img src={getImageUrl(article.image)} alt={article.title} />
                      </div>
                    </article>
                  ))}
                </div>
                <Link href="/blog" className="news-see-more-link">
                  View More News →
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

