import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe/server'
import { createServerClient } from '@/lib/supabase/server'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Webhook error:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createServerClient()

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const customer = await stripe.customers.retrieve(session.customer as string) as Stripe.Customer
      const deliveryAddress = JSON.parse(session.metadata?.delivery_address || '{}')
      const deliveryDay = session.metadata?.delivery_day || 'thursday'

      const { data: newCustomer } = await supabase
        .from('customers')
        .insert({
          email: customer.email!,
          first_name: customer.name?.split(' ')[0] || '',
          last_name: customer.name?.split(' ').slice(1).join(' ') || '',
          stripe_customer_id: customer.id,
        })
        .select()
        .single()

      if (!newCustomer) return NextResponse.json({ received: true })

      const { data: newAddress } = await supabase
        .from('delivery_addresses')
        .insert({
          customer_id: newCustomer.id,
          street_address: deliveryAddress.streetAddress,
          city: deliveryAddress.city,
          zip_code: deliveryAddress.zipCode,
          delivery_zone: deliveryDay,
          is_default: true,
        })
        .select()
        .single()

      if (!newAddress) return NextResponse.json({ received: true })

      const { data: newSubscription } = await supabase
        .from('subscriptions')
        .insert({
          customer_id: newCustomer.id,
          tier: 'bread_only',
          status: 'active',
          price_cents: 7800,
          stripe_subscription_id: session.subscription as string,
          delivery_address_id: newAddress.id,
          delivery_day: deliveryDay,
        })
        .select()
        .single()

      console.log('SUCCESS: Created subscription', newSubscription?.id)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook failed:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
