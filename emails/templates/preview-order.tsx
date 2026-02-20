import * as React from 'react';
import { OrderConfirmation } from './OrderConfirmation';

export default function PreviewOrder() {
  return (
    <OrderConfirmation
      customerName="Jim"
      deliveryDay="Thursday"
      deliveryDate="February 27, 2026"
      deliveryAddress="123 Ocean Ave, Encinitas, CA 92024"
      orderNumber="LS-2026-001"
    />
  );
}
