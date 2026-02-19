export default function SubscribeSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white shadow-md rounded-lg p-8">
          <div className="mb-6">
            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Welcome to Leucadia Sourdough!</h1>
          <p className="text-lg text-gray-600 mb-6">Your subscription is confirmed.</p>
          <a href="/" className="block w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700">Return to Home</a>
        </div>
      </div>
    </div>
  )
}
