import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerClient } from '@/lib/supabase/server';
import {
  sendOrderConfirmation,
  sendSubscriptionWelcome,
  sendPaymentFailed,
  sendSubscriptionPaused,
  sendSubscriptionCancelled,
} from '@/emails/lib/sendEmail';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  const supabase = createServerClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        const customer = await stripe.customers.retrieve(session.customer as string) as Stripe.Customer;
        const customerEmail = customer.email || session.customer_details?.email;
        const customerName = customer.name || session.customer_details?.name?.split(' ')[0];

        const deliveryDay = session.metadata?.delivery_day || 'Thursday';
        const deliveryDate = session.metadata?.delivery_date || '';
        const deliveryAddress = session.metadata?.delivery_address || 
          `${session.customer_details?.address?.line1}, ${session.customer_details?.address?.city}, ${session.customer_details?.address?.state} ${session.customer_details?.address?.postal_code}`;

        await supabase.from('customers').upsert({
          stripe_customer_id: session.customer as string,
          email: customerEmail,
          name: customer.name,
          delivery_day: deliveryDay,
          delivery_address: deliveryAddress,
        });

        if (session.mode === 'subscription') {
          const portalSession = await stripe.billingPortal.sessions.create({
            customer: session.customer as string,
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/portal`,
          });

          if (customerEmail) {
            await sendSubscriptionWelcome({
              to: customerEmail,
              customerName,
              deliveryDay,
              deliveryDate,
              portalUrl: portalSession.url,
            });
          }
        } else {
          if (customerEmail) {
            await sendOrderConfirmation({
              to: customerEmail,
              customerName,
              deliveryDay,
              deliveryDate,
              deliveryAddress,
              orderNumber: `LS-${new Date().getFullYear()}-${session.id.slice(-6).toUpperCase()}`,
            });
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customer = await stripe.customers.retrieve(invoice.customer as string) as Stripe.Customer;
        
        const portalSession = await stripe.billingPortal.sessions.create({
          customer: invoice.customer as string,
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/portal`,
        });

        if (customer.email) {
          await sendPaymentFailed({
            to: customer.email,
            customerName: customer.name?.split(' ')[0],
            portalUrl: portalSession.url,
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        if (subscription.pause_collection) {
          const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
          
          const portalSession = await stripe.billingPortal.sessions.create({
            customer: subscription.customer as string,
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/portal`,
          });

          if (customer.email) {
            await sendSubscriptionPaused({
              to: customer.email,
              customerName: customer.name?.split(' ')[0],
              portalUrl: portalSession.url,
            });
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
        
        const portalSession = await stripe.billingPortal.sessions.create({
          customer: subscription.customer as string,
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscribe`,
        });

        if (customer.email) {
          await sendSubscriptionCancelled({
            to: customer.email,
            customerName: customer.name?.split(' ')[0],
            portalUrl: portalSession.url,
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
