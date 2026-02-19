'use client'

import { useCart } from '../context/CartContext'
import Link from 'next/link'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart()

  if (itemCount === 0) {
    return (
      <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-amber-50 to-orange-50">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some delicious bread to get started!</p>
          <Link href="/shop" className="inline-block hover:opacity-90 text-white px-8 py-3 rounded-lg font-semibold transition" style={{ backgroundColor: '#5B7C99' }}>
            Shop Breads
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Your Cart</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-4 py-4 border-b last:border-0">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
              <div className="flex-grow">
                <h3 className="font-bold text-gray-900">{item.name}</h3>
                <p className="text-gray-600">${item.price}.00 each</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded border hover:bg-gray-100"
                >
                  -
                </button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded border hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <p className="font-bold w-20 text-right" style={{ color: '#5B7C99' }}>
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              <button 
                onClick={() => removeItem(item.id)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
          
          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-between items-center text-2xl font-bold">
              <span className="text-gray-900">Total:</span>
              <span style={{ color: '#5B7C99' }}>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <Link 
          href="/checkout"
          className="block w-full text-center hover:opacity-90 text-white py-4 rounded-lg text-lg font-semibold transition shadow-lg"
          style={{ backgroundColor: '#5B7C99' }}
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  )
}
