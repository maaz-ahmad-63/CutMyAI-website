/**
 * Email sending via Resend
 * Sends transactional confirmation email to captured leads
 */

interface SendLeadEmailProps {
  email: string;
  companyName?: string;
  savings: number;
  toolsCount: number;
  topRecommendation?: string;
}

/**
 * Send confirmation email to lead
 * Includes audit summary and Credex reach-out note
 */
export async function sendLeadConfirmationEmail(
  props: SendLeadEmailProps
): Promise<{ success: boolean; error?: string; messageId?: string }> {
  const { email, companyName, savings, toolsCount, topRecommendation } = props;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY not set');
    return { success: false, error: 'Email service not configured' };
  }

  const savingsFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(savings);

  const greeting = companyName ? `at ${companyName}` : '';
  const recommendationText = topRecommendation
    ? `Top recommendation: Consider ${topRecommendation}.`
    : '';

  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; }
      .header h1 { margin: 0; font-size: 28px; }
      .content { background: #f9fafb; padding: 30px; margin: 20px 0; border-radius: 8px; }
      .stat { margin: 15px 0; font-size: 18px; }
      .stat-value { font-weight: bold; color: #667eea; font-size: 24px; }
      .cta { background: #667eea; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; margin: 20px 0; }
      .footer { color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>✓ Your AI Spend Audit Complete</h1>
      </div>
      
      <div class="content">
        <p>Hi${greeting ? ' ' + greeting.slice(4, -1) : ''},</p>
        
        <p>Thanks for completing your AI spending audit. Here's what we found:</p>
        
        <div class="stat">
          <strong>Tools Analyzed:</strong> <span class="stat-value">${toolsCount}</span>
        </div>
        
        <div class="stat">
          <strong>Potential Monthly Savings:</strong> <span class="stat-value">${savingsFormatted}</span>
        </div>
        
        ${recommendationText ? `<div class="stat"><strong>Tip:</strong> ${recommendationText}</div>` : ''}
        
        <p style="margin-top: 30px; padding: 15px; background: #f0f4ff; border-left: 4px solid #667eea; border-radius: 4px;">
          <strong>🎯 What's Next?</strong><br/>
          We've identified significant optimization opportunities. Our team will reach out within 24 hours with personalized recommendations tailored to your setup.
        </p>
      </div>
      
      <div style="text-align: center;">
        <a href="https://credex.ai" class="cta">View Your Audit Report</a>
      </div>
      
      <div class="footer">
        <p>This email confirms your participation in Credex AI Spend Audit. We'll use your information to provide personalized optimization insights.</p>
        <p>Questions? Reply to this email or contact us at support@credex.ai</p>
        <p>&copy; 2026 Credex. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'Credex Audit <audit@credex.ai>',
        to: email,
        subject: '✓ Your AI Spend Audit Complete',
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Resend API error:', error);
      return { success: false, error: `Email send failed: ${response.statusText}` };
    }

    const data = await response.json() as { id: string };
    return { success: true, messageId: data.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Email send error:', message);
    return { success: false, error: `Email error: ${message}` };
  }
}

/**
 * Send admin notification (internal use)
 * Notifies team about new high-value leads
 */
export async function sendAdminNotification(
  email: string,
  savings: number,
  companyName?: string
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { success: false, error: 'Email service not configured' };

  const savingsFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(savings);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'Credex System <system@credex.ai>',
        to: 'leads@credex.ai',
        subject: `🔥 High-Value Lead: ${email} (${savingsFormatted}/mo)`,
        html: `
          <h3>New Lead Captured</h3>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${companyName || 'Not provided'}</p>
          <p><strong>Potential Savings:</strong> ${savingsFormatted}/month</p>
          <p><a href="https://credex-admin.example.com">View in Dashboard</a></p>
        `,
      }),
    });

    return { success: response.ok };
  } catch (error) {
    return { success: false };
  }
}
