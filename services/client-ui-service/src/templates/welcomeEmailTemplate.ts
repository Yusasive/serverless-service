export interface WelcomeEmailData {
  customerName: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  supportEmail: string;
  loginUrl: string;
  dashboardUrl: string;
  eventDate: string;
  eventLocation: string;
}

export const generateWelcomeEmailHTML = (emailData: WelcomeEmailData): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Lagos International Trade Fair 2025</title>
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
        .success-banner {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          text-align: center;
          padding: 20px;
          margin: 20px 0;
          border-radius: 8px;
        }
        .success-banner h2 {
          margin: 0 0 10px 0;
          font-size: 20px;
        }
        .success-banner p {
          margin: 0;
          opacity: 0.9;
        }
        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin: 25px 0;
        }
        .feature-card {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
        }
        .feature-card h3 {
          margin: 0 0 10px 0;
          color: #1e40af;
          font-size: 16px;
        }
        .feature-card p {
          margin: 0;
          font-size: 14px;
          color: #64748b;
        }
        .cta-section {
          background-color: #eff6ff;
          border: 1px solid #3b82f6;
          border-radius: 8px;
          padding: 25px;
          margin: 25px 0;
          text-align: center;
        }
        .cta-section h3 {
          margin: 0 0 15px 0;
          color: #1e40af;
          font-size: 18px;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          color: white;
          text-decoration: none;
          padding: 15px 30px;
          border-radius: 6px;
          font-weight: 600;
          margin: 10px;
          font-size: 16px;
        }
        .secondary-button {
          display: inline-block;
          background: transparent;
          color: #3b82f6;
          text-decoration: none;
          padding: 12px 24px;
          border: 2px solid #3b82f6;
          border-radius: 6px;
          font-weight: 600;
          margin: 10px;
          font-size: 14px;
        }
        .event-info {
          background-color: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .event-info h3 {
          margin: 0 0 15px 0;
          color: #92400e;
          font-size: 16px;
        }
        .event-info p {
          margin: 5px 0;
          font-size: 14px;
        }
        .next-steps {
          background-color: #f0f9ff;
          border-left: 4px solid #0ea5e9;
          padding: 20px;
          margin: 20px 0;
          border-radius: 0 8px 8px 0;
        }
        .next-steps h3 {
          margin: 0 0 15px 0;
          color: #0c4a6e;
          font-size: 16px;
        }
        .next-steps ol {
          margin: 0;
          padding-left: 20px;
        }
        .next-steps li {
          margin-bottom: 10px;
          font-size: 14px;
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
        @media only screen and (max-width: 600px) {
          body {
            padding: 10px;
          }
          .content {
            padding: 20px 15px;
          }
          .features-grid {
            grid-template-columns: 1fr;
          }
          .cta-button, .secondary-button {
            display: block;
            margin: 10px 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <img src="https://shop.lagosinternationaltradefair.com/media/litf_logo.png" alt="LITF Logo" class="logo" style="width: 120px; height: auto; margin-bottom: 15px; border-radius: 8px; background-color: white; padding: 10px;" onerror="this.style.display='none';">
          <h1>🏢 Lagos International Trade Fair</h1>
          <p>Welcome to LITF 2025!</p>
        </div>
        
        <div class="content">
          <div class="greeting">
            Welcome, ${emailData.customerName}! 🎉
          </div>
          
          <div class="success-banner">
            <h2>✅ Email Verification Successful!</h2>
            <p>Your account has been successfully verified and activated.</p>
          </div>
          
          <p>Congratulations! You're now officially part of the Lagos International Trade Fair 2025 community. We're thrilled to have you on board and can't wait to help you make the most of this incredible opportunity.</p>
          
          <div class="features-grid">
            <div class="feature-card">
              <h3>🏪 Booth Reservation</h3>
              <p>Reserve your perfect booth space in our state-of-the-art exhibition halls</p>
            </div>
            <div class="feature-card">
              <h3>💳 Secure Payments</h3>
              <p>Multiple payment options with secure, encrypted transactions</p>
            </div>
            <div class="feature-card">
              <h3>📊 Dashboard Access</h3>
              <p>Manage your reservations, payments, and event details all in one place</p>
            </div>
            <div class="feature-card">
              <h3>📧 Updates & Notifications</h3>
              <p>Stay informed with real-time updates about the event and your participation</p>
            </div>
          </div>
          
          <div class="cta-section">
            <h3>🚀 Ready to Get Started?</h3>
            <p>Access your dashboard and start exploring booth options for the Lagos International Trade Fair 2025.</p>
            <a href="${emailData.dashboardUrl}" class="cta-button">Access Dashboard</a>
            <a href="${emailData.loginUrl}" class="secondary-button">Login to Account</a>
          </div>
          
          <div class="event-info">
            <h3>📅 Event Information</h3>
            <p><strong>Event:</strong> Lagos International Trade Fair 2025</p>
            <p><strong>Date:</strong> ${emailData.eventDate}</p>
            <p><strong>Location:</strong> ${emailData.eventLocation}</p>
            <p><strong>Expected Attendees:</strong> 50,000+ visitors from across Africa and beyond</p>
          </div>
          
          <div class="next-steps">
            <h3>📋 Your Next Steps</h3>
            <ol>
              <li><strong>Explore Booth Options:</strong> Browse available booths by sector and size</li>
              <li><strong>Make Your Selection:</strong> Choose the perfect location for your business</li>
              <li><strong>Complete Payment:</strong> Secure your reservation with our payment system</li>
              <li><strong>Prepare for Success:</strong> Access exhibitor resources and guidelines</li>
              <li><strong>Stay Connected:</strong> Join our exhibitor community for updates and networking</li>
            </ol>
          </div>
          
          <p>Our team is here to support you every step of the way. If you have any questions about booth selection, payment options, or event logistics, don't hesitate to reach out to our dedicated support team.</p>
          
          <p>We're excited to see your business shine at the Lagos International Trade Fair 2025!</p>
          
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
            Welcome to the Lagos International Trade Fair 2025 community! 
            This email confirms your successful account verification and activation.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const generateWelcomeEmailText = (emailData: WelcomeEmailData): string => {
  return `
Welcome, ${emailData.customerName}! 🎉

✅ EMAIL VERIFICATION SUCCESSFUL!

Your account has been successfully verified and activated.

Congratulations! You're now officially part of the Lagos International Trade Fair 2025 community. We're thrilled to have you on board and can't wait to help you make the most of this incredible opportunity.

WHAT YOU CAN DO NOW:
🏪 Booth Reservation - Reserve your perfect booth space in our state-of-the-art exhibition halls
💳 Secure Payments - Multiple payment options with secure, encrypted transactions
📊 Dashboard Access - Manage your reservations, payments, and event details all in one place
📧 Updates & Notifications - Stay informed with real-time updates about the event and your participation

🚀 READY TO GET STARTED?

Access your dashboard and start exploring booth options for the Lagos International Trade Fair 2025.

Dashboard: ${emailData.dashboardUrl}
Login: ${emailData.loginUrl}

📅 EVENT INFORMATION:
Event: Lagos International Trade Fair 2025
Date: ${emailData.eventDate}
Location: ${emailData.eventLocation}
Expected Attendees: 50,000+ visitors from across Africa and beyond

📋 YOUR NEXT STEPS:
1. Explore Booth Options: Browse available booths by sector and size
2. Make Your Selection: Choose the perfect location for your business
3. Complete Payment: Secure your reservation with our payment system
4. Prepare for Success: Access exhibitor resources and guidelines
5. Stay Connected: Join our exhibitor community for updates and networking

Our team is here to support you every step of the way. If you have any questions about booth selection, payment options, or event logistics, don't hesitate to reach out to our dedicated support team.

We're excited to see your business shine at the Lagos International Trade Fair 2025!

Best regards,
The LITF Team

---
${emailData.companyName}
${emailData.companyAddress}
Phone: ${emailData.companyPhone}
Email: ${emailData.companyEmail}
Support: ${emailData.supportEmail}
Website: www.lagostradefair.com

Welcome to the Lagos International Trade Fair 2025 community! 
This email confirms your successful account verification and activation.
  `;
};

// Helper function to create welcome email data
export const createWelcomeEmailData = (
  customerName: string,
  loginUrl: string = 'https://shop.lagosinternationaltradefair.com/login',
  dashboardUrl: string = 'https://shop.lagosinternationaltradefair.com/dashboard'
): WelcomeEmailData => {
  return {
    customerName,
    loginUrl,
    dashboardUrl,
    eventDate: 'November 1-10, 2025',
    eventLocation: 'Lagos International Trade Fair Complex, Lagos, Nigeria',
    companyName: 'Lagos International Trade Fair',
    companyEmail: 'info@lagostradefair.com',
    companyPhone: '+234 123 456 7890',
    companyAddress: 'Lagos International Trade Fair Complex, Lagos, Nigeria',
    supportEmail: 'support@lagostradefair.com'
  };
}; 