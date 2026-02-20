import { NextResponse } from 'next/server';
import { sendSubscriptionWelcome } from '@/emails/lib/sendEmail';

export async function POST(req: Request) {
  const { email } = await req.json();

  try {
    const result = await sendSubscriptionWelcome({
      to: email,
      customerName: 'Test Customer',
      deliveryDay: 'Thursday',
      deliveryDate: 'February 27, 2026',
      portalUrl: 'https://leucadia-sourdough.vercel.app/portal',
    });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('Email send error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
