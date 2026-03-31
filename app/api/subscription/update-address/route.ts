import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
})

export async function POST(req: Request) {
  try {
    const supabase = await createServerClient()
    const supabaseAdmin = createServiceRoleClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { address } = await req.json()

    if (!address || typeof address !== 'object') {
      return NextResponse.json({ error: 'Invalid address' }, { status: 400 })
    }

    const { line1, line2, city, state, zip } = address
    if (!line1 || !city || !state || !zip) {
      return NextResponse.json({ error: 'Address, city, state, and zip are required' }, { status: 400 })
    }

    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('stripe_customer_id')
      .eq('email', user.email)
      .single()

    if (!customer?.stripe_customer_id) {
      return NextResponse.json({ error: 'No customer found' }, { status: 404 })
    }

    // Update address on the Stripe customer
    await stripe.customers.update(customer.stripe_customer_id, {
      address: {
        line1,
        line2: line2 || '',
        city,
        state,
        postal_code: zip,
        country: 'US',
      },
      metadata: {
        delivery_address: `${line1}${line2 ? ', ' + line2 : ''}, ${city}, ${state} ${zip}`,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Update address error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
