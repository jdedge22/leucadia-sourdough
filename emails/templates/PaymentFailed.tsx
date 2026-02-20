import * as React from 'react';
import { Section, Text } from '@react-email/components';
import { EmailLayout } from '../components/EmailLayout';
import { Button } from '../components/Button';

interface PaymentFailedProps {
  customerName?: string;
  portalUrl: string;
}

export const PaymentFailed = ({
  customerName = 'there',
  portalUrl,
}: PaymentFailedProps) => {
  return (
    <EmailLayout previewText="Payment issue with your Leucadia subscription">
      <Section style={content}>
        <Text style={heading}>Payment Issue with Your Subscription</Text>
        
        <Text style={paragraph}>
          Hi {customerName},
        </Text>

        <Text style={paragraph}>
          We tried to process your payment for this week's bread delivery but weren't able to complete it.
        </Text>

        <Text style={paragraph}>
          <strong>No worries—this happens!</strong>
        </Text>

        <Text style={paragraph}>
          To keep your deliveries coming, please update your payment method:
        </Text>

        <Button href={portalUrl}>Update Payment Method</Button>

        <Section style={infoBox}>
          <Text style={infoText}>
            Your subscription will remain active while you update your payment info. If we don't hear from you within 7 days, we'll need to pause your deliveries.
          </Text>
        </Section>

        <Text style={paragraph}>
          Questions? Just reply to this email.
        </Text>
      </Section>
    </EmailLayout>
  );
};

export default PaymentFailed;

// Styles
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

const paragraph = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#374151',
  margin: '0 0 16px 0',
};

const infoBox = {
  backgroundColor: '#fef2f2',
  border: '2px solid #fca5a5',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const infoText = {
  fontSize: '15px',
  lineHeight: '22px',
  color: '#7f1d1d',
  margin: '0',
};
