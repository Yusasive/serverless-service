import React, { useState, useEffect } from 'react';
import { 
  QrCodeIcon, 
  DocumentArrowDownIcon, 
  PrinterIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import {
  generateQRCodeDataURL,
  generateQRCodeWithURL,
  QRCodeOptions
} from '../../utils/qrCodeUtils';
import { printElementWithStyles } from '../../utils/pdfUtils';

interface QRCodeComponentProps {
  data?: any;
  title?: string;
  size?: number;
  className?: string;
  showControls?: boolean;
  showDecoder?: boolean;
  qrCodeOptions?: QRCodeOptions;
  useURL?: boolean;
  baseUrl?: string;
}

const QRCodeComponent: React.FC<QRCodeComponentProps> = ({
  data,
  title = "QR Code",
  size = 256,
  className = "",
  showControls = true,
  qrCodeOptions = {},
  useURL = true,
  baseUrl
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate QR code from JSON data
  const generateQRCode = async (jsonData: any) => {
    try {
      setIsGenerating(true);
      const options = {
        width: size,
        ...qrCodeOptions
      };
      
      let dataUrl: string;
      if (useURL) {
        dataUrl = await generateQRCodeWithURL(jsonData, baseUrl, options);
      } else {
        dataUrl = await generateQRCodeDataURL(jsonData, options);
      }
      
      setQrCodeDataUrl(dataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle PDF download using print-to-PDF
  const handleDownloadPDF = () => {
    if (!qrCodeDataUrl) return;
    // Create a temporary element with the QR code for printing
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <h2>${title}</h2>
        <img src="${qrCodeDataUrl}" alt="QR Code" style="max-width: 300px; height: auto;" />
      </div>
    `;
    printElementWithStyles(tempDiv, title);
  };

  // Handle print
  const handlePrint = () => {
    if (!qrCodeDataUrl) return;
    // Create a temporary element with the QR code for printing
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <h2>${title}</h2>
        <img src="${qrCodeDataUrl}" alt="QR Code" style="max-width: 300px; height: auto;" />
      </div>
    `;
    printElementWithStyles(tempDiv, title);
  };

  useEffect(() => {
    if (data) {
      generateQRCode(data);
    }
  }, [data, size, qrCodeOptions, useURL, baseUrl]);

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <QrCodeIcon className="w-5 h-5 mr-2" />
          {title}
        </h3>
        {showControls && (
          <div className="flex space-x-2">
            <button
              onClick={() => generateQRCode(data)}
              disabled={isGenerating || !data}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md disabled:opacity-50"
              title="Regenerate QR Code"
            >
              <ArrowPathIcon className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            </button>
          </div>
        )}
      </div>

      {/* QR Code Display */}
      <div className="flex justify-center mb-4">
        {isGenerating ? (
          <div className="flex items-center justify-center w-64 h-64 bg-gray-100 rounded-lg">
            <div className="text-center">
              <ArrowPathIcon className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-500" />
              <p className="text-gray-500">Generating QR Code...</p>
            </div>
          </div>
        ) : qrCodeDataUrl ? (
          <div className="text-center">
            <img
              src={qrCodeDataUrl}
              alt="QR Code"
              className="border border-gray-200 rounded-lg"
            />
            {showControls && (
              <div className="flex justify-center space-x-2 mt-4">
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <DocumentArrowDownIcon className="w-4 h-4 mr-1" />
                  Download PDF
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PrinterIcon className="w-4 h-4 mr-1" />
                  Print
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center w-64 h-64 bg-gray-100 rounded-lg">
            <div className="text-center text-gray-500">
              <QrCodeIcon className="w-12 h-12 mx-auto mb-2" />
              <p>No data to generate QR code</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCodeComponent; 