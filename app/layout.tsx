import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'CutMyAI - AI Spend Audit Tool',
  description: 'Discover where you\'re overspending on AI tools. Get instant recommendations to cut costs and maximize ROI.',
  generator: 'v0.app',
  openGraph: {
    title: 'CutMyAI - AI Spend Audit Tool',
    description: 'Discover where you\'re overspending on AI tools. Get instant recommendations to cut costs and maximize ROI.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CutMyAI - AI Spend Audit Tool',
    description: 'Discover where you\'re overspending on AI tools. Get instant recommendations to cut costs and maximize ROI.',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
