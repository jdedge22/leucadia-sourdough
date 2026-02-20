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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Customer Portal</h1>
              <p className="text-gray-600 mt-2">Welcome back, {user?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Subscription Status</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">Status</span>
              <span className="font-semibold text-green-600">Active</span>
            </div>
            
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">Plan</span>
              <span className="font-semibold">Bread Only - Weekly</span>
            </div>
            
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">Delivery Day</span>
              <span className="font-semibold">Thursday</span>
            </div>
            
            <div className="flex justify-between py-3">
              <span className="text-gray-600">Next Delivery</span>
              <span className="font-semibold">February 27, 2026</span>
            </div>
          </div>

          <button
            style={{ backgroundColor: '#5B7C99' }}
            className="w-full mt-6 text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90"
          >
            Manage Subscription & Payment
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h3 className="font-bold text-gray-900 mb-2">Skip Next Week</h3>
            <p className="text-sm text-gray-600 mb-4">Pause your next delivery</p>
            <button className="text-blue-600 hover:text-blue-800 font-semibold">
              Skip Delivery
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h3 className="font-bold text-gray-900 mb-2">Update Address</h3>
            <p className="text-sm text-gray-600 mb-4">Change delivery location</p>
            <button className="text-blue-600 hover:text-blue-800 font-semibold">
              Edit Address
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h3 className="font-bold text-gray-900 mb-2">Contact Us</h3>
            <p className="text-sm text-gray-600 mb-4">Questions or concerns?</p>
            <a href="mailto:hello@send.leucadiasourdough.com" className="text-blue-600 hover:text-blue-800 font-semibold">
              Send Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
