'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AgentCreateListing() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to category page
    router.push('/agent/create-listing/category')
  }, [router])

  return null
}

