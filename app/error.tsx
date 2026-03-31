'use client'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-600 mb-8">
          We hit an unexpected error. Please try again or contact us if the problem persists.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-md"
            style={{ backgroundColor: '#5B7C99' }}
          >
            Try Again
          </button>
          <a
            href="mailto:hello@leucadiasourdough.com"
            className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:border-gray-400 transition"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
}
