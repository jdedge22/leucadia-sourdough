import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Img,
  Text,
  Link,
  Hr,
} from '@react-email/components';

interface EmailLayoutProps {
  children: React.ReactNode;
  previewText?: string;
}

export const EmailLayout = ({ children, previewText }: EmailLayoutProps) => {
  return (
    <Html>
      <Head />
      {previewText && (
        <Text style={{ display: 'none', overflow: 'hidden', lineHeight: '1px', opacity: 0 }}>
          {previewText}
        </Text>
      )}
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logoText}>Leucadia Sourdough</Text>
          </Section>

          {/* Content */}
          {children}

          {/* Footer */}
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              Questions? Just reply to this email.
            </Text>
            <Text style={footerText}>
              Leucadia Sourdough Team
              <br />
              <Link href="mailto:hello@send.leucadiasourdough.com" style={footerLink}>
                hello@send.leucadiasourdough.com
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#f9fafb',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0',
  marginTop: '32px',
  marginBottom: '32px',
  borderRadius: '8px',
  overflow: 'hidden',
  maxWidth: '600px',
};

const header = {
  backgroundColor: '#5B7C99',
  padding: '32px 40px',
  textAlign: 'center' as const,
};

const logoText = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0',
  letterSpacing: '-0.5px',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
};

const footer = {
  padding: '0 40px 40px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
};

const footerLink = {
  color: '#5B7C99',
  textDecoration: 'none',
};
