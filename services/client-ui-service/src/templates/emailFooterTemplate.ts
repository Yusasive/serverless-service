export interface EmailFooterData {
  companyWebsite: string;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  supportEmail: string;
}

export const generateEmailFooter = (data: EmailFooterData) => `
  <div class="footer" style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb;">
    <div class="company-info">
      <p><strong>${data.companyName}</strong></p>
      <p>${data.companyAddress}</p>
      <p>Phone: ${data.companyPhone}</p>
      <p>Email: ${data.companyEmail}</p>
    </div>
    <div class="social-links">
      <a href="${data.companyWebsite}">Website</a> |
      <a href="mailto:${data.supportEmail}">Support</a> |
      <a href="tel:${data.companyPhone}">Call Us</a>
    </div>
    <p style="margin-top: 15px; font-size: 11px; color: #9ca3af;">
      This email was sent by ${data.companyName}.
    </p>
  </div>
`;
