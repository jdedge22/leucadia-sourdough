'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '../context/CartContext'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    streetAddress: '',
    city: '',
    zipCode: '',
    deliveryDay: 'thursday'
  })

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-amber-50 to-orange-50">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some bread to checkout!</p>
          <Link href="/shop" className="inline-block hover:opacity-90 text-white px-8 py-3 rounded-lg font-semibold transition" style={{ backgroundColor: '#5B7C99' }}>
            Shop Breads
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/create-one-time-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })),
          total
        }),
      })

      const data = await response.json()
      
      if (data.url) {
        clearCart()
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to create checkout. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative">
      {/* Subtle bread texture background */}
      <div 
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: 'url(/images/bread-sliced-warm-light.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/90 to-orange-50/90 z-0" />
      
      <div className="relative z-10 py-12 px-4">
        {/* Header with progress indicator */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#5B7C99' }}>
                ✓
              </div>
              <span className="font-semibold text-gray-900">Cart</span>
            </div>
            <div className="w-16 h-1 bg-gray-300 rounded">
              <div className="w-full h-full rounded" style={{ backgroundColor: '#5B7C99' }}></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#5B7C99' }}>
                2
              </div>
              <span className="font-semibold text-gray-900">Delivery</span>
            </div>
            <div className="w-16 h-1 bg-gray-300 rounded"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
                3
              </div>
              <span className="text-gray-600">Payment</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-center text-gray-900">Checkout</h1>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary - Enhanced */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                <svg className="w-6 h-6" style={{ color: '#5B7C99' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-start pb-4 border-b border-gray-200">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Quantity: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-bold text-lg" style={{ color: '#5B7C99' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              
              {/* Trust Badge */}
              <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-100">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5" style={{ color: '#5B7C99' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Secure Checkout</p>
                    <p className="text-xs text-gray-600">Powered by Stripe</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-semibold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between items-center text-2xl font-bold pt-4 border-t border-gray-200">
                  <span className="text-gray-900">Total</span>
                  <span style={{ color: '#5B7C99' }}>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Form - Enhanced */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                <svg className="w-6 h-6" style={{ color: '#5B7C99' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Delivery Information
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900">First Name</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900">Last Name</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Phone</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Street Address</label>
                  <input
                    type="text"
                    required
                    value={formData.streetAddress}
                    onChange={(e) => setFormData({...formData, streetAddress: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition"
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900">City</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition"
                      placeholder="Encinitas"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900">Zip Code</label>
                    <input
                      type="text"
                      required
                      value={formData.zipCode}
                      onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition"
                      placeholder="92024"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <label className="block text-sm font-semibold mb-3 text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5" style={{ color: '#5B7C99' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Preferred Delivery Day
                  </label>
                  <select
                    value={formData.deliveryDay}
                    onChange={(e) => setFormData({...formData, deliveryDay: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition"
                  >
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                  </select>
                  <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Baked fresh the night before delivery
                  </p>
                </div>

                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full text-white py-4 rounded-lg font-bold text-lg hover:opacity-90 disabled:opacity-50 transition shadow-lg flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#5B7C99' }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Pay ${total.toFixed(2)}
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-gray-500">
                  By completing your purchase you agree to our terms of service
                </p>
              </form>
            </div>
          </div>

          {/* Trust section */}
          <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-100">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <svg className="w-10 h-10 mb-3" style={{ color: '#5B7C99' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h3 className="font-bold text-gray-900 mb-1">Secure Payment</h3>
                <p className="text-sm text-gray-600">SSL encrypted checkout</p>
              </div>
              <div className="flex flex-col items-center">
                <svg className="w-10 h-10 mb-3" style={{ color: '#5B7C99' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-bold text-gray-900 mb-1">Fresh Guarantee</h3>
                <p className="text-sm text-gray-600">Baked within 24 hours</p>
              </div>
              <div className="flex flex-col items-center">
                <svg className="w-10 h-10 mb-3" style={{ color: '#5B7C99' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="font-bold text-gray-900 mb-1">Order Updates</h3>
                <p className="text-sm text-gray-600">Track your delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
