import * as React from 'react';
import { Button as ReactEmailButton } from '@react-email/components';

interface ButtonProps {
  href: string;
  children: React.ReactNode;
}

export const Button = ({ href, children }: ButtonProps) => {
  return (
    <ReactEmailButton href={href} style={button}>
      {children}
    </ReactEmailButton>
  );
};

const button = {
  backgroundColor: '#5B7C99',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '14px 24px',
  margin: '24px 0',
};
