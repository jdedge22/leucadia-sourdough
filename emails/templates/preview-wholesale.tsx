import * as React from 'react';
import { WholesaleWelcome } from './WholesaleWelcome';

export default function PreviewWholesale() {
  return (
    <WholesaleWelcome
      customerName="Jim"
      businessName="Board & Brew"
      partnerType="restaurant"
      loafCount={20}
      perLoafRate="$5.00"
      deliveryDay="Thursday"
      portalUrl="https://billing.stripe.com/p/login/test_123"
    />
  );
}
