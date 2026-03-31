import type { Metadata } from 'next'
import Navbar from './Navbar'
import './globals.css'

export const metadata: Metadata = {
  title: 'Leucadia Sourdough | Fresh-Milled Organic Sourdough Delivery',
  description:
    '40% more nutrients than store-bought bread. Fresh-milled organic sourdough delivered weekly to North County San Diego.',
  openGraph: {
    title: 'Leucadia Sourdough | Fresh-Milled Organic Sourdough',
    description:
      'Fresh-milled within 24 hours of baking. 40% more nutrients. Delivered weekly to North County San Diego.',
    url: 'https://leucadiasourdough.com',
    siteName: 'Leucadia Sourdough',
    images: [
      {
        url: '/images/two-loaves-artisan-craft.jpg',
        width: 1200,
        height: 630,
        alt: 'Leucadia Sourdough — fresh-milled artisan loaves',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leucadia Sourdough | Fresh-Milled Organic Sourdough',
    description:
      'Fresh-milled within 24 hours of baking. Delivered weekly to North County San Diego.',
    images: ['/images/two-loaves-artisan-craft.jpg'],
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 'https://leucadiasourdough.com'
  ),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <footer className="bg-gray-900 text-white py-12 px-4 mt-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <p className="text-gray-400">
                &copy; {new Date().getFullYear()} Leucadia Sourdough. All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
