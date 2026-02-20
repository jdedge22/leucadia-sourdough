'use client'

import Link from 'next/link'
import { useCart } from '../context/CartContext'

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

export default function ShopPage() {
  const { addItem } = useCart()

  return (
    <div>
      {/* Hero */}
      <section className="relative h-96 flex items-center justify-center">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/images/two-loaves-artisan-craft.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
        
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-2xl">
            Shop Our Breads
          </h1>
          <p className="text-xl text-white drop-shadow-lg">
            Fresh-milled, naturally fermented, baked with care
          </p>
        </div>
      </section>

      {/* Why Fresh-Milled Cards */}
      <section className="py-16 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Why Fresh-Milled?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src="/images/bread-sliced-butter-lifestyle.jpg"
                  alt="Fresh milled flour"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900">40-50% More Nutrients</h3>
                <p className="text-gray-600">
                  Flour oxidizes quickly. We mill within 24 hours of baking to preserve maximum nutrition.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src="/images/bread-sliced-warm-light.jpg"
                  alt="Artisan process"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900">24-Hour Fermentation</h3>
                <p className="text-gray-600">
                  Slow sourdough fermentation breaks down gluten and enhances digestibility.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src="/images/two-loaves-artisan-craft.jpg"
                  alt="Small batch baking"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900">Small Batch Craft</h3>
                <p className="text-gray-600">
                  Every loaf is shaped by hand and baked fresh. No preservatives, no shortcuts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">Our Breads</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-xl flex flex-col border border-gray-200 hover:shadow-2xl transition">
                <div className="h-64 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">{product.name}</h3>
                  <p className="text-gray-700 mb-4 flex-grow">{product.description}</p>
                  <div className="mt-auto">
                    <p className="text-2xl font-bold mb-4" style={{ color: '#5B7C99' }}>${product.price}.00</p>
                    <button 
                      onClick={() => addItem(product)}
                      className="w-full hover:opacity-90 text-white py-3 rounded-lg font-semibold transition shadow-md" 
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

      {/* Lifestyle Cards */}
      <section className="py-20 bg-gradient-to-b from-white to-orange-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4 text-center text-gray-900">
            How to Enjoy Your Bread
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Our customers love these simple preparations
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-56 overflow-hidden">
                <img
                  src="/images/avocado-toast-lifestyle.jpg"
                  alt="Avocado toast"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">Perfect for Avocado Toast</h3>
                <p className="text-gray-600">
                  The open crumb and crispy crust make it ideal for California-style breakfasts.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-56 overflow-hidden">
                <img
                  src="/images/bread-sliced-butter-lifestyle.jpg"
                  alt="Butter and salt"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">Simply Butter & Salt</h3>
                <p className="text-gray-600">
                  Sometimes the best way to enjoy artisan bread is the simplest—fresh butter and flaky sea salt.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-56 overflow-hidden">
                <img
                  src="/images/bread-sliced-warm-light.jpg"
                  alt="Sandwiches"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">Sandwiches That Hold</h3>
                <p className="text-gray-600">
                  The 24-hour fermentation creates structure that won't fall apart, even with generous fillings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-b from-orange-50 to-amber-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Want Fresh Bread Every Week?</h2>
          <p className="text-xl mb-8 text-gray-700">Subscribe for weekly delivery and never run out</p>
          <Link
            href="/subscribe"
            className="inline-block hover:opacity-90 text-white px-10 py-4 rounded-lg text-lg font-semibold transition shadow-lg"
            style={{ backgroundColor: '#5B7C99' }}
          >
            View Subscription Plans
          </Link>
        </div>
      </section>
    </div>
  )
}