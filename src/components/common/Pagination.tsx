'use client'

import React from 'react'
import './Pagination.css'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showPageNumbers?: boolean
  maxVisiblePages?: number
  className?: string
  showInfo?: boolean
  totalItems?: number
  itemsPerPage?: number
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = true,
  maxVisiblePages = 5,
  className = '',
  showInfo = false,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  // Calculate visible page numbers
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: (number | string)[] = []
    const half = Math.floor(maxVisiblePages / 2)

    if (currentPage <= half + 1) {
      // Show first pages
      for (let i = 1; i <= maxVisiblePages - 1; i++) {
        pages.push(i)
      }
      pages.push('ellipsis')
      pages.push(totalPages)
    } else if (currentPage >= totalPages - half) {
      // Show last pages
      pages.push(1)
      pages.push('ellipsis')
      for (let i = totalPages - (maxVisiblePages - 2); i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show middle pages
      pages.push(1)
      pages.push('ellipsis')
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i)
      }
      pages.push('ellipsis')
      pages.push(totalPages)
    }

    return pages
  }

  const visiblePages = getVisiblePages()

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number') {
      onPageChange(page)
    }
  }

  // Calculate results range for info display
  const getResultsInfo = () => {
    if (!totalItems || !itemsPerPage) return null
    
    const start = (currentPage - 1) * itemsPerPage + 1
    const end = Math.min(currentPage * itemsPerPage, totalItems)
    return { start, end, total: totalItems }
  }

  const resultsInfo = getResultsInfo()

  if (totalPages <= 1 && !showInfo) {
    return null
  }

  return (
    <div className={`pagination-wrapper ${className}`}>
      {showInfo && resultsInfo && (
        <div className="pagination-info">
          Showing <strong>{resultsInfo.start}</strong> to <strong>{resultsInfo.end}</strong> of <strong>{resultsInfo.total}</strong> results
        </div>
      )}
      
      <div className="pagination">
        {/* Previous Button */}
        <button
          className="pagination-arrow pagination-prev"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Page Numbers */}
        {showPageNumbers && (
          <>
            {visiblePages.map((page, index) => {
              if (page === 'ellipsis') {
                return (
                  <span key={`ellipsis-${index}`} className="pagination-ellipsis" aria-hidden="true">
                    ...
                  </span>
                )
              }

              const pageNumber = page as number
              const isActive = pageNumber === currentPage

              return (
                <button
                  key={pageNumber}
                  className={`pagination-number ${isActive ? 'active' : ''}`}
                  onClick={() => handlePageClick(pageNumber)}
                  aria-label={`Go to page ${pageNumber}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {pageNumber}
                </button>
              )
            })}
          </>
        )}

        {/* Next Button */}
        <button
          className="pagination-arrow pagination-next"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      
    </div>
  )
}

export default Pagination

