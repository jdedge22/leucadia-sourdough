import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
})

export async function POST() {
  try {
    const supabase = await createServerClient()
    const supabaseAdmin = createServiceRoleClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('stripe_customer_id')
      .eq('email', user.email)
      .single()

    if (!customer?.stripe_customer_id) {
      return NextResponse.json({ error: 'No customer found' }, { status: 404 })
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customer.stripe_customer_id,
      status: 'active',
      limit: 1,
    })

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ error: 'No active subscription' }, { status: 404 })
    }

    const sub = subscriptions.data[0]

    if (!sub.pause_collection) {
      return NextResponse.json({ error: 'Subscription is not paused' }, { status: 400 })
    }

    await stripe.subscriptions.update(sub.id, {
      pause_collection: null as any,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Resume subscription error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
