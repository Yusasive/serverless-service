/**
 * Utility functions for handling logo images in PDF generation
 */

/**
 * Convert an image URL to base64 for use in PDF
 */
export const convertImageToBase64 = (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Enable CORS for external images
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx.drawImage(img, 0, 0);
        
        // Convert to base64
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageUrl;
  });
};

/**
 * Preload logo image and return base64 data
 */
export const preloadLogo = async (logoPath: string): Promise<string | null> => {
  try {
    const base64Data = await convertImageToBase64(logoPath);
    return base64Data;
  } catch (error) {
    console.warn('Failed to preload logo:', error);
    return null;
  }
};

/**
 * Get the default LITF logo path
 */
export const getDefaultLogoPath = (): string => {
  return '/images/litf_logo.png';
}; 