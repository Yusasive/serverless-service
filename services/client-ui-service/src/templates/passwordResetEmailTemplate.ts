import { generateEmailHeader, EmailHeaderData } from './emailheaderTemplate';
import { generateEmailFooter, EmailFooterData } from './emailFooterTemplate';

export interface PasswordResetEmailData {
  customerName: string;
  resetToken: string;
  resetUrl: string;
  expiryTime: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  supportEmail: string;
  companyWebsite: string;
}

export const generatePasswordResetEmailHTML = (emailData: PasswordResetEmailData): string => {
  const headerData: EmailHeaderData = {
    tagline: 'Password Reset Request'
  };

  const footerData: EmailFooterData = {
    companyWebsite: emailData.companyWebsite,
    companyName: emailData.companyName,
    companyAddress: emailData.companyAddress,
    companyPhone: emailData.companyPhone,
    companyEmail: emailData.companyEmail,
    supportEmail: emailData.supportEmail
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset - Lagos International Trade Fair</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background: #f4f7fb;
          padding: 0;
          margin: 0;
          color: #263238;
        }
        .email-container {
          background: #fff;
          max-width: 520px;
          margin: 40px auto;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(40, 72, 122, 0.13);
          overflow: hidden;
          border: 1px solid #e3e9f5;
        }
        .header {
          background: linear-gradient(90deg, #dc2626 0%, #ef4444 100%);
          padding: 24px 0 18px 0;
          text-align: center;
        }
        .header img {
          width: 60px;
          height: auto;
          margin-bottom: 10px;
        }
        .header .title {
          color: #fff;
          font-size: 22px;
          font-weight: bold;
          letter-spacing: 1px;
        }
        .header .tagline {
          color: #ffedd5;
          font-size: 15px;
          margin-top: 4px;
        }
        .divider {
          border-bottom: 1px solid #f3f4f6;
          margin: 0 28px;
        }
        .content {
          padding: 32px 28px 24px 28px;
        }
        .greeting {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 20px;
          letter-spacing: .5px;
        }
        .reset-button {
          display: inline-block;
          background: linear-gradient(90deg, #dc2626 0%, #ef4444 100%);
          color: #fff;
          text-decoration: none;
          padding: 15px 32px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          margin: 26px 0 12px 0;
          box-shadow: 0 2px 12px 0 rgba(239, 68, 68, 0.13);
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .reset-button:hover {
          box-shadow: 0 4px 20px 0 rgba(239, 68, 68, 0.22);
          transform: translateY(-2px) scale(1.02);
        }
        .expiry-notice {
          background: #fef2f2;
          border-left: 4px solid #dc2626;
          border-radius: 6px;
          padding: 14px 18px;
          margin: 22px 0 10px 0;
          text-align: left;
          color: #991b1b;
          font-size: 14px;
          font-weight: 600;
        }
        .no-request-notice {
          background: #f8fafc;
          border: 1px solid #e0e7ef;
          border-radius: 7px;
          padding: 17px 20px;
          margin: 22px 0 10px 0;
        }
        .no-request-notice h3 {
          margin: 0 0 8px 0;
          color: #64748b;
          font-size: 15px;
        }
        .no-request-notice p {
          margin: 0;
          font-size: 13.5px;
          color: #475569;
        }
        .signature {
          margin-top: 30px;
          font-size: 14.5px;
          color: #1f2937;
        }
        .litf-team {
          color: #dc2626;
          font-weight: bold;
          font-size: 15px;
          margin-top: 2px;
        }
        .footer {
          background: #f7fafd;
          padding: 22px 0 10px 0;
          text-align: center;
          color: #64748b;
          font-size: 13px;
          border-top: 1px solid #f1f5f9;
        }
        .footer a {
          color: #dc2626;
          text-decoration: none;
        }
        @media only screen and (max-width: 600px) {
          .email-container { margin: 0; border-radius: 0; }
          .content, .divider { padding: 16px 10px; margin: 0 8px; }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        ${generateEmailHeader(headerData)}
        <div class="divider"></div>
        <div class="content">
          <div class="greeting">
            Hello,
          </div>
          <p>
            We received a request to reset your password for your Lagos International Trade Fair account.<br>
            If you made this request, use the button below to securely reset your password:
          </p>
          <div style="text-align:center;">
            <a href="${emailData.resetUrl}" class="reset-button">Reset My Password</a>
          </div>
          <div class="expiry-notice">
            ⏰ This link will expire in <b>${emailData.expiryTime}</b>.
          </div>
          <div class="no-request-notice">
            <h3>Didn't Request This?</h3>
            <p>
              If you didn't request a password reset, you can safely ignore this email.<br>
              Your account is secure and no changes will be made.<br>
              If you're concerned about your account, please contact our support team immediately.
            </p>
          </div>
          <div class="signature">
            We're here to help if you need any assistance!
            <div class="litf-team">— The LITF Team</div>
          </div>
        </div>
        <div class="divider"></div>
        <div class="footer">
          ${generateEmailFooter(footerData)}
        </div>
      </div>
    </body>
    </html>
  `;
};
