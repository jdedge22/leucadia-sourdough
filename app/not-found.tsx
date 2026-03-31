import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          Looks like this page got lost on the way to the oven. Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-md"
            style={{ backgroundColor: '#5B7C99' }}
          >
            Go Home
          </Link>
          <Link
            href="/subscribe"
            className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:border-gray-400 transition"
          >
            Subscribe
          </Link>
        </div>
      </div>
    </div>
  )
}
