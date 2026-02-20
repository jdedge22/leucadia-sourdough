'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SubscribePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedTier, setSelectedTier] = useState<'bread' | 'bread-pastries'>('bread')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Block submission if Bread + Pastries is selected (coming soon)
    if (selectedTier === 'bread-pastries') {
      alert('Bread + Pastries tier coming soon! Please select Bread Only to continue.')
      return
    }
    
    setLoading(true)

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tier: selectedTier
        }),
      })

      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to create checkout session. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Hero - Different from Shop page */}
      <section className="relative h-96 flex items-center justify-center">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/images/bread-sliced-butter-lifestyle.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-2xl">
            Fresh Bread, Delivered Weekly
          </h1>
          <p className="text-xl md:text-2xl text-white drop-shadow-lg">
            Never run out of fresh-milled sourdough again
          </p>
        </div>
      </section>

      {/* Benefits Cards */}
      <section className="py-16 bg-gradient-to-b from-white to-amber-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">What You Get</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src="/images/bread-sliced-butter-lifestyle.jpg"
                  alt="Weekly delivery"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900">Weekly Delivery</h3>
                <p className="text-gray-600">
                  Fresh bread delivered every Thursday, Friday, or Saturday—your choice.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src="/images/bread-sliced-warm-light.jpg"
                  alt="Baked fresh"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900">Baked the Night Before</h3>
                <p className="text-gray-600">
                  Your loaves are baked fresh the evening before delivery for maximum freshness.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src="/images/avocado-toast-lifestyle.jpg"
                  alt="Quality guarantee"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900">Flexible Plans</h3>
                <p className="text-gray-600">
                  Pause, skip, or cancel anytime. No long-term commitment required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Tiers */}
      <section className="py-16 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">Choose Your Plan</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">Select the subscription that fits your needs</p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Bread Only Tier */}
            <div 
              onClick={() => setSelectedTier('bread')}
              className={`bg-white rounded-xl shadow-xl overflow-hidden cursor-pointer transition-all ${
                selectedTier === 'bread' ? 'ring-4 ring-offset-2' : 'hover:shadow-2xl'
              }`}
              style={{ ringColor: selectedTier === 'bread' ? '#5B7C99' : 'transparent' }}
            >
              <div className="h-56 overflow-hidden">
                <img
                  src="/images/bread-sliced-warm-light.jpg"
                  alt="Bread subscription"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">Bread Only</h3>
                  {selectedTier === 'bread' && (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: '#5B7C99' }}>
                      ✓
                    </div>
                  )}
                </div>
                <div className="text-4xl font-bold mb-4" style={{ color: '#5B7C99' }}>$75<span className="text-xl text-gray-600">/month</span></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#5B7C99' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">2 fresh loaves per week</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#5B7C99' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">8 loaves per month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#5B7C99' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Free weekly delivery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#5B7C99' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Cancel anytime</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bread + Pastries Tier - COMING SOON */}
            <div 
              onClick={() => setSelectedTier('bread-pastries')}
              className={`bg-white rounded-xl shadow-xl overflow-hidden cursor-pointer transition-all relative opacity-75 ${
                selectedTier === 'bread-pastries' ? 'ring-4 ring-offset-2' : 'hover:shadow-2xl'
              }`}
              style={{ ringColor: selectedTier === 'bread-pastries' ? '#5B7C99' : 'transparent' }}
            >
              {/* COMING SOON Banner */}
              <div className="absolute top-4 left-4 right-4 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg text-center font-bold shadow-xl transform -rotate-1">
                🎉 COMING SOON
              </div>
              
              <div className="h-56 overflow-hidden">
                <img
                  src="/images/avocado-toast-lifestyle.jpg"
                  alt="Bread and pastries subscription"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">Bread + Pastries</h3>
                  {selectedTier === 'bread-pastries' && (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: '#5B7C99' }}>
                      ✓
                    </div>
                  )}
                </div>
                <div className="text-4xl font-bold mb-4" style={{ color: '#5B7C99' }}>$125<span className="text-xl text-gray-600">/month</span></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#5B7C99' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">2 fresh loaves per week</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#5B7C99' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">4 artisan pastries per week</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#5B7C99' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Rotating seasonal varieties</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#5B7C99' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Free weekly delivery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#5B7C99' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Cancel anytime</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Signup Form */}
      <section className="py-16 bg-gradient-to-b from-white to-amber-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-2 text-gray-900">Start Your Subscription</h2>
            <p className="text-gray-600 mb-8">Complete your delivery details below</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-opacity-50 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-opacity-50 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900"
                    placeholder="92024"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <label className="block text-sm font-semibold mb-3 text-gray-900">Preferred Delivery Day</label>
                <select
                  value={formData.deliveryDay}
                  onChange={(e) => setFormData({...formData, deliveryDay: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900"
                >
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                </select>
                <p className="text-sm text-gray-600 mt-2">Baked fresh the night before delivery</p>
              </div>

              <button 
                type="submit" 
                disabled={loading || selectedTier === 'bread-pastries'} 
                className="w-full text-white py-4 rounded-lg font-bold text-lg hover:opacity-90 disabled:opacity-50 transition shadow-lg"
                style={{ backgroundColor: '#5B7C99' }}
              >
                {loading ? 'Processing...' : selectedTier === 'bread-pastries' ? 'Coming Soon - Select Bread Only' : `Subscribe - $75/month`}
              </button>

              <p className="text-xs text-center text-gray-500">
                Cancel anytime. No long-term commitment required.
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}