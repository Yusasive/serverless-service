export interface EmailHeaderData {
  tagline?: string;
}

export const generateEmailHeader = (data: EmailHeaderData) => `
  <div class="header" style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px 20px; text-align: center;">
    <img src="https://shop.lagosinternationaltradefair.com/media/litf_logo.png" alt="LITF Logo" class="logo" style="width: 120px; height: auto; margin-bottom: 15px; border-radius: 8px; background-color: white; padding: 10px;" onerror="this.style.display='none';">
    <h1>Lagos International Trade Fair</h1>
    ${data.tagline ? `<p>${data.tagline}</p>` : ""}
  </div>
`;
