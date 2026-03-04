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

function getCustomerType(priceId: string) {
  if (priceId === STRIPE_PRICE_ID_ONE_LOAF) return 'retail-1'
  if (priceId === STRIPE_PRICE_ID_TWO_LOAF) return 'retail-2'
  if (priceId === STRIPE_PRICE_ID_RESTAURANT) return 'restaurant'
  if (priceId === STRIPE_PRICE_ID_GROCERY) return 'grocery'
  return 'retail-1'
}

function getLoafCount(priceId: string, quantity: number) {
  if (priceId === STRIPE_PRICE_ID_ONE_LOAF) return 1
  if (priceId === STRIPE_PRICE_ID_TWO_LOAF) return 2
  // Wholesale: quantity is the loaf count
  return quantity
}

function getNextDeliveryDate(deliveryDay: string): string {
  const dayMap: Record<string, number> = {
    sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
    thursday: 4, friday: 5, saturday: 6,
  }
  const target = dayMap[deliveryDay.toLowerCase()] ?? 4
  const now = new Date()
  const current = now.getDay()
  let daysUntil = (target - current + 7) % 7
  if (daysUntil === 0) daysUntil = 7
  const next = new Date(now)
  next.setDate(now.getDate() + daysUntil)
  return next.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export async function GET() {
  try {
    const supabase = createServerClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data: customer } = await supabase
      .from('customers')
      .select('stripe_customer_id, first_name, last_name, bread_selections')
      .eq('email', user.email)
      .single()

    if (!customer?.stripe_customer_id) {
      return NextResponse.json({
        hasSubscription: false,
        customer: null,
        subscription: null,
      })
    }

    // Fetch Stripe customer to get metadata (delivery_day)
    const stripeCustomer = await stripe.customers.retrieve(customer.stripe_customer_id) as Stripe.Customer

    const subscriptions = await stripe.subscriptions.list({
      customer: customer.stripe_customer_id,
      status: 'all',
      limit: 1,
    })

    if (subscriptions.data.length === 0) {
      return NextResponse.json({
        hasSubscription: false,
        customer: {
          firstName: customer.first_name,
          lastName: customer.last_name,
        },
        subscription: null,
      })
    }

    const sub = subscriptions.data[0] as any
    const priceId = sub.items.data[0].price.id
    const quantity = sub.items.data[0].quantity || 1

    const price = await stripe.prices.retrieve(priceId, {
      expand: ['product'],
    })
    const product = price.product as Stripe.Product

    const customerType = getCustomerType(priceId)
    const isWholesale = customerType === 'restaurant' || customerType === 'grocery'
    const loafCount = getLoafCount(priceId, quantity)

    const deliveryDay = stripeCustomer.metadata?.delivery_day || 'Thursday'
    const nextDelivery = getNextDeliveryDate(deliveryDay)

    // Resolve bread selections from Supabase
    let breadSelections = customer.bread_selections
    if (!breadSelections) {
      // Default all loaves to original
      breadSelections = { original: loafCount }
    }

    return NextResponse.json({
      hasSubscription: true,
      customer: {
        firstName: customer.first_name,
        lastName: customer.last_name,
      },
      subscription: {
        id: sub.id,
        status: sub.status,
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        currentPeriodEnd: sub.current_period_end,
        nextBillingDate: new Date(sub.current_period_end * 1000).toISOString(),
        customerType,
        isWholesale,
        loafCount,
        breadSelections,
        plan: {
          name: product.name,
          amount: price.unit_amount ? price.unit_amount / 100 : 0,
          interval: price.recurring?.interval || 'month',
        },
        deliveryDay,
        nextDelivery,
        isPaused: sub.pause_collection !== null,
      },
    })
  } catch (error: any) {
    console.error('Subscription fetch error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
