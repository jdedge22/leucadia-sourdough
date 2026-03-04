import * as React from 'react';
import { Section, Text } from '@react-email/components';
import { EmailLayout } from '../components/EmailLayout';
import { Button } from '../components/Button';

interface WholesaleWelcomeProps {
  customerName?: string;
  businessName?: string;
  partnerType: 'restaurant' | 'grocery';
  loafCount: number;
  perLoafRate: string;
  deliveryDay: string;
  portalUrl: string;
}

export const WholesaleWelcome = ({
  customerName = 'there',
  businessName,
  partnerType,
  loafCount,
  perLoafRate,
  deliveryDay,
  portalUrl,
}: WholesaleWelcomeProps) => {
  const formattedDeliveryDay = deliveryDay.charAt(0).toUpperCase() + deliveryDay.slice(1);
  const partnerLabel = partnerType === 'restaurant' ? 'Restaurant' : 'Grocery';

  return (
    <EmailLayout previewText={`Welcome to Leucadia Sourdough wholesale — ${partnerLabel} Partner`}>
      <Section style={content}>
        <Text style={heading}>
          Welcome, {partnerLabel} Partner!
        </Text>

        <Text style={paragraph}>
          Hey {customerName}{businessName ? ` from ${businessName}` : ''}!
        </Text>

        <Text style={paragraph}>
          We're excited to have you as a wholesale partner. Your account is set up and your first delivery is on its way.
        </Text>

        {/* Order Details */}
        <Section style={infoBox}>
          <Text style={infoBoxHeading}>Your Wholesale Details:</Text>
          <Text style={infoBoxText}>
            • Partner type: {partnerLabel}<br />
            • {loafCount} loaves per delivery<br />
            • {perLoafRate} per loaf<br />
            • Delivery day: {formattedDeliveryDay}<br />
            • Billed every 4 weeks
          </Text>
        </Section>

        {/* Variety Management */}
        <Text style={paragraph}>
          <strong>Managing Your Bread Varieties:</strong><br />
          You can update your bread variety breakdown anytime through your customer portal. Choose from Original Leucadia Sourdough, Everything Bagel, and Jalapeño & Cheddar.
        </Text>

        <Button href={portalUrl}>Manage My Account</Button>

        {/* What Makes Us Different */}
        <Text style={subheading}>What Your Customers Will Love</Text>

        <Text style={paragraph}>
          <strong>Fresh-milled organic wheat</strong><br />
          We mill organic wheat the morning we bake, preserving 40% more nutrients than commercial flour.
        </Text>

        <Text style={paragraph}>
          <strong>24-hour sourdough fermentation</strong><br />
          Long, slow fermentation enhances digestibility and develops complex flavor your customers will notice.
        </Text>

        <Text style={paragraph}>
          <strong>Delivered fresh</strong><br />
          Every loaf arrives within hours of cooling — never frozen, never day-old.
        </Text>

        {/* Contact */}
        <Section style={tipBox}>
          <Text style={tipHeading}>Questions?</Text>
          <Text style={tipText}>
            For order changes, delivery issues, or anything else — just reply to this email or text Jim directly. We keep it simple.
          </Text>
        </Section>

        <Text style={paragraph}>
          Looking forward to a great partnership!
        </Text>
      </Section>
    </EmailLayout>
  );
};

export default WholesaleWelcome;

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
  backgroundColor: '#fffbeb',
  border: '2px solid #d97706',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const infoBoxHeading = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#92400e',
  margin: '0 0 12px 0',
};

const infoBoxText = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#374151',
  margin: '0',
};

const tipBox = {
  backgroundColor: '#f0f9ff',
  border: '2px solid #5B7C99',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const tipHeading = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#5B7C99',
  margin: '0 0 8px 0',
};

const tipText = {
  fontSize: '15px',
  lineHeight: '22px',
  color: '#374151',
  margin: '0',
};
