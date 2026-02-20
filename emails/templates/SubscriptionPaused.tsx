import * as React from 'react';
import { Section, Text } from '@react-email/components';
import { EmailLayout } from '../components/EmailLayout';
import { Button } from '../components/Button';

interface SubscriptionPausedProps {
  customerName?: string;
  portalUrl: string;
}

export const SubscriptionPaused = ({
  customerName = 'there',
  portalUrl,
}: SubscriptionPausedProps) => {
  return (
    <EmailLayout previewText="Your Leucadia subscription is paused">
      <Section style={content}>
        <Text style={heading}>Your Subscription is Paused</Text>
        
        <Text style={paragraph}>
          Hey {customerName},
        </Text>

        <Text style={paragraph}>
          Just confirming—your subscription is now paused. You won't be charged or receive deliveries until you restart.
        </Text>

        <Text style={paragraph}>
          <strong>Ready to resume?</strong> Log into your customer portal:
        </Text>

        <Button href={portalUrl}>Manage My Subscription</Button>

        <Text style={paragraph}>
          We'll be here whenever you're ready for fresh bread again.
        </Text>
      </Section>
    </EmailLayout>
  );
};

export default SubscriptionPaused;

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
