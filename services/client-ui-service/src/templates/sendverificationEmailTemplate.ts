export interface VerificationEmailData {
  customerName: string;
  verificationCode: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  expiryTime: string;
  supportEmail: string;
}

export const generateVerificationEmailHTML = (emailData: VerificationEmailData): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification - Lagos International Trade Fair</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .email-container {
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .logo {
          width: 120px;
          height: auto;
          margin-bottom: 15px;
          border-radius: 8px;
          background-color: white;
          padding: 10px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }
        .header p {
          margin: 10px 0 0 0;
          opacity: 0.9;
          font-size: 14px;
        }
        .content {
          padding: 30px 20px;
        }
        .greeting {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 20px;
        }
        .verification-code {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          text-align: center;
          padding: 30px 20px;
          margin: 20px 0;
          border-radius: 8px;
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          font-family: 'Courier New', monospace;
        }
        .code-label {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        .instructions {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .instructions h3 {
          margin: 0 0 15px 0;
          color: #1e40af;
          font-size: 16px;
        }
        .instructions ul {
          margin: 0;
          padding-left: 20px;
        }
        .instructions li {
          margin-bottom: 8px;
          font-size: 14px;
        }
        .security-notice {
          background-color: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .security-notice h3 {
          margin: 0 0 15px 0;
          color: #92400e;
          font-size: 16px;
        }
        .security-notice ul {
          margin: 0;
          padding-left: 20px;
        }
        .security-notice li {
          margin-bottom: 8px;
          font-size: 14px;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          color: white;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-weight: 600;
          margin: 20px 0;
          text-align: center;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
          border-top: 1px solid #e5e7eb;
        }
        .company-info {
          margin-bottom: 15px;
        }
        .company-info p {
          margin: 5px 0;
        }
        .social-links {
          margin-top: 15px;
        }
        .social-links a {
          color: #3b82f6;
          text-decoration: none;
          margin: 0 10px;
        }
        .expiry-notice {
          background-color: #fee2e2;
          border: 1px solid #ef4444;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          text-align: center;
        }
        .expiry-notice p {
          margin: 0;
          color: #dc2626;
          font-weight: 600;
          font-size: 14px;
        }
        @media only screen and (max-width: 600px) {
          body {
            padding: 10px;
          }
          .content {
            padding: 20px 15px;
          }
          .verification-code {
            font-size: 24px;
            letter-spacing: 4px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <img src="https://shop.lagosinternationaltradefair.com/media/litf_logo.png" alt="LITF Logo" class="logo" style="width: 120px; height: auto; margin-bottom: 15px; border-radius: 8px; background-color: white; padding: 10px;" onerror="this.style.display='none';">
          <h1>🏢 Lagos International Trade Fair</h1>
          <p>Email Verification Required</p>
        </div>
        
        <div class="content">
          <div class="greeting">
            Dear ${emailData.customerName},
          </div>
          
          <p>Thank you for registering with the Lagos International Trade Fair 2025. To complete your registration and access your account, please verify your email address.</p>
          
          <div class="verification-code">
            <div class="code-label">Your Verification Code</div>
            <div>${emailData.verificationCode}</div>
          </div>
          
          <div class="expiry-notice">
            <p>⏰ This code will expire in ${emailData.expiryTime}</p>
          </div>
          
          <div class="instructions">
            <h3>📋 How to Verify Your Email</h3>
            <ul>
              <li>Copy the verification code above</li>
              <li>Return to the Lagos International Trade Fair website</li>
              <li>Enter the code in the verification field</li>
              <li>Click "Verify Email" to complete your registration</li>
            </ul>
          </div>
          
          <div class="security-notice">
            <h3>🔒 Security Information</h3>
            <ul>
              <li>Never share this verification code with anyone</li>
              <li>Our team will never ask for this code via phone or email</li>
              <li>If you didn't request this verification, please ignore this email</li>
              <li>For security reasons, this code will expire automatically</li>
            </ul>
          </div>
          
          <p>If you're having trouble with the verification process, you can:</p>
          <ul>
            <li>Request a new verification code from your account dashboard</li>
            <li>Contact our support team for assistance</li>
            <li>Check your spam folder if you don't see this email</li>
          </ul>
          
          <p>Once verified, you'll have full access to:</p>
          <ul>
            <li>Booth reservation and management</li>
            <li>Payment processing</li>
            <li>Event updates and notifications</li>
            <li>Exhibitor resources and documentation</li>
          </ul>
          
          <p>We look forward to having you as part of the Lagos International Trade Fair 2025!</p>
          
          <p>Best regards,<br>
          <strong>The LITF Team</strong></p>
        </div>
        
        <div class="footer">
          <div class="company-info">
            <p><strong>${emailData.companyName}</strong></p>
            <p>${emailData.companyAddress}</p>
            <p>Phone: ${emailData.companyPhone}</p>
            <p>Email: ${emailData.companyEmail}</p>
          </div>
          <div class="social-links">
            <a href="https://www.lagostradefair.com">Website</a> |
            <a href="mailto:${emailData.supportEmail}">Support</a> |
            <a href="tel:${emailData.companyPhone}">Call Us</a>
          </div>
          <p style="margin-top: 15px; font-size: 11px; color: #9ca3af;">
            This email was sent to verify your email address for Lagos International Trade Fair 2025.
            If you didn't create an account, please ignore this email or contact our support team.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const generateVerificationEmailText = (emailData: VerificationEmailData): string => {
  return `
Dear ${emailData.customerName},

Thank you for registering with the Lagos International Trade Fair 2025. To complete your registration and access your account, please verify your email address.

YOUR VERIFICATION CODE: ${emailData.verificationCode}

This code will expire in ${emailData.expiryTime}.

HOW TO VERIFY YOUR EMAIL:
1. Copy the verification code above
2. Return to the Lagos International Trade Fair website
3. Enter the code in the verification field
4. Click "Verify Email" to complete your registration

SECURITY INFORMATION:
- Never share this verification code with anyone
- Our team will never ask for this code via phone or email
- If you didn't request this verification, please ignore this email
- For security reasons, this code will expire automatically

If you're having trouble with the verification process, you can:
- Request a new verification code from your account dashboard
- Contact our support team for assistance
- Check your spam folder if you don't see this email

Once verified, you'll have full access to:
- Booth reservation and management
- Payment processing
- Event updates and notifications
- Exhibitor resources and documentation

We look forward to having you as part of the Lagos International Trade Fair 2025!

Best regards,
The LITF Team

---
${emailData.companyName}
${emailData.companyAddress}
Phone: ${emailData.companyPhone}
Email: ${emailData.companyEmail}
Support: ${emailData.supportEmail}
Website: www.lagostradefair.com

This email was sent to verify your email address for Lagos International Trade Fair 2025.
If you didn't create an account, please ignore this email or contact our support team.
  `;
};

// Helper function to create verification email data
export const createVerificationEmailData = (
  customerName: string,
  verificationCode: string,
  expiryMinutes: number = 15
): VerificationEmailData => {
  return {
    customerName,
    verificationCode,
    expiryTime: `${expiryMinutes} minutes`,
    companyName: 'Lagos International Trade Fair',
    companyEmail: 'info@lagostradefair.com',
    companyPhone: '+234 123 456 7890',
    companyAddress: 'Lagos International Trade Fair Complex, Lagos, Nigeria',
    supportEmail: 'support@lagostradefair.com'
  };
};
