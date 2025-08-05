import { CommunicationController } from '@/controllers/CommunicationController';
import { InvoiceData, generateInvoicePDFAttachment } from './invoiceUtils';
import { generateInvoiceEmailHTML } from '../templates/invoiceEmailTemplate';
import { preloadLogo, getDefaultLogoPath } from './logoUtils';

export interface InvoiceEmailOptions {
  logo?: string;
}

/**
 * Send invoice email with PDF attachment
 */
export const sendInvoiceEmail = async (
  invoiceData: InvoiceData,
  recipientEmail: string,
  options: InvoiceEmailOptions = {}
): Promise<boolean> => {
  try {
    // Validate email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      throw new Error(`Invalid email address: ${recipientEmail}`);
    }

    // Generate email content
    const htmlBody = generateInvoiceEmailHTML(invoiceData);
    
    // Load logo as base64 (same approach as InvoiceModal)
    let logoBase64: string | null = null;
    
    // Always try to load a logo, starting with the provided one or default
    const logoToLoad = options.logo || getDefaultLogoPath();
    
    try {
      logoBase64 = await preloadLogo(logoToLoad);
    } catch (error) {
      // Try default logo as fallback
      try {
        logoBase64 = await preloadLogo(getDefaultLogoPath());
        console.log('Default logo loaded as fallback, base64 length:', logoBase64?.length);
      } catch (fallbackError) {
        console.warn('Failed to load default logo as well:', fallbackError);
        logoBase64 = null;
      }
    }
    
    // Generate PDF attachment with logo
    const pdfAttachment = generateInvoicePDFAttachment(invoiceData, {
      logo: logoBase64 || undefined
    });

    let ccEmails: string[] = import.meta.env.VITE_INVOICE_CC_EMAILS?.split(',') || [];

    console.log('ccEmails', ccEmails);
    
    // Prepare email request
    const emailRequest = {
      to: [recipientEmail, ...ccEmails],
      // cc: ccEmails,
      subject: `Invoice ${invoiceData.invoiceNumber} - Lagos International Trade Fair 2025`,
      htmlBody,
      attachments: [pdfAttachment],
      replyTo: ['info@lagoschamber.com']
    };
    
    // Send email
    const response = await CommunicationController.getInstance().sendEmail(emailRequest);
    console.log('Invoice email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Failed to send invoice email:', error);
    throw error;
  }
};

/**
 * Send invoice email to multiple recipients
 */
export const sendInvoiceEmailToMultiple = async (
  invoiceData: InvoiceData,
  recipientEmails: string[],
  options: InvoiceEmailOptions = {}
): Promise<{ success: boolean; sentTo: string[]; failedTo: string[]; errors: string[] }> => {
  const results = {
    success: false,
    sentTo: [] as string[],
    failedTo: [] as string[],
    errors: [] as string[]
  };
  
  try {
    // Generate email content once
    const htmlBody = generateInvoiceEmailHTML(invoiceData);
    
    // Generate PDF attachment once
    const pdfAttachment = generateInvoicePDFAttachment(invoiceData, {
      logo: options.logo
    });
    
    // Send to each recipient
    for (const email of recipientEmails) {
      try {
        const emailRequest = {
          to: [email],
          subject: `Invoice ${invoiceData.invoiceNumber} - Lagos International Trade Fair 2025`,
          htmlBody,
          attachments: [pdfAttachment],
          replyTo: ['info@lagoschamber.com']
        };
        
        await CommunicationController.getInstance().sendEmail(emailRequest);
        results.sentTo.push(email);
      } catch (error) {
        results.failedTo.push(email);
        results.errors.push(`Failed to send to ${email}: ${error}`);
      }
    }
    
    results.success = results.sentTo.length > 0;
    return results;
  } catch (error) {
    console.error('Failed to send invoice emails:', error);
    results.errors.push(`General error: ${error}`);
    return results;
  }
};

/**
 * Send invoice email with retry logic
 */
export const sendInvoiceEmailWithRetry = async (
  invoiceData: InvoiceData,
  recipientEmail: string,
  options: InvoiceEmailOptions = {},
  maxRetries: number = 3
): Promise<boolean> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await sendInvoiceEmail(invoiceData, recipientEmail, options);
    } catch (error) {
      lastError = error;
      console.warn(`Invoice email attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  console.error(`Failed to send invoice email after ${maxRetries} attempts:`, lastError);
  throw lastError;
}; 