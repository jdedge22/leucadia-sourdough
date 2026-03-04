import { NextRequest, NextResponse } from 'next/server'
import { stripe, STRIPE_PRICE_ID_ONE_LOAF, STRIPE_PRICE_ID_TWO_LOAF } from '@/lib/stripe/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { email, deliveryDay, deliveryAddress, plan, breadSelections } = await req.json()

    if (!email || !deliveryDay || !deliveryAddress || !plan || !breadSelections?.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const priceId = plan === 'one-loaf' ? STRIPE_PRICE_ID_ONE_LOAF : STRIPE_PRICE_ID_TWO_LOAF

    const supabase = await createServerClient()

    let customer = await supabase
      .from('customers')
      .select('stripe_customer_id')
      .eq('email', email)
      .single()

    let stripeCustomerId: string

    if (customer.data?.stripe_customer_id) {
      stripeCustomerId = customer.data.stripe_customer_id
      await stripe.customers.update(stripeCustomerId, {
        metadata: {
          delivery_day: deliveryDay,
          bread_selections: JSON.stringify(breadSelections),
        },
      })
    } else {
      const stripeCustomer = await stripe.customers.create({
        email,
        metadata: {
          delivery_day: deliveryDay,
          bread_selections: JSON.stringify(breadSelections),
        },
      })
      stripeCustomerId = stripeCustomer.id
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe`,
      metadata: {
        delivery_day: deliveryDay,
        delivery_address: JSON.stringify(deliveryAddress),
        plan,
        bread_selections: JSON.stringify(breadSelections),
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
