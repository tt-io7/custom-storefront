import { Resend } from 'resend';

// Initialize Resend with API key from environment variables
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Check if Resend is configured
const isResendConfigured = !!resendApiKey;

/**
 * Send an email using Resend
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param html - Email HTML content
 * @param from - Sender email address (defaults to environment variable or fallback)
 * @returns The response from Resend or an error
 */
export const sendEmail = async (
  to: string, 
  subject: string, 
  html: string, 
  from = process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com'
) => {
  if (!isResendConfigured) {
    console.error('Resend is not configured. Make sure RESEND_API_KEY is set in your environment variables.');
    return { error: 'Resend is not configured' };
  }

  try {
    const { data, error } = await resend!.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { error };
    }

    return { data };
  } catch (error) {
    console.error('Exception when sending email:', error);
    return { error };
  }
};

/**
 * Send a welcome email to a new customer
 * @param to - Customer email address
 * @param name - Customer name
 * @returns The response from Resend or an error
 */
export const sendWelcomeEmail = async (to: string, name: string) => {
  const subject = 'Welcome to our store!';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Welcome, ${name}!</h1>
      <p>Thank you for creating an account at our store. We're excited to have you as a customer!</p>
      <p>You can now:</p>
      <ul>
        <li>Browse our products</li>
        <li>Create wishlists</li>
        <li>Track your orders</li>
        <li>And more!</li>
      </ul>
      <p>If you have any questions, feel free to contact our support team.</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666;">© ${new Date().getFullYear()} Your Store Name. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmail(to, subject, html);
};

/**
 * Send an order confirmation email
 * @param to - Customer email address
 * @param orderDetails - Object containing order details
 * @returns The response from Resend or an error
 */
export const sendOrderConfirmationEmail = async (to: string, orderDetails: any) => {
  const subject = `Order Confirmation #${orderDetails.id}`;
  
  // Create HTML for order items
  const itemsHtml = orderDetails.items.map((item: any) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.title}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">$${item.unit_price / 100}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">$${(item.unit_price * item.quantity) / 100}</td>
    </tr>
  `).join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Thank You for Your Order!</h1>
      <p>We've received your order and are processing it now.</p>
      
      <h2 style="margin-top: 30px;">Order Summary</h2>
      <p><strong>Order Number:</strong> ${orderDetails.id}</p>
      <p><strong>Date:</strong> ${new Date(orderDetails.created_at).toLocaleDateString()}</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="padding: 10px; text-align: left;">Product</th>
            <th style="padding: 10px; text-align: left;">Quantity</th>
            <th style="padding: 10px; text-align: left;">Price</th>
            <th style="padding: 10px; text-align: left;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding: 10px; text-align: right;"><strong>Subtotal:</strong></td>
            <td style="padding: 10px;">$${orderDetails.subtotal / 100}</td>
          </tr>
          <tr>
            <td colspan="3" style="padding: 10px; text-align: right;"><strong>Shipping:</strong></td>
            <td style="padding: 10px;">$${orderDetails.shipping_total / 100}</td>
          </tr>
          <tr>
            <td colspan="3" style="padding: 10px; text-align: right;"><strong>Tax:</strong></td>
            <td style="padding: 10px;">$${orderDetails.tax_total / 100}</td>
          </tr>
          <tr>
            <td colspan="3" style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
            <td style="padding: 10px;"><strong>$${orderDetails.total / 100}</strong></td>
          </tr>
        </tfoot>
      </table>
      
      <div style="margin-top: 30px;">
        <h2>Shipping Information</h2>
        <p>${orderDetails.shipping_address.first_name} ${orderDetails.shipping_address.last_name}</p>
        <p>${orderDetails.shipping_address.address_1}</p>
        <p>${orderDetails.shipping_address.city}, ${orderDetails.shipping_address.province} ${orderDetails.shipping_address.postal_code}</p>
        <p>${orderDetails.shipping_address.country}</p>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666;">© ${new Date().getFullYear()} Your Store Name. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmail(to, subject, html);
};

export default {
  sendEmail,
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  isResendConfigured,
}; 