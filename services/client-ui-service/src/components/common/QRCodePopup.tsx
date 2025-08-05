import React, { useState, useEffect, useRef } from 'react';
import { X, Printer, Download } from 'lucide-react';
import { generateQRCodeWithURL, QRCodeOptions } from '../../utils/qrCodeUtils';
import { printElementWithStyles, generatePDFFromElement } from '../../utils/pdfUtils';

interface QRCodePopupProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  title?: string;
  size?: number;
}

const QRCodePopup: React.FC<QRCodePopupProps> = ({
  isOpen,
  onClose,
  data,
  size = 512
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const popupContentRef = useRef<HTMLDivElement>(null);

  // Generate QR code from data
  const generateQRCode = async (jsonData: any) => {
    try {
      setIsGenerating(true);
      
      // Optimize data for QR code - remove large fields like image URLs
      const optimizedData = optimizeDataForQRCode(jsonData);
      
      const options: QRCodeOptions = {
        width: size,
        margin: 4,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'H' // High error correction for better readability
      };
      
      const dataUrl = await generateQRCodeWithURL(optimizedData, window.location.origin, options);
      setQrCodeDataUrl(dataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const optimizeDataForQRCode = (data: any) => {
    const isExhibitor = data.type === 'exhibitor' || 
                       data.userType === 'EXHIBITOR' || 
                       data.company || 
                       data.company_name ||
                       (data.user_type && data.user_type.toUpperCase() === 'EXHIBITOR');
    
    const optimized: any = {
      // Essential identification fields
      id: data._id || data.id, // This will be used to query the database
      type: isExhibitor ? 'exhibitor' : 'visitor',
      name: data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim(),
      email: data.email,
      phone: data.phone,
      
      // Event information
      event: 'LITF 2025',
      timestamp: new Date().toISOString(),
      
      // For exhibitors, include company rep ID for database lookup
      ...(isExhibitor ? {
        company: data.company || data.company_name,
        userType: 'EXHIBITOR',
        companyRepId: data.id || data._id // Include the ID for database lookup
      } : {
        userType: 'ATTENDEE'
      })
    };

    Object.keys(optimized).forEach(key => {
      if (optimized[key] === undefined || optimized[key] === null || optimized[key] === '') {
        delete optimized[key];
      }
    });

    return optimized;
  };

  useEffect(() => {
    if (data && isOpen) {
      generateQRCode(data);
    }
  }, [data, isOpen, size]);

  const handlePrint = () => {
    if (!popupContentRef.current) return;
    const title = `${data?.name || 'Pass'} - LITF 2025`;
    printElementWithStyles(popupContentRef.current, title);
  };

  const handleDownloadPDF = async () => {
    if (!popupContentRef.current) return;
    
    // Generate filename
    const sanitizedName = (data?.name || 'Pass').replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${sanitizedName}_LITF_Pass_${new Date().toISOString().split('T')[0]}.pdf`;
    
    await generatePDFFromElement(popupContentRef.current, filename, {
      onLoadingChange: setIsPdfLoading,
      onError: (error) => console.error('PDF generation error:', error),
      showCorsMessage: true
    });
  };

  if (!isOpen) return null;

  const isVisitor = data?.type === 'visitor';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 print:bg-transparent print:p-0">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[95vh] overflow-y-auto relative print:shadow-none print:rounded-none">

        <div className="absolute top-4 right-4 print:hidden flex gap-2">
          <button
            onClick={handlePrint}
            className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"
            title="Print"
          >
            <Printer size={20} />
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isPdfLoading}
            className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 disabled:opacity-50"
            title="Download PDF"
          >
            {isPdfLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
            ) : (
              <Download size={20} />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div ref={popupContentRef} className="p-6 print:p-4">
          {/* Header with Logo and Title */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <img 
                src="/images/litf_logo.png" 
                alt="LITF Logo" 
                className="h-12 w-auto print:h-10"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 print:text-xl">
              {isVisitor ? 'Visitor Pass' : 'Company Representative'}
            </h2>
            <p className="text-gray-600 print:text-sm">
              Lagos International Trade Fair 2025
            </p>
          </div>

          <div className="space-y-4">
            {/* Profile Section with Image and Details */}
            {isVisitor ? (
              // Visitor layout - no image, just details
              <div className="mb-6">
                <div className="space-y-2">
                  <div className="border-b border-gray-200 pb-2">
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{data?.name || 'N/A'}</span>
                      </div>
                      {data?.email && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium text-xs">{data.email}</span>
                        </div>
                      )}
                      {data?.phone && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium">{data.phone}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium capitalize">Visitor</span>
                      </div>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Event:</span>
                      <span className="font-medium text-xs">2025 LITF</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium text-xs">Nov 7-16, 2025</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Venue:</span>
                      <span className="font-medium text-xs">TBS, Lagos</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Exhibitor layout - with image and details
              <div className="flex items-start space-x-4 mb-6">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <img
                    src={data?.photo || data?.profilePic || 'https://via.placeholder.com/80x100?text=Photo'}
                    alt="Profile"
                    className="w-20 h-24 object-cover border-2 border-gray-300 rounded-lg print:w-16 print:h-20"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/80x100?text=Photo';
                    }}
                  />
                </div>

                {/* Pass Details */}
                <div className="flex-1 space-y-2">
                  <div className="border-b border-gray-200 pb-2">
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{data?.name || 'N/A'}</span>
                      </div>
                      {data?.company && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Company:</span>
                          <span className="font-medium">{data.company}</span>
                        </div>
                      )}
                      {data?.company_name && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 flex-shrink-0">Company Name:</span>
                          <span className="font-medium text-right break-words max-w-[60%]">{data.company_name}</span>
                        </div>
                      )}
                      {data?.email && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium text-xs">{data.email}</span>
                        </div>
                      )}
                      {data?.phone && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium">{data.phone}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium capitalize">Company Representative</span>
                      </div>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Event:</span>
                      <span className="font-medium text-xs">2025 LITF</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium text-xs">Nov 7-16, 2025</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Venue:</span>
                      <span className="font-medium text-xs">TBS, Lagos</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* QR Code */}
            <div className="flex justify-center mb-6">
              {isGenerating ? (
                <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600 mx-auto mb-2"></div>
                    <p className="text-gray-600 text-xs">Generating QR Code...</p>
                  </div>
                </div>
              ) : qrCodeDataUrl ? (
                <div className="text-center">
                  <img
                    src={qrCodeDataUrl}
                    alt="QR Code"
                    className="w-48 h-48 border border-gray-200 rounded-lg mx-auto"
                  />
                  <p className="text-xs text-gray-500 mt-2">Scan for verification</p>
                </div>
              ) : (
                <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 text-xs">QR Code not available</p>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="text-xs text-gray-500 space-y-1 border-t border-gray-200 pt-3">
              <p>• Present this QR code at the entrance for scanning</p>
              <p>• Keep this pass with you at all times during the event</p>
              <p>• This pass is non-transferable and valid for the entire event duration</p>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-400 mt-4">
              <p>Generated on {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodePopup;
