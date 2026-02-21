#!/bin/bash
# Replace Resend with SendGrid in Leucadia Sourdough project

echo "🔄 Replacing Resend with SendGrid..."

# Step 1: Backup the original resend.ts
echo "📦 Backing up original resend.ts..."
cp ./emails/lib/resend.ts ./emails/lib/resend.ts.backup

# Step 2: Replace resend.ts with SendGrid adapter
echo "✏️  Replacing resend.ts with SendGrid adapter..."
cat > ./emails/lib/resend.ts << 'INNEREOF'
import sgMail from '@sendgrid/mail';
import { render } from '@react-email/render';
import { ReactElement } from 'react';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY is not set');
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// SendGrid adapter that mimics Resend's API but uses SendGrid under the hood
export const resend = {
  emails: {
    send: async ({
      from,
      to,
      subject,
      react,
    }: {
      from: string;
      to: string;
      subject: string;
      react: ReactElement;
    }) => {
      try {
        // Render React component to HTML
        const html = await render(react);
        
        // Convert React email to plain text (for fallback)
        const text = await render(react, { plainText: true });
        
        // Use SendGrid from email or fall back to env var
        const fromEmail = process.env.SENDGRID_FROM_EMAIL || from;
        
        // Send via SendGrid
        const result = await sgMail.send({
          from: fromEmail,
          to,
          subject,
          html,
          text,
        });
        
        return {
          data: {
            id: result[0].headers['x-message-id'] || 'success',
          },
          error: null,
        };
      } catch (error: any) {
        console.error('SendGrid email error:', error);
        if (error.response) {
          console.error('SendGrid error details:', error.response.body);
        }
        return {
          data: null,
          error: {
            message: error.message || 'Failed to send email',
          },
        };
      }
    },
  },
};
INNEREOF

# Step 3: Update sendEmail.ts to use jim@leucadiasourdough.com
echo "📧 Updating FROM_EMAIL address..."
sed -i.bak "s|hello@mail.leucadiasourdough.com|jim@leucadiasourdough.com|g" ./emails/lib/sendEmail.ts

echo ""
echo "✅ SendGrid replacement complete!"
echo ""
echo "Next steps:"
echo "  1. Verify changes: git diff emails/lib/resend.ts"
echo "  2. Test locally: npm run dev"
echo "  3. Deploy: git push"
echo ""
echo "Backups created:"
echo "  - ./emails/lib/resend.ts.backup"
echo "  - ./emails/lib/sendEmail.ts.bak"
