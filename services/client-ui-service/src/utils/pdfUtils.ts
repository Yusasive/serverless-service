/**
 * Print element with full styling and Tailwind CSS support
 */
export const printElementWithStyles = (
  element: HTMLElement,
  title: string = 'Document',
  options: {
    customStyles?: string;
  } = {}
): void => {
  const {
    customStyles = ''
  } = options;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    console.error('Failed to open print window');
    return;
  }

  // Get all the computed styles from the current page
  const styles = Array.from(document.styleSheets)
    .map(styleSheet => {
      try {
        return Array.from(styleSheet.cssRules)
          .map(rule => rule.cssText)
          .join('\n');
      } catch (e) {
        return '';
      }
    })
    .join('\n');

  // Get the element content HTML
  const content = element.outerHTML;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <meta charset="utf-8">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          ${styles}
          ${customStyles}
          @media print {
            body { 
              margin: 0; 
              padding: 20px;
              background: white;
            }
            .print-container {
              max-width: 400px;
              margin: 0 auto;
              background: white;
              border-radius: 8px;
              box-shadow: none;
            }
            * { 
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: white;
            margin: 0;
            padding: 20px;
          }
          .print-container {
            max-width: 400px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          img {
            max-width: 100%;
            height: auto;
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          ${content}
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();

  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    }, 500);
  };
};

/**
 * Generate and download PDF from element with CORS handling
 */
export const generatePDFFromElement = async (
  element: HTMLElement,
  filename: string,
  options: {
    onLoadingChange?: (loading: boolean) => void;
    onError?: (error: string) => void;
    showCorsMessage?: boolean;
  } = {}
): Promise<void> => {
  const {
    onLoadingChange,
    onError,
    showCorsMessage = true
  } = options;

  if (!element) return;

  // Show loading state
  onLoadingChange?.(true);

  try {
    // Create a temporary container for PDF generation
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '400px';
    tempContainer.style.background = 'white';
    tempContainer.style.padding = '20px';
    tempContainer.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    
    // Clone the element content
    const clonedContent = element.cloneNode(true) as HTMLElement;
    
    // Remove any no-print elements from the clone
    const noPrintElements = clonedContent.querySelectorAll('.no-print');
    noPrintElements.forEach(el => el.remove());

    // Handle CORS issues with images by replacing them with placeholders if needed
    const images = clonedContent.querySelectorAll('img');
    images.forEach((img) => {
      const originalSrc = img.src;
      img.onerror = (_event) => {
        console.warn(`Image failed to load due to CORS: ${originalSrc}`);
        // Replace with a placeholder or remove the image
        if (img.alt === 'Profile') {
          img.src = 'https://via.placeholder.com/80x100?text=Photo';
        } else if (img.alt === 'LITF Logo') {
          img.src = 'https://via.placeholder.com/120x48?text=LITF+Logo';
        }
      };
      // Add a timeout to handle images that don't load
      setTimeout(() => {
        if (img.complete === false) {
          img.onerror?.(new Event('error'));
        }
      }, 3000);
    });
    
    // Add the cloned content to temp container
    tempContainer.appendChild(clonedContent);
    document.body.appendChild(tempContainer);

    // Import html2canvas and jsPDF dynamically
    const [html2canvas, jsPDF] = await Promise.all([
      import('html2canvas'),
      import('jspdf')
    ]);

    // Convert to canvas with CORS handling
    const canvas = await html2canvas.default(tempContainer, {
      scale: 2,
      useCORS: true,
      allowTaint: true, // Allow tainted canvas for CORS issues
      backgroundColor: '#ffffff',
      width: 400,
      height: tempContainer.scrollHeight,
      logging: false,
      onclone: (clonedDoc) => {
        // Additional handling for cloned document
        const clonedImages = clonedDoc.querySelectorAll('img');
        clonedImages.forEach(img => {
          img.crossOrigin = 'anonymous';
        });
      }
    });

    // Generate PDF
    const pdf = new jsPDF.default({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width / 2, canvas.height / 2]
    });

    // Add the canvas image to PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);

    // Download the PDF
    pdf.save(filename);

    // Clean up
    document.body.removeChild(tempContainer);

  } catch (error) {
    console.error('Error generating PDF:', error);
    
    // Check if it's a CORS error
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('CORS') || errorMessage.includes('tainted')) {
      console.log('CORS error detected, falling back to print method...');
      
      if (showCorsMessage) {
        // Show a brief message to the user
        const message = document.createElement('div');
        message.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #fbbf24;
          color: #92400e;
          padding: 12px 16px;
          border-radius: 8px;
          z-index: 9999;
          font-size: 14px;
          max-width: 300px;
        `;
        message.textContent = 'CORS issue detected. Using print method instead. This won\'t happen in production.';
        document.body.appendChild(message);
        setTimeout(() => document.body.removeChild(message), 5000);
      }
      
      // Fallback to print method if PDF generation fails
      printElementWithStyles(element, filename.replace('.pdf', ''));
    } else {
      onError?.(errorMessage);
    }
  } finally {
    // Hide loading state
    onLoadingChange?.(false);
  }
}; 