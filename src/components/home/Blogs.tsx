'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Pagination from '../common/Pagination'
import { blogsApi } from '../../api'
import type { Blog } from '../../types'
import { ASSETS } from '@/utils/assets'

const Blogs = () => {
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
    <section id="blog" className="bg-white px-6 md:px-10 lg:px-[150px] w-full mt-0 min-h-[70vh] flex flex-col justify-center py-8">
      <div className="w-full mx-auto overflow-visible py-5">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-gray-900 font-outfit text-3xl font-bold leading-tight tracking-tight m-0 mb-2.5">
              Blogs
            </h2>
            <p className="text-gray-600 font-outfit text-base font-light leading-snug tracking-tight m-0">
              We Share Our Knowledge
            </p>
          </div>
          <Link href="/blog" className="text-rental-blue-600 font-outfit text-base font-medium no-underline flex items-center gap-3.5 tracking-tight leading-none mt-6 hover:text-rental-orange-500 transition-colors">
            Visit Blogs
            <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 1L13 8L7 15M13 8H1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="text-center p-10">
            <p>Loading blogs...</p>
          </div>
        ) : (
          <div className="flex gap-10 items-stretch w-full overflow-visible relative min-h-[200px]">
            {/* Left Small Blog Card */}
            <div className="flex-1 min-w-0 max-w-[28%] flex relative transition-all duration-600">
              <Link href={leftBlog.id === 'placeholder' ? '#' : `/blog/${leftBlog.id}`} className="no-underline w-full">
                <article className="bg-white rounded-2xl overflow-hidden flex flex-col h-full group hover:shadow-xl transition-shadow">
                  <img
                    src={getImageUrl(leftBlog.image)}
                    alt={leftBlog.title}
                    className="w-full h-[200px] object-cover"
                  />
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-rental-blue-600 font-outfit text-xs font-semibold uppercase tracking-wider">{leftBlog.category}</span>
                      <span className="text-gray-500 font-outfit text-xs">{formatReadTime(leftBlog.read_time)}</span>
                    </div>
                    <h3 className="text-gray-900 font-outfit text-lg font-bold leading-snug mb-3 line-clamp-2">{leftBlog.title}</h3>
                    <p className="text-gray-600 font-outfit text-sm leading-relaxed mb-4 line-clamp-3 flex-1">{leftBlog.excerpt}</p>
                    <div className="flex flex-col gap-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                          <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.866 0-7 2.239-7 5v3h14v-3c0-2.761-3.134-5-7-5z"/>
                        </svg>
                        <span className="font-outfit text-sm">{leftBlog.author}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                          <path d="M6 2a1 1 0 1 1 2 0v1h4V2a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h1V2a1 1 0 1 1 2 0v1zm10 3H4v11h12V5zm-1 2v2H5V7h10z"/>
                        </svg>
                        <span className="font-outfit text-xs">{formatDate(leftBlog.published_at)}</span>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <span className="text-rental-blue-600 font-outfit text-sm font-medium flex items-center gap-2 group-hover:text-rental-orange-500 transition-colors">
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
            <div className="flex-[2] min-w-0 flex relative transition-all duration-600">
              <Link href={centerBlog.id === 'placeholder' ? '#' : `/blog/${centerBlog.id}`} className="no-underline w-full">
                <article className="relative rounded-2xl overflow-hidden h-full group">
                  <img
                    src={getImageUrl(centerBlog.image)}
                    alt={centerBlog.title}
                    className="w-full h-full min-h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-white font-outfit text-sm font-semibold uppercase tracking-wider">{centerBlog.category}</span>
                      <span className="text-white/90 font-outfit text-sm">{formatReadTime(centerBlog.read_time)}</span>
                    </div>
                    <h3 className="text-white font-outfit text-3xl font-bold leading-tight mb-4">{centerBlog.title}</h3>
                    <p className="text-white/95 font-outfit text-base leading-relaxed mb-6 line-clamp-3">{centerBlog.excerpt}</p>
                    <div className="flex gap-6 mb-6">
                      <div className="flex items-center gap-2 text-white">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                          <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.866 0-7 2.239-7 5v3h14v-3c0-2.761-3.134-5-7-5z"/>
                        </svg>
                        <span className="font-outfit text-base">{centerBlog.author}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/90">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                          <path d="M6 2a1 1 0 1 1 2 0v1h4V2a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h1V2a1 1 0 1 1 2 0v1zm10 3H4v11h12V5zm-1 2v2H5V7h10z"/>
                        </svg>
                        <span className="font-outfit text-sm">{formatDate(centerBlog.published_at)}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-white font-outfit text-lg font-medium flex items-center gap-3 group-hover:text-rental-orange-500 transition-colors">
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
            <div className="flex-1 min-w-0 max-w-[28%] flex relative transition-all duration-600">
              <Link href={rightBlog.id === 'placeholder' ? '#' : `/blog/${rightBlog.id}`} className="no-underline w-full">
                <article className="bg-white rounded-2xl overflow-hidden flex flex-col h-full group hover:shadow-xl transition-shadow">
                  <img
                    src={getImageUrl(rightBlog.image)}
                    alt={rightBlog.title}
                    className="w-full h-[200px] object-cover"
                  />
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-rental-blue-600 font-outfit text-xs font-semibold uppercase tracking-wider">{rightBlog.category}</span>
                      <span className="text-gray-500 font-outfit text-xs">{formatReadTime(rightBlog.read_time)}</span>
                    </div>
                    <h3 className="text-gray-900 font-outfit text-lg font-bold leading-snug mb-3 line-clamp-2">{rightBlog.title}</h3>
                    <p className="text-gray-600 font-outfit text-sm leading-relaxed mb-4 line-clamp-3 flex-1">{rightBlog.excerpt}</p>
                    <div className="flex flex-col gap-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                          <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.866 0-7 2.239-7 5v3h14v-3c0-2.761-3.134-5-7-5z"/>
                        </svg>
                        <span className="font-outfit text-sm">{rightBlog.author}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                          <path d="M6 2a1 1 0 1 1 2 0v1h4V2a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h1V2a1 1 0 1 1 2 0v1zm10 3H4v11h12V5zm-1 2v2H5V7h10z"/>
                        </svg>
                        <span className="font-outfit text-xs">{formatDate(rightBlog.published_at)}</span>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <span className="text-rental-blue-600 font-outfit text-sm font-medium flex items-center gap-2 group-hover:text-rental-orange-500 transition-colors">
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
          <div className="flex justify-center mt-12">
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
