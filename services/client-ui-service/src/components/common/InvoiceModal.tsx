import React, { useState, useEffect } from 'react';
import { X, Download, Printer } from 'lucide-react';
import { 
  InvoiceData, 
  downloadInvoicePDF, 
  generateInvoicePDF 
} from '../../utils/invoiceUtils';
import { preloadLogo, getDefaultLogoPath } from '../../utils/logoUtils';
import { Z_INDEX } from '../../utils/zIndexManager';

interface InvoiceModalProps {
  show: boolean;
  onClose: () => void;
  invoiceData: InvoiceData;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ show, onClose, invoiceData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);

  // Preload logo when component mounts
  useEffect(() => {
    const loadLogo = async () => {
      const logoPath = getDefaultLogoPath();
      const base64Data = await preloadLogo(logoPath);
      setLogoBase64(base64Data);
    };
    
    loadLogo();
  }, []);

  if (!show) return null;

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      downloadInvoicePDF(invoiceData, { logo: logoBase64 || undefined });
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Error generating invoice. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = async () => {
    setIsGenerating(true);
    try {
      const doc = generateInvoicePDF(invoiceData, { logo: logoBase64 || undefined });
      const pdfBlob = new Blob([doc.output('blob')], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(pdfBlob);

      // Open the PDF directly in a new tab/window
      const newWindow = window.open(blobUrl, '_blank');
      if (!newWindow) {
        alert('Please allow popups for this site to print the invoice. You can also use the Download PDF button to save and print the invoice.');
      }
      // Optionally, you can auto-trigger print after a delay, but most browsers block this for blob URLs.
      setTimeout(() => { newWindow?.print(); }, 1000);
    } catch (error) {
      console.error('Error printing invoice:', error);
      alert('Error generating invoice for printing. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 overflow-y-auto" style={{ zIndex: Z_INDEX.invoiceModal.backdrop }}>
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          style={{ zIndex: Z_INDEX.invoiceModal.backdrop }}
          onClick={onClose}
        />

        {/* Modal content */}
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg relative" style={{ zIndex: Z_INDEX.invoiceModal.content }}>
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Invoice</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Invoice Content */}
          <div className="p-6">
            {/* Invoice Header */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <img 
                    src="/images/litf_logo.png" 
                    alt="LITF Logo" 
                    className="w-25 h-16 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">INVOICE</h1>
                  <div className="text-sm text-gray-600">
                    <p>1, Idowu Taylor Street, Victoria Island,</p>
                    <p>Lagos, Nigeria</p>
                    <p>Phone: +234 700 524 6724</p>
                    <p>Email: info@lagoschamber.com</p>
                    <p>Website: www.lagoschamber.com</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-semibold">Invoice Number:</span> {invoiceData.invoiceNumber}</p>
                  <p><span className="font-semibold">Date:</span> {invoiceData.date}</p>
                  <p><span className="font-semibold">Due Date:</span> {invoiceData.dueDate}</p>
                  <p><span className="font-semibold">Payment Method:</span> {invoiceData.paymentMethod}</p>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill To:</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{invoiceData.customerInfo.name}</p>
                {invoiceData.customerInfo.company && (
                  <p className="text-gray-600">{invoiceData.customerInfo.company}</p>
                )}
                <p className="text-gray-600">{invoiceData.customerInfo.email}</p>
                <p className="text-gray-600">{invoiceData.customerInfo.phone}</p>
                <p className="text-gray-600">{invoiceData.customerInfo.address}</p>
                {/* <p className="text-gray-600">
                  {invoiceData.customerInfo.city}, {invoiceData.customerInfo.state} {invoiceData.customerInfo.postalCode}
                </p>
                <p className="text-gray-600">{invoiceData.customerInfo.country}</p> */}
              </div>
            </div>

            {/* Items Table (Booth Summary) */}
            <div className="mb-8">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Location</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Booth Name</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Total Area</th>
                      <th className="border border-gray-300 px-4 py-2 text-right font-semibold">Package Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(invoiceData.boothBreakdown || []).map((group: any, idx: number) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">
                          <div className="break-words max-w-xs">
                            {group.location}
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <div className="flex flex-wrap gap-1">
                            {group.boothIds.map((id: string) => (
                              <span key={id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{id}</span>
                            ))}
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {typeof group.totalSqm === 'number' ? `${group.totalSqm}m²` : 
                           typeof group.totalSqm === 'string' ? `${parseFloat(group.totalSqm) || 0}m²` : '0m²'}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          {invoiceData.currency}
                          {typeof group.packagePrice === 'number' ? group.packagePrice.toLocaleString() :
                           typeof group.packagePrice === 'string' ? (parseFloat(group.packagePrice) || 0).toLocaleString() : '0'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-64">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>{invoiceData.currency}
                      {typeof invoiceData.subtotal === 'number' ? invoiceData.subtotal.toLocaleString() :
                       typeof invoiceData.subtotal === 'string' ? (parseFloat(invoiceData.subtotal) || 0).toLocaleString() : '0'}
                    </span>
                  </div>
                  {(typeof invoiceData.tax === 'number' ? invoiceData.tax : parseFloat(invoiceData.tax) || 0) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (Inclusive):</span>
                      <span>-</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount:</span>
                    <span>0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Charges:</span>
                    <span>₦2,000</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Total:</span>
                    <span className="font-semibold text-lg">
                      {invoiceData.currency}
                      {(() => {
                        const baseTotal = typeof invoiceData.total === 'number' ? invoiceData.total :
                                         typeof invoiceData.total === 'string' ? (parseFloat(invoiceData.total) || 0) : 0;
                        return (baseTotal + 2000).toLocaleString();
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-gray-600 text-sm">
              <p>Thank you for your business!</p>
              <p>For any questions, please contact us at info@lagostradefair.com</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
            <button
              onClick={handlePrint}
              disabled={isGenerating}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Printer size={16} className="mr-2" />
              {isGenerating ? 'Generating...' : 'Print'}
            </button>
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Download size={16} className="mr-2" />
              {isGenerating ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal; 