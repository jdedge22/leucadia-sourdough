'use client'

import Link from 'next/link'
import { useCart } from './context/CartContext'

const products = [
  {
    id: 'original',
    name: 'Original Leucadia Sourdough',
    price: 10,
    image: 'https://leucadiasourdough.com/cdn/shop/files/lucid-origin_Artisan_sourdough_bread_boule_on_rustic_wooden_cutting_board_golden-brown_crust_-0.jpg?v=1768347084&width=800',
    description: 'Our signature fresh-milled organic sourdough.'
  },
  {
    id: 'everything',
    name: 'Everything Bagel',
    price: 10,
    image: 'https://leucadiasourdough.com/cdn/shop/files/using-the-photos-selected-as-guidance-please-create-everything-bagel-sourdough.png?v=1768332745&width=800',
    description: 'Fresh-milled sourdough with everything bagel seasoning.'
  },
  {
    id: 'jalapeno',
    name: 'Jalapeño & Cheddar',
    price: 10,
    image: 'https://leucadiasourdough.com/cdn/shop/files/jalapeno-cheddar-version-of-same-bread.png?v=1768332586&width=800',
    description: 'Spicy jalapeños and sharp cheddar.'
  }
]

export default function HomePage() {
  const { addItem } = useCart()

  return (
    <div>
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://leucadiasourdough.com/cdn/shop/files/Home_Page_Image.jpg?v=1768944162&width=1920)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-black/30" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-2xl" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
            Fresh-Milled Flour.<br />40% More Nutrients.<br />Delivered to Your Door.
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white drop-shadow-lg" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
            Organic sourdough, milled within 24 hours of baking
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/subscribe"
              className="hover:opacity-90 text-white px-8 py-4 rounded-lg text-lg font-semibold transition shadow-xl"
              style={{ backgroundColor: '#5B7C99' }}
            >
              Fresh Milled Delivered Monthly
            </Link>
            <Link
              href="#products"
              className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition shadow-xl"
            >
              Shop Breads
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Benefits */}
      <section className="py-16 bg-gradient-to-b from-amber-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-5xl font-bold mb-3" style={{ color: '#5B7C99' }}>40-50%</div>
              <p className="font-semibold text-gray-900 text-lg">More Nutrients</p>
              <p className="text-gray-600 mt-2">Than store-bought flour</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-5xl font-bold mb-3" style={{ color: '#5B7C99' }}>24hr</div>
              <p className="font-semibold text-gray-900 text-lg">Fresh-Milled</p>
              <p className="text-gray-600 mt-2">Ground just before baking</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-5xl font-bold mb-3" style={{ color: '#5B7C99' }}>100%</div>
              <p className="font-semibold text-gray-900 text-lg">Organic</p>
              <p className="text-gray-600 mt-2">Certified organic ingredients</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">Our Breads</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-lg flex flex-col border border-gray-200">
                <div className="h-64 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">{product.name}</h3>
                  <p className="text-gray-700 mb-4 flex-grow">{product.description}</p>
                  <div className="mt-auto">
                    <p className="text-2xl font-bold mb-4" style={{ color: '#5B7C99' }}>${product.price}.00</p>
                    <button 
                      onClick={() => addItem(product)}
                      className="w-full hover:opacity-90 text-white py-3 rounded-lg font-semibold transition" 
                      style={{ backgroundColor: '#5B7C99' }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA for Subscription */}
      <section className="py-16 bg-gradient-to-b from-orange-50 to-amber-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Want Fresh Bread Every Week?</h2>
          <p className="text-xl mb-8 text-gray-700">Subscribe for weekly delivery - 2 loaves per week delivered fresh</p>
          <Link
            href="/subscribe"
            className="inline-block hover:opacity-90 text-white px-10 py-4 rounded-lg text-lg font-semibold transition shadow-lg"
            style={{ backgroundColor: '#5B7C99' }}
          >
            Fresh Milled Delivered Monthly
          </Link>
        </div>
      </section>
    </div>
  )
}
