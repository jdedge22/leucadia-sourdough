import Link from 'next/link'
import './globals.css'
import { CartProvider } from './context/CartContext'
import CartButton from './components/CartButton'

export const metadata = {
  title: 'Leucadia Sourdough | Fresh-Milled Organic Sourdough Delivery',
  description: '40% more nutrients than store-bought bread. Fresh-milled organic sourdough delivered weekly to North County San Diego.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between items-center h-16">
                <Link href="/" className="flex items-center space-x-3">
                  <img 
                    src="https://leucadiasourdough.com/cdn/shop/files/Logo-Sarah.jpg?height=50"
                    alt="Leucadia Sourdough"
                    className="h-12"
                  />
                  <span className="text-xl font-bold text-gray-900">Leucadia Sourdough</span>
                </Link>

                <div className="flex space-x-6 items-center">
                  <Link href="/" className="text-gray-900 hover:opacity-70 font-medium transition">
                    Home
                  </Link>
                  <Link href="/shop" className="text-gray-900 hover:opacity-70 font-medium transition">
                    Shop
                  </Link>
                  <Link href="/subscribe" className="text-gray-900 hover:opacity-70 font-medium transition">
                    Subscribe
                  </Link>
                  <Link href="/about" className="text-gray-900 hover:opacity-70 font-medium transition">
                    About
                  </Link>
                  <CartButton />
                  <Link href="/portal" className="hover:opacity-90 text-white px-6 py-2 rounded-lg font-semibold transition shadow-md" style={{ backgroundColor: '#5B7C99' }}>
                    Portal
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          <main>{children}</main>

          <footer className="bg-gray-900 text-white py-12 px-4 mt-20">
            <div className="max-w-7xl mx-auto">
              <div className="text-center">
                <p className="text-gray-400">© {new Date().getFullYear()} Leucadia Sourdough. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  )
}
