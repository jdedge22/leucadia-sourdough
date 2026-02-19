'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SubscribePage() {
  const router = useRouter()
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Error:', error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Start Your Subscription</h1>
          <p className="text-gray-600 mb-8">Fresh-milled organic sourdough delivered two loaves per week, billed every 4 weeks</p>

          <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: '#E8EEF3' }}>
            <p className="text-2xl font-bold mb-2" style={{ color: '#5B7C99' }}>$78/month</p>
            <p className="text-sm text-gray-700">2 loaves per week (8 loaves/month)</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">First Name</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-4 py-2 border rounded-md text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">Last Name</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-4 py-2 border rounded-md text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2 border rounded-md text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">Phone</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-2 border rounded-md text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">Street Address</label>
              <input
                type="text"
                required
                value={formData.streetAddress}
                onChange={(e) => setFormData({...formData, streetAddress: e.target.value})}
                className="w-full px-4 py-2 border rounded-md text-gray-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">City</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full px-4 py-2 border rounded-md text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">Zip Code</label>
                <input
                  type="text"
                  required
                  value={formData.zipCode}
                  onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                  className="w-full px-4 py-2 border rounded-md text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">Preferred Delivery Day</label>
              <select
                value={formData.deliveryDay}
                onChange={(e) => setFormData({...formData, deliveryDay: e.target.value})}
                className="w-full px-4 py-2 border rounded-md text-gray-900"
              >
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
                <option value="saturday">Saturday</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full text-white py-3 rounded-md font-medium hover:opacity-90 disabled:opacity-50 transition"
              style={{ backgroundColor: '#5B7C99' }}
            >
              {loading ? 'Processing...' : 'Continue to Payment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
