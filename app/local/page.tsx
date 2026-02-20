'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LocalLandingContent() {
  const searchParams = useSearchParams()
  const area = searchParams.get('area') || 'Your Area'

  return (
    <div>
      {/* Hero - Targeted Message */}
      <section className="relative h-96 flex items-center justify-center">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/images/two-loaves-artisan-craft.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <p className="text-amber-400 text-xl md:text-2xl font-semibold mb-4 drop-shadow-lg">
            {area}
          </p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-2xl">
            Your New Local Sourdough
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 drop-shadow-lg">
            Fresh-milled organic sourdough delivered to your door
          </p>
          <Link
            href="/subscribe"
            className="inline-block hover:opacity-90 text-white px-10 py-4 rounded-lg text-xl font-bold transition shadow-xl"
            style={{ backgroundColor: '#5B7C99' }}
          >
            Start Weekly Delivery
          </Link>
        </div>
      </section>

      {/* Social Proof / Story */}
      <section className="py-16 bg-gradient-to-b from-white to-amber-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            We Know You Miss Good Bread
          </h2>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            When your local bakery closed, you lost more than just bread—you lost that weekly ritual, 
            that perfect crust, that knowing-exactly-when-it's-fresh feeling.
          </p>
          <p className="text-xl text-gray-700 mb-12 leading-relaxed">
            We're not trying to replace what you had. But we think you'll love what we're doing: 
            <span className="font-bold text-gray-900"> organic flour milled within 24 hours</span>, 
            <span className="font-bold text-gray-900"> 24-hour sourdough fermentation</span>, and 
            <span className="font-bold text-gray-900"> delivery right to your door</span>.
          </p>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Why Your Neighbors Love Us
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-b from-amber-50 to-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-56 overflow-hidden">
                <img
                  src="/images/bread-sliced-butter-lifestyle.jpg"
                  alt="Fresh milled"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Fresh-Milled = More Nutrition</h3>
                <p className="text-gray-700 text-lg">
                  40-50% more nutrients than store-bought. We mill organic wheat within 24 hours of baking 
                  to preserve what most bread loses.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-b from-amber-50 to-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-56 overflow-hidden">
                <img
                  src="/images/avocado-toast-lifestyle.jpg"
                  alt="California lifestyle"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Made for Your Lifestyle</h3>
                <p className="text-gray-700 text-lg">
                  Perfect for avocado toast mornings, beach day sandwiches, or just butter and salt after a surf. 
                  This is California bread.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-b from-amber-50 to-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-56 overflow-hidden">
                <img
                  src="/images/two-loaves-artisan-craft.jpg"
                  alt="Artisan craft"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Small Batch, Big Flavor</h3>
                <p className="text-gray-700 text-lg">
                  Every loaf is shaped by hand, naturally fermented for 24 hours, and baked fresh. 
                  No preservatives, no shortcuts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-white to-orange-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            Here's How It Works
          </h2>
          <p className="text-center text-gray-600 mb-16 text-lg">
            Simple, flexible, no commitment
          </p>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto mb-6 shadow-xl" style={{ backgroundColor: '#5B7C99' }}>
                1
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Choose Your Plan</h3>
              <p className="text-gray-700 text-lg">
                2 loaves per week delivered fresh. Pick Thursday, Friday, or Saturday delivery.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto mb-6 shadow-xl" style={{ backgroundColor: '#5B7C99' }}>
                2
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">We Bake Fresh</h3>
              <p className="text-gray-700 text-lg">
                Your loaves are baked the night before delivery. You get them within 12 hours of leaving the oven.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto mb-6 shadow-xl" style={{ backgroundColor: '#5B7C99' }}>
                3
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Delivered to Your Door</h3>
              <p className="text-gray-700 text-lg">
                Free delivery to North County San Diego. Cancel or pause anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-20 bg-gradient-to-b from-orange-50 to-amber-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            $75/Month. Cancel Anytime.
          </h2>
          <p className="text-xl md:text-2xl mb-4 text-gray-700">
            8 fresh loaves delivered monthly
          </p>
          <p className="text-lg mb-10 text-gray-600">
            That's $9.38 per loaf—delivered to your door
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/subscribe"
              className="inline-block hover:opacity-90 text-white px-12 py-5 rounded-lg text-xl font-bold transition shadow-xl"
              style={{ backgroundColor: '#5B7C99' }}
            >
              Start Your Subscription
            </Link>
            <Link
              href="/shop"
              className="inline-block text-gray-700 hover:text-gray-900 px-12 py-5 rounded-lg text-xl font-semibold transition border-2 border-gray-300 hover:border-gray-400 bg-white"
            >
              Try One Loaf First
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-8">
            Free delivery • Cancel anytime • No long-term commitment
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Questions?
          </h2>
          
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-bold mb-2 text-gray-900">Do you deliver to {area}?</h3>
              <p className="text-gray-700">
                Yes! We deliver free to {area} and surrounding North County San Diego areas.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-bold mb-2 text-gray-900">Can I try it before subscribing?</h3>
              <p className="text-gray-700">
                Absolutely. You can buy individual loaves from our <Link href="/shop" className="underline font-semibold" style={{ color: '#5B7C99' }}>shop page</Link> before committing to a subscription.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-bold mb-2 text-gray-900">What if I need to skip a week?</h3>
              <p className="text-gray-700">
                No problem. Pause, skip, or cancel anytime from your customer portal. We're flexible because life is unpredictable.
              </p>
            </div>

            <div className="pb-6">
              <h3 className="text-xl font-bold mb-2 text-gray-900">What makes your bread different?</h3>
              <p className="text-gray-700">
                We mill organic wheat within 24 hours of baking (40-50% more nutrients), ferment naturally for 24 hours (better digestion), 
                and deliver fresh. Most bakeries use pre-milled flour that's weeks or months old—you lose nutrition every day after milling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20" style={{ backgroundColor: '#5B7C99' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Have Fresh Bread Again?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-white/90">
            Join your neighbors who never run out
          </p>
          <Link
            href="/subscribe"
            className="inline-block bg-white hover:bg-gray-100 px-12 py-5 rounded-lg text-xl font-bold transition shadow-xl"
            style={{ color: '#5B7C99' }}
          >
            Start Your Subscription →
          </Link>
        </div>
      </section>
    </div>
  )
}

export default function LocalLandingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LocalLandingContent />
    </Suspense>
  )
}
