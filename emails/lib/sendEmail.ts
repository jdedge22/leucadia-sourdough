import { resend } from './resend';
import { OrderConfirmation } from '../templates/OrderConfirmation';
import { SubscriptionWelcome } from '../templates/SubscriptionWelcome';
import { PaymentFailed } from '../templates/PaymentFailed';
import { SubscriptionPaused } from '../templates/SubscriptionPaused';
import { SubscriptionCancelled } from '../templates/SubscriptionCancelled';

const FROM_EMAIL = 'Leucadia Sourdough Team <hello@send.leucadiasourdough.com>';

export async function sendOrderConfirmation({
  to,
  customerName,
  deliveryDay,
  deliveryDate,
  deliveryAddress,
  orderNumber,
}: {
  to: string;
  customerName?: string;
  deliveryDay: string;
  deliveryDate: string;
  deliveryAddress: string;
  orderNumber: string;
}) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Your Leucadia Sourdough Order is Confirmed!',
    react: OrderConfirmation({
      customerName,
      deliveryDay,
      deliveryDate,
      deliveryAddress,
      orderNumber,
    }),
  });
}

export async function sendSubscriptionWelcome({
  to,
  customerName,
  deliveryDay,
  deliveryDate,
  portalUrl,
}: {
  to: string;
  customerName?: string;
  deliveryDay: string;
  deliveryDate: string;
  portalUrl: string;
}) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Welcome to Leucadia Sourdough! 🍞',
    react: SubscriptionWelcome({
      customerName,
      deliveryDay,
      deliveryDate,
      portalUrl,
    }),
  });
}

export async function sendPaymentFailed({
  to,
  customerName,
  portalUrl,
}: {
  to: string;
  customerName?: string;
  portalUrl: string;
}) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Payment Issue with Your Leucadia Subscription',
    react: PaymentFailed({
      customerName,
      portalUrl,
    }),
  });
}

export async function sendSubscriptionPaused({
  to,
  customerName,
  portalUrl,
}: {
  to: string;
  customerName?: string;
  portalUrl: string;
}) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Your Leucadia Subscription is Paused',
    react: SubscriptionPaused({
      customerName,
      portalUrl,
    }),
  });
}

export async function sendSubscriptionCancelled({
  to,
  customerName,
  portalUrl,
}: {
  to: string;
  customerName?: string;
  portalUrl: string;
}) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Sorry to See You Go',
    react: SubscriptionCancelled({
      customerName,
      portalUrl,
    }),
  });
}
