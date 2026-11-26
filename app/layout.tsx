import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { JsonLd } from '@/components/json-ld'
import { SITE_DESCRIPTION, SITE_NAME, SITE_ORIGIN, siteStructuredData } from '@/lib/site'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: 'VELOR Private Estates | Exceptional Residences',
    template: '%s | VELOR Private Estates',
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: SITE_NAME,
    title: 'VELOR Private Estates — Beyond the Address',
    description: SITE_DESCRIPTION,
    images: [{ url: '/images/velor-private-courtyard.png', alt: 'A private residence framed by a landscaped courtyard.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VELOR Private Estates — Beyond the Address',
    description: SITE_DESCRIPTION,
    images: ['/images/velor-private-courtyard.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  generator: 'v0.app',
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

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0B0B0A',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Italiana&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <JsonLd data={siteStructuredData} />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
