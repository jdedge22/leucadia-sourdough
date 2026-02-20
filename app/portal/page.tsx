'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function PortalPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/login');
      return;
    }

    setUser(user);
    setLoading(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image - Full Width */}
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
          <p className="text-white text-xl drop-shadow-lg">Welcome back, {user?.email}</p>
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 mb-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Subscription Status</h2>
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
              <span className="font-bold text-green-600 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                Active
              </span>
            </div>
            
            <div className="flex justify-between py-4 border-b-2 border-gray-100">
              <span className="text-gray-600 font-medium">Plan</span>
              <span className="font-semibold text-gray-900">Bread Only - Weekly</span>
            </div>
            
            <div className="flex justify-between py-4 border-b-2 border-gray-100">
              <span className="text-gray-600 font-medium">Delivery Day</span>
              <span className="font-semibold text-gray-900">Thursday</span>
            </div>
            
            <div className="flex justify-between py-4">
              <span className="text-gray-600 font-medium">Next Delivery</span>
              <span className="font-semibold text-gray-900">February 27, 2026</span>
            </div>
          </div>

          <button
            style={{ backgroundColor: '#5B7C99' }}
            className="w-full mt-8 text-white py-4 px-6 rounded-xl font-semibold hover:opacity-90 shadow-lg hover:shadow-xl transition-all"
          >
            Manage Subscription & Payment
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center hover:shadow-2xl transition-shadow">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⏸️</span>
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Skip Next Week</h3>
            <p className="text-sm text-gray-600 mb-6">Pause your next delivery</p>
            <button className="text-blue-600 hover:text-blue-800 font-semibold border-b-2 border-transparent hover:border-blue-600 transition-colors">
              Skip Delivery
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
      </div>
    </div>
  );
}
