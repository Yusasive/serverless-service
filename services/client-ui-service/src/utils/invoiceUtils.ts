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
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  paymentMethod: string;
  reservationIds: string[];
  boothBreakdown?: any[];
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  size?: string;
  sector?: string;
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
        const labelFontSize = 10;
        const labelOffset = 0;
        const valueOffset = 45;
        const lineHeight = 7;
        doc.setFontSize(labelFontSize);
        doc.setFont('helvetica', 'bold');
        doc.text('Invoice Number:', invoiceDetailsX - valueOffset, invoiceDetailsY + labelOffset, { align: 'right' });
        doc.text('Date:', invoiceDetailsX - valueOffset, invoiceDetailsY + labelOffset + lineHeight, { align: 'right' });
        doc.text('Due Date:', invoiceDetailsX - valueOffset, invoiceDetailsY + labelOffset + 2 * lineHeight, { align: 'right' });
        doc.text('Payment Method:', invoiceDetailsX - valueOffset, invoiceDetailsY + labelOffset + 3 * lineHeight, { align: 'right' });
        doc.setFont('helvetica', 'normal');
        doc.text(data.invoiceNumber, invoiceDetailsX, invoiceDetailsY + labelOffset, { align: 'right' });
        doc.text(data.date, invoiceDetailsX, invoiceDetailsY + labelOffset + lineHeight, { align: 'right' });
        doc.text(data.dueDate, invoiceDetailsX, invoiceDetailsY + labelOffset + 2 * lineHeight, { align: 'right' });
        doc.text(data.paymentMethod, invoiceDetailsX, invoiceDetailsY + labelOffset + 3 * lineHeight, { align: 'right' });
        
        // Company Info under the logo (left side)
        const companyInfoX = margin;
        const companyInfoY = yPosition + logoHeight + 5;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(defaultOptions.companyInfo!.name, companyInfoX, companyInfoY);
        doc.setFont('helvetica', 'normal');
        doc.text(defaultOptions.companyInfo!.address, companyInfoX, companyInfoY + 6);
        doc.text(defaultOptions.companyInfo!.address2, companyInfoX, companyInfoY + 12);
        doc.text(`Phone: ${defaultOptions.companyInfo!.phone}`, companyInfoX, companyInfoY + 18);
        doc.text(`Email: ${defaultOptions.companyInfo!.email}`, companyInfoX, companyInfoY + 24);
        doc.text(`Website: ${defaultOptions.companyInfo!.website}`, companyInfoX, companyInfoY + 30);
        // Add extra space before Bill To
        yPosition = companyInfoY + 50; // 20px extra after last line
      } else {
        // Logo is a URL, skip for now to avoid async issues
        addCompanyInfoWithoutLogo();
      }
    } catch (error) {
      console.warn('Failed to add logo to PDF:', error);
      addCompanyInfoWithoutLogo();
    }
  } else {
    addCompanyInfoWithoutLogo();
  }

  // Helper function for company info without logo
  function addCompanyInfoWithoutLogo() {
    // Company Info (Left) and Invoice Info (Right)
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(defaultOptions.companyInfo!.name, margin, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(defaultOptions.companyInfo!.address, margin, yPosition + 6);
    doc.text(defaultOptions.companyInfo!.address2, margin, yPosition + 12);
    doc.text(`Phone: ${defaultOptions.companyInfo!.phone}`, margin, yPosition + 18);
    doc.text(`Email: ${defaultOptions.companyInfo!.email}`, margin, yPosition + 24);
    doc.text(`Website: ${defaultOptions.companyInfo!.website}`, margin, yPosition + 30);
    // Invoice details on the right (same level as company info), right-aligned
    const invoiceDetailsX = pageWidth - margin - 2;
    const invoiceDetailsY = yPosition;
    const labelFontSize = 10;
    const labelOffset = 0;
    const valueOffset = 45;
    const lineHeight = 7;
    doc.setFontSize(labelFontSize);
    doc.setFont('helvetica', 'bold');
    doc.text('Invoice Number:', invoiceDetailsX - valueOffset, invoiceDetailsY + labelOffset, { align: 'right' });
    doc.text('Date:', invoiceDetailsX - valueOffset, invoiceDetailsY + labelOffset + lineHeight, { align: 'right' });
    doc.text('Due Date:', invoiceDetailsX - valueOffset, invoiceDetailsY + labelOffset + 2 * lineHeight, { align: 'right' });
    doc.text('Payment Method:', invoiceDetailsX - valueOffset, invoiceDetailsY + labelOffset + 3 * lineHeight, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.text(data.invoiceNumber, invoiceDetailsX, invoiceDetailsY + labelOffset, { align: 'right' });
    doc.text(data.date, invoiceDetailsX, invoiceDetailsY + labelOffset + lineHeight, { align: 'right' });
    doc.text(data.dueDate, invoiceDetailsX, invoiceDetailsY + labelOffset + 2 * lineHeight, { align: 'right' });
    doc.text(data.paymentMethod, invoiceDetailsX, invoiceDetailsY + labelOffset + 3 * lineHeight, { align: 'right' });
    // Add extra space before Bill To
    yPosition += 50;
  }

  // Bill To
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', margin, yPosition);
  doc.setFont('helvetica', 'normal');
  const customer = data.customerInfo || {};
  let billToLines = [];
  if (customer.name) billToLines.push(customer.name);
  if (customer.company) billToLines.push(customer.company);
  if (customer.email) billToLines.push(customer.email);
  if (customer.phone) billToLines.push(customer.phone);
  if (customer.address) billToLines.push(customer.address);
  if (customer.city || customer.state || customer.postalCode)
    billToLines.push(`${customer.city || ''}${customer.city && customer.state ? ', ' : ''}${customer.state || ''} ${customer.postalCode || ''}`.trim());
  if (customer.country) billToLines.push(customer.country);
  if (billToLines.length === 0) billToLines.push('-');
  doc.setFontSize(10);
  doc.text(billToLines, margin, yPosition + 8);

  yPosition += 28 + (billToLines.length - 1) * 6;

  // Items Table (Booth Summary)
  const useBoothBreakdown = Array.isArray(data.boothBreakdown) && data.boothBreakdown.length > 0;
  const tableHeaders = ['Location', 'Booth Name', 'Total Area', 'Package Price'];
  const columnWidths = [45, 80, 25, 40]; // Increased booth name width from 60 to 80
  let currentX = margin;

  // Draw table headers
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  tableHeaders.forEach((header, index) => {
    doc.text(header, currentX, yPosition);
    currentX += columnWidths[index];
  });

  // Draw table lines
  yPosition += 2;
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  if (useBoothBreakdown) {
    (data.boothBreakdown || []).forEach((group: any) => {
      currentX = margin;
      // Defensive: fallback values with proper type conversion
      const location = group.location || '-';
      const boothNames = Array.isArray(group.boothIds) ? group.boothIds.join(', ') : '-';
      
      // Convert totalSqm to number and handle string values
      const totalSqmNum = typeof group.totalSqm === 'number' ? group.totalSqm : 
                         typeof group.totalSqm === 'string' ? parseFloat(group.totalSqm) || 0 : 0;
      const totalArea = totalSqmNum > 0 ? `${totalSqmNum}m²` : '-';
      
      // Convert packagePrice to number and handle string values
      const packagePriceNum = typeof group.packagePrice === 'number' ? group.packagePrice :
                             typeof group.packagePrice === 'string' ? parseFloat(group.packagePrice) || 0 : 0;
      const packagePrice = packagePriceNum > 0 ? `${currency}${packagePriceNum.toLocaleString()}` : '-';

      // Check if we need a new page
      if (yPosition > doc.internal.pageSize.height - 60) {
        doc.addPage();
        yPosition = 20;
      }

      // Calculate the maximum height needed for this row
      const locationLines = doc.splitTextToSize(location, columnWidths[0] - 2); // -2 for padding
      const boothNamesLines = doc.splitTextToSize(boothNames, columnWidths[1] - 2); // -2 for padding
      const maxLines = Math.max(1, locationLines.length, boothNamesLines.length);
      const rowHeight = maxLines * 6; // 6 points per line

      // Handle location with text wrapping
      doc.text(locationLines, currentX, yPosition);
      currentX += columnWidths[0];
      
      // Handle booth names with text wrapping
      doc.text(boothNamesLines, currentX, yPosition);
      currentX += columnWidths[1];
      
      doc.text(totalArea, currentX, yPosition);
      currentX += columnWidths[2];
      doc.text(packagePrice, currentX, yPosition, { align: 'left' });
      
      // Move to next row based on the tallest cell
      yPosition += rowHeight + 2; // +2 for spacing between rows
    });
  } else {
    // Fallback to items if boothBreakdown is not present
    (data.items || []).forEach((item) => {
      currentX = margin;
      const desc = item.description || '-';
      const size = item.size || '-';
      const sector = item.sector || '-';
      const unitPrice = typeof item.unitPrice === 'number' ? item.unitPrice : 0;
      const total = typeof item.total === 'number' ? item.total : 0;
      
      if (yPosition > doc.internal.pageSize.height - 60) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Calculate the maximum height needed for this row
      const descLines = doc.splitTextToSize(desc, columnWidths[0] - 2);
      const sizeLines = doc.splitTextToSize(size, columnWidths[1] - 2);
      const maxLines = Math.max(1, descLines.length, sizeLines.length);
      const rowHeight = maxLines * 6; // 6 points per line
      
      doc.text(descLines, currentX, yPosition);
      currentX += columnWidths[0];
      doc.text(sizeLines, currentX, yPosition);
      currentX += columnWidths[1];
      doc.text(sector, currentX, yPosition);
      currentX += columnWidths[2];
      doc.text(`${currency}${unitPrice.toLocaleString()}`, currentX, yPosition);
      currentX += columnWidths[3];
      doc.text(`${currency}${total.toLocaleString()}`, currentX, yPosition);
      
      // Move to next row based on the tallest cell
      yPosition += rowHeight + 2; // +2 for spacing between rows
    });
  }

  // Draw bottom line
  yPosition += 2;
  doc.line(margin, yPosition, pageWidth - margin, yPosition);

  // Totals
  yPosition += 15;
  const totalsX = pageWidth - margin - 80;
  doc.setFont('helvetica', 'normal');
  
  // Ensure subtotal and total are numbers
  const subtotalNum = typeof data.subtotal === 'number' ? data.subtotal :
                     typeof data.subtotal === 'string' ? parseFloat(data.subtotal) || 0 : 0;
  const totalNum = typeof data.total === 'number' ? data.total :
                  typeof data.total === 'string' ? parseFloat(data.total) || 0 : 0;
  const taxNum = typeof data.tax === 'number' ? data.tax :
                typeof data.tax === 'string' ? parseFloat(data.tax) || 0 : 0;
  
  doc.text('Subtotal:', totalsX, yPosition);
  doc.text(`${currency}${subtotalNum.toLocaleString()}`, pageWidth - margin, yPosition, { align: 'right' });
  yPosition += 8;
  if (taxNum > 0) {
    doc.text('Tax: (Inclusive)', totalsX, yPosition);
    doc.text('-', pageWidth - margin, yPosition, { align: 'right' });
    yPosition += 8;
  }
  doc.text('Discount:', totalsX, yPosition);
  doc.text('0%', pageWidth - margin, yPosition, { align: 'right' });
  yPosition += 8;
  doc.text('Payment Charges:', totalsX, yPosition);
  doc.text(`${currency}2,000`, pageWidth - margin, yPosition, { align: 'right' });
  yPosition += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('Total:', totalsX, yPosition);
  doc.text(`${currency}${(totalNum + 2000).toLocaleString()}`, pageWidth - margin, yPosition, { align: 'right' });

  // Footer
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
 * Note: This function is deprecated. Use the print functionality directly in the InvoiceModal component
 * for better browser compatibility.
 */
export const printInvoicePDF = (
  data: InvoiceData,
  options: InvoiceOptions = {}
): void => {
  console.warn('printInvoicePDF is deprecated. Use the print functionality in InvoiceModal component instead.');
  const doc = generateInvoicePDF(data, options);
  const pdfDataUrl = doc.output('dataurlstring');
  
  // Fallback implementation
  const newWindow = window.open(pdfDataUrl, '_blank');
  if (newWindow) {
    setTimeout(() => {
      try {
        newWindow.print();
      } catch (printError) {
        console.error('Print failed:', printError);
      }
    }, 1000);
  }
};

/**
 * Generate invoice PDF as base64 string for email attachment
 */
export const generateInvoicePDFAsBase64 = (
  data: InvoiceData,
  options: InvoiceOptions = {}
): string => {
  const doc = generateInvoicePDF(data, options);
  return doc.output('datauristring').split(',')[1]; // Remove data:application/pdf;base64, prefix
};

/**
 * Generate invoice PDF as base64 with filename for email attachment
 */
export const generateInvoicePDFAttachment = (
  data: InvoiceData,
  options: InvoiceOptions = {}
): { filename: string; content: string; contentType: string } => {
  const filename = options.filename || `invoice_${data.invoiceNumber}.pdf`;
  const base64Content = generateInvoicePDFAsBase64(data, options);
  
  return {
    filename,
    content: base64Content,
    contentType: 'application/pdf'
  };
};

/**
 * Generate a unique invoice number
 */
export const generateInvoiceNumber = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `INV-${timestamp}-${random}`;
};

/**
 * Format date for invoice
 */
export const formatInvoiceDate = (date: Date = new Date()): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Calculate due date (30 days from invoice date)
 */
export const calculateDueDate = (invoiceDate: Date = new Date()): string => {
  const dueDate = new Date(invoiceDate);
  dueDate.setDate(dueDate.getDate() + 3);
  return formatInvoiceDate(dueDate);
}; 