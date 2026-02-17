'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
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
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <PageHeader title="BLOG" />
      <main className="mx-auto w-full max-w-7xl">
        {loading ? (
          <div className="text-center">
            <p>Loading blogs...</p>
          </div>
        ) : (
          <>
            {/* Articles Grid */}
            <div className="mb-15 grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-3">
              {regularPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.id}`} className="no-underline">
                  <article className="flex flex-col overflow-hidden rounded bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
                    <div className="h-50 w-full overflow-hidden">
                      <img src={getImageUrl(post.image)} alt={post.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-col gap-2.5 p-6">
                      <div className="mb-2 flex items-center gap-2.5">
                        <span className="rounded bg-green-600 px-3 py-1 font-outfit text-xs font-semibold text-white">{post.category}</span>
                        <span className="font-outfit text-xs text-gray-600">{formatReadTime(post.read_time)}</span>
                      </div>
                      <h3 className="m-0 font-outfit text-lg font-semibold leading-snug text-black">{post.title}</h3>
                      <span className="ml-auto mt-auto self-end font-outfit text-sm font-semibold text-rental-blue-600 transition-colors hover:text-rental-orange-500">Read More →</span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Newsletter Section */}
      <div className="mt-2.5 w-full bg-rental-blue-600 px-0 py-15 text-center">
        <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-16">
          <h2 className="mb-4 font-outfit text-4xl font-bold text-white md:text-3xl">Subscribe to Our Newsletter</h2>
          <p className="mb-8 font-outfit text-lg leading-relaxed text-white opacity-95">
            Get the latest rental tips, market insights, and property updates delivered to your inbox.
          </p>
          <form className="mx-auto flex max-w-2xl justify-center gap-2.5 md:flex-col">
            <input
              type="email"
              placeholder="Enter your email"
              className="max-w-md flex-1 rounded-xl border-0 bg-white px-6 py-4 font-outfit text-base text-black outline-none placeholder:text-gray-500 md:max-w-full"
              required
            />
            <button type="submit" className="whitespace-nowrap rounded-xl border-0 bg-white px-8 py-4 font-outfit text-base font-semibold text-teal-800 transition-all hover:-translate-y-0.5 hover:bg-gray-100 hover:shadow-md">Subscribe</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}
