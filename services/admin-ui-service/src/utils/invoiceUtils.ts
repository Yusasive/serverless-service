import jsPDF from 'jspdf';

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customerInfo: {
    name: string;
    company: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: InvoiceItem[];
  total: number;
  currency: string;
  paymentMethod: string;
  reservationIds: string[];
}

export interface InvoiceItem {
  location: string;
  boothNames: string;
  total: number;
  totalArea: number;
}

export interface InvoiceOptions {
  title?: string;
  filename?: string;
  logo?: string;
  companyInfo?: {
    name: string;
    address: string;
    address2: string;
    phone: string;
    email: string;
    website: string;
  };
}

/**
 * Generate invoice PDF
 */
export const generateInvoicePDF = (
  data: InvoiceData,
  options: InvoiceOptions = {}
): jsPDF => {
  const defaultOptions: InvoiceOptions = {
    title: 'INVOICE',
    filename: `invoice_${data.invoiceNumber}.pdf`,
    companyInfo: {
      name: 'Lagos International Trade Fair',
      address: '1, Idowu Taylor Street, Victoria Island,',
      address2: 'Lagos, Nigeria',
      phone: '+234 700 524 6724',
      email: 'info@lagoschamber.com',
      website: 'www.lagoschamber.com'
    },
    ...options
  };

  // Use 'NGN' as currency for compatibility
  const currency = data.currency && data.currency.length < 4 ? data.currency : 'NGN ';

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let yPosition = 20;

  // Header - use a two-column layout
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(defaultOptions.title!, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 12;

  if (defaultOptions.logo) {
    try { 
      // Check if logo is base64 data (starts with data:)
      if (defaultOptions.logo.startsWith('data:')) {
        // Logo is already base64, add it directly
        const logoWidth = 30;
        const logoHeight = 30;
        const logoX = margin;
        const logoY = yPosition - 5;
        
        doc.addImage(defaultOptions.logo, 'PNG', logoX, logoY, logoWidth, logoHeight);
        
        // Invoice details on the right (same level as logo), right-aligned
        const invoiceDetailsX = pageWidth - margin - 2; // Near right edge
        const invoiceDetailsY = yPosition - 2;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Invoice #: ${data.invoiceNumber}`, invoiceDetailsX, invoiceDetailsY, { align: 'right' });
        doc.text(`Date: ${data.date}`, invoiceDetailsX, invoiceDetailsY + 5, { align: 'right' });
        doc.text(`Due Date: ${data.dueDate}`, invoiceDetailsX, invoiceDetailsY + 10, { align: 'right' });
        
        yPosition += 35; // Move down to account for logo
      } else {
        // Logo is a URL, skip for now (would need to fetch it)
        addCompanyInfoWithoutLogo();
      }
    } catch (error) {
      console.warn('Failed to add logo to PDF:', error);
      addCompanyInfoWithoutLogo();
    }
  } else {
    addCompanyInfoWithoutLogo();
  }

  function addCompanyInfoWithoutLogo() {
    // Company info on the left
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(defaultOptions.companyInfo!.name, margin, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(defaultOptions.companyInfo!.address, margin, yPosition + 5);
    doc.text(defaultOptions.companyInfo!.address2, margin, yPosition + 10);
    doc.text(`Phone: ${defaultOptions.companyInfo!.phone}`, margin, yPosition + 15);
    doc.text(`Email: ${defaultOptions.companyInfo!.email}`, margin, yPosition + 20);
    doc.text(`Website: ${defaultOptions.companyInfo!.website}`, margin, yPosition + 25);
    
    // Invoice details on the right, right-aligned
    const invoiceDetailsX = pageWidth - margin - 2;
    const invoiceDetailsY = yPosition;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice #: ${data.invoiceNumber}`, invoiceDetailsX, invoiceDetailsY, { align: 'right' });
    doc.text(`Date: ${data.date}`, invoiceDetailsX, invoiceDetailsY + 5, { align: 'right' });
    doc.text(`Due Date: ${data.dueDate}`, invoiceDetailsX, invoiceDetailsY + 10, { align: 'right' });
    
    yPosition += 40; // Move down to account for company info
  }

  // Customer info section
  yPosition += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', margin, yPosition);
  yPosition += 5;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(data.customerInfo.name, margin, yPosition);
  if (data.customerInfo.company) {
    yPosition += 5;
    doc.text(data.customerInfo.company, margin, yPosition);
  }
  yPosition += 5;
  doc.text(data.customerInfo.address, margin, yPosition);
  yPosition += 5;
  doc.text(`${data.customerInfo.city}, ${data.customerInfo.state} ${data.customerInfo.postalCode}`, margin, yPosition);
  yPosition += 5;
  doc.text(data.customerInfo.country, margin, yPosition);
  yPosition += 5;
  doc.text(`Phone: ${data.customerInfo.phone}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Email: ${data.customerInfo.email}`, margin, yPosition);

  // Items table
  yPosition += 15;
  // const tableStartY = yPosition;
  
  // Table header
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Location', margin, yPosition);
  doc.text('Booth Names', margin + 50, yPosition);
  doc.text('Total Area (sqm)', margin + 110, yPosition);
  doc.text('Total', margin + 160, yPosition);
  
  yPosition += 5;
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 5;

  // Table rows
  doc.setFont('helvetica', 'normal');
  data.items.forEach((item, _) => {
    if (yPosition > doc.internal.pageSize.height - 60) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(item.location, margin, yPosition);
    doc.text(item.boothNames, margin + 50, yPosition);
    doc.text(`${item.totalArea}m²`, margin + 110, yPosition);
    doc.text(`${currency}${item.total.toLocaleString()}`, margin + 160, yPosition);
    yPosition += 8;
  });

  // Totals
  yPosition += 5;
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 5;
  
  doc.setFont('helvetica', 'normal');
  yPosition += 8;
  doc.setFontSize(10);
  doc.text('Payment Charges:', margin + 50, yPosition);
  doc.text(`${currency}2,000`, margin + 150, yPosition);
  yPosition += 8;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Total:', margin + 110, yPosition);
  doc.text(`${currency}${(data.total + 2000).toLocaleString()}`, margin + 150, yPosition);

  yPosition += 30;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Thank you for your business!', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 6;
  doc.text('For any questions, please contact us at support@lagostradefair.com', pageWidth / 2, yPosition, { align: 'center' });
  
  

  return doc;
};

/**
 * Download invoice PDF
 */
export const downloadInvoicePDF = (
  data: InvoiceData,
  options: InvoiceOptions = {}
): void => {
  const doc = generateInvoicePDF(data, options);
  const filename = options.filename || `invoice_${data.invoiceNumber}.pdf`;
  doc.save(filename);
};

/**
 * Print invoice PDF
 */
export const printInvoicePDF = (
  data: InvoiceData,
  options: InvoiceOptions = {}
): void => {
  const doc = generateInvoicePDF(data, options);
  doc.autoPrint();
  doc.output('dataurlnewwindow');
};

/**
 * Generate invoice PDF as base64 string
 */
export const generateInvoicePDFAsBase64 = (
  data: InvoiceData,
  options: InvoiceOptions = {}
): string => {
  const doc = generateInvoicePDF(data, options);
  return doc.output('datauristring');
};

/**
 * Generate invoice PDF attachment for email
 */
export const generateInvoicePDFAttachment = (
  data: InvoiceData,
  options: InvoiceOptions = {}
): { filename: string; content: string; contentType: string } => {
  const doc = generateInvoicePDF(data, options);
  const filename = options.filename || `invoice_${data.invoiceNumber}.pdf`;
  const base64 = doc.output('datauristring').split(',')[1]; // Remove data:application/pdf;base64, prefix
  
  return {
    filename,
    content: base64,
    contentType: 'application/pdf'
  };
};

/**
 * Generate invoice number
 */
export const generateInvoiceNumber = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `INV-${timestamp}-${random}`;
};

/**
 * Format invoice date
 */
export const formatInvoiceDate = (date: Date = new Date()): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Calculate due date (3 days from invoice date)
 */
export const calculateDueDate = (invoiceDate: Date = new Date()): string => {
  const dueDate = new Date(invoiceDate);
  dueDate.setDate(dueDate.getDate() + 3);
  return formatInvoiceDate(dueDate);
}; 