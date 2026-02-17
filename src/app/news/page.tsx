'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import PageHeader from '../../components/layout/PageHeader'
import { newsApi } from '../../api'
import type { News } from '../../api/endpoints/news'
import { ASSETS } from '@/utils/assets'

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
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      {/* Page Header */}
      <PageHeader title="NEWS" />

      {/* Main Content */}
      <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_3.5fr_1.6fr]">
          {loading ? (
            <div className="p-10 text-center">
              <p>Loading news...</p>
            </div>
          ) : (
            <>
              {/* Left Column - Featured News */}
              <div className="flex h-full flex-col justify-start">
                <h2 className="mb-6 font-outfit text-2xl font-bold text-rental-blue-800 md:text-lg">Featured News</h2>
                <div className="mb-6 flex flex-col gap-5">
                  {featuredNews.slice(0, 3).map((article) => (
                    <article key={article.id} className="flex flex-col gap-4 md:flex-row md:items-start">
                      <div className="h-60 w-full flex-shrink-0 overflow-hidden rounded md:h-30 md:w-30">
                        <img src={getImageUrl(article.image)} alt={article.title} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col gap-2">
                        <h3 className="m-0 font-outfit text-base font-semibold leading-snug text-black md:text-sm">{article.title}</h3>
                        <div className="flex items-center gap-3 font-outfit text-sm text-gray-600">
                          <span>{article.author}</span>
                          <span>{formatDate(article.published_at)}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                  <Link href="/news" className="mt-6 inline-block self-start py-3 font-outfit text-base font-semibold text-rental-blue-800 transition-colors hover:text-rental-orange-500">
                    View More News →
                  </Link>
                </div>
                
                <div className="flex h-full items-center justify-center rounded bg-gradient-to-b from-rental-orange-500 to-rental-blue-800 px-5 py-15">
                  <span className="font-outfit text-3xl font-bold uppercase tracking-wider text-white md:text-2xl">ADVERTISEMENT</span>
                </div>
              </div>

              {/* Second Column - Large Card, Two Medium Cards, Smaller Articles */}
              <div className="flex h-full flex-col justify-start gap-5">
                <h2 className="font-outfit text-2xl font-bold text-rental-blue-800 md:text-lg">Editors Choice</h2>
                
                {/* Large Featured Card */}
                {column2Data.largeCard && (
                  <article className="mb-2 overflow-hidden rounded">
                    <div className="relative h-96 w-full overflow-hidden md:h-64">
                      <img src={getImageUrl(column2Data.largeCard.image)} alt={column2Data.largeCard.title} className="h-full w-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-3 bg-gradient-to-t from-black/80 to-transparent p-6">
                        <span className="mb-1 font-outfit text-sm font-medium text-white" style={{ color: getCategoryColor(column2Data.largeCard.category) }}>• {column2Data.largeCard.category}</span>
                        <h3 className="m-0 font-outfit text-xl font-semibold leading-snug text-white">{column2Data.largeCard.title}</h3>
                        <div className="flex items-center gap-3 font-outfit text-sm text-white">
                          <span>{column2Data.largeCard.author}</span>
                          <span>{formatDate(column2Data.largeCard.published_at)}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                )}

                {/* Two Medium Cards Side by Side */}
                <div className="mb-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {column2Data.mediumCards.map((article) => (
                    <article key={article.id} className="flex flex-col overflow-hidden rounded bg-white shadow-md">
                      <div className="h-40 w-full overflow-hidden md:h-36">
                        <img src={getImageUrl(article.image)} alt={article.title} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex flex-col gap-2 p-4">
                        <h4 className="m-0 font-outfit text-sm font-semibold leading-snug text-black">{article.title}</h4>
                        <div className="flex items-center gap-2 font-outfit text-xs text-gray-600">
                          <span>{article.author}</span>
                          <span>{formatDate(article.published_at)}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Smaller Articles */}
                <div className="flex flex-col gap-4">
                  {column2Data.smallerArticles.slice(0, 3).map((article) => (
                    <article key={article.id} className="flex flex-row-reverse items-start gap-3 md:flex-row">
                      <div className="flex flex-1 flex-col gap-1.5">
                        <span className="font-outfit text-xs font-medium text-gray-500" style={{ color: getCategoryColor(article.category) }}>• {article.category}</span>
                        <h5 className="m-0 font-outfit text-sm font-semibold leading-snug text-black">{article.title}</h5>
                        <div className="flex items-center gap-2 font-outfit text-xs text-gray-600">
                          <span>{article.author}</span>
                          <span>{formatDate(article.published_at)}</span>
                        </div>
                      </div>
                      <div className="h-16 w-20 flex-shrink-0 overflow-hidden rounded md:h-18">
                        <img src={getImageUrl(article.image)} alt={article.title} className="h-full w-full object-cover" />
                      </div>
                    </article>
                  ))}
                </div>
                <Link href="/blog" className="mt-6 inline-block self-start py-3 font-outfit text-base font-semibold text-rental-blue-800 transition-colors hover:text-rental-orange-500">
                  View More News →
                </Link>
              </div>

              {/* Third Column - Medium Card and Smaller Articles */}
              <div className="flex h-full flex-col justify-start gap-5">
                <h2 className="font-outfit text-2xl font-bold text-rental-blue-800 md:text-lg">Trending</h2>
                
                {/* Medium Card */}
                {column3Data.mediumCard && (
                  <article className="mb-2 flex flex-col overflow-hidden rounded">
                    <div className="h-60 w-full overflow-hidden md:h-56">
                      <img src={getImageUrl(column3Data.mediumCard.image)} alt={column3Data.mediumCard.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-col gap-2 pt-4">
                      <h4 className="m-0 font-outfit text-base font-semibold leading-snug text-black">{column3Data.mediumCard.title}</h4>
                      <div className="flex items-center gap-2 font-outfit text-xs text-gray-600">
                        <span>{column3Data.mediumCard.author}</span>
                        <span>{formatDate(column3Data.mediumCard.published_at)}</span>
                      </div>
                    </div>
                  </article>
                )}

                {/* Smaller Articles */}
                <div className="flex flex-col gap-4">
                  {column3Data.smallerArticles.slice(0, 3).map((article) => (
                    <article key={article.id} className="flex flex-row-reverse items-start gap-3 md:flex-row">
                      <div className="flex flex-1 flex-col gap-1.5">
                        <span className="font-outfit text-xs font-medium text-gray-500" style={{ color: getCategoryColor(article.category) }}>• {article.category}</span>
                        <h5 className="m-0 font-outfit text-sm font-semibold leading-snug text-black">{article.title}</h5>
                        <div className="flex items-center gap-2 font-outfit text-xs text-gray-600">
                          <span>{article.author}</span>
                          <span>{formatDate(article.published_at)}</span>
                        </div>
                      </div>
                      <div className="h-16 w-20 flex-shrink-0 overflow-hidden rounded md:h-36">
                        <img src={getImageUrl(article.image)} alt={article.title} className="h-full w-full object-cover" />
                      </div>
                    </article>
                  ))}
                </div>
                <Link href="/blog" className="mt-6 inline-block self-start py-3 font-outfit text-base font-semibold text-rental-blue-800 transition-colors hover:text-rental-orange-500">
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

