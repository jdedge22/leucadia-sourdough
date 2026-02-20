import * as React from 'react';
import { Section, Text, Img } from '@react-email/components';
import { EmailLayout } from '../components/EmailLayout';

interface OrderConfirmationProps {
  customerName?: string;
  deliveryDay: string;
  deliveryDate: string;
  deliveryAddress: string;
  orderNumber: string;
}

export const OrderConfirmation = ({
  customerName = 'there',
  deliveryDay,
  deliveryDate,
  deliveryAddress,
  orderNumber,
}: OrderConfirmationProps) => {
  return (
    <EmailLayout previewText="Your Leucadia Sourdough order is confirmed!">
      {/* Hero Image */}
      <Section style={imageSection}>
        <Img
          src="https://leucadia-sourdough.vercel.app/images/bread-sliced-warm-light.jpg"
          alt="Fresh baked sourdough"
          width="600"
          height="384"
          style={heroImage}
        />
      </Section>

      {/* Main Content */}
      <Section style={content}>
        <Text style={heading}>Order Confirmed! 🍞</Text>
        
        <Text style={paragraph}>
          Hey {customerName}!
        </Text>

        <Text style={paragraph}>
          Thanks for your order. Your fresh-milled sourdough is confirmed and will be delivered on <strong>{deliveryDay}, {deliveryDate}</strong>.
        </Text>

        {/* Order Details */}
        <Section style={orderBox}>
          <Text style={orderHeading}>Order Details</Text>
          <Text style={orderText}>
            <strong>Order:</strong> {orderNumber}<br />
            <strong>Items:</strong> 2 Loaves Artisan Sourdough<br />
            <strong>Delivery:</strong> {deliveryDay}, {deliveryDate}<br />
            <strong>Address:</strong> {deliveryAddress}
          </Text>
        </Section>

        {/* Storage Tip */}
        <Section style={tipBox}>
          <Text style={tipHeading}>💡 Storage Tip</Text>
          <Text style={tipText}>
            Store your bread cut-side down on a cutting board for the first 24 hours to keep it fresh.
          </Text>
        </Section>

        {/* What to Expect */}
        <Text style={subheading}>What to Expect</Text>
        
        <Text style={paragraph}>
          Your bread is baked fresh the morning of delivery using organic wheat we mill on-site. It arrives still warm and ready to enjoy.
        </Text>

        <Text style={paragraph}>
          <strong>Fresh-milled means fresher, more nutritious bread</strong> — we preserve 40% more nutrients compared to store-bought flour by milling wheat the same day we bake.
        </Text>

        {/* Closing */}
        <Text style={paragraph}>
          Can't wait for you to taste it!
        </Text>
      </Section>
    </EmailLayout>
  );
};

export default OrderConfirmation;

// Styles
const imageSection = {
  padding: '0',
  margin: '0',
};

const heroImage = {
  width: '100%',
  height: '384px',
  objectFit: 'cover' as const,
  display: 'block',
};

const content = {
  padding: '40px',
};

const heading = {
  fontSize: '28px',
  fontWeight: '700',
  color: '#1f2937',
  margin: '0 0 24px 0',
  lineHeight: '1.2',
};

const subheading = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#5B7C99',
  margin: '32px 0 16px 0',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#374151',
  margin: '0 0 16px 0',
};

const orderBox = {
  backgroundColor: '#f9fafb',
  border: '2px solid #e5e7eb',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const orderHeading = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#1f2937',
  margin: '0 0 12px 0',
};

const orderText = {
  fontSize: '15px',
  lineHeight: '22px',
  color: '#374151',
  margin: '0',
};

const tipBox = {
  backgroundColor: '#fffbeb',
  border: '2px solid #fbbf24',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const tipHeading = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#92400e',
  margin: '0 0 8px 0',
};

const tipText = {
  fontSize: '15px',
  lineHeight: '22px',
  color: '#78350f',
  margin: '0',
};
