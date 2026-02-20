import * as React from 'react';
import { Section, Text, Img } from '@react-email/components';
import { EmailLayout } from '../components/EmailLayout';
import { Button } from '../components/Button';

interface SubscriptionWelcomeProps {
  customerName?: string;
  deliveryDay: string;
  deliveryDate: string;
  portalUrl: string;
}

export const SubscriptionWelcome = ({
  customerName = 'there',
  deliveryDay,
  deliveryDate,
  portalUrl,
}: SubscriptionWelcomeProps) => {
  return (
    <EmailLayout previewText="Welcome to weekly fresh-milled sourdough!">
      {/* Hero Image */}
      <Section style={imageSection}>
        <Img
          src="https://leucadia-sourdough.vercel.app/images/avocado-toast-lifestyle.jpg"
          alt="Fresh sourdough with avocado"
          width="600"
          height="384"
          style={heroImage}
        />
      </Section>

      {/* Main Content */}
      <Section style={content}>
        <Text style={heading}>Welcome to Leucadia Sourdough! 🍞</Text>
        
        <Text style={paragraph}>
          Hey {customerName}!
        </Text>

        <Text style={paragraph}>
          Welcome to weekly fresh-milled sourdough! Your first delivery is scheduled for <strong>{deliveryDay}, {deliveryDate}</strong>.
        </Text>

        {/* What You're Getting */}
        <Section style={infoBox}>
          <Text style={infoBoxHeading}>What You're Getting:</Text>
          <Text style={infoBoxText}>
            • 2 loaves every week<br />
            • Delivered {deliveryDay}<br />
            • Baked fresh the morning of delivery
          </Text>
        </Section>

        {/* Manage Subscription */}
        <Text style={paragraph}>
          <strong>Managing Your Subscription:</strong><br />
          You can skip weeks, pause, or update your delivery preferences anytime in your customer portal.
        </Text>

        <Button href={portalUrl}>Manage My Subscription</Button>

        {/* Storage Tip */}
        <Section style={tipBox}>
          <Text style={tipHeading}>💡 Storage Tip</Text>
          <Text style={tipText}>
            Keep at room temperature, never refrigerate. Freeze extra loaves for up to 3 months.
          </Text>
        </Section>

        {/* What Makes Us Different */}
        <Text style={subheading}>What Makes Our Bread Different</Text>
        
        <Text style={paragraph}>
          <strong>Fresh-milled organic wheat</strong><br />
          We mill organic wheat the morning we bake, preserving 40% more nutrients than store-bought flour.
        </Text>

        <Text style={paragraph}>
          <strong>24-hour sourdough fermentation</strong><br />
          Long, slow fermentation enhances digestibility and develops complex flavor.
        </Text>

        <Text style={paragraph}>
          <strong>Delivered fresh</strong><br />
          Your bread arrives within hours of cooling, still warm and ready to enjoy.
        </Text>

        {/* Closing */}
        <Text style={paragraph}>
          We're excited to be part of your weekly routine!
        </Text>
      </Section>
    </EmailLayout>
  );
};

export default SubscriptionWelcome;

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

const infoBox = {
  backgroundColor: '#f0f9ff',
  border: '2px solid #5B7C99',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const infoBoxHeading = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#5B7C99',
  margin: '0 0 12px 0',
};

const infoBoxText = {
  fontSize: '16px',
  lineHeight: '24px',
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
