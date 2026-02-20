import * as React from 'react';
import { Section, Text } from '@react-email/components';
import { EmailLayout } from '../components/EmailLayout';
import { Button } from '../components/Button';

interface SubscriptionCancelledProps {
  customerName?: string;
  portalUrl: string;
}

export const SubscriptionCancelled = ({
  customerName = 'there',
  portalUrl,
}: SubscriptionCancelledProps) => {
  return (
    <EmailLayout previewText="Sorry to see you go">
      <Section style={content}>
        <Text style={heading}>Sorry to See You Go</Text>
        
        <Text style={paragraph}>
          Hi {customerName},
        </Text>

        <Text style={paragraph}>
          Your Leucadia Sourdough subscription has been cancelled. You won't receive any future deliveries or charges.
        </Text>

        <Text style={paragraph}>
          If this was a mistake, you can restart anytime:
        </Text>

        <Button href={portalUrl}>Restart My Subscription</Button>

        <Section style={feedbackBox}>
          <Text style={feedbackText}>
            <strong>We'd love to hear what we could have done better.</strong><br />
            Just reply to this email with any feedback.
          </Text>
        </Section>

        <Text style={paragraph}>
          Thanks for being part of the Leucadia community.
        </Text>
      </Section>
    </EmailLayout>
  );
};

export default SubscriptionCancelled;

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

const feedbackBox = {
  backgroundColor: '#f0f9ff',
  border: '2px solid #5B7C99',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const feedbackText = {
  fontSize: '15px',
  lineHeight: '22px',
  color: '#1e40af',
  margin: '0',
};
