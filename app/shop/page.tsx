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
    <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-gray-900">Our Breads</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-lg flex flex-col">
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
    </div>
  )
}
