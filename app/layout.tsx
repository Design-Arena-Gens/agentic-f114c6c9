import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Tools Voice Guide',
  description: 'Voice-enabled guide to AI content creation tools',
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
