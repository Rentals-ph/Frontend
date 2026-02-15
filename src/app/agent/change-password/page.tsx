'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * This page redirects to the unified Account Settings page.
 * The Change Password functionality is now part of /agent/account under the "Change Password" tab.
 */
export default function AgentChangePassword() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the unified account settings page
    router.replace('/agent/account')
  }, [router])

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Inter, sans-serif'
    }}>
      <p>Redirecting to Account Settings...</p>
    </div>
  )
}
