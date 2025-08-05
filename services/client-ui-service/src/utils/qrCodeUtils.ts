import QRCode from 'qrcode';
import jsQR from 'jsqr';

export interface QRCodeOptions {
  width?: number;
  margin?: number;
  color?: {
    dark: string;
    light: string;
  };
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

export interface DecodedData {
  success: boolean;
  data?: any;
  error?: string;
}

export interface PDFOptions {
  title?: string;
  imgWidth?: number;
  imgHeight?: number;
  filename?: string;
}

/**
 * Generate QR code data URL from JSON data
 */
export const generateQRCodeDataURL = async (
  data: any, 
  options: QRCodeOptions = {}
): Promise<string> => {
  const defaultOptions: QRCodeOptions = {
    width: 256,
    margin: 4,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    errorCorrectionLevel: 'H',
    ...options
  };

  const jsonString = JSON.stringify(data);
  return await QRCode.toDataURL(jsonString, defaultOptions);
};

/**
 * Generate QR code with URL that points to the display page
 */
export const generateQRCodeWithURL = async (
  data: any,
  baseUrl: string = window.location.origin,
  options: QRCodeOptions = {}
): Promise<string> => {
  const defaultOptions: QRCodeOptions = {
    width: 256,
    margin: 4,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    errorCorrectionLevel: 'H',
    ...options
  };

  // Encode the data as URL parameter
  const encodedData = encodeURIComponent(JSON.stringify(data));
  const url = `${baseUrl}/qr?data=${encodedData}`;
  
  return await QRCode.toDataURL(url, defaultOptions);
};

/**
 * Decode QR code from image file
 */
export const decodeQRCodeFromFile = async (file: File): Promise<DecodedData> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      try {
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (imageData) {
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          
          if (code) {
            try {
              // Try to parse as JSON
              const parsedData = JSON.parse(code.data);
              resolve({
                success: true,
                data: parsedData
              });
            } catch (parseError) {
              // If not JSON, return as plain text
              resolve({
                success: true,
                data: { text: code.data }
              });
            }
          } else {
            resolve({
              success: false,
              error: "No QR code found in the image"
            });
          }
        } else {
          resolve({
            success: false,
            error: "Could not read image data"
          });
        }
      } catch (error) {
        resolve({
          success: false,
          error: "Failed to decode QR code"
        });
      }
    };

    img.onerror = () => {
      resolve({
        success: false,
        error: "Failed to load image"
      });
    };

    img.src = URL.createObjectURL(file);
  });
};



/**
 * Validate JSON string
 */
export const isValidJSON = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Format JSON data for display
 */
export const formatJSONForDisplay = (data: any): string => {
  try {
    return JSON.stringify(data, null, 2);
  } catch (error) {
    return String(data);
  }
};

/**
 * Generate a unique filename for QR code downloads
 */
export const generateQRCodeFilename = (title: string, extension: string = 'pdf'): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, '_');
  return `${sanitizedTitle}_QRCode_${timestamp}.${extension}`;
}; 