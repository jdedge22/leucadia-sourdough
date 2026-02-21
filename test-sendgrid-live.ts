import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

async function testSendGrid() {
  console.log('🧪 Testing SendGrid...');
  
  try {
    const result = await sgMail.send({
      from: process.env.SENDGRID_FROM_EMAIL!,
      to: 'jim@leucadiasourdough.com',
      subject: 'SendGrid Test - Leucadia Sourdough',
      html: '<h1>Test Email</h1><p>If you see this, SendGrid is working!</p>',
      text: 'Test Email - If you see this, SendGrid is working!',
    });
    
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', result[0].headers['x-message-id']);
    console.log('Check your inbox: jim@leucadiasourdough.com');
  } catch (error: any) {
    console.error('❌ SendGrid error:', error);
    if (error.response) {
      console.error('Details:', error.response.body);
    }
  }
}

testSendGrid();
