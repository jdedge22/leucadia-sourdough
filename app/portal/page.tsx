'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

type SubscriptionData = {
  hasSubscription: boolean
  customer: { firstName: string; lastName: string } | null
  subscription: {
    id: string
    status: string
    cancelAtPeriodEnd: boolean
    customerType: string
    isWholesale: boolean
    loafCount: number
    breadSelections: Record<string, number>
    plan: { name: string; amount: number; interval: string }
    deliveryDay: string
    nextDelivery: string
    isPaused: boolean
  } | null
}

const VARIETIES = ['original', 'everything', 'jalapeno'] as const

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default function PortalPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<SubscriptionData | null>(null)
  const [editingVarieties, setEditingVarieties] = useState(false)
  const [varietyDraft, setVarietyDraft] = useState<Record<string, number>>({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    setUser(user)
    await fetchSubscription()
    setLoading(false)
  }

  async function fetchSubscription() {
    const res = await fetch('/api/subscription')
    if (res.ok) {
      setData(await res.json())
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  async function handleManageSubscription() {
    const res = await fetch('/api/create-portal-session', { method: 'POST' })
    if (res.ok) {
      const { url } = await res.json()
      window.location.href = url
    }
  }

  function startEditingVarieties() {
    const current = data?.subscription?.breadSelections || {}
    const draft: Record<string, number> = {}
    for (const v of VARIETIES) {
      draft[v] = current[v] || 0
    }
    setVarietyDraft(draft)
    setSaveError('')
    setEditingVarieties(true)
  }

  async function saveVarieties() {
    const total = Object.values(varietyDraft).reduce((sum, n) => sum + n, 0)
    const expected = data?.subscription?.loafCount || 0
    if (total !== expected) {
      setSaveError(`Total must equal ${expected} loaves. Currently ${total}.`)
      return
    }

    setSaving(true)
    setSaveError('')

    const res = await fetch('/api/subscription/update-selections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selections: varietyDraft }),
    })

    if (res.ok) {
      await fetchSubscription()
      setEditingVarieties(false)
    } else {
      const err = await res.json()
      setSaveError(err.error || 'Failed to save')
    }

    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  const sub = data?.subscription
  const isWholesale = sub?.isWholesale || false
  const customerName = data?.customer?.firstName
    ? `${data.customer.firstName}`
    : user?.email

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="w-full h-96 relative mb-12">
        <img
          src="/images/avocado-toast-lifestyle.jpg"
          alt="Fresh Sourdough"
          className="w-full h-96 object-cover object-center"
          style={{ objectPosition: 'center 35%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30"></div>
        <div className="absolute bottom-12 left-0 right-0 text-center">
          <h1 className="text-5xl font-bold text-white drop-shadow-2xl mb-3">Customer Portal</h1>
          <p className="text-white text-xl drop-shadow-lg">Welcome back, {customerName}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-12">
        {!data?.hasSubscription ? (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Active Subscription</h2>
            <p className="text-gray-600 mb-6">You don&apos;t have an active subscription yet.</p>
            <a
              href="/#subscribe"
              className="inline-block text-white py-3 px-8 rounded-xl font-semibold hover:opacity-90 transition-all"
              style={{ backgroundColor: '#5B7C99' }}
            >
              Subscribe Now
            </a>
          </div>
        ) : (
          <>
            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 mb-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-gray-900">Subscription Status</h2>
                  {isWholesale && (
                    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-amber-100 text-amber-800">
                      {sub?.customerType === 'restaurant' ? 'Restaurant Partner' : 'Grocery Partner'}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                >
                  Sign Out
                </button>
              </div>

              <div className="space-y-5">
                <div className="flex justify-between py-4 border-b-2 border-gray-100">
                  <span className="text-gray-600 font-medium">Status</span>
                  <span className={`font-bold flex items-center gap-2 ${
                    sub?.isPaused ? 'text-yellow-600' : sub?.status === 'active' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      sub?.isPaused ? 'bg-yellow-600' : sub?.status === 'active' ? 'bg-green-600' : 'bg-red-600'
                    }`}></span>
                    {sub?.isPaused ? 'Paused' : capitalize(sub?.status || '')}
                  </span>
                </div>

                <div className="flex justify-between py-4 border-b-2 border-gray-100">
                  <span className="text-gray-600 font-medium">
                    {isWholesale ? 'Order' : 'Plan'}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {isWholesale
                      ? `${sub?.loafCount} loaves/delivery`
                      : sub?.plan.name}
                  </span>
                </div>

                {isWholesale && (
                  <div className="flex justify-between py-4 border-b-2 border-gray-100">
                    <span className="text-gray-600 font-medium">Per-Loaf Rate</span>
                    <span className="font-semibold text-gray-900">
                      ${sub?.plan.amount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between py-4 border-b-2 border-gray-100">
                  <span className="text-gray-600 font-medium">Delivery Day</span>
                  <span className="font-semibold text-gray-900">{capitalize(sub?.deliveryDay || '')}</span>
                </div>

                <div className="flex justify-between py-4">
                  <span className="text-gray-600 font-medium">Next Delivery</span>
                  <span className="font-semibold text-gray-900">{sub?.nextDelivery}</span>
                </div>
              </div>

              {/* Bread Selections */}
              {sub?.breadSelections && (
                <div className="mt-8 pt-6 border-t-2 border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Bread Varieties</h3>
                    {!editingVarieties && (
                      <button
                        onClick={startEditingVarieties}
                        className="text-sm font-semibold hover:opacity-80 transition-colors"
                        style={{ color: '#5B7C99' }}
                      >
                        Update Varieties
                      </button>
                    )}
                  </div>

                  {editingVarieties ? (
                    <div className="space-y-3">
                      {VARIETIES.map((variety) => (
                        <div key={variety} className="flex items-center justify-between">
                          <span className="text-gray-700 font-medium">{capitalize(variety)}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setVarietyDraft((d) => ({
                                ...d,
                                [variety]: Math.max(0, (d[variety] || 0) - 1),
                              }))}
                              className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-semibold">
                              {varietyDraft[variety] || 0}
                            </span>
                            <button
                              onClick={() => setVarietyDraft((d) => ({
                                ...d,
                                [variety]: (d[variety] || 0) + 1,
                              }))}
                              className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                      <p className="text-sm text-gray-500">
                        Total: {Object.values(varietyDraft).reduce((s, n) => s + n, 0)} / {sub.loafCount} loaves
                      </p>
                      {saveError && (
                        <p className="text-sm text-red-600">{saveError}</p>
                      )}
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={saveVarieties}
                          disabled={saving}
                          className="px-6 py-2 text-white rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50"
                          style={{ backgroundColor: '#5B7C99' }}
                        >
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => setEditingVarieties(false)}
                          className="px-6 py-2 text-gray-600 border-2 border-gray-300 rounded-lg font-semibold hover:border-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(sub.breadSelections)
                        .filter(([, count]) => (count as number) > 0)
                        .map(([variety, count]) => (
                          <div key={variety} className="flex justify-between py-2">
                            <span className="text-gray-700">{capitalize(variety)}</span>
                            <span className="font-semibold text-gray-900">
                              {count as number} {(count as number) === 1 ? 'loaf' : 'loaves'}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleManageSubscription}
                style={{ backgroundColor: '#5B7C99' }}
                className="w-full mt-8 text-white py-4 px-6 rounded-xl font-semibold hover:opacity-90 shadow-lg hover:shadow-xl transition-all"
              >
                Manage Subscription & Payment
              </button>
            </div>

            {/* Quick Actions */}
            <div className={`grid gap-6 ${isWholesale ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
              {!isWholesale && (
                <>
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center hover:shadow-2xl transition-shadow">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">⏸️</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">Skip Next Week</h3>
                    <p className="text-sm text-gray-600 mb-6">Pause your next delivery</p>
                    <button
                      disabled={sub?.isPaused}
                      className="text-blue-600 hover:text-blue-800 font-semibold border-b-2 border-transparent hover:border-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sub?.isPaused ? 'Currently Paused' : 'Skip Delivery'}
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center hover:shadow-2xl transition-shadow">
                    <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">📍</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">Update Address</h3>
                    <p className="text-sm text-gray-600 mb-6">Change delivery location</p>
                    <button className="text-purple-600 hover:text-purple-800 font-semibold border-b-2 border-transparent hover:border-purple-600 transition-colors">
                      Edit Address
                    </button>
                  </div>
                </>
              )}

              {isWholesale && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center hover:shadow-2xl transition-shadow">
                  <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🍞</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">Update Varieties</h3>
                  <p className="text-sm text-gray-600 mb-6">Change your bread breakdown</p>
                  <button
                    onClick={startEditingVarieties}
                    className="text-amber-600 hover:text-amber-800 font-semibold border-b-2 border-transparent hover:border-amber-600 transition-colors"
                  >
                    Edit Varieties
                  </button>
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center hover:shadow-2xl transition-shadow">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💬</span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Contact Us</h3>
                <p className="text-sm text-gray-600 mb-6">Questions or concerns?</p>
                <a href="mailto:hello@leucadiasourdough.com" className="text-green-600 hover:text-green-800 font-semibold border-b-2 border-transparent hover:border-green-600 transition-colors">
                  Send Email
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
