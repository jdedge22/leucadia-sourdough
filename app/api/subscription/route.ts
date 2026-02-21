import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
});

export async function GET() {
  try {
    const supabase = createServerClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get customer from Supabase
    const { data: customer } = await supabase
      .from('customers')
      .select('stripe_customer_id, first_name, last_name')
      .eq('email', user.email)
      .single();

    if (!customer?.stripe_customer_id) {
      return NextResponse.json({ 
        hasSubscription: false,
        customer: null,
        subscription: null 
      });
    }

    // Get subscriptions from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.stripe_customer_id,
      status: 'all',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ 
        hasSubscription: false,
        customer,
        subscription: null 
      });
    }

    const subscription = subscriptions.data[0];
    
    // Get product details
    const priceId = subscription.items.data[0].price.id;
    const price = await stripe.prices.retrieve(priceId, {
      expand: ['product'],
    });
    
    const product = price.product as Stripe.Product;

    // Calculate next delivery date (assuming weekly Thursday delivery)
    const nextBillingDate = new Date(subscription.current_period_end * 1000);
    const deliveryDay = 'Thursday'; // TODO: Get from customer preferences
    
    return NextResponse.json({
      hasSubscription: true,
      customer,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        currentPeriodEnd: subscription.current_period_end,
        nextBillingDate: nextBillingDate.toISOString(),
        plan: {
          name: product.name,
          amount: price.unit_amount ? price.unit_amount / 100 : 0,
          interval: price.recurring?.interval || 'month',
        },
        deliveryDay,
        isPaused: subscription.pause_collection !== null,
      },
    });
  } catch (error: any) {
    console.error('Subscription fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
