import { InvoiceData } from '../utils/invoiceUtils';

export interface EmailTemplateData {
  customerName: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: string;
  currency: string;
  boothCount: number;
  sectors: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  companyWebsite: string;
  paymentInstructions: string;
}

export const generateInvoiceEmailHTML = (invoiceData: InvoiceData): string => {
  const baseTotal = typeof invoiceData.total === 'number' ? invoiceData.total : parseFloat(invoiceData.total) || 0;
  const totalAmount = (baseTotal + 2000).toLocaleString();
  
  const templateData: EmailTemplateData = {
    customerName: invoiceData.customerInfo.name || 'Valued Customer',
    invoiceNumber: invoiceData.invoiceNumber,
    invoiceDate: invoiceData.date,
    dueDate: invoiceData.dueDate,
    totalAmount: totalAmount,
    currency: invoiceData.currency || 'NGN',
    boothCount: invoiceData.items.length,
    sectors: [...new Set(invoiceData.items.map(item => item.location).filter(Boolean))].join(', '),
    companyName: 'Lagos International Trade Fair',
    companyEmail: 'info@lagoschamber.com',
    companyPhone: '+234 700 524 6724',
    companyAddress: '1, Idowu Taylor Street, Victoria Island, Lagos, Nigeria',
    companyWebsite: 'https://shop.lagosinternationaltradefair.com',
    paymentInstructions: `
      <p><strong>Payment Instructions:</strong></p>
      <ul>
        <li>Payment is due within 3 days of this invoice</li>
        <li>You can pay online through our secure payment portal</li>
        <li>For bank transfers, please include your invoice number as reference</li>
        <li>Contact us immediately if you have any payment issues</li>
      </ul>
    `
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice ${templateData.invoiceNumber} - Lagos International Trade Fair</title>
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
        .invoice-summary {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 14px;
        }
        .summary-row:last-child {
          margin-bottom: 0;
          border-top: 1px solid #e2e8f0;
          padding-top: 10px;
          font-weight: 600;
          font-size: 16px;
          color: #059669;
        }
        .booth-details {
          background-color: #eff6ff;
          border-left: 4px solid #3b82f6;
          padding: 15px;
          margin: 20px 0;
          border-radius: 0 8px 8px 0;
        }
        .booth-details h3 {
          margin: 0 0 10px 0;
          color: #1e40af;
          font-size: 16px;
        }
        .booth-list {
          margin: 0;
          padding-left: 20px;
        }
        .booth-list li {
          margin-bottom: 5px;
          font-size: 14px;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        .payment-section {
          background-color: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .payment-section h3 {
          margin: 0 0 15px 0;
          color: #92400e;
          font-size: 16px;
        }
        .payment-section ul {
          margin: 0;
          padding-left: 20px;
        }
        .payment-section li {
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
        @media only screen and (max-width: 600px) {
          body {
            padding: 10px;
          }
          .content {
            padding: 20px 15px;
          }
          .summary-row {
            flex-direction: column;
            gap: 5px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <img src="https://shop.lagosinternationaltradefair.com/media/litf_logo.png" alt="LITF Logo" class="logo" style="width: 120px; height: auto; margin-bottom: 15px; border-radius: 8px; background-color: white; padding: 10px;" onerror="this.style.display='none';">
          <h1>🏢 Lagos International Trade Fair</h1>
          <p>Your Booth Reservation Invoice</p>
        </div>
        
        <div class="content">
          <div class="greeting">
            Dear ${templateData.customerName},
          </div>
          
          <p>Thank you for your booth reservation for the Lagos International Trade Fair 2025. We're excited to have you as an exhibitor!</p>
          
          <p>Your reservation has been successfully processed and is now pending payment. Please find your invoice attached to this email.</p>
          
          <div class="invoice-summary">
            <div class="summary-row">
              <span>Invoice Number:</span>
              <span><strong>${templateData.invoiceNumber}</strong></span>
            </div>
            <div class="summary-row">
              <span>Invoice Date:</span>
              <span>${templateData.invoiceDate}</span>
            </div>
            <div class="summary-row">
              <span>Due Date:</span>
              <span>${templateData.dueDate}</span>
            </div>
            <div class="summary-row">
              <span>Number of Booths:</span>
              <span>${templateData.boothCount}</span>
            </div>
            <div class="summary-row">
              <span>Sectors:</span>
              <span>${templateData.sectors}</span>
            </div>
            <div class="summary-row" style="font-weight: bold;">
              <span>Total Amount:</span>
              <span>${templateData.currency} ${templateData.totalAmount}</span>
            </div>
          </div>
          
          <div class="booth-details">
            <h3>📋 Reservation Details</h3>
            <ul class="booth-list">
              ${invoiceData.items.map(item => `
                <li>
                  <strong>${item.location}</strong> - 
                  Booth Name(s): ${item.boothNames} | 
                  Total: ${invoiceData.currency}${item.total.toLocaleString()}
                </li>
              `).join('')}
            </ul>
          </div>
          
          <div class="payment-section">
            <h3>💳 Payment Information</h3>
            ${templateData.paymentInstructions}
            <p><strong>Important:</strong> Your reservation will be automatically cancelled if payment is not received within 3 days.</p>
          </div>
          
          <p>If you have any questions about your reservation or payment, please don't hesitate to contact our support team.</p>
          
          <p>We look forward to seeing you at the Lagos International Trade Fair 2025!</p>
          
          <p>Best regards,<br>
          <strong>The LITF Team</strong></p>
        </div>
        
        <div class="footer">
          <div class="company-info">
            <p><strong>${templateData.companyName}</strong></p>
            <p>${templateData.companyAddress}</p>
            <p>Phone: ${templateData.companyPhone}</p>
            <p>Email: ${templateData.companyEmail}</p>
          </div>
          <div class="social-links">
            <a href=${templateData.companyWebsite}>Website</a> |
            <a href="mailto:${templateData.companyEmail}">Contact Us</a> |
            <a href="tel:${templateData.companyPhone}">Call Us</a>
          </div>
          <p style="margin-top: 15px; font-size: 11px; color: #9ca3af;">
            This email was sent to you regarding your booth reservation for Lagos International Trade Fair 2025.
            If you have any questions, please contact our support team.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const generateInvoiceEmailText = (invoiceData: InvoiceData): string => {
  const customerName = invoiceData.customerInfo.name || 'Valued Customer';
  const baseTotal = typeof invoiceData.total === 'number' ? invoiceData.total : parseFloat(invoiceData.total) || 0;
  const totalAmount = (baseTotal + 2000).toLocaleString();
  const currency = invoiceData.currency || 'NGN';
  const boothCount = invoiceData.items.length;
  const sectors = [...new Set(invoiceData.items.map(item => item.location).filter(Boolean))].join(', ');

  return `
Dear ${customerName},

Thank you for your booth reservation for the Lagos International Trade Fair 2025. We're excited to have you as an exhibitor!

Your reservation has been successfully processed and is now pending payment. Please find your invoice attached to this email.

INVOICE SUMMARY:
- Invoice Number: ${invoiceData.invoiceNumber}
- Invoice Date: ${invoiceData.date}
- Due Date: ${invoiceData.dueDate}
- Number of Booths: ${boothCount}
- Sectors: ${sectors}
- Total Amount: ${currency} ${totalAmount}

RESERVATION DETAILS:
${invoiceData.items.map(item => `- ${item.location} - Booth Name(s): ${item.boothNames} | Total: ${currency}${item.total.toLocaleString()}`).join('\n')}

PAYMENT INFORMATION:
- Payment is due within 3 days of this invoice
- You can pay online through our secure payment portal
- For bank transfers, please include your invoice number as reference
- Contact us immediately if you have any payment issues

IMPORTANT: Your reservation will be automatically cancelled if payment is not received within 3 days.

If you have any questions about your reservation or payment, please don't hesitate to contact our support team.

We look forward to seeing you at the Lagos International Trade Fair 2025!

Best regards,
The LITF Team

---
Lagos International Trade Fair
Lagos International Trade Fair Complex, Lagos, Nigeria
Phone: +234 123 456 7890
Email: info@lagostradefair.com
Website: www.lagostradefair.com
  `;
}; 