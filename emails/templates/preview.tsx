import * as React from 'react';
import { SubscriptionWelcome } from './SubscriptionWelcome';

export default function Preview() {
  return (
    <SubscriptionWelcome
      customerName="Jim"
      deliveryDay="Thursday"
      deliveryDate="February 27, 2026"
      portalUrl="https://billing.stripe.com/p/login/test_123"
    />
  );
}
