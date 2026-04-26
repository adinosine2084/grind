import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GRIND — Brutally Simple Task Manager',
  description: 'The task manager that doesn\'t get in your way. Fast. Ruthless. Effective.',
  manifest: '/manifest.json',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'GRIND — Brutally Simple Task Manager',
    description: 'No dashboards for your dashboards. Just work.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#FFE500',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=IBM+Plex+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-paper text-ink font-mono antialiased">{children}</body>
    </html>
  )
}
