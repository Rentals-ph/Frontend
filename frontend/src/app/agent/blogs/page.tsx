'use client'

import { useMemo, useState } from 'react'
import AppSidebar from '../../../components/common/AppSidebar'
import AgentHeader from '../../../components/agent/AgentHeader'
import '../../../pages-old/agent/AgentDashboard.css'
import '../../../pages-old/agent/AgentShareBlogs.css'

type AgentBlogCard = {
  id: number
  title: string
  image: string
}

export default function AgentShareBlogs() {
  const [currentPage, setCurrentPage] = useState(1)

  const blogs: AgentBlogCard[] = useMemo(
    () => [
      { id: 1, title: 'How Much Rent Can You Really Afford in 2026?', image: '/assets/blog-image.png' },
      { id: 2, title: 'Post-Holiday Budget Reset', image: '/assets/blog-image2.png' },
      { id: 3, title: 'Finding a Home Made Simple', image: '/assets/blog-main.png' },
      { id: 4, title: 'Back-to-School Smart Living', image: '/assets/blog-image2.png' },
      { id: 5, title: 'Why January is the Smartest Month', image: '/assets/blog-image.png' },
      { id: 6, title: 'Small Space, Big Holiday Glow', image: '/assets/blog-main.png' }
    ],
    []
  )

  return (
    <div className="agent-dashboard agent-share-blogs-page">
      <AppSidebar />

      <main className="agent-main">
        <AgentHeader 
          title="Share Blogs" 
          subtitle="Create and share blog posts with the community." 
        />

        <section className="asb-content">
          <div className="asb-heading">
            <h2 className="asb-title">Share Blogs</h2>
            <p className="asb-subtitle">Share your knowledge today!</p>
          </div>

          <div className="asb-carousel">
            <button className="asb-arrow asb-arrow-left" type="button" aria-label="Previous">
              ‹
            </button>

            <div className="asb-grid" role="list">
              {blogs.map((b) => (
                <article key={b.id} className="asb-card" role="listitem">
                  <div className="asb-card-image">
                    <img src={b.image} alt={b.title} />
                  </div>
                </article>
              ))}
            </div>

            <button className="asb-arrow asb-arrow-right" type="button" aria-label="Next">
              ›
            </button>
          </div>

          <div className="asb-pagination" aria-label="Pagination">
            <button className="asb-page-btn asb-page-prev" type="button" aria-label="Previous page">
              ‹
            </button>
            <button
              className={`asb-page-number ${currentPage === 1 ? 'active' : ''}`}
              type="button"
              onClick={() => setCurrentPage(1)}
            >
              1
            </button>
            <button
              className={`asb-page-number ${currentPage === 2 ? 'active' : ''}`}
              type="button"
              onClick={() => setCurrentPage(2)}
            >
              2
            </button>
            <button
              className={`asb-page-number ${currentPage === 3 ? 'active' : ''}`}
              type="button"
              onClick={() => setCurrentPage(3)}
            >
              3
            </button>
            <span className="asb-page-ellipsis">…</span>
            <button
              className={`asb-page-number ${currentPage === 50 ? 'active' : ''}`}
              type="button"
              onClick={() => setCurrentPage(50)}
            >
              50
            </button>
            <button className="asb-page-btn asb-page-next" type="button" aria-label="Next page">
              ›
            </button>
          </div>
        </section>

      </main>
    </div>
  )
}
