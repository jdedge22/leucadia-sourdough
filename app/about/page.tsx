import Link from 'next/link'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Oven Background */}
      <section className="relative h-[60vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/images/oven-inside.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-2xl">From Garage to Movement</h1>
          <p className="text-2xl md:text-3xl font-semibold" style={{ color: '#D4A574' }}>Bringing Back Bread</p>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">The Problem We Saw</h2>
            <p className="text-lg mb-4 text-gray-800">Everyone told you bread was bad. Cut carbs. Avoid gluten. White flour is poison.</p>
            <p className="text-2xl font-semibold mt-6" style={{ color: '#D4A574' }}>But We knew the truth: It wasn't bread. It was what happened to the flour.</p>
          </div>
          <div className="relative h-96">
            <img 
              src="/images/shaped-dough-scored.jpeg"
              alt="Scored sourdough ready to bake"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* The Traditional Way */}
      <section className="py-16 px-4 bg-gradient-to-b from-amber-50 to-orange-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-96 order-2 md:order-1">
            <img 
              src="/images/cooling-original.jpeg"
              alt="Fresh loaves cooling"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">The Traditional Way</h2>
            <p className="text-lg mb-6 text-gray-800">We studied ancient bread-making:</p>
            <ul className="space-y-3 mb-8 text-lg text-gray-800">
              <li className="flex items-start">
                <span className="mr-2" style={{ color: '#D4A574' }}>✓</span>
                Whole grains, milled fresh
              </li>
              <li className="flex items-start">
                <span className="mr-2" style={{ color: '#D4A574' }}>✓</span>
                Long fermentation (24+ hours)
              </li>
              <li className="flex items-start">
                <span className="mr-2" style={{ color: '#D4A574' }}>✓</span>
                Wild cultures, not commercial yeast
              </li>
              <li className="flex items-start">
                <span className="mr-2" style={{ color: '#D4A574' }}>✓</span>
                Stone-deck baking
              </li>
            </ul>
            <div className="bg-white p-6 rounded-lg border-l-4" style={{ borderColor: '#D4A574' }}>
              <p className="text-lg font-semibold text-gray-900">This was how humans made bread for millennia. Before industrialization. Before "enriched" flour. Before bread became the enemy.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Investment */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">The Investment</h2>
          <p className="text-lg mb-4 text-gray-800">Most bakers buy flour from distributors. It's easier. It's cheaper. It's already milled and bagged.</p>
          <p className="text-4xl font-bold my-8 text-gray-900">We bought a commercial mill instead.</p>
          <p className="text-lg mb-4 text-gray-800">Because fresh-milled flour—ground within 24 hours of baking—retains 40-50% more vitamins and minerals than store flour.</p>
          <p className="text-2xl font-bold mt-6" style={{ color: '#D4A574' }}>This is science, not marketing.</p>
        </div>
      </section>

      {/* Four Years - Photo Grid */}
      <section className="py-16 px-4 bg-gradient-to-b from-orange-50 to-amber-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Four Years of Mastery</h2>
          <p className="text-lg mb-12 text-center text-gray-800">From Our Shop in Leucadia:</p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="relative h-80">
              <img 
                src="/images/shaped-dough-plain.jpeg"
                alt="Hand-shaped dough"
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
                <p className="font-bold">Hand-Shaped Daily</p>
                <p className="text-sm">Every loaf shaped with care and precision</p>
              </div>
            </div>
            
            <div className="relative h-80">
              <img 
                src="/images/everything-bagel-cooling.jpeg"
                alt="Everything bagel loaves"
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
                <p className="font-bold">Variety & Craft</p>
                <p className="text-sm">From classic sourdough to specialty loaves</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="font-bold mb-2 text-gray-900" style={{ color: '#5B7C99' }}>✓ Perfected wild sourdough cultures</p>
              <p className="text-gray-600">Captured and nurtured local wild yeasts for complex flavor</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="font-bold mb-2 text-gray-900" style={{ color: '#5B7C99' }}>✓ Dialed in 24-hour fermentation</p>
              <p className="text-gray-600">Precise timing for maximum digestibility</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="font-bold mb-2 text-gray-900" style={{ color: '#5B7C99' }}>✓ Built loyal following</p>
              <p className="text-gray-600">100 loaves selling out in 1-2 hours every week</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">The Partnership</h2>
          <p className="text-lg mb-6 text-gray-800">Jim joined as co-founder in 2025, bringing:</p>
          <ul className="space-y-3 mb-8 text-lg text-gray-800 max-w-2xl mx-auto">
            <li className="flex items-start">
              <span className="mr-2" style={{ color: '#D4A574' }}>✓</span>
              Fortune 500 operations experience (GameStop, IBM, Salesforce)
            </li>
            <li className="flex items-start">
              <span className="mr-2" style={{ color: '#D4A574' }}>✓</span>
              Business strategy and growth planning
            </li>
            <li className="flex items-start">
              <span className="mr-2" style={{ color: '#D4A574' }}>✓</span>
              Equipment investment and buildout
            </li>
            <li className="flex items-start">
              <span className="mr-2" style={{ color: '#D4A574' }}>✓</span>
              Shared belief: <strong>Bring back bread</strong>
            </li>
          </ul>
          <p className="text-xl font-semibold text-center mt-8" style={{ color: '#D4A574' }}>
            Together: We combine craft mastery + operational expertise = scaling without compromising quality
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">The Mission</h2>
          <p className="text-lg mb-6 font-semibold">We're not just selling bread. We're confronting the anti-bread movement with nutritional truth.</p>
          <p className="text-lg mb-4">For years, you've been told to avoid bread. And you should—if it's made with degraded flour, fast fermentation, and preservatives.</p>
          <p className="text-lg mb-4"><strong>But real bread? Fresh-milled, properly fermented, made from whole grain?</strong></p>
          <p className="text-3xl font-bold mt-6" style={{ color: '#D4A574' }}>That's one of the most nutritious foods you can eat.</p>
        </div>
      </section>

      {/* The Commitment - with background image */}
      <section 
        className="py-20 px-4 relative"
        style={{
          backgroundImage: 'url(/images/bakery-workspace.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-white/90" />
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white/95 p-8 rounded-xl border-4 shadow-lg" style={{ borderColor: '#D4A574' }}>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">The Commitment</h2>
            <p className="text-xl font-semibold mb-6 text-gray-900">Every loaf we bake:</p>
            <ul className="space-y-3 mb-8 text-lg text-gray-800">
              <li className="flex items-start">
                <span className="mr-2" style={{ color: '#D4A574' }}>✓</span>
                Organic wheat berries milled within 24 hours
              </li>
              <li className="flex items-start">
                <span className="mr-2" style={{ color: '#D4A574' }}>✓</span>
                24-hour wild sourdough fermentation
              </li>
              <li className="flex items-start">
                <span className="mr-2" style={{ color: '#D4A574' }}>✓</span>
                No shortcuts, no preservatives, no compromises
              </li>
              <li className="flex items-start">
                <span className="mr-2" style={{ color: '#D4A574' }}>✓</span>
                Maximum nutrition, superior digestibility, unmistakable flavor
              </li>
            </ul>
            <p className="text-2xl font-bold text-center mt-8 text-gray-900">This is bread as it was meant to be.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gray-900 text-white text-center">
        <h2 className="text-3xl font-bold mb-6">Join the Movement</h2>
        <p className="text-lg mb-4">500+ North County families have rediscovered real bread.</p>
        <p className="text-3xl font-semibold my-6" style={{ color: '#D4A574' }}>Will you?</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            href="/subscribe"
            className="px-8 py-4 rounded-lg font-semibold text-lg transition hover:scale-105"
            style={{ background: '#D4A574', color: '#2C2C2C' }}
          >
            Sign Up for Weekly Delivery
          </Link>
          <Link
            href="/shop"
            className="px-8 py-4 rounded-lg font-semibold text-lg transition hover:scale-105 bg-white text-gray-900"
          >
            Shop Breads
          </Link>
        </div>
      </section>
    </div>
  )
}
