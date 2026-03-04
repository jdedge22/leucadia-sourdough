import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerClient } from '@/lib/supabase/server'
import {
  STRIPE_PRICE_ID_ONE_LOAF,
  STRIPE_PRICE_ID_TWO_LOAF,
  STRIPE_PRICE_ID_RESTAURANT,
  STRIPE_PRICE_ID_GROCERY,
} from '@/lib/stripe/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
})

const VALID_VARIETIES = ['original', 'everything', 'jalapeno']

export async function POST(req: Request) {
  try {
    const supabase = await createServerClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { selections } = await req.json()

    if (!selections || typeof selections !== 'object') {
      return NextResponse.json({ error: 'Invalid selections' }, { status: 400 })
    }

    // Validate variety names
    for (const variety of Object.keys(selections)) {
      if (!VALID_VARIETIES.includes(variety)) {
        return NextResponse.json({ error: `Invalid variety: ${variety}` }, { status: 400 })
      }
      if (typeof selections[variety] !== 'number' || selections[variety] < 0) {
        return NextResponse.json({ error: `Invalid quantity for ${variety}` }, { status: 400 })
      }
    }

    const total = Object.values(selections).reduce((sum: number, n) => sum + (n as number), 0)

    // Get customer
    const { data: customer } = await supabase
      .from('customers')
      .select('stripe_customer_id')
      .eq('email', user.email)
      .single()

    if (!customer?.stripe_customer_id) {
      return NextResponse.json({ error: 'No customer found' }, { status: 404 })
    }

    // Get active subscription to verify loaf count
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.stripe_customer_id,
      status: 'active',
      limit: 1,
    })

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ error: 'No active subscription' }, { status: 404 })
    }

    const sub = subscriptions.data[0] as any
    const priceId = sub.items.data[0].price.id
    const quantity = sub.items.data[0].quantity || 1
    const isWholesale = priceId === STRIPE_PRICE_ID_RESTAURANT || priceId === STRIPE_PRICE_ID_GROCERY

    let expectedLoafCount: number
    if (priceId === STRIPE_PRICE_ID_ONE_LOAF) {
      expectedLoafCount = 1
    } else if (priceId === STRIPE_PRICE_ID_TWO_LOAF) {
      expectedLoafCount = 2
    } else if (isWholesale) {
      // Package pricing: read loaf_count from customer metadata
      const stripeCustomer = await stripe.customers.retrieve(customer.stripe_customer_id) as any
      expectedLoafCount = parseInt(stripeCustomer.metadata?.loaf_count || '0', 10) || quantity
    } else {
      expectedLoafCount = quantity
    }

    if (total !== expectedLoafCount) {
      return NextResponse.json(
        { error: `Total must equal ${expectedLoafCount} loaves. Got ${total}.` },
        { status: 400 }
      )
    }

    // Update Supabase
    const { error: updateError } = await supabase
      .from('customers')
      .update({ bread_selections: selections })
      .eq('stripe_customer_id', customer.stripe_customer_id)

    if (updateError) {
      throw updateError
    }

    // Also update Stripe customer metadata for redundancy
    await stripe.customers.update(customer.stripe_customer_id, {
      metadata: { bread_selections: JSON.stringify(selections) },
    })

    return NextResponse.json({ success: true, selections })
  } catch (error: any) {
    console.error('Update selections error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
