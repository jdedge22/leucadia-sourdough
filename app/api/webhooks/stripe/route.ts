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
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Get customer details
        const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
        
        if (!customer.email) break;
        
        // Split name into first and last
        const nameParts = customer.name?.split(' ') || ['', ''];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // Upsert customer in Supabase
        const { error: customerError } = await supabase
          .from('customers')
          .upsert({
            stripe_customer_id: customer.id,
            email: customer.email,
            first_name: firstName,
            last_name: lastName,
            phone: customer.phone || null,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'stripe_customer_id',
          });

        if (customerError) {
          console.error('Error upserting customer:', customerError);
        }

        // Send welcome email (once DNS works)
        const portalSession = await stripe.billingPortal.sessions.create({
          customer: customer.id,
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/portal`,
        });

        await sendSubscriptionWelcome({
          to: customer.email,
          customerName: firstName,
          deliveryDay: 'Thursday',
          deliveryDate: 'TBD',
          portalUrl: portalSession.url,
        });

        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Get customer details
        const customer = await stripe.customers.retrieve(session.customer as string) as Stripe.Customer;
        const customerEmail = customer.email || session.customer_details?.email;
        const customerName = customer.name || session.customer_details?.name;
        
        // Split name into first and last
        const nameParts = customerName?.split(' ') || ['', ''];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // Get delivery details from metadata
        const deliveryDay = session.metadata?.delivery_day || 'Thursday';
        const deliveryDate = session.metadata?.delivery_date || '';
        const deliveryAddress = session.metadata?.delivery_address || 
          `${session.customer_details?.address?.line1}, ${session.customer_details?.address?.city}, ${session.customer_details?.address?.state} ${session.customer_details?.address?.postal_code}`;

        // Upsert customer in Supabase
        const { error: customerError } = await supabase
          .from('customers')
          .upsert({
            stripe_customer_id: session.customer as string,
            email: customerEmail!,
            first_name: firstName,
            last_name: lastName,
            phone: session.customer_details?.phone || null,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'stripe_customer_id',
          });

        if (customerError) {
          console.error('Error upserting customer:', customerError);
        }

        // Send appropriate email
        if (session.mode === 'subscription') {
          const portalSession = await stripe.billingPortal.sessions.create({
            customer: session.customer as string,
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/portal`,
          });

          if (customerEmail) {
            await sendSubscriptionWelcome({
              to: customerEmail,
              customerName: firstName,
              deliveryDay,
              deliveryDate,
              portalUrl: portalSession.url,
            });
          }
        } else {
          // One-time purchase
          if (customerEmail) {
            await sendOrderConfirmation({
              to: customerEmail,
              customerName: firstName,
              deliveryDay,
              deliveryDate,
              deliveryAddress,
              orderNumber: `LS-${new Date().getFullYear()}-${session.id.slice(-6).toUpperCase()}`,
            });
          }
        }
        break;
      }

      case 'customer.updated': {
        const customer = event.data.object as Stripe.Customer;
        
        if (customer.email) {
          const nameParts = customer.name?.split(' ') || ['', ''];
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';

          const { error } = await supabase
            .from('customers')
            .update({
              email: customer.email,
              first_name: firstName,
              last_name: lastName,
              phone: customer.phone || null,
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_customer_id', customer.id);

          if (error) {
            console.error('Error updating customer:', error);
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
          const nameParts = customer.name?.split(' ') || ['', ''];
          await sendPaymentFailed({
            to: customer.email,
            customerName: nameParts[0],
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
            const nameParts = customer.name?.split(' ') || ['', ''];
            await sendSubscriptionPaused({
              to: customer.email,
              customerName: nameParts[0],
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
          const nameParts = customer.name?.split(' ') || ['', ''];
          await sendSubscriptionCancelled({
            to: customer.email,
            customerName: nameParts[0],
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
