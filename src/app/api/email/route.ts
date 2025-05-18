import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, sendWelcomeEmail, sendOrderConfirmationEmail } from '../../../lib/resend';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'welcome':
        if (!data.email || !data.name) {
          return NextResponse.json(
            { error: 'Missing email or name for welcome email' },
            { status: 400 }
          );
        }
        result = await sendWelcomeEmail(data.email, data.name);
        break;

      case 'order_confirmation':
        if (!data.email || !data.order) {
          return NextResponse.json(
            { error: 'Missing email or order details for order confirmation' },
            { status: 400 }
          );
        }
        result = await sendOrderConfirmationEmail(data.email, data.order);
        break;

      case 'custom':
        if (!data.email || !data.subject || !data.html) {
          return NextResponse.json(
            { error: 'Missing email, subject, or content for custom email' },
            { status: 400 }
          );
        }
        result = await sendEmail(data.email, data.subject, data.html);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        );
    }

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error('Error in email API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 