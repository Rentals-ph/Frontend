import type { Metadata } from 'next'
import '../index.css'
import '../styles/landing.css'

export const metadata: Metadata = {
  title: 'Rental.ph - Your Trusted Property Rental Platform',
  description: 'Find the perfect rental property in the Philippines',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

