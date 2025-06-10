import sgMail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export interface EmailInvite {
  to: string;
  username: string;
  tempPassword: string;
  inviterName?: string;
}

export async function sendWelcomeInvite(invite: EmailInvite): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.log('SendGrid not configured - would send email to:', invite.to);
    return true; // Return success for development
  }

  try {
    const msg = {
      to: invite.to,
      from: 'info@dovito.com',
      subject: 'Welcome to Dovito CMS - Your Account Access',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Dovito CMS</h2>
          
          <p>Hello,</p>
          
          <p>You've been invited to access the Dovito CMS admin panel. Here are your login credentials:</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Username:</strong> ${invite.username}</p>
            <p><strong>Temporary Password:</strong> ${invite.tempPassword}</p>
          </div>
          
          <p>Please log in and change your password immediately for security.</p>
          
          <p>Access the admin panel at: <a href="${process.env.REPLIT_DOMAINS?.split(',')[0] || 'your-domain.com'}/admin">${process.env.REPLIT_DOMAINS?.split(',')[0] || 'your-domain.com'}/admin</a></p>
          
          <p>Best regards,<br>The Dovito Team</p>
        </div>
      `,
    };

    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}